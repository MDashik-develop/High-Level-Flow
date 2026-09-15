<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\IntegrationSetting;
use App\Models\Opportunity;
use App\Models\Pipeline;
use App\Models\WebsiteAudit;
use App\Services\IntegrationManagerService;
use App\Services\WebsiteCrawlerService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WebsiteAuditController extends Controller
{
    public function index(): Response
    {
        $audits = WebsiteAudit::with('convertedContact')->latest()->paginate(10);

        return Inertia::render('WebsiteCrawler/Index', [
            'audits' => $audits,
        ]);
    }

    public function show(WebsiteAudit $audit, WebsiteCrawlerService $crawlerService): Response
    {
        $audit->load('convertedContact');

        // Upgrade to 2026 Deep Niche Intelligence if missing tools are few or pitch is older format
        if (empty($audit->redesign_data) || count($audit->missing_tools ?? []) < 8 || ! str_contains($audit->generated_pitch ?? '', 'HERE IS THE EXACT 2026 AUTOMATED SOLUTION')) {
            $deepData = $crawlerService->generateDeep2026NicheAudit($audit);
            $company = $audit->company_name ?: $audit->domain;
            $masterPitch = $crawlerService->generateTailoredPitch(
                $company,
                $audit->domain,
                $deepData['missing_tools'],
                $audit->services ?? [],
                $audit->meta_description ?? ''
            );

            $raw = [
                'metadata' => [
                    'target_url' => $audit->url,
                    'resolved_domain' => $audit->domain,
                    'company_name' => $company,
                    'page_title' => $audit->title,
                    'meta_description' => $audit->meta_description,
                    'scraped_at' => $audit->created_at?->toIso8601String() ?? now()->toIso8601String(),
                    'ai_audited_at' => now()->toIso8601String(),
                    'audit_score' => $deepData['redesign_data']['modernization_score'] ?? 89,
                ],
                'dom_elements' => [
                    'services' => $audit->services ?? [],
                    'total_services_extracted' => count($audit->services ?? []),
                ],
                'contact_intelligence' => $audit->contact_info ?? [],
                'detected_tech_stack' => $audit->tech_stack ?? [],
                'identified_conversion_gaps' => $deepData['missing_tools'],
                'agency_growth_blueprint' => $deepData['redesign_data'],
                'master_cold_pitch' => $masterPitch,
                'export_format' => 'HighLevel Flow v2.0 Client Intelligence Array',
            ];

            $audit->update([
                'missing_tools' => $deepData['missing_tools'],
                'redesign_data' => $deepData['redesign_data'],
                'raw_data' => $raw,
                'generated_pitch' => $masterPitch,
                'audit_score' => $deepData['redesign_data']['modernization_score'] ?? 89,
            ]);
        }

        $activeAiServices = IntegrationSetting::whereIn('provider', ['huggingface', 'openai'])
            ->where('is_active', true)
            ->get(['provider', 'name', 'is_active', 'is_sandbox', 'credentials']);

        return Inertia::render('WebsiteCrawler/Show', [
            'audit' => $audit,
            'activeAiServices' => $activeAiServices,
        ]);
    }

    public function crawl(Request $request, WebsiteCrawlerService $crawler)
    {
        $validated = $request->validate([
            'url' => 'required|string|max:255',
        ]);

        $auditData = $crawler->crawl($validated['url']);

        $audit = WebsiteAudit::create($auditData);

        return redirect()->route('crawler.show', $audit->id)->with('success', 'Website audit & intelligence completed!');
    }

    public function convertToLead(Request $request, WebsiteAudit $audit)
    {
        if ($audit->converted_contact_id) {
            return redirect()->back()->with('info', 'This audit has already been converted to a CRM lead.');
        }

        $email = $audit->contact_info['emails'][0] ?? null;
        $phone = $audit->contact_info['phones'][0] ?? null;

        $contact = Contact::create([
            'first_name' => $audit->company_name ?? $audit->domain,
            'last_name' => 'Lead',
            'email' => $email,
            'phone' => $phone,
            'company' => $audit->company_name ?? $audit->domain,
            'status' => 'hot_prospect',
            'lead_score' => $audit->audit_score >= 70 ? 45 : 75, // Lower audit score = higher need = hotter lead!
            'notes' => "Discovered via Website Crawler.\nMissing: ".implode(', ', array_column($audit->missing_tools ?? [], 'tool')),
            'custom_fields' => [
                'crawled_url' => $audit->url,
                'audit_score' => $audit->audit_score,
                'services_detected' => $audit->services,
            ],
        ]);

        // Create initial Opportunity deal in default pipeline
        $pipeline = Pipeline::where('is_default', true)->first() ?? Pipeline::first();
        if ($pipeline) {
            $stage = $pipeline->stages()->first();
            if ($stage) {
                Opportunity::create([
                    'pipeline_id' => $pipeline->id,
                    'pipeline_stage_id' => $stage->id,
                    'contact_id' => $contact->id,
                    'title' => "Funnel & Automation Setup for {$contact->company}",
                    'monetary_value' => 1500.00,
                    'status' => 'open',
                    'priority' => 'high',
                    'notes' => "Pitch ready:\n\n".$audit->generated_pitch,
                ]);
            }
        }

        $audit->update(['converted_contact_id' => $contact->id]);

        return redirect()->route('contacts.index', ['search' => $contact->company])
            ->with('success', "Audit converted into new Lead & Deal for {$contact->company}!");
    }

    public function generateAiPitch(Request $request, WebsiteAudit $audit, IntegrationManagerService $aiService, WebsiteCrawlerService $crawlerService)
    {
        $provider = $request->input('provider'); // 'huggingface' or 'openai' or null
        $customInstruction = trim((string) $request->input('custom_instruction', ''));

        $servicesList = implode(', ', $audit->services ?? ['core business services']);
        $gapsList = implode('; ', array_map(fn ($g) => ($g['tool'] ?? '').': '.($g['description'] ?? ''), $audit->missing_tools ?? []));
        $metaContext = $audit->meta_description ? "Description/Location: {$audit->meta_description}" : '';

        $prompt = "Write an elite, high-converting B2B cold outreach email pitch tailored specifically to this business.\n\n"
            ."TARGET COMPANY DETAILS:\n"
            ."• Company: {$audit->company_name}\n"
            ."• Website: {$audit->domain}\n"
            ."• Core Services Detected: {$servicesList}\n"
            .($metaContext ? "• {$metaContext}\n" : '')
            ."• Conversion Gaps Detected: {$gapsList}\n\n"
            ."MANDATORY REQUIREMENTS:\n"
            ."1. Detail ALL specific customer conversion bottlenecks & issues detected on their website with explanations of lost customer momentum.\n"
            ."2. For every bottleneck, present the exact modern 2026 solution & missing new features (24/7 AI Voice/SMS concierge, 1-click WhatsApp photo quote launcher, 60-second SMS speed-to-lead, real-time booking calendar with deposits, Google review harvester).\n"
            ."3. Highlight zero-risk agency delivery: deployed in under 48 hours without changing or touching their existing website design.\n"
            ."4. Low-friction Call to Action (e.g. 3-minute video preview demo ask).\n"
            ."5. End with a ready-to-paste short SMS / WhatsApp outreach script.\n"
            .($customInstruction ? "SPECIAL USER INSTRUCTIONS (PRIORITIZE THESE):\n{$customInstruction}\n\n" : '')
            .'Tone: Authoritative, elite direct-response agency copywriter.';

        $context = [
            'company' => $audit->company_name ?: $audit->domain,
            'domain' => $audit->domain,
            'services' => $audit->services ?? [],
            'gaps' => $audit->missing_tools ?? [],
            'custom_instruction' => $customInstruction,
            'meta_description' => $audit->meta_description,
        ];

        $result = $aiService->generateAiCompletion(
            $prompt,
            'You are an elite B2B sales automation agency founder and master direct-response copywriter.',
            $provider,
            $context
        );

        if (empty($result['success'])) {
            return redirect()->back()->with('error', $result['content'] ?? 'AI service is currently turned OFF in Settings.');
        }

        $audit->update([
            'generated_pitch' => $result['content'],
        ]);

        $modelName = $result['model'] ?? 'AI Engine';
        if (! empty($result['notice'])) {
            session()->flash('ai_notice', $result['notice']);
        }

        return redirect()->back()->with('success', "Cold pitch rewritten using {$result['provider']} ({$modelName})!");
    }

    public function destroy(WebsiteAudit $audit)
    {
        $domain = $audit->domain;
        $audit->delete();

        return redirect()->route('crawler.index')->with('success', "Website audit for {$domain} deleted successfully.");
    }

    public function bulkDestroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:website_audits,id',
        ]);

        $count = WebsiteAudit::whereIn('id', $validated['ids'])->delete();

        return redirect()->route('crawler.index')->with('success', "Successfully deleted {$count} website audit record(s).");
    }

    public function runAiAudit(Request $request, WebsiteAudit $audit, IntegrationManagerService $aiService, WebsiteCrawlerService $crawlerService)
    {
        $provider = $request->input('provider'); // 'huggingface' or 'openai' or null
        $company = $audit->company_name ?: $audit->domain;
        $servicesList = implode(', ', $audit->services ?? ['core business services']);

        // 1. Generate deep niche 2026 intelligence based on real website data & services
        $deepData = $crawlerService->generateDeep2026NicheAudit($audit);

        $prompt = "You are an elite 2026 conversion rate optimization and B2B sales automation expert.\n"
            ."Perform a specialized 2026 Deep Agency Audit for this target business:\n"
            ."Company: {$company}\n"
            ."Domain: {$audit->domain}\n"
            ."Core Services: {$servicesList}\n"
            ."Meta Description: {$audit->meta_description}\n\n"
            ."Generate tailored 2026 agency recommendations in JSON format:\n"
            ."{\n"
            .'  "summary": "Concise 2-sentence executive summary of why their current website leaks revenue in 2026.",'."\n"
            .'  "modernization_score": 89,'."\n"
            .'  "critique_points": ["Point 1", "Point 2", "Point 3", "Point 4", "Point 5"],'."\n"
            .'  "recommended_additions": ["Addition 1", "Addition 2", "Addition 3", "Addition 4", "Addition 5", "Addition 6", "Addition 7", "Addition 8"],'."\n"
            .'  "funnel_blueprint": ['."\n"
            .'    {"step": "Step 1: ...", "action": "..."},'."\n"
            .'    {"step": "Step 2: ...", "action": "..."},'."\n"
            .'    {"step": "Step 3: ...", "action": "..."},'."\n"
            .'    {"step": "Step 4: ...", "action": "..."}'."\n"
            .'  ],'."\n"
            .'  "additional_gaps": ['."\n"
            .'    {"tool": "Tool Name", "impact": "High", "description": "Why they lose money without it"}'."\n"
            .'  ]'."\n"
            ."}\n"
            .'Output JSON only.';

        $context = [
            'company' => $company,
            'domain' => $audit->domain,
            'services' => $audit->services ?? [],
            'gaps' => $deepData['missing_tools'],
            'custom_instruction' => 'Generate 2026 niche audit and funnel strategy',
        ];

        $result = $aiService->generateAiCompletion(
            $prompt,
            'You are an elite B2B conversion rate optimization and agency automation expert. Output valid JSON only.',
            $provider,
            $context
        );

        $parsed = null;
        if (! empty($result['content'])) {
            if (preg_match('/\{[\s\S]*\}/', $result['content'], $match)) {
                $parsed = json_decode($match[0], true);
            }
        }

        $finalRedesign = $deepData['redesign_data'];
        $finalGaps = $deepData['missing_tools'];

        if ($parsed && ! empty($parsed['recommended_additions'])) {
            $finalRedesign['summary'] = $parsed['summary'] ?? $finalRedesign['summary'];
            $finalRedesign['modernization_score'] = $parsed['modernization_score'] ?? $finalRedesign['modernization_score'];
            if (! empty($parsed['critique_points']) && is_array($parsed['critique_points'])) {
                $finalRedesign['critique_points'] = array_values(array_unique(array_merge($parsed['critique_points'], $finalRedesign['critique_points'])));
            }
            if (! empty($parsed['recommended_additions']) && is_array($parsed['recommended_additions'])) {
                $finalRedesign['recommended_additions'] = array_values(array_unique(array_merge($parsed['recommended_additions'], $finalRedesign['recommended_additions'])));
            }
            if (! empty($parsed['funnel_blueprint']) && is_array($parsed['funnel_blueprint']) && count($parsed['funnel_blueprint']) >= 4) {
                $finalRedesign['funnel_blueprint'] = $parsed['funnel_blueprint'];
            }
            if (! empty($parsed['additional_gaps']) && is_array($parsed['additional_gaps'])) {
                foreach ($parsed['additional_gaps'] as $ag) {
                    if (! empty($ag['tool']) && ! in_array($ag['tool'], array_column($finalGaps, 'tool'))) {
                        $finalGaps[] = $ag;
                    }
                }
            }
        }

        // Regenerate master pitch reflecting all updated gaps and solutions
        $freshPitch = $crawlerService->generateTailoredPitch(
            $company,
            $audit->domain,
            $finalGaps,
            $audit->services ?? [],
            $audit->meta_description ?? ''
        );

        // Update full raw intelligence object
        $raw = [
            'metadata' => [
                'target_url' => $audit->url,
                'resolved_domain' => $audit->domain,
                'company_name' => $company,
                'page_title' => $audit->title,
                'meta_description' => $audit->meta_description,
                'scraped_at' => $audit->created_at?->toIso8601String() ?? now()->toIso8601String(),
                'ai_audited_at' => now()->toIso8601String(),
                'audit_score' => $finalRedesign['modernization_score'] ?? 89,
            ],
            'dom_elements' => [
                'services' => $audit->services ?? [],
                'total_services_extracted' => count($audit->services ?? []),
            ],
            'contact_intelligence' => $audit->contact_info ?? [],
            'detected_tech_stack' => $audit->tech_stack ?? [],
            'identified_conversion_gaps' => $finalGaps,
            'agency_growth_blueprint' => $finalRedesign,
            'master_cold_pitch' => $freshPitch,
            'export_format' => 'HighLevel Flow v2.0 Client Intelligence Array',
        ];

        $audit->update([
            'missing_tools' => $finalGaps,
            'redesign_data' => $finalRedesign,
            'raw_data' => $raw,
            'generated_pitch' => $freshPitch,
            'audit_score' => $finalRedesign['modernization_score'] ?? 89,
        ]);

        if (! empty($result['notice'])) {
            session()->flash('ai_notice', $result['notice']);
        }

        return redirect()->back()->with(
            'success',
            "2026 Deep AI Audit completed for {$company}! Real data updated across Website Gaps, Additions, and Redesign Blueprint."
        );
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\Opportunity;
use App\Models\Pipeline;
use App\Models\WebsiteAudit;
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

    public function show(WebsiteAudit $audit): Response
    {
        $audit->load('convertedContact');

        return Inertia::render('WebsiteCrawler/Show', [
            'audit' => $audit,
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
            'notes' => "Discovered via Website Crawler.\nMissing: " . implode(', ', array_column($audit->missing_tools ?? [], 'tool')),
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
                    'notes' => "Pitch ready:\n\n" . $audit->generated_pitch,
                ]);
            }
        }

        $audit->update(['converted_contact_id' => $contact->id]);

        return redirect()->route('contacts.index', ['search' => $contact->company])
            ->with('success', "Audit converted into new Lead & Deal for {$contact->company}!");
    }
}

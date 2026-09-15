<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\IntegrationSetting;
use App\Models\WebsiteAudit;
use App\Services\IntegrationManagerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AiApiController extends Controller
{
    /**
     * Direct 200 OK JSON API Endpoint for AI Connection Testing
     * (NO 302 or 303 Redirects!)
     */
    public function testConnection(Request $request, IntegrationManagerService $service): JsonResponse
    {
        $provider = $request->input('provider', 'huggingface');
        $token = $request->input('token');
        $model = $request->input('model');

        $setting = IntegrationSetting::where('provider', $provider)->first();

        // If credentials passed directly from frontend, update DB setting first
        if ($setting && $token) {
            $creds = $setting->credentials ?? [];
            $creds['api_token'] = $token;
            if ($model) {
                $creds['model'] = $model;
            }
            $setting->update([
                'credentials' => $creds,
                'is_sandbox' => false,
                'is_active' => true,
            ]);
        }

        $result = $service->testConnection($provider);

        return response()->json([
            'status' => 200,
            'success' => !empty($result['success']),
            'message' => $result['message'] ?? 'Connection test completed.',
            'provider' => $provider,
            'is_sandbox' => $setting->is_sandbox ?? true,
        ], 200);
    }

    /**
     * Direct 200 OK JSON API Endpoint for Generative Pitch & Text Generation
     */
    public function generatePitch(Request $request, IntegrationManagerService $service): JsonResponse
    {
        $auditId = $request->input('audit_id');
        $audit = $auditId ? WebsiteAudit::find($auditId) : null;

        $provider = $request->input('provider', 'huggingface');
        $customInstruction = trim((string) $request->input('custom_instruction', ''));

        $company = $audit->company_name ?? $request->input('company', 'your business');
        $domain = $audit->domain ?? $request->input('domain', 'your website');
        $servicesList = implode(', ', $audit->services ?? ['core business services']);
        $gapsList = implode('; ', array_map(fn ($g) => ($g['tool'] ?? '').': '.($g['description'] ?? ''), $audit->missing_tools ?? []));

        $prompt = "Write an elite, high-converting B2B cold outreach email pitch for {$company} ({$domain}).\n"
            ."Core Services: {$servicesList}\n"
            ."Bottlenecks: {$gapsList}\n"
            .($customInstruction ? "Custom Instructions: {$customInstruction}\n" : "");

        $context = [
            'company' => $company,
            'domain' => $domain,
            'services' => $audit->services ?? [],
            'gaps' => $audit->missing_tools ?? [],
            'custom_instruction' => $customInstruction,
        ];

        $result = $service->generateAiCompletion($prompt, 'You are an elite B2B sales copywriter.', $provider, $context);

        if (!empty($result['content']) && $audit) {
            $audit->update(['generated_pitch' => $result['content']]);
        }

        return response()->json([
            'status' => 200,
            'success' => !empty($result['success']),
            'content' => $result['content'] ?? '',
            'provider' => $result['provider'] ?? $provider,
            'model' => $result['model'] ?? 'AI Engine',
            'is_sandbox' => $result['is_sandbox'] ?? false,
            'notice' => $result['notice'] ?? null,
        ], 200);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\IntegrationSetting;
use App\Services\IntegrationManagerService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IntegrationController extends Controller
{
    public function index(): Response
    {
        $providers = ['twilio', 'resend', 'stripe', 'openai', 'huggingface', 'calendly'];

        // Ensure defaults exist
        foreach ($providers as $provider) {
            IntegrationSetting::firstOrCreate(
                ['provider' => $provider],
                [
                    'name' => match ($provider) {
                        'huggingface' => 'Hugging Face AI (Open Source LLMs)',
                        'openai' => 'OpenAI AI Assistant',
                        default => ucfirst($provider),
                    },
                    'category' => match ($provider) {
                        'twilio' => 'sms',
                        'resend' => 'marketing',
                        'stripe' => 'payment',
                        'openai' => 'ai',
                        'huggingface' => 'ai',
                        'calendly' => 'calendar',
                        default => 'marketing',
                    },
                    'is_active' => true,
                    'is_sandbox' => true,
                    'credentials' => match ($provider) {
                        'huggingface' => [
                            'api_token' => '',
                            'model' => 'meta-llama/Meta-Llama-3-8B-Instruct',
                        ],
                        default => [],
                    },
                ]
            );
        }

        $settings = IntegrationSetting::all();

        return Inertia::render('Settings/Integrations', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request, IntegrationSetting $setting)
    {
        $validated = $request->validate([
            'is_active' => 'required|boolean',
            'is_sandbox' => 'required|boolean',
            'credentials' => 'nullable|array',
        ]);

        $setting->update([
            'is_active' => $validated['is_active'],
            'is_sandbox' => $validated['is_sandbox'],
            'credentials' => $validated['credentials'] ?? [],
        ]);

        return redirect()->back()->with('success', "{$setting->name} settings updated successfully.");
    }

    public function testConnection(Request $request, IntegrationSetting $setting, IntegrationManagerService $service)
    {
        $result = $service->testConnection($setting->provider);

        if ($result['success']) {
            return redirect()->back()->with('success', $result['message']);
        }

        return redirect()->back()->with('error', $result['message'] ?? 'Connection test failed.');
    }

    public function toggleActive(Request $request, IntegrationSetting $setting)
    {
        $newState = ! $setting->is_active;
        $setting->update(['is_active' => $newState]);

        $statusText = $newState ? 'turned ON (Active)' : 'turned OFF (Disabled)';

        return redirect()->back()->with('success', "{$setting->name} is now {$statusText}.");
    }
}

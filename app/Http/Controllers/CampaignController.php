<?php

namespace App\Http\Controllers;

use App\Jobs\CampaignDispatchJob;
use App\Models\Campaign;
use App\Models\Contact;
use App\Models\IntegrationSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CampaignController extends Controller
{
    public function index(): Response
    {
        $campaigns = Campaign::latest()->paginate(10);
        $contactsCount = Contact::count();

        return Inertia::render('Campaigns/Index', [
            'campaigns' => $campaigns,
            'contactsCount' => $contactsCount,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'type' => 'required|in:email,sms',
            'subject' => 'nullable|string|max:200',
            'content' => 'required|string',
            'dispatch_now' => 'nullable|boolean',
        ]);

        $campaign = Campaign::create([
            'name' => $validated['name'],
            'type' => $validated['type'],
            'subject' => $validated['subject'] ?? null,
            'content' => $validated['content'],
            'status' => 'draft',
            'total_recipients' => Contact::count(),
        ]);

        if (! empty($validated['dispatch_now'])) {
            $serviceName = $campaign->type === 'email' ? 'resend' : 'twilio';
            $setting = IntegrationSetting::where('provider', $serviceName)->first();
            if ($setting && ! $setting->is_active) {
                return redirect()->back()->with('error', 'Cannot dispatch: '.ucfirst($serviceName).' service is currently turned OFF in Settings > API Integrations.');
            }

            CampaignDispatchJob::dispatchSync($campaign);

            return redirect()->back()->with('success', 'Marketing campaign broadcasted successfully!');
        }

        return redirect()->back()->with('success', 'Campaign saved as draft.');
    }

    public function dispatchNow(Campaign $campaign)
    {
        $serviceName = $campaign->type === 'email' ? 'resend' : 'twilio';
        $setting = IntegrationSetting::where('provider', $serviceName)->first();
        if ($setting && ! $setting->is_active) {
            return redirect()->back()->with('error', 'Cannot dispatch: '.ucfirst($serviceName).' service is currently turned OFF in Settings > API Integrations.');
        }

        CampaignDispatchJob::dispatchSync($campaign);

        return redirect()->back()->with('success', "Campaign {$campaign->name} dispatched to audience.");
    }
}

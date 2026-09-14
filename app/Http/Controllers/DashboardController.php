<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\Contact;
use App\Models\Funnel;
use App\Models\Opportunity;
use App\Models\WebsiteAudit;
use App\Models\Workflow;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $totalContacts = Contact::count();
        $hotLeads = Contact::where('lead_score', '>=', 50)->count();
        
        $openOpportunities = Opportunity::where('status', 'open')->get();
        $pipelineValue = $openOpportunities->sum('monetary_value');
        $wonDeals = Opportunity::where('status', 'won')->count();
        $totalDeals = Opportunity::count();
        $winRate = $totalDeals > 0 ? round(($wonDeals / $totalDeals) * 100, 1) : 0;

        $totalFunnelVisitors = Funnel::sum('total_visitors');
        $totalFunnelOptins = Funnel::sum('total_optins');
        $totalRevenue = Funnel::sum('total_revenue') + Opportunity::where('status', 'won')->sum('monetary_value');

        $recentContacts = Contact::with('tags')->latest()->take(5)->get();
        $recentAudits = WebsiteAudit::latest()->take(4)->get();
        $activeWorkflows = Workflow::where('status', 'active')->count();
        $recentCampaigns = Campaign::latest()->take(3)->get();

        return Inertia::render('Dashboard', [
            'metrics' => [
                'total_contacts' => $totalContacts,
                'hot_leads' => $hotLeads,
                'pipeline_value' => $pipelineValue,
                'win_rate' => $winRate,
                'funnel_visitors' => $totalFunnelVisitors,
                'funnel_optins' => $totalFunnelOptins,
                'total_revenue' => $totalRevenue,
                'active_workflows' => $activeWorkflows,
            ],
            'recent_contacts' => $recentContacts,
            'recent_audits' => $recentAudits,
            'recent_campaigns' => $recentCampaigns,
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Funnel;
use App\Models\FunnelStep;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class FunnelController extends Controller
{
    public function index(): Response
    {
        $funnels = Funnel::with('steps')->latest()->get();

        return Inertia::render('Funnels/Index', [
            'funnels' => $funnels,
        ]);
    }

    public function show(Funnel $funnel): Response
    {
        $funnel->load('steps');

        return Inertia::render('Funnels/Show', [
            'funnel' => $funnel,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'description' => 'nullable|string',
        ]);

        $funnel = Funnel::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']) . '-' . Str::random(5),
            'description' => $validated['description'] ?? null,
            'status' => 'active',
            'total_visitors' => 0,
            'total_optins' => 0,
            'total_revenue' => 0,
        ]);

        // Default standard 3-step high-converting funnel
        $funnel->steps()->createMany([
            [
                'step_number' => 1,
                'name' => 'Lead Opt-In & Free Audit',
                'step_type' => 'optin',
                'path' => '/optin',
                'page_elements' => [
                    'headline' => 'Scale Your Local Agency With High-Converting Systems',
                    'subheadline' => 'Get our free automated client acquisition blueprint',
                    'cta_button' => 'Claim Free Blueprint Now',
                ],
            ],
            [
                'step_number' => 2,
                'name' => 'Core Offer Presentation & Checkout',
                'step_type' => 'checkout',
                'path' => '/checkout',
                'page_elements' => [
                    'headline' => 'Ready To Automate Your Agency Operations?',
                    'subheadline' => 'Unlock complete CRM, Funnel Builder & AI Audit Tools',
                    'price' => '$297 / month',
                ],
            ],
            [
                'step_number' => 3,
                'name' => 'Order Confirmation & Thank You',
                'step_type' => 'thankyou',
                'path' => '/thank-you',
                'page_elements' => [
                    'headline' => 'Welcome to the Inner Circle!',
                    'subheadline' => 'Check your inbox for onboarding credentials and instant access.',
                ],
            ],
        ]);

        return redirect()->route('funnels.show', $funnel->id)->with('success', 'Funnel created.');
    }

    public function updateStep(Request $request, FunnelStep $step)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'step_type' => 'required|string',
            'path' => 'required|string',
            'page_elements' => 'nullable|array',
        ]);

        $step->update($validated);

        return redirect()->back()->with('success', 'Funnel step updated.');
    }

    public function addStep(Request $request, Funnel $funnel)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'step_type' => 'required|string',
            'path' => 'required|string',
        ]);

        $maxStep = $funnel->steps()->max('step_number') ?? 0;

        $funnel->steps()->create([
            'step_number' => $maxStep + 1,
            'name' => $validated['name'],
            'step_type' => $validated['step_type'],
            'path' => $validated['path'],
            'page_elements' => [
                'headline' => $validated['name'],
                'subheadline' => 'Customized step page content.',
            ],
        ]);

        return redirect()->back()->with('success', 'Step added to funnel.');
    }

    public function grapesBuilder(Funnel $funnel, FunnelStep $step): Response
    {
        return Inertia::render('Funnels/GrapesBuilder', [
            'funnel' => $funnel,
            'step' => $step,
        ]);
    }

    public function saveGrapesContent(Request $request, Funnel $funnel, FunnelStep $step)
    {
        $validated = $request->validate([
            'html' => 'required|string',
            'css' => 'nullable|string',
            'components' => 'nullable',
            'styles' => 'nullable',
        ]);

        $pageElements = $step->page_elements ?? [];
        $pageElements['grapes_html'] = $validated['html'];
        $pageElements['grapes_css'] = $validated['css'] ?? '';
        $pageElements['grapes_components'] = $validated['components'] ?? null;
        $pageElements['grapes_styles'] = $validated['styles'] ?? null;

        $step->update(['page_elements' => $pageElements]);

        if ($request->wantsJson() || !$request->header('X-Inertia')) {
            return response()->json(['success' => true, 'message' => 'Page design saved via GrapesJS!']);
        }

        return redirect()->back()->with('success', 'Page design saved via GrapesJS!');
    }
}

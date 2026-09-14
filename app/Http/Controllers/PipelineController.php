<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\Opportunity;
use App\Models\Pipeline;
use App\Models\PipelineStage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PipelineController extends Controller
{
    public function index(Request $request): Response
    {
        $pipelines = Pipeline::with(['stages.opportunities.contact'])->get();
        $activePipeline = null;

        if ($pipelineId = $request->input('pipeline_id')) {
            $activePipeline = $pipelines->firstWhere('id', $pipelineId);
        }

        if (!$activePipeline && $pipelines->isNotEmpty()) {
            $activePipeline = $pipelines->firstWhere('is_default', true) ?? $pipelines->first();
        }

        $contacts = Contact::select(['id', 'first_name', 'last_name', 'company'])->get();

        return Inertia::render('Pipelines/Index', [
            'pipelines' => $pipelines,
            'activePipeline' => $activePipeline,
            'contacts' => $contacts,
        ]);
    }

    public function storeStage(Request $request, Pipeline $pipeline)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'color' => 'nullable|string',
        ]);

        $maxPos = $pipeline->stages()->max('position') ?? 0;

        $pipeline->stages()->create([
            'name' => $validated['name'],
            'color' => $validated['color'] ?? '#3b82f6',
            'position' => $maxPos + 1,
        ]);

        return redirect()->back()->with('success', 'Pipeline stage added.');
    }

    public function moveOpportunity(Request $request, Opportunity $opportunity)
    {
        $validated = $request->validate([
            'stage_id' => 'required|exists:pipeline_stages,id',
            'status' => 'nullable|string',
        ]);

        $opportunity->update([
            'pipeline_stage_id' => $validated['stage_id'],
            'status' => $validated['status'] ?? $opportunity->status,
        ]);

        return redirect()->back()->with('success', 'Deal moved successfully.');
    }

    public function storeOpportunity(Request $request)
    {
        $validated = $request->validate([
            'pipeline_id' => 'required|exists:pipelines,id',
            'pipeline_stage_id' => 'required|exists:pipeline_stages,id',
            'contact_id' => 'nullable|exists:contacts,id',
            'title' => 'required|string|max:200',
            'monetary_value' => 'nullable|numeric|min:0',
            'status' => 'nullable|string',
            'priority' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        Opportunity::create([
            'pipeline_id' => $validated['pipeline_id'],
            'pipeline_stage_id' => $validated['pipeline_stage_id'],
            'contact_id' => $validated['contact_id'] ?? null,
            'title' => $validated['title'],
            'monetary_value' => $validated['monetary_value'] ?? 0,
            'status' => $validated['status'] ?? 'open',
            'priority' => $validated['priority'] ?? 'medium',
            'notes' => $validated['notes'] ?? null,
        ]);

        return redirect()->back()->with('success', 'Deal created.');
    }

    public function destroyOpportunity(Opportunity $opportunity)
    {
        $opportunity->delete();
        return redirect()->back()->with('success', 'Deal removed.');
    }
}

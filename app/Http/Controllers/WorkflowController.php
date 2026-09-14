<?php

namespace App\Http\Controllers;

use App\Jobs\ExecuteWorkflowJob;
use App\Models\Contact;
use App\Models\Workflow;
use App\Models\WorkflowEdge;
use App\Models\WorkflowNode;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WorkflowController extends Controller
{
    public function index(): Response
    {
        $workflows = Workflow::withCount(['nodes', 'executions'])->latest()->get();

        return Inertia::render('Workflows/Index', [
            'workflows' => $workflows,
        ]);
    }

    public function show(Workflow $workflow): Response
    {
        $workflow->load(['nodes', 'edges', 'executions.contact']);
        $contacts = Contact::select(['id', 'first_name', 'last_name', 'email', 'phone'])->get();

        return Inertia::render('Workflows/Builder', [
            'workflow' => $workflow,
            'contacts' => $contacts,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'description' => 'nullable|string',
            'trigger_type' => 'nullable|string',
        ]);

        $workflow = Workflow::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'trigger_type' => $validated['trigger_type'] ?? 'form_submitted',
            'status' => 'active',
        ]);

        // Create default starter node graph
        $triggerNode = $workflow->nodes()->create([
            'node_key' => 'node_trigger',
            'node_type' => 'trigger',
            'title' => 'Form Submitted (Opt-In)',
            'position_x' => 250,
            'position_y' => 50,
            'config' => ['form_name' => 'Default Opt-in Form'],
        ]);

        $smsNode = $workflow->nodes()->create([
            'node_key' => 'node_sms',
            'node_type' => 'action_sms',
            'title' => 'Instant 2-Way SMS',
            'position_x' => 250,
            'position_y' => 220,
            'config' => ['body' => 'Hey {{contact.first_name}}, thanks for requesting info! When is a good time for a quick 5-min intro call?'],
        ]);

        $emailNode = $workflow->nodes()->create([
            'node_key' => 'node_email',
            'node_type' => 'action_email',
            'title' => 'Welcome Email + Blueprint',
            'position_x' => 250,
            'position_y' => 400,
            'config' => [
                'subject' => 'Your Agency Growth Blueprint is inside!',
                'body' => 'Thank you for reaching out! Here is the free guide and link to book your consultation.',
            ],
        ]);

        // Edges
        $workflow->edges()->createMany([
            [
                'edge_key' => 'edge_1',
                'source_node_key' => 'node_trigger',
                'target_node_key' => 'node_sms',
            ],
            [
                'edge_key' => 'edge_2',
                'source_node_key' => 'node_sms',
                'target_node_key' => 'node_email',
            ],
        ]);

        return redirect()->route('workflows.show', $workflow->id)->with('success', 'Workflow automation created.');
    }

    public function saveGraph(Request $request, Workflow $workflow)
    {
        $validated = $request->validate([
            'nodes' => 'required|array',
            'edges' => 'required|array',
        ]);

        // Sync nodes
        $existingNodeKeys = [];
        foreach ($validated['nodes'] as $n) {
            $nodeKey = $n['id'] ?? $n['node_key'];
            $existingNodeKeys[] = $nodeKey;

            WorkflowNode::updateOrCreate(
                [
                    'workflow_id' => $workflow->id,
                    'node_key' => $nodeKey,
                ],
                [
                    'node_type' => $n['data']['type'] ?? $n['node_type'] ?? 'action_email',
                    'title' => $n['data']['title'] ?? $n['title'] ?? 'Workflow Step',
                    'position_x' => $n['position']['x'] ?? $n['position_x'] ?? 250,
                    'position_y' => $n['position']['y'] ?? $n['position_y'] ?? 100,
                    'config' => $n['data']['config'] ?? $n['config'] ?? [],
                ]
            );
        }

        // Remove deleted nodes
        $workflow->nodes()->whereNotIn('node_key', $existingNodeKeys)->delete();

        // Sync edges
        $workflow->edges()->delete();
        foreach ($validated['edges'] as $e) {
            $workflow->edges()->create([
                'edge_key' => $e['id'] ?? $e['edge_key'],
                'source_node_key' => $e['source'] ?? $e['source_node_key'],
                'target_node_key' => $e['target'] ?? $e['target_node_key'],
                'source_handle' => $e['sourceHandle'] ?? null,
                'target_handle' => $e['targetHandle'] ?? null,
            ]);
        }

        return response()->json(['success' => true, 'message' => 'Workflow graph canvas saved successfully.']);
    }

    public function testExecute(Request $request, Workflow $workflow)
    {
        $validated = $request->validate([
            'contact_id' => 'required|exists:contacts,id',
        ]);

        $contact = Contact::findOrFail($validated['contact_id']);
        ExecuteWorkflowJob::dispatchSync($workflow, $contact);

        return redirect()->back()->with('success', "Workflow executed synchronously for {$contact->full_name}. Check execution logs and messages.");
    }
}

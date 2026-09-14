import React, { useState, useCallback, useMemo, useEffect } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    Handle,
    Position,
    Node,
    Edge,
    NodeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
    ArrowLeft,
    Save,
    Play,
    Zap,
    MessageSquare,
    Mail,
    Clock,
    DollarSign,
    X,
    Sparkles,
} from 'lucide-react';
import { Contact, Workflow } from '../../types';

// Custom Trigger Node Component
function TriggerNodeComponent({ data }: NodeProps) {
    return (
        <div className="w-64 rounded-sm dark:bg-[#0e1628] bg-white border-2 border-indigo-500 shadow-md p-3 text-xs">
            <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold uppercase text-[10px] tracking-wide mb-1">
                <Zap className="w-3.5 h-3.5" />
                <span>Workflow Trigger</span>
            </div>
            <div className="font-semibold dark:text-white text-slate-900 text-xs">{data.title as string || 'Lead Enrolled'}</div>
            <div className="text-[11px] dark:text-slate-400 text-slate-500 mt-1">
                {typeof data.config === 'object' && (data.config as any)?.form_name ? (data.config as any).form_name : 'Event: Form Submitted'}
            </div>
            <Handle type="source" position={Position.Bottom} className="!bg-indigo-500 !w-3 !h-3" />
        </div>
    );
}

// Custom SMS Action Node
function ActionSmsNodeComponent({ data }: NodeProps) {
    return (
        <div className="w-64 rounded-sm dark:bg-[#0b1120] bg-white border border-amber-500 shadow-md p-3 text-xs">
            <Handle type="target" position={Position.Top} className="!bg-amber-500 !w-3 !h-3" />
            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold uppercase text-[10px] tracking-wide mb-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Action: 2-Way SMS</span>
            </div>
            <div className="font-semibold dark:text-white text-slate-900 text-xs">{data.title as string || 'Send Instant SMS'}</div>
            <div className="text-[11px] dark:text-slate-400 text-slate-600 mt-1 line-clamp-2 dark:bg-slate-950 bg-slate-50 p-1.5 rounded-sm font-mono border dark:border-slate-800 border-slate-200">
                {typeof data.config === 'object' && (data.config as any)?.body ? (data.config as any).body : 'Instant speed-to-lead notification.'}
            </div>
            <Handle type="source" position={Position.Bottom} className="!bg-amber-500 !w-3 !h-3" />
        </div>
    );
}

// Custom Email Action Node
function ActionEmailNodeComponent({ data }: NodeProps) {
    return (
        <div className="w-64 rounded-sm dark:bg-[#0b1120] bg-white border border-sky-500 shadow-md p-3 text-xs">
            <Handle type="target" position={Position.Top} className="!bg-sky-500 !w-3 !h-3" />
            <div className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 font-bold uppercase text-[10px] tracking-wide mb-1">
                <Mail className="w-3.5 h-3.5" />
                <span>Action: Send Email</span>
            </div>
            <div className="font-semibold dark:text-white text-slate-900 text-xs">{data.title as string || 'Send Audit Email'}</div>
            <div className="text-[11px] dark:text-slate-400 text-slate-600 mt-1 truncate dark:bg-slate-950 bg-slate-50 p-1.5 rounded-sm border dark:border-slate-800 border-slate-200">
                Subject: {typeof data.config === 'object' && (data.config as any)?.subject ? (data.config as any).subject : 'Your Growth Strategy'}
            </div>
            <Handle type="source" position={Position.Bottom} className="!bg-sky-500 !w-3 !h-3" />
        </div>
    );
}

// Custom Delay Node
function ActionWaitNodeComponent({ data }: NodeProps) {
    return (
        <div className="w-56 rounded-sm dark:bg-[#0b1120] bg-white border dark:border-slate-700 border-slate-300 shadow-md p-2.5 text-xs text-center">
            <Handle type="target" position={Position.Top} className="!bg-slate-400 !w-3 !h-3" />
            <div className="flex items-center justify-center gap-1.5 text-slate-500 font-bold uppercase text-[10px] tracking-wide mb-0.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Delay: Wait</span>
            </div>
            <div className="font-semibold dark:text-slate-200 text-slate-800">
                {typeof data.config === 'object' && (data.config as any)?.duration ? (data.config as any).duration : '15 Minutes'}
            </div>
            <Handle type="source" position={Position.Bottom} className="!bg-slate-400 !w-3 !h-3" />
        </div>
    );
}

// Custom Deal Stage Node
function ActionDealNodeComponent({ data }: NodeProps) {
    return (
        <div className="w-64 rounded-sm dark:bg-[#0b1120] bg-white border border-emerald-500 shadow-md p-3 text-xs">
            <Handle type="target" position={Position.Top} className="!bg-emerald-500 !w-3 !h-3" />
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold uppercase text-[10px] tracking-wide mb-1">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Pipeline Deal Created</span>
            </div>
            <div className="font-semibold dark:text-white text-slate-900 text-xs">{data.title as string || 'Move to Pipeline Stage'}</div>
            <div className="text-[11px] dark:text-slate-400 text-slate-600 mt-1">
                Value: <strong className="text-emerald-600 dark:text-emerald-400">$2,500 Deal</strong>
            </div>
            <Handle type="source" position={Position.Bottom} className="!bg-emerald-500 !w-3 !h-3" />
        </div>
    );
}

interface Props {
    workflow: Workflow;
    contacts: Contact[];
}

export default function WorkflowBuilder({ workflow, contacts }: Props) {
    const nodeTypes = useMemo(() => ({
        trigger: TriggerNodeComponent,
        action_sms: ActionSmsNodeComponent,
        action_email: ActionEmailNodeComponent,
        action_wait: ActionWaitNodeComponent,
        action_deal_move: ActionDealNodeComponent,
    }), []);

    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains('dark'));
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains('dark'));
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    // Initial nodes transformation
    const initialNodes: Node[] = (workflow.nodes || []).map((n) => ({
        id: n.node_key,
        type: n.node_type,
        position: { x: n.position_x, y: n.position_y },
        data: {
            title: n.title,
            type: n.node_type,
            config: n.config || {},
        },
    }));

    // Initial edges
    const initialEdges: Edge[] = (workflow.edges || []).map((e) => ({
        id: e.edge_key,
        source: e.source_node_key,
        target: e.target_node_key,
        style: { stroke: '#6366f1', strokeWidth: 2 },
    }));

    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);
    const [saving, setSaving] = useState(false);
    const [showTestModal, setShowTestModal] = useState(false);
    const [selectedContactId, setSelectedContactId] = useState(contacts[0]?.id || '');

    const onNodesChange = useCallback(
        (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );

    const onEdgesChange = useCallback(
        (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    const onConnect = useCallback(
        (params: any) => setEdges((eds) => addEdge({ ...params, style: { stroke: '#6366f1', strokeWidth: 2 } }, eds)),
        []
    );

    const addNode = (type: string, title: string, config: any) => {
        const id = `node_${Date.now()}`;
        const newNode: Node = {
            id,
            type,
            position: { x: 260, y: (nodes.length * 150) + 50 },
            data: { title, type, config },
        };
        setNodes((nds) => [...nds, newNode]);
    };

    const handleSaveGraph = () => {
        setSaving(true);
        const payload = {
            nodes: nodes.map((n) => ({
                id: n.id,
                node_key: n.id,
                node_type: n.type,
                title: n.data.title,
                position: n.position,
                config: n.data.config,
            })),
            edges: edges.map((e) => ({
                id: e.id,
                edge_key: e.id,
                source: e.source,
                target: e.target,
            })),
        };

        router.post(`/workflows/${workflow.id}/graph`, payload, {
            onFinish: () => setSaving(false),
            preserveScroll: true,
        });
    };

    const handleRunTest = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedContactId) return;
        router.post(`/workflows/${workflow.id}/test-execute`, {
            contact_id: selectedContactId,
        }, {
            onSuccess: () => {
                setShowTestModal(false);
            },
        });
    };

    return (
        <AppLayout title={`Workflow Builder: ${workflow.name}`}>
            <Head title={`${workflow.name} - Interactive Graph Builder`} />

            <div className="h-[calc(100vh-100px)] flex flex-col space-y-3 -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8">
                {/* Header Canvas Control Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 p-3 rounded-sm z-10 flex-shrink-0 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/workflows"
                            className="p-1.5 rounded-sm border dark:border-slate-700 border-slate-300 dark:bg-slate-800 bg-slate-100 dark:text-slate-300 text-slate-700 hover:scale-105 transition"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <h1 className="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-2">
                                <span>{workflow.name}</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                                    Active Graph Canvas
                                </span>
                            </h1>
                            <p className="text-[10px] dark:text-slate-400 text-slate-500">
                                Drag nodes, connect triggers & actions, and trigger live executions.
                            </p>
                        </div>
                    </div>

                    {/* Action Node Palette & Graph Actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1 border-r dark:border-slate-800 border-slate-200 pr-2">
                            <button
                                onClick={() => addNode('action_sms', 'Instant 2-Way SMS', { body: 'Hey {{contact.first_name}}, thanks for your interest!' })}
                                className="px-2 py-1 rounded-sm border dark:border-slate-700 border-slate-300 dark:bg-slate-800/80 bg-slate-50 hover:bg-slate-100 dark:hover:bg-slate-700 text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1 shadow-sm"
                            >
                                <MessageSquare className="w-3 h-3" />
                                <span>+ SMS</span>
                            </button>
                            <button
                                onClick={() => addNode('action_email', 'Send Welcome Email', { subject: 'Welcome to our platform', body: 'Full onboarding guide.' })}
                                className="px-2 py-1 rounded-sm border dark:border-slate-700 border-slate-300 dark:bg-slate-800/80 bg-slate-50 hover:bg-slate-100 dark:hover:bg-slate-700 text-[11px] font-semibold text-sky-600 dark:text-sky-400 flex items-center gap-1 shadow-sm"
                            >
                                <Mail className="w-3 h-3" />
                                <span>+ Email</span>
                            </button>
                            <button
                                onClick={() => addNode('action_wait', 'Delay 30 Minutes', { duration: '30 Minutes' })}
                                className="px-2 py-1 rounded-sm border dark:border-slate-700 border-slate-300 dark:bg-slate-800/80 bg-slate-50 hover:bg-slate-100 dark:hover:bg-slate-700 text-[11px] font-semibold dark:text-slate-300 text-slate-700 flex items-center gap-1 shadow-sm"
                            >
                                <Clock className="w-3 h-3" />
                                <span>+ Wait</span>
                            </button>
                            <button
                                onClick={() => addNode('action_deal_move', 'Create $2,500 Deal', { stage: 'Discovery Call', value: 2500 })}
                                className="px-2 py-1 rounded-sm border dark:border-slate-700 border-slate-300 dark:bg-slate-800/80 bg-slate-50 hover:bg-slate-100 dark:hover:bg-slate-700 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 shadow-sm"
                            >
                                <DollarSign className="w-3 h-3" />
                                <span>+ Deal</span>
                            </button>
                        </div>

                        <button
                            onClick={() => setShowTestModal(true)}
                            className="px-3 py-1.5 rounded-sm dark:bg-slate-800 bg-white hover:dark:bg-slate-700 hover:bg-slate-50 dark:text-white text-slate-800 text-xs font-semibold border dark:border-slate-700 border-slate-300 flex items-center gap-1.5 transition shadow-sm"
                        >
                            <Play className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Test Run</span>
                        </button>

                        <button
                            onClick={handleSaveGraph}
                            disabled={saving}
                            className="px-4 py-1.5 rounded-sm bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
                        >
                            <Save className="w-3.5 h-3.5" />
                            <span>{saving ? 'Saving...' : 'Save Canvas'}</span>
                        </button>
                    </div>
                </div>

                {/* React Flow Canvas */}
                <div className="flex-1 w-full dark:bg-[#070a12] bg-slate-100 border dark:border-slate-800 border-slate-300 rounded-sm relative overflow-hidden shadow-inner">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        nodeTypes={nodeTypes}
                        fitView
                        className="dark:bg-[#070a12] bg-slate-100"
                    >
                        <Background color={isDark ? '#1e293b' : '#cbd5e1'} gap={20} size={1} />
                        <Controls />
                        <MiniMap
                            nodeStrokeColor="#4f46e5"
                            nodeColor={isDark ? '#0f172a' : '#ffffff'}
                            maskColor={isDark ? 'rgba(9, 13, 22, 0.7)' : 'rgba(241, 245, 249, 0.7)'}
                            style={{
                                background: isDark ? '#090d16' : '#f8fafc',
                                border: isDark ? '1px solid #1e293b' : '1px solid #cbd5e1',
                            }}
                        />
                    </ReactFlow>

                    {/* Canvas Floating Info */}
                    <div className="absolute bottom-4 left-4 p-2.5 rounded-sm dark:bg-[#0b1120]/90 bg-white/90 border dark:border-slate-800 border-slate-200 text-[11px] dark:text-slate-400 text-slate-600 shadow-md pointer-events-none backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="font-semibold dark:text-slate-200 text-slate-800">Graph JS Node Canvas Active</span>
                        </div>
                        <p className="text-[10px] dark:text-slate-500 text-slate-500 mt-0.5">
                            Drag handles to connect. Click Test Run to execute workflow through the Laravel Queue.
                        </p>
                    </div>
                </div>

                {/* Test Run Execution Modal */}
                {showTestModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
                        <div className="w-full max-w-sm dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-300 rounded-sm shadow-xl p-5 space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b dark:border-slate-800 border-slate-200">
                                <h3 className="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-1.5">
                                    <Play className="w-4 h-4 text-emerald-500" />
                                    <span>Test Execute Workflow</span>
                                </h3>
                                <button onClick={() => setShowTestModal(false)}>
                                    <X className="w-4 h-4 text-slate-400" />
                                </button>
                            </div>

                            <form onSubmit={handleRunTest} className="space-y-3 text-xs">
                                <div>
                                    <label className="block dark:text-slate-400 text-slate-600 mb-1">Select Contact Lead for Test Run *</label>
                                    <select
                                        value={selectedContactId}
                                        onChange={(e) => setSelectedContactId(e.target.value)}
                                        className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500"
                                    >
                                        {contacts.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.first_name} {c.last_name} ({c.company || c.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="p-2.5 rounded-sm dark:bg-slate-900 bg-slate-100 border dark:border-slate-800 border-slate-200 text-[11px] dark:text-slate-400 text-slate-600">
                                    Executes all workflow nodes through the Queue Job system. Dispatches SMS and Email via active providers or Simulator.
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowTestModal(false)}
                                        className="px-3 py-1.5 rounded-sm border dark:border-slate-700 border-slate-300 dark:text-slate-300 text-slate-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-1.5 rounded-sm bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1"
                                    >
                                        <Play className="w-3 h-3" />
                                        <span>Trigger Now</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

import React, { useState } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    GitFork,
    Plus,
    Play,
    Zap,
    ArrowUpRight,
    CheckCircle2,
    Clock,
    X,
} from 'lucide-react';
import { Workflow } from '../../types';

interface Props {
    workflows: (Workflow & { nodes_count?: number; executions_count?: number })[];
}

export default function WorkflowsIndex({ workflows }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        name: '',
        description: '',
        trigger_type: 'form_submitted',
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/workflows', form, {
            onSuccess: () => {
                setShowModal(false);
                setForm({ name: '', description: '', trigger_type: 'form_submitted' });
            },
        });
    };

    return (
        <AppLayout title="Workflows & Automations">
            <Head title="Workflows & Graph Automations - HighLevel Flow" />

            <div className="space-y-5">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                            <span>Automation Workflows & Node Graph</span>
                            <span className="text-xs px-2 py-0.5 rounded-sm bg-indigo-500/20 text-indigo-400 font-semibold border border-indigo-500/30">
                                Visual Flow Engine
                            </span>
                        </h1>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Automate lead follow-ups with node-based triggers, 2-way SMS speed-to-lead, emails, and deal pipeline advances.
                        </p>
                    </div>

                    <button
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Create Workflow</span>
                    </button>
                </div>

                {/* Workflows Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {workflows.map((wf) => (
                        <div
                            key={wf.id}
                            className="rounded-sm bg-[#0b1120] border border-slate-800 p-5 flex flex-col justify-between hover:border-slate-700 transition"
                        >
                            <div className="space-y-3">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h3 className="font-bold text-sm text-white">{wf.name}</h3>
                                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                                            {wf.description || 'Automated multi-step communication sequence.'}
                                        </p>
                                    </div>
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                                        {wf.status}
                                    </span>
                                </div>

                                <div className="p-3 rounded-sm bg-slate-950/60 border border-slate-800/80 space-y-1.5 text-xs">
                                    <div className="flex items-center justify-between text-slate-400">
                                        <span>Trigger Event:</span>
                                        <span className="text-white font-medium capitalize">
                                            {wf.trigger_type.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-slate-400">
                                        <span>Graph Canvas Nodes:</span>
                                        <span className="text-indigo-400 font-bold">
                                            {wf.nodes_count || 5} Connected Nodes
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-slate-400">
                                        <span>Total Enrolled:</span>
                                        <span className="text-emerald-400 font-medium">{wf.total_enrolled} Leads</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                                <span className="text-[11px] text-slate-500">
                                    {wf.total_completed} Completed Runs
                                </span>
                                <Link
                                    href={`/workflows/${wf.id}`}
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                                >
                                    <span>Open Graph Canvas</span>
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Create Workflow Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
                        <div className="w-full max-w-md bg-[#0b1120] border border-slate-800 rounded-sm shadow-xl p-5 space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                                    <GitFork className="w-4 h-4 text-indigo-400" />
                                    <span>Create Workflow Automation</span>
                                </h3>
                                <button onClick={() => setShowModal(false)}>
                                    <X className="w-4 h-4 text-slate-400" />
                                </button>
                            </div>

                            <form onSubmit={handleCreate} className="space-y-3 text-xs">
                                <div>
                                    <label className="block text-slate-400 mb-1 font-medium">Workflow Name *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Website Audit Lead Nurture & SMS"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="w-full bg-[#070a12] border border-slate-700 rounded-sm px-2.5 py-1.5 text-white focus:outline-none focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-400 mb-1 font-medium">Trigger Event</label>
                                    <select
                                        value={form.trigger_type}
                                        onChange={(e) => setForm({ ...form, trigger_type: e.target.value })}
                                        className="w-full bg-[#070a12] border border-slate-700 rounded-sm px-2.5 py-1.5 text-white focus:outline-none focus:border-indigo-500"
                                    >
                                        <option value="form_submitted">Form Submitted (Opt-In Landing)</option>
                                        <option value="site_crawled">Website Crawled & Audit Generated</option>
                                        <option value="deal_stage_changed">Opportunity Moved to New Stage</option>
                                        <option value="tag_added">Contact Tag Added</option>
                                        <option value="webhook">Incoming Custom Webhook</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-slate-400 mb-1 font-medium">Description</label>
                                    <textarea
                                        rows={2}
                                        placeholder="Summary of actions performed by this workflow..."
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        className="w-full bg-[#070a12] border border-slate-700 rounded-sm px-2.5 py-1.5 text-white focus:outline-none focus:border-indigo-500"
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-3 py-1.5 rounded-sm border border-slate-700 text-slate-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-1.5 rounded-sm bg-indigo-600 text-white font-semibold"
                                    >
                                        Create & Open Graph
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

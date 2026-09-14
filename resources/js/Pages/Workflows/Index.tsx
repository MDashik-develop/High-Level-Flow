import React, { useState } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    GitFork,
    Plus,
    ArrowUpRight,
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
                        <h1 className="text-xl font-bold tracking-tight dark:text-white text-slate-900 flex items-center gap-2">
                            <span>Automation Workflows & Node Graph</span>
                            <span className="text-xs px-2 py-0.5 rounded-sm bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-500/20">
                                Visual Flow Engine
                            </span>
                        </h1>
                        <p className="text-xs dark:text-slate-400 text-slate-500 mt-0.5">
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
                            className="rounded-sm dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 p-5 flex flex-col justify-between hover:border-indigo-500/50 transition shadow-sm"
                        >
                            <div className="space-y-3">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h3 className="font-bold text-sm dark:text-white text-slate-900">{wf.name}</h3>
                                        <p className="text-[11px] dark:text-slate-400 text-slate-500 mt-0.5 line-clamp-2">
                                            {wf.description || 'Automated multi-step communication sequence.'}
                                        </p>
                                    </div>
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase">
                                        {wf.status}
                                    </span>
                                </div>

                                <div className="p-3 rounded-sm dark:bg-slate-950/60 bg-slate-50 border dark:border-slate-800/80 border-slate-200 space-y-1.5 text-xs">
                                    <div className="flex items-center justify-between dark:text-slate-400 text-slate-600">
                                        <span>Trigger Event:</span>
                                        <span className="dark:text-white text-slate-900 font-medium capitalize">
                                            {wf.trigger_type.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between dark:text-slate-400 text-slate-600">
                                        <span>Graph Canvas Nodes:</span>
                                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                                            {wf.nodes_count || 5} Connected Nodes
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between dark:text-slate-400 text-slate-600">
                                        <span>Total Enrolled:</span>
                                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">{wf.total_enrolled} Leads</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-3 border-t dark:border-slate-800/80 border-slate-100 flex items-center justify-between">
                                <span className="text-[11px] dark:text-slate-500 text-slate-400">
                                    {wf.total_completed} Completed Runs
                                </span>
                                <Link
                                    href={`/workflows/${wf.id}`}
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
                        <div className="w-full max-w-md dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 rounded-sm shadow-xl p-5 space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b dark:border-slate-800 border-slate-200">
                                <h3 className="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-1.5">
                                    <GitFork className="w-4 h-4 text-indigo-500" />
                                    <span>Create Workflow Automation</span>
                                </h3>
                                <button onClick={() => setShowModal(false)} className="dark:text-slate-400 text-slate-500 hover:text-slate-800 dark:hover:text-white">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleCreate} className="space-y-3 text-xs">
                                <div>
                                    <label className="block dark:text-slate-400 text-slate-600 mb-1 font-medium">Workflow Name *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Website Audit Lead Nurture & SMS"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block dark:text-slate-400 text-slate-600 mb-1 font-medium">Trigger Event</label>
                                    <select
                                        value={form.trigger_type}
                                        onChange={(e) => setForm({ ...form, trigger_type: e.target.value })}
                                        className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500"
                                    >
                                        <option value="form_submitted">Form Submitted (Opt-In Landing)</option>
                                        <option value="site_crawled">Website Crawled & Audit Generated</option>
                                        <option value="deal_stage_changed">Opportunity Moved to New Stage</option>
                                        <option value="tag_added">Contact Tag Added</option>
                                        <option value="webhook">Incoming Custom Webhook</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block dark:text-slate-400 text-slate-600 mb-1 font-medium">Description</label>
                                    <textarea
                                        rows={2}
                                        placeholder="Summary of actions performed by this workflow..."
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500"
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-2 border-t dark:border-slate-800 border-slate-200">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-3 py-1.5 rounded-sm border dark:border-slate-700 border-slate-300 dark:text-slate-300 text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-1.5 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-sm"
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

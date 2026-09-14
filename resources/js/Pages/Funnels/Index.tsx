import React, { useState } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Layers,
    Plus,
    Eye,
    TrendingUp,
    Users,
    DollarSign,
    ArrowUpRight,
    X,
    Sparkles,
    LayoutTemplate,
} from 'lucide-react';
import { Funnel } from '../../types';

interface Props {
    funnels: Funnel[];
}

export default function FunnelsIndex({ funnels }: Props) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [form, setForm] = useState({
        name: '',
        description: '',
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/funnels', form, {
            onSuccess: () => {
                setShowCreateModal(false);
                setForm({ name: '', description: '' });
            },
        });
    };

    return (
        <AppLayout title="Sales & Marketing Funnels">
            <Head title="Funnel Builder - HighLevel Flow" />

            <div className="space-y-5">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight dark:text-white text-slate-900 flex items-center gap-2">
                            <span>Marketing & Sales Funnels</span>
                            <span className="text-xs px-2 py-0.5 rounded-sm bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-500/20">
                                High-Converting Systems
                            </span>
                        </h1>
                        <p className="text-xs dark:text-slate-400 text-slate-500 mt-0.5">
                            Visual drag-and-drop page builder powered by GrapesJS with responsive mobile views, VSLs, and checkout pages.
                        </p>
                    </div>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Create New Funnel</span>
                    </button>
                </div>

                {/* Funnel List Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {funnels.map((funnel) => {
                        const optinRate = funnel.total_visitors > 0
                            ? Math.round((funnel.total_optins / funnel.total_visitors) * 100)
                            : 0;

                        const firstStepId = funnel.steps?.[0]?.id || 1;

                        return (
                            <div
                                key={funnel.id}
                                className="rounded-sm dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 p-5 flex flex-col justify-between hover:border-indigo-500/50 transition shadow-sm"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h3 className="font-bold text-sm dark:text-white text-slate-900">{funnel.name}</h3>
                                            <p className="text-[11px] dark:text-slate-400 text-slate-500 mt-0.5 line-clamp-2">
                                                {funnel.description || 'Automated client conversion funnel.'}
                                            </p>
                                        </div>
                                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase">
                                            {funnel.status}
                                        </span>
                                    </div>

                                    {/* Stats grid */}
                                    <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-sm dark:bg-slate-950/60 bg-slate-50 border dark:border-slate-800/80 border-slate-200 text-center">
                                        <div>
                                            <span className="text-[10px] dark:text-slate-500 text-slate-400 uppercase block">Visitors</span>
                                            <span className="text-xs font-bold dark:text-slate-200 text-slate-800">
                                                {funnel.total_visitors.toLocaleString()}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] dark:text-slate-500 text-slate-400 uppercase block">Opt-Ins</span>
                                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                                {funnel.total_optins} ({optinRate}%)
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] dark:text-slate-500 text-slate-400 uppercase block">Revenue</span>
                                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                                ${Number(funnel.total_revenue).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Steps badges */}
                                    <div className="space-y-1">
                                        <span className="text-[11px] dark:text-slate-400 text-slate-500 font-medium">
                                            Funnel Sequence ({funnel.steps?.length || 0} Steps):
                                        </span>
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            {funnel.steps?.map((step) => (
                                                <span
                                                    key={step.id}
                                                    className="px-2 py-0.5 rounded-sm dark:bg-slate-900 bg-slate-100 border dark:border-slate-800 border-slate-200 text-[10px] dark:text-slate-300 text-slate-700 font-medium"
                                                >
                                                    {step.step_number}. {step.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-3 border-t dark:border-slate-800/80 border-slate-100 flex items-center justify-between gap-2">
                                    <Link
                                        href={`/funnels/${funnel.id}`}
                                        className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition"
                                    >
                                        Steps Overview
                                    </Link>
                                    
                                    <Link
                                        href={`/funnels/${funnel.id}/steps/${firstStepId}/builder`}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition"
                                    >
                                        <Layers className="w-3.5 h-3.5" />
                                        <span>GrapesJS Builder</span>
                                        <ArrowUpRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Create Funnel Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
                        <div className="w-full max-w-md dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 rounded-sm shadow-xl p-5 space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b dark:border-slate-800 border-slate-200">
                                <h3 className="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-1.5">
                                    <Layers className="w-4 h-4 text-indigo-500" />
                                    <span>Create Sales Funnel</span>
                                </h3>
                                <button onClick={() => setShowCreateModal(false)} className="dark:text-slate-400 text-slate-500 hover:text-slate-800 dark:hover:text-white">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleCreate} className="space-y-3 text-xs">
                                <div>
                                    <label className="block dark:text-slate-400 text-slate-600 mb-1 font-medium">Funnel Name *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Real Estate Lead Acquisition Funnel"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block dark:text-slate-400 text-slate-600 mb-1 font-medium">Description</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Goal of this funnel (e.g. capture local homeowner leads with free evaluation)"
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500"
                                    />
                                </div>

                                <div className="p-2.5 rounded-sm dark:bg-indigo-950/40 bg-indigo-50 border dark:border-indigo-500/20 border-indigo-200 text-[11px] text-indigo-700 dark:text-indigo-300">
                                    Includes default high-converting steps: <strong>Landing Opt-In, Sales Offer, Checkout & Thank You</strong> editable visually in GrapesJS.
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="px-3 py-1.5 rounded-sm border dark:border-slate-700 border-slate-300 dark:text-slate-300 text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-1.5 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-sm"
                                    >
                                        Generate Funnel
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

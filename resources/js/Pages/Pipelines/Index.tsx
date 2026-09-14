import React, { useState } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    KanbanSquare,
    Plus,
    Building2,
    ArrowRight,
    ArrowLeft,
    Trash2,
    X,
} from 'lucide-react';
import { Contact, Opportunity, Pipeline } from '../../types';

interface Props {
    pipelines: Pipeline[];
    activePipeline: Pipeline;
    contacts: Contact[];
}

export default function PipelinesIndex({ pipelines, activePipeline, contacts }: Props) {
    const [showNewDealModal, setShowNewDealModal] = useState(false);
    const [showNewStageModal, setShowNewStageModal] = useState(false);

    const [dealForm, setDealForm] = useState({
        pipeline_id: activePipeline ? activePipeline.id : (pipelines[0]?.id || 1),
        pipeline_stage_id: activePipeline?.stages[0]?.id || 1,
        contact_id: '',
        title: '',
        monetary_value: 1500,
        status: 'open',
        priority: 'medium',
        notes: '',
    });

    const [newStageName, setNewStageName] = useState('');

    const totalPipelineValue = activePipeline?.stages?.reduce((acc, stage) => {
        const stageTotal = stage.opportunities?.reduce((sAcc, opp) => sAcc + Number(opp.monetary_value), 0) || 0;
        return acc + stageTotal;
    }, 0) || 0;

    const totalDeals = activePipeline?.stages?.reduce((acc, stage) => {
        return acc + (stage.opportunities?.length || 0);
    }, 0) || 0;

    const handleMoveDeal = (opportunityId: number, targetStageId: number) => {
        router.patch(`/opportunities/${opportunityId}/move`, {
            stage_id: targetStageId,
        }, { preserveScroll: true });
    };

    const handleDeleteDeal = (opportunityId: number) => {
        if (confirm('Are you sure you want to remove this deal?')) {
            router.delete(`/opportunities/${opportunityId}`, { preserveScroll: true });
        }
    };

    const handleCreateDeal = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/opportunities', dealForm, {
            onSuccess: () => {
                setShowNewDealModal(false);
                setDealForm({
                    ...dealForm,
                    title: '',
                    notes: '',
                });
            },
        });
    };

    const handleCreateStage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newStageName) return;
        router.post(`/pipelines/${activePipeline.id}/stages`, {
            name: newStageName,
        }, {
            onSuccess: () => {
                setShowNewStageModal(false);
                setNewStageName('');
            },
        });
    };

    return (
        <AppLayout title="Sales Pipelines & Deals">
            <Head title="Pipelines & Deals - HighLevel Flow" />

            <div className="space-y-5">
                {/* Top Control Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold tracking-tight dark:text-white text-slate-900 flex items-center gap-2">
                                <span>{activePipeline?.name || 'Sales Pipeline'}</span>
                            </h1>
                            <span className="text-xs px-2 py-0.5 rounded-sm bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                                Total: ${totalPipelineValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                        <p className="text-xs dark:text-slate-400 text-slate-500 mt-0.5">
                            Kanban opportunity tracker. Drag or advance deals through qualification to close.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowNewStageModal(true)}
                            className="px-3 py-1.5 rounded-sm border dark:border-slate-700 border-slate-300 dark:bg-slate-800 bg-white hover:dark:bg-slate-700 hover:bg-slate-50 dark:text-slate-200 text-slate-800 text-xs font-medium transition shadow-sm"
                        >
                            + Add Stage
                        </button>
                        <button
                            onClick={() => setShowNewDealModal(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Create Deal</span>
                        </button>
                    </div>
                </div>

                {/* Pipeline Stats strip */}
                <div className="flex items-center justify-between px-3 py-2 rounded-sm dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 text-xs dark:text-slate-400 text-slate-600 shadow-sm">
                    <div className="flex items-center gap-4">
                        <span>Stages: <strong className="dark:text-white text-slate-900">{activePipeline?.stages?.length || 0}</strong></span>
                        <span>Active Deals: <strong className="dark:text-white text-slate-900">{totalDeals}</strong></span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                        Average Deal Size: <strong className="dark:text-slate-300 text-slate-700">${totalDeals > 0 ? Math.round(totalPipelineValue / totalDeals).toLocaleString() : 0}</strong>
                    </div>
                </div>

                {/* Kanban Board Columns Horizontal Scroll */}
                <div className="flex gap-4 overflow-x-auto pb-6 items-start">
                    {activePipeline?.stages?.map((stage, stageIndex) => {
                        const stageTotal = stage.opportunities?.reduce((acc, opp) => acc + Number(opp.monetary_value), 0) || 0;
                        const prevStage = activePipeline.stages[stageIndex - 1];
                        const nextStage = activePipeline.stages[stageIndex + 1];

                        return (
                            <div
                                key={stage.id}
                                className="w-80 flex-shrink-0 rounded-sm dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 shadow-sm flex flex-col max-h-[calc(100vh-240px)]"
                            >
                                {/* Column Header */}
                                <div className="p-3 border-b dark:border-slate-800 border-slate-200 flex items-center justify-between dark:bg-slate-950/50 bg-slate-50">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-2.5 h-2.5 rounded-full"
                                            style={{ backgroundColor: stage.color || '#6366f1' }}
                                        />
                                        <h3 className="font-semibold text-xs dark:text-white text-slate-900 truncate max-w-[150px]">
                                            {stage.name}
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[11px]">
                                        <span className="px-1.5 py-0.5 rounded-sm dark:bg-slate-800 bg-slate-200 dark:text-slate-400 text-slate-600 font-bold">
                                            {stage.opportunities?.length || 0}
                                        </span>
                                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                            ${stageTotal.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Opportunity Cards List */}
                                <div className="p-2 space-y-2 overflow-y-auto flex-1">
                                    {(!stage.opportunities || stage.opportunities.length === 0) ? (
                                        <div className="py-8 text-center text-slate-400 text-xs border border-dashed dark:border-slate-800 border-slate-300 rounded-sm">
                                            No deals in this stage
                                        </div>
                                    ) : (
                                        stage.opportunities.map((opp) => (
                                            <div
                                                key={opp.id}
                                                className="p-3 rounded-sm dark:bg-slate-900/60 bg-slate-50 border dark:border-slate-800 border-slate-200 hover:border-slate-400 dark:hover:border-slate-700 transition space-y-2 text-xs shadow-sm"
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className="font-semibold dark:text-white text-slate-900 leading-snug">
                                                        {opp.title}
                                                    </h4>
                                                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                                                        ${Number(opp.monetary_value).toLocaleString()}
                                                    </span>
                                                </div>

                                                {opp.contact && (
                                                    <div className="flex items-center gap-1.5 text-[11px] dark:text-slate-400 text-slate-600">
                                                        <Building2 className="w-3 h-3 text-slate-400" />
                                                        <span className="truncate">
                                                            {opp.contact.company || opp.contact.first_name}
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between pt-1 border-t dark:border-slate-800/80 border-slate-200 text-[10px]">
                                                    <span className={`px-1.5 py-0.5 rounded-sm font-semibold uppercase ${
                                                        opp.priority === 'high'
                                                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                                                            : 'dark:bg-slate-800 bg-slate-200 dark:text-slate-400 text-slate-700'
                                                    }`}>
                                                        {opp.priority}
                                                    </span>

                                                    {/* Move deal actions */}
                                                    <div className="flex items-center gap-1">
                                                        {prevStage && (
                                                            <button
                                                                onClick={() => handleMoveDeal(opp.id, prevStage.id)}
                                                                className="p-1 rounded-sm border dark:border-slate-800 border-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                                                                title={`Move back to ${prevStage.name}`}
                                                            >
                                                                <ArrowLeft className="w-3 h-3" />
                                                            </button>
                                                        )}
                                                        {nextStage && (
                                                            <button
                                                                onClick={() => handleMoveDeal(opp.id, nextStage.id)}
                                                                className="p-1 rounded-sm border dark:border-slate-800 border-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                                                                title={`Advance to ${nextStage.name}`}
                                                            >
                                                                <ArrowRight className="w-3 h-3" />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDeleteDeal(opp.id)}
                                                            className="p-1 rounded-sm border dark:border-slate-800 border-slate-300 hover:border-rose-300 hover:text-rose-600 text-slate-400"
                                                            title="Delete deal"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Create Deal Modal */}
                {showNewDealModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
                        <div className="w-full max-w-md dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-300 rounded-sm shadow-xl p-5 space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b dark:border-slate-800 border-slate-200">
                                <h3 className="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-1.5">
                                    <KanbanSquare className="w-4 h-4 text-indigo-500" />
                                    <span>Create Pipeline Deal</span>
                                </h3>
                                <button
                                    onClick={() => setShowNewDealModal(false)}
                                    className="p-1 rounded-sm text-slate-400 hover:text-slate-700 dark:hover:text-white"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateDeal} className="space-y-3 text-xs">
                                <div>
                                    <label className="block dark:text-slate-400 text-slate-600 mb-1 font-medium">Deal Title *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Dental Funnel & Automation Setup"
                                        value={dealForm.title}
                                        onChange={(e) => setDealForm({ ...dealForm, title: e.target.value })}
                                        className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block dark:text-slate-400 text-slate-600 mb-1 font-medium">Monetary Value ($)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={dealForm.monetary_value}
                                            onChange={(e) => setDealForm({ ...dealForm, monetary_value: parseFloat(e.target.value) || 0 })}
                                            className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block dark:text-slate-400 text-slate-600 mb-1 font-medium">Priority</label>
                                        <select
                                            value={dealForm.priority}
                                            onChange={(e) => setDealForm({ ...dealForm, priority: e.target.value })}
                                            className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block dark:text-slate-400 text-slate-600 mb-1 font-medium">Stage</label>
                                        <select
                                            value={dealForm.pipeline_stage_id}
                                            onChange={(e) => setDealForm({ ...dealForm, pipeline_stage_id: parseInt(e.target.value) })}
                                            className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500"
                                        >
                                            {activePipeline?.stages?.map((s) => (
                                                <option key={s.id} value={s.id}>{s.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block dark:text-slate-400 text-slate-600 mb-1 font-medium">Attach to Contact</label>
                                        <select
                                            value={dealForm.contact_id}
                                            onChange={(e) => setDealForm({ ...dealForm, contact_id: e.target.value })}
                                            className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500"
                                        >
                                            <option value="">No Contact Attached</option>
                                            {contacts.map((c) => (
                                                <option key={c.id} value={c.id}>
                                                    {c.first_name} {c.last_name} ({c.company || 'Direct'})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block dark:text-slate-400 text-slate-600 mb-1 font-medium">Deal Notes / Pitch Info</label>
                                    <textarea
                                        rows={3}
                                        value={dealForm.notes}
                                        onChange={(e) => setDealForm({ ...dealForm, notes: e.target.value })}
                                        placeholder="Notes from site audit or client discovery..."
                                        className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-3 border-t dark:border-slate-800 border-slate-200">
                                    <button
                                        type="button"
                                        onClick={() => setShowNewDealModal(false)}
                                        className="px-3 py-1.5 rounded-sm border dark:border-slate-700 border-slate-300 dark:text-slate-300 text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-1.5 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-sm"
                                    >
                                        Create Deal
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Create Stage Modal */}
                {showNewStageModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
                        <div className="w-full max-w-sm dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-300 rounded-sm shadow-xl p-5 space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b dark:border-slate-800 border-slate-200">
                                <h3 className="text-sm font-bold dark:text-white text-slate-900">Add New Stage</h3>
                                <button onClick={() => setShowNewStageModal(false)}>
                                    <X className="w-4 h-4 text-slate-400" />
                                </button>
                            </div>
                            <form onSubmit={handleCreateStage} className="space-y-3 text-xs">
                                <div>
                                    <label className="block dark:text-slate-400 text-slate-600 mb-1">Stage Name *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Contract In Review"
                                        value={newStageName}
                                        onChange={(e) => setNewStageName(e.target.value)}
                                        className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowNewStageModal(false)}
                                        className="px-3 py-1.5 rounded-sm border dark:border-slate-700 border-slate-300 dark:text-slate-300 text-slate-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-1.5 rounded-sm bg-indigo-600 text-white font-semibold"
                                    >
                                        Save Stage
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

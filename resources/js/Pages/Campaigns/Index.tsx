import React, { useState } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Megaphone,
    Plus,
    Mail,
    MessageSquare,
    Send,
    Users,
    X,
} from 'lucide-react';
import { Campaign } from '../../types';

interface Props {
    campaigns: {
        data: Campaign[];
        links: any[];
        total: number;
    };
    contactsCount: number;
}

export default function CampaignsIndex({ campaigns, contactsCount }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        name: '',
        type: 'email',
        subject: '',
        content: '',
        dispatch_now: true,
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/campaigns', form, {
            onSuccess: () => {
                setShowModal(false);
                setForm({
                    name: '',
                    type: 'email',
                    subject: '',
                    content: '',
                    dispatch_now: true,
                });
            },
        });
    };

    const handleDispatch = (campaignId: number) => {
        router.post(`/campaigns/${campaignId}/dispatch`, {}, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout title="Marketing Campaigns">
            <Head title="Marketing Campaigns - HighLevel Flow" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight dark:text-white text-slate-900 flex items-center gap-2">
                            <Megaphone className="w-5 h-5 text-indigo-500" />
                            <span>Broadcast Marketing Campaigns</span>
                        </h1>
                        <p className="text-xs dark:text-slate-400 text-slate-500 mt-0.5">
                            Mass email and 2-way SMS blast dispatcher running on Laravel asynchronous background queues.
                        </p>
                    </div>

                    <button
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition"
                    >
                        <Plus className="w-4 h-4" />
                        <span>New Campaign Broadcast</span>
                    </button>
                </div>

                {/* Performance Metrics Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-sm dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 shadow-sm">
                        <span className="text-[11px] dark:text-slate-500 text-slate-400 uppercase block">Audience Reach</span>
                        <span className="text-lg font-bold dark:text-white text-slate-900">{contactsCount} Contacts</span>
                    </div>
                    <div className="p-3 rounded-sm dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 shadow-sm">
                        <span className="text-[11px] dark:text-slate-500 text-slate-400 uppercase block">Active Campaigns</span>
                        <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{campaigns.total} Broadcasts</span>
                    </div>
                    <div className="p-3 rounded-sm dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 shadow-sm">
                        <span className="text-[11px] dark:text-slate-500 text-slate-400 uppercase block">Avg Delivery Rate</span>
                        <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">98.4%</span>
                    </div>
                    <div className="p-3 rounded-sm dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 shadow-sm">
                        <span className="text-[11px] dark:text-slate-500 text-slate-400 uppercase block">Avg Open Rate</span>
                        <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">42.8%</span>
                    </div>
                </div>

                {/* Campaigns Table */}
                <div className="rounded-sm dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b dark:border-slate-800 border-slate-200">
                        <h3 className="text-sm font-bold dark:text-white text-slate-900">Broadcast History & Scheduled Queue</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b dark:border-slate-800 border-slate-200 dark:bg-slate-950/60 bg-slate-50 text-[11px] font-semibold dark:text-slate-400 text-slate-500 uppercase tracking-wider">
                                    <th className="py-3 px-4">Campaign Name</th>
                                    <th className="py-3 px-4">Channel</th>
                                    <th className="py-3 px-4">Recipients</th>
                                    <th className="py-3 px-4">Delivery Stats</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-slate-800/60 divide-slate-200 text-xs dark:text-slate-300 text-slate-700">
                                {campaigns.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-slate-500">
                                            No campaigns created yet. Click "New Campaign Broadcast" to start.
                                        </td>
                                    </tr>
                                ) : (
                                    campaigns.data.map((camp) => (
                                        <tr key={camp.id} className="dark:hover:bg-slate-900/30 hover:bg-slate-50 transition">
                                            <td className="py-3.5 px-4">
                                                <div>
                                                    <div className="font-semibold dark:text-white text-slate-900">{camp.name}</div>
                                                    <div className="text-[11px] dark:text-slate-400 text-slate-500 truncate max-w-sm">
                                                        {camp.subject || camp.content}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold uppercase px-2 py-0.5 rounded-sm ${
                                                    camp.type === 'sms'
                                                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                                        : 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20'
                                                }`}>
                                                    {camp.type === 'sms' ? <MessageSquare className="w-3 h-3" /> : <Mail className="w-3 h-3" />}
                                                    <span>{camp.type}</span>
                                                </span>
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <span className="font-medium dark:text-slate-200 text-slate-800">
                                                    {camp.total_recipients || contactsCount} Leads
                                                </span>
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <div className="text-[11px] space-y-0.5">
                                                    <div>Sent: <strong className="dark:text-white text-slate-900">{camp.sent_count}</strong></div>
                                                    <div>Delivered: <strong className="text-emerald-600 dark:text-emerald-400">{camp.delivered_count}</strong></div>
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm ${
                                                    camp.status === 'completed'
                                                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                                        : camp.status === 'running'
                                                        ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 animate-pulse'
                                                        : 'dark:bg-slate-800 bg-slate-200 dark:text-slate-400 text-slate-700'
                                                }`}>
                                                    {camp.status}
                                                </span>
                                            </td>

                                            <td className="py-3.5 px-4 text-right">
                                                {camp.status === 'draft' && (
                                                    <button
                                                        onClick={() => handleDispatch(camp.id)}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition"
                                                    >
                                                        <Send className="w-3 h-3" />
                                                        <span>Dispatch Now</span>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Create Campaign Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
                        <div className="w-full max-w-md dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 rounded-sm shadow-xl p-5 space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b dark:border-slate-800 border-slate-200">
                                <h3 className="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-1.5">
                                    <Megaphone className="w-4 h-4 text-indigo-500" />
                                    <span>Create Broadcast Campaign</span>
                                </h3>
                                <button onClick={() => setShowModal(false)} className="dark:text-slate-400 text-slate-500 hover:text-slate-800 dark:hover:text-white">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleCreate} className="space-y-3 text-xs">
                                <div>
                                    <label className="block dark:text-slate-400 text-slate-600 mb-1 font-medium">Campaign Name *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Q4 Website Audit Follow-Up Blast"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block dark:text-slate-400 text-slate-600 mb-1 font-medium">Broadcast Channel</label>
                                    <select
                                        value={form.type}
                                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                                        className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500"
                                    >
                                        <option value="email">Email Broadcast (Resend / SendGrid)</option>
                                        <option value="sms">SMS Blast (Twilio Carrier)</option>
                                    </select>
                                </div>

                                {form.type === 'email' && (
                                    <div>
                                        <label className="block dark:text-slate-400 text-slate-600 mb-1 font-medium">Email Subject Line</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Free Patient Acquisition Blueprint for your clinic"
                                            value={form.subject}
                                            onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                            className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block dark:text-slate-400 text-slate-600 mb-1 font-medium">Message Body / Copy</label>
                                    <textarea
                                        rows={4}
                                        required
                                        placeholder="Hey {{contact.first_name}}, we noticed your site..."
                                        value={form.content}
                                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                                        className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500 font-mono text-xs"
                                    />
                                    <span className="text-[10px] dark:text-slate-500 text-slate-400 mt-1 block">
                                        Tip: Use <code>{'{{contact.first_name}}'}</code> for automatic recipient personalization.
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 pt-1">
                                    <input
                                        type="checkbox"
                                        id="dispatch_now"
                                        checked={form.dispatch_now}
                                        onChange={(e) => setForm({ ...form, dispatch_now: e.target.checked })}
                                        className="rounded-sm border-slate-400 text-indigo-600 focus:ring-0"
                                    />
                                    <label htmlFor="dispatch_now" className="dark:text-slate-300 text-slate-700 font-medium">
                                        Queue and broadcast immediately to all contacts
                                    </label>
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
                                        Launch Broadcast
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

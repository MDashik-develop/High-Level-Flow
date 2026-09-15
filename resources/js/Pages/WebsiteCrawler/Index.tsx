import React, { useState } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Globe,
    Sparkles,
    ShieldAlert,
    Clock,
    ArrowUpRight,
    CheckCircle2,
    ExternalLink,
    Trash2,
    CheckSquare,
    Square,
} from 'lucide-react';
import { WebsiteAudit } from '../../types';

interface Props {
    audits: {
        data: WebsiteAudit[];
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        total: number;
        current_page: number;
        last_page: number;
    };
}

export default function WebsiteCrawlerIndex({ audits }: Props) {
    const [url, setUrl] = useState('');
    const [scanning, setScanning] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleScan = (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;
        setScanning(true);
        router.post('/crawler/scan', { url }, {
            onFinish: () => setScanning(false),
        });
    };

    const allCurrentIds = audits.data.map((a) => a.id);
    const isAllSelected = allCurrentIds.length > 0 && allCurrentIds.every((id) => selectedIds.includes(id));

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(allCurrentIds);
        }
    };

    const toggleSelectOne = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;
        const confirmMsg = `Are you sure you want to delete ${selectedIds.length} selected website audit record(s)? This action cannot be undone.`;
        if (!window.confirm(confirmMsg)) return;

        setIsDeleting(true);
        router.post(
            '/crawler/bulk-delete',
            { ids: selectedIds },
            {
                preserveScroll: true,
                onFinish: () => {
                    setIsDeleting(false);
                    setSelectedIds([]);
                },
            }
        );
    };

    const handleSingleDelete = (id: number, targetName: string) => {
        if (!window.confirm(`Delete website audit for "${targetName}"?`)) return;
        router.delete(`/crawler/${id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedIds((prev) => prev.filter((item) => item !== id));
            },
        });
    };

    return (
        <AppLayout title="Website Crawler & Audit Engine">
            <Head title="Website Crawler & Lead Hunter - HighLevel Flow" />

            <div className="space-y-6">
                {/* Header Title */}
                <div>
                    <h1 className="text-xl font-bold tracking-tight dark:text-white text-slate-900 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-indigo-500" />
                        <span>Smart Website Crawler & Lead Hunter</span>
                        <span className="text-xs px-2 py-0.5 rounded-sm dark:bg-indigo-500/20 bg-indigo-100 dark:text-indigo-400 text-indigo-700 font-semibold border dark:border-indigo-500/30 border-indigo-200">
                            Client Acquisition Weapon
                        </span>
                    </h1>
                    <p className="text-xs dark:text-slate-400 text-slate-500 mt-1 max-w-2xl">
                        Enter any business website link. Our crawler scans their HTML, detects the services they offer, spots missing booking widgets & SMS responders, and creates a high-converting cold pitch.
                    </p>
                </div>

                {/* Prominent Scanner Input Box */}
                <div className="p-6 rounded-sm dark:bg-gradient-to-r dark:from-indigo-950/60 dark:via-[#0b1120] dark:to-[#0b1120] bg-gradient-to-r from-indigo-50 via-white to-white border dark:border-indigo-500/40 border-indigo-200 shadow-sm space-y-4">
                    <form onSubmit={handleScan} className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="relative flex-1 w-full">
                            <Globe className="w-4 h-4 absolute left-3.5 top-3.5 text-indigo-500" />
                            <input
                                type="text"
                                required
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="Enter prospect website URL (e.g. apexsmiles.com, roofingpros.com, or https://...)"
                                className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm pl-10 pr-4 py-3 text-sm dark:text-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition shadow-inner"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={scanning}
                            className="w-full sm:w-auto px-6 py-3 rounded-sm bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition whitespace-nowrap cursor-pointer"
                        >
                            {scanning ? (
                                <>
                                    <Clock className="w-4 h-4 animate-spin" />
                                    <span>Crawling & Extracting Intelligence...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    <span>Scan & Audit Website</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="flex items-center gap-6 text-[11px] dark:text-slate-400 text-slate-600 flex-wrap pt-1">
                        <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Extracts core services & offerings</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Uncovers emails, phones & social handles</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Detects missing pixels & booking calendars</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Auto-generates cold outreach sales pitch</span>
                        </span>
                    </div>
                </div>

                {/* Multiple Selection Action Banner */}
                {selectedIds.length > 0 && (
                    <div className="p-3.5 bg-indigo-50/90 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-500/40 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in duration-200 shadow-sm">
                        <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                                {selectedIds.length}
                            </span>
                            <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                                {selectedIds.length} website audit{selectedIds.length > 1 ? 's' : ''} selected
                            </span>
                            <span className="text-[11px] text-indigo-700 dark:text-indigo-400">
                                (out of {audits.data.length} on this page)
                            </span>
                        </div>

                        <div className="flex items-center gap-2.5">
                            <button
                                type="button"
                                onClick={() => setSelectedIds([])}
                                className="text-xs px-3 py-1.5 rounded-sm dark:bg-slate-800 bg-white dark:text-slate-300 text-slate-700 hover:text-slate-900 dark:hover:text-white border dark:border-slate-700 border-slate-300 transition cursor-pointer font-medium"
                            >
                                Deselect All
                            </button>

                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={handleBulkDelete}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-sm transition disabled:opacity-50 cursor-pointer"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>{isDeleting ? 'Deleting...' : `Delete Selected (${selectedIds.length})`}</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Past Audits Table */}
                <div className="rounded-sm dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b dark:border-slate-800 border-slate-200 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-1.5">
                                <Globe className="w-4 h-4 text-indigo-500" />
                                <span>Recent Prospect Audits ({audits.total})</span>
                            </h3>
                            <p className="text-[11px] dark:text-slate-400 text-slate-500">
                                Prospect intelligence repository • Select rows to batch delete
                            </p>
                        </div>

                        {selectedIds.length > 0 && (
                            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                                {selectedIds.length} selected for deletion
                            </span>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b dark:border-slate-800 border-slate-200 dark:bg-slate-950/60 bg-slate-50 text-[11px] font-semibold dark:text-slate-400 text-slate-500 uppercase tracking-wider">
                                    {/* Select All Checkbox */}
                                    <th className="py-3 px-4 w-10 text-center">
                                        <input
                                            type="checkbox"
                                            checked={isAllSelected}
                                            onChange={toggleSelectAll}
                                            className="rounded-sm dark:bg-slate-900 border-slate-400 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer w-4 h-4"
                                            title={isAllSelected ? 'Deselect all rows' : 'Select all rows on this page'}
                                        />
                                    </th>
                                    <th className="py-3 px-4">Domain & Target Business</th>
                                    <th className="py-3 px-4">Services Detected</th>
                                    <th className="py-3 px-4">Contact Points Found</th>
                                    <th className="py-3 px-4">Detected Gaps / Deficiencies</th>
                                    <th className="py-3 px-4">Readiness Score</th>
                                    <th className="py-3 px-4">CRM Status</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-slate-800/60 divide-slate-200 text-xs dark:text-slate-300 text-slate-700">
                                {audits.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-8 text-center text-slate-500">
                                            No websites scanned yet. Enter a website URL above to start auditing!
                                        </td>
                                    </tr>
                                ) : (
                                    audits.data.map((audit) => {
                                        const isSelected = selectedIds.includes(audit.id);
                                        return (
                                            <tr
                                                key={audit.id}
                                                className={`transition ${
                                                    isSelected
                                                        ? 'dark:bg-indigo-950/30 bg-indigo-50/50'
                                                        : 'dark:hover:bg-slate-900/30 hover:bg-slate-50'
                                                }`}
                                            >
                                                {/* Row Selection Checkbox */}
                                                <td className="py-3.5 px-4 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => toggleSelectOne(audit.id)}
                                                        className="rounded-sm dark:bg-slate-900 border-slate-400 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer w-4 h-4"
                                                        title="Select this row"
                                                    />
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    <div>
                                                        <div className="font-semibold dark:text-white text-slate-900 flex items-center gap-1.5">
                                                            <span>{audit.company_name || audit.domain}</span>
                                                            <a
                                                                href={audit.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                                                            >
                                                                <ExternalLink className="w-3 h-3" />
                                                            </a>
                                                        </div>
                                                        <div className="text-[11px] dark:text-slate-400 text-slate-500 font-mono">
                                                            {audit.domain}
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center gap-1 flex-wrap max-w-xs">
                                                        {audit.services && audit.services.length > 0 ? (
                                                            audit.services.slice(0, 2).map((s, i) => (
                                                                <span
                                                                    key={i}
                                                                    className="px-1.5 py-0.5 rounded-sm text-[10px] font-medium dark:bg-slate-900 bg-slate-100 border dark:border-slate-800 border-slate-300 dark:text-slate-300 text-slate-700"
                                                                >
                                                                    {s}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-slate-400 text-[11px]">General</span>
                                                        )}
                                                        {(audit.services?.length || 0) > 2 && (
                                                            <span className="text-[10px] text-slate-400">
                                                                +{(audit.services?.length || 0) - 2} more
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    <div className="text-[11px] space-y-0.5">
                                                        {audit.contact_info?.emails && audit.contact_info.emails.length > 0 && (
                                                            <div className="dark:text-slate-300 text-slate-700 truncate max-w-[150px]">
                                                                {audit.contact_info.emails[0]}
                                                            </div>
                                                        )}
                                                        {audit.contact_info?.phones && audit.contact_info.phones.length > 0 && (
                                                            <div className="text-slate-400">
                                                                {audit.contact_info.phones[0]}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    <div className="space-y-1">
                                                        {audit.missing_tools?.slice(0, 2).map((m, i) => (
                                                            <div key={i} className="flex items-center gap-1.5 text-[10px] text-amber-500 dark:text-amber-400">
                                                                <ShieldAlert className="w-3 h-3 flex-shrink-0" />
                                                                <span className="truncate max-w-[180px]">{m.tool}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    <span className={`px-2 py-0.5 rounded-sm font-bold text-xs ${
                                                        audit.audit_score >= 70
                                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                                    }`}>
                                                        {audit.audit_score} / 100
                                                    </span>
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    {audit.converted_contact_id ? (
                                                        <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase">
                                                            In CRM Pipeline
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold dark:bg-slate-800 bg-slate-200 dark:text-slate-400 text-slate-700 uppercase">
                                                            Unclaimed Lead
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="py-3.5 px-4 text-right">
                                                    <div className="inline-flex items-center gap-1.5 justify-end">
                                                        <Link
                                                            href={`/crawler/${audit.id}`}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-sm bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 text-xs font-semibold transition cursor-pointer"
                                                        >
                                                            <span>View Report</span>
                                                            <ArrowUpRight className="w-3.5 h-3.5" />
                                                        </Link>

                                                        {/* Delete Button */}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSingleDelete(audit.id, audit.company_name || audit.domain)}
                                                            className="p-1.5 rounded-sm text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                                                            title={`Delete audit for ${audit.domain}`}
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {audits.links && audits.links.length > 3 && (
                        <div className="p-3 border-t dark:border-slate-800 border-slate-200 flex items-center justify-between">
                            <span className="text-xs dark:text-slate-400 text-slate-500">
                                Page {audits.current_page} of {audits.last_page} ({audits.total} total audits)
                            </span>
                            <div className="flex items-center gap-1">
                                {audits.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-2.5 py-1 text-xs rounded-sm transition cursor-pointer ${
                                            link.active
                                                ? 'bg-indigo-600 text-white font-bold'
                                                : link.url
                                                ? 'dark:bg-slate-800 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                                                : 'opacity-40 cursor-not-allowed text-slate-400'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

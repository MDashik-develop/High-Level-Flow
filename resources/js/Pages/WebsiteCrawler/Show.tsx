import React, { useState } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Globe,
    ArrowLeft,
    ShieldAlert,
    CheckCircle2,
    Copy,
    Check,
    Mail,
    Phone,
    Share2,
    ExternalLink,
    Sparkles,
    Users,
    Cpu,
    Building2,
} from 'lucide-react';
import { WebsiteAudit } from '../../types';

interface Props {
    audit: WebsiteAudit;
}

export default function WebsiteCrawlerShow({ audit }: Props) {
    const [copied, setCopied] = useState(false);
    const [converting, setConverting] = useState(false);

    const handleCopyPitch = () => {
        if (!audit.generated_pitch) return;
        navigator.clipboard.writeText(audit.generated_pitch);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleConvertToLead = () => {
        setConverting(true);
        router.post(`/crawler/${audit.id}/convert-to-lead`, {}, {
            onFinish: () => setConverting(false),
        });
    };

    return (
        <AppLayout title={`Audit: ${audit.company_name || audit.domain}`}>
            <Head title={`${audit.domain} - Website Intelligence Report`} />

            <div className="space-y-6">
                {/* Header Back & Primary Conversion Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b dark:border-slate-800 border-slate-200">
                    <div>
                        <Link
                            href="/crawler"
                            className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold mb-1"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Back to Web Crawler</span>
                        </Link>

                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold tracking-tight dark:text-white text-slate-900 flex items-center gap-2">
                                <span>{audit.company_name || audit.domain}</span>
                                <a
                                    href={audit.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </h1>
                            <span className="text-xs px-2 py-0.5 rounded-sm dark:bg-slate-800 bg-slate-200 dark:text-slate-300 text-slate-700 border dark:border-slate-700 border-slate-300 font-mono">
                                {audit.domain}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {audit.converted_contact_id ? (
                            <Link
                                href={`/contacts?search=${audit.company_name || audit.domain}`}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Converted to CRM Lead</span>
                            </Link>
                        ) : (
                            <button
                                onClick={handleConvertToLead}
                                disabled={converting}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition"
                            >
                                <Sparkles className="w-4 h-4" />
                                <span>Convert to Lead & Create $1,500 Deal</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Score & Summary Banner */}
                <div className="p-5 rounded-sm dark:bg-gradient-to-r dark:from-slate-900 dark:via-[#0b1120] dark:to-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-sm flex flex-col items-center justify-center border font-bold text-center ${
                            audit.audit_score >= 70
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                                : 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                        }`}>
                            <span className="text-xl leading-none">{audit.audit_score}</span>
                            <span className="text-[10px] dark:text-slate-400 text-slate-500 uppercase tracking-tighter mt-0.5">Score</span>
                        </div>
                        <div>
                            <h2 className="text-sm font-bold dark:text-white text-slate-900">Lead Readiness & Optimization Potential</h2>
                            <p className="text-xs dark:text-slate-300 text-slate-600 mt-1 max-w-xl">
                                {audit.audit_summary || 'Detailed marketing and infrastructure crawl complete.'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs dark:text-slate-400 text-slate-600 divide-x dark:divide-slate-800 divide-slate-200 pl-4 border-t md:border-t-0 md:border-l dark:border-slate-800 border-slate-200 w-full md:w-auto">
                        <div className="pr-4">
                            <span className="dark:text-slate-500 text-slate-400 block text-[10px] uppercase">Services Found</span>
                            <strong className="dark:text-white text-slate-900 text-sm">{audit.services?.length || 0} Core Services</strong>
                        </div>
                        <div className="pl-4">
                            <span className="dark:text-slate-500 text-slate-400 block text-[10px] uppercase">Detected Gaps</span>
                            <strong className="text-amber-500 dark:text-amber-400 text-sm">{audit.missing_tools?.length || 0} Growth Leaks</strong>
                        </div>
                    </div>
                </div>

                {/* Grid of Extracted Data */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left 2 Cols: Services, Missing Tools, and Cold Outreach Pitch */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Extracted Core Services */}
                        <div className="p-4 rounded-sm dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 shadow-sm space-y-3">
                            <h3 className="text-xs font-bold dark:text-slate-300 text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                <Building2 className="w-4 h-4 text-indigo-500" />
                                <span>Extracted Business Services & Offerings</span>
                            </h3>

                            <div className="flex items-center gap-2 flex-wrap">
                                {audit.services && audit.services.length > 0 ? (
                                    audit.services.map((s, idx) => (
                                        <div
                                            key={idx}
                                            className="px-2.5 py-1 rounded-sm dark:bg-slate-900 bg-slate-100 border dark:border-slate-700 border-slate-300 text-xs font-medium dark:text-slate-200 text-slate-800"
                                        >
                                            {s}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-xs dark:text-slate-500 text-slate-400">No specific services detected.</div>
                                )}
                            </div>
                        </div>

                        {/* Identified Leaks & Deficiencies */}
                        <div className="p-4 rounded-sm dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 shadow-sm space-y-3">
                            <h3 className="text-xs font-bold dark:text-slate-300 text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                <ShieldAlert className="w-4 h-4 text-amber-500" />
                                <span>Detected Conversion Bottlenecks (The Leaks to Pitch)</span>
                            </h3>

                            <div className="space-y-2">
                                {audit.missing_tools?.map((m, idx) => (
                                    <div
                                        key={idx}
                                        className="p-3 rounded-sm dark:bg-slate-950/60 bg-slate-50 border dark:border-slate-800/80 border-slate-200 space-y-1"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold dark:text-white text-slate-900 flex items-center gap-1.5">
                                                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                                <span>{m.tool}</span>
                                            </span>
                                            <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-sm bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                                                {m.impact} Impact
                                            </span>
                                        </div>
                                        <p className="text-xs dark:text-slate-400 text-slate-600 pl-3.5">{m.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* AI / Automated Cold Outreach Pitch */}
                        <div className="p-5 rounded-sm dark:bg-[#0b1120] bg-white border dark:border-indigo-500/30 border-indigo-200 shadow-sm space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-bold dark:text-white text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                                    <Sparkles className="w-4 h-4 text-indigo-500" />
                                    <span>High-Converting Cold Outreach Pitch</span>
                                </h3>

                                <button
                                    onClick={handleCopyPitch}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition"
                                >
                                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    <span>{copied ? 'Copied to Clipboard!' : 'Copy Pitch Script'}</span>
                                </button>
                            </div>

                            <div className="p-4 rounded-sm dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 font-mono text-xs dark:text-slate-300 text-slate-800 whitespace-pre-wrap leading-relaxed select-text">
                                {audit.generated_pitch}
                            </div>
                        </div>
                    </div>

                    {/* Right 1 Col: Contact Discovery & Tech Stack */}
                    <div className="space-y-6">
                        {/* Contact Points Found */}
                        <div className="p-4 rounded-sm dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 shadow-sm space-y-3">
                            <h3 className="text-xs font-bold dark:text-slate-300 text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                <Users className="w-4 h-4 text-indigo-500" />
                                <span>Extracted Contact Points</span>
                            </h3>

                            <div className="space-y-3 text-xs">
                                <div>
                                    <span className="dark:text-slate-500 text-slate-400 text-[11px] block mb-1">Emails Discovered:</span>
                                    {audit.contact_info?.emails && audit.contact_info.emails.length > 0 ? (
                                        <div className="space-y-1">
                                            {audit.contact_info.emails.map((email, i) => (
                                                <a
                                                    key={i}
                                                    href={`mailto:${email}`}
                                                    className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 hover:underline"
                                                >
                                                    <Mail className="w-3.5 h-3.5" />
                                                    <span>{email}</span>
                                                </a>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="dark:text-slate-500 text-slate-400 text-xs">No public emails in HTML</span>
                                    )}
                                </div>

                                <div>
                                    <span className="dark:text-slate-500 text-slate-400 text-[11px] block mb-1">Phone Numbers:</span>
                                    {audit.contact_info?.phones && audit.contact_info.phones.length > 0 ? (
                                        <div className="space-y-1">
                                            {audit.contact_info.phones.map((phone, i) => (
                                                <a
                                                    key={i}
                                                    href={`tel:${phone}`}
                                                    className="flex items-center gap-1.5 dark:text-slate-300 text-slate-700 hover:text-indigo-600 dark:hover:text-white"
                                                >
                                                    <Phone className="w-3.5 h-3.5" />
                                                    <span>{phone}</span>
                                                </a>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="dark:text-slate-500 text-slate-400 text-xs">No phone numbers in HTML</span>
                                    )}
                                </div>

                                {audit.contact_info?.socials && Object.keys(audit.contact_info.socials).length > 0 && (
                                    <div>
                                        <span className="dark:text-slate-500 text-slate-400 text-[11px] block mb-1">Social Channels:</span>
                                        <div className="space-y-1">
                                            {Object.entries(audit.contact_info.socials).map(([net, sUrl], i) => (
                                                <a
                                                    key={i}
                                                    href={sUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 dark:text-slate-400 text-slate-600 hover:text-indigo-600 dark:hover:text-white truncate"
                                                >
                                                    <Share2 className="w-3.5 h-3.5" />
                                                    <span className="capitalize">{net.replace('.com', '')}</span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tech Stack & Pixels */}
                        <div className="p-4 rounded-sm dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 shadow-sm space-y-3">
                            <h3 className="text-xs font-bold dark:text-slate-300 text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                <Cpu className="w-4 h-4 text-indigo-500" />
                                <span>Detected Tech Stack</span>
                            </h3>

                            <div className="space-y-2 text-xs">
                                {audit.tech_stack && Object.keys(audit.tech_stack).length > 0 ? (
                                    Object.entries(audit.tech_stack).map(([k, v], idx) => (
                                        <div
                                            key={idx}
                                            className="p-2.5 rounded-sm dark:bg-slate-950/60 bg-slate-50 border dark:border-slate-800/80 border-slate-200 flex items-center justify-between"
                                        >
                                            <span className="dark:text-slate-400 text-slate-600 font-medium">{k}</span>
                                            <span className="dark:text-white text-slate-900 font-semibold">{v}</span>
                                        </div>
                                    ))
                                ) : (
                                    <span className="dark:text-slate-500 text-slate-400">Custom web setup</span>
                                )}
                            </div>
                        </div>

                        {/* Metadata Details */}
                        <div className="p-4 rounded-sm dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 shadow-sm space-y-2 text-xs">
                            <h3 className="text-[11px] font-bold dark:text-slate-400 text-slate-600 uppercase tracking-wider">SEO Metadata</h3>
                            <div>
                                <span className="dark:text-slate-500 text-slate-400 text-[10px] uppercase block">Page Title</span>
                                <p className="dark:text-slate-300 text-slate-800 font-medium text-xs mt-0.5">{audit.title || 'None'}</p>
                            </div>
                            <div className="pt-2">
                                <span className="dark:text-slate-500 text-slate-400 text-[10px] uppercase block">Meta Description</span>
                                <p className="dark:text-slate-400 text-slate-600 text-xs mt-0.5">{audit.meta_description || 'None'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

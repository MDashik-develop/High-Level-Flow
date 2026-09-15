import React, { useState } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
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
    Bot,
    Power,
    ChevronDown,
    ChevronUp,
    Plus,
    Download,
    Code2,
    Layers,
    Zap,
    ArrowRight,
    FileJson,
    AlertTriangle,
    Lightbulb,
    Palette,
    HelpCircle,
    X,
    Info,
    Calendar,
    MessageSquare,
    DollarSign,
    Target,
} from 'lucide-react';
import { WebsiteAudit, IntegrationSetting } from '../../types';
import { generateAiPitchDirect, runAiAuditDirect } from '../../Services/aiService';

interface Props {
    audit: WebsiteAudit;
    activeAiServices?: Array<{
        provider: string;
        name: string;
        is_active: boolean;
        is_sandbox: boolean;
        credentials?: Record<string, string>;
    }>;
}

export default function WebsiteCrawlerShow({ audit, activeAiServices }: Props) {
    const { props } = usePage<any>();
    const flash = props?.flash || {};

    const [copiedPitch, setCopiedPitch] = useState(false);
    const [copiedJson, setCopiedJson] = useState(false);
    const [converting, setConverting] = useState(false);
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [isDeepAuditing, setIsDeepAuditing] = useState(false);

    const [generatedPitchText, setGeneratedPitchText] = useState<string>(audit.generated_pitch || '');
    const [redesignState, setRedesignState] = useState<any>(audit.redesign_data);
    const [aiNoticeText, setAiNoticeText] = useState<string | null>(null);

    // Custom prompt toggle & input
    const [showCustomPrompt, setShowCustomPrompt] = useState(false);
    const [customInstruction, setCustomInstruction] = useState('');

    // Help modal toggle
    const [showHelpModal, setShowHelpModal] = useState(false);

    // Raw JSON drawer/view toggle
    const [showRawJson, setShowRawJson] = useState(false);

    const isHfActive = activeAiServices ? activeAiServices.some((s) => s.provider === 'huggingface' && s.is_active) : true;
    const isOpenAiActive = activeAiServices ? activeAiServices.some((s) => s.provider === 'openai' && s.is_active) : false;
    const hfService = activeAiServices?.find((s) => s.provider === 'huggingface');
    const openAiService = activeAiServices?.find((s) => s.provider === 'openai');
    const hfModel = hfService?.credentials?.model || 'meta-llama/Llama-3.1-8B-Instruct';
    const openAiModel = openAiService?.credentials?.model || 'gpt-4o';

    const handleRunDeepAiAudit = async (provider: string = 'huggingface') => {
        setIsDeepAuditing(true);
        setAiNoticeText(null);
        const res = await runAiAuditDirect({
            audit_id: audit.id,
            provider,
        });
        setIsDeepAuditing(false);

        if (res && res.redesign_data) {
            setRedesignState(res.redesign_data);
        }
        if (res && res.notice) {
            setAiNoticeText(res.notice);
        }
    };

    // Compile comprehensive JSON data payload
    const compiledFullJson = audit.raw_data || {
        metadata: {
            target_url: audit.url,
            resolved_domain: audit.domain,
            company_name: audit.company_name || audit.domain,
            page_title: audit.title,
            meta_description: audit.meta_description,
            audit_score: audit.audit_score,
            scraped_at: audit.created_at,
        },
        services_extracted: audit.services || [],
        contact_intelligence: audit.contact_info || { emails: [], phones: [], socials: {} },
        detected_tech_stack: audit.tech_stack || {},
        identified_conversion_gaps: audit.missing_tools || [],
        redesign_assessment: redesignState || audit.redesign_data || null,
        tailored_cold_pitch: generatedPitchText || audit.generated_pitch,
    };

    const handleCopyPitch = () => {
        if (!audit.generated_pitch) return;
        navigator.clipboard.writeText(audit.generated_pitch);
        setCopiedPitch(true);
        setTimeout(() => setCopiedPitch(false), 2000);
    };

    const handleCopyAllDataJson = () => {
        const jsonString = JSON.stringify(compiledFullJson, null, 2);
        navigator.clipboard.writeText(jsonString);
        setCopiedJson(true);
        setTimeout(() => setCopiedJson(false), 2500);
    };

    const handleExportJson = () => {
        const jsonString = JSON.stringify(compiledFullJson, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit-${audit.domain}-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleConvertToLead = () => {
        setConverting(true);
        router.post(`/crawler/${audit.id}/convert-to-lead`, {}, {
            onFinish: () => setConverting(false),
        });
    };

    const handleAiRewrite = async (provider: string = 'huggingface') => {
        setIsRegenerating(true);
        setAiNoticeText(null);
        const res = await generateAiPitchDirect({
            audit_id: audit.id,
            provider,
            custom_instruction: customInstruction.trim(),
        });
        setIsRegenerating(false);

        if (res.content) {
            setGeneratedPitchText(res.content);
        }
        if (res.notice) {
            setAiNoticeText(res.notice);
        }
    };

    const handleApplyPromptPreset = (presetText: string) => {
        setCustomInstruction((prev) => {
            const cleanPrev = prev.trim();
            if (!cleanPrev) return presetText;
            if (cleanPrev.includes(presetText)) return cleanPrev;
            return `${cleanPrev}. ${presetText}`;
        });
        if (!showCustomPrompt) {
            setShowCustomPrompt(true);
        }
    };

    const redesign = redesignState || audit.redesign_data;

    return (
        <AppLayout title={`Audit: ${audit.company_name || audit.domain}`}>
            <Head title={`${audit.domain} - Website Intelligence & Redesign Report`} />

            <div className="space-y-6">
                {/* Responsive Header Section */}
                <div className="pb-4 border-b dark:border-slate-800 border-slate-200 space-y-3">
                    {/* Top Row: Back link & Quick Guide button */}
                    <div className="flex items-center justify-between">
                        <Link
                            href="/crawler"
                            className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-semibold cursor-pointer transition group"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                            <span>Back to Web Crawler</span>
                        </Link>

                        <button
                            type="button"
                            onClick={() => setShowHelpModal(true)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full dark:bg-slate-800 bg-slate-100 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 dark:text-slate-300 text-slate-700 hover:text-indigo-600 dark:hover:text-indigo-300 border dark:border-slate-700 border-slate-300 transition cursor-pointer"
                        >
                            <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
                            <span>How This Page Works</span>
                        </button>
                    </div>

                    {/* Main Row: Title, Domain, Help Circle, and Action Buttons */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Title & Badges */}
                        <div className="flex items-center gap-2.5 flex-wrap">
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight dark:text-white text-slate-900 flex items-center gap-2">
                                <span>{audit.company_name || audit.domain}</span>
                                <a
                                    href={audit.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
                                    title="Open website in new tab"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </h1>

                            <span className="text-xs px-2.5 py-1 rounded-sm dark:bg-slate-800 bg-slate-200 dark:text-slate-300 text-slate-700 border dark:border-slate-700 border-slate-300 font-mono">
                                {audit.domain}
                            </span>

                            {/* Rounded ? Modal Button */}
                            <button
                                type="button"
                                onClick={() => setShowHelpModal(true)}
                                className="w-6 h-6 rounded-full inline-flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-950/60 dark:text-indigo-400 border dark:border-indigo-500/30 border-indigo-200 text-xs font-bold transition shadow-sm cursor-pointer hover:scale-105 active:scale-95 shrink-0"
                                title="Click to view full step-by-step guide for this page"
                                aria-label="Step by step explanation"
                            >
                                <HelpCircle className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* Action Buttons Group */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                            {/* Copy All Data Button */}
                            <button
                                type="button"
                                onClick={handleCopyAllDataJson}
                                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-sm text-xs font-semibold border transition shadow-sm cursor-pointer ${
                                    copiedJson
                                        ? 'bg-emerald-500 text-white border-emerald-600'
                                        : 'dark:bg-slate-800 bg-white dark:hover:bg-slate-700 hover:bg-slate-50 dark:text-slate-200 text-slate-800 dark:border-slate-700 border-slate-300'
                                }`}
                                title="Copy all extracted website data as a structured JSON object"
                            >
                                {copiedJson ? <Check className="w-3.5 h-3.5" /> : <FileJson className="w-3.5 h-3.5 text-indigo-500" />}
                                <span>{copiedJson ? 'Copied All JSON Data!' : 'Copy All Data (JSON)'}</span>
                            </button>

                            {/* Export JSON File */}
                            <button
                                type="button"
                                onClick={handleExportJson}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm dark:bg-slate-800 bg-white dark:hover:bg-slate-700 hover:bg-slate-50 dark:text-slate-300 text-slate-700 border dark:border-slate-700 border-slate-300 text-xs font-semibold shadow-sm transition cursor-pointer"
                                title="Download JSON file of this website audit"
                            >
                                <Download className="w-3.5 h-3.5" />
                                <span>Export JSON</span>
                            </button>

                            {/* Lead Conversion */}
                            {audit.converted_contact_id ? (
                                <Link
                                    href={`/contacts?search=${audit.company_name || audit.domain}`}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-sm bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold cursor-pointer hover:bg-emerald-500/20 transition"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Converted to CRM Lead</span>
                                </Link>
                            ) : (
                                <button
                                    onClick={handleConvertToLead}
                                    disabled={converting}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition cursor-pointer"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    <span>Convert to Lead & Create $1,500 Deal</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Score & Summary Banner */}
                <div className="p-5 rounded-sm dark:bg-gradient-to-r dark:from-slate-900 dark:via-[#0b1120] dark:to-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div
                            className={`w-16 h-16 rounded-sm flex flex-col items-center justify-center border font-bold text-center ${
                                audit.audit_score >= 70
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                                    : 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                            }`}
                        >
                            <span className="text-xl leading-none">{audit.audit_score}</span>
                            <span className="text-[10px] dark:text-slate-400 text-slate-500 uppercase tracking-tighter mt-0.5">Score</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-sm font-bold dark:text-white text-slate-900">Lead Readiness & Optimization Potential</h2>
                                <span className="text-[10px] px-2 py-0.5 rounded-sm bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-semibold">
                                    High Conversion Opportunity
                                </span>
                            </div>
                            <p className="text-xs dark:text-slate-300 text-slate-600 mt-1 max-w-xl">
                                {audit.audit_summary || 'Detailed marketing, speed-to-lead and conversion funnel crawl complete.'}
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
                        <div className="pl-4">
                            <span className="dark:text-slate-500 text-slate-400 block text-[10px] uppercase">Modernization Score</span>
                            <strong className="text-indigo-500 dark:text-indigo-400 text-sm">
                                {redesign?.modernization_score ? `${redesign.modernization_score}/100` : '88/100'}
                            </strong>
                        </div>
                    </div>
                </div>

                {/* 3-COLUMN STRATEGIC AGENCY AUDIT LIST SECTION */}
                <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-2">
                                    <Layers className="w-4 h-4 text-indigo-500" />
                                    <span>Agency Client Assessment & Redesign Blueprint</span>
                                </h2>
                                <span className="text-[10px] px-2 py-0.5 rounded-sm bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-bold uppercase tracking-tight">
                                    2026 Standard
                                </span>
                            </div>
                            <p className="text-xs dark:text-slate-400 text-slate-500 mt-0.5">
                                3-Point strategic breakdown: 2026 conversion gaps, recommended high-ROI additions, and redesign feasibility.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Run Deep AI Audit Button */}
                            <button
                                type="button"
                                disabled={isDeepAuditing}
                                onClick={() => handleRunDeepAiAudit(isHfActive ? 'huggingface' : isOpenAiActive ? 'openai' : 'huggingface')}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm dark:bg-purple-500/15 bg-purple-50 dark:text-purple-300 text-purple-700 border border-purple-500/30 hover:bg-purple-500/25 text-xs font-semibold shadow-sm transition cursor-pointer disabled:opacity-50"
                                title="Run Deep 2026 AI Audit on this business to extract more gaps and niche ideas"
                            >
                                <Bot className={`w-3.5 h-3.5 text-purple-500 ${isDeepAuditing ? 'animate-spin' : ''}`} />
                                <span>{isDeepAuditing ? 'Auditing with AI...' : 'Deep AI 2026 Audit'}</span>
                            </button>

                            <Link
                                href="/funnels"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition cursor-pointer"
                            >
                                <Zap className="w-3.5 h-3.5" />
                                <span>Launch Funnel Builder</span>
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {/* 1. কি কি কম আছে (Identified Gaps & Missing Features) */}
                        <div className="p-4 rounded-sm dark:bg-[#0b1120] bg-white border dark:border-rose-500/30 border-rose-200 shadow-sm space-y-3">
                            <div className="flex items-center justify-between border-b dark:border-slate-800 border-slate-100 pb-2.5">
                                <div>
                                    <h3 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                                        <AlertTriangle className="w-4 h-4 text-rose-500" />
                                        <span>১. কি কি কম আছে (Website Gaps)</span>
                                    </h3>
                                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                                        2026 Conversion Checks
                                    </span>
                                </div>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                                    {audit.missing_tools?.length || 0} Bottlenecks
                                </span>
                            </div>

                            <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                                {audit.missing_tools && audit.missing_tools.length > 0 ? (
                                    audit.missing_tools.map((m, idx) => (
                                        <div
                                            key={idx}
                                            className="p-3 rounded-sm dark:bg-slate-950/70 bg-rose-50/40 border dark:border-slate-800 border-rose-100 space-y-1"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold dark:text-white text-slate-900 flex items-center gap-1.5">
                                                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                                                    <span>{m.tool}</span>
                                                </span>
                                                <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded-sm bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                                                    {m.impact} Impact
                                                </span>
                                            </div>
                                            <p className="text-xs dark:text-slate-400 text-slate-600 pl-3.5 leading-relaxed">
                                                {m.description}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs dark:text-slate-400 text-slate-500">No critical missing tools identified.</p>
                                )}

                                {redesign?.critique_points && (
                                    <div className="pt-2 border-t dark:border-slate-800 border-slate-100 space-y-1.5">
                                        <span className="text-[11px] font-semibold dark:text-slate-400 text-slate-600 block">
                                            Structural Weaknesses:
                                        </span>
                                        {redesign.critique_points.map((critique, cIdx) => (
                                            <div key={cIdx} className="flex items-start gap-1.5 text-xs dark:text-slate-300 text-slate-700">
                                                <span className="text-rose-500 font-bold mt-0.5">•</span>
                                                <span className="leading-snug">{critique}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 2. কি কি আরো add করা যাবে (Growth Additions & Upsell) */}
                        <div className="p-4 rounded-sm dark:bg-[#0b1120] bg-white border dark:border-emerald-500/30 border-emerald-200 shadow-sm space-y-3">
                            <div className="flex items-center justify-between border-b dark:border-slate-800 border-slate-100 pb-2.5">
                                <div>
                                    <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                                        <Lightbulb className="w-4 h-4 text-emerald-500" />
                                        <span>২. কি কি আরো Add করা যাবে</span>
                                    </h3>
                                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                                        2026 High-ROI Features
                                    </span>
                                </div>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                    Agency Upsells
                                </span>
                            </div>

                            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                                {(
                                    redesign?.recommended_additions || [
                                        '24/7 AI Voice & SMS Booking Concierge (Answers customer calls & SMS round the clock)',
                                        '1-Click Direct WhatsApp Quick-Chat Widget with instant automated welcome sequence',
                                        'Speed-to-Lead 2-Way SMS Auto-Responder (< 2 min instant follow-up for every lead)',
                                        'Interactive Multi-Step Pricing & Quote Calculator (pre-qualifies high-ticket customers)',
                                        'Sticky Mobile Floating Action Bar (Instant Call, WhatsApp, Book Now, GPS Directions)',
                                        'Automated Google Review NFC Smart Tap Card & Automated SMS Review Harvester',
                                        'Server-Side Meta CAPI & Google Consent Mode v2 (captures 100% of conversion events bypassing ad blockers)',
                                        'Exit-Intent High-Ticket Offer Popup (recovers up to 18% of abandoning site visitors)',
                                    ]
                                ).map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="p-2.5 rounded-sm dark:bg-slate-950/70 bg-emerald-50/40 border dark:border-slate-800 border-emerald-100 flex items-start gap-2"
                                    >
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                        <p className="text-xs dark:text-slate-200 text-slate-800 font-medium leading-relaxed">
                                            {item}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 3. Redesign করা যাবে কিনা (Feasibility & 4-Step Funnel Blueprint) */}
                        <div className="p-4 rounded-sm dark:bg-[#0b1120] bg-white border dark:border-indigo-500/30 border-indigo-200 shadow-sm space-y-3">
                            <div className="flex items-center justify-between border-b dark:border-slate-800 border-slate-100 pb-2.5">
                                <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <Palette className="w-4 h-4 text-indigo-500" />
                                    <span>৩. Redesign করা যাবে কিনা?</span>
                                </h3>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                                    {redesign?.feasibility || 'Highly Recommended'}
                                </span>
                            </div>

                            <p className="text-xs dark:text-slate-300 text-slate-600 leading-relaxed">
                                {redesign?.summary ||
                                    `Domain ${audit.domain} has strong positioning but functions as an inactive brochure. Implementing an automated conversion funnel can boost inquiries by 35-50%.`}
                            </p>

                            <div className="space-y-2 pt-1">
                                <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 block">
                                    4-Step High-Converting Funnel Blueprint:
                                </span>

                                {(
                                    redesign?.funnel_blueprint || [
                                        {
                                            step: 'Step 1: Conversion-First Hero Section',
                                            action: 'Bold headline with 1-click "Check Availability" CTA above the fold.',
                                        },
                                        {
                                            step: 'Step 2: Interactive Package Selector',
                                            action: 'Transparent service comparison cards with real-time price estimation.',
                                        },
                                        {
                                            step: 'Step 3: 1-Click Calendar Booking',
                                            action: 'Embedded appointment scheduler syncing with real staff availability.',
                                        },
                                        {
                                            step: 'Step 4: Automated Instant SMS & Email Nurture',
                                            action: 'Immediate 2-way SMS confirmation sent to prospect mobile phone.',
                                        },
                                    ]
                                ).map((bp, bpIdx) => (
                                    <div
                                        key={bpIdx}
                                        className="p-2.5 rounded-sm dark:bg-slate-950/80 bg-slate-50 border dark:border-slate-800 border-slate-200"
                                    >
                                        <strong className="text-xs dark:text-white text-slate-900 block font-semibold">
                                            {bp.step}
                                        </strong>
                                        <p className="text-[11px] dark:text-slate-400 text-slate-600 mt-0.5 leading-snug">
                                            {bp.action}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-2">
                                <Link
                                    href="/funnels"
                                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                                >
                                    <Zap className="w-3.5 h-3.5" />
                                    <span>Build High-Converting Funnel Now</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid of Extracted Data & Pitch Script */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left 2 Cols: Services and Cold Outreach Pitch */}
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

                        {/* AI / Automated Cold Outreach Pitch Script Box */}
                        <div className="p-5 rounded-sm dark:bg-[#0b1120] bg-white border dark:border-indigo-500/30 border-indigo-200 shadow-sm space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <h3 className="text-xs font-bold dark:text-white text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                                        <Sparkles className="w-4 h-4 text-indigo-500" />
                                        <span>High-Converting Cold Outreach Pitch</span>
                                    </h3>
                                    <p className="text-[11px] dark:text-slate-400 text-slate-500 mt-0.5">
                                        Personalized cold email & SMS script highlighting specific missing features & value offer.
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    {/* Toggle Custom Instructions Field */}
                                    <button
                                        type="button"
                                        onClick={() => setShowCustomPrompt(!showCustomPrompt)}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border text-xs font-semibold shadow-sm transition cursor-pointer ${
                                            showCustomPrompt || customInstruction.trim()
                                                ? 'bg-indigo-600 text-white border-indigo-600'
                                                : 'dark:bg-slate-800 bg-slate-100 dark:text-slate-200 text-slate-800 dark:border-slate-700 border-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                        }`}
                                        title="Click to expand/collapse custom instructions input field"
                                    >
                                        {showCustomPrompt ? <ChevronUp className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                                        <span>{showCustomPrompt ? 'Hide Instructions' : 'Write Prompt / Instructions'}</span>
                                        {!showCustomPrompt && <ChevronDown className="w-3.5 h-3.5 opacity-60" />}
                                    </button>

                                    {/* Copy Pitch Script Button */}
                                    <button
                                        onClick={handleCopyPitch}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition cursor-pointer"
                                    >
                                        {copiedPitch ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                        <span>{copiedPitch ? 'Copied Pitch Script!' : 'Copy Pitch Script'}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Expandable Custom Instruction Input Field */}
                            {showCustomPrompt && (
                                <div className="p-3.5 rounded-sm dark:bg-slate-900/90 bg-indigo-50/40 border dark:border-indigo-500/40 border-indigo-200 space-y-3 animate-in fade-in duration-200">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold dark:text-indigo-300 text-indigo-900 flex items-center gap-1.5">
                                            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                                            <span>Your Custom Pitch Instructions (Optional)</span>
                                        </label>
                                        <span className="text-[11px] dark:text-slate-400 text-slate-500">
                                            Leave blank to use default agency prompt
                                        </span>
                                    </div>

                                    <textarea
                                        rows={3}
                                        value={customInstruction}
                                        onChange={(e) => setCustomInstruction(e.target.value)}
                                        placeholder="e.g. Focus on their ceramic coating service, add a 15% promotional discount offer for new bookings, and keep the tone friendly and casual..."
                                        className="w-full text-xs rounded-sm dark:bg-slate-950 bg-white border dark:border-slate-700 border-slate-300 dark:text-slate-200 text-slate-800 p-2.5 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none leading-relaxed resize-y"
                                    />

                                    {/* Preset tag chips for fast prompt selection */}
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="text-[10px] dark:text-slate-400 text-slate-500 uppercase tracking-tight mr-1">
                                            Quick Presets:
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleApplyPromptPreset('Include a 20% discount offer for autumn appointments')}
                                            className="text-[10px] px-2 py-0.5 rounded-sm dark:bg-slate-800 bg-white dark:text-slate-300 text-slate-700 border dark:border-slate-700 border-slate-300 hover:border-indigo-500 transition cursor-pointer"
                                        >
                                            🏷️ 20% Discount Offer
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleApplyPromptPreset('Keep it super punchy and under 100 words with a direct 3-minute video ask')}
                                            className="text-[10px] px-2 py-0.5 rounded-sm dark:bg-slate-800 bg-white dark:text-slate-300 text-slate-700 border dark:border-slate-700 border-slate-300 hover:border-indigo-500 transition cursor-pointer"
                                        >
                                            ⚡ Ultra Punchy (&lt; 100 words)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleApplyPromptPreset('Focus heavily on 2-way SMS speed-to-lead and the risk of losing leads to competitors')}
                                            className="text-[10px] px-2 py-0.5 rounded-sm dark:bg-slate-800 bg-white dark:text-slate-300 text-slate-700 border dark:border-slate-700 border-slate-300 hover:border-indigo-500 transition cursor-pointer"
                                        >
                                            📲 Speed-to-Lead Warning
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleApplyPromptPreset('Offer a free mock-up redesign of their landing page with automated booking')}
                                            className="text-[10px] px-2 py-0.5 rounded-sm dark:bg-slate-800 bg-white dark:text-slate-300 text-slate-700 border dark:border-slate-700 border-slate-300 hover:border-indigo-500 transition cursor-pointer"
                                        >
                                            🎨 Free Redesign Preview
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleApplyPromptPreset('Emphasize 24/7 AI Voice receptionist and 1-click WhatsApp photo quotes as their #1 missed revenue opportunity')}
                                            className="text-[10px] px-2 py-0.5 rounded-sm dark:bg-slate-800 bg-white dark:text-slate-300 text-slate-700 border dark:border-slate-700 border-slate-300 hover:border-indigo-500 transition cursor-pointer"
                                        >
                                            🤖 24/7 AI & WhatsApp Focus
                                        </button>
                                        {customInstruction && (
                                            <button
                                                type="button"
                                                onClick={() => setCustomInstruction('')}
                                                className="text-[10px] px-2 py-0.5 rounded-sm text-rose-500 hover:underline ml-auto cursor-pointer"
                                            >
                                                Clear Instructions
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* AI Rewrite Action Bar */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t dark:border-slate-800 border-slate-100">
                                <div className="text-xs dark:text-slate-400 text-slate-500">
                                    <span>AI Engine: </span>
                                    <strong className="dark:text-slate-200 text-slate-800">
                                        {isHfActive ? `Hugging Face (${hfModel.split('/').pop() || hfModel})` : isOpenAiActive ? `OpenAI (${openAiModel})` : 'Simulator Mode'}
                                    </strong>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    {isHfActive && (
                                        <button
                                            type="button"
                                            disabled={isRegenerating}
                                            onClick={() => handleAiRewrite('huggingface')}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm dark:bg-amber-500/10 bg-amber-50 dark:text-amber-400 text-amber-700 border border-amber-500/30 hover:bg-amber-500/20 text-xs font-semibold shadow-sm transition disabled:opacity-50 cursor-pointer"
                                            title={`Rewrite pitch using Hugging Face (${hfModel})`}
                                        >
                                            <Bot className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                                            <span>{isRegenerating ? 'Rewriting with AI...' : `Rewrite with Hugging Face (${hfModel.split('/').pop() || hfModel})`}</span>
                                        </button>
                                    )}

                                    {isOpenAiActive && (
                                        <button
                                            type="button"
                                            disabled={isRegenerating}
                                            onClick={() => handleAiRewrite('openai')}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm dark:bg-purple-500/10 bg-purple-50 dark:text-purple-400 text-purple-700 border border-purple-500/30 hover:bg-purple-500/20 text-xs font-semibold shadow-sm transition disabled:opacity-50 cursor-pointer"
                                            title={`Rewrite pitch using OpenAI (${openAiModel})`}
                                        >
                                            <Sparkles className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                                            <span>{isRegenerating ? 'Rewriting with AI...' : `Rewrite with OpenAI (${openAiModel})`}</span>
                                        </button>
                                    )}

                                    {!isHfActive && !isOpenAiActive && (
                                        <Link
                                            href="/settings/integrations"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 text-xs font-semibold transition cursor-pointer"
                                            title="All AI Models are currently turned OFF. Click to enable in Settings."
                                        >
                                            <Power className="w-3.5 h-3.5 text-rose-500" />
                                            <span>AI Copilot is OFF (Enable in Settings)</span>
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {/* AI Notice Pill if HF credits depleted or fallback used */}
                            {(aiNoticeText || flash.ai_notice) && (
                                <div className="p-3 rounded-sm dark:bg-amber-950/30 bg-amber-50 border dark:border-amber-500/30 border-amber-200 text-xs dark:text-amber-300 text-amber-900 flex items-start gap-2.5 shadow-sm">
                                    <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                    <div className="space-y-0.5">
                                        <span className="font-bold block">AI Engine Notice:</span>
                                        <p className="text-[11px] leading-relaxed opacity-95">{aiNoticeText || flash.ai_notice}</p>
                                    </div>
                                </div>
                            )}

                            {/* Pitch Content Display */}
                            <div className="p-4 rounded-sm dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 font-mono text-xs dark:text-slate-300 text-slate-800 whitespace-pre-wrap leading-relaxed select-text">
                                {generatedPitchText || audit.generated_pitch}
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
                                                    className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
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
                                                    className="flex items-center gap-1.5 dark:text-slate-300 text-slate-700 hover:text-indigo-600 dark:hover:text-white cursor-pointer"
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
                                                    className="flex items-center gap-1.5 dark:text-slate-400 text-slate-600 hover:text-indigo-600 dark:hover:text-white truncate cursor-pointer"
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

                {/* EXPANDABLE FULL JSON INTELLIGENCE ARRAY VIEWER */}
                <div className="p-4 rounded-sm dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => setShowRawJson(!showRawJson)}
                            className="inline-flex items-center gap-2 text-xs font-bold dark:text-slate-300 text-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
                        >
                            <Code2 className="w-4 h-4 text-indigo-500" />
                            <span>Scraped Intelligence Array & Raw JSON Data</span>
                            {showRawJson ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleCopyAllDataJson}
                                className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-sm dark:bg-slate-800 bg-slate-100 border dark:border-slate-700 border-slate-300 font-medium dark:text-slate-300 text-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
                            >
                                {copiedJson ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedJson ? 'Copied!' : 'Copy JSON'}</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleExportJson}
                                className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-sm dark:bg-slate-800 bg-slate-100 border dark:border-slate-700 border-slate-300 font-medium dark:text-slate-300 text-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
                            >
                                <Download className="w-3 h-3" />
                                <span>Export</span>
                            </button>
                        </div>
                    </div>

                    {showRawJson && (
                        <div className="mt-3">
                            <pre className="p-4 rounded-sm dark:bg-slate-950 bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto max-h-[420px] overflow-y-auto leading-relaxed border dark:border-slate-800 border-slate-700">
                                {JSON.stringify(compiledFullJson, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            </div>

            {/* LARGE SCROLLABLE STEP-BY-STEP EXPLANATION MODAL */}
            {showHelpModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setShowHelpModal(false)}
                >
                    <div
                        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-sm dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="p-4 sm:p-5 border-b dark:border-slate-800 border-slate-200 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/40">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-sm bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                                    <HelpCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-sm sm:text-base font-bold dark:text-white text-slate-900 flex items-center gap-2">
                                        <span>How Website Intelligence & Lead Hunter Works</span>
                                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-sm bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                                            Agency Playbook
                                        </span>
                                    </h2>
                                    <p className="text-[11px] dark:text-slate-400 text-slate-500">
                                        Step-by-step methodology from crawling a prospect to closing a $1,500 retainer
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowHelpModal(false)}
                                className="w-8 h-8 rounded-sm inline-flex items-center justify-center dark:text-slate-400 text-slate-500 hover:text-slate-900 dark:hover:text-white dark:hover:bg-slate-800 hover:bg-slate-100 transition cursor-pointer"
                                aria-label="Close modal"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body: Scrollable Detailed Steps */}
                        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                            {/* Mission summary box */}
                            <div className="p-3.5 rounded-sm dark:bg-indigo-950/30 bg-indigo-50/60 border dark:border-indigo-500/30 border-indigo-200 flex items-start gap-3">
                                <Target className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <strong className="dark:text-indigo-200 text-indigo-900 font-semibold block text-xs">
                                        Agency Founder Strategy & Objective
                                    </strong>
                                    <p className="text-[11px] dark:text-indigo-300/80 text-indigo-800 leading-relaxed">
                                        This page turns any target business link into an instant client acquisition proposal. Instead of sending generic cold emails, you present specific conversion gaps discovered on their site, an AI-tailored sales pitch, and a ready-to-deploy 4-step sales funnel.
                                    </p>
                                </div>
                            </div>

                            {/* Step 1 */}
                            <div className="border dark:border-slate-800 border-slate-200 rounded-sm p-4 space-y-2 dark:bg-slate-950/40 bg-slate-50/50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 font-bold dark:text-white text-slate-900 text-xs">
                                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white inline-flex items-center justify-center text-[10px]">1</span>
                                        <Globe className="w-4 h-4 text-indigo-500" />
                                        <span>Automated Web Crawl & Semantic Extraction</span>
                                    </div>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-sm dark:bg-slate-800 bg-slate-200 text-slate-600 dark:text-slate-400 font-mono">
                                        Data Ingestion
                                    </span>
                                </div>
                                <p className="text-xs dark:text-slate-400 text-slate-600 pl-7">
                                    When you submit a URL, the crawler issues a background request using an intelligent headless inspection engine:
                                </p>
                                <ul className="pl-11 list-disc space-y-1 text-[11px] dark:text-slate-300 text-slate-700">
                                    <li><strong>Business Services Extraction:</strong> Scans navigation, headings (H1/H2), and card elements to extract core services offered (e.g. <em>Ceramic Coating, Mobile Detailing, Paint Correction</em>).</li>
                                    <li><strong>Contact Discovery:</strong> Parses HTML text for public email addresses, phone numbers, and social channels (Facebook, Instagram, LinkedIn).</li>
                                    <li><strong>SEO Metadata:</strong> Collects the page title, meta description, and SSL verification status.</li>
                                </ul>
                            </div>

                            {/* Step 2 */}
                            <div className="border dark:border-slate-800 border-slate-200 rounded-sm p-4 space-y-2 dark:bg-slate-950/40 bg-slate-50/50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 font-bold dark:text-white text-slate-900 text-xs">
                                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white inline-flex items-center justify-center text-[10px]">2</span>
                                        <Cpu className="w-4 h-4 text-indigo-500" />
                                        <span>Tech Stack & Ad Pixel Fingerprinting</span>
                                    </div>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-sm dark:bg-slate-800 bg-slate-200 text-slate-600 dark:text-slate-400 font-mono">
                                        Stack Detection
                                    </span>
                                </div>
                                <p className="text-xs dark:text-slate-400 text-slate-600 pl-7">
                                    Identifies third-party scripts running inside the client's code:
                                </p>
                                <ul className="pl-11 list-disc space-y-1 text-[11px] dark:text-slate-300 text-slate-700">
                                    <li><strong>CMS Platform:</strong> WordPress, Shopify, Wix, Webflow, Squarespace, or Custom JAMStack.</li>
                                    <li><strong>Analytics & Ads:</strong> Google Analytics (GA4/GTM), Meta (Facebook) Pixel, TikTok Pixel.</li>
                                    <li><strong>Conversion Widgets:</strong> Calendly booking, Intercom, Crisp, or Tawk.to live chat.</li>
                                </ul>
                            </div>

                            {/* Step 3 */}
                            <div className="border dark:border-rose-500/30 border-rose-200 rounded-sm p-4 space-y-2 dark:bg-rose-950/10 bg-rose-50/30">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 font-bold text-rose-600 dark:text-rose-400 text-xs">
                                        <span className="w-5 h-5 rounded-full bg-rose-600 text-white inline-flex items-center justify-center text-[10px]">3</span>
                                        <AlertTriangle className="w-4 h-4 text-rose-500" />
                                        <span>Conversion Leaks & Bottlenecks ("কি কি কম আছে")</span>
                                    </div>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-bold">
                                        The Pitch Angle
                                    </span>
                                </div>
                                <p className="text-xs dark:text-slate-400 text-slate-600 pl-7">
                                    The system calculates a <strong>Lead Readiness & Audit Score</strong> and flags high-impact deficiencies:
                                </p>
                                <ul className="pl-11 list-disc space-y-1 text-[11px] dark:text-slate-300 text-slate-700">
                                    <li><strong>Missing 24/7 Booking System:</strong> Prospects browsing after-hours cannot reserve an appointment directly, causing an average 40% bounce rate.</li>
                                    <li><strong>Missing 2-Way SMS Speed-to-Lead:</strong> When a prospect submits a contact form, they wait hours or days for an email instead of receiving an automated text within 2 minutes. (Over 60% of leads buy from the first responder).</li>
                                    <li><strong>Missing Retargeting Pixel:</strong> Paid traffic leaves the website forever without building custom audiences for retargeting ads.</li>
                                </ul>
                            </div>

                            {/* Step 4 */}
                            <div className="border dark:border-emerald-500/30 border-emerald-200 rounded-sm p-4 space-y-2 dark:bg-emerald-950/10 bg-emerald-50/30">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white inline-flex items-center justify-center text-[10px]">4</span>
                                        <Lightbulb className="w-4 h-4 text-emerald-500" />
                                        <span>Agency Upsell Checklist ("কি কি আরো Add করা যাবে")</span>
                                    </div>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                                        Revenue Additions
                                    </span>
                                </div>
                                <p className="text-xs dark:text-slate-400 text-slate-600 pl-7">
                                    Provides a high-ticket menu of automation assets your agency can sell to this client:
                                </p>
                                <ul className="pl-11 list-disc space-y-1 text-[11px] dark:text-slate-300 text-slate-700">
                                    <li>Instant 24/7 calendar appointment scheduler synced to staff schedules.</li>
                                    <li>Under-2-minute 2-way SMS speed-to-lead autoresponder.</li>
                                    <li>Sticky floating mobile action bar (Call Now, WhatsApp, Instant Booking).</li>
                                    <li>Multi-step lead qualification quiz to pre-qualify high-ticket buyers.</li>
                                    <li>Automated post-job Google review & testimonial harvester.</li>
                                </ul>
                            </div>

                            {/* Step 5 */}
                            <div className="border dark:border-indigo-500/30 border-indigo-200 rounded-sm p-4 space-y-2 dark:bg-indigo-950/10 bg-indigo-50/30">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400 text-xs">
                                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white inline-flex items-center justify-center text-[10px]">5</span>
                                        <Palette className="w-4 h-4 text-indigo-500" />
                                        <span>Redesign Feasibility & 4-Step Funnel Blueprint ("Redesign করা যাবে কিনা")</span>
                                    </div>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-bold">
                                        Funnel Architecture
                                    </span>
                                </div>
                                <p className="text-xs dark:text-slate-400 text-slate-600 pl-7">
                                    Evaluates modernization potential (Modernization Score 88/100) and maps a direct 4-step sales funnel:
                                </p>
                                <div className="pl-7 grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                    <div className="p-2 rounded-sm dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200">
                                        <strong className="text-[11px] block font-semibold text-indigo-500">Step 1: Hero Section</strong>
                                        <span className="text-[10px] dark:text-slate-400 text-slate-600">Headline focused on core service with 1-click availability CTA.</span>
                                    </div>
                                    <div className="p-2 rounded-sm dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200">
                                        <strong className="text-[11px] block font-semibold text-indigo-500">Step 2: Package Selector</strong>
                                        <span className="text-[10px] dark:text-slate-400 text-slate-600">Interactive tier comparison cards with real-time price estimation.</span>
                                    </div>
                                    <div className="p-2 rounded-sm dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200">
                                        <strong className="text-[11px] block font-semibold text-indigo-500">Step 3: 1-Click Booking</strong>
                                        <span className="text-[10px] dark:text-slate-400 text-slate-600">Embedded scheduler with real-time slots and optional deposit.</span>
                                    </div>
                                    <div className="p-2 rounded-sm dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200">
                                        <strong className="text-[11px] block font-semibold text-indigo-500">Step 4: SMS Nurture</strong>
                                        <span className="text-[10px] dark:text-slate-400 text-slate-600">Instant 2-way SMS confirmation + calendar sync directly to phone.</span>
                                    </div>
                                </div>
                                <div className="pl-7 pt-1">
                                    <Link
                                        href="/funnels"
                                        onClick={() => setShowHelpModal(false)}
                                        className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer"
                                    >
                                        <span>Click here to launch the GrapesJS Visual Funnel Builder</span>
                                        <ArrowRight className="w-3 h-3" />
                                    </Link>
                                </div>
                            </div>

                            {/* Step 6 */}
                            <div className="border dark:border-slate-800 border-slate-200 rounded-sm p-4 space-y-2 dark:bg-slate-950/40 bg-slate-50/50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 font-bold dark:text-white text-slate-900 text-xs">
                                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white inline-flex items-center justify-center text-[10px]">6</span>
                                        <Bot className="w-4 h-4 text-indigo-500" />
                                        <span>AI Pitch Generator with Custom Instructions</span>
                                    </div>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-sm dark:bg-slate-800 bg-slate-200 text-slate-600 dark:text-slate-400 font-mono">
                                        AI Engine
                                    </span>
                                </div>
                                <p className="text-xs dark:text-slate-400 text-slate-600 pl-7">
                                    Creates an email/SMS script ready to copy and paste:
                                </p>
                                <ul className="pl-11 list-disc space-y-1 text-[11px] dark:text-slate-300 text-slate-700">
                                    <li><strong>Default Agency Pitch:</strong> Merges company name, detected services, and detected leaks automatically.</li>
                                    <li><strong>+ Write Prompt Field:</strong> Click the button above the pitch box to add custom directives (e.g. <em>"Offer a 20% autumn discount"</em>, <em>"Keep it under 80 words"</em>).</li>
                                    <li><strong>AI Provider Support:</strong> Runs on live Hugging Face or OpenAI APIs when keys are active, with zero-crash simulator fallback.</li>
                                </ul>
                            </div>

                            {/* Step 7 */}
                            <div className="border dark:border-slate-800 border-slate-200 rounded-sm p-4 space-y-2 dark:bg-slate-950/40 bg-slate-50/50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 font-bold dark:text-white text-slate-900 text-xs">
                                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white inline-flex items-center justify-center text-[10px]">7</span>
                                        <DollarSign className="w-4 h-4 text-emerald-500" />
                                        <span>1-Click CRM Lead & $1,500 Deal Conversion</span>
                                    </div>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                                        Pipeline Automation
                                    </span>
                                </div>
                                <p className="text-xs dark:text-slate-400 text-slate-600 pl-7">
                                    Click <strong>"Convert to Lead & Create $1,500 Deal"</strong> to automatically:
                                </p>
                                <ul className="pl-11 list-disc space-y-1 text-[11px] dark:text-slate-300 text-slate-700">
                                    <li>Create a CRM Contact record with the extracted business name, email, and phone.</li>
                                    <li>Create an Opportunity card in your default Kanban Pipeline worth <strong>$1,500.00</strong>.</li>
                                    <li>Store the complete audit gaps and pitch in the contact notes for your sales team.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t dark:border-slate-800 border-slate-200 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/40">
                            <span className="text-[11px] dark:text-slate-400 text-slate-500">
                                Tip: Use <code className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">Copy All Data (JSON)</code> to store this client's audit externally.
                            </span>
                            <button
                                type="button"
                                onClick={() => setShowHelpModal(false)}
                                className="px-4 py-2 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                            >
                                Got it, Close Guide
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}

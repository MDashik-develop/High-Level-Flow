import React, { useState, useEffect } from 'react';
import AppLayout from '../Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Users,
    DollarSign,
    Layers,
    GitFork,
    Globe,
    ArrowUpRight,
    Megaphone,
    TrendingUp,
    ShieldAlert,
    Clock,
    Plus,
    Flame,
    CheckCircle2,
    Sparkles,
    BarChart3,
    PieChart,
} from 'lucide-react';
import { Contact, WebsiteAudit, Campaign } from '../types';

// Chart.js / Graph JS Registration
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface Props {
    metrics: {
        total_contacts: number;
        hot_leads: number;
        pipeline_value: number;
        win_rate: number;
        funnel_visitors: number;
        funnel_optins: number;
        total_revenue: number;
        active_workflows: number;
    };
    recent_contacts: Contact[];
    recent_audits: WebsiteAudit[];
    recent_campaigns: Campaign[];
}

export default function Dashboard({ metrics, recent_contacts, recent_audits, recent_campaigns }: Props) {
    const [scanUrl, setScanUrl] = useState('');
    const [scanning, setScanning] = useState(false);
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains('dark'));
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains('dark'));
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    const handleQuickScan = (e: React.FormEvent) => {
        e.preventDefault();
        if (!scanUrl) return;
        setScanning(true);
        router.post('/crawler/scan', { url: scanUrl }, {
            onFinish: () => setScanning(false),
        });
    };

    // Chart.js Line Chart Data: Monthly Revenue & Lead Influx
    const lineChartData = {
        labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Current'],
        datasets: [
            {
                label: 'Monthly Retainer Revenue ($)',
                data: [3500, 5200, 7800, 9400, 11200, 13800, metrics.total_revenue || 16500],
                borderColor: '#4f46e5',
                backgroundColor: isDark ? 'rgba(79, 70, 229, 0.15)' : 'rgba(79, 70, 229, 0.08)',
                fill: true,
                tension: 0.35,
                borderWidth: 2,
                pointBackgroundColor: '#6366f1',
                pointRadius: 4,
            },
            {
                label: 'Lead Influx Volume',
                data: [22, 38, 54, 76, 95, 120, (metrics.total_contacts * 10) || 145],
                borderColor: '#10b981',
                backgroundColor: 'transparent',
                borderDash: [5, 5],
                tension: 0.35,
                borderWidth: 2,
                pointBackgroundColor: '#10b981',
                pointRadius: 3,
                yAxisID: 'y1',
            },
        ],
    };

    const lineChartOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: isDark ? '#94a3b8' : '#475569',
                    font: { size: 11, family: 'Plus Jakarta Sans' },
                    boxWidth: 12,
                },
            },
            tooltip: {
                backgroundColor: isDark ? '#0f172a' : '#ffffff',
                titleColor: isDark ? '#ffffff' : '#0f172a',
                bodyColor: isDark ? '#cbd5e1' : '#334155',
                borderColor: isDark ? '#334155' : '#e2e8f0',
                borderWidth: 1,
                padding: 10,
            },
        },
        scales: {
            x: {
                grid: { color: isDark ? '#1e293b' : '#f1f5f9' },
                ticks: { color: isDark ? '#64748b' : '#64748b', font: { size: 10 } },
            },
            y: {
                grid: { color: isDark ? '#1e293b' : '#f1f5f9' },
                ticks: { color: isDark ? '#64748b' : '#64748b', font: { size: 10 } },
            },
            y1: {
                type: 'linear',
                display: false,
                position: 'right',
            },
        },
    };

    // Chart.js Doughnut Chart: Opportunity Stage Allocation
    const doughnutData = {
        labels: ['Audited Leads', 'Pitch Sent', 'Discovery Call', 'Proposal', 'Closed Won'],
        datasets: [
            {
                data: [35, 25, 18, 12, 10],
                backgroundColor: ['#64748b', '#3b82f6', '#f59e0b', '#8b5cf6', '#10b981'],
                borderColor: isDark ? '#0b1120' : '#ffffff',
                borderWidth: 2,
            },
        ],
    };

    const doughnutOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: isDark ? '#94a3b8' : '#475569',
                    font: { size: 10, family: 'Plus Jakarta Sans' },
                    boxWidth: 10,
                },
            },
        },
    };

    return (
        <AppLayout title="Agency Command Dashboard">
            <Head title="Agency Dashboard - HighLevel Flow" />

            <div className="space-y-6">
                {/* Header Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight dark:text-white text-slate-900 flex items-center gap-2">
                            <span>Agency Command Center</span>
                            <span className="text-xs px-2 py-0.5 rounded-sm dark:bg-indigo-500/20 bg-indigo-100 dark:text-indigo-400 text-indigo-700 dark:border-indigo-500/30 border-indigo-200 font-semibold border">
                                Live Operating System
                            </span>
                        </h1>
                        <p className="text-xs dark:text-slate-400 text-slate-500 mt-0.5">
                            Real-time CRM metrics, visual funnel conversion, and website crawler lead acquisition.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/crawler"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition"
                        >
                            <Globe className="w-3.5 h-3.5" />
                            <span>Scan Prospect Site</span>
                        </Link>
                        <Link
                            href="/funnels"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm dark:bg-slate-800 bg-white hover:dark:bg-slate-700 hover:bg-slate-50 dark:text-slate-200 text-slate-800 border dark:border-slate-700 border-slate-300 text-xs font-semibold transition"
                        >
                            <Layers className="w-3.5 h-3.5" />
                            <span>Build Funnel</span>
                        </Link>
                    </div>
                </div>

                {/* Instant Website Lead Hunter Banner */}
                <div className="p-4 sm:p-5 rounded-sm dark:bg-gradient-to-r dark:from-indigo-950/80 dark:via-slate-900 dark:to-slate-900 bg-gradient-to-r from-indigo-50 via-white to-white border dark:border-indigo-500/30 border-indigo-200 shadow-sm relative overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="max-w-xl">
                            <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 text-xs font-semibold tracking-wide uppercase mb-1">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Client Acquisition Engine (Web Crawler)</span>
                            </div>
                            <h2 className="text-base font-bold dark:text-white text-slate-900">
                                Hunt Any Business: Enter a URL to Audit Services & Leaks
                            </h2>
                            <p className="text-xs dark:text-slate-300 text-slate-600 mt-1">
                                Crawls the website, extracts core services, detects missing booking calendars & SMS responders, and writes a tailored cold pitch.
                            </p>
                        </div>

                        <form onSubmit={handleQuickScan} className="flex items-center gap-2 w-full md:w-auto">
                            <div className="relative flex-1 md:w-80">
                                <Globe className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                                <input
                                    type="text"
                                    value={scanUrl}
                                    onChange={(e) => setScanUrl(e.target.value)}
                                    placeholder="e.g. apexsmiles.com or roofingpro.com"
                                    className="w-full dark:bg-slate-950 bg-white border dark:border-slate-700 border-slate-300 rounded-sm pl-9 pr-3 py-2 text-xs dark:text-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={scanning}
                                className="px-4 py-2 rounded-sm bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition whitespace-nowrap shadow-sm"
                            >
                                {scanning ? (
                                    <>
                                        <Clock className="w-3.5 h-3.5 animate-spin" />
                                        <span>Auditing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-3.5 h-3.5" />
                                        <span>Generate Audit</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Primary KPI Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Leads */}
                    <div className="p-4 rounded-sm dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between dark:text-slate-400 text-slate-500 text-xs">
                            <span>Total Leads & Contacts</span>
                            <Users className="w-4 h-4 text-indigo-500" />
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-bold dark:text-white text-slate-900">{metrics.total_contacts}</span>
                            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center">
                                <Flame className="w-3 h-3 mr-0.5 text-amber-500" />
                                {metrics.hot_leads} Hot Leads
                            </span>
                        </div>
                        <div className="mt-2 text-[11px] dark:text-slate-500 text-slate-400">
                            Active in CRM marketing pipelines
                        </div>
                    </div>

                    {/* Pipeline Value */}
                    <div className="p-4 rounded-sm dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between dark:text-slate-400 text-slate-500 text-xs">
                            <span>Open Pipeline Value</span>
                            <DollarSign className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-bold dark:text-white text-slate-900">
                                ${metrics.pipeline_value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                            <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                                {metrics.win_rate}% Win Rate
                            </span>
                        </div>
                        <div className="mt-2 text-[11px] dark:text-slate-500 text-slate-400">
                            Active deals in Kanban stages
                        </div>
                    </div>

                    {/* Funnel Visitors & Opt-Ins */}
                    <div className="p-4 rounded-sm dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between dark:text-slate-400 text-slate-500 text-xs">
                            <span>Funnel Traffic & Opt-ins</span>
                            <Layers className="w-4 h-4 text-sky-500" />
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-bold dark:text-white text-slate-900">{metrics.funnel_visitors.toLocaleString()}</span>
                            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                                {metrics.funnel_optins} Opt-ins (
                                {metrics.funnel_visitors > 0
                                    ? Math.round((metrics.funnel_optins / metrics.funnel_visitors) * 100)
                                    : 0}
                                %)
                            </span>
                        </div>
                        <div className="mt-2 text-[11px] dark:text-slate-500 text-slate-400">
                            Across all sales funnels
                        </div>
                    </div>

                    {/* Total Closed Revenue */}
                    <div className="p-4 rounded-sm dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between dark:text-slate-400 text-slate-500 text-xs">
                            <span>Total Platform Revenue</span>
                            <TrendingUp className="w-4 h-4 text-indigo-500" />
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-bold dark:text-white text-slate-900">
                                ${metrics.total_revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                            <span className="text-[11px] font-medium dark:text-slate-400 text-slate-500">
                                {metrics.active_workflows} Workflows Active
                            </span>
                        </div>
                        <div className="mt-2 text-[11px] dark:text-slate-500 text-slate-400">
                            Stripe checkouts + closed retainer deals
                        </div>
                    </div>
                </div>

                {/* Interactive Graph JS Visualizations Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Graph 1: Revenue & Lead Influx Line Chart */}
                    <div className="lg:col-span-2 rounded-sm dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 p-5 shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-1.5">
                                    <BarChart3 className="w-4 h-4 text-indigo-500" />
                                    <span>Revenue Velocity & Lead Generation Graph</span>
                                </h3>
                                <p className="text-[11px] dark:text-slate-400 text-slate-500 mt-0.5">
                                    Interactive monthly growth metrics powered by Graph JS (Chart.js)
                                </p>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded-sm dark:bg-slate-800 bg-slate-100 dark:text-slate-300 text-slate-700 font-semibold border dark:border-slate-700 border-slate-300">
                                Graph JS Active
                            </span>
                        </div>

                        <div className="h-64 w-full pt-2">
                            <Line data={lineChartData} options={lineChartOptions} />
                        </div>
                    </div>

                    {/* Graph 2: Pipeline Deal Stage Allocation Doughnut Chart */}
                    <div className="rounded-sm dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 p-5 shadow-sm space-y-3 flex flex-col justify-between">
                        <div>
                            <h3 className="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-1.5">
                                <PieChart className="w-4 h-4 text-indigo-500" />
                                <span>Pipeline Stage Distribution</span>
                            </h3>
                            <p className="text-[11px] dark:text-slate-400 text-slate-500 mt-0.5">
                                Opportunity share across qualification funnels
                            </p>
                        </div>

                        <div className="h-56 w-full relative flex items-center justify-center">
                            <Doughnut data={doughnutData} options={doughnutOptions} />
                        </div>
                    </div>
                </div>

                {/* Main Content Grid: 2 Columns */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left 2 Cols: Recent Leads & CRM */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Recent Leads Table Card */}
                        <div className="rounded-sm dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 overflow-hidden shadow-sm">
                            <div className="p-4 border-b dark:border-slate-800 border-slate-200 flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-1.5">
                                        <Users className="w-4 h-4 text-indigo-500" />
                                        <span>Recent Leads & Opportunities</span>
                                    </h3>
                                    <p className="text-[11px] dark:text-slate-400 text-slate-500 mt-0.5">Contacts captured through funnels and website scraper</p>
                                </div>
                                <Link
                                    href="/contacts"
                                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1"
                                >
                                    <span>View All</span>
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>

                            <div className="divide-y dark:divide-slate-800/60 divide-slate-200">
                                {recent_contacts.map((contact) => (
                                    <div
                                        key={contact.id}
                                        className="p-3.5 dark:hover:bg-slate-900/40 hover:bg-slate-50 transition flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-sm dark:bg-slate-800 bg-slate-100 border dark:border-slate-700 border-slate-300 flex items-center justify-center font-bold text-xs dark:text-slate-300 text-slate-700">
                                                {contact.first_name[0]}
                                                {contact.last_name ? contact.last_name[0] : ''}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-semibold dark:text-white text-slate-900">
                                                        {contact.first_name} {contact.last_name}
                                                    </span>
                                                    {contact.company && (
                                                        <span className="text-[11px] dark:text-slate-400 text-slate-500">
                                                            ({contact.company})
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 text-[11px] dark:text-slate-500 text-slate-400 mt-0.5">
                                                    <span>{contact.email || 'No email'}</span>
                                                    <span>•</span>
                                                    <span>{contact.phone || 'No phone'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <div className="flex items-center gap-1 justify-end">
                                                    <Flame className={`w-3.5 h-3.5 ${contact.lead_score >= 80 ? 'text-amber-500' : 'text-slate-400'}`} />
                                                    <span className="text-xs font-bold dark:text-slate-200 text-slate-800">
                                                        Score: {contact.lead_score}
                                                    </span>
                                                </div>
                                                <span className={`text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-sm inline-block mt-0.5 ${
                                                    contact.status === 'hot_prospect'
                                                        ? 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20'
                                                        : contact.status === 'customer'
                                                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                                        : 'dark:bg-slate-800 bg-slate-100 dark:text-slate-400 text-slate-600'
                                                }`}>
                                                    {contact.status.replace('_', ' ')}
                                                </span>
                                            </div>

                                            <Link
                                                href={`/conversations?contact_id=${contact.id}`}
                                                className="p-1.5 rounded-sm border dark:border-slate-700 border-slate-300 dark:hover:bg-slate-800 hover:bg-slate-100 dark:text-slate-300 text-slate-600 transition"
                                                title="Open 2-Way Chat"
                                            >
                                                <ArrowUpRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Campaigns Snippet */}
                        <div className="rounded-sm dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-1.5">
                                    <Megaphone className="w-4 h-4 text-indigo-500" />
                                    <span>Active Broadcast Campaigns</span>
                                </h3>
                                <Link
                                    href="/campaigns"
                                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                                >
                                    New Broadcast
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {recent_campaigns.map((camp) => (
                                    <div
                                        key={camp.id}
                                        className="p-3 rounded-sm border dark:border-slate-800/80 border-slate-200 dark:bg-slate-950/50 bg-slate-50"
                                    >
                                        <div className="flex items-center justify-between text-xs mb-1">
                                            <span className="font-semibold dark:text-slate-200 text-slate-800">{camp.name}</span>
                                            <span className="text-[10px] uppercase px-1.5 py-0.5 rounded-sm bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-bold">
                                                {camp.type}
                                            </span>
                                        </div>
                                        <p className="text-[11px] dark:text-slate-400 text-slate-600 line-clamp-2">{camp.content}</p>
                                        <div className="mt-2.5 pt-2 border-t dark:border-slate-900 border-slate-200 flex items-center justify-between text-[10px] dark:text-slate-500 text-slate-400">
                                            <span>Sent: {camp.sent_count}/{camp.total_recipients}</span>
                                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Delivered: {camp.delivered_count}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right 1 Col: Recent Website Audits & Client Hunting */}
                    <div className="space-y-6">
                        <div className="rounded-sm dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h3 className="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-1.5">
                                        <Globe className="w-4 h-4 text-indigo-500" />
                                        <span>Audited Prospects</span>
                                    </h3>
                                    <p className="text-[11px] dark:text-slate-400 text-slate-500">Scanned websites & ready-to-send pitches</p>
                                </div>
                                <Link
                                    href="/crawler"
                                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                                >
                                    View All
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {recent_audits.map((audit) => (
                                    <Link
                                        key={audit.id}
                                        href={`/crawler/${audit.id}`}
                                        className="block p-3 rounded-sm border dark:border-slate-800 border-slate-200 dark:bg-slate-900/30 bg-slate-50 hover:border-slate-400 dark:hover:border-slate-700 transition"
                                    >
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-xs font-semibold dark:text-white text-slate-900 truncate max-w-[170px]">
                                                {audit.company_name || audit.domain}
                                            </span>
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${
                                                audit.audit_score >= 70
                                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                            }`}>
                                                Score: {audit.audit_score}/100
                                            </span>
                                        </div>

                                        <p className="text-[11px] dark:text-slate-400 text-slate-500 line-clamp-1 mb-2">
                                            {audit.domain}
                                        </p>

                                        {audit.missing_tools && audit.missing_tools.length > 0 && (
                                            <div className="space-y-1">
                                                {audit.missing_tools.slice(0, 2).map((m, i) => (
                                                    <div key={i} className="flex items-center gap-1.5 text-[10px] text-amber-600 dark:text-amber-400/90">
                                                        <ShieldAlert className="w-3 h-3 flex-shrink-0" />
                                                        <span className="truncate">{m.tool}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="mt-2.5 pt-2 border-t dark:border-slate-800/80 border-slate-200 flex items-center justify-between text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                                            <span>View Audit & Copy Pitch</span>
                                            <ArrowUpRight className="w-3 h-3" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Quick Action Navigation Card */}
                        <div className="rounded-sm dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 p-4 shadow-sm">
                            <h3 className="text-xs font-bold uppercase tracking-wider mb-2 dark:text-slate-300 text-slate-700">
                                Quick Shortcuts
                            </h3>
                            <div className="space-y-1.5">
                                <Link
                                    href="/pipelines"
                                    className="w-full flex items-center justify-between px-3 py-2 rounded-sm border dark:border-slate-800/80 border-slate-200 dark:bg-slate-900/50 bg-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800/70 text-xs dark:text-slate-200 text-slate-800 transition"
                                >
                                    <span>Open Kanban Deals Board</span>
                                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                                </Link>
                                <Link
                                    href="/workflows"
                                    className="w-full flex items-center justify-between px-3 py-2 rounded-sm border dark:border-slate-800/80 border-slate-200 dark:bg-slate-900/50 bg-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800/70 text-xs dark:text-slate-200 text-slate-800 transition"
                                >
                                    <span>Interactive Automation Graph</span>
                                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                                </Link>
                                <Link
                                    href="/conversations"
                                    className="w-full flex items-center justify-between px-3 py-2 rounded-sm border dark:border-slate-800/80 border-slate-200 dark:bg-slate-900/50 bg-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800/70 text-xs dark:text-slate-200 text-slate-800 transition"
                                >
                                    <span>2-Way Unified Communications</span>
                                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                                </Link>
                                <Link
                                    href="/settings/integrations"
                                    className="w-full flex items-center justify-between px-3 py-2 rounded-sm border dark:border-slate-800/80 border-slate-200 dark:bg-slate-900/50 bg-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800/70 text-xs dark:text-slate-200 text-slate-800 transition"
                                >
                                    <span>Configure Twilio, Stripe & Resend</span>
                                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

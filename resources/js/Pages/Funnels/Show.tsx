import React, { useState, useEffect } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Layers,
    ArrowLeft,
    Plus,
    Eye,
    Settings,
    Shield,
    X,
    Save,
    BarChart3,
} from 'lucide-react';
import { Funnel, FunnelStep } from '../../types';

// Chart.js / Graph JS
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface Props {
    funnel: Funnel;
}

export default function FunnelShow({ funnel }: Props) {
    const steps = funnel.steps || [];
    const [selectedStep, setSelectedStep] = useState<FunnelStep>(steps[0] || ({} as FunnelStep));
    const [stepForm, setStepForm] = useState({
        name: selectedStep.name || '',
        step_type: selectedStep.step_type || 'optin',
        path: selectedStep.path || '',
        headline: selectedStep.page_elements?.headline || '',
        subheadline: selectedStep.page_elements?.subheadline || '',
        cta_button: selectedStep.page_elements?.cta_button || selectedStep.page_elements?.cta || 'Continue',
        price: selectedStep.page_elements?.price || '$297 / mo',
    });

    const [showAddStepModal, setShowAddStepModal] = useState(false);
    const [newStep, setNewStep] = useState({
        name: '',
        step_type: 'sales',
        path: '/step-new',
    });

    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains('dark'));
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains('dark'));
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    const handleSelectStep = (step: FunnelStep) => {
        setSelectedStep(step);
        setStepForm({
            name: step.name,
            step_type: step.step_type,
            path: step.path,
            headline: step.page_elements?.headline || '',
            subheadline: step.page_elements?.subheadline || '',
            cta_button: step.page_elements?.cta_button || step.page_elements?.cta || 'Continue',
            price: step.page_elements?.price || '$297 / mo',
        });
    };

    const handleSaveStep = (e: React.FormEvent) => {
        e.preventDefault();
        router.patch(`/funnel-steps/${selectedStep.id}`, {
            name: stepForm.name,
            step_type: stepForm.step_type,
            path: stepForm.path,
            page_elements: {
                headline: stepForm.headline,
                subheadline: stepForm.subheadline,
                cta_button: stepForm.cta_button,
                price: stepForm.price,
            },
        }, {
            preserveScroll: true,
        });
    };

    const handleAddStep = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/funnels/${funnel.id}/steps`, newStep, {
            onSuccess: () => {
                setShowAddStepModal(false);
                setNewStep({ name: '', step_type: 'sales', path: '/step-new' });
            },
        });
    };

    // Graph JS Bar Chart Data for Funnel Step-by-Step Conversion
    const funnelChartData = {
        labels: steps.map((s) => `Step ${s.step_number}: ${s.name.slice(0, 18)}`),
        datasets: [
            {
                label: 'Step Visitors',
                data: steps.map((s) => s.visitors || 0),
                backgroundColor: '#6366f1',
                borderRadius: 2,
            },
            {
                label: 'Conversions',
                data: steps.map((s) => s.conversions || 0),
                backgroundColor: '#10b981',
                borderRadius: 2,
            },
        ],
    };

    const funnelChartOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
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
                grid: { display: false },
                ticks: { color: isDark ? '#94a3b8' : '#64748b', font: { size: 10 } },
            },
            y: {
                grid: { color: isDark ? '#1e293b' : '#f1f5f9' },
                ticks: { color: isDark ? '#94a3b8' : '#64748b', font: { size: 10 } },
            },
        },
    };

    return (
        <AppLayout title={`Funnel: ${funnel.name}`}>
            <Head title={`${funnel.name} - Funnel Builder`} />

            <div className="space-y-6">
                {/* Header Back & Overview */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b dark:border-slate-800 border-slate-200">
                    <div>
                        <Link
                            href="/funnels"
                            className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold mb-1"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Back to Funnels</span>
                        </Link>
                        <h1 className="text-xl font-bold tracking-tight dark:text-white text-slate-900 flex items-center gap-2">
                            <span>{funnel.name}</span>
                            <span className="text-xs px-2 py-0.5 rounded-sm bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                                Status: Active
                            </span>
                        </h1>
                        <p className="text-xs dark:text-slate-400 text-slate-500 mt-0.5">
                            Domain: <span className="dark:text-slate-200 text-slate-800 font-medium">{funnel.custom_domain || 'growth.highlevelflow.io'}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowAddStepModal(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm dark:bg-slate-800 bg-white hover:dark:bg-slate-700 hover:bg-slate-50 dark:text-slate-200 text-slate-800 text-xs font-semibold border dark:border-slate-700 border-slate-300 transition shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Step</span>
                        </button>
                    </div>
                </div>

                {/* Conversion Flow Metrics Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-sm dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 shadow-sm">
                        <span className="text-[11px] dark:text-slate-500 text-slate-400 uppercase block">Total Funnel Traffic</span>
                        <span className="text-lg font-bold dark:text-white text-slate-900">{funnel.total_visitors.toLocaleString()} Visits</span>
                    </div>
                    <div className="p-3 rounded-sm dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 shadow-sm">
                        <span className="text-[11px] dark:text-slate-500 text-slate-400 uppercase block">Captured Leads</span>
                        <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{funnel.total_optins} Opt-ins</span>
                    </div>
                    <div className="p-3 rounded-sm dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 shadow-sm">
                        <span className="text-[11px] dark:text-slate-500 text-slate-400 uppercase block">Opt-in Conversion Rate</span>
                        <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                            {funnel.total_visitors > 0 ? Math.round((funnel.total_optins / funnel.total_visitors) * 100) : 0}%
                        </span>
                    </div>
                    <div className="p-3 rounded-sm dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 shadow-sm">
                        <span className="text-[11px] dark:text-slate-500 text-slate-400 uppercase block">Direct Funnel Revenue</span>
                        <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">${Number(funnel.total_revenue).toLocaleString()}</span>
                    </div>
                </div>

                {/* Graph JS Funnel Drop-off Chart */}
                <div className="p-4 rounded-sm dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold dark:text-slate-300 text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                            <BarChart3 className="w-4 h-4 text-indigo-500" />
                            <span>Funnel Step Conversion & Drop-off Graph</span>
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-sm dark:bg-slate-800 bg-slate-100 text-slate-500 border dark:border-slate-700 border-slate-200 font-semibold">
                            Graph JS Active
                        </span>
                    </div>
                    <div className="h-44 w-full pt-1">
                        <Bar data={funnelChartData} options={funnelChartOptions} />
                    </div>
                </div>

                {/* Funnel Visual Steps Flow Chart */}
                <div className="p-4 rounded-sm dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 shadow-sm space-y-2">
                    <h3 className="text-xs font-bold dark:text-slate-400 text-slate-500 uppercase tracking-wider">
                        Funnel Journey Architecture
                    </h3>
                    <div className="flex items-center gap-2 overflow-x-auto py-2">
                        {steps.map((step, idx) => {
                            const isSelected = selectedStep?.id === step.id;
                            return (
                                <React.Fragment key={step.id}>
                                    <button
                                        onClick={() => handleSelectStep(step)}
                                        className={`flex-shrink-0 p-3 rounded-sm border text-left transition w-56 ${
                                            isSelected
                                                ? 'dark:bg-indigo-950/60 bg-indigo-50/80 border-indigo-500 shadow-sm'
                                                : 'dark:bg-slate-950/60 bg-slate-50 dark:border-slate-800 border-slate-300 dark:text-slate-400 text-slate-600 hover:border-slate-400'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                                            <span>Step {step.step_number}</span>
                                            <span className="px-1.5 py-0.2 rounded-sm dark:bg-slate-800 bg-slate-200 dark:text-slate-300 text-slate-700">
                                                {step.step_type}
                                            </span>
                                        </div>
                                        <h4 className="text-xs font-semibold dark:text-white text-slate-900 truncate">{step.name}</h4>
                                        <div className="flex items-center justify-between text-[11px] dark:text-slate-500 text-slate-400 mt-2">
                                            <span>{step.visitors} Views</span>
                                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">{step.conversions} Leads</span>
                                        </div>
                                    </button>

                                    {idx < steps.length - 1 && (
                                        <div className="h-0.5 w-6 dark:bg-slate-800 bg-slate-300 flex-shrink-0"></div>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>

                {/* 2-Column Step Editor & Live Preview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: Step Form Editor */}
                    <div className="rounded-sm dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 p-5 space-y-4 shadow-sm">
                        <div className="flex items-center justify-between pb-3 border-b dark:border-slate-800 border-slate-200">
                            <div>
                                <h3 className="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-1.5">
                                    <Settings className="w-4 h-4 text-indigo-500" />
                                    <span>Step Settings: {selectedStep?.name}</span>
                                </h3>
                                <p className="text-[11px] dark:text-slate-400 text-slate-500">Configure page copy, conversion trigger & pricing</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link
                                    href={`/funnels/${funnel.id}/steps/${selectedStep?.id}/builder`}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition"
                                >
                                    <Layers className="w-3.5 h-3.5" />
                                    <span>GrapesJS Visual Builder</span>
                                </Link>
                                <span className="text-xs dark:text-slate-500 text-slate-400 font-mono hidden sm:inline">{selectedStep?.path}</span>
                            </div>
                        </div>

                        <form onSubmit={handleSaveStep} className="space-y-3 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block dark:text-slate-400 text-slate-600 mb-1 font-medium">Step Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={stepForm.name}
                                        onChange={(e) => setStepForm({ ...stepForm, name: e.target.value })}
                                        className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block dark:text-slate-400 text-slate-600 mb-1 font-medium">URL Path</label>
                                    <input
                                        type="text"
                                        required
                                        value={stepForm.path}
                                        onChange={(e) => setStepForm({ ...stepForm, path: e.target.value })}
                                        className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block dark:text-slate-400 text-slate-600 mb-1 font-medium">Main Page Headline</label>
                                <input
                                    type="text"
                                    value={stepForm.headline}
                                    onChange={(e) => setStepForm({ ...stepForm, headline: e.target.value })}
                                    className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block dark:text-slate-400 text-slate-600 mb-1 font-medium">Subheadline / Supporting Pitch</label>
                                <textarea
                                    rows={2}
                                    value={stepForm.subheadline}
                                    onChange={(e) => setStepForm({ ...stepForm, subheadline: e.target.value })}
                                    className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block dark:text-slate-400 text-slate-600 mb-1 font-medium">CTA Button Text</label>
                                    <input
                                        type="text"
                                        value={stepForm.cta_button}
                                        onChange={(e) => setStepForm({ ...stepForm, cta_button: e.target.value })}
                                        className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block dark:text-slate-400 text-slate-600 mb-1 font-medium">Offer / Price Tag</label>
                                    <input
                                        type="text"
                                        value={stepForm.price}
                                        onChange={(e) => setStepForm({ ...stepForm, price: e.target.value })}
                                        className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-sm transition"
                                >
                                    <Save className="w-3.5 h-3.5" />
                                    <span>Save Step Changes</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right: Live Page Preview Card */}
                    <div className="rounded-sm dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 p-5 flex flex-col justify-between shadow-sm">
                        <div className="flex items-center justify-between pb-3 border-b dark:border-slate-800 border-slate-200 text-xs">
                            <span className="font-bold dark:text-slate-300 text-slate-700 flex items-center gap-1.5">
                                <Eye className="w-3.5 h-3.5 text-indigo-500" />
                                <span>Live Visitor Viewport Preview</span>
                            </span>
                            <span className="text-[10px] dark:text-slate-500 text-slate-400 font-mono">
                                https://{funnel.custom_domain || 'growth.highlevelflow.io'}{stepForm.path}
                            </span>
                        </div>

                        {/* Interactive Rendered Funnel Stage Page */}
                        <div className="my-4 p-6 rounded-sm dark:bg-gradient-to-b dark:from-slate-900 dark:to-[#070a12] bg-gradient-to-b from-slate-50 to-slate-100 border dark:border-slate-800 border-slate-300 text-center space-y-4">
                            <div className="inline-block px-2.5 py-1 rounded-sm bg-indigo-500/10 border border-indigo-500/30 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                                {selectedStep?.step_type === 'checkout' ? 'Order Securely' : 'Exclusive Opportunity'}
                            </div>

                            <h2 className="text-base sm:text-lg font-bold dark:text-white text-slate-900 max-w-md mx-auto leading-snug">
                                {stepForm.headline || 'Your High Converting Headline'}
                            </h2>

                            <p className="text-xs dark:text-slate-300 text-slate-600 max-w-sm mx-auto">
                                {stepForm.subheadline || 'Subheadline pitch describing your core transformation and benefits.'}
                            </p>

                            {selectedStep?.step_type === 'checkout' && (
                                <div className="p-3 rounded-sm dark:bg-slate-950 bg-white border dark:border-slate-800 border-slate-200 max-w-xs mx-auto text-left space-y-2 text-xs shadow-sm">
                                    <div className="flex justify-between font-bold dark:text-white text-slate-900">
                                        <span>Agency Growth Setup</span>
                                        <span className="text-emerald-600 dark:text-emerald-400">{stepForm.price}</span>
                                    </div>
                                    <div className="text-[11px] dark:text-slate-400 text-slate-500">
                                        Includes Funnel, SMS Engine & CRM System
                                    </div>
                                </div>
                            )}

                            {selectedStep?.step_type === 'optin' && (
                                <div className="max-w-xs mx-auto space-y-2">
                                    <input
                                        type="text"
                                        disabled
                                        placeholder="Enter your business email..."
                                        className="w-full dark:bg-slate-950 bg-white border dark:border-slate-700 border-slate-300 rounded-sm px-3 py-1.5 text-xs dark:text-slate-400 text-slate-500"
                                    />
                                    <input
                                        type="text"
                                        disabled
                                        placeholder="Cell phone for SMS confirmation..."
                                        className="w-full dark:bg-slate-950 bg-white border dark:border-slate-700 border-slate-300 rounded-sm px-3 py-1.5 text-xs dark:text-slate-400 text-slate-500"
                                    />
                                </div>
                            )}

                            <div>
                                <button
                                    type="button"
                                    className="px-5 py-2.5 rounded-sm bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-600/30 hover:bg-indigo-500 transition"
                                >
                                    {stepForm.cta_button || 'Continue to Next Step'}
                                </button>
                            </div>

                            <div className="flex items-center justify-center gap-3 text-[10px] dark:text-slate-500 text-slate-400 pt-2">
                                <span className="flex items-center gap-1">
                                    <Shield className="w-3 h-3 text-emerald-500" />
                                    <span>256-Bit Encrypted</span>
                                </span>
                                <span>•</span>
                                <span>Instant Confirmation</span>
                            </div>
                        </div>

                        <div className="text-[11px] dark:text-slate-500 text-slate-400 text-center">
                            Visitors who complete this step are automatically routed to the next step in the sequence.
                        </div>
                    </div>
                </div>

                {/* Add Step Modal */}
                {showAddStepModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
                        <div className="w-full max-w-sm dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-300 rounded-sm shadow-xl p-5 space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b dark:border-slate-800 border-slate-200">
                                <h3 className="text-sm font-bold dark:text-white text-slate-900">Add Step to Funnel</h3>
                                <button onClick={() => setShowAddStepModal(false)}>
                                    <X className="w-4 h-4 text-slate-400" />
                                </button>
                            </div>
                            <form onSubmit={handleAddStep} className="space-y-3 text-xs">
                                <div>
                                    <label className="block dark:text-slate-400 text-slate-600 mb-1">Step Name *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. VIP Upsell Offer"
                                        value={newStep.name}
                                        onChange={(e) => setNewStep({ ...newStep, name: e.target.value })}
                                        className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block dark:text-slate-400 text-slate-600 mb-1">Step Type</label>
                                    <select
                                        value={newStep.step_type}
                                        onChange={(e) => setNewStep({ ...newStep, step_type: e.target.value })}
                                        className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500"
                                    >
                                        <option value="optin">Opt-In / Lead Magnet</option>
                                        <option value="sales">Sales Presentation / VSL</option>
                                        <option value="checkout">Checkout / Payment</option>
                                        <option value="thankyou">Thank You / Portal</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block dark:text-slate-400 text-slate-600 mb-1">URL Path</label>
                                    <input
                                        type="text"
                                        required
                                        value={newStep.path}
                                        onChange={(e) => setNewStep({ ...newStep, path: e.target.value })}
                                        className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddStepModal(false)}
                                        className="px-3 py-1.5 rounded-sm border dark:border-slate-700 border-slate-300 dark:text-slate-300 text-slate-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-1.5 rounded-sm bg-indigo-600 text-white font-semibold"
                                    >
                                        Add Step
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

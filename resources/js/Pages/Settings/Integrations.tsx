import React, { useState } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import {
    KeyRound,
    CheckCircle2,
    ShieldAlert,
    Save,
    Play,
    Eye,
    EyeOff,
    DollarSign,
    Mail,
    Phone,
    Sparkles,
    Calendar,
    Bot,
    Power,
    Info,
    Check,
    FlaskConical,
    Radio,
    ExternalLink,
} from 'lucide-react';
import { IntegrationSetting } from '../../types';
import { testAiConnectionDirect } from '../../Services/aiService';

interface Props {
    settings: IntegrationSetting[];
}

export default function IntegrationsIndex({ settings }: Props) {
    const [credentialsState, setCredentialsState] = useState<Record<string, Record<string, string>>>(() => {
        const init: Record<string, Record<string, string>> = {};
        settings.forEach((s) => {
            init[s.provider] = { ...(s.credentials || {}) };
        });
        return init;
    });

    const [sandboxState, setSandboxState] = useState<Record<string, boolean>>(() => {
        const init: Record<string, boolean> = {};
        settings.forEach((s) => {
            init[s.provider] = s.is_sandbox ?? true;
        });
        return init;
    });

    const [activeState, setActiveState] = useState<Record<string, boolean>>(() => {
        const init: Record<string, boolean> = {};
        settings.forEach((s) => {
            init[s.provider] = s.is_active ?? true;
        });
        return init;
    });

    const [showKey, setShowKey] = useState<Record<string, boolean>>({});

    const toggleShowKey = (fieldKey: string) => {
        setShowKey((prev) => ({ ...prev, [fieldKey]: !prev[fieldKey] }));
    };

    const handleCredentialChange = (provider: string, field: string, val: string) => {
        setCredentialsState((prev) => ({
            ...prev,
            [provider]: {
                ...(prev[provider] || {}),
                [field]: val,
            },
        }));
    };

    const handleToggleActive = (setting: IntegrationSetting) => {
        const currentActive = activeState[setting.provider] ?? true;
        const newActive = !currentActive;
        setActiveState((prev) => ({ ...prev, [setting.provider]: newActive }));

        router.patch(`/settings/integrations/${setting.id}/toggle`, {}, {
            preserveScroll: true,
        });
    };

    const handleSave = (setting: IntegrationSetting) => {
        router.patch(`/settings/integrations/${setting.id}`, {
            is_active: activeState[setting.provider] ?? true,
            is_sandbox: sandboxState[setting.provider] ?? true,
            credentials: credentialsState[setting.provider] || {},
        }, {
            preserveScroll: true,
        });
    };

    const [testingState, setTestingState] = useState<{ [key: string]: boolean }>({});
    const [testResult, setTestResult] = useState<{ [key: string]: { success: boolean; message: string } }>({});

    const handleTest = async (setting: IntegrationSetting) => {
        setTestingState((prev) => ({ ...prev, [setting.provider]: true }));
        setTestResult((prev) => ({ ...prev, [setting.provider]: { success: false, message: '' } }));

        const token = credentialsState[setting.provider]?.api_token || credentialsState[setting.provider]?.api_key;
        const model = credentialsState[setting.provider]?.model;

        const res = await testAiConnectionDirect({
            provider: setting.provider as any,
            token,
            model,
        });

        setTestingState((prev) => ({ ...prev, [setting.provider]: false }));
        setTestResult((prev) => ({
            ...prev,
            [setting.provider]: {
                success: res.success,
                message: res.message || (res.success ? 'API Connection Verified (HTTP 200 OK)!' : 'Connection test failed.'),
            },
        }));
    };

    const hfPresetModels = [
        { label: 'Llama 3.1 8B (Recommended)', id: 'meta-llama/Llama-3.1-8B-Instruct' },
        { label: 'DeepSeek R1 (Paid GPU)', id: 'deepseek-ai/DeepSeek-R1' },
        { label: 'GLM 5.3 Flash', id: 'zai-org/GLM-5.3-Flash' },
        { label: 'Gemma 4 31B', id: 'google/gemma-4-31B-it' },
    ];

    const openAiPresetModels = [
        { label: 'GPT-4o (Fast & Creative)', id: 'gpt-4o' },
        { label: 'GPT-4o Mini (Cost Optimized)', id: 'gpt-4o-mini' },
        { label: 'o1-mini (Deep Reasoning)', id: 'o1-mini' },
        { label: 'o3-mini (High Performance)', id: 'o3-mini' },
        { label: 'Claude 3.5 Sonnet (via Proxy)', id: 'claude-3-5-sonnet' },
    ];

    return (
        <AppLayout title="API Integrations Hub">
            <Head title="Paid API Integrations - HighLevel Flow" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-xl font-bold tracking-tight dark:text-white text-slate-900 flex items-center gap-2">
                        <KeyRound className="w-5 h-5 text-indigo-500" />
                        <span>Plug & Play Paid APIs Integration Hub</span>
                    </h1>
                    <p className="text-xs dark:text-slate-400 text-slate-600 mt-1 max-w-3xl">
                        Connect live API keys for SMS (Twilio), Email (Resend), Stripe Billing, and AI Models (Hugging Face / OpenAI). 
                        Each service can be turned <strong>ON or OFF</strong> individually, and toggled between <strong>Sandbox Simulator</strong> and <strong>Live Production</strong>.
                    </p>
                </div>

                {/* Explanation Banner: Why Sandbox Simulator? */}
                <div className="rounded-sm border dark:border-indigo-900/50 border-indigo-200 bg-indigo-50/70 dark:bg-indigo-950/20 p-4 text-xs space-y-2">
                    <div className="flex items-start gap-2.5">
                        <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <h4 className="font-bold dark:text-indigo-300 text-indigo-900">
                                Sandbox Simulator কী এবং কেন এটি ডিফল্টভাবে চালু থাকে?
                            </h4>
                            <p className="dark:text-slate-300 text-slate-700 leading-relaxed">
                                <strong>Sandbox Simulator</strong> হলো একটি সেফটি মোড। এটি অন থাকলে আপনার কোনো ব্যালেন্স বা ক্রেডিট কার্ড খরচ হয় না এবং এপিআই কী ছাড়া কাজ করলেও সিস্টেমে কোনো ক্র্যাশ বা এরর হয় না।
                                যখন আপনি আসল টোকেন বা লাইভ এপিআই কী ব্যবহার করতে চাইবেন, তখন কার্ডের উপরের ডানদিকের সুইচটি <strong>[🚀 Live Production]</strong>-এ ক্লিক করুন।
                            </p>
                        </div>
                    </div>
                </div>

                {/* Integration Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {settings.map((setting) => {
                        const isSandbox = sandboxState[setting.provider] ?? true;
                        const isActive = activeState[setting.provider] ?? true;
                        const creds = credentialsState[setting.provider] || {};

                        return (
                            <div
                                key={setting.id}
                                className={`rounded-sm border p-5 space-y-4 shadow-sm transition ${
                                    isActive
                                        ? 'dark:bg-[#0b1120] bg-white dark:border-slate-800 border-slate-200'
                                        : 'dark:bg-slate-950/70 bg-slate-100/80 dark:border-slate-800/60 border-slate-300/80 opacity-90'
                                }`}
                            >
                                {/* Card Header */}
                                <div className="flex items-start justify-between gap-3 pb-3 border-b dark:border-slate-800 border-slate-200">
                                    <div className="flex items-start gap-3 min-w-0 flex-1">
                                        <div className={`w-9 h-9 rounded-sm border shrink-0 flex items-center justify-center font-bold ${
                                            isActive
                                                ? 'dark:bg-slate-900 bg-slate-100 dark:border-slate-700 border-slate-300'
                                                : 'dark:bg-slate-900/50 bg-slate-200/50 dark:border-slate-800 border-slate-300 text-slate-400'
                                        }`}>
                                            {setting.provider === 'twilio' && <Phone className="w-4 h-4 text-amber-500" />}
                                            {setting.provider === 'resend' && <Mail className="w-4 h-4 text-sky-500" />}
                                            {setting.provider === 'stripe' && <DollarSign className="w-4 h-4 text-emerald-500" />}
                                            {setting.provider === 'openai' && <Sparkles className="w-4 h-4 text-purple-500" />}
                                            {setting.provider === 'huggingface' && <Bot className="w-4 h-4 text-amber-500" />}
                                            {setting.provider === 'calendly' && <Calendar className="w-4 h-4 text-blue-500" />}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                                <h3 className="font-bold text-sm dark:text-white text-slate-900 leading-snug">
                                                    {setting.name}
                                                </h3>
                                                <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border shrink-0 ${
                                                    isActive 
                                                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' 
                                                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                                                    <span>{isActive ? 'Active (ON)' : 'Disabled (OFF)'}</span>
                                                </span>
                                            </div>
                                            <p className="text-[11px] dark:text-slate-400 text-slate-500 capitalize mt-0.5">Category: {setting.category}</p>
                                        </div>
                                    </div>

                                    {/* Mode Switch: Sandbox Simulator vs Live Production */}
                                    <div className="shrink-0 flex items-center pt-0.5">
                                        <button
                                            type="button"
                                            onClick={() => setSandboxState({ ...sandboxState, [setting.provider]: !isSandbox })}
                                            className={`text-[10px] font-bold px-2 py-1 rounded-sm border flex items-center gap-1.5 transition ${
                                                isSandbox
                                                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                                                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                                            }`}
                                            title="Click to switch between Sandbox Simulator (Testing) and Live Production (Real Carrier)"
                                        >
                                            {isSandbox ? (
                                                <>
                                                    <FlaskConical className="w-3 h-3 text-amber-500" />
                                                    <span>Sandbox Simulator</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                                                    <span>Live Production</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* OFF Warning Banner if Inactive */}
                                {!isActive && (
                                    <div className="rounded-sm bg-rose-500/10 border border-rose-500/20 px-3 py-2 text-[11px] text-rose-600 dark:text-rose-400 flex items-center gap-2">
                                        <Power className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                        <span>This service is currently <strong>TURNED OFF</strong>. Inbound/outbound triggers for this service are paused.</span>
                                    </div>
                                )}

                                {/* Form Fields */}
                                <div className={`space-y-3 text-xs ${!isActive ? 'opacity-60 pointer-events-none select-none' : ''}`}>
                                    {setting.provider === 'twilio' && (
                                        <>
                                            <div>
                                                <label className="block dark:text-slate-400 text-slate-600 mb-1 font-medium">Account SID</label>
                                                <input
                                                    type="text"
                                                    value={creds['account_sid'] || ''}
                                                    onChange={(e) => handleCredentialChange('twilio', 'account_sid', e.target.value)}
                                                    placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                                                    className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 font-mono text-xs focus:outline-none focus:border-indigo-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block dark:text-slate-400 text-slate-600 mb-1 font-medium">Auth Token</label>
                                                <div className="relative">
                                                    <input
                                                        type={showKey['twilio_token'] ? 'text' : 'password'}
                                                        value={creds['auth_token'] || ''}
                                                        onChange={(e) => handleCredentialChange('twilio', 'auth_token', e.target.value)}
                                                        placeholder="Your Twilio Secret Auth Token"
                                                        className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm pl-2.5 pr-8 py-1.5 dark:text-white text-slate-900 font-mono text-xs focus:outline-none focus:border-indigo-500"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleShowKey('twilio_token')}
                                                        className="absolute right-2.5 top-2 dark:text-slate-400 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                                    >
                                                        {showKey['twilio_token'] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block dark:text-slate-400 text-slate-600 mb-1 font-medium">Twilio Phone Number</label>
                                                <input
                                                    type="text"
                                                    value={creds['from_number'] || ''}
                                                    onChange={(e) => handleCredentialChange('twilio', 'from_number', e.target.value)}
                                                    placeholder="+18005550199"
                                                    className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 font-mono text-xs focus:outline-none focus:border-indigo-500"
                                                />
                                            </div>
                                        </>
                                    )}

                                    {setting.provider === 'resend' && (
                                        <>
                                            <div>
                                                <label className="block dark:text-slate-400 text-slate-600 mb-1 font-medium">Resend / SendGrid API Key</label>
                                                <div className="relative">
                                                    <input
                                                        type={showKey['resend_key'] ? 'text' : 'password'}
                                                        value={creds['api_key'] || ''}
                                                        onChange={(e) => handleCredentialChange('resend', 'api_key', e.target.value)}
                                                        placeholder="re_xxxxxxxxxxxxxxxxxxxxxxxx"
                                                        className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm pl-2.5 pr-8 py-1.5 dark:text-white text-slate-900 font-mono text-xs focus:outline-none focus:border-indigo-500"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleShowKey('resend_key')}
                                                        className="absolute right-2.5 top-2 dark:text-slate-400 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                                    >
                                                        {showKey['resend_key'] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block dark:text-slate-400 text-slate-600 mb-1 font-medium">Verified Sender Email</label>
                                                <input
                                                    type="email"
                                                    value={creds['from_email'] || ''}
                                                    onChange={(e) => handleCredentialChange('resend', 'from_email', e.target.value)}
                                                    placeholder="outreach@yourdomain.com"
                                                    className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 font-mono text-xs focus:outline-none focus:border-indigo-500"
                                                />
                                            </div>
                                        </>
                                    )}

                                    {setting.provider === 'stripe' && (
                                        <>
                                            <div>
                                                <label className="block dark:text-slate-400 text-slate-600 mb-1 font-medium">Publishable Key</label>
                                                <input
                                                    type="text"
                                                    value={creds['publishable_key'] || ''}
                                                    onChange={(e) => handleCredentialChange('stripe', 'publishable_key', e.target.value)}
                                                    placeholder="pk_live_xxxxxxxxxxxxxxxx"
                                                    className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 font-mono text-xs focus:outline-none focus:border-indigo-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block dark:text-slate-400 text-slate-600 mb-1 font-medium">Secret Key</label>
                                                <div className="relative">
                                                    <input
                                                        type={showKey['stripe_secret'] ? 'text' : 'password'}
                                                        value={creds['secret_key'] || ''}
                                                        onChange={(e) => handleCredentialChange('stripe', 'secret_key', e.target.value)}
                                                        placeholder="sk_live_xxxxxxxxxxxxxxxx"
                                                        className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm pl-2.5 pr-8 py-1.5 dark:text-white text-slate-900 font-mono text-xs focus:outline-none focus:border-indigo-500"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleShowKey('stripe_secret')}
                                                        className="absolute right-2.5 top-2 dark:text-slate-400 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                                    >
                                                        {showKey['stripe_secret'] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* OpenAI Copilot */}
                                    {setting.provider === 'openai' && (
                                        <>
                                            <div>
                                                <label className="block dark:text-slate-400 text-slate-600 mb-1 font-medium">OpenAI API Key</label>
                                                <div className="relative">
                                                    <input
                                                        type={showKey['openai_key'] ? 'text' : 'password'}
                                                        value={creds['api_key'] || ''}
                                                        onChange={(e) => handleCredentialChange('openai', 'api_key', e.target.value)}
                                                        placeholder="sk-proj-xxxxxxxxxxxxxxxx"
                                                        className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm pl-2.5 pr-8 py-1.5 dark:text-white text-slate-900 font-mono text-xs focus:outline-none focus:border-indigo-500"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleShowKey('openai_key')}
                                                        className="absolute right-2.5 top-2 dark:text-slate-400 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                                    >
                                                        {showKey['openai_key'] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block dark:text-slate-400 text-slate-600 mb-1 font-medium">
                                                    OpenAI Model ID (Type Any Model)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={creds['model'] || 'gpt-4o'}
                                                    onChange={(e) => handleCredentialChange('openai', 'model', e.target.value)}
                                                    placeholder="gpt-4o, gpt-4o-mini, o1-mini, etc."
                                                    className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 font-mono text-xs focus:outline-none focus:border-indigo-500 mb-2"
                                                />
                                                {/* Preset Pills */}
                                                <div className="flex flex-wrap gap-1">
                                                    {openAiPresetModels.map((m) => (
                                                        <button
                                                            key={m.id}
                                                            type="button"
                                                            onClick={() => handleCredentialChange('openai', 'model', m.id)}
                                                            className={`text-[10px] px-2 py-0.5 rounded-sm border transition ${
                                                                (creds['model'] || 'gpt-4o') === m.id
                                                                    ? 'bg-purple-500/20 text-purple-600 dark:text-purple-300 border-purple-500/40 font-bold'
                                                                    : 'dark:bg-slate-900 bg-slate-100 dark:text-slate-400 text-slate-600 dark:border-slate-800 border-slate-300 hover:border-slate-400'
                                                            }`}
                                                        >
                                                            {m.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Hugging Face AI (Open Source Models) */}
                                    {setting.provider === 'huggingface' && (
                                        <>
                                            <div>
                                                <div className="flex items-center justify-between mb-1">
                                                    <label className="dark:text-slate-400 text-slate-600 font-medium">Hugging Face Access Token (Free)</label>
                                                    <a
                                                        href="https://huggingface.co/settings/tokens"
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-[10px] text-indigo-500 hover:underline flex items-center gap-1"
                                                    >
                                                        <span>Get Free Token</span>
                                                        <ExternalLink className="w-2.5 h-2.5" />
                                                    </a>
                                                </div>
                                                <div className="relative">
                                                    <input
                                                        type={showKey['hf_token'] ? 'text' : 'password'}
                                                        value={creds['api_token'] || creds['api_key'] || ''}
                                                        onChange={(e) => handleCredentialChange('huggingface', 'api_token', e.target.value)}
                                                        placeholder="hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                                                        className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm pl-2.5 pr-8 py-1.5 dark:text-white text-slate-900 font-mono text-xs focus:outline-none focus:border-indigo-500"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleShowKey('hf_token')}
                                                        className="absolute right-2.5 top-2 dark:text-slate-400 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                                    >
                                                        {showKey['hf_token'] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex items-center justify-between mb-1">
                                                    <label className="dark:text-slate-400 text-slate-600 font-medium">
                                                        Hugging Face Model ID (Type ANY Custom Model)
                                                    </label>
                                                    <a
                                                        href="https://huggingface.co/models?pipeline_tag=text-generation&sort=trending"
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-[10px] text-amber-500 hover:underline flex items-center gap-1"
                                                    >
                                                        <span>Explore Models</span>
                                                        <ExternalLink className="w-2.5 h-2.5" />
                                                    </a>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={creds['model'] || 'meta-llama/Meta-Llama-3-8B-Instruct'}
                                                    onChange={(e) => handleCredentialChange('huggingface', 'model', e.target.value)}
                                                    placeholder="e.g. deepseek-ai/DeepSeek-R1 or meta-llama/Meta-Llama-3-8B-Instruct"
                                                    className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 font-mono text-xs focus:outline-none focus:border-indigo-500 mb-2"
                                                />

                                                {/* Quick Preset Buttons */}
                                                <div className="space-y-1">
                                                    <span className="text-[10px] dark:text-slate-500 text-slate-400 block font-medium">1-Click Popular Presets:</span>
                                                    <div className="flex flex-wrap gap-1">
                                                        {hfPresetModels.map((m) => (
                                                            <button
                                                                key={m.id}
                                                                type="button"
                                                                onClick={() => handleCredentialChange('huggingface', 'model', m.id)}
                                                                className={`text-[10px] px-2 py-0.5 rounded-sm border transition ${
                                                                    (creds['model'] || 'meta-llama/Meta-Llama-3-8B-Instruct') === m.id
                                                                        ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/40 font-bold'
                                                                        : 'dark:bg-slate-900 bg-slate-100 dark:text-slate-400 text-slate-600 dark:border-slate-800 border-slate-300 hover:border-slate-400'
                                                                }`}
                                                            >
                                                                {m.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {setting.provider === 'calendly' && (
                                        <div>
                                            <label className="block dark:text-slate-400 text-slate-600 mb-1 font-medium">Personal Access Token</label>
                                            <input
                                                type="text"
                                                value={creds['access_token'] || ''}
                                                onChange={(e) => handleCredentialChange('calendly', 'access_token', e.target.value)}
                                                placeholder="eyJhbGciOi..."
                                                className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 font-mono text-xs focus:outline-none focus:border-indigo-500"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Actions & Status Footer */}
                                <div className="pt-3 border-t dark:border-slate-800/80 border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                                    {/* Left: ON / OFF Switch (Directly where user highlighted) */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleToggleActive(setting)}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-bold border transition shadow-sm ${
                                                isActive
                                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                                                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                                            }`}
                                            title="Click to turn service ON or OFF"
                                        >
                                            <Power className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-500' : 'text-rose-500'}`} />
                                            <span>{isActive ? 'Service: ON' : 'Service: OFF'}</span>
                                        </button>

                                        <div className="text-[11px] dark:text-slate-500 text-slate-400 hidden sm:block">
                                            {testResult[setting.provider]?.message ? (
                                                <span className={`font-semibold px-2 py-0.5 rounded ${testResult[setting.provider].success ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'}`}>
                                                    {testResult[setting.provider].message}
                                                </span>
                                            ) : setting.last_tested_at ? (
                                                <span>Verified: {new Date(setting.last_tested_at).toLocaleTimeString()}</span>
                                            ) : (
                                                <span>Ready to test</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right: Test API & Save Credentials */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            disabled={!isActive || testingState[setting.provider]}
                                            onClick={() => handleTest(setting)}
                                            className="px-2.5 py-1.5 rounded-sm border dark:border-slate-700 border-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-300 text-slate-700 font-medium transition flex items-center gap-1 disabled:opacity-40"
                                        >
                                            <Play className={`w-3 h-3 text-emerald-500 ${testingState[setting.provider] ? 'animate-spin' : ''}`} />
                                            <span>{testingState[setting.provider] ? 'Testing (HTTP 200)...' : 'Test API'}</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleSave(setting)}
                                            className="px-3 py-1.5 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition flex items-center gap-1 shadow-sm"
                                        >
                                            <Save className="w-3 h-3" />
                                            <span>Save Credentials</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}

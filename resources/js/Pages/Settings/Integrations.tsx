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
} from 'lucide-react';
import { IntegrationSetting } from '../../types';

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

    const handleSave = (setting: IntegrationSetting) => {
        router.patch(`/settings/integrations/${setting.id}`, {
            is_active: setting.is_active,
            is_sandbox: sandboxState[setting.provider] ?? true,
            credentials: credentialsState[setting.provider] || {},
        }, {
            preserveScroll: true,
        });
    };

    const handleTest = (setting: IntegrationSetting) => {
        router.post(`/settings/integrations/${setting.id}/test`, {}, {
            preserveScroll: true,
        });
    };

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
                    <p className="text-xs dark:text-slate-400 text-slate-600 mt-1 max-w-2xl">
                        Connect your live API keys for SMS, Email, Stripe Billing, and OpenAI. If API keys are not supplied, the platform automatically operates in high-fidelity <strong>Simulator Mode</strong> so you can build and test with zero errors.
                    </p>
                </div>

                {/* Integration Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {settings.map((setting) => {
                        const isSandbox = sandboxState[setting.provider] ?? true;
                        const creds = credentialsState[setting.provider] || {};

                        return (
                            <div
                                key={setting.id}
                                className="rounded-sm dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 p-5 space-y-4 shadow-sm"
                            >
                                {/* Card Header */}
                                <div className="flex items-start justify-between pb-3 border-b dark:border-slate-800 border-slate-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-sm dark:bg-slate-900 bg-slate-100 border dark:border-slate-700 border-slate-300 flex items-center justify-center font-bold">
                                            {setting.provider === 'twilio' && <Phone className="w-4 h-4 text-amber-500" />}
                                            {setting.provider === 'resend' && <Mail className="w-4 h-4 text-sky-500" />}
                                            {setting.provider === 'stripe' && <DollarSign className="w-4 h-4 text-emerald-500" />}
                                            {setting.provider === 'openai' && <Sparkles className="w-4 h-4 text-purple-500" />}
                                            {setting.provider === 'calendly' && <Calendar className="w-4 h-4 text-blue-500" />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm dark:text-white text-slate-900">{setting.name}</h3>
                                            <p className="text-[11px] dark:text-slate-400 text-slate-500 capitalize">Category: {setting.category}</p>
                                        </div>
                                    </div>

                                    {/* Simulator vs Live Switch */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setSandboxState({ ...sandboxState, [setting.provider]: !isSandbox })}
                                            className={`text-[10px] uppercase font-bold px-2 py-1 rounded-sm border transition ${
                                                isSandbox
                                                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                                                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                                            }`}
                                        >
                                            {isSandbox ? 'Sandbox Simulator' : 'Live Carrier'}
                                        </button>
                                    </div>
                                </div>

                                {/* Fields */}
                                <div className="space-y-3 text-xs">
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
                                                <label className="block dark:text-slate-400 text-slate-600 mb-1 font-medium">Model</label>
                                                <select
                                                    value={creds['model'] || 'gpt-4o'}
                                                    onChange={(e) => handleCredentialChange('openai', 'model', e.target.value)}
                                                    className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500"
                                                >
                                                    <option value="gpt-4o">GPT-4o (Fast & Creative)</option>
                                                    <option value="gpt-4o-mini">GPT-4o Mini (Cost Optimized)</option>
                                                    <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                                                </select>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Actions & Status */}
                                <div className="pt-2 border-t dark:border-slate-800/80 border-slate-200 flex items-center justify-between text-xs">
                                    <div className="text-[11px] dark:text-slate-500 text-slate-400">
                                        {setting.last_tested_at ? (
                                            <span>Tested: {new Date(setting.last_tested_at).toLocaleTimeString()}</span>
                                        ) : (
                                            <span>Ready for test</span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleTest(setting)}
                                            className="px-2.5 py-1 rounded-sm border dark:border-slate-700 border-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-300 text-slate-700 font-medium transition flex items-center gap-1"
                                        >
                                            <Play className="w-3 h-3 text-emerald-500" />
                                            <span>Test API</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleSave(setting)}
                                            className="px-3 py-1 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition flex items-center gap-1 shadow-sm"
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

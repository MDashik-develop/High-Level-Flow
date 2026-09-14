import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Users,
    KanbanSquare,
    Layers,
    GitFork,
    Globe,
    Megaphone,
    MessageSquare,
    KeyRound,
    Search,
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
    Info,
    Zap,
    Menu,
    X,
    Sun,
    Moon,
} from 'lucide-react';

interface Props {
    children: React.ReactNode;
    title?: string;
}

export default function AppLayout({ children, title }: Props) {
    const { url, props } = usePage<any>();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const flash = props.flash || {};

    const [theme, setTheme] = useState<'dark' | 'light'>('dark');

    useEffect(() => {
        const savedTheme = (localStorage.getItem('hl_theme') as 'dark' | 'light') || 'dark';
        setTheme(savedTheme);
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        localStorage.setItem('hl_theme', next);
        if (next === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const navigation = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard, current: url === '/' },
        { name: 'Contacts & Leads', href: '/contacts', icon: Users, current: url.startsWith('/contacts') },
        { name: 'Pipelines & Deals', href: '/pipelines', icon: KanbanSquare, current: url.startsWith('/pipelines') },
        { name: 'Funnel Builder', href: '/funnels', icon: Layers, current: url.startsWith('/funnels') },
        { name: 'Workflows & Graph', href: '/workflows', icon: GitFork, current: url.startsWith('/workflows') },
        {
            name: 'Website Crawler',
            href: '/crawler',
            icon: Globe,
            current: url.startsWith('/crawler'),
            badge: 'Lead Hunter',
            badgeColor: 'dark:bg-indigo-500/20 bg-indigo-100 dark:text-indigo-400 text-indigo-700 border dark:border-indigo-500/30 border-indigo-200',
        },
        { name: 'Marketing Campaigns', href: '/campaigns', icon: Megaphone, current: url.startsWith('/campaigns') },
        { name: 'Unified 2-Way Inbox', href: '/conversations', icon: MessageSquare, current: url.startsWith('/conversations') },
        { name: 'API Integrations', href: '/settings/integrations', icon: KeyRound, current: url.startsWith('/settings') },
    ];

    return (
        <div className="min-h-screen dark:bg-[#090d16] bg-slate-100 dark:text-slate-100 text-slate-900 flex flex-col antialiased selection:bg-indigo-600 selection:text-white transition-colors duration-150">
            {/* Top Bar */}
            <header className="h-14 border-b dark:border-slate-800 border-slate-200 dark:bg-[#0b1120] bg-white flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 transition-colors">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-1.5 rounded-sm border dark:border-slate-700 border-slate-300 dark:hover:bg-slate-800 hover:bg-slate-100 dark:text-slate-300 text-slate-700"
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>

                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-sm bg-indigo-600 flex items-center justify-center font-bold text-white shadow-sm shadow-indigo-500/30">
                            <Zap className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-base tracking-tight dark:text-white text-slate-900 flex items-center gap-1.5">
                                HIGHLEVEL <span className="text-indigo-600 dark:text-indigo-400 font-semibold">FLOW</span>
                            </span>
                        </div>
                    </Link>

                    <div className="hidden sm:flex items-center gap-1.5 ml-4 px-2.5 py-1 rounded-sm dark:bg-slate-900 bg-slate-100 border dark:border-slate-800 border-slate-200 text-xs dark:text-slate-400 text-slate-600">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span>API Engine:</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">Modular Simulator & Live Ready</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Light / Dark Mode Toggle */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="p-1.5 rounded-sm border dark:border-slate-700 border-slate-300 dark:bg-slate-800 bg-slate-100 dark:text-amber-400 text-slate-700 hover:scale-105 transition flex items-center gap-1.5 text-xs font-medium"
                        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {theme === 'dark' ? (
                            <>
                                <Sun className="w-4 h-4 text-amber-400" />
                                <span className="hidden sm:inline text-[11px] text-slate-300">Light</span>
                            </>
                        ) : (
                            <>
                                <Moon className="w-4 h-4 text-slate-700" />
                                <span className="hidden sm:inline text-[11px] text-slate-700">Dark</span>
                            </>
                        )}
                    </button>

                    <Link
                        href="/crawler"
                        className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-sm dark:bg-indigo-600/10 bg-indigo-50 hover:bg-indigo-100 dark:hover:bg-indigo-600/20 text-indigo-600 dark:text-indigo-300 border dark:border-indigo-500/30 border-indigo-200 text-xs font-semibold transition"
                    >
                        <Globe className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Audit New Website</span>
                    </Link>

                    <div className="h-4 w-px dark:bg-slate-800 bg-slate-300 hidden md:block"></div>

                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-sm dark:bg-slate-800 bg-slate-200 border dark:border-slate-700 border-slate-300 flex items-center justify-center font-semibold text-xs dark:text-slate-200 text-slate-700">
                            AF
                        </div>
                        <div className="hidden lg:block text-left">
                            <p className="text-xs font-medium dark:text-slate-200 text-slate-800 leading-tight">Agency Founder</p>
                            <p className="text-[10px] dark:text-slate-500 text-slate-500 leading-tight">admin@agency.io</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Desktop Left Sidebar */}
                <aside className="hidden lg:flex w-64 flex-col border-r dark:border-slate-800/80 border-slate-200 dark:bg-[#0a0f1d] bg-white flex-shrink-0 transition-colors">
                    <div className="p-3 border-b dark:border-slate-800/60 border-slate-200">
                        <div className="relative">
                            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search leads, funnels..."
                                className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-sm pl-8 pr-3 py-1.5 text-xs dark:text-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition"
                            />
                        </div>
                    </div>

                    <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
                        <div className="px-2 py-1 text-[11px] font-semibold dark:text-slate-500 text-slate-400 uppercase tracking-wider">
                            Operations
                        </div>
                        {navigation.slice(0, 5).map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center justify-between px-2.5 py-2 rounded-sm text-xs font-medium transition ${
                                        item.current
                                            ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                                            : 'dark:text-slate-300 text-slate-700 dark:hover:bg-slate-800/60 hover:bg-slate-100 dark:hover:text-white hover:text-slate-900'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Icon className={`w-4 h-4 ${item.current ? 'text-white' : 'dark:text-slate-400 text-slate-500'}`} />
                                        <span>{item.name}</span>
                                    </div>
                                    {item.badge && (
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-sm ${item.badgeColor}`}>
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}

                        <div className="pt-4 px-2 py-1 text-[11px] font-semibold dark:text-slate-500 text-slate-400 uppercase tracking-wider">
                            Growth & Acquisition
                        </div>
                        {navigation.slice(5).map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center justify-between px-2.5 py-2 rounded-sm text-xs font-medium transition ${
                                        item.current
                                            ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                                            : 'dark:text-slate-300 text-slate-700 dark:hover:bg-slate-800/60 hover:bg-slate-100 dark:hover:text-white hover:text-slate-900'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Icon className={`w-4 h-4 ${item.current ? 'text-white' : 'dark:text-slate-400 text-slate-500'}`} />
                                        <span>{item.name}</span>
                                    </div>
                                    {item.badge && (
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-sm ${item.badgeColor}`}>
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-3 border-t dark:border-slate-800/80 border-slate-200 dark:bg-[#070a12]/60 bg-slate-50">
                        <div className="p-2.5 rounded-sm border dark:border-slate-800 border-slate-300 dark:bg-slate-900/40 bg-white">
                            <div className="flex items-center justify-between text-[11px] dark:text-slate-400 text-slate-600 mb-1">
                                <span>Agency Retainers</span>
                                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">$12,500/mo</span>
                            </div>
                            <div className="w-full dark:bg-slate-800 bg-slate-200 h-1.5 rounded-sm overflow-hidden">
                                <div className="bg-indigo-600 dark:bg-indigo-500 h-full w-[65%]"></div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Mobile Drawer */}
                {mobileMenuOpen && (
                    <div className="fixed inset-0 z-40 lg:hidden flex">
                        <div className="fixed inset-0 bg-black/60" onClick={() => setMobileMenuOpen(false)}></div>
                        <div className="relative w-64 max-w-[80%] dark:bg-[#0a0f1d] bg-white border-r dark:border-slate-800 border-slate-200 p-4 flex flex-col z-50">
                            <div className="flex items-center justify-between mb-4 pb-2 border-b dark:border-slate-800 border-slate-200">
                                <span className="font-bold text-sm dark:text-white text-slate-900">HIGHLEVEL FLOW</span>
                                <button onClick={() => setMobileMenuOpen(false)}>
                                    <X className="w-4 h-4 text-slate-400" />
                                </button>
                            </div>
                            <nav className="space-y-1">
                                {navigation.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`flex items-center justify-between px-3 py-2 rounded-sm text-xs ${
                                                item.current
                                                    ? 'bg-indigo-600 text-white font-semibold'
                                                    : 'dark:text-slate-300 text-slate-700 dark:hover:bg-slate-800 hover:bg-slate-100'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Icon className="w-4 h-4" />
                                                <span>{item.name}</span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>
                )}

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto dark:bg-[#090d16] bg-slate-100 flex flex-col transition-colors">
                    {/* Flash Notifications */}
                    {flash.success && (
                        <div className="mx-6 mt-4 p-3 rounded-sm dark:bg-emerald-950/50 bg-emerald-50 border dark:border-emerald-500/30 border-emerald-300 flex items-center gap-2.5 text-xs dark:text-emerald-300 text-emerald-800 shadow-sm">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            <span>{flash.success}</span>
                        </div>
                    )}
                    {flash.error && (
                        <div className="mx-6 mt-4 p-3 rounded-sm dark:bg-rose-950/50 bg-rose-50 border dark:border-rose-500/30 border-rose-300 flex items-center gap-2.5 text-xs dark:text-rose-300 text-rose-800 shadow-sm">
                            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                            <span>{flash.error}</span>
                        </div>
                    )}
                    {flash.info && (
                        <div className="mx-6 mt-4 p-3 rounded-sm dark:bg-sky-950/50 bg-sky-50 border dark:border-sky-500/30 border-sky-300 flex items-center gap-2.5 text-xs dark:text-sky-300 text-sky-800 shadow-sm">
                            <Info className="w-4 h-4 text-sky-500 flex-shrink-0" />
                            <span>{flash.info}</span>
                        </div>
                    )}

                    <div className="p-4 sm:p-6 lg:p-8 flex-1">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

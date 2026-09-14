import React, { useState } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    MessageSquare,
    Mail,
    Send,
    Phone,
    Building2,
    Flame,
    CheckCheck,
    Clock,
    User,
    StickyNote,
} from 'lucide-react';
import { Contact, Message } from '../../types';

interface Props {
    contacts: (Contact & { messages_count?: number })[];
    activeContact: Contact | null;
    messages: Message[];
}

export default function ConversationsIndex({ contacts, activeContact, messages }: Props) {
    const [messageType, setMessageType] = useState<'sms' | 'email' | 'internal_note'>('sms');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [sending, setSending] = useState(false);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeContact || !body) return;

        setSending(true);
        router.post(`/contacts/${activeContact.id}/messages`, {
            type: messageType,
            subject: messageType === 'email' ? subject : undefined,
            body,
        }, {
            onSuccess: () => {
                setBody('');
                setSubject('');
            },
            onFinish: () => setSending(false),
            preserveScroll: true,
        });
    };

    return (
        <AppLayout title="Unified 2-Way Inbox">
            <Head title="Unified 2-Way Inbox - HighLevel Flow" />

            <div className="h-[calc(100vh-120px)] flex flex-col -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8">
                <div className="flex-1 bg-[#0b1120] border border-slate-800 rounded-sm flex overflow-hidden shadow-lg">
                    {/* Left Sidebar: Contact Thread List */}
                    <div className="w-80 flex-shrink-0 border-r border-slate-800 flex flex-col bg-[#0a0f1d]">
                        <div className="p-3.5 border-b border-slate-800 bg-[#070a12]/50">
                            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                                <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Active Conversations</span>
                            </h2>
                        </div>

                        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
                            {contacts.length === 0 ? (
                                <div className="p-6 text-center text-xs text-slate-500">
                                    No contacts found in conversations.
                                </div>
                            ) : (
                                contacts.map((c) => {
                                    const isActive = activeContact?.id === c.id;
                                    return (
                                        <Link
                                            key={c.id}
                                            href={`/conversations?contact_id=${c.id}`}
                                            className={`p-3 block transition text-left ${
                                                isActive
                                                    ? 'bg-slate-800/80 border-l-2 border-indigo-500'
                                                    : 'hover:bg-slate-900/40'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-semibold text-xs text-white truncate max-w-[170px]">
                                                    {c.first_name} {c.last_name}
                                                </span>
                                                <div className="flex items-center gap-1 text-[10px] text-amber-400 font-bold">
                                                    <Flame className="w-3 h-3" />
                                                    <span>{c.lead_score}</span>
                                                </div>
                                            </div>

                                            <p className="text-[11px] text-slate-400 truncate">
                                                {c.company || c.email || c.phone || 'No company info'}
                                            </p>
                                        </Link>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Right: Message Stream & Send Box */}
                    {activeContact ? (
                        <div className="flex-1 flex flex-col bg-[#090d16] overflow-hidden">
                            {/* Active Contact Header */}
                            <div className="p-3.5 border-b border-slate-800 bg-[#0b1120] flex items-center justify-between flex-shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-sm bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-indigo-400">
                                        {activeContact.first_name[0]}
                                        {activeContact.last_name ? activeContact.last_name[0] : ''}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xs text-white">
                                            {activeContact.first_name} {activeContact.last_name}
                                        </h3>
                                        <div className="flex items-center gap-3 text-[11px] text-slate-400">
                                            {activeContact.company && (
                                                <span className="flex items-center gap-1">
                                                    <Building2 className="w-3 h-3 text-slate-500" />
                                                    <span>{activeContact.company}</span>
                                                </span>
                                            )}
                                            {activeContact.phone && (
                                                <span className="flex items-center gap-1 text-slate-300">
                                                    <Phone className="w-3 h-3 text-slate-500" />
                                                    <span>{activeContact.phone}</span>
                                                </span>
                                            )}
                                            {activeContact.email && (
                                                <span className="flex items-center gap-1 text-slate-300">
                                                    <Mail className="w-3 h-3 text-slate-500" />
                                                    <span>{activeContact.email}</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded-sm bg-indigo-500/10 text-indigo-400 text-[10px] font-bold border border-indigo-500/20">
                                        Speed-to-Lead Active
                                    </span>
                                </div>
                            </div>

                            {/* Message Stream */}
                            <div className="flex-1 p-4 overflow-y-auto space-y-3">
                                {messages.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs space-y-1">
                                        <MessageSquare className="w-6 h-6 text-slate-600" />
                                        <span>No communication history yet with this lead.</span>
                                        <span className="text-[11px] text-slate-600">Send an instant SMS or Email below.</span>
                                    </div>
                                ) : (
                                    messages.map((m) => {
                                        const isOutbound = m.direction === 'outbound';
                                        return (
                                            <div
                                                key={m.id}
                                                className={`flex ${isOutbound ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-lg p-3 rounded-sm text-xs space-y-1 ${
                                                        m.type === 'internal_note'
                                                            ? 'bg-amber-950/40 border border-amber-500/30 text-amber-200'
                                                            : isOutbound
                                                            ? 'bg-indigo-950/70 border border-indigo-500/30 text-slate-100 shadow-sm'
                                                            : 'bg-[#0f172a] border border-slate-800 text-slate-200'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between gap-3 text-[10px] text-slate-400 pb-0.5">
                                                        <span className="font-semibold uppercase tracking-wider flex items-center gap-1 text-slate-400">
                                                            {m.type === 'sms' && <Phone className="w-2.5 h-2.5 text-amber-400" />}
                                                            {m.type === 'email' && <Mail className="w-2.5 h-2.5 text-sky-400" />}
                                                            {m.type === 'internal_note' && <StickyNote className="w-2.5 h-2.5 text-amber-400" />}
                                                            <span>{m.type}</span>
                                                        </span>
                                                        <span>{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>

                                                    {m.subject && (
                                                        <div className="font-bold text-white text-[11px] border-b border-slate-800/80 pb-0.5">
                                                            {m.subject}
                                                        </div>
                                                    )}

                                                    <p className="whitespace-pre-wrap leading-relaxed">{m.body}</p>

                                                    <div className="flex items-center justify-end gap-1 text-[10px] text-slate-500 pt-0.5">
                                                        <CheckCheck className="w-3 h-3 text-emerald-400" />
                                                        <span className="capitalize">{m.status}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Reply Box */}
                            <div className="p-3 border-t border-slate-800 bg-[#0b1120] flex-shrink-0 space-y-2">
                                <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2">
                                    <button
                                        onClick={() => setMessageType('sms')}
                                        className={`px-2.5 py-1 rounded-sm text-xs font-semibold flex items-center gap-1.5 transition ${
                                            messageType === 'sms'
                                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                                : 'text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        <Phone className="w-3 h-3" />
                                        <span>2-Way SMS</span>
                                    </button>
                                    <button
                                        onClick={() => setMessageType('email')}
                                        className={`px-2.5 py-1 rounded-sm text-xs font-semibold flex items-center gap-1.5 transition ${
                                            messageType === 'email'
                                                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                                                : 'text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        <Mail className="w-3 h-3" />
                                        <span>Email Dispatch</span>
                                    </button>
                                    <button
                                        onClick={() => setMessageType('internal_note')}
                                        className={`px-2.5 py-1 rounded-sm text-xs font-semibold flex items-center gap-1.5 transition ${
                                            messageType === 'internal_note'
                                                ? 'bg-slate-700 text-white border border-slate-600'
                                                : 'text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        <StickyNote className="w-3 h-3" />
                                        <span>Internal Note</span>
                                    </button>
                                </div>

                                <form onSubmit={handleSendMessage} className="space-y-2">
                                    {messageType === 'email' && (
                                        <input
                                            type="text"
                                            placeholder="Subject line..."
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            className="w-full bg-[#070a12] border border-slate-700 rounded-sm px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                                        />
                                    )}

                                    <div className="flex items-end gap-2">
                                        <textarea
                                            rows={2}
                                            required
                                            value={body}
                                            onChange={(e) => setBody(e.target.value)}
                                            placeholder={
                                                messageType === 'sms'
                                                    ? 'Type instant SMS to send to client phone...'
                                                    : messageType === 'email'
                                                    ? 'Write email body...'
                                                    : 'Add private internal note on this lead...'
                                            }
                                            className="flex-1 bg-[#070a12] border border-slate-700 rounded-sm p-2 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                                        />
                                        <button
                                            type="submit"
                                            disabled={sending}
                                            className="px-4 py-2 rounded-sm bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition h-10 shadow-sm"
                                        >
                                            <Send className="w-3.5 h-3.5" />
                                            <span>Send</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
                            Select a contact to open the conversation thread.
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

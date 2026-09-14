import React, { useState } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Users,
    Search,
    Plus,
    Flame,
    Mail,
    Phone,
    Building2,
    MessageSquare,
    Trash2,
    Edit2,
    X,
    Tag,
} from 'lucide-react';
import { Contact, ContactTag } from '../../types';

interface Props {
    contacts: {
        data: Contact[];
        links: any[];
        total: number;
        current_page: number;
        last_page: number;
    };
    tags: ContactTag[];
    filters: {
        search?: string;
        tag?: string;
        status?: string;
    };
}

export default function ContactsIndex({ contacts, tags, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedTag, setSelectedTag] = useState(filters.tag || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [showModal, setShowModal] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        company: '',
        status: 'lead',
        lead_score: 25,
        notes: '',
        tag_ids: [] as number[],
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/contacts', {
            search,
            tag: selectedTag || undefined,
            status: selectedStatus || undefined,
        }, { preserveState: true });
    };

    const handleTagClick = (tagName: string) => {
        const next = selectedTag === tagName ? '' : tagName;
        setSelectedTag(next);
        router.get('/contacts', {
            search,
            tag: next || undefined,
            status: selectedStatus || undefined,
        }, { preserveState: true });
    };

    const handleStatusChange = (status: string) => {
        setSelectedStatus(status);
        router.get('/contacts', {
            search,
            tag: selectedTag || undefined,
            status: status || undefined,
        }, { preserveState: true });
    };

    const openCreateModal = () => {
        setEditingContact(null);
        setFormData({
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            company: '',
            status: 'lead',
            lead_score: 25,
            notes: '',
            tag_ids: [],
        });
        setShowModal(true);
    };

    const openEditModal = (c: Contact) => {
        setEditingContact(c);
        setFormData({
            first_name: c.first_name,
            last_name: c.last_name || '',
            email: c.email || '',
            phone: c.phone || '',
            company: c.company || '',
            status: c.status,
            lead_score: c.lead_score,
            notes: c.notes || '',
            tag_ids: c.tags ? c.tags.map((t) => t.id) : [],
        });
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingContact) {
            router.put(`/contacts/${editingContact.id}`, formData, {
                onSuccess: () => setShowModal(false),
            });
        } else {
            router.post('/contacts', formData, {
                onSuccess: () => setShowModal(false),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to remove this contact?')) {
            router.delete(`/contacts/${id}`);
        }
    };

    return (
        <AppLayout title="Contacts & CRM Leads">
            <Head title="Contacts & Leads - HighLevel Flow" />

            <div className="space-y-5">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight dark:text-white text-slate-900 flex items-center gap-2">
                            <span>Contacts & Client Directory</span>
                            <span className="text-xs px-2 py-0.5 rounded-sm dark:bg-slate-800 bg-slate-200 dark:text-slate-300 text-slate-700 font-semibold border dark:border-slate-700 border-slate-300">
                                {contacts.total} Total
                            </span>
                        </h1>
                        <p className="text-xs dark:text-slate-400 text-slate-500 mt-0.5">
                            Manage your marketing leads, prospect scoring, segmented tags, and communication history.
                        </p>
                    </div>

                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition self-start sm:self-auto"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add New Contact</span>
                    </button>
                </div>

                {/* Filter and Search Bar */}
                <div className="p-3.5 rounded-sm dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 shadow-sm space-y-3">
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <form onSubmit={handleSearch} className="relative flex-1 w-full">
                            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name, company, email or phone..."
                                className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700/80 border-slate-300 rounded-sm pl-9 pr-3 py-1.5 text-xs dark:text-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition"
                            />
                        </form>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <select
                                value={selectedStatus}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700/80 border-slate-300 rounded-sm px-2.5 py-1.5 text-xs dark:text-slate-200 text-slate-700 focus:outline-none focus:border-indigo-500"
                            >
                                <option value="">All Statuses</option>
                                <option value="lead">Lead</option>
                                <option value="hot_prospect">Hot Prospect</option>
                                <option value="customer">Customer</option>
                                <option value="churned">Churned</option>
                            </select>

                            <button
                                onClick={handleSearch}
                                className="px-3 py-1.5 rounded-sm dark:bg-slate-800 bg-slate-100 hover:dark:bg-slate-700 hover:bg-slate-200 dark:text-slate-200 text-slate-800 text-xs font-medium border dark:border-slate-700 border-slate-300 transition"
                            >
                                Apply
                            </button>
                        </div>
                    </div>

                    {/* Tag Pills Filter */}
                    {tags.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t dark:border-slate-800/80 border-slate-200">
                            <span className="text-[11px] dark:text-slate-500 text-slate-400 mr-1 flex items-center gap-1">
                                <Tag className="w-3 h-3" />
                                <span>Tags:</span>
                            </span>
                            {tags.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => handleTagClick(t.name)}
                                    className={`px-2 py-0.5 rounded-sm text-[11px] font-medium transition border ${
                                        selectedTag === t.name
                                            ? 'bg-indigo-600 text-white border-indigo-500'
                                            : 'dark:bg-slate-900 bg-slate-100 dark:text-slate-400 text-slate-600 dark:border-slate-800 border-slate-200 hover:dark:border-slate-700 hover:border-slate-300'
                                    }`}
                                >
                                    {t.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Contacts Table */}
                <div className="rounded-sm dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b dark:border-slate-800 border-slate-200 dark:bg-slate-950/60 bg-slate-50 text-[11px] font-semibold dark:text-slate-400 text-slate-500 uppercase tracking-wider">
                                    <th className="py-3 px-4">Contact</th>
                                    <th className="py-3 px-4">Company</th>
                                    <th className="py-3 px-4">Direct Contact</th>
                                    <th className="py-3 px-4">Lead Score</th>
                                    <th className="py-3 px-4">Tags</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-slate-800/60 divide-slate-200 text-xs dark:text-slate-300 text-slate-700">
                                {contacts.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-8 text-center text-slate-500">
                                            No contacts match your current filters.
                                        </td>
                                    </tr>
                                ) : (
                                    contacts.data.map((c) => (
                                        <tr key={c.id} className="dark:hover:bg-slate-900/30 hover:bg-slate-50 transition">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-7 h-7 rounded-sm dark:bg-slate-800 bg-indigo-50 border dark:border-slate-700 border-indigo-200 flex items-center justify-center font-bold text-xs text-indigo-600 dark:text-indigo-400">
                                                        {c.first_name[0]}
                                                        {c.last_name ? c.last_name[0] : ''}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold dark:text-white text-slate-900">
                                                            {c.first_name} {c.last_name}
                                                        </div>
                                                        <div className="text-[10px] text-slate-400">
                                                            Added {new Date(c.created_at).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-3 px-4">
                                                {c.company ? (
                                                    <span className="flex items-center gap-1 dark:text-slate-200 text-slate-800">
                                                        <Building2 className="w-3 h-3 text-slate-400" />
                                                        <span>{c.company}</span>
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 text-[11px]">—</span>
                                                )}
                                            </td>

                                            <td className="py-3 px-4">
                                                <div className="space-y-0.5 text-[11px]">
                                                    {c.email && (
                                                        <div className="flex items-center gap-1.5 dark:text-slate-300 text-slate-700">
                                                            <Mail className="w-3 h-3 text-slate-400" />
                                                            <span>{c.email}</span>
                                                        </div>
                                                    )}
                                                    {c.phone && (
                                                        <div className="flex items-center gap-1.5 text-slate-400">
                                                            <Phone className="w-3 h-3 text-slate-400" />
                                                            <span>{c.phone}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-1.5">
                                                    <Flame className={`w-3.5 h-3.5 ${c.lead_score >= 75 ? 'text-amber-500' : 'text-slate-400'}`} />
                                                    <span className="font-bold dark:text-slate-200 text-slate-800">{c.lead_score}</span>
                                                </div>
                                            </td>

                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-1 flex-wrap">
                                                    {c.tags && c.tags.length > 0 ? (
                                                        c.tags.map((t) => (
                                                            <span
                                                                key={t.id}
                                                                className="px-1.5 py-0.5 rounded-sm text-[10px] font-medium dark:bg-slate-900 bg-slate-100 border dark:border-slate-800 border-slate-300 dark:text-slate-300 text-slate-700"
                                                            >
                                                                {t.name}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-slate-400 text-[11px]">—</span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="py-3 px-4">
                                                <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-sm inline-block ${
                                                    c.status === 'hot_prospect'
                                                        ? 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20'
                                                        : c.status === 'customer'
                                                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                                        : 'dark:bg-slate-800 bg-slate-100 dark:text-slate-400 text-slate-600 border dark:border-slate-700 border-slate-300'
                                                }`}>
                                                    {c.status.replace('_', ' ')}
                                                </span>
                                            </td>

                                            <td className="py-3 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Link
                                                        href={`/conversations?contact_id=${c.id}`}
                                                        className="p-1 rounded-sm border dark:border-slate-800 border-slate-300 hover:dark:bg-slate-800 hover:bg-slate-100 dark:text-slate-300 text-slate-600 transition"
                                                        title="Open 2-Way Chat"
                                                    >
                                                        <MessageSquare className="w-3.5 h-3.5" />
                                                    </Link>
                                                    <button
                                                        onClick={() => openEditModal(c)}
                                                        className="p-1 rounded-sm border dark:border-slate-800 border-slate-300 hover:dark:bg-slate-800 hover:bg-slate-100 dark:text-slate-300 text-slate-600 transition"
                                                        title="Edit Contact"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(c.id)}
                                                        className="p-1 rounded-sm border dark:border-slate-800 border-slate-300 hover:dark:bg-rose-950/40 hover:bg-rose-50 text-rose-500 transition"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {contacts.last_page > 1 && (
                        <div className="p-3 border-t dark:border-slate-800 border-slate-200 flex items-center justify-between text-xs dark:text-slate-400 text-slate-500">
                            <span>
                                Page {contacts.current_page} of {contacts.last_page}
                            </span>
                            <div className="flex items-center gap-1">
                                {contacts.links.map((link, idx) => (
                                    <button
                                        key={idx}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.visit(link.url)}
                                        className={`px-2 py-1 rounded-sm border text-xs ${
                                            link.active
                                                ? 'bg-indigo-600 border-indigo-500 text-white font-bold'
                                                : 'dark:border-slate-800 border-slate-300 dark:hover:bg-slate-800 hover:bg-slate-100 dark:text-slate-300 text-slate-700'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Create / Edit Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
                        <div className="w-full max-w-lg dark:bg-[#0b1120] bg-white border dark:border-slate-800 border-slate-300 rounded-sm shadow-xl p-5 space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b dark:border-slate-800 border-slate-200">
                                <h3 className="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-1.5">
                                    <Users className="w-4 h-4 text-indigo-500" />
                                    <span>{editingContact ? 'Edit Contact' : 'Add New Contact'}</span>
                                </h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-1 rounded-sm text-slate-400 hover:text-slate-700 dark:hover:text-white"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block dark:text-slate-400 text-slate-600 mb-1 font-medium">First Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.first_name}
                                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                            className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block dark:text-slate-400 text-slate-600 mb-1 font-medium">Last Name</label>
                                        <input
                                            type="text"
                                            value={formData.last_name}
                                            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                            className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block dark:text-slate-400 text-slate-600 mb-1 font-medium">Email Address</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block dark:text-slate-400 text-slate-600 mb-1 font-medium">Phone Number</label>
                                        <input
                                            type="text"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="+1 555-0199"
                                            className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block dark:text-slate-400 text-slate-600 mb-1 font-medium">Company Name</label>
                                        <input
                                            type="text"
                                            value={formData.company}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                            className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block dark:text-slate-400 text-slate-600 mb-1 font-medium">Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500"
                                        >
                                            <option value="lead">Lead</option>
                                            <option value="hot_prospect">Hot Prospect</option>
                                            <option value="customer">Customer</option>
                                            <option value="churned">Churned</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block dark:text-slate-400 text-slate-600 mb-1 font-medium">
                                        Lead Score (0-100)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={formData.lead_score}
                                        onChange={(e) => setFormData({ ...formData, lead_score: parseInt(e.target.value) || 0 })}
                                        className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block dark:text-slate-400 text-slate-600 mb-1 font-medium">Notes & Context</label>
                                    <textarea
                                        rows={3}
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        placeholder="Add background notes or crawler findings..."
                                        className="w-full dark:bg-[#070a12] bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-sm px-2.5 py-1.5 dark:text-white text-slate-900 focus:outline-none focus:border-indigo-500"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-3 border-t dark:border-slate-800 border-slate-200">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-3 py-1.5 rounded-sm border dark:border-slate-700 border-slate-300 dark:text-slate-300 text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-1.5 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-sm"
                                    >
                                        {editingContact ? 'Save Changes' : 'Create Contact'}
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

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from '@/app/components/ToastProvider';

type Submission = {
    id: string;
    title: string;
    date: string;
    status: string;
    category: string;
    author?: string;
    file_url?: string;
};

export default function AntrianPersetujuanPage() {
    const { showToast } = useToast();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('Semua');

    // Revision Modal State
    const [showRevisionModal, setShowRevisionModal] = useState(false);
    const [revisingId, setRevisingId] = useState<string | null>(null);
    const [revisionNote, setRevisionNote] = useState('');

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/submissions?perPage=100');
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setSubmissions(data.items || []);
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        if (newStatus === 'Revisi') {
            setRevisingId(id);
            setRevisionNote('');
            setShowRevisionModal(true);
            return;
        }

        if (!confirm(`Ubah status menjadi "${newStatus}"?`)) {
            const selectEl = document.getElementById(`status-select-${id}`) as HTMLSelectElement;
            if (selectEl) selectEl.value = submissions.find(s => String(s.id) === String(id))?.status || '';
            return;
        }

        submitStatusUpdate(id, newStatus);
    };

    const submitStatusUpdate = async (id: string, newStatus: string, note?: string) => {
        setProcessingId(id);
        try {
            const body: any = { status: newStatus };
            if (note) body.revision_notes = note;

            const res = await fetch(`/api/submissions/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!res.ok) throw new Error('Gagal update status');

            // Update local state
            setSubmissions(prev => prev.map(sub =>
                String(sub.id) === String(id) ? { ...sub, status: newStatus } : sub
            ));
            showToast(`Status berhasil diperbarui menjadi ${newStatus}`, 'success');

        } catch (error) {
            showToast('Gagal mengubah status', 'error');
            console.error(error);
        } finally {
            setProcessingId(null);
            setShowRevisionModal(false);
            setRevisingId(null);
        }
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'Menunggu Validasi':
            case 'Menunggu':
                return { color: 'amber', bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-l-amber-500', raw: '#f59e0b' };
            case 'Review':
            case 'Sedang Direview':
                return { color: 'blue', bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-l-blue-500', raw: '#3b82f6' };
            case 'Revisi':
                return { color: 'red', bg: 'bg-red-100', text: 'text-red-700', border: 'border-l-red-500', raw: '#ef4444' };
            case 'Selesai':
            case 'Disetujui':
            case 'Ditetapkan':
                return { color: 'emerald', bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-l-emerald-500', raw: '#10b981' };
            default:
                return { color: 'gray', bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-l-gray-400', raw: '#9ca3af' };
        }
    };

    // Calculate Stats
    const stats = {
        total: submissions.length,
        waiting: submissions.filter(s => ['Menunggu Validasi', 'Review', 'Menunggu', 'Sedang Direview'].includes(s.status)).length,
        revision: submissions.filter(s => s.status === 'Revisi').length,
        approved: submissions.filter(s => ['Selesai', 'Disetujui', 'Ditetapkan'].includes(s.status)).length,
    };

    const tabs = ['Semua', 'Menunggu Validasi', 'Review', 'Revisi', 'Disetujui'];

    const filteredSubmissions = submissions.filter((sub) => {
        const matchesSearch = (sub.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (sub.author || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (String(sub.id) || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesTab = activeTab === 'Semua' || sub.status === activeTab;

        return matchesSearch && matchesTab;
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative pb-12 font-sans">

            {/* Header Section */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Editor</h1>
                <p className="text-gray-500 mt-1">Pantau dan kelola naskah yang masuk dengan efisien.</p>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Naskah', value: stats.total, color: 'bg-[#00BDBB]', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                    { label: 'Perlu Review', value: stats.waiting, color: 'bg-amber-500', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                    { label: 'Revisi', value: stats.revision, color: 'bg-red-500', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
                    { label: 'Disetujui', value: stats.approved, color: 'bg-emerald-500', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.label}</p>
                            <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
                        </div>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-${stat.color.split('-')[1]}-200 ${stat.color} bg-opacity-90 group-hover:scale-110 transition-transform`}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                            </svg>
                        </div>
                    </div>
                ))}
            </div>

            {/* Controls Section */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                {/* Tabs */}
                <div className="flex p-1 bg-gray-50 rounded-xl w-full md:w-auto overflow-x-auto no-scrollbar">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab
                                ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5'
                                : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative w-full md:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Cari naskah..."
                        className="block w-full pl-9 pr-3 py-2 border-none bg-transparent text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Content List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#00BDBB] rounded-full animate-spin"></div>
                    </div>
                ) : filteredSubmissions.length > 0 ? (
                    <div className="grid gap-4">
                        {filteredSubmissions.map((sub) => {
                            const statusConfig = getStatusConfig(sub.status);
                            return (
                                <div key={sub.id} className={`group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden ${statusConfig.border} border-l-[6px]`}>

                                    <div className="p-5 flex flex-col md:flex-row gap-6 justify-between items-start">
                                        {/* Main Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                                                    {sub.category}
                                                </span>
                                                <span className="text-[10px] font-mono text-gray-300">•</span>
                                                <span className="text-xs font-mono text-gray-400 font-medium">
                                                    #{sub.id}
                                                </span>
                                            </div>

                                            <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug group-hover:text-[#00BDBB] transition-colors">
                                                {sub.title}
                                            </h3>

                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[9px] font-bold text-gray-600">
                                                        {(sub.author || '?').charAt(0)}
                                                    </div>
                                                    <span className="font-medium text-gray-700">{sub.author || 'Author'}</span>
                                                </div>
                                                <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                                <span className="flex items-center gap-1.5 text-xs">
                                                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    {sub.date}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action Panel */}
                                        <div className="w-full md:w-auto flex flex-col items-end gap-3 shrink-0">

                                            <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-100">
                                                <div className={`px-2 py-1 rounded text-xs font-bold ${statusConfig.bg} ${statusConfig.text}`}>
                                                    {sub.status}
                                                </div>
                                                <select
                                                    id={`status-select-${sub.id}`}
                                                    value={sub.status}
                                                    disabled={processingId === String(sub.id)}
                                                    onChange={(e) => handleStatusChange(String(sub.id), e.target.value)}
                                                    className="bg-transparent text-xs font-semibold text-gray-700 focus:outline-none cursor-pointer pl-1 pr-6 py-1 hover:text-black transition-colors"
                                                >
                                                    <option value="Menunggu Validasi">Menunggu Validasi</option>
                                                    <option value="Review">Review</option>
                                                    <option value="Revisi">Revisi</option>
                                                    <option value="Disetujui">Disetujui</option>
                                                </select>
                                            </div>

                                            <div className="flex items-center gap-2 w-full justify-end">
                                                {sub.file_url && (
                                                    <a
                                                        href={sub.file_url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="p-2 text-gray-400 hover:text-[#00BDBB] hover:bg-teal-50 rounded-lg transition-all"
                                                        title="Unduh Naskah"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                        </svg>
                                                    </a>
                                                )}
                                                <Link
                                                    href={`/editor/submission/${sub.id}`}
                                                    className="px-4 py-2 text-xs font-bold text-white bg-gray-900 hover:bg-[#00BDBB] rounded-lg transition-all shadow-sm flex items-center gap-2"
                                                >
                                                    Detail
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-gray-100 border-dashed">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 transform rotate-3">
                            <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-bold text-gray-900 mb-1">Data Kosong</h3>
                        <p className="text-xs text-gray-500">
                            {activeTab === 'Semua'
                                ? 'Belum ada naskah yang masuk.'
                                : `Tidak ada naskah status "${activeTab}".`}
                        </p>
                    </div>
                )}
            </div>

            {/* Custom Revision Modal */}
            {showRevisionModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-0 overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                <span className="w-2 h-6 bg-red-500 rounded-full"></span>
                                Catatan Revisi Editor
                            </h3>
                            <button onClick={() => { setShowRevisionModal(false); setRevisingId(null); }} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-600 leading-relaxed">
                                <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Silakan tuliskan poin-poin revisi yang harus dikerjakan oleh penulis. Pesan ini akan muncul di notifikasi dan detail pengajuan penulis.
                            </div>

                            <div>
                                <textarea
                                    value={revisionNote}
                                    onChange={(e) => setRevisionNote(e.target.value)}
                                    rows={8}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00BDBB] focus:border-transparent transition-all placeholder-gray-400 text-gray-900 text-sm resize-none"
                                    placeholder="Tuliskan catatan revisi di sini..."
                                    autoFocus
                                ></textarea>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                            <button
                                onClick={() => { setShowRevisionModal(false); setRevisingId(null); }}
                                className="px-5 py-2.5 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-white hover:border-gray-300 transition-all text-sm"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => revisingId && submitStatusUpdate(revisingId, 'Revisi', revisionNote)}
                                disabled={!revisionNote.trim() || !!processingId}
                                className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:shadow-none text-sm flex items-center gap-2"
                            >
                                {processingId ? 'Menyimpan...' : 'Kirim Revisi'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

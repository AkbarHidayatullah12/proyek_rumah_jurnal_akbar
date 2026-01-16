"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/app/components/ToastProvider';

export default function EditorSubmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [submission, setSubmission] = useState<any | null>(null);

    // Status Management
    const [processing, setProcessing] = useState(false);
    const [showRevisionModal, setShowRevisionModal] = useState(false);
    const [revisionNote, setRevisionNote] = useState('');

    const fetchSubmission = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/submissions/${id}`, { cache: 'no-store' });
            if (!res.ok) throw new Error('Failed to load');
            const json = await res.json();
            setSubmission(json.submission || null);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmission();
    }, [id]);

    const handleStatusChange = async (newStatus: string) => {
        if (newStatus === 'Revisi') {
            setRevisionNote('');
            setShowRevisionModal(true);
            return;
        }

        if (!confirm(`Ubah status menjadi "${newStatus}"?`)) return;
        submitStatusUpdate(newStatus);
    };

    const submitStatusUpdate = async (newStatus: string, note?: string) => {
        setProcessing(true);
        try {
            const body: any = { status: newStatus };
            if (note) body.revision_notes = note;

            const res = await fetch(`/api/submissions/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!res.ok) throw new Error('Gagal update status');
            await fetchSubmission(); // Reload data
            setShowRevisionModal(false);
            setRevisionNote('');
            showToast(`Status berhasil diubah menjadi ${newStatus}`, 'success');
        } catch (err) {
            showToast('Gagal mengubah status', 'error');
        } finally {
            setProcessing(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Menunggu Validasi': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'Review': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Revisi': return 'bg-red-100 text-red-800 border-red-200';
            case 'Disetujui': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#00BDBB]/30 border-t-[#00BDBB] rounded-full animate-spin"></div>
        </div>
    );

    if (!submission) return <div className="p-10 text-center">Data tidak ditemukan.</div>;

    return (
        <div className="min-h-screen bg-gray-50/50 pb-12 font-sans">

            {/* Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/editor/antrian-persetujuan" className="p-2 -ml-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </Link>
                        <div className="h-6 w-px bg-gray-200"></div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900 leading-none">Detail Naskah</h1>
                            <p className="text-xs text-gray-500 mt-1">ID: #{id}</p>
                        </div>
                    </div>

                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(submission.status)} flex items-center gap-2`}>
                        <span className="w-2 h-2 rounded-full bg-current opacity-60 animate-pulse"></span>
                        {submission.status}
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Content */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Main Info Card */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00BDBB] to-emerald-500"></div>

                            <span className="inline-block px-3 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider mb-4 border border-gray-200">
                                {submission.category || 'Umum'}
                            </span>

                            <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-snug">{submission.title}</h2>

                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 mb-8 border-b border-gray-100 pb-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-700">
                                        {(submission.author || '?').charAt(0)}
                                    </div>
                                    <span className="font-medium text-gray-900">{submission.author || 'Author'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <span>{submission.instansi || 'Instansi tidak tersedia'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{submission.date}</span>
                                </div>
                            </div>

                            <div className="prose prose-sm max-w-none text-gray-600">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">Abstrak</h3>
                                <p className="whitespace-pre-line leading-relaxed text-justify bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    {submission.abstract || submission.content || 'Konten abstrak belum tersedia untuk naskah ini.'}
                                </p>
                            </div>
                        </div>

                        {/* Files Card */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                                <svg className="w-4 h-4 text-[#00BDBB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Berkas Naskah
                            </h3>
                            <div className="grid gap-3">
                                {/* Main File */}
                                {submission.file_url ? (
                                    <div className="flex items-center justify-between p-4 bg-teal-50 border border-teal-100 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded-lg shadow-sm text-red-500">
                                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">Full Manuscript</p>
                                                <p className="text-xs text-gray-500">Versi Terkini</p>
                                            </div>
                                        </div>
                                        <a href={submission.file_url} target="_blank" className="px-4 py-2 bg-[#00BDBB] hover:bg-[#00AFAF] text-white text-xs font-bold rounded-lg shadow-sm transition">
                                            Unduh
                                        </a>
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-500 italic p-4 bg-gray-50 rounded-xl text-center">Tidak ada file utama.</div>
                                )}

                                {/* Additional Files (if any) */}
                                {submission.files && submission.files.length > 0 && submission.files.map((f: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl">
                                        <span className="text-sm font-medium text-gray-700 truncate ml-2">{f.filename || f.name}</span>
                                        <a href={f.url} target="_blank" className="text-[#00BDBB] hover:underline text-xs font-bold px-3">Unduh</a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar (Actions) */}
                    <div className="space-y-6">
                        {/* Action Card */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-6 pb-4 border-b border-gray-100">
                                Aksi Editor
                            </h3>

                            <div className="space-y-3 mb-6">
                                <button
                                    onClick={() => handleStatusChange('Review')}
                                    disabled={processing || submission.status === 'Review'}
                                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all
                                    ${submission.status === 'Review'
                                            ? 'bg-blue-50 border-blue-200 text-blue-700 ring-1 ring-blue-200'
                                            : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50'}`}
                                >
                                    <span className="font-semibold text-sm">Review</span>
                                    {submission.status === 'Review' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                                </button>

                                <button
                                    onClick={() => handleStatusChange('Revisi')}
                                    disabled={processing || submission.status === 'Revisi'}
                                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all
                                    ${submission.status === 'Revisi'
                                            ? 'bg-red-50 border-red-200 text-red-700 ring-1 ring-red-200'
                                            : 'bg-white border-gray-200 text-gray-600 hover:border-red-300 hover:bg-red-50'}`}
                                >
                                    <span className="font-semibold text-sm">Minta Revisi</span>
                                    {submission.status === 'Revisi' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                                </button>

                                <button
                                    onClick={() => handleStatusChange('Disetujui')}
                                    disabled={processing || submission.status === 'Disetujui'}
                                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all
                                    ${submission.status === 'Disetujui'
                                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700 ring-1 ring-emerald-200'
                                            : 'bg-white border-gray-200 text-gray-600 hover:border-emerald-300 hover:bg-emerald-50'}`}
                                >
                                    <span className="font-semibold text-sm">Setujui Naskah</span>
                                    {submission.status === 'Disetujui' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                                </button>
                            </div>

                            {/* Revision Notes Display */}
                            {submission.status === 'Revisi' && submission.revision_notes && (
                                <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                                    <h4 className="text-xs font-bold text-red-800 mb-2 uppercase">Catatan Revisi Aktif</h4>
                                    <p className="text-sm text-red-700 whitespace-pre-line">{submission.revision_notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Logic Reuse */}
            {showRevisionModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4">
                        <h3 className="text-lg font-bold text-gray-900">Catatan Revisi</h3>
                        <textarea
                            value={revisionNote}
                            onChange={(e) => setRevisionNote(e.target.value)}
                            rows={6}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00BDBB] text-gray-900 placeholder-gray-400"
                            placeholder="Masukkan detail revisi..."
                            autoFocus
                        ></textarea>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setShowRevisionModal(false)} className="px-5 py-2.5 rounded-xl border font-bold text-gray-600 hover:bg-gray-50">Batal</button>
                            <button onClick={() => submitStatusUpdate('Revisi', revisionNote)} disabled={!revisionNote.trim() || processing} className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 disabled:opacity-50">Kirim Revisi</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/ToastProvider';

export default function AdminReviewPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const { showToast } = useToast();

    const [submission, setSubmission] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const [showRevisionModal, setShowRevisionModal] = useState(false);
    const [revisionNote, setRevisionNote] = useState('');

    useEffect(() => {
        fetchSubmission();
    }, [id]);

    const fetchSubmission = async () => {
        try {
            const res = await fetch(`/api/submissions/${id}`);
            if (!res.ok) throw new Error('Submission not found');
            const data = await res.json();
            setSubmission(data.submission);
        } catch (error) {
            console.error(error);
            showToast('Gagal memuat data pengajuan', 'error');
            router.push('/admin/antrian-validasi');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (newStatus: string) => {
        if (newStatus === 'Revisi') {
            setRevisionNote('');
            setShowRevisionModal(true);
            return;
        }

        if (!confirm('Validasi pengajuan ini dan teruskan ke Editor?')) return;
        submitStatusUpdate(newStatus);
    };

    const submitStatusUpdate = async (status: string, note?: string) => {
        setProcessing(true);
        try {
            const body: any = { status };
            if (note) body.revision_notes = note;

            const res = await fetch(`/api/submissions/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!res.ok) throw new Error('Gagal update status');

            showToast('Status berhasil diperbarui!', 'success');
            router.push('/admin/antrian-validasi');
        } catch (error) {
            console.error(error);
            showToast('Terjadi kesalahan saat memproses aksi.', 'error');
        } finally {
            setProcessing(false);
            setShowRevisionModal(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--page-bg)]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00BDBB] border-t-transparent"></div>
            </div>
        );
    }

    if (!submission) return null;

    return (
        <div className="min-h-screen w-full px-4 sm:px-6 lg:px-8 py-8 bg-[var(--page-bg)] relative">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/admin/antrian-validasi" className="p-2 rounded-full hover:bg-white hover:shadow-sm transition-all text-gray-500">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Tinjau Pengajuan</h1>
                        <p className="text-sm text-gray-500">Validasi kelengkapan awal naskah.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Title Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <span className="text-xs font-bold text-[#00BDBB] bg-teal-50 px-2.5 py-1 rounded-md mb-3 inline-block">
                                {submission.category || 'Artikel Riset'}
                            </span>
                            <h2 className="text-xl font-bold text-gray-900 leading-relaxed mb-4">
                                {submission.title}
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Abstrak</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed text-justify">
                                        {submission.abstract || 'Tidak ada abstrak.'}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Kata Kunci</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {(submission.keywords || '').split(',').map((k: string, i: number) => (
                                            <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                {k.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* File Preview */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                File Naskah
                            </h3>
                            {submission.file_url ? (
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                                            <span className="text-xs font-bold">PDF</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 break-all line-clamp-1">
                                                {submission.file_url.split('/').pop()}
                                            </p>
                                            <p className="text-xs text-gray-500">Dokumen Naskah</p>
                                        </div>
                                    </div>
                                    <a
                                        href={submission.file_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-4 py-2 text-sm font-medium text-[#00BDBB] bg-white border border-gray-200 rounded-lg hover:bg-teal-50 transition-colors shadow-sm"
                                    >
                                        Lihat
                                    </a>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">Belum ada file yang diunggah.</p>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Actions */}
                    <div className="space-y-6">
                        {/* Status Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Status Pengajuan</h3>
                            <div className={`text-center py-3 rounded-xl font-bold text-sm mb-6
                                ${submission.status === 'Menunggu Validasi' ? 'bg-amber-100 text-amber-700' :
                                    submission.status === 'Review' ? 'bg-blue-100 text-blue-700' :
                                        submission.status === 'Revisi' ? 'bg-red-100 text-red-700' :
                                            'bg-emerald-100 text-emerald-700'
                                }`}>
                                {submission.status}
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Tanggal Masuk</span>
                                    <span className="font-medium text-gray-900">{submission.date}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Target Jurnal</span>
                                    <span className="font-medium text-gray-900">{submission.journal_id || '-'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-3">
                            <h3 className="text-sm font-bold text-gray-900 mb-2">Tindakan Admin</h3>

                            <button
                                onClick={() => handleAction('Review')}
                                disabled={processing || submission.status !== 'Menunggu Validasi'}
                                className="w-full py-3 bg-[#00BDBB] hover:bg-[#00AC9D] text-white rounded-xl font-semibold shadow-lg shadow-teal-100 transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Validasi & Teruskan
                            </button>

                            <button
                                onClick={() => handleAction('Revisi')}
                                disabled={processing || submission.status !== 'Menunggu Validasi'}
                                className="w-full py-3 bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Minta Revisi
                            </button>

                            <p className="text-xs text-center text-gray-400 mt-2">
                                Tindakan ini akan mengirim notifikasi ke penulis.
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Custom Revision Modal */}
            {showRevisionModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">Catatan Revisi</h3>
                            <button onClick={() => setShowRevisionModal(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="bg-amber-50 text-amber-800 text-sm p-3 rounded-lg flex items-start gap-2">
                            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p>Berikan catatan yang jelas kepada penulis mengenai bagian yang perlu diperbaiki.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pesan untuk Penulis</label>
                            <textarea
                                value={revisionNote}
                                onChange={(e) => setRevisionNote(e.target.value)}
                                rows={5}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00BDBB] focus:border-transparent transition-all placeholder-gray-400 text-gray-900"
                                placeholder="Contoh: Mohon perbaiki format sitasi dan tambahkan abstrak bahasa Inggris..."
                                autoFocus
                            ></textarea>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                onClick={() => setShowRevisionModal(false)}
                                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => submitStatusUpdate('Revisi', revisionNote)}
                                disabled={!revisionNote.trim() || processing}
                                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg shadow-red-200 transition-all disabled:opacity-50 disabled:shadow-none"
                            >
                                {processing ? 'Memproses...' : 'Kirim Revisi'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

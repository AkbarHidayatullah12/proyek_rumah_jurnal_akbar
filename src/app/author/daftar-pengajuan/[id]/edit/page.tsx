'use client';

import { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/ToastProvider';

export default function EditSubmissionPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        journalId: '',
        journalVolume: '',
        title: '',
        abstract: '',
        keywords: '',
        category: 'Riset',
        file: null as File | null,
        currentFileName: '' // To show existing file name
    });

    const { showToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchSubmission();
    }, [id]);

    const fetchSubmission = async () => {
        try {
            const res = await fetch(`/api/submissions/${id}`);
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            const sub = data.submission;

            setFormData({
                journalId: sub.journal_id,
                journalVolume: sub.journal_volume,
                title: sub.title,
                abstract: sub.abstract,
                keywords: sub.keywords,
                category: sub.category,
                file: null,
                currentFileName: sub.file_url ? sub.file_url.split('/').pop() : ''
            });
        } catch (error) {
            console.error(error);
            showToast('Gagal memuat data pengajuan', 'error');
            router.push('/author/daftar-pengajuan');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const data = new FormData();
            data.append('journalId', formData.journalId);
            data.append('journalVolume', formData.journalVolume);
            data.append('title', formData.title);
            data.append('abstract', formData.abstract);
            data.append('keywords', formData.keywords);
            data.append('category', formData.category);

            if (formData.file) {
                data.append('file', formData.file);
            }

            const res = await fetch(`/api/submissions/${id}`, {
                method: 'PUT',
                body: data,
            });

            if (!res.ok) {
                throw new Error('Gagal memperbarui pengajuan');
            }

            showToast('Pengajuan berhasil diperbarui!', 'success');
            router.push('/author/daftar-pengajuan');
        } catch (error) {
            console.error(error);
            showToast('Terjadi kesalahan saat memperbarui data.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, file: e.target.files[0] });
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00BDBB]"></div></div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 py-6">

            {/* Header & Navigation */}
            <div className="flex items-center gap-4">
                <Link href="/author/daftar-pengajuan">
                    <button className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm group">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Edit Pengajuan</h1>
                    <p className="text-gray-500 mt-1">Perbarui informasi naskah Anda.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* Section A: Jurnal Target */}
                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                        <span className="w-8 h-8 rounded-lg bg-teal-50 text-[#00BDBB] flex items-center justify-center font-bold text-sm">A</span>
                        Target Publikasi
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-900">Pilih Jurnal / Konferensi <span className="text-red-500">*</span></label>
                            <select
                                name="journalId"
                                value={formData.journalId}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 bg-white focus:ring-2 focus:ring-[#00BDBB]/20 focus:border-[#00BDBB] outline-none transition"
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- Pilih Target Publikasi --</option>
                                <option value="JNL-001">Jurnal Teknologi Informasi dan Komputer (JTIK)</option>
                                <option value="JNL-002">Jurnal Pendidikan Indonesia (JPI)</option>
                                <option value="CONF-2025">Seminar Nasional Teknologi 2025</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-900">Volume / Edisi Target</label>
                            <input
                                type="text"
                                name="journalVolume"
                                value={formData.journalVolume}
                                placeholder="Contoh: Vol. 5 No. 1 2025"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#00BDBB]/20 focus:border-[#00BDBB] outline-none transition"
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </section>

                {/* Section B: Data Artikel */}
                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                        <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">B</span>
                        Data Artikel / Paper
                    </h2>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-900">Judul Artikel <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                placeholder="Masukkan judul lengkap artikel..."
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#00BDBB]/20 focus:border-[#00BDBB] outline-none transition"
                                required
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-900">Kategori</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 bg-white focus:ring-2 focus:ring-[#00BDBB]/20 focus:border-[#00BDBB] outline-none transition"
                                    onChange={handleChange}
                                >
                                    <option value="Riset">Artikel Riset</option>
                                    <option value="Review">Literature Review</option>
                                    <option value="Studi Kasus">Studi Kasus</option>
                                    <option value="Prosiding">Prosiding</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-900">Keywords</label>
                                <input
                                    type="text"
                                    name="keywords"
                                    value={formData.keywords}
                                    placeholder="Dipisahkan koma, misal: AI, Education, IoT"
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#00BDBB]/20 focus:border-[#00BDBB] outline-none transition"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-900">Abstrak</label>
                            <textarea
                                name="abstract"
                                rows={5}
                                value={formData.abstract}
                                placeholder="Tuliskan abstrak singkat artikel Anda..."
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#00BDBB]/20 focus:border-[#00BDBB] outline-none transition resize-none"
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-900">Upload File Naskah (PDF/DOCX)</label>
                            <div
                                className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition cursor-pointer group"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div className="w-12 h-12 rounded-full bg-gray-100 mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                </div>
                                {formData.file ? (
                                    <p className="text-sm font-medium text-[#00BDBB]">{formData.file.name}</p>
                                ) : formData.currentFileName ? (
                                    <>
                                        <p className="text-sm font-medium text-gray-900 mb-1">File saat ini: {formData.currentFileName}</p>
                                        <p className="text-xs text-gray-500">Klik untuk mengganti</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-sm font-medium text-gray-700">Klik untuk upload file baru</p>
                                    </>
                                )}
                                <input
                                    type="file"
                                    className="hidden"
                                    accept=".pdf,.docx,.doc"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-4 pt-4">
                    <Link href="/author/daftar-pengajuan">
                        <button type="button" className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition">
                            Batal
                        </button>
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2.5 rounded-xl bg-[#00BDBB] text-white font-semibold hover:bg-[#00AFAF] transition shadow-lg shadow-teal-100 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Menyimpan...
                            </>
                        ) : (
                            'Simpan Perubahan'
                        )}
                    </button>
                </div>

            </form>
        </div>
    );
}

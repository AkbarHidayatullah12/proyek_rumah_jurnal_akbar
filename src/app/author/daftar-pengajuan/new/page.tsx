'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/ToastProvider';

export default function NewSubmissionPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    journalId: '',
    journalVolume: '',
    title: '',
    abstract: '',
    keywords: '',
    category: 'Riset',
    file: null as File | null
  });

  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file) {
      showToast('Mohon upload file naskah!', 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append('journalId', formData.journalId);
      data.append('journalVolume', formData.journalVolume);
      data.append('title', formData.title);
      data.append('abstract', formData.abstract);
      data.append('keywords', formData.keywords);
      data.append('category', formData.category);
      data.append('file', formData.file);

      const res = await fetch('/api/submissions', {
        method: 'POST',
        body: data,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Gagal mengirim pengajuan (${res.status}: ${res.statusText})`);
      }

      const result = await res.json();
      showToast('Pengajuan berhasil dikirim!', 'success');
      router.push('/author/daftar-pengajuan');
    } catch (error) {
      console.error(error);
      showToast(error instanceof Error ? error.message : 'Terjadi kesalahan saat mengirim data.', 'error');
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

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header & Navigation */}
      <div className="flex items-center gap-4">
        <Link href="/author/daftar-pengajuan">
          <button className="p-2bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Pengajuan LOA Baru</h1>
          <p className="text-gray-500 mt-1">Lengkapi formulir di bawah ini untuk mengajukan Letter of Acceptance.</p>
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
                placeholder="Tuliskan abstrak singkat artikel Anda..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#00BDBB]/20 focus:border-[#00BDBB] outline-none transition resize-none"
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">Upload File Naskah (PDF/DOCX) <span className="text-red-500">*</span></label>
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
                ) : (
                  <>
                    <p className="text-sm font-medium text-gray-700">Klik untuk upload file</p>
                    <p className="text-xs text-gray-400 mt-1">Format: .pdf, .docx (Maks. 5MB)</p>
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
                Mengirim...
              </>
            ) : (
              'Kirim Pengajuan'
            )}
          </button>
        </div>

      </form>
    </div>
  );
}

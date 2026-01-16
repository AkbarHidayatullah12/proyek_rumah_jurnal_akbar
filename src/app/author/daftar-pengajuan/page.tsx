"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Submission = {
  id: string;
  title: string;
  date: string;
  status: string;
  revision_notes?: string;
};

export default function DaftarPengajuanPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Semua');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = ['Semua', 'Draft', 'Menunggu Validasi', 'Review', 'Revisi', 'Disetujui'];

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

  const filteredSubmissions = submissions.filter((sub) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = (sub.title || '').toLowerCase().includes(term) || (String(sub.id) || '').toLowerCase().includes(term);
    const matchesTab = activeTab === 'Semua' ? true : sub.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Daftar Pengajuan
          </h1>
          <p className="text-gray-500 mt-2 text-base">
            Kelola naskah, pantau status revisi, dan unduh LOA Anda di sini.
          </p>
        </div>
        <Link href="/author/daftar-pengajuan/new">
          <button className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00BDBB] to-[#009e9e] text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-teal-500/30 hover:shadow-teal-500/40 hover:-translate-y-0.5 active:translate-y-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:rotate-90" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Buat Pengajuan Baru
          </button>
        </Link>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Total Pengajuan</p>
            <p className="text-2xl font-black text-gray-900">{submissions.length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Menunggu</p>
            <p className="text-2xl font-black text-gray-900">{submissions.filter(s => s.status === 'Menunggu Validasi' || s.status === 'Draft').length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Perlu Revisi</p>
            <p className="text-2xl font-black text-gray-900">{submissions.filter(s => s.status === 'Revisi').length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Disetujui</p>
            <p className="text-2xl font-black text-gray-900">{submissions.filter(s => s.status === 'Disetujui').length}</p>
          </div>
        </div>
      </div>

      {/* Controls: Tabs & Search */}
      <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex bg-gray-50/80 p-1.5 rounded-xl overflow-x-auto no-scrollbar w-full md:w-fit border border-gray-100/50">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all duration-200 whitespace-nowrap ${activeTab === tab
                ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80 px-2 pb-2 md:pb-0">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Cari berdasarkan judul..."
            className="block w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00BDBB]/20 focus:bg-white transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-gray-500">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#00BDBB] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm font-medium animate-pulse">Sedang memuat data...</p>
          </div>
        ) : filteredSubmissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider w-24">ID</th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Judul Naskah & Waktu</th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Status Terkini</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="group hover:bg-teal-50/20 transition-all duration-200">
                    <td className="px-8 py-6 align-top">
                      <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100/80 border border-gray-200 px-2.5 py-1.5 rounded-lg group-hover:border-[#00BDBB]/30 group-hover:text-[#00BDBB] transition-colors">#{sub.id}</span>
                    </td>
                    <td className="px-6 py-6 align-top">
                      <div className="space-y-1.5">
                        <Link href={`/author/daftar-pengajuan/${sub.id}`}>
                          <h3 className="font-bold text-gray-900 text-base group-hover:text-[#00BDBB] transition-colors leading-snug line-clamp-2 cursor-pointer">
                            {sub.title}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {sub.date}
                          </span>
                        </div>

                        {/* Inline Revision Note Warning */}
                        {sub.status === 'Revisi' && sub.revision_notes && (
                          <div className="mt-3 flex items-start gap-2.5 bg-red-50/80 p-3 rounded-b-xl rounded-tr-xl border border-red-100 text-xs text-red-700 animate-in slide-in-from-top-1">
                            <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            <div className="flex-1">
                              <span className="font-bold block mb-0.5">Catatan Editor:</span>
                              <span className="leading-relaxed opacity-90">"{sub.revision_notes}"</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-6 align-top">
                      <span className={`inline-flex items-center gap-2 px-3 pl-2 py-1.5 rounded-full text-xs font-bold capitalize shadow-sm border transition-transform group-hover:scale-105 origin-left
                        ${sub.status === 'Revisi' ? 'bg-red-50 text-red-700 border-red-100' :
                          sub.status === 'Disetujui' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                            sub.status === 'Review' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                              sub.status === 'Menunggu Validasi' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                'bg-gray-50 text-gray-600 border-gray-200'
                        }`}>
                        <span className={`w-2 h-2 rounded-full ring-2 ring-white
                          ${sub.status === 'Revisi' ? 'bg-red-500' :
                            sub.status === 'Disetujui' ? 'bg-emerald-500' :
                              sub.status === 'Review' ? 'bg-blue-500' :
                                sub.status === 'Menunggu Validasi' ? 'bg-amber-500' : 'bg-gray-400'}`}
                        ></span>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 align-middle text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link href={`/author/daftar-pengajuan/${sub.id}`}>
                          <button
                            className="px-5 py-2 text-sm font-bold text-gray-500 hover:text-[#00BDBB] bg-gray-50/50 hover:bg-teal-50 border border-gray-100/50 hover:border-teal-100 rounded-xl transition-all"
                          >
                            Detail
                          </button>
                        </Link>
                        {sub.status === 'Draft' || sub.status === 'Revisi' ? (
                          <Link href={`/author/daftar-pengajuan/${sub.id}/edit`}>
                            <button
                              className="px-5 py-2 text-sm font-bold text-amber-600 hover:text-amber-700 bg-amber-50/50 hover:bg-amber-100/50 border border-amber-50 hover:border-amber-100 rounded-xl transition-all"
                            >
                              Edit
                            </button>
                          </Link>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-gray-50/30">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-[#00BDBB]/20 blur-xl rounded-full"></div>
              <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {/* Floating plus icon */}
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#00BDBB] rounded-full flex items-center justify-center text-white border-4 border-white">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada pengajuan</h3>
            <p className="text-gray-500 text-sm text-center max-w-sm mx-auto mb-8 leading-relaxed">
              {searchTerm
                ? `Tidak ada hasil untuk pencarian "${searchTerm}". Coba kata kunci lain.`
                : activeTab !== 'Semua'
                  ? `Anda belum memiliki dokumen dengan status "${activeTab}".`
                  : 'Mulai perjalanan publikasi Anda dengan membuat pengajuan baru sekarang.'}
            </p>

            {(activeTab === 'Semua' && !searchTerm) && (
              <Link href="/author/daftar-pengajuan/new">
                <button className="px-8 py-3 bg-[#00BDBB] hover:bg-[#00AC9D] text-white rounded-xl font-bold shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 hover:-translate-y-0.5 transition-all text-sm">
                  Buat Pengajuan Pertama
                </button>
              </Link>
            )}
          </div>
        )}
      </div>

    </div>
  );
}

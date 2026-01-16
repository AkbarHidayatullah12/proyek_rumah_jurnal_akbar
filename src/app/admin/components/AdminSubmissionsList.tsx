'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Submission = {
  id: string;
  title: string;
  author: string;
  instansi?: string;
  date: string;
  status: string;
  revision_notes?: string;
};

export default function AdminSubmissionsList() {
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/submissions?perPage=100');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      if (data && Array.isArray(data.items)) {
        setItems(data.items.map((i: any) => ({
          id: String(i.id),
          title: i.title,
          author: i.author || '—', // API currently doesn't return author
          instansi: '—',
          date: i.date,
          status: i.status,
          revision_notes: i.revision_notes
        })));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* Professional UI Implementation */
  const [activeTab, setActiveTab] = useState('Semua');
  const tabs = ['Semua', 'Menunggu Validasi', 'Review', 'Revisi', 'Disetujui'];

  const filtered = items.filter(i => {
    const matchesQuery = i.title.toLowerCase().includes(query.toLowerCase()) ||
      i.id.toLowerCase().includes(query.toLowerCase()) ||
      i.author.toLowerCase().includes(query.toLowerCase());

    const matchesTab = activeTab === 'Semua' ? true : i.status === activeTab;

    return matchesQuery && matchesTab;
  });

  return (
    <div className="space-y-6">
      {/* Search & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex bg-gray-100/80 p-1 rounded-xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === tab
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by ID, Title, or Author..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00BDBB]/20 focus:border-[#00BDBB] transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="w-full text-center py-20">
            <div className="w-10 h-10 rounded-full border-4 border-[#00BDBB] border-t-transparent animate-spin mx-auto" />
            <p className="text-gray-400 text-sm mt-3">Loading submissions...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="py-4 px-6 font-semibold text-xs text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="py-4 px-6 font-semibold text-xs text-gray-500 uppercase tracking-wider w-[40%]">Judul Artikel</th>
                  <th className="py-4 px-6 font-semibold text-xs text-gray-500 uppercase tracking-wider">Penulis</th>
                  <th className="py-4 px-6 font-semibold text-xs text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 font-semibold text-xs text-gray-500 uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length > 0 ? (
                  filtered.map((s) => (
                    <tr
                      key={s.id}
                      className="group hover:bg-teal-50/10 transition-colors duration-150"
                    >
                      <td className="py-4 px-6">
                        <span className="font-mono text-xs font-bold text-[#00BDBB] bg-teal-50 px-2 py-1 rounded-md">
                          #{s.id}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-semibold text-gray-900 leading-snug group-hover:text-[#00BDBB] transition-colors">
                          {s.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{s.date}</p>
                        {s.status === 'Revisi' && s.revision_notes && (
                          <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100 italic">
                            "{s.revision_notes}"
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                            {s.author.charAt(0)}
                          </div>
                          <span className="text-sm text-gray-700 font-medium">{s.author}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ring-1 ring-inset
                          ${s.status === 'Menunggu Validasi' || s.status === 'Menunggu'
                            ? 'bg-amber-50 text-amber-700 ring-amber-600/20'
                            : s.status === 'Review'
                              ? 'bg-blue-50 text-blue-700 ring-blue-700/10'
                              : s.status === 'Revisi'
                                ? 'bg-red-50 text-red-700 ring-red-600/10'
                                : 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 
                            ${s.status === 'Menunggu Validasi' ? 'bg-amber-500'
                              : s.status === 'Review' ? 'bg-blue-500'
                                : s.status === 'Revisi' ? 'bg-red-500'
                                  : 'bg-emerald-500'}`}></span>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link href={`/admin/antrian-validasi/${s.id}`}>
                          <button className="text-sm font-semibold text-gray-600 hover:text-[#00BDBB] hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-all">
                            Tinjau
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                          <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                        <h3 className="text-gray-900 font-medium mb-1">Tidak ada data</h3>
                        <p className="text-gray-500 text-sm">Tidak dapat menemukan pengajuan yang sesuai.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer (Visual Only for now) */}
        {!loading && filtered.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
            <p className="text-sm text-gray-500">
              Menampilkan <span className="font-medium text-gray-900">{filtered.length}</span> data
            </p>
            <div className="flex gap-2">
              <button disabled className="px-3 py-1 text-sm border border-gray-200 rounded-lg text-gray-400 bg-white cursor-not-allowed">Previous</button>
              <button disabled className="px-3 py-1 text-sm border border-gray-200 rounded-lg text-gray-400 bg-white cursor-not-allowed">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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
    author?: string; // Author name might not be available from API yet
};

export default function ManajemenArtikelPage() {
    const { showToast } = useToast();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('Semua');
    const [searchTerm, setSearchTerm] = useState('');

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
        const matchesSearch = (sub.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (sub.author || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (String(sub.id) || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'Semua' || sub.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen Artikel</h1>
                    <p className="text-gray-600 mt-1">Kelola semua artikel yang masuk, tetapkan reviewer, dan pantau progres.</p>
                </div>
                <button
                    onClick={() => showToast('Fitur export data belum tersedia', 'info')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#00BDBB] hover:bg-[#00AFAF] text-white rounded-xl font-semibold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Export Data
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Cari Judul, Penulis, atau ID..."
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-500 text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#00BDBB]/20 focus:border-[#00BDBB] sm:text-sm transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex-shrink-0">
                    <select
                        className="block w-full pl-3 pr-10 py-2.5 text-base border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#00BDBB]/20 focus:border-[#00BDBB] sm:text-sm rounded-xl transition-all"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="Semua">Semua Status</option>
                        <option value="Menunggu Validasi">Menunggu Validasi</option>
                        <option value="Review">Sedang Direview</option>
                        <option value="Revisi">Revisi</option>
                        <option value="Selesai">Selesai</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[300px]">
                {loading ? (
                    <div className="flex items-center justify-center h-[300px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00BDBB]"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 text-left text-sm font-semibold text-gray-600 border-b border-gray-100">
                                    <th className="py-4 px-6">Artikel</th>
                                    <th className="py-4 px-6">Penulis</th>
                                    <th className="py-4 px-6">Kategori</th>
                                    <th className="py-4 px-6">Tanggal</th>
                                    <th className="py-4 px-6">Status</th>
                                    <th className="py-4 px-6 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredSubmissions.length > 0 ? (
                                    filteredSubmissions.map((sub) => (
                                        <tr key={sub.id} className="group hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-mono text-[#00BDBB] font-medium mb-1">#{sub.id}</span>
                                                    <Link href={`/editor/submission/${sub.id}`} className="font-semibold text-gray-900 line-clamp-2 group-hover:text-[#00BDBB] transition-colors">
                                                        {sub.title}
                                                    </Link>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                                                        {(sub.author || '?').charAt(0)}
                                                    </div>
                                                    <span className="text-sm text-gray-700 font-medium">{sub.author || 'Author'}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-md">{sub.category}</span>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-500">{sub.date}</td>
                                            <td className="py-4 px-6">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-block
                                ${sub.status === 'Menunggu Validasi' || sub.status === 'Menunggu' ? 'bg-amber-100 text-amber-700' :
                                                        sub.status === 'Review' ? 'bg-blue-100 text-blue-700' :
                                                            sub.status === 'Revisi' ? 'bg-red-100 text-red-700' :
                                                                'bg-emerald-100 text-emerald-700'}`}>
                                                    {sub.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <Link href={`/editor/submission/${sub.id}`} className="text-sm font-medium text-[#00BDBB] hover:text-[#008f85] hover:underline transition">
                                                    Detail
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-gray-500">
                                            Tidak ada artikel yang ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

'use client';

import { useEffect, useState } from 'react';

type Stats = {
    users: { total: number; authors: number; editors: number };
    submissions: { total: number; waiting: number; revision: number; approved: number; draft: number };
    recent: Array<{ id: string; title: string; date: string; status: string; author_name: string }>;
};

export default function ReportsPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    // Default to 2025 as most demo data is from that year
    const [selectedYear, setSelectedYear] = useState(2025);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/reports?year=${selectedYear}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    throw new Error(data.error);
                }
                setStats(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [selectedYear]);

    if (loading) return <div className="p-8 text-center text-gray-500">Memuat laporan...</div>;
    if (!stats || !stats.submissions || !stats.users) return <div className="p-8 text-center text-red-500">Gagal memuat data atau data tidak tersedia.</div>;

    // Calculate percentages for the chart
    const total = stats.submissions.total || 1; // avoid div by 0
    const percentages = {
        waiting: Math.round((stats.submissions.waiting / total) * 100),
        revision: Math.round((stats.submissions.revision / total) * 100),
        approved: Math.round((stats.submissions.approved / total) * 100),
        draft: Math.round((stats.submissions.draft / total) * 100),
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Laporan & Statistik</h1>
                    <p className="text-gray-500 text-sm mt-1">Ringkasan aktivitas sistem E-LOA.</p>
                </div>

                <div className="flex gap-3">
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00C4B4] cursor-pointer"
                    >
                        {[0, 1, 2, 3, 4].map(i => {
                            const y = new Date().getFullYear() - i;
                            return <option key={y} value={y}>Tahun {y}</option>;
                        })}
                    </select>

                    <button className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Unduh PDF
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Pengguna', value: stats.users.total, sub: `${stats.users.authors} Author`, color: 'from-blue-500 to-blue-400', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
                    { label: 'Total Ajuan', value: stats.submissions.total, sub: 'Semua Status', color: 'from-purple-500 to-purple-400', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                    { label: 'Menunggu Validasi', value: stats.submissions.waiting, sub: 'Butuh Tindakan', color: 'from-amber-500 to-amber-400', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                    { label: 'Disetujui', value: stats.submissions.approved, sub: 'LOA Terbit', color: 'from-emerald-500 to-emerald-400', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                ].map((card, i) => (
                    <div key={i} className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${card.color} text-white shadow-lg shadow-gray-200/50 hover:shadow-xl transition-all hover:-translate-y-1`}>
                        <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
                        <div className="relative z-10">
                            <div className="bg-white/20 w-10 h-10 rounded-lg flex items-center justify-center mb-4 backdrop-blur-sm">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                                </svg>
                            </div>
                            <h3 className="text-3xl font-bold mb-1">{card.value}</h3>
                            <p className="font-medium text-white/90 text-sm mb-1">{card.label}</p>
                            <p className="text-xs text-white/70">{card.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Column */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-6">Distribusi Status Ajuan</h2>

                    <div className="space-y-6">
                        {/* Custom Bar Chart Items */}
                        {[
                            { label: 'Menunggu Validasi', count: stats.submissions.waiting, pct: percentages.waiting, color: 'bg-amber-400', text: 'text-amber-600' },
                            { label: 'Revisi', count: stats.submissions.revision, pct: percentages.revision, color: 'bg-red-400', text: 'text-red-600' },
                            { label: 'Disetujui', count: stats.submissions.approved, pct: percentages.approved, color: 'bg-emerald-400', text: 'text-emerald-600' },
                            { label: 'Draft', count: stats.submissions.draft, pct: percentages.draft, color: 'bg-gray-300', text: 'text-gray-600' },
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium text-gray-700">{item.label}</span>
                                    <span className={`font-bold ${item.text}`}>{item.count} ({item.pct}%)</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${item.color} transition-all duration-1000 ease-out`}
                                        style={{ width: `${item.pct}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-50 grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-xs text-gray-400 uppercase font-semibold">Total Author</div>
                            <div className="text-xl font-bold text-gray-800 mt-1">{stats.users.authors}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-400 uppercase font-semibold">Total Editor</div>
                            <div className="text-xl font-bold text-gray-800 mt-1">{stats.users.editors}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-400 uppercase font-semibold">Conversion</div>
                            <div className="text-xl font-bold text-emerald-500 mt-1">
                                {stats.submissions.total > 0 ? Math.round((stats.submissions.approved / stats.submissions.total) * 100) : 0}%
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Column */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Aktivitas Terbaru</h2>
                    <div className="space-y-4">
                        {stats.recent.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-4">Belum ada aktivitas.</p>
                        ) : (
                            stats.recent.map((sub) => (
                                <div key={sub.id} className="flex gap-3 items-start pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-800 line-clamp-1" title={sub.title}>{sub.title}</h4>
                                        <p className="text-xs text-gray-500 mt-0.5">Oleh: <span className="text-gray-700">{sub.author_name}</span></p>
                                        <div className="flex gap-2 items-center mt-2">
                                            <span className="text-[10px] text-gray-400">
                                                {new Date(sub.date).toLocaleDateString()}
                                            </span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${sub.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                sub.status === 'revision' ? 'bg-red-100 text-red-700' :
                                                    sub.status === 'waiting' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-gray-100 text-gray-600'
                                                }`}>
                                                {sub.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <button className="w-full mt-6 py-2 text-xs font-semibold text-gray-500 hover:text-[#00C4B4] hover:bg-teal-50 rounded-lg transition-colors">
                        Lihat Semua Aktivitas
                    </button>
                </div>
            </div>
        </div>
    );
}

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getToken } from '@/lib/auth';
import { decodeToken } from '@/lib/jwt';

type Submission = {
    id: string;
    title: string;
    date: string;
    status: string;
    author?: string; // API might not return author name yet if no user table join, but let's prep
};

export default function EditorDashboardPage() {
    const [userName, setUserName] = useState('Editor');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        waiting: 0,
        reviewing: 0,
        revision: 0,
        completed: 0
    });
    const [recentSubmissions, setRecentSubmissions] = useState<Submission[]>([]);

    useEffect(() => {
        const token = getToken();
        if (token) {
            const decoded: any = decodeToken(token);
            if (decoded?.name) setUserName(decoded.name);
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/submissions?perPage=100'); // Fetch all for stats
            if (!res.ok) throw new Error('Failed to fetch data');
            const data = await res.json();
            const items: Submission[] = data.items || [];

            // Calculate stats locally 
            const waiting = items.filter(i => i.status === 'Menunggu Validasi' || i.status === 'Menunggu').length;
            const reviewing = items.filter(i => i.status === 'Review' || i.status === 'Sedang Direview').length;
            const revision = items.filter(i => i.status === 'Revisi').length;
            const completed = items.filter(i => i.status === 'Selesai' || i.status === 'Disetujui' || i.status === 'Ditetapkan').length;

            setStats({ waiting, reviewing, revision, completed });

            // Set recent (take top 5)
            setRecentSubmissions(items.slice(0, 5));
        } catch (error) {
            console.error('Dashboard fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Selamat Pagi';
        if (hour < 15) return 'Selamat Siang';
        if (hour < 18) return 'Selamat Sore';
        return 'Selamat Malam';
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00BDBB]"></div></div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Welcome Banner */}
            <div className="relative rounded-2xl bg-gradient-to-r from-[#005f59] to-[#008f85] p-8 text-white overflow-hidden shadow-lg">
                <div className="absolute right-0 top-0 h-64 w-64 translate-x-10 translate-y-[-50%] rounded-full bg-white/10 blur-3xl"></div>
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-3xl font-bold mb-2">{getGreeting()}, {userName}</h1>
                    <p className="text-white/90 text-lg leading-relaxed">
                        Ada <span className="font-bold text-[#FDD835]">{stats.waiting} artikel baru</span> yang menunggu untuk ditinjau hari ini.
                        Pastikan kualitas publikasi tetap terjaga.
                    </p>
                    <div className="mt-6 flex gap-3">
                        <Link href="/editor/antrian-persetujuan">
                            <button className="px-6 py-2.5 bg-white text-[#006E66] font-bold rounded-lg hover:bg-gray-100 transition shadow-sm">
                                Mulai Review
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    {
                        label: 'Menunggu Review', count: stats.waiting, color: 'bg-amber-100 text-amber-600', icon: (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        ), desc: 'Belum diproses'
                    },
                    {
                        label: 'Sedang Direview', count: stats.reviewing, color: 'bg-blue-100 text-blue-600', icon: (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        ), desc: 'Dalam peninjauan'
                    },
                    {
                        label: 'Revisi Penulis', count: stats.revision, color: 'bg-red-100 text-red-600', icon: (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        ), desc: 'Menunggu revisi author'
                    },
                    {
                        label: 'Selesai', count: stats.completed, color: 'bg-emerald-100 text-emerald-600', icon: (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        ), desc: 'Telah dipublikasi'
                    },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <span className="text-3xl font-bold text-gray-800">{stat.count}</span>
                        </div>
                        <h3 className="font-semibold text-gray-700">{stat.label}</h3>
                        <p className="text-xs text-gray-500 mt-1">{stat.desc}</p>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Queue List */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Antrian Review Terbaru</h2>
                        <Link href="/editor/antrian-persetujuan" className="text-sm text-[#008f85] font-semibold hover:underline">Lihat Semua</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-sm font-semibold text-gray-500 border-b border-gray-100">
                                    <th className="pb-3 pl-2">ID</th>
                                    <th className="pb-3">Judul Artikel</th>
                                    <th className="pb-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentSubmissions.length > 0 ? (
                                    recentSubmissions.map((sub, i) => (
                                        <tr key={i} className="group hover:bg-gray-50 transition-colors">
                                            <td className="py-4 pl-2 text-xs font-mono text-gray-500">#{sub.id}</td>
                                            <td className="py-4 pr-4">
                                                <p className="text-sm font-semibold text-gray-800 group-hover:text-[#00BDBB] transition-colors line-clamp-1">{sub.title}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">{sub.date}</p>
                                            </td>
                                            <td className="py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold
                                     ${sub.status === 'Menunggu' || sub.status === 'Menunggu Validasi' ? 'bg-amber-100 text-amber-700' :
                                                        sub.status === 'Review' ? 'bg-blue-100 text-blue-700' :
                                                            sub.status === 'Revisi' ? 'bg-red-100 text-red-700' :
                                                                'bg-emerald-100 text-emerald-700'}`}>
                                                    {sub.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="py-8 text-center text-sm text-gray-500">Belum ada antrian.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions / Tips */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 className="font-bold text-gray-800 mb-4">Aksi Cepat</h3>
                        <div className="space-y-3">
                            <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-teal-50 hover:text-[#00BDBB] transition group text-left">
                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-400 group-hover:text-[#00BDBB] shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">Validasi Naskah Baru</span>
                            </button>
                            <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-teal-50 hover:text-[#00BDBB] transition group text-left">
                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-400 group-hover:text-[#00BDBB] shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">Cek Log Aktivitas</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                        <h3 className="font-bold text-lg mb-2">Panduan Reviewer</h3>
                        <p className="text-blue-100 text-sm mb-4">Pastikan untuk memeriksa plagiarisme dan kesesuaian template sebelum menyetujui artikel.</p>
                        <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold transition backdrop-blur-sm">Lihat Panduan</button>
                    </div>
                </div>

            </div>
        </div>
    );
}

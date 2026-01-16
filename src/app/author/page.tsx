'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getToken } from '@/lib/auth';
import { decodeToken } from '@/lib/jwt';
import { useRouter } from 'next/navigation';

export default function AuthorDashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('Author');
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    'Menunggu Validasi': 0,
    'Review': 0,
    'Revisi': 0,
    'Disetujui': 0,
    'Ditolak': 0,
    'Dibatalkan': 0
  });

  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);

  useEffect(() => {
    const token = getToken();
    if (token) {
      const decoded: any = decodeToken(token);
      if (decoded?.name) setUserName(decoded.name);
      fetchDashboardData(token);
    } else {
      router.push('/login');
    }
  }, [router]);

  const fetchDashboardData = async (token: string) => {
    try {
      const res = await fetch('/api/author/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setRecentSubmissions(data.recent);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
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

  const statCards = [
    {
      label: 'Menunggu Validasi',
      count: stats['Menunggu Validasi'],
      color: 'bg-amber-100 text-amber-600',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      ),
      desc: 'Sedang diperiksa'
    },
    {
      label: 'Dalam Review',
      count: stats['Review'],
      color: 'bg-blue-100 text-blue-600',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
      ),
      desc: 'Sedang direview mitra bestari'
    },
    {
      label: 'Perlu Revisi',
      count: stats['Revisi'],
      color: 'bg-red-100 text-red-600',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
      ),
      desc: 'Butuh perbaikan Anda'
    },
    {
      label: 'Diterbitkan',
      count: stats['Disetujui'],
      color: 'bg-emerald-100 text-emerald-600',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      ),
      desc: 'Siap publikasi'
    }
  ];

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#00BDBB] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans pb-12">
      {/* Welcome Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#005f59] to-[#008f85] p-8 text-white overflow-hidden shadow-lg border border-[#004d47]">
        <div className="absolute right-0 top-0 h-64 w-64 translate-x-10 translate-y-[-50%] rounded-full bg-white/10 blur-3xl"></div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-bold mb-2 tracking-tight">{getGreeting()}, {userName}</h1>
          <p className="text-white/90 text-lg leading-relaxed font-light">
            Selamat datang di Dashboard Penulis. Pantau status naskah Anda dan kelola publikasi ilmiah Anda dengan mudah disini.
          </p>
          <div className="mt-8 flex gap-3">
            <Link href="/author/daftar-pengajuan/new">
              <button className="px-6 py-2.5 bg-white text-[#006E66] font-bold rounded-xl hover:bg-gray-50 hover:shadow-lg transition shadow-sm flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Buat Pengajuan Baru
              </button>
            </Link>
            <Link href="/author/daftar-pengajuan">
              <button className="px-6 py-2.5 bg-[#004d47]/40 text-white font-medium rounded-xl hover:bg-[#004d47]/60 transition border border-white/20 backdrop-blur-sm flex items-center gap-2">
                Lihat Semua Naskah
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color} bg-opacity-20`}>
                {stat.icon}
              </div>
              <span className="text-3xl font-bold text-gray-800 tracking-tight">{stat.count}</span>
            </div>
            <h3 className="font-semibold text-gray-700 text-sm">{stat.label}</h3>
            <p className="text-xs text-gray-400 mt-1">{stat.desc}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Activity Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00BDBB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Riwayat Pengajuan Terbaru
              </h2>
              <Link href="/author/daftar-pengajuan" className="text-xs font-semibold text-[#00BDBB] hover:text-[#009E98] hover:underline">
                Lihat Semua
              </Link>
            </div>

            <div className="divide-y divide-gray-50">
              {recentSubmissions.length > 0 ? (
                recentSubmissions.map((sub, i) => (
                  <div key={i} className="group p-4 hover:bg-gray-50 transition-colors flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs shrink-0 group-hover:bg-white group-hover:shadow-sm transition-all border border-gray-100">
                      {String(sub.id).split('-').pop()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/author/daftar-pengajuan/${sub.id}`}>
                        <h4 className="font-semibold text-gray-800 truncate group-hover:text-[#00BDBB] transition-colors text-sm mb-0.5">
                          {sub.title}
                        </h4>
                      </Link>
                      <p className="text-xs text-gray-500">{sub.date}</p>
                    </div>
                    <div className="shrink-0">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                                                ${sub.status === 'Disetujui' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          sub.status === 'Revisi' ? 'bg-red-50 text-red-700 border border-red-100' :
                            sub.status === 'Review' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                              sub.status === 'Dibatalkan' ? 'bg-gray-100 text-gray-500 border border-gray-200' :
                                'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                        {sub.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <p className="text-sm">Belum ada pengajuan terbaru.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Guidelines */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6 shadow-sm">
            <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Tips Penulis
            </h3>
            <ul className="space-y-3">
              <li className="flex gap-3 items-start">
                <div className="w-5 h-5 rounded-full bg-blue-200/50 flex items-center justify-center shrink-0 mt-0.5 text-blue-700 text-[10px] font-bold">1</div>
                <p className="text-xs text-blue-800 leading-relaxed">Pastikan abstrak Anda singkat (maks 250 kata) dan mencakup tujuan, metode, dan hasil.</p>
              </li>
              <li className="flex gap-3 items-start">
                <div className="w-5 h-5 rounded-full bg-blue-200/50 flex items-center justify-center shrink-0 mt-0.5 text-blue-700 text-[10px] font-bold">2</div>
                <p className="text-xs text-blue-800 leading-relaxed">Gunakan referensi terbaru (5-10 tahun terakhir) untuk meningkatkan kualitas naskah.</p>
              </li>
            </ul>
            <button className="w-full mt-5 py-2.5 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition shadow-sm border border-transparent">
              Download Template Jurnal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

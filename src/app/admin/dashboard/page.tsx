'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getToken } from '@/lib/auth';
import { decodeToken } from '@/lib/jwt';

type Stats = {
  users: { total: number; authors: number; editors: number };
  submissions: { total: number; waiting: number; revision: number; approved: number; draft: number };
  recent: Array<{ id: string; title: string; date: string; status: string; author_name: string }>;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminName, setAdminName] = useState('Administrator');

  useEffect(() => {
    // 1. Get User Name
    const token = getToken();
    if (token) {
      const decoded: any = decodeToken(token);
      if (decoded && decoded.name) {
        setAdminName(decoded.name);
      }
    }

    // 2. Fetch Stats
    fetch('/api/reports')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setLoading(false);
          return;
        }
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Dashboard fetch error:', err);
        setError('Gagal terhubung ke server');
        setLoading(false);
      });
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#00C4B4] border-t-transparent"></div>
          <p className="text-sm text-gray-500 font-medium">Memuat Dashboard...</p>
        </div>
      </div>
    );
  }

  // Fallback if stats fail
  const safeStats = stats || {
    users: { total: 0, authors: 0, editors: 0 },
    submissions: { total: 0, waiting: 0, revision: 0, approved: 0, draft: 0 },
    recent: []
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {getGreeting()}, <span className="text-[#00C4B4]">{adminName}</span>
          </h1>
          <p className="text-gray-500 mt-1">
            Berikut adalah ringkasan aktivitas sistem E-LOA hari ini.
          </p>
        </div>
        <div className="text-right hidden md:block">
          <div className="text-sm font-semibold text-gray-700">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          <div className="text-xs text-gray-400">Panel Administrator</div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 flex items-center gap-3 animate-in slide-in-from-top-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Waiting Validation (Priority) */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-6 text-white shadow-lg shadow-orange-200 transition-transform hover:-translate-y-1">
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/20 blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-orange-50 text-sm">Perlu Validasi</p>
                <h3 className="mt-1 text-4xl font-bold">{safeStats.submissions.waiting}</h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium">Urgent</span>
              <span className="text-xs text-orange-50">Pengajuan menunggu review</span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Submissions */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#00C4B4] to-teal-600 p-6 text-white shadow-lg shadow-teal-200 transition-transform hover:-translate-y-1">
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/20 blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-teal-50 text-sm">Total Pengajuan</p>
                <h3 className="mt-1 text-4xl font-bold">{safeStats.submissions.total}</h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium">Active</span>
              <span className="text-xs text-teal-50">LOA Terbit: {safeStats.submissions.approved}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Total Users */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white shadow-lg shadow-blue-200 transition-transform hover:-translate-y-1">
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/20 blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-blue-50 text-sm">Total Pengguna</p>
                <h3 className="mt-1 text-4xl font-bold">{safeStats.users.total}</h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium">System</span>
              <span className="text-xs text-blue-50">{safeStats.users.authors} Author Terdaftar</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-gray-800">Aksi Cepat</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/admin/antrian-validasi" className="group">
              <div className="flex h-full flex-col justify-between rounded-2xl border border-amber-100 bg-amber-50/50 p-6 transition-all hover:bg-amber-50 hover:shadow-md hover:shadow-amber-100/50 relative overflow-hidden">
                <div className="absolute right-0 top-0 h-32 w-32 translate-x-10 translate-y-[-10px] rounded-full bg-amber-200/20 group-hover:bg-amber-200/30 transition-colors"></div>
                <div>
                  <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-800 group-hover:text-amber-700 transition-colors">Proses Validasi</h3>
                  <p className="text-sm text-gray-500 mt-1">Cek pengajuan yang masuk dan berikan keputusan.</p>
                </div>
                <div className="mt-4 flex items-center text-sm font-semibold text-amber-600">
                  Buka Antrian <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>

            <Link href="/admin/users" className="group">
              <div className="flex h-full flex-col justify-between rounded-2xl border border-blue-100 bg-blue-50/50 p-6 transition-all hover:bg-blue-50 hover:shadow-md hover:shadow-blue-100/50 relative overflow-hidden">
                <div className="absolute right-0 top-0 h-32 w-32 translate-x-10 translate-y-[-10px] rounded-full bg-blue-200/20 group-hover:bg-blue-200/30 transition-colors"></div>
                <div>
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-800 group-hover:text-blue-700 transition-colors">Kelola Pengguna</h3>
                  <p className="text-sm text-gray-500 mt-1">Tambah, edit, atau hapus akses pengguna sistem.</p>
                </div>
                <div className="mt-4 flex items-center text-sm font-semibold text-blue-600">
                  Buka User Manager <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Detailed Stats Block */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Status Sistem</h3>
              <Link href="/admin/laporan" className="text-sm font-medium text-[#00C4B4] hover:underline">Lihat Laporan Lengkap</Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-gray-50 text-center">
                <div className="text-2xl font-bold text-emerald-600">{safeStats.submissions.approved}</div>
                <div className="text-xs text-gray-500 uppercase font-semibold mt-1">Disetujui</div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 text-center">
                <div className="text-2xl font-bold text-red-500">{safeStats.submissions.revision}</div>
                <div className="text-xs text-gray-500 uppercase font-semibold mt-1">Revisi</div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 text-center">
                <div className="text-2xl font-bold text-gray-700">{safeStats.submissions.draft}</div>
                <div className="text-xs text-gray-500 uppercase font-semibold mt-1">Draft</div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 text-center">
                <div className="text-2xl font-bold text-[#00C4B4]">{safeStats.users.authors}</div>
                <div className="text-xs text-gray-500 uppercase font-semibold mt-1">Authors</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col h-full">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Aktivitas Terbaru</h2>

          <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
            {safeStats.recent.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <p>Belum ada aktivitas tercatat.</p>
              </div>
            ) : (
              safeStats.recent.map((item, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center z-10 relative group-hover:border-[#00C4B4] transition-colors">
                      <span className="text-lg">
                        {item.status === 'approved' ? '✅' :
                          item.status === 'revision' ? '📝' :
                            item.status === 'waiting' ? '⏳' : '📄'}
                      </span>
                    </div>
                    {i !== safeStats.recent.length - 1 && (
                      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[1px] h-[calc(100%+24px)] bg-gray-200"></div>
                    )}
                  </div>
                  <div className="pb-2">
                    <p className="text-sm font-semibold text-gray-800 line-clamp-2">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      <span className="font-medium text-gray-700">{item.author_name}</span> • {new Date(item.date).toLocaleDateString()}
                    </p>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium 
                              ${item.status === 'approved' ? 'bg-green-100 text-green-800' :
                          item.status === 'revision' ? 'bg-red-100 text-red-800' :
                            item.status === 'waiting' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'}`}>
                        {item.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <Link href="/admin/laporan">
              <button className="w-full py-2.5 rounded-xl bg-gray-50 text-gray-600 text-sm font-semibold hover:bg-[#00C4B4] hover:text-white transition-all">
                Lihat Semua Log
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

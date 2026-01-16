"use client";

import Link from 'next/link';
import AdminSubmissionsList from '@/app/admin/components/AdminSubmissionsList';

export default function AntrianValidasiPage() {
  return (
    <div className="min-h-screen w-full px-4 sm:px-6 lg:px-8 py-6 bg-[var(--page-bg)]">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[20px] font-semibold text-[#111827]">Antrian Validasi</h1>
            <p className="text-sm text-gray-700 mt-1">Daftar pengajuan yang menunggu validasi oleh admin.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-sm text-[var(--brand-primary)] hover:underline">Kembali ke Dashboard</Link>
          </div>
        </div>

        <div className="bg-white rounded-[16px] p-6 shadow-sm">
          <AdminSubmissionsList />
        </div>
      </div>
    </div>
  );
}

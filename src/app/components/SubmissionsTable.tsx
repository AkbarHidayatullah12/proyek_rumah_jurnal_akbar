"use client";

import Link from 'next/link';
import { useMemo, useState, useEffect } from 'react';

export type Submission = {
  id: string;
  title: string;
  date: string;
  status: 'Menunggu Validasi' | 'Revisi' | 'Disetujui' | 'Draft';
};

export default function SubmissionsTable({ submissions }: { submissions?: Submission[] }) {
  const [filter, setFilter] = useState<'Semua' | 'Menunggu Validasi' | 'Revisi' | 'Disetujui' | 'Draft'>('Semua');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 6;

  const [pageItems, setPageItems] = useState<Submission[]>(submissions || []);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // fetch from API when filters change
  const fetchPage = async (p: number, f: string, q: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(p));
      params.set('perPage', String(perPage));
      if (f && f !== 'Semua') params.set('status', f);
      if (q) params.set('q', q);

      const res = await fetch(`/api/submissions?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setPageItems(data.items || []);
      setTotalPages(Math.max(1, Math.ceil((data.total || 0) / perPage)));
    } catch (err) {
      console.error('fetch submissions error', err);
      // fallback to local submissions prop if provided
      if (submissions) {
        const local = submissions.filter((s) => {
          if (filter !== 'Semua' && s.status !== filter) return false;
          if (query && !s.title.toLowerCase().includes(query.toLowerCase())) return false;
          return true;
        });
        setTotalPages(Math.max(1, Math.ceil(local.length / perPage)));
        setPageItems(local.slice((p - 1) * perPage, p * perPage));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(page, filter, query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filter, query]);

  const renderBadge = (status: Submission['status']) => {
    switch (status) {
      case 'Menunggu Validasi':
        return <span className="text-[13px] font-medium px-3 py-1 rounded-full badge-waiting">{status}</span>;
      case 'Revisi':
        return <span className="text-[13px] font-medium px-3 py-1 rounded-full badge-revisi">{status}</span>;
      case 'Disetujui':
        return <span className="text-[13px] font-medium px-3 py-1 rounded-full badge-approved">{status}</span>;
      default:
        return <span className="text-[13px] font-medium px-3 py-1 rounded-full badge-draft">{status}</span>;
    }
  };

  const renderActions = (s: Submission) => {
    if (s.status === 'Menunggu Validasi') {
      return (
        <button className="inline-flex items-center gap-2 border border-[var(--brand-primary)] text-[var(--brand-primary)] rounded-md py-2 px-4 text-sm btn-outline-teal">
          Lihat
        </button>
      );
    }

    if (s.status === 'Revisi') {
      return (
        <button className="inline-flex items-center gap-2 border border-[var(--brand-primary)] text-[var(--brand-primary)] rounded-md py-2 px-4 text-sm btn-outline-teal">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5z"/></svg>
          Edit
        </button>
      );
    }

    if (s.status === 'Disetujui') {
      return (
        <button className="inline-flex items-center gap-2 rounded-md py-2 px-4 text-sm btn-solid-teal">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
          Unduh PDF
        </button>
      );
    }

    // Draft
    return (
      <div className="flex items-center gap-2">
        <button className="inline-flex items-center gap-2 border border-[var(--brand-primary)] text-[var(--brand-primary)] rounded-md py-2 px-4 text-sm btn-outline-teal">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5z"/></svg>
          Edit
        </button>
        <button className="inline-flex items-center gap-2 border border-[var(--action-danger)] text-[var(--action-danger)] rounded-md py-2 px-4 text-sm btn-outline-danger">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 6h18"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          Hapus
        </button>
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-[var(--light-grey)] border border-transparent rounded-md px-3 py-2">
            <select className="bg-transparent outline-none text-sm" value={filter} onChange={(e) => { setFilter(e.target.value as any); setPage(1); }}>
              <option value="Semua">Semua</option>
              <option value="Menunggu Validasi">Menunggu Validasi</option>
              <option value="Revisi">Revisi</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-96">
          <div className="relative flex-1">
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 21l-4.35-4.35"/><circle cx="11" cy="11" r="6"/></svg>
            <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Cari berdasarkan Judul..." className="w-full bg-[var(--light-grey)] border border-transparent text-sm py-2 pl-10 pr-3 rounded-md" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[16px] p-6 shadow-sm overflow-hidden">
        <div className="-mx-6 px-6">          {/* Table for md+ screens */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-[14px] text-[#374151]">
              <thead>
                <tr className="text-[#6B7280]">
                  <th className="font-medium" style={{ width: '40%' }}>Judul Kegiatan</th>
                  <th className="font-medium" style={{ width: '15%' }}>Tanggal Diajukan</th>
                  <th className="font-medium" style={{ width: '15%' }}>Status</th>
                  <th className="font-medium text-right" style={{ width: '30%' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((s) => (
                  <tr key={s.id} className="border-b border-[#E5E7EB] align-top">
                    <td className="py-4">
                      <Link href={`/author/daftar-pengajuan/${s.id}`} className="text-[var(--brand-primary)] font-semibold hover:underline">{s.title}</Link>
                    </td>
                    <td className="py-4 text-[#4B5563]">{s.date}</td>
                    <td className="py-4">{renderBadge(s.status)}</td>
                    <td className="py-4 text-right">{renderActions(s)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {pageItems.map((s) => (
              <div key={s.id} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between mb-2 gap-4">
                  <div className="flex-1 min-w-0">
                    <Link href={`/author/daftar-pengajuan/${s.id}`} className="text-[14px] font-semibold text-[var(--brand-primary)] hover:underline block truncate">{s.title}</Link>
                    <div className="text-[13px] text-[#4B5563] mt-1">{s.date}</div>
                  </div>
                  <div className="ml-3 flex-shrink-0">{renderBadge(s.status)}</div>
                </div>
                <div className="mt-3 flex items-center justify-end gap-2">{renderActions(s)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="text-sm text-gray-400">Previous</button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 rounded-[8px] text-sm ${page === i + 1 ? 'bg-[var(--brand-primary)] text-white' : 'text-gray-600 bg-transparent'}`}>{i + 1}</button>
          ))}
          <button disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="text-sm text-[#374151]">Next</button>
        </div>
      </div>
    </div>
  );
}

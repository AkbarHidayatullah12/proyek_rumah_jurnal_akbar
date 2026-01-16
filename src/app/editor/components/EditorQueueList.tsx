"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Item = { id: string; title: string; author: string; instansi?: string; date: string; status?: string };

const MOCK: Item[] = Array.from({ length: 8 }, (_, i) => ({
  id: `JRN-2025-0${i + 1}`,
  title: ['Implementasi Algoritma Reinforcement Learning untuk Optimasi Peer Review','Analisis Dampak Open Access pada Sitasi','Riset Metodologi Peer Review Baru','Framework Evaluasi Kualitas Jurnal','Pengembangan Sistem Tinjauan Oftomatik','Studi Kasus: Kebijakan Publik Jurnal','Model Penulisan Otomatis untuk Review','Benchmark Dataset untuk Evaluasi Jurnal'][i % 8],
  author: ['Dr. Eko Prasetyo, S.T, M.T','Dr. Rina Marlina','Prof. Bambang Setiawan','Dr. Hendra Gunawan','Siti Aisyah, M.Sc','Dian Kurniawan','Ahmad Hidayat','Alia Nurul'][i % 8],
  instansi: ['Institut Teknologi Bandung','Universitas Gadjah Mada','Universitas Indonesia','Universitas Teknologi Jaya','Institut Sains Data','Politeknik Negeri','Institut Riset Kode','Universitas Negeri'][i % 8],
  date: ['10 Nov 2025','09 Nov 2025','08 Nov 2025','05 Nov 2025','04 Nov 2025','01 Nov 2025','30 Oct 2025','28 Oct 2025'][i % 8],
  status: ['Menunggu Validasi','Menunggu Validasi','Revisi','Menunggu Validasi','Ditetapkan','Menunggu Validasi','Revisi','Menunggu Validasi'][i % 8],
}));

export default function EditorQueueList() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>(MOCK);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | 'Menunggu Validasi' | 'Revisi' | 'Ditetapkan'>('all');
  const perPage = 8;

  useEffect(() => {
    // placeholder for fetching
  }, []);

  const filtered = useMemo(() => {
    return items.filter(i => {
      const matchesQuery = !query || i.title.toLowerCase().includes(query.toLowerCase()) || i.author.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === 'all' ? true : i.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [items, query, status]);

  useEffect(() => setPage(1), [query, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <input aria-label="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari berdasarkan Judul atau Nama Author..." className="w-[320px] bg-white border border-[#E5E7EB] rounded-[8px] py-2 px-3 text-sm" />
          <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="bg-white border border-[#E5E7EB] rounded-[8px] py-2 px-3 text-sm">
            <option value="all">Semua Status</option>
            <option value="Menunggu Validasi">Menunggu Validasi</option>
            <option value="Revisi">Revisi</option>
            <option value="Ditetapkan">Ditetapkan</option>
          </select>
        </div>
        <div className="text-sm text-[#6B7280]">Menampilkan {filtered.length} pengajuan</div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-[14px] text-[#111827]">
          <thead>
            <tr className="text-[#6B7280] text-[14px] font-medium border-b border-[#E5E7EB]">
              <th className="py-4 px-3 w-[5%]">No</th>
              <th className="py-4 px-3 w-[40%]">Judul Kegiatan</th>
              <th className="py-4 px-3 w-[25%]">Nama Author</th>
              <th className="py-4 px-3 w-[15%]">Tanggal Validasi</th>
              <th className="py-4 px-3 w-[15%] text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((s, idx) => (
              <tr key={s.id} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') router.push(`/editor/tinjau/${s.id}`); }} onClick={() => router.push(`/editor/tinjau/${s.id}`)} className="border-b border-[#F1F5F9] hover:bg-[#FBFDFF] transition-colors cursor-pointer">
                <td className="py-5 px-3 text-[#6B7280]">{(page - 1) * perPage + idx + 1}</td>
                <td className="py-5 px-3">
                  <div className="text-[15px] font-semibold text-[#111827]">{s.title}</div>
                  <div className="text-[12px] text-[#9CA3AF] mt-2">ID: {s.id}</div>
                </td>
                <td className="py-5 px-3">
                  <div className="text-sm font-medium text-[#111827]">{s.author}</div>
                  <div className="text-xs text-[#6B7280] mt-1">{s.instansi}</div>
                </td>
                <td className="py-5 px-3 text-[#6B7280]">{s.date}</td>
                <td className="py-5 px-3 text-right">
                  <Link href={`/editor/tinjau/${s.id}`} onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-2 bg-[var(--brand-primary)] text-white rounded-[8px] px-4 py-2 hover:bg-[#00A89D]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/><path d="M2.05 12a11 11 0 0 1 19.9 0"/></svg>
                    <span className="text-sm font-medium">Tinjau</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-end gap-3">
        <div className="text-sm text-[#6B7280]">Halaman {page} dari {totalPages}</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-1 rounded-[6px] border border-[#E5E7EB] text-sm text-[#111827]">Previous</button>
          {[...Array(totalPages).keys()].map(i => (
            <button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 rounded-[6px] text-sm ${page === i + 1 ? 'bg-[var(--brand-primary)] text-white' : 'bg-white border border-[#E5E7EB] text-[#111827]'}`}>{i + 1}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="px-3 py-1 rounded-[6px] border border-[#E5E7EB] text-sm text-[#111827]">Next</button>
        </div>
      </div>
    </div>
  );
}

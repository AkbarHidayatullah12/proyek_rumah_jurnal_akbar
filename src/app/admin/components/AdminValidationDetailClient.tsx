"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useToast } from '@/app/components/ToastProvider';

type FileItem = { name: string; url: string };

type HistoryItem = { date: string; actor: string; role: string; status: string; note: string };

type Submission = {
  id: string;
  title: string;
  author: string;
  instansi?: string;
  email?: string;
  date: string;
  status: string;
  content: string;
  files: FileItem[];
  history: HistoryItem[];
};

export default function AdminValidationDetailClient({ submission }: { submission: Submission }) {
  const [note, setNote] = useState('');
  const [localStatus, setLocalStatus] = useState(submission.status);
  const [history, setHistory] = useState<HistoryItem[]>(submission.history || []);
  const [processing, setProcessing] = useState(false);
  const { showToast } = useToast();

  const handleRevisi = () => {
    if (!note.trim()) return showToast('Masukkan catatan sebelum mengembalikan untuk revisi.', 'warning');
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setLocalStatus('Revisi');
      setHistory(prev => [{ date: new Date().toLocaleDateString('en-GB'), actor: 'Admin', role: 'Admin', status: 'Revisi', note }, ...prev]);
      setNote('');
      showToast('Pengajuan dikembalikan untuk revisi (simulasi).', 'success');
    }, 800);
  };

  const handleTeruskan = () => {
    if (!confirm('Teruskan pengajuan ke editor?')) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setLocalStatus('Diteruskan');
      setHistory(prev => [{ date: new Date().toLocaleDateString('en-GB'), actor: 'Admin', role: 'Admin', status: 'Diteruskan', note: note || '—' }, ...prev]);
      setNote('');
      showToast('Pengajuan diteruskan ke editor (simulasi).', 'success');
    }, 900);
  };

  return (
    <article className="bg-white rounded-[16px] p-8 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div style={{ flex: 1 }}>
          <Link href="/admin/antrian-validasi" className="text-sm text-[var(--brand-primary)] hover:underline flex items-center gap-2 mb-2">◀ Kembali</Link>
          <h1 className="text-[20px] font-bold text-[#0F172A]">{submission.title}</h1>
          <div className="text-sm text-[#6B7280] mt-2">ID: {submission.id}</div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="inline-block rounded-[8px] px-4 py-1 text-white text-[13px]" style={{ background: localStatus === 'Menunggu Validasi' ? '#F59E0B' : (localStatus === 'Revisi' ? '#374151' : '#06B6D4') }}>{localStatus}</div>
        </div>
      </div>

      <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-[#111827] mb-3">Data Author</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="text-[13px] text-[#6B7280]">Diajukan oleh</div>
              <div className="text-sm font-medium text-[#0F172A]">{submission.author}</div>
            </div>
            <div>
              <div className="text-[13px] text-[#6B7280]">Instansi</div>
              <div className="text-sm font-medium text-[#0F172A]">{submission.instansi}</div>
            </div>
            <div>
              <div className="text-[13px] text-[#6B7280]">Email</div>
              <div className="text-sm font-medium text-[#0F172A]">{submission.email}</div>
            </div>
            <div>
              <div className="text-[13px] text-[#6B7280]">Tanggal Pengajuan</div>
              <div className="text-sm font-medium text-[#0F172A]">{submission.date}</div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-[#111827] mb-3">Rincian Pengajuan</h3>
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] p-6 text-[#334155] leading-relaxed">
            <div className="whitespace-pre-line">{submission.content}</div>
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-medium text-[#111827] mb-3">Dokumen Pendukung</h3>
            <div className="space-y-2">
              {submission.files.map((f, i) => (
                <div key={i} className="flex items-center gap-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] px-4 py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[var(--brand-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
                  <div className="flex-1 text-sm text-[#0F172A]">{f.name}</div>
                  <a href={f.url || '#'} className="text-sm text-[var(--brand-primary)]">Lihat/Unduh</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <h3 className="text-sm font-medium text-[#111827] mb-3">Riwayat & Catatan</h3>
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px]">
          {history.map((h, i) => (
            <div key={i} className={`p-4 ${i < history.length - 1 ? 'border-b border-[#E2E8F0]' : ''}`}>
              <div className="flex items-center justify-between gap-4 mb-2">
                <div className="text-[13px] text-[#6B7280]">{h.date}</div>
                <div className="flex items-center gap-2">
                  <div className="text-[13px] font-semibold">{h.actor}</div>
                  <div className="inline-block rounded-[6px] px-3 py-1 text-white text-[12px]" style={{ background: h.status === 'Revisi' ? '#374151' : '#6B7280' }}>{h.status}</div>
                </div>
              </div>
              <div className="text-sm text-[#334155]">{h.note}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h3 className="text-sm font-semibold text-[#111827] mb-2">Tindakan Validasi</h3>
        <p className="text-sm text-[#6B7280] mb-3">Tambah Catatan (jika mengembalikan untuk revisi)</p>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Masukkan catatan untuk author jika pengajuan perlu revisi..." className="w-full bg-white border border-[#E2E8F0] rounded-[8px] h-[100px] p-3 text-sm" />

        <div className="flex items-center justify-end gap-3 mt-4">
          <button onClick={handleRevisi} disabled={processing} className="inline-flex items-center gap-2 border border-[#F59E0B] text-[#F59E0B] rounded-[8px] px-4 py-2 text-sm">{processing ? 'Memproses...' : 'Kembalikan (Revisi)'}</button>
          <button onClick={handleTeruskan} disabled={processing} className="inline-flex items-center gap-2 rounded-[8px] px-4 py-2 text-sm text-white" style={{ background: 'var(--brand-primary)' }}>{processing ? 'Memproses...' : 'Teruskan ke Editor'}</button>
        </div>
      </section>
    </article>
  );
}

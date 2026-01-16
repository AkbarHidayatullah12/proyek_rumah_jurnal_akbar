"use client";

import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getToken } from '@/lib/auth';
import SubmissionTimeline from '@/app/components/SubmissionTimeline';
import { useToast } from '@/app/components/ToastProvider';

export default function SubmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submission, setSubmission] = useState<any | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const { showToast } = useToast();

  const fetchSubmission = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`/api/submissions/${id}`, { headers, cache: 'no-store' });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to load');
      const json = await res.json();
      setSubmission(json.submission || null);
    } catch (err: any) {
      setError(err?.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmission();
    const t = setTimeout(fetchSubmission, 1200);
    return () => clearTimeout(t);
  }, [id]);

  const handleUploadClick = () => fileRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const token = getToken();
    if (!token) return showToast('Anda harus login untuk mengunggah file.', 'error');

    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const fd = new FormData();
      fd.append('file', f, f.name);
      try {
        const up = await fetch(`/api/submissions/${id}/upload`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
        if (!up.ok) {
          const j = await up.json().catch(() => ({}));
          throw new Error(j.error || 'Upload failed');
        }
        await fetchSubmission();
        showToast('File berhasil diunggah', 'success');
      } catch (err: any) {
        showToast('Unggah gagal: ' + (err?.message || 'Terjadi kesalahan'), 'error');
      }
    }

    if (fileRef.current) fileRef.current.value = '';
  };

  const steps = [
    { label: 'Submit', status: 'completed' },
    { label: 'Review', status: submission?.status === 'Review' || submission?.status === 'Revisi' || submission?.status === 'Selesai' ? 'completed' : 'current' },
    { label: 'Revisi', status: submission?.status === 'Revisi' ? 'current' : (submission?.status === 'Selesai' ? 'completed' : 'upcoming') },
    { label: 'Selesai', status: submission?.status === 'Selesai' ? 'completed' : 'upcoming' }
  ];

  return (
    <div className="min-h-screen bg-[var(--light-grey)] px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/author/daftar-pengajuan">
              <button className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm group">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Detail Pengajuan</h1>
                {submission && (
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize shadow-sm border
                          ${submission.status === 'Revisi' ? 'bg-red-50 text-red-700 border-red-100' :
                      submission.status === 'Disetujui' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        submission.status === 'Review' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                          submission.status === 'Menunggu Validasi' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                            'bg-gray-50 text-gray-600 border-gray-200'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full 
                            ${submission.status === 'Revisi' ? 'bg-red-500' :
                        submission.status === 'Disetujui' ? 'bg-emerald-500' :
                          submission.status === 'Review' ? 'bg-blue-500' :
                            submission.status === 'Menunggu Validasi' ? 'bg-amber-500' : 'bg-gray-400'}`}
                    ></span>
                    {submission.status}
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-sm mt-1">ID Pengajuan: <span className="font-mono font-medium text-gray-700">#{id}</span></p>
            </div>
          </div>

          <button
            onClick={fetchSubmission}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 hover:text-[#00BDBB] transition-all shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Data
          </button>
        </div>

        {loading && <div className="text-center py-12"><div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#00BDBB] border-t-transparent"></div></div>}
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-6">{error}</div>}

        {submission && (
          <>
            {/* Visual Timeline Stepper */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <SubmissionTimeline currentStatus={submission.status} history={submission.history} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Left Column: Details & Files */}
              <div className="lg:col-span-2 space-y-6">

                {/* Main Detail Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-800 leading-snug">{submission.title}</h2>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        <span className="font-medium text-gray-700">{submission.instansi || 'Instansi tidak tersedia'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span>{submission.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Withdraw & Delete Actions */}
                  {(submission.status === 'Menunggu Validasi' || submission.status === 'Dibatalkan' || submission.status === 'Draft') && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-gray-700">Tindakan Penulis</h4>
                        <p className="text-xs text-gray-500">
                          {submission.status === 'Menunggu Validasi'
                            ? 'Anda dapat membatalkan atau menghapus pengajuan ini jika belum diproses.'
                            : 'Pengajuan ini telah dibatalkan. Anda dapat menghapusnya secara permanen.'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {submission.status === 'Menunggu Validasi' && (
                          <button
                            onClick={async () => {
                              if (!confirm('Apakah Anda yakin ingin membatalkan pengajuan ini?')) return;
                              try {
                                const token = getToken();
                                const res = await fetch(`/api/submissions/${id}`, {
                                  method: 'PATCH',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                  },
                                  body: JSON.stringify({ status: 'Dibatalkan' })
                                });
                                if (!res.ok) throw new Error('Gagal membatalkan');
                                fetchSubmission();
                                showToast('Pengajuan berhasil dibatalkan', 'info');
                              } catch (e) {
                                showToast('Gagal membatalkan pengajuan', 'error');
                              }
                            }}
                            className="px-4 py-2 bg-white border border-yellow-300 text-yellow-700 font-bold rounded-lg text-xs hover:bg-yellow-50 transition shadow-sm"
                          >
                            Batalkan
                          </button>
                        )}

                        <button
                          onClick={async () => {
                            if (!confirm('PERINGATAN: Apakah Anda yakin ingin MENGHAPUS pengajuan ini secara PERMANEN? Data tidak dapat dikembalikan.')) return;
                            try {
                              const token = getToken();
                              const res = await fetch(`/api/submissions/${id}`, {
                                method: 'DELETE',
                                headers: {
                                  'Authorization': `Bearer ${token}`
                                }
                              });
                              if (!res.ok) throw new Error('Gagal menghapus');
                              showToast('Pengajuan berhasil dihapus.', 'success');
                              router.push('/author/daftar-pengajuan');
                            } catch (e) {
                              showToast('Gagal menghapus pengajuan: ' + (e instanceof Error ? e.message : 'Error unknown'), 'error');
                            }
                          }}
                          className="px-4 py-2 bg-white border border-red-200 text-red-600 font-bold rounded-lg text-xs hover:bg-red-50 transition shadow-sm"
                        >
                          Hapus Permanen
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="prose prose-sm max-w-none text-gray-600 bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h3 className="text-gray-900 font-semibold mb-2">Abstrak / Konten</h3>
                    <p className="whitespace-pre-line leading-relaxed">{submission.content || 'Konten tidak tersedia.'}</p>
                  </div>

                  {/* Revision Notes Alert */}
                  {submission.status === 'Revisi' && submission.revision_notes && (
                    <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">Catatan Revisi dari Admin/Editor</h3>
                          <div className="mt-2 text-sm text-red-700">
                            <p>{submission.revision_notes}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Files Section */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    Dokumen & Berkas
                  </h2>
                  <div className="space-y-3">
                    {(submission.files && submission.files.length > 0) ? submission.files.map((f: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{f.filename || f.name}</p>
                            <p className="text-xs text-gray-500">Diunggah pada {submission.date}</p>
                          </div>
                        </div>
                        <a href={f.url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#00BDBB] hover:text-[#009e9e] hover:underline">
                          Unduh
                        </a>
                      </div>
                    )) : <div className="text-center py-6 text-gray-500 text-sm">Belum ada berkas yang diunggah.</div>}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <input ref={fileRef} type="file" className="hidden" onChange={handleFileChange} />
                    <button onClick={handleUploadClick} className="flex items-center gap-2 px-5 py-2.5 bg-[#00BDBB] hover:bg-[#00AFAF] text-white rounded-xl font-semibold transition shadow-sm hover:shadow-md hover:-translate-y-0.5 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Unggah Berkas Baru
                    </button>
                    <p className="text-xs text-gray-500 mt-2 ml-1">Format: PDF, DOCX (Max 5MB). Revisi dapat diunggah di sini.</p>
                  </div>
                </div>
              </div>

              {/* Right Column: History */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Riwayat & Log</h2>
                  <div className="relative border-l-2 border-gray-100 ml-3 space-y-6 pl-6 py-2">
                    {(submission.history && submission.history.length > 0) ? submission.history.map((h: any, i: number) => (
                      <div key={i} className="relative">
                        <div className={`absolute -left-[29px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-100 
                                            ${h.status === 'Revisi' ? 'bg-red-500' : 'bg-[#00BDBB]'}`}></div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 mb-1">{h.date}</p>
                          <h4 className="text-sm font-bold text-gray-900">{h.status}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">Oleh: <span className="font-medium text-gray-700">{h.actor || 'System'}</span></p>
                          {h.note && (
                            <div className="mt-2 bg-gray-50 p-3 rounded-lg text-xs text-gray-600 border border-gray-100 italic">
                              "{h.note}"
                            </div>
                          )}
                        </div>
                      </div>
                    )) : <div className="text-sm text-gray-500 italic">Belum ada riwayat aktivitas.</div>}
                  </div>
                </div>

                {/* LOA Download (Condition) */}
                {submission.status === 'Disetujui' && (
                  <div className="bg-gradient-to-br from-[#005f59] to-[#008f85] rounded-2xl p-6 text-white shadow-lg text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="font-bold text-lg mb-1">Naskah Disetujui!</h3>
                    <p className="text-white/80 text-sm mb-6">Selamat! Naskah Anda telah disetujui. Silakan unduh Letter of Acceptance (LoA) Anda di bawah ini.</p>
                    <a href={`/api/submissions/${id}/loa/download`} className="block w-full py-3 bg-white text-[#006E66] font-bold rounded-xl hover:bg-gray-50 transition shadow-sm">
                      Unduh LoA Resmi
                    </a>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

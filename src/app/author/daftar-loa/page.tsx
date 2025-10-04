"use client";

import { useState } from "react";
import Link from "next/link";

interface LOAItem {
  id: string;
  judulArtikel: string;
  namaJurnal: string;
  tanggalPengajuan: string;
  status: "Menunggu Verifikasi" | "Sedang Direview" | "Diterima" | "Ditolak";
  institusi: string;
}

export default function DaftarLOAPage() {
  const [loaList] = useState<LOAItem[]>([
    {
      id: "LOA-001",
      judulArtikel: "Implementasi Machine Learning untuk Deteksi Fraud dalam Sistem Perbankan",
      namaJurnal: "Jurnal Teknologi Informasi",
      tanggalPengajuan: "2024-01-15",
      status: "Menunggu Verifikasi",
      institusi: "Universitas Indonesia"
    },
    {
      id: "LOA-002", 
      judulArtikel: "Analisis Keamanan Siber pada Aplikasi Mobile Banking",
      namaJurnal: "Jurnal Keamanan Siber",
      tanggalPengajuan: "2024-01-10",
      status: "Sedang Direview",
      institusi: "Institut Teknologi Bandung"
    },
    {
      id: "LOA-003",
      judulArtikel: "Pengembangan Sistem Rekomendasi Berbasis Collaborative Filtering",
      namaJurnal: "Jurnal Data Science",
      tanggalPengajuan: "2024-01-05",
      status: "Diterima",
      institusi: "Universitas Gadjah Mada"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Menunggu Verifikasi":
        return "bg-yellow-100 text-yellow-800";
      case "Sedang Direview":
        return "bg-blue-100 text-blue-800";
      case "Diterima":
        return "bg-green-100 text-green-800";
      case "Ditolak":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Menunggu Verifikasi":
        return "⏳";
      case "Sedang Direview":
        return "👀";
      case "Diterima":
        return "✅";
      case "Ditolak":
        return "❌";
      default:
        return "📄";
    }
  };

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#6E63FF] flex items-center justify-center">
                <span className="text-white text-lg">📋</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Daftar Pengajuan LOA</h1>
            </div>
            <Link
              href="/author"
              className="inline-flex items-center px-4 py-2 bg-[#6E63FF] text-white rounded-lg hover:bg-[#5B52E8] transition-colors"
            >
              <span className="mr-2">+</span>
              Ajukan LOA Baru
            </Link>
          </div>
          <p className="text-gray-600">
            Pantau status pengajuan Letter of Acceptance (LOA) Anda
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-yellow-600 text-xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Menunggu Verifikasi</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-blue-600 text-xl">👀</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sedang Direview</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-green-600 text-xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Diterima</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <span className="text-gray-600 text-xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Pengajuan</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>
        </div>

        {/* LOA List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Riwayat Pengajuan</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {loaList.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📄</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada pengajuan LOA</h3>
                <p className="text-gray-600 mb-4">Mulai ajukan LOA pertama Anda</p>
                <Link
                  href="/author"
                  className="inline-flex items-center px-4 py-2 bg-[#6E63FF] text-white rounded-lg hover:bg-[#5B52E8] transition-colors"
                >
                  Ajukan LOA Baru
                </Link>
              </div>
            ) : (
              loaList.map((loa) => (
                <div key={loa.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{loa.judulArtikel}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(loa.status)}`}>
                          <span className="mr-1">{getStatusIcon(loa.status)}</span>
                          {loa.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">ID Pengajuan:</span>
                          <p className="text-gray-900">{loa.id}</p>
                        </div>
                        <div>
                          <span className="font-medium">Jurnal Tujuan:</span>
                          <p className="text-gray-900">{loa.namaJurnal}</p>
                        </div>
                        <div>
                          <span className="font-medium">Tanggal Pengajuan:</span>
                          <p className="text-gray-900">{new Date(loa.tanggalPengajuan).toLocaleDateString('id-ID')}</p>
                        </div>
                        <div>
                          <span className="font-medium">Institusi:</span>
                          <p className="text-gray-900">{loa.institusi}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4 flex flex-col gap-2">
                      <button className="px-3 py-1 text-sm text-[#6E63FF] hover:text-[#5B52E8] font-medium">
                        Lihat Detail
                      </button>
                      {loa.status === "Diterima" && (
                        <button className="px-3 py-1 text-sm text-green-600 hover:text-green-700 font-medium">
                          Download LOA
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Informasi Status</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Menunggu Verifikasi:</strong> Pengajuan sedang dalam antrian untuk diverifikasi admin</li>
                  <li><strong>Sedang Direview:</strong> Pengajuan sedang direview oleh editor</li>
                  <li><strong>Diterima:</strong> LOA telah disetujui dan dapat didownload</li>
                  <li><strong>Ditolak:</strong> Pengajuan tidak memenuhi kriteria (dapat diajukan ulang)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

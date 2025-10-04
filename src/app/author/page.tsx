"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function AuthorPage() {
  const [formData, setFormData] = useState({
    namaLengkap: "",
    idPenulis: "",
    email: "",
    judulArtikel: "",
    namaJurnal: "",
    tanggalPengajuan: "",
    institusi: "",
    pesanTambahan: "",
    fileArtikel: null as File | null,
    buktiPembayaran: null as File | null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const jurnalOptions = [
    "Jurnal Teknologi Informasi",
    "Jurnal Ilmu Komputer",
    "Jurnal Sistem Informasi",
    "Jurnal Rekayasa Perangkat Lunak",
    "Jurnal Kecerdasan Buatan",
    "Jurnal Keamanan Siber",
    "Jurnal Data Science",
    "Jurnal Machine Learning"
  ];

  const steps = [
    { id: 1, name: "Informasi Penulis", description: "Data pribadi dan kontak" },
    { id: 2, name: "Detail Artikel", description: "Judul dan jurnal tujuan" },
    { id: 3, name: "Upload Dokumen", description: "File artikel dan bukti pembayaran" },
    { id: 4, name: "Review & Submit", description: "Periksa dan kirim pengajuan" }
  ];

  // Calculate form completion percentage
  const calculateProgress = () => {
    const requiredFields = ['namaLengkap', 'email', 'judulArtikel', 'namaJurnal', 'institusi', 'fileArtikel', 'buktiPembayaran'];
    const completedFields = requiredFields.filter(field => {
      if (field === 'fileArtikel' || field === 'buktiPembayaran') {
        return formData[field as keyof typeof formData] !== null;
      }
      return formData[field as keyof typeof formData] !== '';
    });
    return Math.round((completedFields.length / requiredFields.length) * 100);
  };

  const progress = calculateProgress();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'fileArtikel' | 'buktiPembayaran') => {
    const file = e.target.files?.[0];
    if (file) {
      // Validasi untuk file artikel (PDF)
      if (fileType === 'fileArtikel') {
        if (file.type !== "application/pdf") {
          setErrors(prev => ({
            ...prev,
            fileArtikel: "File artikel harus berformat PDF"
          }));
          return;
        }
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          setErrors(prev => ({
            ...prev,
            fileArtikel: "Ukuran file artikel maksimal 10MB"
          }));
          return;
        }
      }
      
      // Validasi untuk bukti pembayaran (PDF, JPG, PNG)
      if (fileType === 'buktiPembayaran') {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
          setErrors(prev => ({
            ...prev,
            buktiPembayaran: "File bukti pembayaran harus berformat PDF, JPG, atau PNG"
          }));
          return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          setErrors(prev => ({
            ...prev,
            buktiPembayaran: "Ukuran file bukti pembayaran maksimal 5MB"
          }));
          return;
        }
      }
      
      setFormData(prev => ({
        ...prev,
        [fileType]: file
      }));
      setErrors(prev => ({
        ...prev,
        [fileType]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.namaLengkap.trim()) {
      newErrors.namaLengkap = "Nama lengkap wajib diisi";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.judulArtikel.trim()) {
      newErrors.judulArtikel = "Judul artikel wajib diisi";
    }

    if (!formData.namaJurnal) {
      newErrors.namaJurnal = "Nama jurnal wajib dipilih";
    }

    if (!formData.institusi.trim()) {
      newErrors.institusi = "Institusi/Universitas wajib diisi";
    }

    if (!formData.fileArtikel) {
      newErrors.fileArtikel = "File artikel PDF wajib diupload";
    }

    if (!formData.buktiPembayaran) {
      newErrors.buktiPembayaran = "Bukti pembayaran wajib diupload";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Set current date
      const currentDate = new Date().toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        tanggalPengajuan: currentDate
      }));

      setShowSuccess(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          namaLengkap: "",
          idPenulis: "",
          email: "",
          judulArtikel: "",
          namaJurnal: "",
          tanggalPengajuan: "",
          institusi: "",
          pesanTambahan: "",
          fileArtikel: null,
          buktiPembayaran: null
        });
        setShowSuccess(false);
        setCurrentStep(1);
      }, 3000);
    } catch (error) {
      alert("Terjadi kesalahan saat mengirim pengajuan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-sans bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#6E63FF] to-[#8B5CF6] flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">📝</span>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Form Pengajuan LOA</h1>
                <p className="text-gray-600 mt-1">Letter of Acceptance - Rumah Jurnal</p>
              </div>
            </div>
            <Link
              href="/author/daftar-loa"
              className="hidden sm:flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm border"
            >
              <span className="mr-2">📋</span>
              Lihat Daftar LOA
            </Link>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Progress Pengisian Form</h2>
              <span className="text-sm font-medium text-[#6E63FF]">{progress}% Selesai</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div 
                className="bg-gradient-to-r from-[#6E63FF] to-[#8B5CF6] h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {steps.map((step) => (
                <div key={step.id} className={`text-center p-3 rounded-lg transition-all ${
                  currentStep >= step.id 
                    ? 'bg-gradient-to-r from-[#6E63FF] to-[#8B5CF6] text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center text-sm font-bold ${
                    currentStep >= step.id ? 'bg-white text-[#6E63FF]' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {step.id}
                  </div>
                  <p className="text-xs font-medium">{step.name}</p>
                  <p className="text-xs opacity-75">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">💳</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Informasi Biaya & Pembayaran</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p><strong>Biaya Pengajuan LOA:</strong> Rp 150.000 per artikel</p>
                <p><strong>Metode Pembayaran:</strong></p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Transfer Bank: BCA 1234567890 a.n. Rumah Jurnal</li>
                  <li>E-Wallet: DANA, OVO, GoPay, ShopeePay</li>
                  <li>QRIS: Scan QR code di halaman pembayaran</li>
                </ul>
                <p className="text-xs text-blue-600 mt-2">
                  *Upload bukti pembayaran setelah melakukan transfer/pembayaran
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Success Modal */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-3xl">✅</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Pengajuan Berhasil!</h3>
              <p className="text-gray-600 mb-6">
                LOA Anda telah berhasil dikirim dan sedang dalam proses verifikasi admin.
              </p>
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Status:</strong> Menunggu Verifikasi Admin<br/>
                  <strong>Estimasi:</strong> 3-5 hari kerja
                </p>
              </div>
              <p className="text-sm text-gray-500">
                Form akan direset dalam beberapa detik...
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Informasi Penulis */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-[#6E63FF] to-[#8B5CF6] rounded-full flex items-center justify-center text-white text-sm font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Informasi Penulis</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nama Lengkap */}
                <div className="md:col-span-2">
                  <label htmlFor="namaLengkap" className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="namaLengkap"
                    name="namaLengkap"
                    value={formData.namaLengkap}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#6E63FF] focus:border-transparent transition-all text-gray-900 placeholder-gray-400 ${
                      errors.namaLengkap ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400 bg-white'
                    }`}
                    placeholder="Masukkan nama lengkap Anda"
                  />
                  {errors.namaLengkap && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <span>⚠️</span> {errors.namaLengkap}
                    </p>
                  )}
                </div>

                {/* ID Penulis / NIDN */}
                <div>
                  <label htmlFor="idPenulis" className="block text-sm font-medium text-gray-700 mb-2">
                    ID Penulis / NIDN <span className="text-gray-400">(Opsional)</span>
                  </label>
                  <input
                    type="text"
                    id="idPenulis"
                    name="idPenulis"
                    value={formData.idPenulis}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#6E63FF] focus:border-transparent transition-all hover:border-gray-400 text-gray-900 placeholder-gray-400 bg-white"
                    placeholder="Masukkan ID Penulis atau NIDN"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Aktif <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#6E63FF] focus:border-transparent transition-all text-gray-900 placeholder-gray-400 ${
                      errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400 bg-white'
                    }`}
                    placeholder="contoh@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <span>⚠️</span> {errors.email}
                    </p>
                  )}
                </div>

                {/* Institusi */}
                <div className="md:col-span-2">
                  <label htmlFor="institusi" className="block text-sm font-medium text-gray-700 mb-2">
                    Institusi / Universitas <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="institusi"
                    name="institusi"
                    value={formData.institusi}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#6E63FF] focus:border-transparent transition-all text-gray-900 placeholder-gray-400 ${
                      errors.institusi ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400 bg-white'
                    }`}
                    placeholder="Masukkan nama institusi atau universitas"
                  />
                  {errors.institusi && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <span>⚠️</span> {errors.institusi}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Step 2: Detail Artikel */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-[#6E63FF] to-[#8B5CF6] rounded-full flex items-center justify-center text-white text-sm font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Detail Artikel</h3>
              </div>
              
              <div className="space-y-6">
                {/* Judul Artikel */}
                <div>
                  <label htmlFor="judulArtikel" className="block text-sm font-medium text-gray-700 mb-2">
                    Judul Artikel / Jurnal <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="judulArtikel"
                    name="judulArtikel"
                    value={formData.judulArtikel}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#6E63FF] focus:border-transparent resize-none transition-all text-gray-900 placeholder-gray-400 ${
                      errors.judulArtikel ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400 bg-white'
                    }`}
                    placeholder="Masukkan judul artikel yang akan diterbitkan"
                  />
                  {errors.judulArtikel && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <span>⚠️</span> {errors.judulArtikel}
                    </p>
                  )}
                </div>

                {/* Nama Jurnal */}
                <div>
                  <label htmlFor="namaJurnal" className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Jurnal / Rumah Jurnal Tujuan <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="namaJurnal"
                    name="namaJurnal"
                    value={formData.namaJurnal}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#6E63FF] focus:border-transparent transition-all text-gray-900 ${
                      errors.namaJurnal ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400 bg-white'
                    }`}
                  >
                    <option value="">Pilih jurnal yang dituju</option>
                    {jurnalOptions.map((jurnal, index) => (
                      <option key={index} value={jurnal}>{jurnal}</option>
                    ))}
                  </select>
                  {errors.namaJurnal && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <span>⚠️</span> {errors.namaJurnal}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Step 3: Upload Dokumen */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-[#6E63FF] to-[#8B5CF6] rounded-full flex items-center justify-center text-white text-sm font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Upload Dokumen</h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upload File Artikel */}
                <div>
                  <label htmlFor="fileArtikel" className="block text-sm font-medium text-gray-700 mb-2">
                    Upload File Artikel (PDF) <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#6E63FF] transition-all group">
                    <div className="space-y-3 text-center">
                      <div className="w-16 h-16 bg-gray-100 group-hover:bg-[#6E63FF]/10 rounded-full flex items-center justify-center mx-auto transition-colors">
                        <svg className="w-8 h-8 text-gray-400 group-hover:text-[#6E63FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="fileArtikel" className="relative cursor-pointer bg-white rounded-md font-medium text-[#6E63FF] hover:text-[#5B52E8] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#6E63FF]">
                          <span>Upload file PDF</span>
                          <input
                            id="fileArtikel"
                            name="fileArtikel"
                            type="file"
                            accept=".pdf"
                            onChange={(e) => handleFileChange(e, 'fileArtikel')}
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">atau drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PDF maksimal 10MB</p>
                    </div>
                  </div>
                  {formData.fileArtikel && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700 flex items-center gap-2">
                        <span>✅</span> File terpilih: {formData.fileArtikel.name}
                      </p>
                    </div>
                  )}
                  {errors.fileArtikel && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span>⚠️</span> {errors.fileArtikel}
                    </p>
                  )}
                </div>

                {/* Upload Bukti Pembayaran */}
                <div>
                  <label htmlFor="buktiPembayaran" className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Bukti Pembayaran <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#6E63FF] transition-all group">
                    <div className="space-y-3 text-center">
                      <div className="w-16 h-16 bg-gray-100 group-hover:bg-[#6E63FF]/10 rounded-full flex items-center justify-center mx-auto transition-colors">
                        <svg className="w-8 h-8 text-gray-400 group-hover:text-[#6E63FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="buktiPembayaran" className="relative cursor-pointer bg-white rounded-md font-medium text-[#6E63FF] hover:text-[#5B52E8] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#6E63FF]">
                          <span>Upload bukti pembayaran</span>
                          <input
                            id="buktiPembayaran"
                            name="buktiPembayaran"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange(e, 'buktiPembayaran')}
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">atau drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PDF, JPG, PNG maksimal 5MB</p>
                    </div>
                  </div>
                  {formData.buktiPembayaran && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700 flex items-center gap-2">
                        <span>✅</span> File terpilih: {formData.buktiPembayaran.name}
                      </p>
                    </div>
                  )}
                  {errors.buktiPembayaran && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                      <span>⚠️</span> {errors.buktiPembayaran}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Step 4: Review & Submit */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-[#6E63FF] to-[#8B5CF6] rounded-full flex items-center justify-center text-white text-sm font-bold">
                  4
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Review & Submit</h3>
              </div>
              
              <div className="space-y-6">
                {/* Pesan Tambahan */}
                <div>
                  <label htmlFor="pesanTambahan" className="block text-sm font-medium text-gray-700 mb-2">
                    Pesan Tambahan <span className="text-gray-400">(Opsional)</span>
                  </label>
                  <textarea
                    id="pesanTambahan"
                    name="pesanTambahan"
                    value={formData.pesanTambahan}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#6E63FF] focus:border-transparent resize-none transition-all hover:border-gray-400 text-gray-900 placeholder-gray-400 bg-white"
                    placeholder="Masukkan catatan tambahan atau informasi penting lainnya"
                  />
                </div>

                {/* Form Summary */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Pengajuan</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Nama:</span>
                      <p className="text-gray-900">{formData.namaLengkap || 'Belum diisi'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Email:</span>
                      <p className="text-gray-900">{formData.email || 'Belum diisi'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Institusi:</span>
                      <p className="text-gray-900">{formData.institusi || 'Belum diisi'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Jurnal Tujuan:</span>
                      <p className="text-gray-900">{formData.namaJurnal || 'Belum dipilih'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="font-medium text-gray-600">Judul Artikel:</span>
                      <p className="text-gray-900">{formData.judulArtikel || 'Belum diisi'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">File Artikel:</span>
                      <p className="text-gray-900">{formData.fileArtikel ? '✅ Terupload' : '❌ Belum diupload'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Bukti Pembayaran:</span>
                      <p className="text-gray-900">{formData.buktiPembayaran ? '✅ Terupload' : '❌ Belum diupload'}</p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || progress < 100}
                    className={`w-full flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                      isSubmitting || progress < 100
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-gradient-to-r from-[#6E63FF] to-[#8B5CF6] hover:from-[#5B52E8] hover:to-[#7C3AED] text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Mengirim Pengajuan...
                      </>
                    ) : progress < 100 ? (
                      <>
                        <span className="mr-2">⚠️</span>
                        Lengkapi semua field wajib terlebih dahulu
                      </>
                    ) : (
                      <>
                        <span className="mr-2">🚀</span>
                        Submit Request LOA
                      </>
                    )}
                  </button>
                  
                  {progress < 100 && (
                    <p className="mt-3 text-center text-sm text-gray-500">
                      Progress: {progress}% - Lengkapi semua field wajib untuk melanjutkan
                    </p>
                  )}
                </div>
              </div>
            </div>
          </form>
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
              <h3 className="text-sm font-medium text-blue-800">Informasi Penting</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Setelah submit, pengajuan Anda akan berstatus "Menunggu Verifikasi Admin"</li>
                  <li>Anda akan menerima notifikasi via email untuk setiap update status</li>
                  <li>Proses verifikasi biasanya memakan waktu 3-5 hari kerja</li>
                  <li>Pastikan file PDF yang diupload sudah final dan tidak akan diubah</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

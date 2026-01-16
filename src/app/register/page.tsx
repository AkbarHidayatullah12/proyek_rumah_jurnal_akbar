'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/components/ToastProvider';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    institution: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = formData.fullName.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (!name || !email || !password || !confirmPassword) {
      showToast('Semua kolom wajib diisi', 'warning');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Konfirmasi password tidak cocok', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password minimal 6 karakter', 'warning');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || 'Registrasi gagal', 'error');
        return;
      }

      showToast('Registrasi berhasil! Mengalihkan ke login...', 'success');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Registrasi gagal', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center p-4 relative"
      style={{
        background: 'linear-gradient(135deg, #00BDBB 0%, #00D4D2 50%, #00AFAF 100%)',
      }}
    >
      {/* Decorative blur elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full -ml-36 -mb-36 blur-3xl"></div>

      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' fill=\'black\' filter=\'url(%23noise)\' /%3E%3C/svg%3E")',
      }}></div>

      {/* Registration Card */}
      <div className="w-full max-w-[480px] relative z-10">
        <div
          className="bg-white rounded-[20px] p-10 shadow-lg"
          style={{ boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.08)' }}
        >
          {/* Header Section */}
          <div className="text-center mb-8">
            {/* Logo Container */}
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00BDBB] to-[#00A5A4] flex items-center justify-center">
                <span className="font-poppins font-semibold text-white text-[18px]">
                  E
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="font-poppins font-semibold text-[22px] text-[#222222] mb-2">
              Registrasi Author E-LOA
            </h1>

            {/* Subtitle */}
            <p className="font-poppins font-normal text-[13px] text-[#777777] leading-[1.5]">
              Silakan isi data di bawah ini untuk membuat akun baru
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-0">
            {/* Full Name Field */}
            <div className="mb-4">
              <label className="block font-poppins font-normal text-[13px] text-[#555555] mb-1.5">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="Masukkan nama lengkap"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full h-[42px] px-3.5 rounded-[10px] bg-[#F4F4F4] border-none font-poppins text-[13px] text-black placeholder-[#AAAAAA] focus:outline-none focus:ring-2 focus:ring-[#00BDBB] transition-all"
                style={{
                  boxShadow: 'inset 0px 1px 3px rgba(0, 0, 0, 0.05)',
                }}
              />
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label className="block font-poppins font-normal text-[13px] text-[#555555] mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Masukkan alamat email"
                value={formData.email}
                onChange={handleChange}
                className="w-full h-[42px] px-3.5 rounded-[10px] bg-[#F4F4F4] border-none font-poppins text-[13px] text-black placeholder-[#AAAAAA] focus:outline-none focus:ring-2 focus:ring-[#00BDBB] transition-all"
                style={{
                  boxShadow: 'inset 0px 1px 3px rgba(0, 0, 0, 0.05)',
                }}
              />
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label className="block font-poppins font-normal text-[13px] text-[#555555] mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Masukkan kata sandi"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-[42px] px-3.5 rounded-[10px] bg-[#F4F4F4] border-none font-poppins text-[13px] text-black placeholder-[#AAAAAA] focus:outline-none focus:ring-2 focus:ring-[#00BDBB] transition-all pr-11"
                  style={{
                    boxShadow: 'inset 0px 1px 3px rgba(0, 0, 0, 0.05)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#AAAAAA] hover:text-[#777777] transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ) : (
                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="mb-4">
              <label className="block font-poppins font-normal text-[13px] text-[#555555] mb-1.5">
                Konfirmasi Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Ulangi kata sandi"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full h-[42px] px-3.5 rounded-[10px] bg-[#F4F4F4] border-none font-poppins text-[13px] text-black placeholder-[#AAAAAA] focus:outline-none focus:ring-2 focus:ring-[#00BDBB] transition-all pr-11"
                  style={{
                    boxShadow: 'inset 0px 1px 3px rgba(0, 0, 0, 0.05)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#AAAAAA] hover:text-[#777777] transition-colors"
                >
                  {showConfirmPassword ? (
                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ) : (
                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Institution Field (Optional) */}
            <div className="mb-6">
              <label className="block font-poppins font-normal text-[13px] text-[#555555] mb-1.5">
                Instansi (Opsional)
              </label>
              <input
                type="text"
                name="institution"
                placeholder="Masukkan instansi asal"
                value={formData.institution}
                onChange={handleChange}
                className="w-full h-[42px] px-3.5 rounded-[10px] bg-[#F4F4F4] border-none font-poppins text-[13px] text-black placeholder-[#AAAAAA] focus:outline-none focus:ring-2 focus:ring-[#00BDBB] transition-all"
                style={{
                  boxShadow: 'inset 0px 1px 3px rgba(0, 0, 0, 0.05)',
                }}
              />
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full h-[45px] rounded-[12px] bg-[#00BDBB] text-white font-poppins font-semibold text-[14px] hover:bg-[#00A5A4] transition-all hover:scale-[1.02] flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              style={{
                backgroundImage: 'linear-gradient(135deg, #00BDBB 0%, #00A5A4 100%)',
              }}
            >
              <svg className="w-[16px] h-[16px]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              DAFTAR
            </button>
          </form>

          {/* Footer Links */}
          <div className="text-center mt-5 text-[13px] text-[#666666] font-poppins">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-[#00BDBB] font-semibold hover:underline transition-all">
              Login
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-center mt-6 text-[10px] text-[#AAAAAA] font-poppins">
            © 2025 E-LOA. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}

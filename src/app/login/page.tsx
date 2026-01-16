'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { setToken } from '@/lib/auth';
import { useToast } from '@/app/components/ToastProvider';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const remembered = localStorage.getItem('rememberEmail');
      if (remembered) {
        setEmail(remembered);
        setRememberMe(true);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      showToast('Email dan password harus diisi', 'warning');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.error || 'Login gagal', 'error');
        return;
      }

      showToast('Login berhasil, mengalihkan...', 'success');
      setToken(data.token);
      if (rememberMe) {
        localStorage.setItem('rememberEmail', normalizedEmail);
      } else {
        localStorage.removeItem('rememberEmail');
      }

      if (data.user.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (data.user.role === 'editor') {
        router.push('/editor');
      } else {
        router.push('/author');
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'An error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex relative z-10 bg-white">
      {/* Left Hero Section */}
      <div className="w-1/2 bg-gradient-to-b from-[#00CFC5] to-[#00B2AA] flex flex-col items-center justify-center text-white relative overflow-hidden px-8">
        {/* Back Button */}
        <div className="absolute top-6 left-6 z-20">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors font-poppins text-sm font-medium group"
          >
            <svg
              className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Beranda
          </Link>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-20 left-10 w-60 h-60 bg-white/5 rounded-full"></div>

        <div className="relative z-10 text-center max-w-[500px]">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="w-50 h-50">
              <Image
                src="/eloa-logo.png"
                alt="Rumah Jurnal Logo"
                width={96}
                height={96}
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Title */}
          <p className="font-poppins font-semibold text-[26px] tracking-wide mb-3">
            E-LOA RUMAH JURNAL
          </p>

          {/* Description */}
          <p className="font-poppins font-normal text-[14px] text-white/85 leading-[22px]">
            Platform terpercaya untuk mengelola sistem informasi E-LOA
          </p>

          {/* Slider Indicators */}
          <div className="flex gap-1.5 mt-12 justify-center">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`rounded-full transition-all ${i === currentSlide
                  ? 'w-1.5 h-1.5 bg-white'
                  : 'w-1.5 h-1.5 bg-white/50'
                  }`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Login Form Section */}
      <div className="w-1/2 bg-white flex items-center justify-center p-8 text-black relative">
        <div className="w-full max-w-[380px]">
          {/* Card */}
          <div className="bg-white rounded-2xl p-7 shadow-lg" style={{ boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.08)' }}>
            {/* Title */}
            <h2 className="font-poppins font-bold text-[20px] text-black mb-1.5">
              Login E-LOA
            </h2>

            {/* Subtitle */}
            <p className="font-poppins font-normal text-[13px] text-gray-600 mb-6">
              Silakan masuk dengan kredensial Anda
            </p>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-0">
              {/* Email Field */}
              <div className="mb-4">
                <label className="block font-poppins font-medium text-[13px] text-black mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Masukkan alamat email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); }}
                  autoFocus
                  className="w-full h-11 px-3.5 rounded-[10px] bg-[#F9FAFB] border border-[#E5E7EB] font-poppins text-[13px] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00CFC5] transition-all"
                />
              </div>

              {/* Password Field */}
              <div className="mb-3">
                <label className="block font-poppins font-medium text-[13px] text-black mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); }}
                    className="w-full h-11 px-3.5 rounded-[10px] bg-[#F9FAFB] border border-[#E5E7EB] font-poppins text-[13px] text-black placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#00CFC5] transition-all pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
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

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between mb-5 text-[12px]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded accent-[#00BDBB] cursor-pointer"
                  />
                  <span className="font-poppins font-normal text-[#6B7280]">
                    Ingat saya
                  </span>
                </label>
                <Link href="/forgot-password">
                  <button
                    type="button"
                    className="font-poppins font-medium text-[#00BDBB] hover:underline transition-all bg-transparent border-none p-0 cursor-pointer"
                  >
                    Lupa Password?
                  </button>
                </Link>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-full bg-gradient-to-r from-[#00CFC5] to-[#00B2AA] text-white font-poppins font-semibold text-[14px] hover:from-[#00ADA5] hover:to-[#009C95] transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Masuk...' : 'Masuk'}
              </button>

              {/* Register Button */}
              <Link href="/register">
                <button
                  type="button"
                  className="w-full h-11 rounded-full mt-3 bg-white border-2 border-[#00CFC5] text-[#00CFC5] font-poppins font-semibold text-[14px] hover:bg-[#F9FAFB] transition-all shadow-sm hover:shadow-md"
                >
                  Daftar Akun Baru
                </button>
              </Link>
            </form>

            {/* Footer */}
            <div className="text-center mt-4.5 text-[11px] text-gray-500 font-poppins">
              © 2023 E-LOA. All rights reserved
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

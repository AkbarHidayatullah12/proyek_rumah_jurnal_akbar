'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/app/components/ToastProvider';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      setIsSubmitted(true);
      showToast('Link reset password berhasil dikirim ke email.', 'success');
      // showToast('Silakan cek terminal/console server untuk link (Dev Mode)', 'info');
    } catch (error) {
      showToast('Gagal mengirim permintaan reset password.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #00B9B2 0%, #00D4CF 100%)',
      }}
    >
      {/* Card */}
      <div
        className="w-full max-w-[360px] bg-white rounded-[20px] p-8 relative"
        style={{ boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.08)' }}
      >
        <div className="flex flex-col items-center">
          {/* Logo Container */}
          <div
            className="w-12 h-12 rounded-[14px] flex items-center justify-center mb-2"
            style={{ backgroundColor: '#00B9B2' }}
          >
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
          </div>

          {/* Logo Text */}
          <p
            className="font-poppins font-semibold text-[18px] text-[#1F2A37] mt-2"
            style={{ letterSpacing: '0.5px' }}
          >
            E-LOA
          </p>

          {/* Title */}
          <h1 className="font-poppins font-semibold text-[16px] text-[#1F2A37] text-center mt-5">
            Lupa Kata Sandi
          </h1>

          {/* Subtitle */}
          <p
            className="font-poppins font-normal text-[12px] text-[#6B7280] text-center mt-2"
            style={{ lineHeight: '18px', maxWidth: '260px' }}
          >
            Masukkan alamat email Anda untuk menerima tautan reset password.
          </p>

          {/* Email Icon Circle */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mt-5 mb-3"
            style={{ backgroundColor: '#E6F8F7' }}
          >
            <svg className="w-6 h-6 text-[#00B9B2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full">
            {/* Email Label */}
            <label className="block font-poppins font-medium text-[12px] text-[#374151] mb-1">
              Email
            </label>

            {/* Email Input */}
            <input
              type="email"
              placeholder="Masukkan alamat email Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-[38px] px-3.5 rounded-[10px] bg-[#F3F4F6] border-none font-poppins text-[12px] text-black placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#00B9B2] transition-all"
              style={{
                boxShadow: 'inset 0px 1px 3px rgba(0, 0, 0, 0.05)',
              }}
            />

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-10 rounded-[12px] bg-[#00B9B2] text-white font-poppins font-semibold text-[13px] mt-5 hover:bg-[#009E98] transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {isSubmitted ? 'Link terkirim! ✓' : 'Kirim Link Reset'}
            </button>
          </form>

          {/* Back to Login Link */}
          <Link href="/login">
            <button
              type="button"
              className="font-poppins font-medium text-[12px] text-[#00B9B2] mt-3.5 hover:underline transition-all cursor-pointer bg-transparent border-none"
            >
              ← Kembali ke Login
            </button>
          </Link>

          {/* Footer Copyright */}
          <div className="text-center mt-7 text-[10px] text-[#9CA3AF] font-poppins">
            © 2025 E-LOA. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}

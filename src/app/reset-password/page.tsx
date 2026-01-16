'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/app/components/ToastProvider';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('Kata sandi tidak cocok!', 'warning');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });

      if (!res.ok) throw new Error('Gagal mereset password. Token mungkin kadaluarsa.');

      setIsSubmitted(true);
      showToast('Password berhasil diubah, mengalihkan...', 'success');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      showToast('Gagal mereset password. Silakan coba lagi.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-red-100 text-center">
          <div className="text-red-500 font-bold mb-2">Link Tidak Valid</div>
          <p className="text-sm text-gray-500">Token reset password hilang atau tidak valid.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #00B9B2 0%, #00D4CF 100%)',
      }}
    >
      <div
        className="w-full max-w-[360px] bg-white rounded-[20px] p-8 relative"
        style={{ boxShadow: '0px 12px 35px rgba(0, 0, 0, 0.08)' }}
      >
        <div className="flex flex-col items-center">
          {/* Logo */}
          <div className="w-12 h-12 rounded-[14px] flex items-center justify-center mb-2 bg-[#00B9B2]">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
          </div>
          <p className="font-poppins font-semibold text-[18px] text-[#1F2A37] mt-2 tracking-wide">E-LOA</p>
          <h1 className="font-poppins font-semibold text-[16px] text-[#1F2A37] text-center mt-5">Reset Kata Sandi</h1>
          <p className="font-poppins font-normal text-[12px] text-[#6B7280] text-center mt-1.5 leading-relaxed max-w-[260px]">
            Silakan buat kata sandi baru untuk akun Anda.
          </p>

          <form onSubmit={handleSubmit} className="w-full mt-6">
            <div className="mb-3">
              <label className="block font-poppins font-medium text-[12px] text-[#374151] mb-1">
                Kata Sandi Baru
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Masukkan kata sandi baru"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full h-[38px] px-3.5 rounded-[10px] bg-[#F3F4F6] border-none font-poppins text-[12px] text-black placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#00B9B2] transition-all pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                >
                  {showNewPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="mb-4.5">
              <label className="block font-poppins font-medium text-[12px] text-[#374151] mb-1">
                Konfirmasi Kata Sandi Baru
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Ulangi kata sandi baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full h-[38px] px-3.5 rounded-[10px] bg-[#F3F4F6] border-none font-poppins text-[12px] text-black placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#00B9B2] transition-all pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-[12px] bg-[#00B9B2] text-white font-poppins font-semibold text-[13px] mt-4.5 hover:bg-[#009E98] active:scale-95 transition-all duration-300 shadow-md flex items-center justify-center"
            >
              {loading ? 'Memproses...' : isSubmitted ? 'Password Berhasil Diubah! ✓' : 'Simpan Password Baru'}
            </button>
          </form>

          <p className="font-poppins font-normal text-[11px] text-[#6B7280] text-center mt-3 leading-relaxed">
            Pastikan Anda mengingat kata sandi baru dengan baik.
          </p>
          <div className="text-center mt-5 text-[10px] text-[#9CA3AF] font-poppins">
            © 2025 E-LOA. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

"use client";

import { useEffect, useState } from 'react';
import Sidebar from '@/app/components/Sidebar';
import { getToken } from '@/lib/auth';
import { decodeToken } from '@/lib/jwt';
import { useRouter } from 'next/navigation';

type NavItem = { label: string; icon: React.ReactNode; href?: string; active?: boolean; exact?: boolean; };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    const decoded = token ? decodeToken(token) : null;

    if (!token || !decoded || decoded.role !== 'admin') {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    setIsDesktop(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const navItems: NavItem[] = [
    {
      label: 'Dashboard', href: '/admin', exact: true, icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-columns-gap" viewBox="0 0 16 16">
          <path d="M6 1v3H1V1zM1 0a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1zm14 12v3h-5v-3zm-5-1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1zM6 8v7H1V8zM1 7a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm14-6v7h-5V1zm-5-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1z" />
        </svg>
      )
    },
    {
      label: 'Antrian Validasi', href: '/admin/antrian-validasi', icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-archive" viewBox="0 0 16 16">
          <path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5zm13-3H1v2h14zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
        </svg>
      )
    },
    {
      label: 'Manajemen Pengguna', href: '/admin/users', icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-people" viewBox="0 0 16 16">
          <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
        </svg>
      )
    },
    {
      label: 'Laporan', href: '/admin/laporan', icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-journal-text" viewBox="0 0 16 16">
          <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
          <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2" />
          <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z" />
        </svg>
      )
    },
    {
      label: 'Log Aktivitas', href: '/admin/log-aktivitas', icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 12h3l3 8 4-16 3 8 4-4" /></svg>
      )
    },
  ];

  // use CSS variable set by Sidebar for consistent layout
  const currentSidebarWidth = sidebarCollapsed ? 70 : 280;

  return (
    <div className="min-h-screen">
      <Sidebar
        navItems={navItems}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        isDesktop={isDesktop}
        roleLabel="Admin Portal"
      />

      <div className="min-h-screen bg-[var(--page-bg,#F0F9FA)] relative z-10" style={{ marginLeft: 'var(--app-sidebar-width, 280px)', width: 'calc(100% - var(--app-sidebar-width, 280px))', minHeight: '100vh' }}>
        <header className="flex items-center justify-between px-6 py-6">
          <div>
            {/* page heading area: child pages will render their own headings */}
          </div>
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 rounded-md bg-white/10 text-white" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#00C4B4] flex items-center justify-center text-white font-semibold">AD</div>
            </div>
          </div>
        </header>

        <main className="p-6 max-w-7xl mx-auto">{children}</main>

        <footer className="text-center text-sm text-gray-400 py-6">© 2025 E-LOA. All rights reserved.</footer>
      </div>
    </div>
  );
}

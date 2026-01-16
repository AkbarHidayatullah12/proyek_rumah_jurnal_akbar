'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/app/components/Sidebar';
import Footer from '@/app/components/Footer';
import { getToken } from '@/lib/auth';
import { decodeToken } from '@/lib/jwt';
import { useRouter, usePathname } from 'next/navigation';

type NavItem = { label: string; icon: React.ReactNode; href?: string; active?: boolean; exact?: boolean; };

export default function EditorLayout({ children }: { children: React.ReactNode }) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(true);
    const [userName, setUserName] = useState('Editor');
    const router = useRouter();
    const currentPath = usePathname();

    useEffect(() => {
        // 1. Check Auth & Role
        const token = getToken();
        if (!token) {
            router.push('/login');
            return;
        }

        const decoded: any = decodeToken(token);
        if (!decoded || decoded.role !== 'editor') {
            router.push('/login');
            return;
        }

        if (decoded.name) setUserName(decoded.name);

    }, []);

    useEffect(() => {
        const mq = window.matchMedia('(min-width: 768px)');
        const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
        setIsDesktop(mq.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    const navItems: NavItem[] = [
        {
            label: 'Dashboard', href: '/editor', exact: true, icon: (
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 11.5 12 4l9 7.5" />
                    <path d="M5 10.5v9.5h5v-5h4v5h5v-9.5" />
                </svg>
            )
        },
        {
            label: 'Manajemen Artikel', href: '/editor/manajemen-artikel', icon: (
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
            )
        },
        {
            label: 'Antrian Persetujuan', href: '/editor/antrian-persetujuan', icon: (
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 11l3 3L22 4"></path>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
            )
        },
        {
            label: 'Profile', href: '/editor/profile', icon: (
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            )
        },
    ].map(item => ({ ...item, active: currentPath === item.href }));

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    return (
        <div className="min-h-screen relative bg-[var(--page-bg,#F0F9FA)]">
            <Sidebar
                navItems={navItems}
                sidebarCollapsed={sidebarCollapsed}
                setSidebarCollapsed={setSidebarCollapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
                isDesktop={isDesktop}
                roleLabel="Editor Portal"
            />

            <div
                className="min-h-screen relative z-10 transition-all duration-300 ease-in-out"
                style={{
                    marginLeft: isDesktop ? (sidebarCollapsed ? '70px' : '280px') : '0',
                    width: isDesktop ? `calc(100% - ${sidebarCollapsed ? '70px' : '280px'})` : '100%'
                }}
            >
                <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden p-2 rounded-lg bg-gray-100 text-gray-600" onClick={() => setMobileOpen(true)}>
                            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800 hidden md:block">{navItems.find(i => i.active)?.label || 'Dashboard'}</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-gray-700">{userName}</p>
                            <p className="text-xs text-gray-500">Editor</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#E0F7F6] border-2 border-white shadow-sm flex items-center justify-center text-[#00BDBB] font-bold">
                            {getInitials(userName)}
                        </div>
                    </div>
                </header>

                <main className="p-6 max-w-[1600px] mx-auto">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
}

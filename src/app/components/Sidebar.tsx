'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { removeToken } from '@/lib/auth';
import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

type NavItem = {
  label: string;
  icon: ReactNode;
  href?: string;
  active?: boolean;
  exact?: boolean;
};

type Props = {
  navItems: NavItem[];
  sidebarCollapsed: boolean;
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDesktop: boolean;
  roleLabel?: string;
  /** customize expanded width in px (default 280) */
  expandedWidth?: number;
  /** customize collapsed width in px (default 70) */
  collapsedWidth?: number;
  /** center the logo/header area */
  centerHeader?: boolean;
  /** hide role label (sub-title) */
  showRoleLabel?: boolean;
};

export default function Sidebar({ navItems, sidebarCollapsed, setSidebarCollapsed, mobileOpen, setMobileOpen, isDesktop, roleLabel = 'Portal', expandedWidth = 280, collapsedWidth = 70, centerHeader = false, showRoleLabel = true }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const SIDEBAR_EXPANDED_WIDTH = expandedWidth;
  const SIDEBAR_COLLAPSED_WIDTH = collapsedWidth;
  const sidebarWidth = sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH;

  // expose a CSS variable so pages can sync their left margin without risking mismatches
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.style.setProperty('--app-sidebar-width', `${sidebarWidth}px`);
      return () => {
        root.style.removeProperty('--app-sidebar-width');
      };
    }
  }, [sidebarWidth]);

  // ref for mobile drawer to manage focus trapping
  const drawerRef = useRef<HTMLElement | null>(null);

  // Close on Escape and trap focus inside drawer when open on mobile
  useEffect(() => {
    if (!mobileOpen || isDesktop) return;

    const node = drawerRef.current;
    const focusable = node
      ? Array.from(node.querySelectorAll<HTMLElement>("a, button, input, [tabindex]:not([tabindex='-1'])"))
      : [];

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
      }

      if (e.key === 'Tab') {
        if (!focusable.length) return;
        if (e.shiftKey) {
          // shift + tab
          if (document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKey);
    // focus the first element
    first?.focus();

    return () => document.removeEventListener('keydown', handleKey);
  }, [mobileOpen, isDesktop, setMobileOpen]);

  // Ensure mobile drawer is closed when viewport is desktop-sized (more robust than relying on parent)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = (e: MediaQueryListEvent) => { if (e.matches) setMobileOpen(false); };
    // close immediately on mount if already desktop
    if (mq.matches) setMobileOpen(false);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [setMobileOpen]);

  // Close mobile drawer when route changes (so it doesn't stay open after navigation)
  useEffect(() => {
    if (!pathname) return;
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  // Lock body scroll when mobile drawer is open to avoid background scroll
  useEffect(() => {
    const prev = typeof document !== 'undefined' ? document.body.style.overflow : '';
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = prev || '';
    }

    return () => {
      if (typeof document !== 'undefined') document.body.style.overflow = prev || '';
    };
  }, [mobileOpen]);

  const handleLogout = () => {
    removeToken();
    router.push('/login');
    // close mobile drawer when logging out
    setMobileOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        role="navigation"
        aria-label={`${roleLabel} sidebar`}
        className={`hidden md:flex md:fixed md:top-0 md:left-0 md:h-screen flex-col justify-between text-white px-6 py-6 z-40 transition-all duration-200 ease-in-out`}
        style={{ width: sidebarWidth, background: 'linear-gradient(180deg, #00C4B4 0%, #00A89D 100%)' }}
      >
        <div>
          <button
            type="button"
            onClick={() => setSidebarCollapsed(prev => !prev)}
            className="hidden md:inline-flex w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 items-center justify-center transition-all duration-200"
            aria-label="Toggle sidebar"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          </button>

          <div className={`mt-10 flex flex-col ${sidebarCollapsed ? 'items-center' : (centerHeader ? 'items-center' : 'items-start')}`}>
            <div className={`flex items-center gap-3 ${centerHeader ? 'justify-center w-full' : ''}`}>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-[18px] font-bold tracking-wide text-white">
                {/* Shield-like simple icon */}
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l7 4v6c0 5-3.6 9.7-7 11-3.4-1.3-7-6-7-11V6l7-4z" />
                </svg>
              </div>
              {!sidebarCollapsed && (
                <div className="leading-tight">
                  <div className="text-[18px] font-semibold">E-LOA</div>
                  {showRoleLabel && <div className="text-[12px] text-white/70">{roleLabel}</div>}
                </div>
              )}
            </div>

            <nav className="w-full mt-8 space-y-2">
              {navItems.map((item) => {
                const active = item.active !== undefined ? item.active : (item.href && pathname && (item.exact ? pathname === item.href : pathname.startsWith(item.href)));
                return item.href ? (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`w-full flex items-center gap-3 py-3 rounded-lg px-4 transition-all duration-200 text-sm ${sidebarCollapsed ? 'justify-center' : ''} ${active ? 'bg-white text-[#00C4B4] font-semibold' : 'text-white/80 hover:bg-white/10'
                      }`}
                    aria-current={active ? 'page' : undefined}
                  >
                    <span className={`${active ? 'text-[#00C4B4]' : 'text-white/80'} transition-colors duration-200`}>{item.icon}</span>
                    {!sidebarCollapsed && <span className={`${active ? 'text-[#00C4B4]' : 'text-white/95'} text-[13px]`}>{item.label}</span>}
                  </Link>
                ) : (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => { /* placeholder for navigation action */ }}
                    className={`w-full flex items-center gap-3 py-3 rounded-lg px-4 transition-all duration-200 text-sm ${sidebarCollapsed ? 'justify-center' : ''} ${active ? 'bg-white text-[#00C4B4] font-semibold' : 'text-white/80 hover:bg-white/10'
                      }`}
                    aria-current={active ? 'page' : undefined}
                  >
                    <span className={`${active ? 'text-[#00C4B4]' : 'text-white/80'} transition-colors duration-200`}>{item.icon}</span>
                    {!sidebarCollapsed && <span className={`${active ? 'text-[#00C4B4]' : 'text-white/95'} text-[13px]`}>{item.label}</span>}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="pt-6 border-t border-white/15">
          <button
            type="button"
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 text-[13px] transition-all duration-200 ${sidebarCollapsed ? 'justify-center' : 'justify-start'} hover:text-white/80`}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6h8v12H9" />
              <path d="M5 12h8" />
              <path d="M5 8v8" />
            </svg>
            {!sidebarCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar (drawer) */}
      {mobileOpen && !isDesktop && (
        <>
          <div className="fixed inset-0 z-50 bg-black/40 md:hidden pointer-events-auto" onClick={() => setMobileOpen(false)} />
          <aside ref={drawerRef} role="dialog" aria-modal="true" aria-label={`${roleLabel} menu`} className="fixed top-0 left-0 z-60 w-60 h-screen bg-[#00BDBB] text-white p-6 md:hidden transform translate-x-0 transition-transform">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-[18px] font-semibold tracking-wide">E</div>
                <div>
                  <div className="text-[18px] font-semibold">E-LOA</div>
                  <div className="text-[12px] text-white/70">{roleLabel}</div>
                </div>
              </div>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-md">×</button>
            </div>

            <nav role="navigation" aria-label={`${roleLabel} navigation`} className="space-y-2">
              {navItems.map((item) => (
                item.href ? (
                  <Link key={item.label} href={item.href} onClick={() => setMobileOpen(false)} className={`w-full flex items-center gap-3 h-11 rounded-2xl px-3 transition-all duration-200 text-sm ${item.active ? 'bg-white text-[#00BDBB] font-semibold' : 'text-white hover:bg-white/10'}`}>
                    <span className="text-white/90">{item.icon}</span>
                    <span className="text-[13px]">{item.label}</span>
                  </Link>
                ) : (
                  <button key={item.label} type="button" onClick={() => setMobileOpen(false)} className={`w-full flex items-center gap-3 h-11 rounded-2xl px-3 transition-all duration-200 text-sm ${item.active ? 'bg-white text-[#00BDBB] font-semibold' : 'text-white hover:bg-white/10'}`}>
                    <span className="text-white/90">{item.icon}</span>
                    <span className="text-[13px]">{item.label}</span>
                  </button>
                )
              ))}
            </nav>

            <div className="pt-6 border-t border-white/15 mt-6">
              <button type="button" onClick={handleLogout} className="w-full flex items-center gap-3 text-[13px] justify-start hover:text-white/80">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 6h8v12H9" />
                  <path d="M5 12h8" />
                  <path d="M5 8v8" />
                </svg>
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  );
}

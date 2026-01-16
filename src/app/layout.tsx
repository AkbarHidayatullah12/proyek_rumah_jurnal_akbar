import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'E-LOA Rumah Jurnal',
  description: 'Admin Portal Sistem E-LOA',
};

import { ToastProvider } from '@/app/components/ToastProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <ToastProvider>
          {/* server-rendered full-viewport background to avoid CSS class hydration differences */}
          <div className="fixed inset-0 z-0 bg-[var(--page-bg,#F0F9FA)]" />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}

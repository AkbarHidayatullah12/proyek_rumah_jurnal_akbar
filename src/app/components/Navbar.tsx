"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/author", label: "Ajukan LOA" },
  { href: "/author/daftar-loa", label: "Daftar LOA" },
  { href: "/tentang", label: "Tentang" },
  { href: "/kontak", label: "Kontak" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="w-full sticky top-0 z-40" style={{ backgroundColor: "var(--brand-teal)" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="relative w-8 h-8 rounded-md overflow-hidden bg-white/20 flex items-center justify-center">
            <Image src="/eloa-logo.png" alt="E-LOA" width={32} height={32} className="object-contain" />
          </div>
          <span className="font-semibold tracking-tight text-base text-white">Rumah Jurnal</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-1.5">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm transition-colors text-white ${
                  active
                    ? "bg-white/25 font-semibold"
                    : "hover:bg-white/15"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden sm:flex items-center gap-2">
          <Link
            href="/login"
            className="inline-flex items-center justify-center h-10 px-4 rounded-md text-sm font-medium text-white border border-white/50 hover:bg-white/10"
          >
            Login
          </Link>
          <Link
            href="/author"
            className="inline-flex items-center justify-center h-10 px-4 rounded-md text-sm font-medium text-white"
            style={{ backgroundColor: "var(--brand-primary)" }}
          >
            Ajukan LOA Sekarang
          </Link>
        </div>
      </div>
    </header>
  );
}




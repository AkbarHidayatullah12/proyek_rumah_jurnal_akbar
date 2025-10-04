import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-14" style={{ backgroundColor: "var(--brand-teal)" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 text-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-white">
        <p className="opacity-90">
          © {new Date().getFullYear()} Rumah Jurnal. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/" className="hover:underline">Beranda</Link>
          <Link href="/loa" className="hover:underline">Daftar LOA</Link>
          <Link href="/loa/new" className="hover:underline">Buat LOA</Link>
        </div>
      </div>
    </footer>
  );
}




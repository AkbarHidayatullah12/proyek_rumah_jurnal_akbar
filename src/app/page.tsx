import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans bg-white">
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-16">
        <section className="rounded-3xl bg-white border border-black/[.06] shadow-lg overflow-hidden">
          <div className="relative w-full h-44 sm:h-60 md:h-72" style={{ backgroundImage: "url('/banner-pgm.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.28) 45%, rgba(0,0,0,0.0) 100%)" }} />
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white shadow-xl flex items-center justify-center overflow-hidden">
              <Image src="/eloa-logo.png" alt="Logo" width={80} height={80} className="object-contain" />
            </div>
          </div>

          <div className="p-6 sm:p-10 pt-12">
            <div className="max-w-3xl mx-auto text-center space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-black leading-tight">
                Sistem Informasi E-LOA
              </h1>
              <p className="text-base sm:text-lg text-black/70">
                Rumah Jurnal — Letter of Acceptance
              </p>
            </div>

            <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              <Link href="/loa/new" className="inline-flex items-center justify-center h-11 rounded-lg bg-[#6E63FF] text-white font-medium hover:brightness-110 transition-all">
                Buat LOA Baru
              </Link>
              <Link href="/loa" className="inline-flex items-center justify-center h-11 rounded-lg border border-black/[.08] dark:border-white/[.145] hover:bg-black/[.04] dark:hover:bg-white/[.06] font-medium transition-colors">
                Lihat Daftar LOA
              </Link>
            </div>

            <p className="text-xs text-center text-black/60 mt-4">
              Tip: Ganti banner di <code className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/10">public/banner-pgm.jpg</code>.
            </p>
          </div>
        </section>

        <section className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: "var(--brand-teal)" }}>
              <span className="text-white text-lg">⚡</span>
            </div>
            <h3 className="font-semibold mb-1">Cepat dan Mudah</h3>
            <p className="text-sm text-black/70">Buat LOA dalam hitungan menit dengan alur sederhana.</p>
          </div>
          <div className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: "var(--brand-teal)" }}>
              <span className="text-white text-lg">📦</span>
            </div>
            <h3 className="font-semibold mb-1">Terpusat</h3>
            <p className="text-sm text-black/70">Semua LOA tersimpan rapi dan mudah dicari kembali.</p>
          </div>
          <div className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: "var(--brand-teal)" }}>
              <span className="text-white text-lg">🔗</span>
            </div>
            <h3 className="font-semibold mb-1">Terintegrasi</h3>
            <p className="text-sm text-black/70">Siap diintegrasikan dengan modul Rumah Jurnal lainnya.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

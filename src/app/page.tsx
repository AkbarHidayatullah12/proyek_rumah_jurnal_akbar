import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans bg-white">
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Hero Section */}
        <section className="rounded-3xl bg-white border border-black/[.06] shadow-lg overflow-hidden relative" style={{ backgroundImage: "url('/buku.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
          {/* Overlay sederhana */}
          <div className="absolute inset-0 bg-black/40"></div>
          
          <div className="relative w-full h-44 sm:h-60 md:h-72">
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white shadow-xl flex items-center justify-center overflow-hidden z-10">
              <Image src="/eloa-logo.png" alt="Logo" width={100} height={100} className="object-contain" />
            </div>
          </div>

          <div className="relative p-8 sm:p-12 pt-16 z-10">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-lg">
                Sistem E-LOA Rumah Jurnal
              </h1>
              <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                Platform digital untuk mempermudah pengajuan dan penerbitan Letter of Acceptance (LOA) secara cepat dan terintegrasi.
              </p>
            </div>

            <div className="max-w-2xl mx-auto mt-10 text-center">
              <Link href="/author" className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-[#6E63FF] text-white font-medium hover:brightness-110 transition-all text-lg shadow-lg">
                Mulai Sekarang
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4">Fitur Unggulan</h2>
            <p className="text-black/70 max-w-2xl mx-auto">Solusi lengkap untuk pengelolaan Letter of Acceptance yang efisien dan terintegrasi</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: "var(--brand-teal)" }}>
                <span className="text-white text-xl">💡</span>
              </div>
              <h3 className="font-semibold mb-2 text-lg text-black">Pengajuan LOA Online</h3>
              <p className="text-sm text-gray-600">Ajukan Letter of Acceptance secara online dengan proses yang mudah dan cepat.</p>
            </div>
            
            <div className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: "var(--brand-teal)" }}>
                <span className="text-white text-xl">🧾</span>
              </div>
              <h3 className="font-semibold mb-2 text-lg text-black">Penerbitan Otomatis PDF + QR Code</h3>
              <p className="text-sm text-gray-600">Generate dokumen LOA dalam format PDF dengan QR Code untuk verifikasi otomatis.</p>
            </div>
            
            <div className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: "var(--brand-teal)" }}>
                <span className="text-white text-xl">🔒</span>
              </div>
              <h3 className="font-semibold mb-2 text-lg text-black">Verifikasi Aman oleh Admin & Editor</h3>
              <p className="text-sm text-gray-600">Sistem verifikasi berlapis dengan kontrol admin dan editor untuk keamanan maksimal.</p>
            </div>
            
            <div className="rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: "var(--brand-teal)" }}>
                <span className="text-white text-xl">📈</span>
              </div>
              <h3 className="font-semibold mb-2 text-lg text-black">Laporan dan Riwayat Pengajuan</h3>
              <p className="text-sm text-gray-600">Pantau status pengajuan dan akses riwayat lengkap dengan laporan terperinci.</p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="mt-20 mb-0">
          <div className="rounded-2xl border border-black/[.06] bg-white p-8 sm:p-12 shadow-sm">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-black mb-6">Tentang Rumah Jurnal</h2>
              <div className="space-y-4 text-black/70 leading-relaxed">
                <p className="text-lg">
                  Rumah Jurnal adalah platform terdepan dalam dunia publikasi akademik Indonesia, 
                  yang berkomitmen untuk memajukan penelitian dan pengembangan ilmu pengetahuan 
                  melalui sistem publikasi yang transparan dan berkualitas.
                </p>
                <p>
                  Sistem E-LOA (Letter of Acceptance) ini hadir sebagai solusi digital untuk 
                  mempermudah proses pengajuan dan penerbitan surat penerimaan artikel jurnal. 
                  Dengan teknologi terintegrasi, kami memastikan setiap tahap proses berjalan 
                  efisien, aman, dan dapat diakses kapan saja, di mana saja.
                </p>
                <p>
                  Tujuan utama E-LOA adalah memberikan kemudahan bagi peneliti, akademisi, 
                  dan institusi dalam mengelola dokumen Letter of Acceptance secara digital, 
                  mengurangi penggunaan kertas, dan mempercepat proses administrasi publikasi jurnal.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

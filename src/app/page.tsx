import Link from "next/link";
import Image from "next/image";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="font-sans antialiased bg-white text-gray-900">
      <Navbar />

      <main className="flex min-h-screen flex-col pt-20">
        {/* Hero Section */}
        <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-gray-50">
          <div className="absolute inset-0 z-0">
            <Image
              src="/buku.jpg"
              alt="Background Library"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 via-teal-800/80 to-teal-900/90 mix-blend-multiply" />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-6 animate-fade-in-up">
              🚀 Platform Publikasi Terintegrasi
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight drop-shadow-2xl max-w-5xl mx-auto">
              Sistem E-LOA <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C4B4] to-teal-200">
                Rumah Jurnal
              </span>
            </h1>
            <p className="text-lg sm:text-2xl text-gray-100 max-w-3xl mx-auto leading-relaxed mb-10 font-light opacity-95">
              Solusi digital modern untuk mempermudah penerbitan <strong>Letter of Acceptance (LOA)</strong>.
              Cepat, aman, dan terverifikasi secara otomatis.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <Link
                href="/author"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#00C4B4] hover:bg-[#00A89D] text-white font-bold text-lg shadow-xl shadow-[#00C4B4]/30 transform hover:-translate-y-1 transition-all duration-300 ring-2 ring-white/10"
              >
                Mulai Pengajuan
              </Link>
              <Link
                href="#features"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold text-lg hover:-translate-y-1 transition-all duration-300"
              >
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>

          {/* Decorational Elements */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-10"></div>
        </section>

        {/* Stats Section */}
        <section className="py-10 bg-white border-b border-gray-100 relative z-20 -mt-10 mx-4 sm:mx-8 lg:mx-20 rounded-2xl shadow-xl shadow-gray-200/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100">
            <div className="text-center p-4">
              <div className="text-3xl sm:text-4xl font-bold text-[#00C4B4] mb-1">500+</div>
              <div className="text-sm text-gray-500 font-medium">Author Terdaftar</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl sm:text-4xl font-bold text-[#00C4B4] mb-1">1.2K+</div>
              <div className="text-sm text-gray-500 font-medium">LOA Diterbitkan</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl sm:text-4xl font-bold text-[#00C4B4] mb-1">24/7</div>
              <div className="text-sm text-gray-500 font-medium">Sistem Online</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl sm:text-4xl font-bold text-[#00C4B4] mb-1">100%</div>
              <div className="text-sm text-gray-500 font-medium">Terverifikasi</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-[#00C4B4] font-semibold tracking-wider text-sm uppercase">Fitur Unggulan</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-6">Kenapa Memilih Rumah Jurnal?</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Kami menyediakan fitur lengkap untuk memastikan proses publikasi Anda berjalan lancar tanpa hambatan administrasi.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#00C4B4]/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00C4B4]/5 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:scale-110"></div>
                <div className="w-14 h-14 rounded-2xl bg-[#00C4B4]/10 flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform duration-300">
                  ⚡
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#00C4B4] transition-colors">Pengajuan Kilat</h3>
                <p className="text-gray-500 leading-relaxed">
                  Proses pengajuan yang disederhanakan. Upload dokumen, isi data, dan kirim dalam hitungan menit.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#00C4B4]/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00C4B4]/5 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:scale-110"></div>
                <div className="w-14 h-14 rounded-2xl bg-[#00C4B4]/10 flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform duration-300">
                  🔒
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#00C4B4] transition-colors">Verifikasi Aman</h3>
                <p className="text-gray-500 leading-relaxed">
                  Keamanan data terjamin dengan sistem verifikasi berlapis oleh editor dan admin terpercaya.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#00C4B4]/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00C4B4]/5 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:scale-110"></div>
                <div className="w-14 h-14 rounded-2xl bg-[#00C4B4]/10 flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform duration-300">
                  📄
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#00C4B4] transition-colors">LOA Digital Otomatis</h3>
                <p className="text-gray-500 leading-relaxed">
                  Dokumen LOA digenerate otomatis dalam format PDF lengkap dengan QR Code validasi keaslian.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#00C4B4]/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00C4B4]/5 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:scale-110"></div>
                <div className="w-14 h-14 rounded-2xl bg-[#00C4B4]/10 flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform duration-300">
                  📱
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#00C4B4] transition-colors">Akses Mobile</h3>
                <p className="text-gray-500 leading-relaxed">
                  Platform responsif yang dapat diakses dengan mudah melalui smartphone atau tablet Anda.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#00C4B4]/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00C4B4]/5 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:scale-110"></div>
                <div className="w-14 h-14 rounded-2xl bg-[#00C4B4]/10 flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform duration-300">
                  🔔
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#00C4B4] transition-colors">Notifikasi Real-time</h3>
                <p className="text-gray-500 leading-relaxed">
                  Dapatkan pembaruan status pengajuan Anda secara langsung melalui notifikasi sistem.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#00C4B4]/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00C4B4]/5 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:scale-110"></div>
                <div className="w-14 h-14 rounded-2xl bg-[#00C4B4]/10 flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform duration-300">
                  🎧
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#00C4B4] transition-colors">Support Prioritas</h3>
                <p className="text-gray-500 leading-relaxed">
                  Tim support kami siap membantu kendala Anda kapan saja untuk memastikan kepuasan pengguna.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[#00C4B4] opacity-[0.03]"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center bg-[#00C4B4] rounded-[2.5rem] p-12 sm:p-16 shadow-2xl relative overflow-hidden">
              {/* Decorational Circles */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -ml-20 -mt-20"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-900 opacity-20 rounded-full blur-3xl -mr-20 -mb-20"></div>

              <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6 leading-tight">Siap Menerbitkan Jurnal?</h2>
              <p className="text-teal-50 text-lg mb-10 max-w-2xl mx-auto">
                Jangan biarkan proses administrasi menghambat publikasi Anda. Bergabunglah dengan ratusan author lainnya hari ini.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="px-8 py-4 bg-white text-[#00C4B4] rounded-full font-bold text-lg hover:bg-gray-50 transition-colors shadow-lg"
                >
                  Buat Akun Gratis
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition-colors"
                >
                  Hubungi Sales
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 bg-white border-t border-gray-100 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-teal-50/50 skew-x-12 translate-x-32 z-0"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              {/* Image Column */}
              <div className="w-full lg:w-1/2 relative h-[500px] rounded-3xl overflow-hidden shadow-2xl group">
                <Image
                  src="/buku.jpg"
                  alt="About Rumah Jurnal"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-900/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8 text-white max-w-sm">
                  <p className="font-bold text-xl mb-2">Visi Kami</p>
                  <p className="text-sm opacity-90 leading-relaxed">Menjadi platform publikasi akademik terdepan yang menjembatani kesenjangan antara peneliti dan penerbit melalui teknologi.</p>
                </div>
              </div>

              {/* Content Column */}
              <div className="w-full lg:w-1/2">
                <span className="text-[#00C4B4] font-bold tracking-widest text-sm uppercase mb-4 block">Tentang Kami</span>
                <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                  Mewujudkan Ekosistem <br />
                  <span className="text-[#00C4B4]">Publikasi Modern</span>
                </h2>

                <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                  <p>
                    <strong>Rumah Jurnal</strong> adalah inisiatif strategis dari Pustaka Galeri Mandiri untuk memodernisasi infrastruktur publikasi akademik di Indonesia. Kami memahami bahwa proses administratif seringkali menjadi hambatan utama dalam penyebaran ilmu pengetahuan.
                  </p>
                  <p>
                    Sistem E-LOA kami dirancang khusus untuk mempercepat penerbitan <em>Letter of Acceptance</em>, memberikan kepastian kepada penulis, dan memudahkan pengelola jurnal dalam memvalidasi naskah.
                  </p>
                  <p>
                    Dengan teknologi terintegrasi dan keamanan tingkat tinggi, kami berkomitmen untuk menciptakan standar baru dalam manajemen publikasi yang transparan, akuntabel, dan efisien.
                  </p>
                </div>

                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-teal-50 transition-colors border border-transparent hover:border-teal-100">
                    <div className="w-10 h-10 rounded-full bg-[#00C4B4] flex items-center justify-center text-white text-xl shrink-0 shadow-lg shadow-teal-200">🎯</div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Misi Kami</h4>
                      <p className="text-sm text-gray-500">Mempermudah birokrasi publikasi untuk kemajuan riset.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-teal-50 transition-colors border border-transparent hover:border-teal-100">
                    <div className="w-10 h-10 rounded-full bg-[#00C4B4] flex items-center justify-center text-white text-xl shrink-0 shadow-lg shadow-teal-200">🤝</div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Nilai Utama</h4>
                      <p className="text-sm text-gray-500">Integritas, Kecepatan, dan Kolaborasi.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

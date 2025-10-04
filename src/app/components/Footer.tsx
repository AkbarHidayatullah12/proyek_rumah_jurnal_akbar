import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-0" style={{ backgroundColor: "var(--brand-teal)" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div className="text-white">
            <h3 className="font-semibold text-lg mb-4">Rumah Jurnal</h3>
            <p className="text-sm opacity-90 mb-4">
              Platform terdepan dalam dunia publikasi akademik Indonesia, 
              berkomitmen memajukan penelitian dan pengembangan ilmu pengetahuan.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-white">
            <h3 className="font-semibold text-lg mb-4">Menu</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-sm opacity-90 hover:opacity-100 transition-opacity">Home</Link>
              <Link href="/tentang" className="block text-sm opacity-90 hover:opacity-100 transition-opacity">Tentang</Link>
              <Link href="/kontak" className="block text-sm opacity-90 hover:opacity-100 transition-opacity">Kontak</Link>
              <Link href="/login" className="block text-sm opacity-90 hover:opacity-100 transition-opacity">Login</Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="text-white">
            <h3 className="font-semibold text-lg mb-4">Kontak</h3>
            <div className="space-y-2 text-sm opacity-90">
              <div className="flex items-center gap-2">
                <span>📧</span>
                <span>info@rumahjurnal.com</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📱</span>
                <span>+62 812-3456-7890</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🌐</span>
                <span>www.rumahjurnal.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white">
          <p className="opacity-90">
            © {new Date().getFullYear()} Rumah Jurnal. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:underline opacity-90 hover:opacity-100">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline opacity-90 hover:opacity-100">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}




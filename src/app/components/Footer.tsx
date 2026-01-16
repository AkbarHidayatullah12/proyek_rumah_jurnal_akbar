import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 text-white border-t border-gray-800 pt-16 pb-8 relative z-10" style={{ backgroundColor: '#0f172a' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <div className="relative w-10 h-10 overflow-hidden rounded-lg">
                                <Image
                                    src="/eloa-logo.png"
                                    alt="Logo Rumah Jurnal"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-poppins font-bold text-lg leading-none text-white">Rumah Jurnal</span>
                                <span className="font-poppins text-xs text-[#00C4B4] font-medium tracking-wide">E-LOA System</span>
                            </div>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Platform digital terpercaya untuk pengelolaan dan penerbitan Letter of Acceptance (LOA) jurnal akademik secara efisien.
                        </p>
                        <div className="flex gap-4">
                            {/* Social Icons Placeholder */}
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Navigasi</h4>
                        <ul className="space-y-3">
                            <li><Link href="/" className="text-gray-400 hover:text-[#00C4B4] transition-colors text-sm">Beranda</Link></li>
                            <li><Link href="#features" className="text-gray-400 hover:text-[#00C4B4] transition-colors text-sm">Fitur Unggulan</Link></li>
                            <li><Link href="#about" className="text-gray-400 hover:text-[#00C4B4] transition-colors text-sm">Tentang Kami</Link></li>
                            <li><Link href="/author" className="text-gray-400 hover:text-[#00C4B4] transition-colors text-sm">Dashboard Author</Link></li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Bantuan</h4>
                        <ul className="space-y-3">
                            <li><Link href="#" className="text-gray-400 hover:text-[#00C4B4] transition-colors text-sm">Pusat Bantuan</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-[#00C4B4] transition-colors text-sm">Syarat & Ketentuan</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-[#00C4B4] transition-colors text-sm">Kebijakan Privasi</Link></li>
                            <li><Link href="/contact" className="text-gray-400 hover:text-[#00C4B4] transition-colors text-sm">Hubungi Kami</Link></li>
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Kontak</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm text-gray-400">
                                <span className="mt-1">📍</span>
                                <span>Jl. Pendidikan No. 1, Kampus Pusat, Gedung Rektorat Lt. 2</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-400">
                                <span>📧</span>
                                <a href="mailto:admin@rumahjurnal.id" className="hover:text-[#00C4B4] transition-colors">admin@rumahjurnal.id</a>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-400">
                                <span>📞</span>
                                <a href="tel:+6281234567890" className="hover:text-[#00C4B4] transition-colors">+62 812-3456-7890</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm text-center md:text-left">
                        © {currentYear} Rumah Jurnal Pustaka Galeri Mandiri. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <p className="text-gray-400 text-sm">Sistem Versi 1.0.0</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

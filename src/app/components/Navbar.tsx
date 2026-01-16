import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
    return (
        <nav className="fixed w-full z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="relative w-10 h-10 overflow-hidden rounded-lg">
                                <Image
                                    src="/eloa-logo.png"
                                    alt="Logo Rumah Jurnal"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-poppins font-bold text-lg leading-none text-gray-900">Rumah Jurnal</span>
                                <span className="font-poppins text-xs text-[#00C4B4] font-medium tracking-wide">E-LOA System</span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="text-gray-600 hover:text-[#00C4B4] font-medium transition-colors">
                            Beranda
                        </Link>
                        <Link href="#features" className="text-gray-600 hover:text-[#00C4B4] font-medium transition-colors">
                            Fitur
                        </Link>
                        <Link href="#about" className="text-gray-600 hover:text-[#00C4B4] font-medium transition-colors">
                            Tentang
                        </Link>
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            href="/login"
                            className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-[#00C4B4] transition-colors"
                        >
                            Masuk
                        </Link>
                        <Link
                            href="/register"
                            className="px-5 py-2.5 text-sm font-medium text-white bg-[#00C4B4] rounded-full hover:bg-[#00A89D] shadow-lg shadow-[#00C4B4]/20 transition-all hover:shadow-[#00C4B4]/40 hover:-translate-y-0.5"
                        >
                            Daftar Sekarang
                        </Link>
                    </div>

                    {/* Mobile Menu Button (Placeholder) */}
                    <div className="md:hidden flex items-center">
                        <button className="text-gray-600 focus:outline-none p-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

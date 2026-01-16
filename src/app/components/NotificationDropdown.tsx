'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

type Notification = {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    type: 'info' | 'success' | 'warning' | 'error';
    link?: string;
};

export default function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Mock Data
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            title: 'Revisi Diperlukan',
            message: 'Naskah "Analisis Dampak AI..." memerlukan revisi mayor pada bagian metodologi.',
            time: '2 jam yang lalu',
            read: false,
            type: 'warning',
            link: '/author/daftar-pengajuan/SUB-001'
        },
        {
            id: '2',
            title: 'Pengajuan Diterima',
            message: 'Selamat! Naskah "Implementasi IoT..." telah disetujui untuk publikasi.',
            time: '1 hari yang lalu',
            read: false,
            type: 'success',
            link: '/author/daftar-pengajuan/SUB-002'
        },
        {
            id: '3',
            title: 'Selamat Datang',
            message: 'Selamat datang di sistem E-LOA Rumah Jurnal. Silakan lengkapi profil Anda.',
            time: '3 hari yang lalu',
            read: true,
            type: 'info',
            link: '/author/profile'
        }
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return (
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </div>
            );
            case 'warning': return (
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                </div>
            );
            default: return (
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                </div>
            );
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors focus:outline-none"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-2xl shadow-xl ring-1 ring-black ring-opacity-5 z-50 overflow-hidden origin-top-right animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <h3 className="font-semibold text-gray-900">Notifikasi</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs font-medium text-[#00BDBB] hover:text-[#00AFAF] transition-colors"
                            >
                                Tandai semua dibaca
                            </button>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length > 0 ? (
                            <div className="divide-y divide-gray-50">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => markAsRead(notification.id)}
                                        className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3 ${!notification.read ? 'bg-blue-50/30' : ''}`}
                                    >
                                        {getIcon(notification.type)}
                                        <div className="flex-1 space-y-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className={`text-sm ${!notification.read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                                                    {notification.title}
                                                </h4>
                                                <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{notification.time}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                                                {notification.message}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                <p className="text-sm">Belum ada notifikasi baru</p>
                            </div>
                        )}
                    </div>

                    <div className="p-3 border-t border-gray-100 bg-gray-50/50 text-center">
                        <Link href="/author/notifications" className="text-xs font-medium text-gray-500 hover:text-[#00BDBB] transition-colors">
                            Lihat Semua Notifikasi
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { getToken } from '@/lib/auth';
import { useToast } from '@/app/components/ToastProvider';

type UserProfile = {
    name: string;
    email: string;
    role: string;
    institution?: string;
    phone?: string;
    avatar?: string;
    sintaId?: string;
    scopusId?: string;
    orcidId?: string;
    googleScholar?: string;
};

export default function AuthorProfilePage() {
    const { showToast } = useToast();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        institution: '',
        phone: '',
        sintaId: '',
        scopusId: '',
        orcidId: '',
        googleScholar: ''
    });

    // For Avatar Preview
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = getToken();
            const headers: Record<string, string> = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch('/api/profile', { headers });
            if (!res.ok) throw new Error('Failed to fetch profile');
            const data = await res.json();
            const userData = data.profile;

            setUser(userData);
            setFormData({
                name: userData.name || '',
                email: userData.email || '',
                institution: userData.institution || '',
                phone: userData.phone || '',
                sintaId: userData.sintaId || '',
                scopusId: userData.scopusId || '',
                orcidId: userData.orcidId || '',
                googleScholar: userData.googleScholar || ''
            });
            setAvatarPreview(userData.avatar || null);
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarClick = () => {
        if (isEditing) {
            fileInputRef.current?.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const token = getToken();
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const body = {
                ...formData,
                avatar: avatarPreview
            };

            const res = await fetch('/api/profile', {
                method: 'PATCH',
                headers,
                body: JSON.stringify(body)
            });

            if (!res.ok) throw new Error('Failed to update profile');

            // Update local user state
            if (user) {
                setUser({ ...user, ...formData, avatar: avatarPreview || user.avatar });
            }
            showToast('Profil berhasil diperbarui!', 'success');
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving profile:', error);
            showToast('Gagal menyimpan profil', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                institution: user.institution || '',
                phone: user.phone || '',
                sintaId: user.sintaId || '',
                scopusId: user.scopusId || '',
                orcidId: user.orcidId || '',
                googleScholar: user.googleScholar || ''
            });
            setAvatarPreview(user.avatar || null);
        }
        setIsEditing(false);
    };

    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#00BDBB] border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">

            {/* Header / Cover */}
            <div className="relative rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-[#005f59] to-[#008f85] relative">
                    <div className="absolute inset-0 bg-white/5 pattern-dots"></div>
                </div>
                <div className="px-8 pb-8">
                    <div className="relative flex items-end -mt-12 mb-4">
                        <div className="relative group">
                            <div
                                onClick={handleAvatarClick}
                                className={`w-28 h-28 rounded-full bg-white p-1.5 shadow-md overflow-hidden relative
                                          ${isEditing ? 'cursor-pointer hover:ring-4 hover:ring-[#00BDBB]/30 transition-all' : ''}`}
                            >
                                <div className="w-full h-full rounded-full bg-[#E0F7F6] flex items-center justify-center overflow-hidden relative">
                                    {(avatarPreview || user?.avatar) ? (
                                        <img src={avatarPreview || user?.avatar} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-[#008f85] font-bold text-3xl">
                                            {user && getInitials(user.name)}
                                        </div>
                                    )}

                                    {/* Edit Overlay */}
                                    {isEditing && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>

                        <div className="ml-5 mb-2">
                            <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                            <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                <span>{user?.role}</span>
                                <span>•</span>
                                <span>{user?.institution}</span>
                            </div>
                        </div>
                        <div className="ml-auto mb-2">
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-5 py-2.5 bg-[#00BDBB] hover:bg-[#00AFAF] text-white rounded-xl text-sm font-semibold transition shadow-sm flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                    Edit Profil
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleCancel}
                                        className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-semibold transition"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="px-5 py-2.5 bg-[#00BDBB] hover:bg-[#00AFAF] text-white rounded-xl text-sm font-semibold transition shadow-sm flex items-center gap-2"
                                    >
                                        {isSaving ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Menyimpan...
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                Simpan
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="md:col-span-2 space-y-6">
                    {/* Identity Card */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-50 pb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00BDBB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Informasi Pribadi
                        </h2>
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                        className={`w-full px-4 py-2.5 rounded-xl border ${isEditing ? 'bg-white border-gray-300 focus:border-[#00BDBB] focus:ring-2 focus:ring-[#00BDBB]/20' : 'bg-gray-50 border-transparent'} text-gray-900 font-medium transition-all`}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                        className={`w-full px-4 py-2.5 rounded-xl border ${isEditing ? 'bg-white border-gray-300 focus:border-[#00BDBB] focus:ring-2 focus:ring-[#00BDBB]/20' : 'bg-gray-50 border-transparent'} text-gray-900 font-medium transition-all`}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Institusi / Afiliasi</label>
                                    <input
                                        type="text"
                                        name="institution"
                                        value={formData.institution}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                        className={`w-full px-4 py-2.5 rounded-xl border ${isEditing ? 'bg-white border-gray-300 focus:border-[#00BDBB] focus:ring-2 focus:ring-[#00BDBB]/20' : 'bg-gray-50 border-transparent'} text-gray-900 font-medium transition-all`}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nomor Telepon</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                        className={`w-full px-4 py-2.5 rounded-xl border ${isEditing ? 'bg-white border-gray-300 focus:border-[#00BDBB] focus:ring-2 focus:ring-[#00BDBB]/20' : 'bg-gray-50 border-transparent'} text-gray-900 font-medium transition-all`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Academic Info Card */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-50 pb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00BDBB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Identitas Akademik
                        </h2>
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">ID SINTA</label>
                                    <input
                                        type="text"
                                        name="sintaId"
                                        value={formData.sintaId}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                        className={`w-full px-4 py-2.5 rounded-xl border ${isEditing ? 'bg-white border-gray-300 focus:border-[#00BDBB] focus:ring-2 focus:ring-[#00BDBB]/20' : 'bg-gray-50 border-transparent'} text-gray-900 font-medium transition-all`}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">ID Scopus</label>
                                    <input
                                        type="text"
                                        name="scopusId"
                                        value={formData.scopusId}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                        className={`w-full px-4 py-2.5 rounded-xl border ${isEditing ? 'bg-white border-gray-300 focus:border-[#00BDBB] focus:ring-2 focus:ring-[#00BDBB]/20' : 'bg-gray-50 border-transparent'} text-gray-900 font-medium transition-all`}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">ID ORCID</label>
                                    <input
                                        type="text"
                                        name="orcidId"
                                        value={formData.orcidId}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                        className={`w-full px-4 py-2.5 rounded-xl border ${isEditing ? 'bg-white border-gray-300 focus:border-[#00BDBB] focus:ring-2 focus:ring-[#00BDBB]/20' : 'bg-gray-50 border-transparent'} text-gray-900 font-medium transition-all`}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Link Google Scholar</label>
                                    <input
                                        type="url"
                                        name="googleScholar"
                                        value={formData.googleScholar}
                                        placeholder="https://scholar.google.com/..."
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                        className={`w-full px-4 py-2.5 rounded-xl border ${isEditing ? 'bg-white border-gray-300 focus:border-[#00BDBB] focus:ring-2 focus:ring-[#00BDBB]/20' : 'bg-gray-50 border-transparent'} text-gray-900 font-medium transition-all`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security / Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Keamanan
                        </h2>
                        <div className="space-y-4">
                            <button className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition group">
                                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Ganti Password</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <div className="pt-4 border-t border-gray-100">
                                <p className="text-xs text-gray-500 mb-2">Login terakhir: 23 Dec 2025, 10:45</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
                        <h3 className="text-sm font-bold text-blue-800 mb-2">Butuh Bantuan?</h3>
                        <p className="text-xs text-blue-600 mb-4">Jika ada data yang salah namun tidak bisa diubah, silakan hubungi admin.</p>
                        <button className="text-xs font-semibold text-blue-700 hover:underline">Hubungi Admin →</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

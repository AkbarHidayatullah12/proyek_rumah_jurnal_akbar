'use client';

import { useState, useEffect } from 'react';
import { getToken } from '@/lib/auth';

type UserProfile = {
   name: string;
   email: string;
   role: string;
   institution?: string;
   phone?: string;
   specialization?: string;
};

export default function EditorProfilePage() {
   const [user, setUser] = useState<UserProfile | null>(null);
   const [isLoading, setIsLoading] = useState(true);

   // Form states
   const [formData, setFormData] = useState({
      name: '',
      email: '',
      institution: '',
      phone: '',
      specialization: ''
   });

   useEffect(() => {
      // Simulate fetching user data
      const token = getToken();
      if (token) {
         // Mock data for Editor
         setTimeout(() => {
            const mockUser = {
               name: 'Dr. Siti Nurjanah',
               email: 'siti.nurjanah@university.ac.id',
               role: 'Editor',
               institution: 'Universitas Indonesia',
               phone: '081298765432',
               specialization: 'Teknologi Pendidikan & AI'
            };
            setUser(mockUser);
            setFormData(mockUser);
            setIsLoading(false);
         }, 500);
      }
   }, []);

   const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

   if (isLoading) {
      return (
         <div className="flex h-[50vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#00BDBB] border-t-transparent"></div>
         </div>
      );
   }

   return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

         {/* Header / Cover */}
         <div className="relative rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-[#005f59] to-[#008f85]"></div>
            <div className="px-8 pb-8">
               <div className="relative flex items-end -mt-12 mb-4">
                  <div className="w-24 h-24 rounded-full bg-white p-1 text-[#008f85] font-bold text-3xl flex items-center justify-center shadow-md">
                     <div className="w-full h-full rounded-full bg-[#E0F7F6] flex items-center justify-center">
                        {user && getInitials(user.name)}
                     </div>
                  </div>
                  <div className="ml-4 mb-1">
                     <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                     <div className="flex items-center gap-2 text-gray-600">
                        <span className="bg-teal-100 text-teal-800 text-xs px-2 py-0.5 rounded-full font-semibold border border-teal-200">{user?.role}</span>
                        <span>•</span>
                        <span>{user?.institution}</span>
                     </div>
                  </div>
                  <div className="ml-auto mb-1">
                     <button className="px-4 py-2 bg-[#00BDBB] hover:bg-[#00AFAF] text-white rounded-lg text-sm font-semibold transition shadow-sm">
                        Edit Profil
                     </button>
                  </div>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="md:col-span-2 space-y-6">
               <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                     </svg>
                     Informasi Pribadi
                  </h2>
                  <div className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
                           <input type="text" value={formData.name} readOnly className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#00BDBB]/20 transition cursor-default" />
                        </div>
                        <div className="space-y-1">
                           <label className="text-sm font-medium text-gray-700">Email</label>
                           <input type="email" value={formData.email} readOnly className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#00BDBB]/20 transition cursor-default" />
                        </div>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <label className="text-sm font-medium text-gray-700">Institusi / Afiliasi</label>
                           <input type="text" value={formData.institution} readOnly className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#00BDBB]/20 transition cursor-default" />
                        </div>
                        <div className="space-y-1">
                           <label className="text-sm font-medium text-gray-700">Nomor Telepon</label>
                           <input type="tel" value={formData.phone} readOnly className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#00BDBB]/20 transition cursor-default" />
                        </div>
                     </div>
                     <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Bidang Keahlian</label>
                        <input type="text" value={formData.specialization} readOnly className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#00BDBB]/20 transition cursor-default" />
                     </div>
                  </div>
               </div>
            </div>

            {/* Security / Sidebar */}
            <div className="space-y-6">
               <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                     </svg>
                     Keamanan Akun
                  </h2>
                  <div className="space-y-4">
                     <button className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition group border border-transparent hover:border-gray-200">
                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Ganti Password</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 group-hover:text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                     </button>
                     <button className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition group border border-transparent hover:border-gray-200">
                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Log Aktivitas</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 group-hover:text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                     </button>
                     <div className="pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-2">Terakhir login: 23 Feb 2025, 08:30</p>
                     </div>
                  </div>
               </div>

               <div className="bg-[#E0F7F6] rounded-2xl border border-teal-100 p-6">
                  <h3 className="text-sm font-bold text-teal-800 mb-2">Status Editor</h3>
                  <div className="flex items-center gap-2 mb-4">
                     <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                     <span className="text-sm text-teal-700 font-medium">Aktif</span>
                  </div>
                  <p className="text-xs text-teal-600 leading-relaxed">
                     Akun Anda memiliki akses penuh untuk meninjau dan memvalidasi naskah yang masuk.
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
}

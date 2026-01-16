'use client';

import { useState, useEffect } from 'react';

type Log = {
    id: number;
    user_name: string;
    role: string;
    action: string;
    details: string;
    created_at: string;
};

export default function ActivityLogPage() {
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [filterAction, setFilterAction] = useState('');

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await fetch('/api/logs?limit=100');
                const data = await res.json();
                setLogs(data.logs || []);
            } catch (error) {
                console.error('Failed to fetch logs', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    const getActionColor = (action: string) => {
        switch (action.toUpperCase()) {
            case 'LOGIN': return 'bg-blue-100 text-blue-700';
            case 'SUBMIT': return 'bg-green-100 text-green-700';
            case 'REVIEW': return 'bg-purple-100 text-purple-700';
            case 'REVISE': return 'bg-amber-100 text-amber-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const filteredLogs = logs.filter(log => {
        const matchesSearch = (log.user_name || '').toLowerCase().includes(search.toLowerCase()) ||
            (log.details || '').toLowerCase().includes(search.toLowerCase());
        const matchesRole = filterRole ? log.role === filterRole : true;
        const matchesAction = filterAction ? log.action === filterAction : true;
        return matchesSearch && matchesRole && matchesAction;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Log Aktivitas</h1>
                    <p className="text-gray-500 text-sm mt-1">Rekam jejak aktivitas pengguna dalam sistem.</p>
                </div>

                {/* Search & Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Cari user atau aktivitas..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00C4B4] focus:border-transparent w-full sm:w-64"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00C4B4] bg-white cursor-pointer"
                    >
                        <option value="">Semua Role</option>
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                        <option value="author">Author</option>
                    </select>
                    <select
                        value={filterAction}
                        onChange={(e) => setFilterAction(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00C4B4] bg-white cursor-pointer"
                    >
                        <option value="">Semua Aksi</option>
                        <option value="LOGIN">LOGIN</option>
                        <option value="SUBMIT">SUBMIT</option>
                        <option value="REVIEW">REVIEW</option>
                        <option value="REVISE">REVISE</option>
                        <option value="DELETE">DELETE</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-[#00C4B4]"></div>
                    </div>
                ) : filteredLogs.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        {logs.length === 0 ? (
                            <>
                                Belum ada aktivitas yang tercatat.
                                <br /><span className="text-xs text-gray-400">(Pastikan tabel database telah dibuat via init-db)</span>
                            </>
                        ) : (
                            <span>Tidak ada data yang cocok dengan pencarian.</span>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 border-b border-gray-100 uppercase text-xs font-semibold text-gray-500 tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Waktu</th>
                                    <th className="px-6 py-4">Pengguna</th>
                                    <th className="px-6 py-4">Aksi</th>
                                    <th className="px-6 py-4">Detail</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                            {new Date(log.created_at).toLocaleString('id-ID', {
                                                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900">{log.user_name || 'Unknown'}</span>
                                                <span className="text-xs text-gray-400 capitalize">{log.role || 'Guest'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-md text-xs font-bold ${getActionColor(log.action)}`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">
                                            {log.details}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

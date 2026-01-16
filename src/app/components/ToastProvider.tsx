'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto dismiss after 3 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast Container */}
            <div className="fixed top-20 right-5 z-50 flex flex-col gap-3 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto min-w-[300px] max-w-md p-4 rounded-xl shadow-lg border backdrop-blur-md animate-in slide-in-from-right fade-in duration-300 flex items-start gap-3 transform transition-all hover:scale-[1.02]
              ${toast.type === 'success' ? 'bg-white/90 border-[#00C4B4]/30 text-teal-800 shadow-[#00C4B4]/10' : ''}
              ${toast.type === 'error' ? 'bg-white/90 border-red-200 text-red-800 shadow-red-100' : ''}
              ${toast.type === 'warning' ? 'bg-white/90 border-amber-200 text-amber-800 shadow-amber-100' : ''}
              ${toast.type === 'info' ? 'bg-white/90 border-blue-200 text-blue-800 shadow-blue-100' : ''}
            `}
                    >
                        {/* Icons */}
                        <div className={`mt-0.5 p-1 rounded-full shrink-0
               ${toast.type === 'success' ? 'bg-teal-100 text-[#00C4B4]' : ''}
               ${toast.type === 'error' ? 'bg-red-100 text-red-500' : ''}
               ${toast.type === 'warning' ? 'bg-amber-100 text-amber-500' : ''}
               ${toast.type === 'info' ? 'bg-blue-100 text-blue-500' : ''}
            `}>
                            {toast.type === 'success' && (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                            {toast.type === 'error' && (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                            {toast.type === 'warning' && (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            )}
                            {toast.type === 'info' && (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                        </div>

                        <div className="flex-1">
                            <h4 className="text-sm font-bold capitalize mb-0.5">{toast.type === 'success' ? 'Berhasil' : toast.type === 'error' ? 'Gagal' : toast.type}</h4>
                            <p className="text-sm opacity-90 leading-snug">{toast.message}</p>
                        </div>

                        <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-gray-600">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

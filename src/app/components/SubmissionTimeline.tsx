'use client';

type TimelineStep = {
    label: string;
    status: 'completed' | 'current' | 'upcoming';
    date?: string;
};

type SubmissionTimelineProps = {
    currentStatus: string;
    history?: { status: string; date: string }[];
};

export default function SubmissionTimeline({ currentStatus, history }: SubmissionTimelineProps) {
    // Map current status to steps
    // Status flow: Draft -> Menunggu Validasi (Submitted) -> Review -> Revisi -> Disetujui (Approved)

    // Determine active step index
    let activeStepIndex = 0;

    // Normalize status strings
    const status = currentStatus || '';

    if (status === 'Draft') activeStepIndex = 0;
    else if (status === 'Menunggu Validasi') activeStepIndex = 1;
    else if (status === 'Review') activeStepIndex = 2;
    else if (status === 'Revisi') activeStepIndex = 2; // Revisi is part of Review cycle usually, or separate? Let's make it step 3 if we want explicit
    else if (status === 'Disetujui' || status === 'Ditetapkan' || status === 'Selesai') activeStepIndex = 3;

    // Define steps
    const steps: TimelineStep[] = [
        { label: 'Draft', status: 'completed' },
        { label: 'Submitted', status: activeStepIndex >= 1 ? 'completed' : 'upcoming' },
        { label: 'Review', status: activeStepIndex > 2 ? 'completed' : (activeStepIndex === 2 ? 'current' : 'upcoming') },
        { label: 'Approved', status: activeStepIndex >= 3 ? 'completed' : 'upcoming' }
    ];

    // Refine 'current' status logic
    if (activeStepIndex === 0) steps[0].status = 'current';
    if (activeStepIndex === 1) { steps[0].status = 'completed'; steps[1].status = 'current'; }
    if (activeStepIndex === 2) { steps[0].status = 'completed'; steps[1].status = 'completed'; steps[2].status = 'current'; }
    if (activeStepIndex === 3) { steps.forEach(s => s.status = 'completed'); }

    return (
        <div className="w-full">
            <div className="relative flex justify-between">
                {steps.map((step, idx) => (
                    <div key={idx} className="flex flex-col items-center relative z-10 w-full group">
                        {/* Circle Indicator */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-500
                            ${step.status === 'completed'
                                ? 'bg-[#00BDBB] border-[#00BDBB] text-white shadow-lg shadow-[#00BDBB]/30 scale-100'
                                : step.status === 'current'
                                    ? 'bg-white border-[#00BDBB] text-[#00BDBB] ring-4 ring-[#E0F7F6] scale-110'
                                    : 'bg-white border-gray-200 text-gray-300'
                            }`}
                        >
                            {step.status === 'completed' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <span>{idx + 1}</span>
                            )}
                        </div>

                        {/* Label */}
                        <div className={`mt-4 text-center transition-colors duration-300 ${step.status === 'completed' ? 'text-[#00BDBB]' :
                                step.status === 'current' ? 'text-gray-900 font-bold' : 'text-gray-400'
                            }`}>
                            <p className="text-xs font-bold uppercase tracking-wider">{step.label}</p>
                            {/* Optional: Add date if available from history matching */}
                        </div>

                        {/* Connection Line */}
                        {idx < steps.length - 1 && (
                            <div className="absolute top-6 left-1/2 w-full h-[3px] -translate-y-1/2 -z-10 bg-gray-100">
                                <div
                                    className={`h-full bg-[#00BDBB] transition-all duration-1000 ease-out`}
                                    style={{
                                        width: step.status === 'completed' ? '100%' : '0%'
                                    }}
                                ></div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Contextual Status Message */}
            <div className="mt-8 text-center">
                {activeStepIndex === 2 && (
                    <div className="inline-block px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100 animate-pulse">
                        👀 Naskah Anda sedang dalam proses review oleh editor.
                    </div>
                )}
                {activeStepIndex === 3 && (
                    <div className="inline-block px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium border border-emerald-100">
                        🎉 Selamat! Naskah Anda telah disetujui.
                    </div>
                )}
                {currentStatus === 'Revisi' && (
                    <div className="inline-block px-4 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-100 animate-pulse">
                        ⚠️ Harap periksa catatan revisi dan unggah perbaikan.
                    </div>
                )}
            </div>
        </div>
    );
}

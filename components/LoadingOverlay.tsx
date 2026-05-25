"use client"


type Props = {
    message?: string
}

export default function LoadingOverlay({ message = "Loading…" }: Props) {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 bg-white rounded-2xl shadow-2xl border border-gray-100 px-10 py-8">
                {/* Spinner ring */}
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-black animate-spin" />
                </div>
                <div className="text-center">
                    <p className="text-sm font-semibold text-gray-900">{message}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Please wait</p>
                </div>
            </div>
        </div>
    )
}


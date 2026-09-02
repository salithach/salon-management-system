"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import { isAdmin } from "@/lib/auth"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [validationError, setValidationError] = useState("")
    const { login, fetchProfile, loading, error, token, _hasHydrated } = useAuthStore()
    const router = useRouter()

    useEffect(() => {
        if (_hasHydrated && token) {
            const user = useAuthStore.getState().user
            router.replace(isAdmin(user) ? "/admin" : "/dashboard")
        }
    }, [_hasHydrated, token, router])

    if (!_hasHydrated || token) return null

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setValidationError("")
        if (!username.trim()) { setValidationError("Username is required."); return }
        if (!password) { setValidationError("Password is required."); return }
        const success = await login(username, password)
        if (success) {
            await fetchProfile()
            const user = useAuthStore.getState().user
            router.push(isAdmin(user) ? "/admin" : "/dashboard")
        }
    }

    return (
        <div className="flex-1 flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden min-h-screen">
            {/* Decorative glow orbs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-100 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-100 h-75 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative w-full max-w-4xl grid md:grid-cols-2 bg-slate-900/50 border border-white/10 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-md text-slate-100">

                {/* Left Panel (branding) */}
                <div className="hidden md:flex flex-col justify-center p-10 bg-linear-to-br from-blue-950/40 via-slate-950/40 to-slate-950/40 border-r border-white/5 text-white">
                    <h1 className="text-3xl font-extrabold mb-4 bg-clip-text text-transparent bg-linear-to-r from-blue-300 to-indigo-300">Welcome Back</h1>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                        Sign in to continue accessing your dashboard, manage shift control,
                        staff schedules, and keep your salon running productively.
                    </p>
                    <div className="mt-4">
                        <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-blue-300 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
                            Secure · Fast · Professional
                        </span>
                    </div>
                </div>

                {/* Right Panel (form) */}
                <div className="p-8 sm:p-12">
                    <h2 className="text-2xl font-bold text-white mb-2">Sign In</h2>
                    <p className="text-sm text-slate-400 mb-6">Enter your credentials to continue</p>

                    {/* Validation / API error */}
                    {(validationError || error) && (
                        <div className="mb-4 px-4 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
                            {validationError || error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-1">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Username</label>
                            <input
                                type="text"
                                placeholder="yourname"
                                value={username}
                                onChange={(e) => { setUsername(e.target.value); setValidationError("") }}
                                className="w-full px-4 py-3 border border-white/10 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 text-slate-200 placeholder:text-slate-650 bg-white/5 hover:border-white/20 transition-all text-sm"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setValidationError("") }}
                                className="w-full px-4 py-3 border border-white/10 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 text-slate-200 placeholder:text-slate-650 bg-white/5 hover:border-white/20 transition-all text-sm"
                            />
                        </div>
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white transition font-bold text-sm shadow-md disabled:cursor-not-allowed ${
                                    loading
                                        ? "bg-slate-850 text-slate-500 cursor-not-allowed"
                                        : "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-950/50 hover:shadow-blue-900/50 hover:-translate-y-0.5 active:translate-y-0 text-white"
                                }`}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Signing in…
                                    </>
                                ) : (
                                    "Sign In →"
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Footer */}
                    <p className="text-xs text-slate-500 mt-8 text-center">
                        {"Don't have an account?"}{" "}
                        <Link href="/register" className="text-blue-400 font-semibold hover:underline">
                            Sign up
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    )
}
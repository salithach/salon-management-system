"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [validationError, setValidationError] = useState("")
    const { login, loading, error, token, _hasHydrated } = useAuthStore()
    const router = useRouter()

    useEffect(() => {
        if (_hasHydrated && token) router.replace("/dashboard")
    }, [_hasHydrated, token, router])

    if (!_hasHydrated || token) return null

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setValidationError("")
        if (!username.trim()) { setValidationError("Username is required."); return }
        if (!password) { setValidationError("Password is required."); return }
        const success = await login(username, password)
        if (success) router.push("/dashboard")
    }

    return (
        <div className="flex-1 flex items-start md:items-center justify-center bg-gray-50 px-4 py-6 md:py-8">
            <div className="w-full max-w-4xl grid md:grid-cols-2 bg-white shadow-xl rounded-2xl overflow-hidden">

                {/* Left Panel (branding) */}
                <div className="hidden md:flex flex-col justify-center p-10 bg-black text-white">
                    <h1 className="text-3xl font-bold mb-4">Welcome Back</h1>
                    <p className="text-white/70 text-sm leading-relaxed">
                        Sign in to continue accessing your dashboard, manage projects,
                        and stay productive with your workspace.
                    </p>
                    <div className="mt-8 text-xs text-white/50">Secure • Fast • Reliable</div>
                </div>

                {/* Right Panel (form) */}
                <div className="p-6 sm:p-10">
                    <h2 className="text-2xl font-semibold mb-2">Sign In</h2>
                    <p className="text-sm text-gray-500 mb-6">Enter your credentials to continue</p>

                    {/* Validation / API error — same banner */}
                    {(validationError || error) && (
                        <div className="mb-4 px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                            {validationError || error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => { setUsername(e.target.value); setValidationError("") }}
                            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setValidationError("") }}
                            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-white transition font-medium disabled:cursor-not-allowed ${
                                loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-black hover:opacity-90"
                            }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Signing in…
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-xs text-gray-500 mt-6 text-center">
                        {"Don't have an account?"}{" "}
                        <Link href="/register" className="text-black font-medium hover:underline">
                            Sign up
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    )
}
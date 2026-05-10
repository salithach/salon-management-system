"use client"

import { useState } from "react"
import Link from "next/link";

export default function SignupPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault()
        console.log({ name, email, password })
    }

    const handleGoogleSignup = () => {
        console.log("Google signup")
    }

    return (
        <div className="flex-1 flex items-start md:items-center justify-center bg-gray-50 px-4 py-6 md:py-8">

            <div className="w-full max-w-4xl grid md:grid-cols-2 bg-white shadow-xl rounded-2xl overflow-hidden">

                {/* Left Panel */}
                <div className="hidden md:flex flex-col justify-center p-10 bg-black text-white">
                    <h1 className="text-3xl font-bold mb-4">
                        Join Us Today
                    </h1>

                    <p className="text-white/70 text-sm leading-relaxed">
                        Create your account and start managing your projects with a
                        clean, fast, and modern workspace built for productivity.
                    </p>

                    <div className="mt-8 text-xs text-white/50">
                        Free • Fast Setup • Secure
                    </div>
                </div>

                {/* Right Panel */}
                <div className="p-6 sm:p-10">

                    <h2 className="text-2xl font-semibold mb-2">
                        Create Account
                    </h2>

                    <p className="text-sm text-gray-500 mb-6">
                        Get started in just a few seconds
                    </p>

                    {/* Google Button */}
                    <button
                        onClick={handleGoogleSignup}
                        className="w-full border border-gray-300 rounded-lg py-2.5 mb-6 hover:bg-gray-100 transition"
                    >
                        Continue with Google
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-px bg-gray-200 flex-1" />
                        <span className="text-xs text-gray-400">OR</span>
                        <div className="h-px bg-gray-200 flex-1" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSignup} className="space-y-4">

                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black"
                        />

                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black"
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-black"
                        />

                        <button
                            type="submit"
                            className="w-full bg-black text-white py-2.5 rounded-lg hover:opacity-90 transition"
                        >
                            Create Account
                        </button>

                    </form>

                    {/* Footer */}
                    <p className="text-xs text-gray-500 mt-6 text-center">
                        Already have an account?{" "}
                        <Link href="/login" className="text-black font-medium cursor-pointer">
                            Sign in
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    )
}
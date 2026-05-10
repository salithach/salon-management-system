"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/store/authStore"

import { LayoutDashboard, CalendarDays, Users, Scissors, UserCheck, BarChart3, Menu, X, ChevronRight } from "lucide-react"

export default function Navbar() {
    const [open, setOpen] = useState(false)
    const { token, logout } = useAuthStore()
    const router = useRouter()
    const pathname = usePathname()
    const isLoggedIn = !!token

    // Dashboard has its own sidebar and top bar — suppress the global navbar there
    if (pathname?.startsWith("/dashboard")) return null

    const handleLogout = () => {
        logout()
        setOpen(false)
        router.push("/login")
    }

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/pricing", label: "Pricing" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
    ]

    const dashboardLinks = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/dashboard/appointments", label: "Appointments", icon: CalendarDays },
        { href: "/dashboard/clients", label: "Clients", icon: Users },
        { href: "/dashboard/services", label: "Services", icon: Scissors },
        { href: "/dashboard/staff", label: "Staff", icon: UserCheck },
        { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
    ]

    return (
        <>
            {/* Mobile overlay */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-zinc-900/60 md:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Mobile drawer */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex flex-col w-72 bg-zinc-900 text-white transform transition-transform duration-300 md:hidden ${
                    open ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Drawer header */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
                    <Link href="/" onClick={() => setOpen(false)} className="text-xl font-semibold tracking-tight hover:opacity-80 transition">
                        SalonHQ
                    </Link>
                    <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white transition">
                        <X size={20} />
                    </button>
                </div>

                {/* Drawer content */}
                <div className="flex flex-col flex-1 overflow-y-auto px-4 py-5 gap-1">
                    {isLoggedIn ? (
                        <>
                            <Link
                                href="/dashboard/profile"
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition group mb-1"
                            >
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-semibold text-white shrink-0">U</div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-white leading-none">My Account</p>
                                    <p className="text-xs text-white/50 mt-0.5">View profile</p>
                                </div>
                                <ChevronRight size={14} className="text-white/40 group-hover:text-white transition" />
                            </Link>
                            <div className="h-px bg-white/10 mx-1 mb-1" />
                            {dashboardLinks.map((item) => {
                                const Icon = item.icon
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setOpen(false)}
                                        className="flex items-center gap-3 text-white/70 hover:text-white hover:bg-white/10 transition px-3 py-2.5 rounded-lg text-sm"
                                    >
                                        <Icon size={16} className="shrink-0" />
                                        {item.label}
                                    </Link>
                                )
                            })}
                            <div className="mt-auto pt-4 border-t border-white/10">
                                <button
                                    onClick={handleLogout}
                                    className="w-full bg-white text-zinc-900 text-sm font-medium py-2.5 rounded-xl hover:opacity-90 transition"
                                >
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setOpen(false)}
                                    className="text-white/70 hover:text-white hover:bg-white/10 transition px-3 py-2.5 rounded-lg text-sm"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="mt-auto pt-4 border-t border-white/10 flex flex-col gap-2">
                                <Link
                                    href="/login"
                                    onClick={() => setOpen(false)}
                                    className="text-white/70 hover:text-white text-sm text-center py-2.5 rounded-xl hover:bg-white/10 transition border border-white/10"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setOpen(false)}
                                    className="bg-white text-zinc-900 text-sm font-medium py-2.5 rounded-xl text-center hover:opacity-90 transition"
                                >
                                    Get Started
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </aside>

            {/* Top bar (sticky) */}
            <div className="sticky top-0 left-0 w-full z-30 bg-zinc-800 backdrop-blur-md border-b border-white/10">
                <div className="w-full flex items-center justify-between h-16 px-6 lg:px-4">

                    {/* Logo */}
                    <Link href={isLoggedIn ? "/dashboard" : "/"} className="text-white text-xl font-semibold tracking-tight hover:opacity-80 transition">
                        SalonHQ
                    </Link>

                    {/* Desktop Nav */}
                    {!isLoggedIn && (
                        <nav className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-white/70 hover:text-white text-sm relative group transition"
                                >
                                    {link.label}
                                    <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-white transition-all group-hover:w-full" />
                                </Link>
                            ))}
                        </nav>
                    )}

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                className="text-sm bg-white text-black px-4 py-2 rounded-full hover:opacity-90 transition"
                            >
                                Logout
                            </button>
                        ) : (
                            <>
                                <Link href="/login" className="text-white/70 hover:text-white text-sm transition">
                                    Sign in
                                </Link>
                                <Link href="/register" className="text-sm bg-white text-black px-4 py-2 rounded-full hover:opacity-90 transition">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setOpen(true)}
                        className="md:hidden p-1 text-white"
                        aria-label="Open menu"
                    >
                        <Menu size={22} />
                    </button>
                </div>
            </div>
        </>
    )
}
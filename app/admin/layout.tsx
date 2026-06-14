"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useAuthStore } from "@/store/authStore"
import { isAdmin } from "@/lib/auth"
import { Building2, LogOut, ChevronRight, Menu, X, LayoutDashboard } from "lucide-react"

const adminNavItems = [
    { label: "All Salons", href: "/admin", icon: Building2 },
]

const adminPageTitles: Record<string, string> = {
    "/admin": "All Salons",
}

function SidebarContent({
    pathname,
    onClose,
    onLogout,
}: {
    pathname: string
    onClose: () => void
    onLogout: () => void
}) {
    return (
        <>
            <nav className="flex flex-col gap-1 px-3 py-5 flex-1 overflow-y-auto min-h-0">
                {adminNavItems.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                                isActive
                                    ? "bg-white text-gray-900 font-semibold"
                                    : "text-white/80 hover:text-white hover:bg-white/10"
                            }`}
                        >
                            <Icon size={16} />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>
            <div className="px-3 py-4 border-t border-white/10 shrink-0 space-y-1">
                <Link
                    href="/dashboard"
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition text-sm"
                >
                    <LayoutDashboard size={15} />
                    User Dashboard
                    <ChevronRight size={12} className="ml-auto opacity-40" />
                </Link>
                <button
                    onClick={onLogout}
                    className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/10 transition"
                >
                    <LogOut size={15} /> Logout
                </button>
            </div>
        </>
    )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, token, logout, fetchProfile, _hasHydrated } = useAuthStore()
    const router = useRouter()
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        if (!_hasHydrated) return

        if (!token) {
            router.replace("/login")
            return
        }

        // If we already have the user, check role immediately
        const checkRole = (u: typeof user) => {
            if (!isAdmin(u)) {
                router.replace("/dashboard")
            } else {
                setChecking(false)
            }
        }

        if (user) {
            checkRole(user)
        } else {
            // Fetch profile to determine role
            fetchProfile().then(() => {
                const freshUser = useAuthStore.getState().user
                checkRole(freshUser)
            })
        }
    }, [_hasHydrated, token]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleLogout = () => {
        logout()
        router.push("/login")
    }

    if (!_hasHydrated || !token || checking) return null

    // Compute page title: prefer exact match, then first segment match
    const pageTitle =
        adminPageTitles[pathname] ??
        (pathname.startsWith("/admin/salons/") ? "Salon Details" : "Admin")

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-zinc-900/60 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile drawer */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-indigo-950 text-white transform transition-transform duration-300 md:hidden ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
                    <div>
                        <p className="text-[10px] text-white/50 uppercase tracking-widest -mt-0.5">Admin Panel</p>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="text-white/60 hover:text-white transition">
                        <X size={20} />
                    </button>
                </div>
                <SidebarContent pathname={pathname} onClose={() => setSidebarOpen(false)} onLogout={handleLogout} />
            </aside>

            {/* Desktop sidebar */}
            <aside className="hidden md:flex flex-col w-60 bg-indigo-950 text-white shrink-0 h-screen sticky top-0">
                <div className="h-16 flex flex-col justify-center px-6 border-b border-white/10">
                    <p className="text-[14px] text-white/50 uppercase tracking-widest">Admin Panel</p>
                </div>
                <SidebarContent pathname={pathname} onClose={() => {}} onLogout={handleLogout} />
            </aside>

            {/* Main */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Top bar */}
                <header className="h-16 bg-indigo-900 border-b border-indigo-800 flex items-center justify-between px-4 md:px-6 shrink-0 gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden p-1 text-white shrink-0"
                            aria-label="Open menu"
                        >
                            <Menu size={22} />
                        </button>
                        <h1 className="text-lg font-semibold text-white truncate">{pageTitle}</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-xs font-bold text-white">
                            {user?.username?.[0]?.toUpperCase() ?? "A"}
                        </div>
                        <span className="hidden sm:block text-sm text-indigo-200">{user?.username}</span>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 space-y-6 text-gray-900">
                    {children}
                </main>
            </div>
        </div>
    )
}


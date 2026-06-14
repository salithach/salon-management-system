"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useAuthStore, AuthUser } from "@/store/authStore"
import { useMetadataStore } from "@/store/metadataStore"
import {
    LayoutDashboard, CalendarDays, Users, Scissors,
    UserCheck, BarChart3, LogOut, ChevronRight, Menu, X, Package
} from "lucide-react"

const navItems = [
    { label: "Dashboard",    href: "/dashboard",              icon: LayoutDashboard },
    { label: "Appointments", href: "/dashboard/appointments", icon: CalendarDays },
    { label: "Clients",      href: "/dashboard/clients",      icon: Users },
    { label: "Services",     href: "/dashboard/services",     icon: Scissors },
    { label: "Staff",        href: "/dashboard/staff",        icon: UserCheck },
    { label: "Inventory",    href: "/dashboard/inventory",    icon: Package },
    { label: "Reports",      href: "/dashboard/reports",      icon: BarChart3 },
]

const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/dashboard/appointments": "Appointments",
    "/dashboard/clients": "Clients",
    "/dashboard/services": "Services",
    "/dashboard/staff": "Staff",
    "/dashboard/inventory": "Inventory",
    "/dashboard/reports": "Reports",
    "/dashboard/profile": "My Profile",
}

type SidebarContentProps = {
    user: AuthUser | null
    pathname: string
    onClose: () => void
    onLogout: () => void
}

function SidebarContent({ user, pathname, onClose, onLogout }: SidebarContentProps) {
    return (
        <>
            <nav className="flex flex-col gap-1 px-3 py-5 flex-1 overflow-y-auto min-h-0">
                {navItems.map((item) => {
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
            <div className="px-3 py-4 border-t border-white/10 shrink-0">
                <Link
                    href="/dashboard/profile"
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2 mb-1 rounded-lg hover:bg-white/10 transition group"
                >
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-semibold text-white shrink-0">
                        {user?.roles?.[0]?.name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                    <div>
                        <p className="text-sm font-medium leading-none text-white">My Account</p>
                        <p className="text-xs text-white/70 mt-0.5">{user?.roles?.[0]?.name ?? "User"}</p>
                    </div>
                    <ChevronRight size={14} className="ml-auto text-white/40 group-hover:text-white transition" />
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

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, token, logout, _hasHydrated } = useAuthStore()
    const { fetchMetadata } = useMetadataStore()
    const router = useRouter()
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        if (!_hasHydrated) return
        if (!token) { router.replace("/login"); return }
        // Redirect admins out of the regular dashboard
        const isAdmin = user?.roles?.some((r) => r.name === "ROLE_ADMIN")
        if (isAdmin) { router.replace("/admin"); return }
    }, [_hasHydrated, token, user, router])

    // Fetch metadata (jobTypes + jobRoles) once when the dashboard loads
    useEffect(() => {
        if (_hasHydrated && token) {
            fetchMetadata()
        }
    }, [_hasHydrated, token, fetchMetadata])

    const isAdmin = user?.roles?.some((r) => r.name === "ROLE_ADMIN")
    if (!_hasHydrated || !token || isAdmin) return null

    const handleLogout = () => {
        logout()
        router.push("/login")
    }

    const pageTitle = pageTitles[pathname] ?? "Dashboard"

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
                className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-zinc-900 text-white transform transition-transform duration-300 md:hidden ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
                    <Link href="/dashboard" className="text-xl font-semibold tracking-tight hover:opacity-80 transition">
                        SalonHQ
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="text-white/60 hover:text-white transition"
                    >
                        <X size={20} />
                    </button>
                </div>
                <SidebarContent
                    user={user}
                    pathname={pathname}
                    onClose={() => setSidebarOpen(false)}
                    onLogout={handleLogout}
                />
            </aside>

            {/* Desktop sidebar */}
            <aside className="hidden md:flex flex-col w-60 bg-zinc-900 text-white shrink-0 h-screen sticky top-0">
                <div className="h-16 flex items-center px-6 border-b border-white/10">
                    <Link href="/dashboard" className="text-xl font-semibold tracking-tight hover:opacity-80 transition">
                        SalonHQ
                    </Link>
                </div>
                <SidebarContent
                    user={user}
                    pathname={pathname}
                    onClose={() => {}}
                    onLogout={handleLogout}
                />
            </aside>

            {/* Main */}
            <div className="flex flex-col flex-1 overflow-hidden">

                {/* Top bar */}
                <header className="h-16 bg-zinc-800 border-b border-zinc-700 flex items-center justify-between px-4 md:px-6 shrink-0 gap-3">
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
                </header>

                <main className="flex-1 overflow-y-auto p-6 space-y-6 text-gray-900">
                    {children}
                </main>
            </div>
        </div>
    )
}


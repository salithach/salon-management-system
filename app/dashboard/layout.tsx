"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useAuthStore } from "@/store/authStore"
import {
    LayoutDashboard, CalendarDays, Users, Scissors,
    UserCheck, BarChart3, LogOut, ChevronRight, Menu, X
} from "lucide-react"

const navItems = [
    { label: "Dashboard",    href: "/dashboard",              icon: LayoutDashboard },
    { label: "Appointments", href: "/dashboard/appointments", icon: CalendarDays },
    { label: "Clients",      href: "/dashboard/clients",      icon: Users },
    { label: "Services",     href: "/dashboard/services",     icon: Scissors },
    { label: "Staff",        href: "/dashboard/staff",        icon: UserCheck },
    { label: "Reports",      href: "/dashboard/reports",      icon: BarChart3 },
]

const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/dashboard/appointments": "Appointments",
    "/dashboard/clients": "Clients",
    "/dashboard/services": "Services",
    "/dashboard/staff": "Staff",
    "/dashboard/reports": "Reports",
    "/dashboard/profile": "My Profile",
}

type SidebarContentProps = {
    user: { roles: string[] } | null
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
                                    ? "bg-white text-black font-medium"
                                    : "text-white/60 hover:text-white hover:bg-white/10"
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
                        {user?.roles?.[0]?.[0]?.toUpperCase() ?? "U"}
                    </div>
                    <div>
                        <p className="text-sm font-medium leading-none text-white">My Account</p>
                        <p className="text-xs text-white/60 mt-0.5">{user?.roles?.[0] ?? "User"}</p>
                    </div>
                    <ChevronRight size={14} className="ml-auto text-white/40 group-hover:text-white transition" />
                </Link>
                <button
                    onClick={onLogout}
                    className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition"
                >
                    <LogOut size={15} /> Logout
                </button>
            </div>
        </>
    )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, token, logout, _hasHydrated } = useAuthStore()
    const router = useRouter()
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        if (_hasHydrated && !token) router.replace("/login")
    }, [_hasHydrated, token, router])

    if (!_hasHydrated || !token) return null

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
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile drawer */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-black text-white transform transition-transform duration-300 md:hidden ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
                    <Link href="/" className="text-xl font-semibold tracking-tight hover:opacity-80 transition">
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
            <aside className="hidden md:flex flex-col w-60 bg-black text-white shrink-0 h-screen sticky top-0">
                <div className="h-16 flex items-center px-6 border-b border-white/10">
                    <Link href="/" className="text-xl font-semibold tracking-tight hover:opacity-80 transition">
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
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden p-1 text-gray-800"
                            aria-label="Open menu"
                        >
                            <Menu size={22} />
                        </button>
                        <h1 className="text-lg font-semibold text-gray-900">{pageTitle}</h1>
                    </div>
                    <button className="bg-black text-white text-sm px-4 py-2 rounded-lg hover:opacity-80 transition">
                        + New Appointment
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto p-6 space-y-6">
                    {children}
                </main>
            </div>
        </div>
    )
}


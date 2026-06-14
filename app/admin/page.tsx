"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Building2, Search, MapPin, Globe, User, ChevronRight, RefreshCw, AlertCircle } from "lucide-react"
import { useAdminStore, Salon } from "@/store/adminStore"
import { useAuthStore } from "@/store/authStore"
import LoadingOverlay from "@/components/LoadingOverlay"

export default function AdminSalonsPage() {
    const { _hasHydrated } = useAuthStore()
    const { salons, salonsLoading, salonsError, fetchSalons } = useAdminStore()
    const [query, setQuery] = useState("")

    useEffect(() => {
        if (_hasHydrated) fetchSalons().then(() => {})
    }, [_hasHydrated]) // eslint-disable-line react-hooks/exhaustive-deps

    const filtered: Salon[] = salons.filter((s) => {
        const q = query.toLowerCase()
        return (
            s.salonName?.toLowerCase().includes(q) ||
            s.ownerName?.toLowerCase().includes(q) ||
            s.city?.toLowerCase().includes(q) ||
            s.salonType?.toLowerCase().includes(q) ||
            s.username?.toLowerCase().includes(q)
        )
    })

    return (
        <>
            {salonsLoading && <LoadingOverlay message="Loading salons…" />}

            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Registered Salons</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {salons.length} salon{salons.length !== 1 ? "s" : ""} registered in the system
                    </p>
                </div>
                <button
                    onClick={() => fetchSalons({ force: true })}
                    disabled={salonsLoading}
                    className="flex items-center gap-2 text-sm px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 self-start sm:self-auto"
                >
                    <RefreshCw size={14} className={salonsLoading ? "animate-spin" : ""} />
                    Refresh
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                    type="text"
                    placeholder="Search by salon name, owner, city, type…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            {/* Error */}
            {salonsError && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <div>
                        <p className="font-semibold">Failed to load salons</p>
                        <p className="text-red-600 mt-0.5">{salonsError}</p>
                    </div>
                </div>
            )}

            {/* Empty state */}
            {!salonsLoading && !salonsError && filtered.length === 0 && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
                    <Building2 size={36} className="mx-auto text-gray-200 mb-3" />
                    <p className="text-sm font-medium text-gray-500">
                        {query ? "No salons match your search" : "No salons registered yet"}
                    </p>
                </div>
            )}

            {/* Salons grid */}
            {filtered.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map((salon) => (
                        <SalonCard key={salon.id ?? salon.username} salon={salon} />
                    ))}
                </div>
            )}
        </>
    )
}

function SalonCard({ salon }: { salon: Salon }) {
    const { setSelectedSalon } = useAdminStore()
    const id = salon.id ?? salon.username
    const location = [salon.city, salon.state, salon.country].filter(Boolean).join(", ")

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:border-indigo-200 hover:shadow-md transition group">
            {/* Card header */}
            <div className="flex items-start gap-3 p-5 border-b border-gray-50">
                <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg shrink-0">
                    {(salon.salonName?.[0] ?? "S").toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{salon.salonName || "—"}</p>
                    <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 uppercase tracking-wide">
                        {salon.salonType || "Unknown"}
                    </span>
                </div>
            </div>

            {/* Card body */}
            <div className="px-5 py-4 space-y-2 text-xs text-gray-500">
                {salon.ownerName && (
                    <div className="flex items-center gap-2">
                        <User size={12} className="shrink-0 text-gray-400" />
                        <span className="truncate">{salon.ownerName}</span>
                    </div>
                )}
                {location && (
                    <div className="flex items-center gap-2">
                        <MapPin size={12} className="shrink-0 text-gray-400" />
                        <span className="truncate">{location}</span>
                    </div>
                )}
                {salon.website && (
                    <div className="flex items-center gap-2">
                        <Globe size={12} className="shrink-0 text-gray-400" />
                        <a
                            href={salon.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="truncate text-indigo-500 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {salon.website}
                        </a>
                    </div>
                )}
            </div>

            {/* Card footer */}
            <div className="px-5 pb-5">
                <Link
                    href={`/admin/salons/${id}`}
                    onClick={() => setSelectedSalon(salon)}
                    className="flex items-center justify-center gap-1.5 w-full py-2 text-xs font-medium bg-indigo-950 text-white rounded-lg hover:bg-indigo-800 transition"
                >
                    Manage Salon <ChevronRight size={12} />
                </Link>
            </div>
        </div>
    )
}


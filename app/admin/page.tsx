"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Building2, Search, MapPin, Globe, User, ChevronRight, RefreshCw, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { useAdminStore, Salon } from "@/store/adminStore"
import { useAuthStore } from "@/store/authStore"
import LoadingOverlay from "@/components/LoadingOverlay"
import { toast } from "sonner"

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
                    <h2 className="text-lg font-bold text-gray-900">Registered Salons</h2>
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
    const { setSelectedSalon, activateUser } = useAdminStore()
    const [activating, setActivating] = useState(false)
    const id = salon.id ?? salon.username
    const location = [salon.city, salon.state, salon.country].filter(Boolean).join(", ")
    const isConfirmedActive = salon.active === true

    const handleActivate = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setActivating(true)
        try {
            await activateUser(id)
            toast.success(`${salon.salonName || salon.username} activated successfully`)
        } catch (err) {
            toast.error((err as Error).message)
        } finally {
            setActivating(false)
        }
    }

    return (
        <div className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition group ${
            isConfirmedActive ? "border-gray-100 hover:border-indigo-200" : "border-amber-100 hover:border-amber-200"
        }`}>
            {/* Card header */}
            <div className="flex items-start gap-3 p-5 border-b border-gray-50">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 ${
                    isConfirmedActive ? "bg-indigo-100 text-indigo-700" : "bg-amber-50 text-amber-600"
                }`}>
                    {(salon.salonName?.[0] ?? "S").toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{salon.salonName || "—"}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 uppercase tracking-wide">
                            {salon.salonType || "Unknown"}
                        </span>
                        {/* Status badge — shown when backend provides the field */}
                        {salon.active === true && (
                            <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-600">
                                <CheckCircle2 size={9} /> Active
                            </span>
                        )}
                        {salon.active === false && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">
                                Pending
                            </span>
                        )}
                    </div>
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

            {/* Card footer — always show Activate unless confirmed active */}
            <div className="px-5 pb-5 flex gap-2">
                {!isConfirmedActive && (
                    <button
                        onClick={handleActivate}
                        disabled={activating}
                        className="flex items-center justify-center gap-1.5 flex-1 py-2 text-xs font-medium bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition disabled:opacity-60"
                    >
                        {activating
                            ? <><Loader2 size={11} className="animate-spin" /> Activating…</>
                            : <><CheckCircle2 size={11} /> Activate</>
                        }
                    </button>
                )}
                <Link
                    href={`/admin/salons/${id}`}
                    onClick={() => setSelectedSalon(salon)}
                    className="flex items-center justify-center gap-1.5 flex-1 py-2 text-xs font-medium bg-indigo-950 text-white rounded-lg hover:bg-indigo-800 transition"
                >
                    Manage Salon <ChevronRight size={12} />
                </Link>
            </div>
        </div>
    )
}


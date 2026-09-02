"use client"

"use client"

import { useState, useMemo, useEffect } from "react"
import {
    Users, Search, Mail, Phone, CalendarDays, Clock,
    Scissors, User, FileText, X, ChevronRight, CheckCircle2,
    AlertCircle, XCircle
} from "lucide-react"
import { useClientStore } from "@/store/clientStore"
import { useAppointmentStore, Appointment, AppointmentStatus } from "@/store/appointmentStore"
import { useMetadataStore } from "@/store/metadataStore"
import { useAuthStore } from "@/store/authStore"
import DropDown from "@/components/DropDown"
import LoadingOverlay from "@/components/LoadingOverlay"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(t: string) {
    if (!t || t === "—") return "—"
    const [h, m] = t.split(":").map(Number)
    if (isNaN(h) || isNaN(m)) return t
    const ampm = h >= 12 ? "PM" : "AM"
    const hour12 = h % 12 === 0 ? 12 : h % 12
    return `${hour12}:${String(m).padStart(2, "0")} ${ampm}`
}

function formatDateLabel(ymd: string) {
    if (!ymd || ymd === "—") return "—"
    try {
        const d = new Date(ymd + "T00:00:00")
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    } catch {
        return ymd
    }
}

// Resolve service keys to service names
function resolveServices(services: unknown, jobTypes: { key: string; value: string }[]): string {
    const arr: string[] = Array.isArray(services) ? (services as string[])
        : typeof services === "string" && services ? [services] : []
    return arr.map((key) => jobTypes.find((jt) => jt.key === key)?.value ?? key).join(", ")
}

// Color and icon configuration for appointment status badges
const STATUS_CONFIG: Record<AppointmentStatus, { label: string; color: string; icon: React.ReactNode }> = {
    CONFIRMED: { label: "Confirmed", color: "bg-zinc-100 text-zinc-800 border border-zinc-200", icon: <CheckCircle2 size={11} className="text-zinc-600" /> },
    PENDING:   { label: "Pending",   color: "bg-amber-100 text-amber-800 border border-amber-200", icon: <AlertCircle  size={11} className="text-amber-700" /> },
    CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-800 border border-red-200", icon: <XCircle      size={11} className="text-red-600" /> },
}

interface ClientGroup {
    name: string
    email: string
    phone: string
    key: string
    appointments: Appointment[]
    visitsCount: number
    confirmedCount: number
    pendingCount: number
    cancelledCount: number
    lastVisitDate: string
    lastVisitTime: string
    favoriteStylist: string
    servicesReceived: string[]
}

export default function ClientsPage() {
    const { clients, clientsLoading, fetchClients } = useClientStore()
    const { appointments, appointmentsLoading, fetchAppointments } = useAppointmentStore()
    const { jobTypes, fetchMetadata } = useMetadataStore()
    const { user } = useAuthStore()

    const [searchQuery, setSearchQuery] = useState("")
    const [stylistFilter, setStylistFilter] = useState("ALL")
    const [frequencyFilter, setFrequencyFilter] = useState("ALL")
    const [selectedClient, setSelectedClient] = useState<ClientGroup | null>(null)

    // Load live clients collection, appointments, and metadata on mount
    useEffect(() => {
        fetchClients().then(() => {})
        fetchAppointments().then(() => {})
        fetchMetadata({ force: false, tenantId: user?.username, user }).then(() => {})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Map the database client identities with live logs
    const clientsList = useMemo(() => {
        const list: ClientGroup[] = []

        clients.forEach((c) => {
            const name = (c.name || "Unknown Client").trim()
            const email = (c.email || "").trim()
            const phone = (c.phone || "").trim()

            // Find matching appointments by email fallback to name
            const clientAppointments = appointments.filter((a) => {
                const apptEmail = (a.client?.email || "").trim().toLowerCase()
                const apptName = (a.client?.name || "").trim().toLowerCase()

                const currentEmail = email.toLowerCase()
                const currentName = name.toLowerCase()

                if (currentEmail && apptEmail) {
                    return currentEmail === apptEmail
                }
                return currentName === apptName
            })

            // Calculate metrics
            let confirmedCount = 0
            let pendingCount = 0
            let cancelledCount = 0

            clientAppointments.forEach((a) => {
                if (a.status === "CONFIRMED") confirmedCount++
                else if (a.status === "PENDING") pendingCount++
                else if (a.status === "CANCELLED") cancelledCount++
            })

            // Chronological descending sort
            const sortedAppts = [...clientAppointments].sort((a, b) => {
                const dtA = `${a.date}T${a.time || "00:00"}`
                const dtB = `${b.date}T${b.time || "00:00"}`
                return dtB.localeCompare(dtA)
            })

            const latest = sortedAppts[0]
            const lastVisitDate = latest ? latest.date : "—"
            const lastVisitTime = latest ? latest.time : "—"

            // Services received
            const servicesSet = new Set<string>()
            clientAppointments.forEach((a) => {
                if (Array.isArray(a.services)) {
                    a.services.forEach((s) => servicesSet.add(s))
                } else if (a.services) {
                    servicesSet.add(a.services)
                }
            })
            const servicesReceived = Array.from(servicesSet)

            // Favorite stylist
            const stylistCounts: Record<string, number> = {}
            clientAppointments.forEach((a) => {
                const s = a.assignee?.trim()
                if (s) {
                    stylistCounts[s] = (stylistCounts[s] || 0) + 1
                }
            })
            let favoriteStylist = "—"
            let maxCount = 0
            Object.entries(stylistCounts).forEach(([stylist, count]) => {
                if (count > maxCount) {
                    maxCount = count
                    favoriteStylist = stylist
                }
            })

            list.push({
                name,
                email,
                phone,
                key: c.id,
                appointments: sortedAppts,
                visitsCount: clientAppointments.length,
                confirmedCount,
                pendingCount,
                cancelledCount,
                lastVisitDate,
                lastVisitTime,
                favoriteStylist,
                servicesReceived,
            })
        })

        return list
    }, [clients, appointments])

    // Derive list of all unique stylists in appointments
    const allStylists = useMemo(() => {
        const set = new Set<string>()
        appointments.forEach((a) => {
            const s = a.assignee?.trim()
            if (s) set.add(s)
        })
        return Array.from(set).sort()
    }, [appointments])

    // Filter and search active clients
    const filteredClients = useMemo(() => {
        let list = [...clientsList]

        // 1. Search query (matches name, email, phone)
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            list = list.filter((c) =>
                c.name.toLowerCase().includes(query) ||
                c.email.toLowerCase().includes(query) ||
                c.phone.toLowerCase().includes(query)
            )
        }

        // 2. Stylist filter
        if (stylistFilter !== "ALL") {
            list = list.filter((c) => c.favoriteStylist === stylistFilter)
        }

        // 3. Frequency filter
        if (frequencyFilter === "REPEAT") {
            list = list.filter((c) => c.visitsCount >= 2)
        } else if (frequencyFilter === "SINGLE") {
            list = list.filter((c) => c.visitsCount === 1)
        }

        // Default: Sort by visits count descending
        return list.sort((a, b) => b.visitsCount - a.visitsCount)
    }, [clientsList, searchQuery, stylistFilter, frequencyFilter])

    // Stats calculations
    const stats = useMemo(() => {
        const uniqueCount = clients.length
        const totalBookings = appointments.length
        const repeatCount = clientsList.filter((c) => c.visitsCount >= 2).length
        const repeatPct = uniqueCount > 0 ? Math.round((repeatCount / uniqueCount) * 100) : 0

        return {
            uniqueCount,
            totalBookings,
            repeatPct,
        }
    }, [clients, appointments, clientsList])

    // Synced state on client selection side-effect
    const activeSelectedClient = useMemo(() => {
        if (!selectedClient) return null
        return clientsList.find((c) => c.key === selectedClient.key) || null
    }, [selectedClient, clientsList])

    const isGlobalLoading = clientsLoading || appointmentsLoading

    return (
        <>
            {isGlobalLoading && <LoadingOverlay message="Loading official clients list…" />}

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Total Registered Clients", value: stats.uniqueCount, desc: "Active client profiles recorded" },
                    { label: "Aggregate Bookings", value: stats.totalBookings, desc: "Lifetime schedules registered" },
                    { label: "Repeat Segment", value: `${stats.repeatPct}%`, desc: "Clients with 2+ bookings" },
                ].map((s) => (
                    <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 mb-1">{s.label}</p>
                            <p className="text-3xl font-extrabold text-gray-900">{s.value}</p>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-2 font-medium">{s.desc}</p>
                    </div>
                ))}
            </div>

            {/* Filter toolbar */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col md:flex-row items-center gap-4">
                {/* Search */}
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search our database of names, emails or mobile numbers..."
                        className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-zinc-800 bg-white text-gray-900 hover:border-gray-400 transition"
                    />
                </div>

                {/* Stylist Filter */}
                <div className="w-full md:w-56 shrink-0">
                    <DropDown
                        options={[
                            { label: "All Stylists", value: "ALL" },
                            ...allStylists.map((stylist) => ({ label: stylist, value: stylist }))
                        ]}
                        value={stylistFilter}
                        onChange={setStylistFilter}
                        placeholder="Filter by Stylist"
                    />
                </div>

                {/* Frequency Filter */}
                <div className="w-full md:w-56 shrink-0">
                    <DropDown
                        options={[
                            { label: "All Frequencies", value: "ALL" },
                            { label: "Repeat Customers (2+ visits)", value: "REPEAT" },
                            { label: "Single Visit Users", value: "SINGLE" },
                        ]}
                        value={frequencyFilter}
                        onChange={setFrequencyFilter}
                        placeholder="Filter by Type"
                    />
                </div>
            </div>

            {/* Clients Listing */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-gray-900">Official Client Directory</h2>
                    <p className="text-xs text-gray-400 font-medium">
                        Showing {filteredClients.length} of {stats.uniqueCount} profiles
                    </p>
                </div>

                {filteredClients.length === 0 ? (
                    <div className="px-6 py-12 text-center flex flex-col items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                            <Users size={22} className="text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">No client profiles found</p>
                        <p className="text-xs text-gray-400 mt-1 max-w-xs">
                            Try adjusting your search criteria, resetting the stylist selection dropdown, or clearing query inputs.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50/55 text-gray-500 uppercase tracking-wider text-[10px] font-bold border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-3.5">Client Details</th>
                                    <th className="px-6 py-3.5">Contact Details</th>
                                    <th className="px-6 py-3.5 text-center">Visits</th>
                                    <th className="px-6 py-3.5">Last Visit</th>
                                    <th className="px-6 py-3.5">Assigned Stylist</th>
                                    <th className="px-6 py-3.5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-700">
                                {filteredClients.map((c) => {
                                    const initials = c.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .substring(0, 2)
                                        .toUpperCase() || "U"

                                    return (
                                        <tr key={c.key} className="hover:bg-gray-50/50 transition">
                                            {/* Client details */}
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-zinc-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                                                        {initials}
                                                    </div>
                                                    <div>
                                                        <span className="block text-sm font-semibold text-gray-900">{c.name}</span>
                                                        <span className="text-[10px] text-zinc-500 font-medium tracking-wide capitalize">
                                                            {c.visitsCount >= 2 ? "Repeat Customer" : c.visitsCount === 1 ? "New Customer" : "No Appointments Booked"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Contact details */}
                                            <td className="px-6 py-4 text-xs">
                                                <div className="space-y-1">
                                                    {c.phone && (
                                                        <div className="flex items-center gap-1.5 text-gray-700">
                                                            <Phone size={11} className="text-gray-400 shrink-0" />
                                                            <span>{c.phone}</span>
                                                        </div>
                                                    )}
                                                    {c.email ? (
                                                        <div className="flex items-center gap-1.5 text-gray-600">
                                                            <Mail size={11} className="text-gray-400 shrink-0" />
                                                            <span className="truncate">{c.email}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 italic">No email</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Visits status count */}
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-block text-sm font-extrabold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg">
                                                    {c.visitsCount}
                                                </span>
                                            </td>

                                            {/* Last Visit date */}
                                            <td className="px-6 py-4 whitespace-nowrap text-xs">
                                                {c.lastVisitDate !== "—" ? (
                                                    <>
                                                        <span className="block font-medium text-gray-900">
                                                            {formatDateLabel(c.lastVisitDate)}
                                                        </span>
                                                        <span className="block text-[10px] text-gray-400">
                                                            {formatTime(c.lastVisitTime)}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-gray-400 italic">—</span>
                                                )}
                                            </td>

                                            {/* Assigned/Favorite Stylist */}
                                            <td className="px-6 py-4 whitespace-nowrap text-xs">
                                                <div className="flex items-center gap-1.5 text-gray-800">
                                                    <User size={12} className="text-gray-400" />
                                                    <span className="font-medium">{c.favoriteStylist}</span>
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <button
                                                    onClick={() => setSelectedClient(c)}
                                                    className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-900 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition"
                                                >
                                                    View Logs
                                                    <ChevronRight size={12} />
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Client Past Bookings Details Modal */}
            {activeSelectedClient && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setSelectedClient(null)}
                    />

                    {/* Content Box */}
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 flex flex-col max-h-[85vh] overflow-hidden text-gray-900">

                        {/* Modal Header */}
                        <div className="flex items-start justify-between pb-4 border-b border-gray-100 shrink-0">
                            <div className="flex items-center gap-3.5">
                                <div className="w-12 h-12 rounded-full bg-zinc-800 text-white font-black text-sm flex items-center justify-center shrink-0">
                                    {(activeSelectedClient.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .substring(0, 2)
                                        .toUpperCase() || "U")}
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-gray-900 leading-none">
                                        {activeSelectedClient.name}
                                    </h3>
                                    <div className="text-xs text-gray-400 mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                        {activeSelectedClient.phone && (
                                            <span className="flex items-center gap-1 text-gray-500">
                                                <Phone size={10} className="text-gray-400 shrink-0" /> {activeSelectedClient.phone}
                                            </span>
                                        )}
                                        {activeSelectedClient.email && (
                                            <span className="flex items-center gap-1 text-gray-500">
                                                <Mail size={10} className="text-gray-400 shrink-0" /> {activeSelectedClient.email}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedClient(null)}
                                className="text-gray-400 hover:text-gray-700 hover:bg-gray-50 p-1.5 rounded-lg transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Booking Summary Stats inside Modal */}
                        <div className="grid grid-cols-3 gap-2.5 py-4 border-b border-gray-100 shrink-0 bg-gray-50/50 -mx-6 px-6">
                            <div className="text-center">
                                <span className="block text-[10px] uppercase font-bold tracking-wider text-gray-500">Visits Count</span>
                                <span className="text-lg font-extrabold text-gray-900">{activeSelectedClient.visitsCount}</span>
                            </div>
                            <div className="text-center border-x border-gray-150">
                                <span className="block text-[10px] uppercase font-bold tracking-wider text-gray-500">Confirmed</span>
                                <span className="text-lg font-extrabold text-gray-900">{activeSelectedClient.confirmedCount}</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-[10px] uppercase font-bold tracking-wider text-gray-500">Cancelled/Other</span>
                                <span className="text-lg font-extrabold text-gray-900">
                                    {activeSelectedClient.cancelledCount + activeSelectedClient.pendingCount}
                                </span>
                            </div>
                        </div>

                        {/* Historical Log list */}
                        <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Detailed Booking History</h4>

                            {activeSelectedClient.appointments.length === 0 ? (
                                <p className="text-center text-xs text-gray-400 italic py-10">No appointments recorded for this client yet.</p>
                            ) : (
                                activeSelectedClient.appointments.map((appt) => {
                                    const cfg = STATUS_CONFIG[appt.status] ?? STATUS_CONFIG["PENDING"]
                                    return (
                                        <div
                                            key={appt.id}
                                            className="bg-white border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition space-y-2.5 shadow-sm"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-center gap-1.5">
                                                    <CalendarDays size={13} className="text-gray-400" />
                                                    <span className="text-sm font-semibold text-gray-900">
                                                        {formatDateLabel(appt.date)}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        at {formatTime(appt.time)}
                                                    </span>
                                                </div>
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${cfg.color}`}>
                                                    {cfg.icon}
                                                    {cfg.label}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-gray-700">
                                                <div className="flex items-center gap-1.5">
                                                    <Scissors size={12} className="text-gray-400 shrink-0" />
                                                    <span className="font-medium text-gray-800">
                                                        {resolveServices(appt.services, jobTypes)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <User size={12} className="text-gray-400 shrink-0" />
                                                    <span className="text-gray-600">Assigned Stylist: </span>
                                                    <span className="font-medium text-gray-800">{appt.assignee}</span>
                                                </div>
                                            </div>

                                            {appt.notes && (
                                                <div className="flex items-start gap-1.5 bg-gray-50 rounded-lg p-2.5 mt-1 border border-gray-100">
                                                    <FileText size={12} className="text-gray-400 mt-0.5 shrink-0" />
                                                    <p className="text-xs text-gray-600 leading-relaxed italic">
                                                        &ldquo;{appt.notes}&rdquo;
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="pt-4 border-t border-gray-100 flex justify-end shrink-0">
                            <button
                                onClick={() => setSelectedClient(null)}
                                className="px-5 py-2 text-sm font-semibold border border-gray-250 rounded-lg hover:bg-gray-50 text-gray-700 transition"
                            >
                                Close Log
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

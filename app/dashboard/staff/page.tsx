"use client"

import { useState } from "react"
import { Scissors, Star, CheckCircle2, Circle, CalendarCheck, Loader2 } from "lucide-react"
import { useStaffAssignmentStore } from "@/store/staffAssignmentStore"

const staff = [
    { name: "Mia Chen", role: "Senior Stylist", speciality: "Hair Coloring, Highlights", appointments: 18, rating: "4.9", status: "Available" },
    { name: "Lena Park", role: "Stylist", speciality: "Haircuts, Threading", appointments: 14, rating: "4.8", status: "Available" },
    { name: "Sara Kim", role: "Nail Technician", speciality: "Manicure, Nail Art", appointments: 22, rating: "4.9", status: "Busy" },
    { name: "Jade Rivera", role: "Esthetician", speciality: "Facials, Lash Extensions", appointments: 10, rating: "4.7", status: "Off Today" },
    { name: "Priya Nair", role: "Stylist", speciality: "Blowouts, Deep Conditioning", appointments: 12, rating: "4.8", status: "Available" },
]

const statusColor: Record<string, string> = {
    Available: "bg-brand text-white",
    Busy: "bg-gray-100 text-gray-700",
    "Off Today": "bg-gray-100 text-gray-400",
}

export default function StaffPage() {
    const { assignedToday, assign, _hasHydrated } = useStaffAssignmentStore()
    const [selected, setSelected] = useState<string[]>([])
    const [saved, setSaved] = useState(false)

    if (!_hasHydrated) {
        return (
            <div className="flex items-center justify-center h-48 text-gray-400 gap-2">
                <Loader2 size={18} className="animate-spin" /> Loading staff…
            </div>
        )
    }

    const toggle = (name: string) => {
        setSelected((prev) =>
            prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
        )
        setSaved(false)
    }

    const handleAssign = () => {
        assign(selected)
        setSaved(true)
        setTimeout(() => {
            setSaved(false)
            setSelected([])
        }, 1500)
    }

    return (
        <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Total Staff", value: String(staff.length) },
                    { label: "Assigned Today", value: String(assignedToday.length) },
                    { label: "Avg. Rating", value: "4.82" },
                ].map((s) => (
                    <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                        <p className="text-3xl font-bold text-gray-900">{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Assign toolbar */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <p className="text-sm font-semibold text-gray-900">Assign Staff for Today</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {selected.length === 0
                            ? "Click staff cards below to select members"
                            : `${selected.length} member${selected.length > 1 ? "s" : ""} selected`}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {saved && (
                        <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                            <CheckCircle2 size={13} /> Assignment saved
                        </span>
                    )}
                    {selected.length > 0 && (
                        <button
                            onClick={() => { setSelected([]); setSaved(false) }}
                            className="text-xs text-gray-500 hover:text-gray-800 transition px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-400"
                        >
                            Clear
                        </button>
                    )}
                    <button
                        onClick={handleAssign}
                        disabled={selected.length === 0}
                        className="flex items-center gap-2 bg-zinc-800 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-zinc-700 transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <CalendarCheck size={15} />
                        Assign for Today
                    </button>
                </div>
            </div>

            {/* Staff cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {staff.map((member) => {
                    const isSelected = selected.includes(member.name)
                    const isAssigned = assignedToday.includes(member.name)
                    return (
                        <div
                            key={member.name}
                            onClick={() => toggle(member.name)}
                            className={`bg-white rounded-xl border shadow-sm p-5 cursor-pointer transition ${
                                isSelected
                                    ? "border-brand ring-2 ring-brand/20 shadow-md"
                                    : "border-gray-100 hover:border-gray-300 hover:shadow-md"
                            }`}
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center text-lg font-semibold shrink-0">
                                    {member.name[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900">{member.name}</p>
                                    <p className="text-xs text-gray-500">{member.role}</p>
                                </div>
                                <div className="flex flex-col items-end gap-1.5 shrink-0">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[member.status] ?? "bg-gray-100 text-gray-700"}`}>
                                        {member.status}
                                    </span>
                                    {isAssigned && (
                                        <span className="text-[10px] text-green-600 font-medium flex items-center gap-0.5">
                                            <CheckCircle2 size={10} /> Today
                                        </span>
                                    )}
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mb-3 flex items-center gap-1.5">
                                <Scissors size={12} /> {member.speciality}
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-50 pt-3">
                                <span>{member.appointments} appts this month</span>
                                <span className="font-medium text-gray-900 flex items-center gap-0.5">
                                    <Star size={11} className="text-gray-600" /> {member.rating}
                                </span>
                            </div>
                            {/* Selection indicator */}
                            <div className="mt-3 flex items-center gap-1.5 text-xs font-medium">
                                {isSelected
                                    ? <><CheckCircle2 size={14} className="text-brand" /><span className="text-brand">Selected for today</span></>
                                    : <><Circle size={14} className="text-gray-300" /><span className="text-gray-400">Click to select</span></>
                                }
                            </div>
                        </div>
                    )
                })}
            </div>
            {/* Floating assign bar — appears when staff are selected */}
            {selected.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-zinc-800 text-white px-6 py-3.5 rounded-2xl shadow-2xl">
                    <span className="text-sm font-medium">
                        {selected.length} member{selected.length > 1 ? "s" : ""} selected
                    </span>
                    <div className="w-px h-4 bg-white/30" />
                    <button
                        onClick={() => { setSelected([]); setSaved(false) }}
                        className="text-sm text-white/70 hover:text-white transition"
                    >
                        Clear
                    </button>
                    <button
                        onClick={handleAssign}
                        className="flex items-center gap-2 bg-white text-zinc-800 text-sm font-semibold px-4 py-1.5 rounded-xl hover:opacity-90 transition"
                    >
                        <CalendarCheck size={15} />
                        {saved ? "Saved ✓" : "Assign for Today"}
                    </button>
                </div>
            )}
        </>
    )
}

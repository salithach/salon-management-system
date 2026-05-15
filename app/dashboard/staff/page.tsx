"use client"

import { useState } from "react"
import { Scissors, Star, CheckCircle2, Circle, CalendarCheck, Loader2, RotateCcw, UserMinus, UserPlus, X, Trash2 } from "lucide-react"
import { useStaffAssignmentStore } from "@/store/staffStore"
import { toast } from "sonner"
import DropDown from "@/components/DropDown"

const ROLES = ["Senior Stylist", "Stylist", "Nail Technician", "Esthetician", "Barber", "Massage Therapist", "Receptionist"]

type StaffMember = {
    name: string
    role: string
    speciality: string
    appointments: number
    rating: string
    status: string
}

const initialStaff: StaffMember[] = [
    { name: "Mia Chen", role: "Senior Stylist", speciality: "Hair Coloring, Highlights", appointments: 18, rating: "4.9", status: "Available" },
    { name: "Lena Park", role: "Stylist", speciality: "Haircuts, Threading", appointments: 14, rating: "4.8", status: "Available" },
    { name: "Sara Kim", role: "Nail Technician", speciality: "Manicure, Nail Art", appointments: 22, rating: "4.9", status: "Busy" },
    { name: "Jade Rivera", role: "Esthetician", speciality: "Facials, Lash Extensions", appointments: 10, rating: "4.7", status: "Off Today" },
    { name: "Priya Nair", role: "Stylist", speciality: "Blowouts, Deep Conditioning", appointments: 12, rating: "4.8", status: "Available" },
]


const emptyForm = { name: "", role: "", speciality: "" }

export default function StaffPage() {
    const { assignedToday, assign, unassign, clear, _hasHydrated } = useStaffAssignmentStore()
    const [staff, setStaff] = useState<StaffMember[]>(initialStaff)
    const [selected, setSelected] = useState<string[]>([])

    const [showAddModal, setShowAddModal] = useState(false)
    const [form, setForm] = useState(emptyForm)
    const [formErrors, setFormErrors] = useState<string[]>([])
    const [confirmRemove, setConfirmRemove] = useState<string | null>(null)

    if (!_hasHydrated) {
        return (
            <div className="flex items-center justify-center h-48 text-gray-400 gap-2">
                <Loader2 size={18} className="animate-spin" /> Loading staff…
            </div>
        )
    }

    const toggle = (name: string) => {
        if (assignedToday.includes(name)) return
        setSelected((prev) =>
            prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
        )
    }

    const handleAssign = () => {
        const newCount = selected.filter((n) => !assignedToday.includes(n)).length
        assign(selected)
        setSelected([])
        toast.success(`${newCount} staff member${newCount !== 1 ? "s" : ""} assigned for today`)
    }

    const handleClear = () => {
        clear()
        setSelected([])
        toast.success("Today's assignments reset")
    }

    const handleRemoveStaff = (name: string) => {
        setStaff((prev) => prev.filter((s) => s.name !== name))
        setSelected((prev) => prev.filter((n) => n !== name))
        if (assignedToday.includes(name)) unassign(name)
        toast.success(`${name} removed from staff`)
    }

    const openAdd = () => {
        setForm(emptyForm)
        setFormErrors([])
        setShowAddModal(true)
    }

    const handleAddStaff = () => {
        const errs: string[] = []
        if (!form.name.trim()) errs.push("Full name is required.")
        if (!form.role) errs.push("Role is required.")
        if (!form.speciality.trim()) errs.push("Speciality is required.")
        if (staff.some((s) => s.name.toLowerCase() === form.name.trim().toLowerCase()))
            errs.push("A staff member with this name already exists.")
        if (errs.length) { setFormErrors(errs); return }

        const newMember: StaffMember = {
            name: form.name.trim(),
            role: form.role,
            speciality: form.speciality.trim(),
            status: "Available",
            appointments: 0,
            rating: "—",
        }
        setStaff((prev) => [...prev, newMember])
        setShowAddModal(false)
        toast.success(`${newMember.name} added to staff`)
    }

    return (
        <>
            {/* Page header */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-lg font-semibold text-gray-900">Staff</h1>
                    <p className="text-xs text-gray-400 mt-0.5">Manage your team and assign them for today</p>
                </div>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 bg-black text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:opacity-80 transition shrink-0"
                >
                    <UserPlus size={15} /> Add Staff
                </button>
            </div>

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

            {/* Reset banner */}
            {assignedToday.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-3.5 flex items-center justify-between gap-4">
                    <p className="text-xs text-gray-500">
                        <span className="font-medium text-gray-900">{assignedToday.length}</span> staff assigned today.
                        Already-assigned staff cannot be re-selected.
                    </p>
                    <button
                        onClick={handleClear}
                        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-600 border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-lg transition shrink-0"
                    >
                        <RotateCcw size={11} /> Reset Today
                    </button>
                </div>
            )}

            {/* Staff cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {staff.map((member) => {
                    const isSelected = selected.includes(member.name)
                    const isAssigned = assignedToday.includes(member.name)
                    return (
                        <div
                            key={member.name}
                            onClick={() => toggle(member.name)}
                            className={`bg-white rounded-xl border shadow-sm p-5 transition ${
                                isAssigned
                                    ? "border-green-100 cursor-default opacity-75"
                                    : isSelected
                                        ? "border-brand ring-2 ring-brand/20 shadow-md cursor-pointer"
                                        : "border-gray-100 hover:border-gray-300 hover:shadow-md cursor-pointer"
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
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setConfirmRemove(member.name) }}
                                        className="text-gray-300 hover:text-red-500 transition p-0.5 rounded"
                                        title="Remove staff member"
                                    >
                                        <Trash2 size={13} />
                                    </button>
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
                            <div className="mt-3 flex items-center justify-between gap-1.5 text-xs font-medium">
                                {isAssigned
                                    ? <>
                                        <span className="flex items-center gap-1.5 text-green-600">
                                            <CheckCircle2 size={14} className="text-green-500" /> Already assigned
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                unassign(member.name)
                                                toast.success(`${member.name} removed from today's assignments`)
                                            }}
                                            className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition px-2 py-0.5 rounded-md hover:bg-red-50 border border-transparent hover:border-red-100"
                                        >
                                            <UserMinus size={12} /> Unassign
                                        </button>
                                      </>
                                    : isSelected
                                        ? <><CheckCircle2 size={14} className="text-brand" /><span className="text-brand">Selected for today</span></>
                                        : <><Circle size={14} className="text-gray-300" /><span className="text-gray-400">Click to select</span></>
                                }
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Floating assign bar */}
            {selected.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-zinc-800 text-white px-6 py-3.5 rounded-2xl shadow-2xl">
                    <span className="text-sm font-medium">
                        {selected.length} member{selected.length > 1 ? "s" : ""} selected
                    </span>
                    <div className="w-px h-4 bg-white/30" />
                    <button onClick={() => setSelected([])} className="text-sm text-white/70 hover:text-white transition">
                        Clear
                    </button>
                    <button
                        onClick={handleAssign}
                        className="flex items-center gap-2 bg-white text-zinc-800 text-sm font-semibold px-4 py-1.5 rounded-xl hover:opacity-90 transition"
                    >
                        <CalendarCheck size={15} /> Assign for Today
                    </button>
                </div>
            )}

            {/* Confirm Remove Modal */}
            {confirmRemove && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmRemove(null)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                <Trash2 size={17} className="text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900">Remove Staff Member</h3>
                                <p className="text-xs text-gray-500 mt-0.5">This cannot be undone</p>
                            </div>
                        </div>
                        <div className="h-px bg-gray-100" />
                        <p className="text-sm text-gray-600">
                            Are you sure you want to remove <span className="font-semibold text-gray-900">{confirmRemove}</span> from the team?
                        </p>
                        <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                                onClick={() => setConfirmRemove(null)}
                                className="text-sm text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => { handleRemoveStaff(confirmRemove); setConfirmRemove(null) }}
                                className="flex items-center gap-2 text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                            >
                                <Trash2 size={13} /> Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Staff Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">

                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-semibold text-gray-900">Add New Staff</h3>
                                <p className="text-xs text-gray-400 mt-0.5">Fill in the details to add a team member</p>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="h-px bg-gray-100" />

                        {/* Errors */}
                        {formErrors.length > 0 && (
                            <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 space-y-1">
                                {formErrors.map((e) => <p key={e} className="text-xs text-red-600">{e}</p>)}
                            </div>
                        )}

                        {/* Fields */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1.5">Full Name</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="e.g. Jamie Lee"
                                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black text-gray-900 placeholder:text-gray-400 bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1.5">Role</label>
                                <DropDown
                                    options={ROLES}
                                    value={form.role}
                                    onChange={(v) => setForm({ ...form, role: v })}
                                    placeholder="Select a role…"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1.5">Speciality</label>
                                <input
                                    type="text"
                                    value={form.speciality}
                                    onChange={(e) => setForm({ ...form, speciality: e.target.value })}
                                    placeholder="e.g. Haircuts, Balayage"
                                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black text-gray-900 placeholder:text-gray-400 bg-white"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                                type="button"
                                onClick={() => setShowAddModal(false)}
                                className="text-sm text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleAddStaff}
                                className="flex items-center gap-2 bg-black text-white text-sm px-5 py-2 rounded-lg hover:opacity-80 transition"
                            >
                                <UserPlus size={14} /> Add Staff
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

"use client"

import { useState, useEffect } from "react"
import {
    CheckCircle2,
    Circle,
    CalendarCheck,
    Loader2,
    RotateCcw,
    UserMinus,
    UserPlus,
    X,
    Trash2,
    AlertCircle,
    Scissors,
    Mail,
    Phone,
    MapPin,
} from "lucide-react"
import { toast } from "sonner"
import { StaffMember, StaffState, useStaffAssignmentStore} from "@/store/staffStore"
import {useAuthStore} from "@/store/authStore"
import { useShallow } from "zustand/react/shallow"
import LoadingOverlay from "@/components/LoadingOverlay"
import DropDown from "@/components/DropDown"
import { useMetadataStore } from "@/store/metadataStore"

const emptyForm = {name: "", username: "", email: "", phone: "", address: "", role: "", specialty: ""}

export default function StaffPage() {
    const {
        staff, staffLoading, error, fetchStaff, addStaff, removeStaff,
        assignedToday, assign, unassign, clear, fetchAssignments, assignmentsLoading,
    } = useStaffAssignmentStore(
        useShallow((s: StaffState) => ({
            staff:              s.staff,
            staffLoading:       s.staffLoading,
            error:              s.error,
            fetchStaff:         s.fetchStaff,
            addStaff:           s.addStaff,
            removeStaff:        s.removeStaff,
            assignedToday:      s.assignedToday,
            assign:             s.assign,
            unassign:           s.unassign,
            clear:              s.clear,
            fetchAssignments:   s.fetchAssignments,
            assignmentsLoading: s.assignmentsLoading,
        }))
    )

    const { jobRoles, metadataLoading } = useMetadataStore()

    const roleOptions = jobRoles.map((role) => ({ label: role.value, value: role.key }))

    const {_hasHydrated: authReady} = useAuthStore()

    const [selected, setSelected] = useState<string[]>([])
    const [showAddModal, setShowAddModal] = useState(false)
    const [form, setForm] = useState(emptyForm)
    const [formErrors, setFormErrors] = useState<string[]>([])
    const [formSaving, setFormSaving] = useState(false)
    const [confirmRemove, setConfirmRemove] = useState<string | null>(null)
    const [confirmUnassign, setConfirmUnassign] = useState<StaffMember | null>(null)
    const [confirmReset, setConfirmReset] = useState(false)

    // Fetch staff list + today's assignments from backend on load
    // Metadata (jobTypes/jobRoles) is fetched once by the dashboard layout
    useEffect(() => {
        if (!authReady) return
        fetchStaff().then(() => {})
        fetchAssignments().then(() => {})
    }, [authReady, fetchAssignments, fetchStaff])


    if (error) {
        return (
            <div className="flex items-center justify-center h-48 text-red-400 gap-2">
                <AlertCircle size={18}/> {error}
            </div>
        )
    }

    const toggle = (username: string) => {
        if ((assignedToday ?? []).some((m) => m.username === username)) return
        setSelected((prev) =>
            prev.includes(username) ? prev.filter((u) => u !== username) : [...prev, username]
        )
    }

    const handleAssign = async () => {
        const selectedStaff = staff.filter((s) => selected.includes(s.username))
        const newCount = selectedStaff.filter((m) => !(assignedToday ?? []).some((a) => a.username === m.username)).length
        try {
            await assign(selectedStaff)
            setSelected([])
            toast.success(`${newCount} staff member${newCount !== 1 ? "s" : ""} assigned for today`)
        } catch (err) {
            toast.error((err as Error).message)
        }
    }

    const handleClear = async () => {
        try {
            await clear()
            setSelected([])
            toast.success("Today's assignments reset")
        } catch (err) {
            toast.error((err as Error).message)
        }
    }

    const handleRemoveStaff = async (username: string) => {
        const member = staff.find((s) => s.username === username)
        try {
            await removeStaff(username)
            setSelected((prev) => prev.filter((u) => u !== username))
            toast.success(`${member?.name ?? "Staff member"} removed from staff`)
        } catch (err) {
            toast.error((err as Error).message)
        }
    }

    const openAdd = () => {
        setForm(emptyForm)
        setFormErrors([])
        setShowAddModal(true)
    }

    const handleAddStaff = async () => {
        const errs: string[] = []
        if (!form.name.trim()) errs.push("Full name is required.")
        if (!form.username.trim()) errs.push("Username is required.")
        if (!form.email.trim()) errs.push("Email is required.")
        if (!form.phone.trim()) errs.push("Phone is required.")
        if (!form.role) errs.push("Role is required.")
        if (!form.specialty.trim()) errs.push("Specialty is required.")
        if (staff.some((s) => s.username.toLowerCase() === form.username.trim().toLowerCase()))
            errs.push("A staff member with this username already exists.")
        if (errs.length) { setFormErrors(errs); return }

        setFormSaving(true)
        try {
            const matchedJobRole = jobRoles.find((r) => r.key === form.role)
            const newMember = await addStaff({
                name: form.name.trim(),
                username: form.username.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                address: form.address.trim(),
                role: { key: form.role, name: matchedJobRole?.value ?? form.role },
                specialty: form.specialty.trim(),
            })
            setShowAddModal(false)
            toast.success(`${newMember} added to staff`)
        } catch (err) {
            setFormErrors([(err as Error).message])
        } finally {
            setFormSaving(false)
        }
    }

    // Find the name of the member pending confirmation (for display)
    const confirmRemoveMember = confirmRemove ? staff.find((s) => s.username === confirmRemove) : null

    return (
        <>
            {(staffLoading || assignmentsLoading || metadataLoading) && <LoadingOverlay message="Loading staff…" />}
            {/* Page header */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold text-gray-500 mt-0.5">Manage your team and assign them for today</p>
                </div>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 bg-black text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:opacity-80 transition shrink-0"
                >
                    <UserPlus size={15} /> Add Staff
                </button>
            </div>

            {/*Reset banner */}
            {assignedToday && assignedToday.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-3.5 flex items-center justify-between gap-4">
                    <p className="text-xs text-gray-500">
                        <span className="font-medium text-gray-900">{assignedToday.length}</span> staff assigned today.
                        Already-assigned staff cannot be re-selected.
                    </p>
                    <button
                        onClick={() => setConfirmReset(true)}
                        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-600 border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-lg transition shrink-0"
                    >
                        <RotateCcw size={11} /> Reset Today
                    </button>
                </div>
            )}

            {/* Staff cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {staff.map((member) => {
                    const isSelected = selected.includes(member.username)
                    const isAssigned = (assignedToday ?? []).some((m) => m.username === member.username)
                    return (
                        <div
                            key={member.id}
                            onClick={() => toggle(member.username)}
                            className={`bg-white rounded-xl border shadow-sm p-5 transition ${
                                isAssigned
                                    ? "border-green-100 cursor-default opacity-75"
                                    : isSelected
                                        ? "border-brand ring-2 ring-brand/20 shadow-md cursor-pointer"
                                        : "border-gray-100 hover:border-gray-300 hover:shadow-md cursor-pointer"
                            }`}
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-2xl font-semibold shrink-0">
                                    {member.name[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900">{member.name}</p>
                                    <p className="text-xs text-gray-500">{typeof member.role === "object" ? member.role?.name : member.role}</p>
                                </div>
                                <div className="flex flex-col items-end gap-1.5 shrink-0">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setConfirmRemove(member.username) }}
                                        className="text-gray-300 hover:text-red-500 transition p-0.5 rounded"
                                        title="Remove staff member"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mb-2 flex items-center gap-1.5">
                                <Scissors size={12} /> {member.specialty}
                            </p>
                            {member.email && (
                                <p className="text-xs text-gray-400 flex items-center gap-1.5 mb-1">
                                    <Mail size={11} /> {member.email}
                                </p>
                            )}
                            {member.phone && (
                                <p className="text-xs text-gray-400 flex items-center gap-1.5 mb-1">
                                    <Phone size={11} /> {member.phone}
                                </p>
                            )}
                            {member.address && (
                                <p className="text-xs text-gray-400 flex items-center gap-1.5 mb-3">
                                    <MapPin size={11} /> {member.address}
                                </p>
                            )}
                            <div className="mt-3 flex items-center justify-between gap-1.5 text-xs font-medium">
                                {isAssigned
                                    ? <>
                                        <span className="flex items-center gap-1.5 text-green-600">
                                            <CheckCircle2 size={14} className="text-green-500" /> Already assigned
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setConfirmUnassign(member)
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

            {/* Confirm Remove Modal */}            {confirmRemove && (
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
                            Are you sure you want to remove <span className="font-semibold text-gray-900">{confirmRemoveMember?.name ?? "this staff member"}</span> from the team?
                        </p>
                        <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                                onClick={() => setConfirmRemove(null)}
                                className="text-sm text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => { handleRemoveStaff(confirmRemove).then(() => {}); setConfirmRemove(null) }}
                                className="flex items-center gap-2 text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                            >
                                <Trash2 size={13} /> Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Unassign Modal */}
            {confirmUnassign && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmUnassign(null)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                                <UserMinus size={17} className="text-amber-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900">Unassign Staff Member</h3>
                                <p className="text-xs text-gray-500 mt-0.5">They will be removed from today&apos;s schedule</p>
                            </div>
                        </div>
                        <div className="h-px bg-gray-100" />
                        <p className="text-sm text-gray-600">
                            Are you sure you want to unassign <span className="font-semibold text-gray-900">{confirmUnassign.name}</span> from today?
                        </p>
                        <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                                onClick={() => setConfirmUnassign(null)}
                                className="text-sm text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    const member = confirmUnassign
                                    setConfirmUnassign(null)
                                    try {
                                        await unassign(member)
                                        toast.success(`${member.name} removed from today's assignments`)
                                    } catch (err) {
                                        toast.error((err as Error).message)
                                    }
                                }}
                                className="flex items-center gap-2 text-sm bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition"
                            >
                                <UserMinus size={13} /> Unassign
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

                        {formErrors.length > 0 && (
                            <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 space-y-1">
                                {formErrors.map((e) => <p key={e} className="text-xs text-red-600">{e}</p>)}
                            </div>
                        )}

                        <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1.5">Full Name <span className="text-red-400">*</span></label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="e.g. Jamie Lee"
                                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black text-gray-900 placeholder:text-gray-400 bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1.5">Username <span className="text-red-400">*</span></label>
                                <input
                                    type="text"
                                    value={form.username}
                                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                                    placeholder="e.g. jamie.lee"
                                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black text-gray-900 placeholder:text-gray-400 bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1.5">Email <span className="text-red-400">*</span></label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    placeholder="e.g. jamie@example.com"
                                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black text-gray-900 placeholder:text-gray-400 bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone <span className="text-red-400">*</span></label>
                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    placeholder="e.g. +1 555 000 1234"
                                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black text-gray-900 placeholder:text-gray-400 bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1.5">Address</label>
                                <input
                                    type="text"
                                    value={form.address}
                                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                                    placeholder="e.g. 123 Main St, City"
                                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black text-gray-900 placeholder:text-gray-400 bg-white"
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1.5">
                                    Role <span className="text-red-400">*</span>
                                    {metadataLoading && <Loader2 size={11} className="animate-spin text-gray-400" />}
                                </label>
                                <DropDown
                                    options={roleOptions}
                                    value={form.role}
                                    onChange={(v) => setForm({ ...form, role: v })}
                                    placeholder={metadataLoading ? "Loading roles…" : roleOptions.length === 0 ? "No roles available" : "Select a role…"}
                                    disabled={metadataLoading}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1.5">Specialty <span className="text-red-400">*</span></label>
                                <input
                                    type="text"
                                    value={form.specialty}
                                    onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                                    placeholder="e.g. Haircuts, Balayage"
                                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black text-gray-900 placeholder:text-gray-400 bg-white"
                                />
                            </div>
                        </div>

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
                                disabled={formSaving}
                                className="flex items-center gap-2 bg-black text-white text-sm px-5 py-2 rounded-lg hover:opacity-80 transition disabled:opacity-50"
                            >
                                {formSaving ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
                                {formSaving ? "Adding…" : "Add Staff"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Reset Today Modal */}
            {confirmReset && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmReset(false)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                <RotateCcw size={17} className="text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900">Reset Today&apos;s Assignments</h3>
                                <p className="text-xs text-gray-500 mt-0.5">This cannot be undone</p>
                            </div>
                        </div>
                        <div className="h-px bg-gray-100" />
                        <p className="text-sm text-gray-600">
                            Are you sure you want to remove all{" "}
                            <span className="font-semibold text-gray-900">{(assignedToday ?? []).length} assigned</span>{" "}
                            staff members from today&apos;s schedule?
                        </p>
                        <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                                onClick={() => setConfirmReset(false)}
                                className="text-sm text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    setConfirmReset(false)
                                    await handleClear()
                                }}
                                className="flex items-center gap-2 text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                            >
                                <RotateCcw size={13} /> Reset Today
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

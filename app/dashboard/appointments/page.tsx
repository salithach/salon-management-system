"use client"

import { useState, useMemo, useEffect } from "react"
import {
    CalendarDays, ChevronLeft, ChevronRight, Plus, X,
    Clock, User, Scissors, Phone, FileText, Trash2, Pencil,
    CheckCircle2, AlertCircle, XCircle,
} from "lucide-react"
import { toast } from "sonner"
import { useAppointmentStore, Appointment, AppointmentStatus } from "@/store/appointmentStore"
import { useStaffAssignmentStore } from "@/store/staffStore"
import { useMetadataStore } from "@/store/metadataStore"
import { useAuthStore } from "@/store/authStore"
import DropDown from "@/components/DropDown"
import LoadingOverlay from "@/components/LoadingOverlay"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toYMD(d: Date) {
    return d.toISOString().slice(0, 10)
}

function formatTime(t: string) {
    const [h, m] = t.split(":").map(Number)
    const ampm = h >= 12 ? "PM" : "AM"
    return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${ampm}`
}

function formatDateLabel(ymd: string) {
    const d = new Date(ymd + "T00:00:00")
    return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
}

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; color: string; icon: React.ReactNode }> = {
    CONFIRMED: { label: "Confirmed", color: "bg-emerald-100 text-emerald-700", icon: <CheckCircle2 size={11} /> },
    PENDING:   { label: "Pending",   color: "bg-amber-100 text-amber-700",    icon: <AlertCircle  size={11} /> },
    CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-600",        icon: <XCircle      size={11} /> },
}

// Resolve service keys → human-readable labels (falls back to key if not found)
function resolveServices(services: unknown, jobTypes: { key: string; value: string }[]): string {
    const arr: string[] = Array.isArray(services) ? (services as string[])
        : typeof services === "string" && services ? [services] : []
    return arr.map((key) => jobTypes.find((jt) => jt.key === key)?.value ?? key).join(", ")
}

const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
    const h = String(i).padStart(2, "0")
    return [`${h}:00`, `${h}:30`]
}).flat().filter((t) => t >= "08:00" && t <= "20:00")

// ─── Booking Modal ─────────────────────────────────────────────────────────────

type BookingForm = {
    date: string; time: string; clientName: string; clientPhone: string; clientEmail: string
    services: string[]; assignee: string; status: AppointmentStatus; notes: string
}

const emptyForm = (date: string): BookingForm => ({
    date, time: "09:00", clientName: "", clientPhone: "", clientEmail: "",
    services: [], assignee: "", status: "CONFIRMED", notes: "",
})

function BookingModal({ initial, editId, onClose }: { initial: BookingForm; editId: string | null; onClose: () => void }) {
    const { addAppointment, updateAppointment } = useAppointmentStore()
    const { staff, fetchStaff, staffLoading } = useStaffAssignmentStore()
    const { jobTypes, metadataLoading, fetchMetadata } = useMetadataStore()
    const { user } = useAuthStore()
    const [form, setForm] = useState<BookingForm>(initial)
    const [errors, setErrors] = useState<string[]>([])
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetchStaff().then(() => {})
        fetchMetadata({ force: false, tenantId: user?.username, user }).then(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const f = (k: keyof BookingForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
        setForm((p) => ({ ...p, [k]: e.target.value }))

    // Same as "Add Job" modal: key as value, label as display
    const jobTypeOptions = jobTypes
        .map((t) => ({ label: t.value, value: t.key }))
        .sort((a, b) => a.label.localeCompare(b.label))

    const handleSave = async () => {
        const errs: string[] = []
        if (!form.clientName.trim()) errs.push("Client name is required.")
        if (!form.date) errs.push("Date is required.")
        if (form.services.length === 0) errs.push("At least one service is required.")
        if (!form.assignee.trim()) errs.push("Stylist is required.")
        if (errs.length) { setErrors(errs); return }
        setSaving(true)
        try {
            const payload = {
                date: form.date, time: form.time,
                client: { name: form.clientName, phone: form.clientPhone || undefined, email: form.clientEmail || undefined },
                services: form.services, assignee: form.assignee,
                status: form.status, notes: form.notes || undefined,
            }
            if (editId) {
                await updateAppointment(editId, payload)
                toast.success("Appointment updated")
            } else {
                await addAppointment(payload)
                toast.success("Booking created!", { description: `${form.clientName} — ${formatTime(form.time)}` })
            }
            onClose()
        } catch (err) {
            toast.error((err as Error).message)
        } finally {
            setSaving(false)
        }
    }

    const inp = "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-zinc-800 bg-white text-gray-900"
    const lbl = "block text-xs font-medium text-gray-600 mb-1.5"

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-semibold text-gray-900">{editId ? "Edit Appointment" : "New Booking"}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Fill in the appointment details below</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition"><X size={20} /></button>
                </div>
                <div className="h-px bg-gray-100" />
                {errors.length > 0 && (
                    <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 space-y-1">
                        {errors.map((e) => <p key={e} className="text-xs text-red-600">{e}</p>)}
                    </div>
                )}
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={lbl}><User size={11} className="inline mr-1" />Client Name <span className="text-red-400">*</span></label>
                            <input type="text" value={form.clientName} onChange={f("clientName")} placeholder="e.g. Emma Johnson" className={inp} />
                        </div>
                        <div>
                            <label className={lbl}><Phone size={11} className="inline mr-1" />Phone</label>
                            <input type="tel" value={form.clientPhone} onChange={f("clientPhone")} placeholder="e.g. 555-0101" className={inp} />
                        </div>
                        <div className="sm:col-span-2">
                            <label className={lbl}>✉ Email</label>
                            <input type="email" value={form.clientEmail} onChange={f("clientEmail")} placeholder="e.g. emma@example.com" className={inp} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={lbl}><CalendarDays size={11} className="inline mr-1" />Date <span className="text-red-400">*</span></label>
                            <input type="date" value={form.date} onChange={f("date")} className={inp} />
                        </div>
                        <div>
                            <label className={lbl}><Clock size={11} className="inline mr-1" />Time <span className="text-red-400">*</span></label>
                            <DropDown
                                options={TIME_SLOTS.map((t) => ({ label: formatTime(t), value: t }))}
                                value={form.time}
                                onChange={(v) => setForm((p) => ({ ...p, time: v }))}
                            />
                        </div>
                    </div>
                    <div>
                        <label className={lbl}>
                            <Scissors size={11} className="inline mr-1" />Services <span className="text-red-400">*</span>
                            {metadataLoading && <span className="text-gray-400 text-[10px] ml-1">Loading…</span>}
                        </label>
                        <DropDown
                            multiple
                            options={jobTypeOptions}
                            value={form.services}
                            onChange={(v) => setForm((p) => ({ ...p, services: v }))}
                            placeholder={metadataLoading ? "Loading services…" : "Select services…"}
                            disabled={metadataLoading}
                        />
                    </div>
                    <div>
                        <label className={lbl}><User size={11} className="inline mr-1" />Stylist <span className="text-red-400">*</span></label>
                        <DropDown
                            options={staff.map((s) => ({ label: s.name, value: s.name }))}
                            value={form.assignee}
                            onChange={(v) => setForm((p) => ({ ...p, assignee: v }))}
                            placeholder={staffLoading ? "Loading staff…" : "Select a stylist…"}
                            disabled={staffLoading}
                        />
                    </div>
                    <div>
                        <label className={lbl}>Status</label>
                        <DropDown
                            options={[
                                { label: "Confirmed", value: "CONFIRMED" },
                                { label: "Pending",   value: "PENDING"   },
                                { label: "Cancelled", value: "CANCELLED" },
                            ]}
                            value={form.status}
                            onChange={(v) => setForm((p) => ({ ...p, status: v as AppointmentStatus }))}
                        />
                    </div>
                    <div>
                        <label className={lbl}><FileText size={11} className="inline mr-1" />Notes</label>
                        <textarea value={form.notes} onChange={f("notes")} placeholder="Any special requests or notes…" rows={2} className={`${inp} resize-none`} />
                    </div>
                </div>
                <div className="flex gap-3 pt-1">
                    <button onClick={onClose} disabled={saving} className="flex-1 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50">Cancel</button>
                    <button onClick={handleSave} disabled={saving}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition disabled:opacity-50">
                        {saving ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</> : editId ? "Save Changes" : "Create Booking"}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Mini Calendar ─────────────────────────────────────────────────────────────

function MiniCalendar({ selected, onSelect, appointmentDates }: { selected: string; onSelect: (ymd: string) => void; appointmentDates: Set<string> }) {
    const [viewDate, setViewDate] = useState(() => {
        const d = new Date(selected + "T00:00:00")
        return new Date(d.getFullYear(), d.getMonth(), 1)
    })
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDay = new Date(year, month, 1).getDay()
    const today = toYMD(new Date())
    const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 select-none">
            <div className="flex items-center justify-between mb-3">
                <button onClick={() => setViewDate(new Date(year, month - 1, 1))} className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-500"><ChevronLeft size={16} /></button>
                <span className="text-sm font-semibold text-gray-900">{viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
                <button onClick={() => setViewDate(new Date(year, month + 1, 1))} className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-500"><ChevronRight size={16} /></button>
            </div>
            <div className="grid grid-cols-7 mb-1">
                {["Su","Mo","Tu","We","Th","Fr","Sa"].map((d) => (
                    <div key={d} className="text-center text-[10px] font-medium text-gray-400 py-1">{d}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-y-1">
                {cells.map((day, i) => {
                    if (!day) return <div key={`e-${i}`} />
                    const ymd = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                    const isSel = ymd === selected
                    const isToday = ymd === today
                    const hasAppt = appointmentDates.has(ymd)
                    return (
                        <button key={ymd} onClick={() => onSelect(ymd)}
                            className={`relative flex flex-col items-center justify-center h-8 w-full rounded-lg text-xs transition
                                ${isSel ? "bg-zinc-800 text-white font-semibold" : isToday ? "border border-zinc-800 text-zinc-800 font-semibold" : "text-gray-700 hover:bg-gray-100"}`}>
                            {day}
                            {hasAppt && <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isSel ? "bg-white" : "bg-zinc-800"}`} />}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

// ─── Appointment Card ──────────────────────────────────────────────────────────

function AppointmentCard({ appt, onEdit, onDelete, onStatusChange }: { appt: Appointment; onEdit: () => void; onDelete: () => void; onStatusChange: (s: AppointmentStatus) => void }) {
    const cfg = STATUS_CONFIG[appt.status] ?? STATUS_CONFIG["PENDING"]
    const { jobTypes } = useMetadataStore()
    return (
        <div className="bg-white border border-gray-100 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition space-y-3">
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-gray-900">{appt.client.name}</p>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${cfg.color}`}>{cfg.icon} {cfg.label}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{appt.client.phone || "—"}{appt.client.email ? ` · ${appt.client.email}` : ""}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                    <button onClick={onEdit} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"><Pencil size={13} /></button>
                    <button onClick={onDelete} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={13} /></button>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-gray-600"><Clock size={11} className="text-gray-400 shrink-0" /><span>{formatTime(appt.time)}</span></div>
                <div className="flex items-center gap-1.5 text-gray-600 col-span-2"><Scissors size={11} className="text-gray-400 shrink-0" /><span className="truncate">{resolveServices(appt.services, jobTypes)}</span></div>
                <div className="flex items-center gap-1.5 text-gray-600 col-span-3"><User size={11} className="text-gray-400 shrink-0" /><span>{appt.assignee}</span></div>
            </div>
            {appt.notes && <p className="text-xs text-gray-400 italic truncate">{appt.notes}</p>}
            {appt.status !== "CANCELLED" && (
                <div className="flex gap-2 pt-1 border-t border-gray-50">
                    {(["CONFIRMED", "PENDING", "CANCELLED"] as AppointmentStatus[]).filter((s) => s !== appt.status).map((s) => (
                        <button key={s} onClick={() => onStatusChange(s)}
                            className="text-[10px] text-gray-500 border border-gray-200 px-2.5 py-1 rounded-full hover:bg-gray-50 transition">
                            Mark {STATUS_CONFIG[s].label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function AppointmentsPage() {
    const today = toYMD(new Date())
    const { appointments, appointmentsLoading, fetchAppointments, deleteAppointment, updateAppointment, updateStatus } = useAppointmentStore()
    const { jobTypes } = useMetadataStore()
    const [selectedDate, setSelectedDate] = useState(today)
    const [modal, setModal] = useState<{ form: BookingForm; editId: string | null } | null>(null)
    const [confirmDel, setConfirmDel] = useState<string | null>(null)

    // Fetch appointments for the selected date whenever it changes
    useEffect(() => {
        fetchAppointments(selectedDate).then(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDate])

    const dayAppts = useMemo(
        () => appointments.filter((a) => a.date === selectedDate).sort((a, b) => a.time.localeCompare(b.time)),
        [appointments, selectedDate]
    )

    const pendingCount = appointments.filter((a) => a.status === "PENDING").length
    const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    const weekEnd = new Date(weekStart); weekEnd.setDate(weekEnd.getDate() + 6)
    const weekCount = appointments.filter((a) => { const d = new Date(a.date + "T00:00:00"); return d >= weekStart && d <= weekEnd }).length
    const apptDates = useMemo(() => new Set(appointments.map((a) => a.date)), [appointments])

    const openNew  = () => setModal({ form: emptyForm(selectedDate), editId: null })
    const openEdit = (appt: Appointment) => setModal({
        form: {
            date: appt.date,
            time: appt.time?.slice(0, 5) ?? "09:00",
            clientName: appt.client.name,
            clientPhone: appt.client.phone ?? "",
            clientEmail: appt.client.email ?? "",
            services: Array.isArray(appt.services) ? appt.services : appt.services ? [appt.services as unknown as string] : [],
            assignee: appt.assignee,
            status: appt.status,
            notes: appt.notes ?? "",
        },
        editId: appt.id,
    })

    return (
        <>
            {appointmentsLoading && <LoadingOverlay message="Loading appointments…" />}
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Today's Bookings",     value: appointments.filter((a) => a.date === today).length },
                    { label: "Pending Confirmation", value: pendingCount },
                    { label: "This Week",            value: weekCount },
                ].map((s) => (
                    <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                        <p className="text-3xl font-bold text-gray-900">{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Main layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4">

                {/* Left: calendar + upcoming */}
                <div className="space-y-4">
                    <MiniCalendar selected={selectedDate} onSelect={setSelectedDate} appointmentDates={apptDates} />

                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Upcoming</p>
                        {appointments
                            .filter((a) => a.date >= today && a.status !== "CANCELLED")
                            .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
                            .slice(0, 5)
                            .map((a) => (
                                <button key={a.id} onClick={() => setSelectedDate(a.date)}
                                    className="w-full flex items-start gap-3 py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition text-left">
                                    <div className="flex flex-col items-center text-center min-w-8">
                                        <span className="text-[10px] text-gray-400 uppercase">{new Date(a.date + "T00:00:00").toLocaleDateString("en-US", { month: "short" })}</span>
                                        <span className="text-sm font-bold text-gray-900 leading-tight">{new Date(a.date + "T00:00:00").getDate()}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-gray-800 truncate">{a.client.name}</p>
                                        <p className="text-[10px] text-gray-400 truncate">{formatTime(a.time)} · {resolveServices(a.services, jobTypes)}</p>
                                    </div>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${(STATUS_CONFIG[a.status] ?? STATUS_CONFIG["PENDING"]).color}`}>{(STATUS_CONFIG[a.status] ?? STATUS_CONFIG["PENDING"]).label}</span>
                                </button>
                            ))}
                        {appointments.filter((a) => a.date >= today && a.status !== "CANCELLED").length === 0 && (
                            <p className="text-xs text-gray-400 text-center py-4">No upcoming appointments</p>
                        )}
                    </div>
                </div>

                {/* Right: day view */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-120">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap">
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">{formatDateLabel(selectedDate)}</h2>
                            <p className="text-xs text-gray-400 mt-0.5">{dayAppts.length === 0 ? "No appointments scheduled" : `${dayAppts.length} appointment${dayAppts.length > 1 ? "s" : ""}`}</p>
                        </div>
                        <button onClick={openNew} className="flex items-center gap-1.5 text-sm bg-zinc-800 text-white px-4 py-2 rounded-lg hover:bg-zinc-700 transition">
                            <Plus size={14} /> New Booking
                        </button>
                    </div>
                    <div className="p-4 space-y-3 flex-1 overflow-y-auto">
                        {dayAppts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                                    <CalendarDays size={22} className="text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">No bookings for this day</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Click &quot;New Booking&quot; to schedule one</p>
                                </div>
                            </div>
                        ) : dayAppts.map((appt) => (
                            <AppointmentCard
                                key={appt.id}
                                appt={appt}
                                onEdit={() => openEdit(appt)}
                                onDelete={() => setConfirmDel(appt.id)}
                                onStatusChange={async (s) => {
                                    try {
                                        await updateStatus(appt.id, s)
                                        toast.success(`Marked as ${STATUS_CONFIG[s].label}`)
                                    } catch (err) {
                                        toast.error((err as Error).message)
                                    }
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Booking modal */}
            {modal && <BookingModal initial={modal.form} editId={modal.editId} onClose={() => setModal(null)} />}

            {/* Delete confirm */}
            {confirmDel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmDel(null)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0"><Trash2 size={17} className="text-red-600" /></div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900">Remove Appointment</h3>
                                <p className="text-xs text-gray-500 mt-0.5">This action cannot be undone.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setConfirmDel(null)} className="flex-1 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition">Cancel</button>
                            <button onClick={async () => {
                                try {
                                    await deleteAppointment(confirmDel)
                                    setConfirmDel(null)
                                    toast.success("Appointment removed")
                                } catch (err) {
                                    toast.error((err as Error).message)
                                }
                            }}
                                className="flex-1 py-2.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Remove</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}


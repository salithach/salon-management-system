"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import {
    ArrowLeft, Building2, User, MapPin, Globe, Phone,
    Users, Scissors, Save, Loader2, AlertCircle, UserCheck, RefreshCw, UserPlus, X, ShieldCheck, CheckCircle2
} from "lucide-react"
import { useAdminStore, Salon, AdminStaffMember, AddStaffPayload, JobRole } from "@/store/adminStore"
import { useMetadataStore } from "@/store/metadataStore"
import { useSalonStore } from "@/store/salonStore"
import { useAuthStore } from "@/store/authStore"
import LoadingOverlay from "@/components/LoadingOverlay"
import DropDown from "@/components/DropDown"

type Tab = "info" | "staff" | "services" | "roles"

export default function AdminSalonDetailPage() {
    const { id } = useParams<{ id: string }>()
    const router = useRouter()
    const { _hasHydrated, user } = useAuthStore()
    const {
        selectedSalon, selectedSalonLoading,
        salonStaff, salonStaffLoading,
        salonRoles, salonRolesLoading,
        saving,
        fetchSalonById, fetchSalonStaff, updateSalon, addSalonStaff,
        fetchSalonRoles, addSalonRole, activateUser,
    } = useAdminStore()

    const [activating, setActivating] = useState(false)

    const handleActivate = async () => {
        setActivating(true)
        try {
            await activateUser(id)
            toast.success("User activated successfully")
        } catch (err) {
            toast.error((err as Error).message)
        } finally {
            setActivating(false)
        }
    }

    const [activeTab, setActiveTab] = useState<Tab>("info")
    const [form, setForm] = useState<Partial<Salon>>({})

    // Load on mount — read store imperatively to avoid stale closure from transition render
    useEffect(() => {
        if (!_hasHydrated) return
        const current = useAdminStore.getState().selectedSalon
        const options = { force: false, tenantId: selectedSalon?.username, user }
        if (current && current.id === id) {
            // Salon already passed from the list — only fetch staff
            fetchSalonStaff(id, options).then(() =>{})
        } else {
            // Direct URL access or different salon — fetch both
            fetchSalonById(id).then(() =>{})
            fetchSalonStaff(id, options).then(() =>{})
        }
    }, [_hasHydrated, id]) // eslint-disable-line react-hooks/exhaustive-deps

    // Sync form when salon loads
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (selectedSalon) setForm(selectedSalon)
    }, [selectedSalon])

    const field = (key: keyof Salon) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((f) => ({ ...f, [key]: e.target.value }))

    const handleSave = async () => {
        try {
            await updateSalon(id, form)
            toast.success("Salon updated successfully")
        } catch (err) {
            toast.error((err as Error).message)
        }
    }

    const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
        { key: "info",     label: "Salon Info", icon: Building2   },
        { key: "staff",    label: "Staff",      icon: Users       },
        { key: "services", label: "Services",   icon: Scissors    },
        { key: "roles",    label: "Job Roles",  icon: ShieldCheck },
    ]

    return (
        <>
            {(selectedSalonLoading || salonStaffLoading) && <LoadingOverlay message="Loading salon…" />}

            {/* Back + breadcrumb */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition"
                >
                    <ArrowLeft size={16} /> Back
                </button>
                <span className="text-gray-300">/</span>
                <span className="text-sm text-gray-700 font-medium truncate">
                    {selectedSalon?.salonName ?? id}
                </span>
            </div>

            {/* Hero card */}
            {selectedSalon && (
                <div className="bg-linear-to-br from-indigo-950 to-indigo-800 rounded-2xl p-6 text-white flex items-start gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-bold shrink-0">
                        {(selectedSalon.salonName?.[0] ?? "S").toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h2 className="text-xl font-bold">{selectedSalon.salonName}</h2>
                            {/* Status badge — shown when backend provides the field */}
                            {selectedSalon.active === true && (
                                <span className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
                                    <CheckCircle2 size={10} /> Active
                                </span>
                            )}
                            {selectedSalon.active === false && (
                                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                    Pending Activation
                                </span>
                            )}
                        </div>
                        <p className="text-indigo-300 text-sm mt-0.5">{selectedSalon.salonType}</p>
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-indigo-200">
                            {selectedSalon.ownerName && (
                                <span className="flex items-center gap-1"><User size={11} />{selectedSalon.ownerName}</span>
                            )}
                            {(selectedSalon.city || selectedSalon.country) && (
                                <span className="flex items-center gap-1">
                                    <MapPin size={11} />
                                    {[selectedSalon.city, selectedSalon.state, selectedSalon.country].filter(Boolean).join(", ")}
                                </span>
                            )}
                            {selectedSalon.website && (
                                <span className="flex items-center gap-1"><Globe size={11} />{selectedSalon.website}</span>
                            )}
                        </div>
                    </div>
                    {/* Activate button — always visible unless confirmed active */}
                    {selectedSalon.active !== true && (
                        <button
                            onClick={handleActivate}
                            disabled={activating}
                            className="flex items-center gap-1.5 shrink-0 px-4 py-2 text-xs font-semibold bg-amber-400 text-amber-900 rounded-lg hover:bg-amber-300 transition disabled:opacity-60"
                        >
                            {activating
                                ? <><Loader2 size={12} className="animate-spin" /> Activating…</>
                                : <><CheckCircle2 size={12} /> Activate User</>
                            }
                        </button>
                    )}
                </div>
            )}

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <div className="flex gap-0">
                    {tabs.map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition ${
                                activeTab === key
                                    ? "border-indigo-600 text-indigo-600"
                                    : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                            }`}
                        >
                            <Icon size={15} />
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab panels */}
            {activeTab === "info" && (
                <InfoTab
                    form={form}
                    field={field}
                    saving={saving}
                    onSave={handleSave}
                    hasSalon={!!selectedSalon}
                    onSalonTypeChange={(v) => setForm((f) => ({ ...f, salonType: v }))}
                />
            )}

            {activeTab === "staff" && (
                <StaffTab
                    staff={salonStaff}
                    loading={salonStaffLoading}
                    onRefresh={() => fetchSalonStaff(id, { force: false, tenantId: selectedSalon?.username, user })}
                    onAddStaff={(payload) => addSalonStaff(id, { force: false, tenantId: selectedSalon?.username, user }, payload)}
                />
            )}

            {activeTab === "services" && (
                <ServicesTab salonId={id} />
            )}

            {activeTab === "roles" && (
                <RolesTab
                    salonId={id}
                    roles={salonRoles}
                    loading={salonRolesLoading}
                    onRefresh={() => fetchSalonRoles(id)}
                    onAddRole={(entry: JobRole) => addSalonRole(id, entry)}
                />
            )}
        </>
    )
}

/* ────────────────────────────── Info Tab ────────────────────────────── */
function InfoTab({
    form,
    field,
    saving,
    onSave,
    hasSalon,
    onSalonTypeChange,
}: {
    form: Partial<Salon>
    field: (k: keyof Salon) => (e: React.ChangeEvent<HTMLInputElement>) => void
    saving: boolean
    onSave: () => void
    hasSalon: boolean
    onSalonTypeChange: (value: string) => void
}) {
    const { salonTypeOptions, salonTypesLoading, fetchSalonTypes } = useSalonStore()

    useEffect(() => {
        fetchSalonTypes().then(() => {})
    }, [fetchSalonTypes])
    if (!hasSalon) {
        return (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center">
                <AlertCircle size={28} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-400">Salon details not available</p>
            </div>
        )
    }

    const inp = "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
    const inpDisabled = "w-full px-3 py-2.5 text-sm border border-gray-100 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed select-all"
    const lbl = "block text-xs font-medium text-gray-600 mb-1.5"

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">

            {/* Salon section */}
            <section>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Building2 size={13} /> Salon Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className={lbl}>Username <span className="text-gray-400 font-normal">(read-only)</span></label>
                        <input className={inpDisabled} value={form.username ?? ""} readOnly disabled />
                    </div>
                    <div>
                        <label className={lbl}>Salon Name</label>
                        <input className={inp} value={form.salonName ?? ""} onChange={field("salonName")} placeholder="Salon name" />
                    </div>
                    <div>
                        <label className={lbl}>Salon Type</label>
                        <DropDown
                            options={salonTypeOptions}
                            value={form.salonType ?? ""}
                            onChange={(v) => onSalonTypeChange(v as string)}
                            placeholder={salonTypesLoading ? "Loading types…" : "Select a type…"}
                            disabled={salonTypesLoading}
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label className={lbl}>Website</label>
                        <input className={inp} value={form.website ?? ""} onChange={field("website")} placeholder="https://…" />
                    </div>
                </div>
            </section>

            {/* Owner section */}
            <section>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <User size={13} /> Owner Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className={lbl}>Owner Name</label>
                        <input className={inp} value={form.ownerName ?? ""} onChange={field("ownerName")} placeholder="Full name" />
                    </div>
                    <div>
                        <label className={lbl}>Phone</label>
                        <input className={inp} value={form.phone ?? ""} onChange={field("phone")} placeholder="+1 (555) 000-0000" />
                        </div>
                </div>
            </section>

            {/* Location section */}
            <section>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <MapPin size={13} /> Location
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                        <label className={lbl}>Street Address</label>
                        <input className={inp} value={form.address ?? ""} onChange={field("address")} placeholder="123 Main St" />
                    </div>
                    <div>
                        <label className={lbl}>City</label>
                        <input className={inp} value={form.city ?? ""} onChange={field("city")} placeholder="City" />
                    </div>
                    <div>
                        <label className={lbl}>State / Province</label>
                        <input className={inp} value={form.state ?? ""} onChange={field("state")} placeholder="State" />
                    </div>
                    <div>
                        <label className={lbl}>ZIP / Postal Code</label>
                        <input className={inp} value={form.zipCode ?? ""} onChange={field("zipCode")} placeholder="ZIP" />
                    </div>
                    <div>
                        <label className={lbl}>Country</label>
                        <input className={inp} value={form.country ?? ""} onChange={field("country")} placeholder="Country" />
                    </div>
                </div>
            </section>

            {/* Save button */}
            <div className="flex justify-end pt-2 border-t border-gray-100">
                <button
                    onClick={onSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-indigo-950 text-white rounded-lg hover:bg-indigo-800 transition disabled:opacity-50"
                >
                    {saving
                        ? <><Loader2 size={14} className="animate-spin" /> Saving…</>
                        : <><Save size={14} /> Save Changes</>
                    }
                </button>
            </div>
        </div>
    )
}

/* ────────────────────────────── Staff Tab ───────────────────────────── */
const emptyStaffForm = { name: "", username: "", email: "", phone: "", address: "", role: "", specialty: "" }

function StaffTab({
    staff,
    loading,
    onRefresh,
    onAddStaff,
}: {
    staff: AdminStaffMember[]
    loading: boolean
    onRefresh: () => void
    onAddStaff: (payload: AddStaffPayload) => Promise<void>
}) {
    const { jobRoles, metadataLoading } = useMetadataStore()
    const roleOptions = jobRoles.map((r) => ({ label: r.value, value: r.key }))

    const [showModal, setShowModal]     = useState(false)
    const [form, setForm]               = useState(emptyStaffForm)
    const [formErrors, setFormErrors]   = useState<string[]>([])
    const [formSaving, setFormSaving]   = useState(false)

    const openModal = () => { setForm(emptyStaffForm); setFormErrors([]); setShowModal(true) }

    const handleAdd = async () => {
        const errs: string[] = []
        if (!form.name.trim())     errs.push("Full name is required.")
        if (!form.username.trim()) errs.push("Username is required.")
        if (!form.email.trim())    errs.push("Email is required.")
        if (!form.phone.trim())    errs.push("Phone is required.")
        if (!form.role)            errs.push("Role is required.")
        if (!form.specialty.trim()) errs.push("Specialty is required.")
        if (errs.length) { setFormErrors(errs); return }

        setFormSaving(true)
        try {
            const matched = jobRoles.find((r) => r.key === form.role)
            await onAddStaff({
                name:      form.name.trim(),
                username:  form.username.trim(),
                email:     form.email.trim(),
                phone:     form.phone.trim(),
                address:   form.address.trim(),
                role:      { key: form.role, name: matched?.value ?? form.role },
                specialty: form.specialty.trim(),
            })
            setShowModal(false)
            toast.success(`${form.name.trim()} added to staff`)
        } catch (err) {
            setFormErrors([(err as Error).message])
        } finally {
            setFormSaving(false)
        }
    }

    const inp = "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder:text-gray-400 bg-white"
    const lbl = "block text-xs font-medium text-gray-600 mb-1.5"

    return (
        <>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Users size={15} className="text-gray-400" />
                    <span className="text-sm font-semibold text-gray-900">
                        Staff Members <span className="ml-1 text-xs font-normal text-gray-400">({staff.length})</span>
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onRefresh}
                        disabled={loading}
                        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                    >
                        <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
                        Refresh
                    </button>
                    <button
                        onClick={openModal}
                        className="flex items-center gap-1.5 text-xs font-medium bg-indigo-950 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-800 transition"
                    >
                        <UserPlus size={12} /> Add Staff
                    </button>
                </div>
            </div>

            {/* Body */}
            {loading ? (
                <div className="p-10 text-center">
                    <Loader2 size={24} className="animate-spin mx-auto text-indigo-400 mb-2" />
                    <p className="text-sm text-gray-400">Loading staff…</p>
                </div>
            ) : staff.length === 0 ? (
                <div className="p-10 text-center">
                    <UserCheck size={28} className="mx-auto text-gray-200 mb-2" />
                    <p className="text-sm text-gray-400">No staff members found for this salon</p>
                </div>
            ) : (
                <div className="divide-y divide-gray-50">
                    {staff.map((member) => {
                        const role = typeof member.role === "object"
                            ? member.role?.name ?? member.role?.key
                            : member.role
                        return (
                            <div key={member.id ?? member.username} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-sm shrink-0">
                                    {(member.name?.[0] ?? "?").toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900">{member.name}</p>
                                    <p className="text-xs text-gray-400">{member.username}</p>
                                </div>
                                <div className="hidden sm:block text-right">
                                    <p className="text-xs text-gray-500">{role ?? "—"}</p>
                                    {member.specialty && <p className="text-[10px] text-gray-400">{member.specialty}</p>}
                                </div>
                                {member.phone && (
                                    <div className="hidden md:flex items-center gap-1 text-xs text-gray-400">
                                        <Phone size={11} />{member.phone}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>

        {/* Add Staff Modal */}
        {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-semibold text-gray-900">Add New Staff</h3>
                            <p className="text-xs text-gray-400 mt-0.5">Fill in the details to add a team member</p>
                        </div>
                        <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                            <X size={18} />
                        </button>
                    </div>
                    <div className="h-px bg-gray-100" />

                    {formErrors.length > 0 && (
                        <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 space-y-1">
                            {formErrors.map((e) => <p key={e} className="text-xs text-red-600">{e}</p>)}
                        </div>
                    )}

                    <div className="space-y-3 max-h-[60vh] overflow-y-auto px-1">
                        <div><label className={lbl}>Full Name <span className="text-red-400">*</span></label>
                            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Jamie Lee" className={inp} /></div>
                        <div><label className={lbl}>Username <span className="text-red-400">*</span></label>
                            <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="e.g. jamie.lee" className={inp} /></div>
                        <div><label className={lbl}>Email <span className="text-red-400">*</span></label>
                            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jamie@example.com" className={inp} /></div>
                        <div><label className={lbl}>Phone <span className="text-red-400">*</span></label>
                            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 555 000 1234" className={inp} /></div>
                        <div><label className={lbl}>Address</label>
                            <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="123 Main St, City" className={inp} /></div>
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1.5">
                                Role <span className="text-red-400">*</span>
                                {metadataLoading && <Loader2 size={11} className="animate-spin text-gray-400" />}
                            </label>
                            <DropDown
                                options={roleOptions}
                                value={form.role}
                                onChange={(v) => setForm({ ...form, role: v as string })}
                                placeholder={metadataLoading ? "Loading roles…" : roleOptions.length === 0 ? "No roles available" : "Select a role…"}
                                disabled={metadataLoading}
                            />
                        </div>
                        <div><label className={lbl}>Specialty <span className="text-red-400">*</span></label>
                            <input type="text" value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} placeholder="e.g. Haircuts, Balayage" className={inp} /></div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                        <button onClick={() => setShowModal(false)} className="text-sm text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition">
                            Cancel
                        </button>
                        <button onClick={handleAdd} disabled={formSaving}
                            className="flex items-center gap-2 bg-indigo-950 text-white text-sm px-5 py-2 rounded-lg hover:bg-indigo-800 transition disabled:opacity-50"
                        >
                            {formSaving ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
                            {formSaving ? "Adding…" : "Add Staff"}
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    )
}

/* ───────────────────────────── Services Tab ─────────────────────────── */
function ServicesTab({ salonId }: { salonId: string }) {
    const { salonServices, salonServicesLoading, fetchSalonMetaData } = useAdminStore()
    const { addJobType } = useMetadataStore()
    const { user } = useAuthStore()
    const [newKey, setNewKey]           = useState("")
    const [newValue, setNewValue]       = useState("")
    const [newCategory, setNewCategory] = useState("")
    const [adding, setAdding]           = useState(false)
    const tenantId = useAdminStore.getState().selectedSalon?.username
    const options = { force: false, tenantId, user }

    useEffect(() => {
        fetchSalonMetaData(salonId, options).then(() => {})
    }, [salonId]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleAdd = async () => {
        if (!newKey.trim() || !newValue.trim()) return
        setAdding(true)
        try {
            await addJobType({
                key:   newKey.trim(),
                value: newValue.trim(),
                ...(newCategory.trim() ? { category: newCategory.trim() } : {}),
            }, { force: false, tenantId, user })
            // Refresh from backend after adding
            await fetchSalonMetaData(salonId, options).then(() => {})
            setNewKey("")
            setNewValue("")
            setNewCategory("")
            toast.success("Service added")
        } catch (err) {
            toast.error((err as Error).message)
        } finally {
            setAdding(false)
        }
    }


    const inp = "flex-1 px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"

    return (
        <div className="space-y-4">
            {/* Add service */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Scissors size={15} className="text-gray-400" /> Add Service
                </h3>
                <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
                    <input
                        className={inp}
                        placeholder="Key (e.g. HAIR_CUT)"
                        value={newKey}
                        onChange={(e) => setNewKey(e.target.value)}
                    />
                    <input
                        className={inp}
                        placeholder="Label (e.g. Hair Cut)"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                    />
                    <input
                        className={inp}
                        placeholder="Category (optional)"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                    />
                    <button
                        onClick={handleAdd}
                        disabled={adding || !newKey.trim() || !newValue.trim()}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-indigo-950 text-white rounded-lg hover:bg-indigo-800 transition disabled:opacity-50 whitespace-nowrap"
                    >
                        {adding ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        Add Service
                    </button>
                </div>
            </div>

            {/* Services list */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Scissors size={15} className="text-gray-400" />
                        <span className="text-sm font-semibold text-gray-900">
                            Services <span className="ml-1 text-xs font-normal text-gray-400">({salonServices.length})</span>
                        </span>
                    </div>
                    <button
                        onClick={() => fetchSalonMetaData(salonId, options).then(() => {})}
                        disabled={salonServicesLoading}
                        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                    >
                        <RefreshCw size={12} className={salonServicesLoading ? "animate-spin" : ""} />
                        Refresh
                    </button>
                </div>

                {salonServicesLoading ? (
                    <div className="p-10 text-center">
                        <Loader2 size={24} className="animate-spin mx-auto text-indigo-400 mb-2" />
                        <p className="text-sm text-gray-400">Loading services…</p>
                    </div>
                ) : salonServices.length === 0 ? (
                    <div className="p-10 text-center">
                        <Scissors size={28} className="mx-auto text-gray-200 mb-2" />
                        <p className="text-sm text-gray-400">No services configured for this salon</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {salonServices.map((svc) => (
                            <div key={svc.key} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{svc.value}</p>
                                    {svc.category && (
                                        <p className="text-xs text-indigo-500 mt-0.5">{svc.category}</p>
                                    )}
                                </div>
                                <span className="text-[10px] font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                                    {svc.key}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

/* ────────────────────────────── Roles Tab ───────────────────────────── */
function RolesTab({
    salonId,
    roles,
    loading,
    onRefresh,
    onAddRole,
}: {
    salonId: string
    roles: JobRole[]
    loading: boolean
    onRefresh: () => void
    onAddRole: (entry: JobRole) => Promise<void>
}) {
    const [newKey, setNewKey]     = useState("")
    const [newValue, setNewValue] = useState("")
    const [adding, setAdding]     = useState(false)

    // Load on first render
    useEffect(() => { onRefresh() }, [salonId]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleAdd = async () => {
        if (!newKey.trim() || !newValue.trim()) return
        setAdding(true)
        try {
            await onAddRole({ key: newKey.trim(), value: newValue.trim() })
            setNewKey("")
            setNewValue("")
            toast.success("Role added")
        } catch (err) {
            toast.error((err as Error).message)
        } finally {
            setAdding(false)
        }
    }

    const inp = "flex-1 px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"

    return (
        <div className="space-y-4">
            {/* Add role */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <ShieldCheck size={15} className="text-gray-400" /> Add Job Role
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                    <input className={inp} placeholder="Key (e.g. HAIR_STYLIST)"
                        value={newKey} onChange={(e) => setNewKey(e.target.value)} />
                    <input className={inp} placeholder="Label (e.g. Hair Stylist)"
                        value={newValue} onChange={(e) => setNewValue(e.target.value)} />
                    <button
                        onClick={handleAdd}
                        disabled={adding || !newKey.trim() || !newValue.trim()}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-indigo-950 text-white rounded-lg hover:bg-indigo-800 transition disabled:opacity-50 whitespace-nowrap"
                    >
                        {adding ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        Add Role
                    </button>
                </div>
            </div>

            {/* Roles list */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={15} className="text-gray-400" />
                        <span className="text-sm font-semibold text-gray-900">
                            Job Roles <span className="ml-1 text-xs font-normal text-gray-400">({roles.length})</span>
                        </span>
                    </div>
                    <button
                        onClick={onRefresh}
                        disabled={loading}
                        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                    >
                        <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
                        Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="p-10 text-center">
                        <Loader2 size={24} className="animate-spin mx-auto text-indigo-400 mb-2" />
                        <p className="text-sm text-gray-400">Loading roles…</p>
                    </div>
                ) : roles.length === 0 ? (
                    <div className="p-10 text-center">
                        <ShieldCheck size={28} className="mx-auto text-gray-200 mb-2" />
                        <p className="text-sm text-gray-400">No job roles configured for this salon</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {roles.map((role) => (
                            <div key={role.key} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition">
                                <p className="text-sm font-medium text-gray-900">{role.value}</p>
                                <span className="text-[10px] font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                                    {role.key}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

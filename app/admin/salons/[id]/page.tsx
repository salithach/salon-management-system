"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import {
    ArrowLeft, Building2, User, MapPin, Globe, Phone,
    Users, Scissors, Save, Loader2, AlertCircle, UserCheck
} from "lucide-react"
import { useAdminStore, Salon, AdminStaffMember } from "@/store/adminStore"
import { useMetadataStore } from "@/store/metadataStore"
import { useAuthStore } from "@/store/authStore"
import LoadingOverlay from "@/components/LoadingOverlay"

type Tab = "info" | "staff" | "services"

export default function AdminSalonDetailPage() {
    const { id } = useParams<{ id: string }>()
    const router = useRouter()
    const { _hasHydrated } = useAuthStore()
    const {
        selectedSalon, selectedSalonLoading,
        salonStaff, salonStaffLoading,
        saving,
        fetchSalonById, fetchSalonStaff, updateSalon,
    } = useAdminStore()

    const [activeTab, setActiveTab] = useState<Tab>("info")
    const [form, setForm] = useState<Partial<Salon>>({})

    // Load on mount — read store imperatively to avoid stale closure from transition render
    useEffect(() => {
        if (!_hasHydrated) return
        const current = useAdminStore.getState().selectedSalon
        if (current && current.id === id) {
            // Salon already passed from the list — only fetch staff
            fetchSalonStaff(id).then(() =>{})
        } else {
            // Direct URL access or different salon — fetch both
            fetchSalonById(id).then(() =>{})
            fetchSalonStaff(id).then(() =>{})
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
        { key: "info",     label: "Salon Info", icon: Building2 },
        { key: "staff",    label: "Staff",      icon: Users },
        { key: "services", label: "Services",   icon: Scissors },
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
                    <div className="min-w-0">
                        <h2 className="text-xl font-bold">{selectedSalon.salonName}</h2>
                        <p className="text-indigo-300 text-sm mt-0.5">{selectedSalon.salonType}</p>
                        <div className="flex flex-wrap gap-4 mt-3 text-xs text-indigo-200">
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
                />
            )}

            {activeTab === "staff" && (
                <StaffTab staff={salonStaff} loading={salonStaffLoading} />
            )}

            {activeTab === "services" && (
                <ServicesTab salonId={id} />
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
}: {
    form: Partial<Salon>
    field: (k: keyof Salon) => (e: React.ChangeEvent<HTMLInputElement>) => void
    saving: boolean
    onSave: () => void
    hasSalon: boolean
}) {
    if (!hasSalon) {
        return (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center">
                <AlertCircle size={28} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-400">Salon details not available</p>
            </div>
        )
    }

    const inp = "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
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
                        <label className={lbl}>Salon Name</label>
                        <input className={inp} value={form.salonName ?? ""} onChange={field("salonName")} placeholder="Salon name" />
                    </div>
                    <div>
                        <label className={lbl}>Salon Type</label>
                        <input className={inp} value={form.salonType ?? ""} onChange={field("salonType")} placeholder="e.g. Hair, Nail…" />
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
function StaffTab({
    staff,
    loading,
}: {
    staff: AdminStaffMember[]
    loading: boolean
}) {
    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center">
                <Loader2 size={24} className="animate-spin mx-auto text-indigo-400 mb-2" />
                <p className="text-sm text-gray-400">Loading staff…</p>
            </div>
        )
    }

    if (staff.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center">
                <UserCheck size={28} className="mx-auto text-gray-200 mb-2" />
                <p className="text-sm text-gray-400">No staff members found for this salon</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <Users size={15} className="text-gray-400" />
                <span className="text-sm font-semibold text-gray-900">
                    Staff Members <span className="ml-1 text-xs font-normal text-gray-400">({staff.length})</span>
                </span>
            </div>
            <div className="divide-y divide-gray-50">
                {staff.map((member) => {
                    const role =
                        typeof member.role === "object"
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
                                {member.specialty && (
                                    <p className="text-[10px] text-gray-400">{member.specialty}</p>
                                )}
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
        </div>
    )
}

/* ───────────────────────────── Services Tab ─────────────────────────── */
function ServicesTab({ salonId }: { salonId: string }) {
    const { jobTypes, metadataLoading, addJobType, fetchMetadata } = useMetadataStore()
    const [newKey, setNewKey]           = useState("")
    const [newValue, setNewValue]       = useState("")
    const [newCategory, setNewCategory] = useState("")
    const [adding, setAdding]           = useState(false)

    // Ensure metadata is loaded
    useEffect(() => {
        fetchMetadata().then(() => {}) },
        [fetchMetadata, salonId]
    )

    const handleAdd = async () => {
        if (!newKey.trim() || !newValue.trim()) return
        setAdding(true)
        try {
            await addJobType({
                key:      newKey.trim(),
                value:    newValue.trim(),
                ...(newCategory.trim() ? { category: newCategory.trim() } : {}),
            })
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

    // Suppress unused-variable warning — salonId kept for future per-salon scoping
    void salonId

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
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                    <Scissors size={15} className="text-gray-400" />
                    <span className="text-sm font-semibold text-gray-900">
                        Services <span className="ml-1 text-xs font-normal text-gray-400">({jobTypes.length})</span>
                    </span>
                </div>

                {metadataLoading ? (
                    <div className="p-10 text-center">
                        <Loader2 size={24} className="animate-spin mx-auto text-indigo-400 mb-2" />
                        <p className="text-sm text-gray-400">Loading services…</p>
                    </div>
                ) : jobTypes.length === 0 ? (
                    <div className="p-10 text-center">
                        <Scissors size={28} className="mx-auto text-gray-200 mb-2" />
                        <p className="text-sm text-gray-400">No services configured for this salon</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {jobTypes.map((svc) => (
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


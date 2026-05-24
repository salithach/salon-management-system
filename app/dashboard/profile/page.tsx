"use client"

import { useState } from "react"
import { useAuthStore } from "@/store/authStore"
import { Store, User, Lock, Trash2, MapPin, Globe, AtSign, Save, Pencil, X } from "lucide-react"
import DropDown from "@/components/DropDown"
import { toast } from "sonner"
import { SALON_TYPES, SALON_TYPE_OPTIONS } from "@/lib/constants"

const inputCls = "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black"
const labelCls = "block text-xs font-medium text-gray-600 mb-1.5"
const valueCls = "text-sm text-gray-800"
const readFieldCls = "space-y-1"

function ReadField({ label, value }: { label: string; value: string }) {
    return (
        <div className={readFieldCls}>
            <p className={labelCls}>{label}</p>
            <p className={valueCls}>{value || <span className="text-gray-400 italic">—</span>}</p>
        </div>
    )
}

export default function ProfilePage() {
    const { user } = useAuthStore()
    const role = user?.roles?.[0] ?? "User"
    const initial = role[0]?.toUpperCase() ?? "U"

    const [personalForm, setPersonalForm] = useState({
        name: "Salitha Chathuranga",
        email: "salithach@salonhq.com",
        phone: "+1 555-0100",
        role,
    })
    const [personalDraft, setPersonalDraft] = useState(personalForm)
    const [editPersonal, setEditPersonal] = useState(false)

    const [salonForm, setSalonForm] = useState({
        salonName: "SalonHQ Studio",
        salonType: "HAIR_SALON",
        username: "salithach",
        address: "123 Main Street, Suite 4",
        city: "Los Angeles",
        state: "CA",
        zip: "90001",
        country: "United States",
        website: "https://salonhq.com",
    })
    const [salonDraft, setSalonDraft] = useState(salonForm)
    const [editSalon, setEditSalon] = useState(false)

    const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" })
    const [showPassword, setShowPassword] = useState(false)

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleteConfirmText, setDeleteConfirmText] = useState("")

    const [passwordError, setPasswordError] = useState("")

    const handlePersonalSave = (e: React.FormEvent) => {
        e.preventDefault()
        setPersonalForm(personalDraft)
        setEditPersonal(false)
        toast.success("Owner details saved", { description: "Your personal information has been updated." })
    }

    const handleSalonSave = (e: React.FormEvent) => {
        e.preventDefault()
        setSalonForm(salonDraft)
        setEditSalon(false)
        toast.success("Salon details saved", { description: "Your salon information has been updated." })
    }

    const handlePasswordSave = (e: React.FormEvent) => {
        e.preventDefault()
        setPasswordError("")
        if (passwordForm.next !== passwordForm.confirm) {
            setPasswordError("New passwords do not match.")
            return
        }
        if (passwordForm.next.length < 8) {
            setPasswordError("Password must be at least 8 characters.")
            return
        }
        setPasswordForm({ current: "", next: "", confirm: "" })
        setShowPassword(false)
        toast.success("Password updated", { description: "Your account password has been changed successfully." })
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">

            {/* Profile header */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-2xl font-semibold shrink-0">
                    {initial}
                </div>
                <div>
                    <p className="text-lg font-semibold text-gray-900">{personalForm.name}</p>
                    <p className="text-sm text-gray-500">{personalForm.email}</p>
                    <span className="inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-black text-white">
                        {role}
                    </span>
                </div>
            </div>

            {/* Salon Details */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Store size={16} className="text-gray-500 shrink-0" />
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">Salon Details</h2>
                            <p className="text-xs text-gray-400 mt-0.5">Your salon&apos;s public identity and location</p>
                        </div>
                    </div>
                    {editSalon ? (
                        <div className="flex items-center gap-2">
                            <button type="button" onClick={() => setEditSalon(false)}
                                className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-black border border-gray-200 px-3 py-1.5 rounded-lg transition">
                                <X size={12} /> Cancel
                            </button>
                            <button type="submit" form="salon-form"
                                className="flex items-center gap-1.5 text-xs font-medium bg-black text-white px-3 py-1.5 rounded-lg hover:opacity-80 transition">
                                <Save size={12} /> Save
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => { setSalonDraft(salonForm); setEditSalon(true) }}
                            className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-black border border-gray-200 px-3 py-1.5 rounded-lg transition">
                            <Pencil size={12} /> Edit
                        </button>
                    )}
                </div>

                {editSalon ? (
                    <form id="salon-form" onSubmit={handleSalonSave} className="p-6 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelCls}>Salon Name</label>
                                <input type="text" value={salonDraft.salonName} onChange={(e) => setSalonDraft({ ...salonDraft, salonName: e.target.value })} className={inputCls} />
                            </div>
                            <div>
                                <label className={labelCls}>Salon Type</label>
                                <DropDown
                                    options={SALON_TYPE_OPTIONS}
                                    value={salonDraft.salonType}
                                    onChange={(v) => setSalonDraft({ ...salonDraft, salonType: v })}
                                    placeholder="Select a type…"
                                />
                            </div>
                            <div>
                                <label className={labelCls}>Username</label>
                                <div className="relative">
                                    <AtSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="text" value={salonDraft.username} onChange={(e) => setSalonDraft({ ...salonDraft, username: e.target.value })} className={`${inputCls} pl-7`} />
                                </div>
                            </div>
                            <div>
                                <label className={labelCls}>Website</label>
                                <div className="relative">
                                    <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="url" value={salonDraft.website} onChange={(e) => setSalonDraft({ ...salonDraft, website: e.target.value })} className={`${inputCls} pl-7`} />
                                </div>
                            </div>
                        </div>
                        <div className="h-px bg-gray-100" />
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                            <MapPin size={12} /> Address
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <label className={labelCls}>Street Address</label>
                                <input type="text" value={salonDraft.address} onChange={(e) => setSalonDraft({ ...salonDraft, address: e.target.value })} className={inputCls} />
                            </div>
                            <div>
                                <label className={labelCls}>City</label>
                                <input type="text" value={salonDraft.city} onChange={(e) => setSalonDraft({ ...salonDraft, city: e.target.value })} className={inputCls} />
                            </div>
                            <div>
                                <label className={labelCls}>State / Province</label>
                                <input type="text" value={salonDraft.state} onChange={(e) => setSalonDraft({ ...salonDraft, state: e.target.value })} className={inputCls} />
                            </div>
                            <div>
                                <label className={labelCls}>ZIP / Postal Code</label>
                                <input type="text" value={salonDraft.zip} onChange={(e) => setSalonDraft({ ...salonDraft, zip: e.target.value })} className={inputCls} />
                            </div>
                            <div>
                                <label className={labelCls}>Country</label>
                                <input type="text" value={salonDraft.country} onChange={(e) => setSalonDraft({ ...salonDraft, country: e.target.value })} className={inputCls} />
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <ReadField label="Salon Name" value={salonForm.salonName} />
                            <ReadField label="Salon Type" value={SALON_TYPES.find((t) => t.code === salonForm.salonType)?.description ?? salonForm.salonType} />
                            <ReadField label="Username" value={`@${salonForm.username}`} />
                            <ReadField label="Website" value={salonForm.website} />
                        </div>
                        <div className="h-px bg-gray-100" />
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                            <MapPin size={12} /> Address
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <ReadField label="Street Address" value={salonForm.address} />
                            </div>
                            <ReadField label="City" value={salonForm.city} />
                            <ReadField label="State / Province" value={salonForm.state} />
                            <ReadField label="ZIP / Postal Code" value={salonForm.zip} />
                            <ReadField label="Country" value={salonForm.country} />
                        </div>

                    </div>
                )}
            </div>

            {/* Owner Details */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-500 shrink-0" />
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">Owner Details</h2>
                            <p className="text-xs text-gray-400 mt-0.5">Update the salon owner&apos;s name, email and contact details</p>
                        </div>
                    </div>
                    {editPersonal ? (
                        <div className="flex items-center gap-2">
                            <button type="button" onClick={() => setEditPersonal(false)}
                                className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-black border border-gray-200 px-3 py-1.5 rounded-lg transition">
                                <X size={12} /> Cancel
                            </button>
                            <button type="submit" form="personal-form"
                                className="flex items-center gap-1.5 text-xs font-medium bg-black text-white px-3 py-1.5 rounded-lg hover:opacity-80 transition">
                                <Save size={12} /> Save
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => { setPersonalDraft(personalForm); setEditPersonal(true) }}
                            className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-black border border-gray-200 px-3 py-1.5 rounded-lg transition">
                            <Pencil size={12} /> Edit
                        </button>
                    )}
                </div>

                {editPersonal ? (
                    <form id="personal-form" onSubmit={handlePersonalSave} className="p-6 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelCls}>Full Name</label>
                                <input type="text" value={personalDraft.name} onChange={(e) => setPersonalDraft({ ...personalDraft, name: e.target.value })} className={inputCls} />
                            </div>
                            <div>
                                <label className={labelCls}>Email Address</label>
                                <input type="email" value={personalDraft.email} onChange={(e) => setPersonalDraft({ ...personalDraft, email: e.target.value })} className={inputCls} />
                            </div>
                            <div>
                                <label className={labelCls}>Phone Number</label>
                                <input type="tel" value={personalDraft.phone} onChange={(e) => setPersonalDraft({ ...personalDraft, phone: e.target.value })} className={inputCls} />
                            </div>
                            <div>
                                <label className={labelCls}>Username</label>
                                <input type="text" value={salonForm.username} disabled className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed" />
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <ReadField label="Full Name" value={personalForm.name} />
                            <ReadField label="Email Address" value={personalForm.email} />
                            <ReadField label="Phone Number" value={personalForm.phone} />
                            <ReadField label="Username" value={`@${salonForm.username}`} />
                        </div>

                    </div>
                )}
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Lock size={16} className="text-gray-500 shrink-0" />
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">Change Password</h2>
                            <p className="text-xs text-gray-400 mt-0.5">Choose a strong password to keep your account secure</p>
                        </div>
                    </div>
                    {showPassword ? (
                        <div className="flex items-center gap-2">
                            <button type="button" onClick={() => { setShowPassword(false); setPasswordError(""); setPasswordForm({ current: "", next: "", confirm: "" }) }}
                                className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-black border border-gray-200 px-3 py-1.5 rounded-lg transition">
                                <X size={12} /> Cancel
                            </button>
                            <button type="submit" form="password-form"
                                className="flex items-center gap-1.5 text-xs font-medium bg-black text-white px-3 py-1.5 rounded-lg hover:opacity-80 transition">
                                <Save size={12} /> Save
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setShowPassword(true)}
                            className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-black border border-gray-200 px-3 py-1.5 rounded-lg transition">
                            <Pencil size={12} /> Change
                        </button>
                    )}
                </div>

                {showPassword ? (
                    <form id="password-form" onSubmit={handlePasswordSave} className="p-6 space-y-4">
                        <div>
                            <label className={labelCls}>Current Password</label>
                            <input type="password" value={passwordForm.current} onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })} placeholder="••••••••" className={inputCls} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelCls}>New Password</label>
                                <input type="password" value={passwordForm.next} onChange={(e) => setPasswordForm({ ...passwordForm, next: e.target.value })} placeholder="••••••••" className={inputCls} />
                            </div>
                            <div>
                                <label className={labelCls}>Confirm New Password</label>
                                <input type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })} placeholder="••••••••" className={inputCls} />
                            </div>
                        </div>
                        {passwordError && <p className="text-xs text-red-500">{passwordError}</p>}
                    </form>
                ) : (
                    <div className="p-6">
                        <p className="text-sm text-gray-400 italic">Password is hidden. Click &quot;Change&quot; to update it.</p>
                    </div>
                )}
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-xl border border-red-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-red-100 flex items-center gap-2">
                    <Trash2 size={16} className="text-red-500 shrink-0" />
                    <h2 className="text-sm font-semibold text-red-600">Danger Zone</h2>
                </div>
                <div className="p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-900">Delete account</p>
                        <p className="text-xs text-gray-400 mt-0.5">Permanently remove your account and all data</p>
                    </div>
                    <button
                        onClick={() => { setDeleteConfirmText(""); setShowDeleteModal(true) }}
                        className="text-sm border border-red-200 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition flex items-center gap-2"
                    >
                        <Trash2 size={14} /> Delete Account
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setShowDeleteModal(false)}
                    />

                    {/* Modal */}
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                    <Trash2 size={18} className="text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900">Delete Account</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">This action cannot be undone</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition mt-0.5"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="h-px bg-gray-100" />

                        <p className="text-sm text-gray-600">
                            This will permanently delete your account, all salon data, staff records,
                            appointments, and settings. <span className="font-semibold text-gray-900">There is no going back.</span>
                        </p>

                        <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                            <p className="text-xs text-red-600 mb-2">
                                Type <span className="font-bold">DELETE</span> to confirm
                            </p>
                            <input
                                type="text"
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                placeholder="DELETE"
                                className="w-full px-3 py-2 text-sm border border-red-200 rounded-lg outline-none focus:ring-2 focus:ring-red-400 bg-white text-gray-900 placeholder:text-gray-400"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(false)}
                                className="text-sm text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={deleteConfirmText !== "DELETE"}
                                className="text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Trash2 size={14} /> Permanently Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

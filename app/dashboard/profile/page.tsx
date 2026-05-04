"use client"

import { useState } from "react"
import { useAuthStore } from "@/store/authStore"
import { Store, User, Lock, Trash2, CheckCircle2, MapPin, Globe, AtSign, Save } from "lucide-react"

const inputCls = "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black"
const labelCls = "block text-xs font-medium text-gray-600 mb-1.5"

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

    const [salonForm, setSalonForm] = useState({
        salonName: "SalonHQ Studio",
        username: "salithach",
        address: "123 Main Street, Suite 4",
        city: "Los Angeles",
        state: "CA",
        zip: "90001",
        country: "United States",
        website: "https://salonhq.com",
    })

    const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" })

    const [savedPersonal, setSavedPersonal] = useState(false)
    const [savedSalon, setSavedSalon] = useState(false)
    const [savedPassword, setSavedPassword] = useState(false)
    const [passwordError, setPasswordError] = useState("")

    const toast = (setter: (v: boolean) => void) => {
        setter(true)
        setTimeout(() => setter(false), 2500)
    }

    const handlePersonalSave = (e: React.FormEvent) => {
        e.preventDefault()
        toast(setSavedPersonal)
    }

    const handleSalonSave = (e: React.FormEvent) => {
        e.preventDefault()
        toast(setSavedSalon)
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
        toast(setSavedPassword)
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
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                    <Store size={16} className="text-gray-500 shrink-0" />
                    <div>
                        <h2 className="text-sm font-semibold text-gray-900">Salon Details</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Your salon&apos;s public identity and location</p>
                    </div>
                </div>
                <form onSubmit={handleSalonSave} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Salon Name</label>
                            <input
                                type="text"
                                value={salonForm.salonName}
                                onChange={(e) => setSalonForm({ ...salonForm, salonName: e.target.value })}
                                className={inputCls}
                            />
                        </div>
                        <div>
                            <label className={labelCls}>Username</label>
                            <div className="relative">
                                <AtSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={salonForm.username}
                                    onChange={(e) => setSalonForm({ ...salonForm, username: e.target.value })}
                                    className={`${inputCls} pl-7`}
                                />
                            </div>
                        </div>
                        <div>
                            <label className={labelCls}>Website</label>
                            <div className="relative">
                                <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="url"
                                    value={salonForm.website}
                                    onChange={(e) => setSalonForm({ ...salonForm, website: e.target.value })}
                                    className={`${inputCls} pl-7`}
                                />
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
                            <input
                                type="text"
                                value={salonForm.address}
                                onChange={(e) => setSalonForm({ ...salonForm, address: e.target.value })}
                                className={inputCls}
                            />
                        </div>
                        <div>
                            <label className={labelCls}>City</label>
                            <input
                                type="text"
                                value={salonForm.city}
                                onChange={(e) => setSalonForm({ ...salonForm, city: e.target.value })}
                                className={inputCls}
                            />
                        </div>
                        <div>
                            <label className={labelCls}>State / Province</label>
                            <input
                                type="text"
                                value={salonForm.state}
                                onChange={(e) => setSalonForm({ ...salonForm, state: e.target.value })}
                                className={inputCls}
                            />
                        </div>
                        <div>
                            <label className={labelCls}>ZIP / Postal Code</label>
                            <input
                                type="text"
                                value={salonForm.zip}
                                onChange={(e) => setSalonForm({ ...salonForm, zip: e.target.value })}
                                className={inputCls}
                            />
                        </div>
                        <div>
                            <label className={labelCls}>Country</label>
                            <input
                                type="text"
                                value={salonForm.country}
                                onChange={(e) => setSalonForm({ ...salonForm, country: e.target.value })}
                                className={inputCls}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        {savedSalon && <p className="text-xs text-green-600 font-medium flex items-center gap-1"><CheckCircle2 size={13} /> Salon details saved</p>}
                        <button type="submit" className="ml-auto bg-brand text-white text-sm px-5 py-2.5 rounded-lg hover:opacity-80 transition flex items-center gap-2">
                            <Save size={14} /> Save Salon Details
                        </button>
                    </div>
                </form>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                    <User size={16} className="text-gray-500 shrink-0" />
                    <div>
                        <h2 className="text-sm font-semibold text-gray-900">Owner Details</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Update the salon owner&apos;s name, email and contact details</p>
                    </div>
                </div>
                <form onSubmit={handlePersonalSave} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Full Name</label>
                            <input
                                type="text"
                                value={personalForm.name}
                                onChange={(e) => setPersonalForm({ ...personalForm, name: e.target.value })}
                                className={inputCls}
                            />
                        </div>
                        <div>
                            <label className={labelCls}>Email Address</label>
                            <input
                                type="email"
                                value={personalForm.email}
                                onChange={(e) => setPersonalForm({ ...personalForm, email: e.target.value })}
                                className={inputCls}
                            />
                        </div>
                        <div>
                            <label className={labelCls}>Phone Number</label>
                            <input
                                type="tel"
                                value={personalForm.phone}
                                onChange={(e) => setPersonalForm({ ...personalForm, phone: e.target.value })}
                                className={inputCls}
                            />
                        </div>
                        <div>
                            <label className={labelCls}>Username</label>
                            <input
                                type="text"
                                value={salonForm.username}
                                disabled
                                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                        {savedPersonal && <p className="text-xs text-green-600 font-medium flex items-center gap-1"><CheckCircle2 size={13} /> Owner details saved</p>}
                        <button type="submit" className="ml-auto bg-brand text-white text-sm px-5 py-2.5 rounded-lg hover:opacity-80 transition flex items-center gap-2">
                            <Save size={14} /> Save Owner Details
                        </button>
                    </div>
                </form>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                    <Lock size={16} className="text-gray-500 shrink-0" />
                    <div>
                        <h2 className="text-sm font-semibold text-gray-900">Change Password</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Choose a strong password to keep your account secure</p>
                    </div>
                </div>
                <form onSubmit={handlePasswordSave} className="p-6 space-y-4">
                    <div>
                        <label className={labelCls}>Current Password</label>
                        <input
                            type="password"
                            value={passwordForm.current}
                            onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                            placeholder="••••••••"
                            className={inputCls}
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>New Password</label>
                            <input
                                type="password"
                                value={passwordForm.next}
                                onChange={(e) => setPasswordForm({ ...passwordForm, next: e.target.value })}
                                placeholder="••••••••"
                                className={inputCls}
                            />
                        </div>
                        <div>
                            <label className={labelCls}>Confirm New Password</label>
                            <input
                                type="password"
                                value={passwordForm.confirm}
                                onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                                placeholder="••••••••"
                                className={inputCls}
                            />
                        </div>
                    </div>
                    {passwordError && <p className="text-xs text-red-500">{passwordError}</p>}
                    <div className="flex items-center justify-between pt-2">
                        {savedPassword && <p className="text-xs text-green-600 font-medium flex items-center gap-1"><CheckCircle2 size={13} /> Password updated</p>}
                        <button type="submit" className="ml-auto bg-brand text-white text-sm px-5 py-2.5 rounded-lg hover:opacity-80 transition flex items-center gap-2">
                            <Save size={14} /> Update Password
                        </button>
                    </div>
                </form>
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
                    <button className="text-sm border border-red-200 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition flex items-center gap-2">
                        <Trash2 size={14} /> Delete Account
                    </button>
                </div>
            </div>

        </div>
    )
}


"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, Store, MapPin, Lock, ChevronRight, ChevronLeft, CheckCircle2, Globe, AtSign, Phone, Eye, EyeOff, Loader2, CalendarDays, UserCheck, Scissors, BarChart3, Package, Bell } from "lucide-react"
import { useAuthStore } from "@/store/authStore"
import DropDown from "@/components/DropDown"
import { toast } from "sonner"
import SuccessScreen from "@/components/SuccessScreen"
import { SALON_TYPES, resolveDescription } from "@/lib/constants"
import { useSalonStore } from "@/store/salonStore"

const inputCls = "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black text-gray-900 placeholder:text-gray-400 bg-white"
const labelCls = "block text-xs font-medium text-gray-600 mb-1.5"


const steps = [
    { label: "Account",  icon: Lock  },
    { label: "Owner",    icon: User  },
    { label: "Salon",    icon: Store },
    { label: "Location", icon: MapPin },
]

export default function RegisterPage() {
    const { register, loading, error, token, _hasHydrated } = useAuthStore()
    const { salonTypeOptions, salonTypesLoading, fetchSalonTypes } = useSalonStore()
    const router = useRouter()
    const [step, setStep] = useState(0)
    const [done, setDone] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    useEffect(() => {
        fetchSalonTypes().then(() => {})
    }, [fetchSalonTypes])

    // Step 1 — account
    const [account, setAccount] = useState({ username: "fdf", email: "", password: "", confirm: "" })

    // Step 2 — owner
    const [owner, setOwner] = useState({ name: "fdfdf", phoneNumber: "" })

    // Step 3 — salon
    const [salon, setSalon] = useState({ salonName: "fdfd", salonType: "", website: "" })

    // Step 4 — location
    const [location, setLocation] = useState({ address: "", city: "", state: "", zipCode: "", country: "" })

    const [errors, setErrors] = useState<string[]>([])

    useEffect(() => {
        if (_hasHydrated && token) router.replace("/dashboard")
    }, [_hasHydrated, token, router])

    if (!_hasHydrated || token) return null

    // Resolve the human-readable label for the selected salon type
    const resolveSalonTypeLabel = (code: string): string => {
        const match = salonTypeOptions.find((o) => (typeof o === "object" ? o.value : o) === code)
        if (match) return typeof match === "object" ? match.label : match
        return resolveDescription(SALON_TYPES, code)
    }

    const validate = (): boolean => {
        const errs: string[] = []
        if (step === 0) {
            if (!account.username.trim()) errs.push("Username is required.")
            if (!account.email.trim()) errs.push("Email is required.")
            if (account.password.length < 8) errs.push("Password must be at least 8 characters.")
            if (account.password !== account.confirm) errs.push("Passwords do not match.")
        }
        if (step === 1) {
            if (!owner.name.trim()) errs.push("Full name is required.")
        }
        if (step === 2) {
            if (!salon.salonName.trim()) errs.push("Salon name is required.")
            if (!salon.salonType) errs.push("Please select a salon type.")
        }
        setErrors(errs)
        return errs.length === 0
    }

    const next = async () => {
        if (!validate()) return
        if (step < steps.length - 1) {
            setStep(s => s + 1)
            setErrors([])
        } else {
            const payload = {
                username: account.username,
                email: account.email,
                password: account.password,
                owner,
                salon,
                location,
            }
            await register(payload)
            if (!useAuthStore.getState().error) {
                toast.success("Account created!", {
                    description: `Welcome to SalonHQ, ${owner.name}. Please sign in to continue.`,
                })
                setDone(true)
            }
        }
    }
    const back = () => { setStep(s => s - 1); setErrors([]) }

    if (done) return (
        <SuccessScreen
            title="You're all set!"
            subtitle="Your salon account is ready. Sign in now to start managing appointments, staff, and more."
            entityName={salon.salonName}
            entityLabel="Salon"
            bullets={[
                { label: "Username",    value: `@${account.username}` },
                { label: "Email",       value: account.email },
                { label: "Salon type",  value: resolveSalonTypeLabel(salon.salonType) },
                { label: "Location",    value: [location.city, location.state, location.country].filter(Boolean).join(", ") || "—" },
            ]}
            actions={[
                { label: "Sign In Now", href: "/login",   variant: "primary" },
                { label: "Back to Home", href: "/",       variant: "secondary" },
            ]}
        />
    )

    return (
        <div className="flex-1 flex items-start lg:items-center justify-center bg-gray-50 px-4 py-6 lg:py-8 overflow-x-hidden">
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col lg:flex-row items-stretch text-gray-900">

                {/* ── Left branding panel (desktop only) ── */}
                <div className="hidden lg:flex flex-col gap-7 w-80 shrink-0 bg-zinc-900 text-white p-10 justify-center">
                    {/* Logo + tagline */}
                    <div>
                        <p className="text-2xl font-bold text-white tracking-tight">SalonHQ</p>
                        <p className="text-sm text-white/60 mt-1">Everything your salon needs, in one place.</p>
                    </div>

                    {/* Feature list */}
                    <ul className="space-y-4">
                        {[
                            { icon: CalendarDays, title: "Smart Scheduling",    desc: "Manage bookings with a real-time calendar" },
                            { icon: UserCheck,    title: "Staff Management",    desc: "Assign shifts, track jobs & earnings daily" },
                            { icon: Scissors,     title: "Service Catalogue",   desc: "Build & price your full treatment menu" },
                            { icon: BarChart3,    title: "Revenue Insights",    desc: "Visual reports per staff, service & period" },
                            { icon: Package,      title: "Inventory Management", desc: "Track stock levels for salon products" },
                            { icon: Bell,         title: "Smart Notifications", desc: "Automated reminders to reduce no-shows" }
                        ].map(({ icon: Icon, title, desc }) => (
                            <li key={title} className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                    <Icon size={17} className="text-white/80" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">{title}</p>
                                    <p className="text-xs text-white/50 mt-0.5">{desc}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* ── Right: stepper + form ── */}
                <div className="flex-1 w-full p-6 lg:p-10">

                {/* Progress stepper */}
                <div className="flex items-center justify-center mb-6">
                    <div className="flex items-center w-full">
                    {steps.map((s, i) => {
                        const Icon = s.icon
                        const isComplete = i < step
                        const isActive = i === step
                        return (
                            <div key={s.label} className="flex items-center flex-1">
                                <div className="flex flex-col items-center gap-1">
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                                        isComplete ? "bg-black" : isActive ? "bg-black" : "bg-gray-200"
                                    }`}>
                                        {isComplete
                                            ? <CheckCircle2 size={16} className="text-white" />
                                            : <Icon size={15} className={isActive ? "text-white" : "text-gray-400"} />
                                        }
                                    </div>
                                    <span className={`text-[10px] font-medium hidden sm:block ${isActive ? "text-gray-900" : "text-gray-400"}`}>{s.label}</span>
                                </div>
                                {i < steps.length - 1 && (
                                    <div className={`flex-1 h-px mx-2 mb-4 transition-all ${i < step ? "bg-black" : "bg-gray-200"}`} />
                                )}
                            </div>
                        )
                    })}
                    </div>
                </div>

                {/* Card */}
                <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                        {(() => { const Icon = steps[step].icon; return <Icon size={16} className="text-gray-500 shrink-0" /> })()}
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">
                                {["Account Setup", "Owner Details", "Salon Details", "Salon Location"][step]}
                            </h2>
                            <p className="text-xs text-gray-400 mt-0.5">
                                {[
                                    "Create your login credentials",
                                    "Tell us about the salon owner",
                                    "Set up your salon identity",
                                    "Where is your salon located?",
                                ][step]}
                            </p>
                        </div>
                        <span className="ml-auto text-xs text-gray-400 shrink-0">Step {step + 1} / {steps.length}</span>
                    </div>

                    <div className="p-6 space-y-4">
                        {/* Step-level validation errors */}
                        {errors.length > 0 && (
                            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 space-y-1">
                                {errors.map(e => <p key={e} className="text-xs text-red-600">{e}</p>)}
                            </div>
                        )}

                        {/* API error (last step only) */}
                        {step === steps.length - 1 && error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                                <p className="text-xs text-red-600">{error}</p>
                            </div>
                        )}

                        {/* Step 0 — Account */}
                        {step === 0 && (
                            <>
                                <div>
                                    <label className={labelCls}>Username</label>
                                    <div className="relative">
                                        <AtSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input type="text" value={account.username} onChange={e => setAccount({ ...account, username: e.target.value })}
                                            placeholder="yourname" className={`${inputCls} pl-7`} />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelCls}>Email Address</label>
                                    <input type="email" value={account.email} onChange={e => setAccount({ ...account, email: e.target.value })}
                                        placeholder="you@example.com" className={inputCls} />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelCls}>Password</label>
                                        <div className="relative">
                                            <input type={showPassword ? "text" : "password"} value={account.password} onChange={e => setAccount({ ...account, password: e.target.value })}
                                                placeholder="Min. 8 characters" className={`${inputCls} pr-10`} />
                                            <button type="button" onClick={() => setShowPassword(v => !v)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition">
                                                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelCls}>Confirm Password</label>
                                        <div className="relative">
                                            <input type={showConfirm ? "text" : "password"} value={account.confirm} onChange={e => setAccount({ ...account, confirm: e.target.value })}
                                                placeholder="Repeat password" className={`${inputCls} pr-10`} />
                                            <button type="button" onClick={() => setShowConfirm(v => !v)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition">
                                                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Step 1 — Owner */}
                        {step === 1 && (
                            <>
                                <div>
                                    <label className={labelCls}>Full Name</label>
                                    <input type="text" value={owner.name} onChange={e => setOwner({ ...owner, name: e.target.value })}
                                        placeholder="Jane Smith" className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>Phone Number <span className="text-gray-400">(optional)</span></label>
                                    <div className="relative">
                                        <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input type="tel" value={owner.phoneNumber} onChange={e => setOwner({ ...owner, phoneNumber: e.target.value })}
                                            placeholder="+1 555-0100" className={`${inputCls} pl-7`} />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Step 2 — Salon */}
                        {step === 2 && (
                            <>
                                <div>
                                    <label className={labelCls}>Salon Name</label>
                                    <input type="text" value={salon.salonName} onChange={e => setSalon({ ...salon, salonName: e.target.value })}
                                        placeholder="Glow Studio" className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>Salon Type</label>
                                    <DropDown
                                        options={salonTypeOptions}
                                        value={salon.salonType}
                                        onChange={(v) => setSalon({ ...salon, salonType: v })}
                                        placeholder={salonTypesLoading ? "Loading types…" : "Select a type…"}
                                        disabled={salonTypesLoading}
                                    />
                                </div>
                                <div>
                                    <label className={labelCls}>Website <span className="text-gray-400 font-normal">(optional)</span></label>
                                    <div className="relative">
                                        <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input type="url" value={salon.website} onChange={e => setSalon({ ...salon, website: e.target.value })}
                                            placeholder="https://yoursalon.com" className={`${inputCls} pl-7`} />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Step 3 — Location */}
                        {step === 3 && (
                            <>
                                <div>
                                    <label className={labelCls}>Street Address <span className="text-gray-400">(optional)</span></label>
                                    <input type="text" value={location.address} onChange={e => setLocation({ ...location, address: e.target.value })}
                                        placeholder="123 Main Street, Suite 4" className={inputCls} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelCls}>City</label>
                                        <input type="text" value={location.city} onChange={e => setLocation({ ...location, city: e.target.value })}
                                            placeholder="Los Angeles" className={inputCls} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>State / Province</label>
                                        <input type="text" value={location.state} onChange={e => setLocation({ ...location, state: e.target.value })}
                                            placeholder="CA" className={inputCls} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>ZIP / Postal Code</label>
                                        <input type="text" value={location.zipCode} onChange={e => setLocation({ ...location, zipCode: e.target.value })}
                                            placeholder="90001" className={inputCls} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Country</label>
                                        <input type="text" value={location.country} onChange={e => setLocation({ ...location, country: e.target.value })}
                                            placeholder="United States" className={inputCls} />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2">
                            {step > 0
                                ? <button type="button" onClick={back}
                                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 px-4 py-2.5 rounded-xl hover:border-gray-400 transition">
                                    <ChevronLeft size={15} /> Back
                                  </button>
                                : <div />
                            }
                            <button type="button" onClick={next} disabled={loading}
                                className="flex items-center gap-1.5 text-sm bg-black text-white px-5 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed">
                                {loading ? (
                                    <><Loader2 size={14} className="animate-spin" /> Creating…</>
                                ) : (
                                    <>
                                        {step === steps.length - 1 ? "Create Account" : "Next"}
                                        {step < steps.length - 1 && <ChevronRight size={15} />}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <p className="text-xs text-gray-500 mt-4 text-center">
                    Already have an account?{" "}
                    <Link href="/login" className="text-black font-medium hover:underline">Sign in</Link>
                </p>
                </div> {/* end right column */}
            </div>
        </div>
    )
}
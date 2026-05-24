"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Users, Scissors, BarChart3, UserCheck, ChevronRight, Plus, X } from "lucide-react"
import { toast } from "sonner"
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
    PieChart, Pie, Cell
} from "recharts"
import { JobEntry, StaffMember, StaffState, useStaffAssignmentStore } from "@/store/staffStore"
import { useAuthStore } from "@/store/authStore"
import { useJobTypesStore } from "@/store/jobTypesStore"
import LoadingOverlay from "@/components/LoadingOverlay"
import DropDown from "@/components/DropDown"

const stats = [
    { label: "Today's Appointments", value: "12", change: "+3 from yesterday" },
    { label: "Total Clients", value: "348", change: "+8 this week" },
    { label: "Monthly Revenue", value: "$6,420", change: "+12% vs last month" },
    { label: "Pending Bookings", value: "5", change: "Needs confirmation" },
]

export default function DashboardPage() {
    const { todayJobs, addJob, assignmentsLoading, fetchAssignments } = useStaffAssignmentStore() as unknown as StaffState
    const todayStaff: StaffMember[] = useStaffAssignmentStore((s) => (s as unknown as { assignedStaff: StaffMember[] }).assignedStaff) ?? []

    const { _hasHydrated: authReady } = useAuthStore()
    const { jobTypes, jobTypesLoading, fetchJobTypes } = useJobTypesStore()

    const jobTypeOptions = jobTypes.map((t) => ({ label: t.value, value: t.key }))

    useEffect(() => {
        if (!authReady) return
        fetchAssignments()
        fetchJobTypes()
    }, [authReady])

    // Modal state
    const [modalMember, setModalMember] = useState<StaffMember | null>(null)
    const [service, setService] = useState<string[]>([])
    const [price, setPrice] = useState("")
    const [description, setDescription] = useState("")

    const openModal = (member: StaffMember) => {
        setModalMember(member)
        setService([])
        setPrice("")
        setDescription("")
    }

    const closeModal = () => setModalMember(null)

    const handleAddJob = () => {
        if (!modalMember || !price) return
        const resolveLabel = (key: string) =>
            jobTypes.find((t) => t.key === key)?.value ?? key
        const job = {
            date: new Date().toISOString().slice(0, 10),
            service,
            price: parseFloat(price),
            description: description.trim() || undefined,
            assignee: modalMember
        }
        console.log(job)
        // addJob(modalMember, job)
        closeModal()
        toast.success("Job added", {
            description: `${service.map(resolveLabel).join(" + ")} · $${parseFloat(price).toFixed(2)} for ${modalMember.name}`,
        })
    }

    const getJobs = (name: string): JobEntry[] => todayJobs[name] ?? []
    const getIncome = (name: string) => getJobs(name).reduce((s: number, j: JobEntry) => s + j.price, 0)

    // Compute service category counts from all today's jobs
    const SERVICE_COLORS = [
        "#27272a", "#3f3f46", "#52525b", "#71717a",
        "#a1a1aa", "#d4d4d8", "#18181b", "#09090b",
    ]
    const allJobs: JobEntry[] = Object.values(todayJobs).flat()
    const serviceCounts = allJobs.reduce<Record<string, number>>((acc, job: JobEntry) => {
        const services = Array.isArray(job.service) ? job.service : [job.service]
        services.forEach((s: string) => { acc[s] = (acc[s] ?? 0) + 1 })
        return acc
    }, {})
    const serviceChartData = Object.entries(serviceCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([name, value], i) => ({ name, value, color: SERVICE_COLORS[i % SERVICE_COLORS.length] }))

    return (
        <>
            {assignmentsLoading && <LoadingOverlay message="Loading dashboard…" />}
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
                    </div>
                ))}
            </div>

            {/* Today's Staff */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <UserCheck size={16} className="text-gray-500" />
                        <h2 className="text-sm font-semibold text-gray-900">Staff For Today</h2>
                    </div>
                    <Link href="/dashboard/staff" className="text-xs text-gray-500 hover:text-brand transition flex items-center gap-1">
                        Manage <ChevronRight size={12} />
                    </Link>
                </div>
                {todayStaff.length === 0 ? (
                    <div className="px-6 py-8 text-center">
                        <UserCheck size={28} className="mx-auto text-gray-200 mb-2" />
                        <p className="text-sm text-gray-400">No staff assigned for today</p>
                        <Link href="/dashboard/staff" className="inline-block mt-3 text-xs text-brand hover:underline font-medium">
                            Assign staff →
                        </Link>
                    </div>
                ) : (
                    <div className="p-4 sm:p-6 space-y-5">
                        {/* Staff cards grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                            {todayStaff.map((member) => {
                                const jobs = getJobs(member.username)
                                const income = getIncome(member.username)
                                return (
                                    <div
                                        key={member.id}
                                        className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:border-gray-300 hover:shadow-md transition"
                                    >
                                        {/* Header: avatar + name */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-11 h-11 rounded-full bg-zinc-800 text-white flex items-center justify-center text-base font-semibold shrink-0">
                                                {member.name[0]}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate">{member.name}</p>
                                                <p className="text-xs text-gray-400 truncate">{typeof member.role === "object" ? member.role?.name : member.role}</p>
                                            </div>
                                        </div>

                                        {/* Stats row */}
                                        <div className="flex items-center gap-4 border-t border-gray-50 pt-3 pb-4">
                                            <div className="text-center flex-1">
                                                <p className="text-lg font-bold text-gray-900">{jobs.length}</p>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-wide">Jobs</p>
                                            </div>
                                            <div className="w-px h-8 bg-gray-100 shrink-0" />
                                            <div className="text-center flex-1">
                                                <p className="text-lg font-bold text-gray-900">${income.toFixed(0)}</p>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-wide">Income</p>
                                            </div>
                                        </div>

                                        {/* Add Job button */}
                                        <button
                                            onClick={() => openModal(member)}
                                            className="w-full flex items-center justify-center gap-1.5 text-xs bg-zinc-800 text-white px-3 py-2 rounded-lg hover:bg-zinc-700 active:scale-95 transition"
                                        >
                                            <Plus size={12} /> Add Job
                                        </button>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Totals row */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 bg-gray-50 rounded-xl">
                            <p className="text-xs text-gray-500 font-medium mr-auto">Today&apos;s totals</p>
                            <div className="flex items-center gap-4">
                                <div className="text-center">
                                    <p className="text-sm font-bold text-gray-900">
                                        {todayStaff.reduce((s, m) => s + getJobs(m.username).length, 0)}
                                    </p>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Jobs</p>
                                </div>
                                <div className="w-px h-6 bg-gray-200 shrink-0" />
                                <div className="text-center">
                                    <p className="text-sm font-bold text-gray-900">
                                        {"$"}{todayStaff.reduce((s, m) => s + getIncome(m.username), 0).toFixed(0)}
                                    </p>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Income</p>
                                </div>
                            </div>
                        </div>

                        {/* Charts */}
                        {(() => {
                            const chartData = todayStaff.map((m) => ({
                                name: m.username,
                                Jobs: getJobs(m.username).length,
                                Revenue: getIncome(m.username),
                            }))
                            return (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Jobs chart */}
                                    <div className="bg-gray-50 rounded-xl px-4 py-5">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Jobs per Member</p>
                                        <ResponsiveContainer width="100%" height={160}>
                                            <BarChart data={chartData} barSize={28}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                                                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                                                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={24} />
                                                <Tooltip
                                                    contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }}
                                                    cursor={{ fill: "#f3f4f6" }}
                                                />
                                                <Bar dataKey="Jobs" fill="#27272a" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    {/* Revenue chart */}
                                    <div className="bg-gray-50 rounded-xl px-4 py-5">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Revenue per Member</p>
                                        <ResponsiveContainer width="100%" height={160}>
                                            <BarChart data={chartData} barSize={28}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                                                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                                                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={36}
                                                    tickFormatter={(v) => `$${v}`} />
                                                <Tooltip
                                                    contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }}
                                                    cursor={{ fill: "#f3f4f6" }}
                                                    formatter={(v) => [`$${Number(v).toFixed(2)}`, "Revenue"]}
                                                />
                                                <Bar dataKey="Revenue" fill="#3f3f46" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )
                        })()}
                    </div>
                )}
            </div>

            {/* Add Job Modal */}
            {modalMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h3 className="text-base font-semibold text-gray-900">Add Job</h3>
                                <p className="text-xs text-gray-400 mt-0.5">{modalMember.name}</p>
                            </div>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-700 transition">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Service select */}
                            <div>
                                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1.5">
                                    Service
                                    {jobTypesLoading && <span className="text-gray-400 text-[10px]">Loading…</span>}
                                </label>
                                <DropDown
                                    multiple
                                    value={service}
                                    onChange={setService}
                                    options={jobTypeOptions}
                                    placeholder={jobTypesLoading ? "Loading services…" : "Select services…"}
                                    disabled={jobTypesLoading}
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                                    Description <span className="text-gray-400">(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="e.g. Bridal package, extra treatment…"
                                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-zinc-800"
                                />
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1.5">Price ($)</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-zinc-800"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={closeModal}
                                className="flex-1 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddJob}
                                disabled={!price}
                                className="flex-1 py-2.5 text-sm bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Add Job
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Today's Service Breakdown — live from job data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* Pie chart card */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Today&apos;s Service Breakdown</h3>
                            <p className="text-xs text-gray-400 mt-0.5">Services performed today</p>
                        </div>
                        <span className="text-xs text-gray-400">{allJobs.length} job{allJobs.length !== 1 ? "s" : ""} logged</span>
                    </div>

                    {serviceChartData.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10">
                            <BarChart3 size={32} className="text-gray-200 mb-2" />
                            <p className="text-sm text-gray-400">No jobs added yet today</p>
                        </div>
                    ) : (
                        /* overflow-visible lets labels render outside the SVG bounds */
                        <div style={{ overflow: "visible" }}>
                            <ResponsiveContainer width="100%" height={260}>
                                <PieChart>
                                    <Pie
                                        data={serviceChartData}
                                        cx="50%" cy="50%"
                                        innerRadius={55} outerRadius={85}
                                        dataKey="value"
                                        paddingAngle={3}
                                        strokeWidth={2}
                                        label={({ name, percent }) =>
                                            percent && percent > 0.05 && name
                                                ? `${String(name).split(" ")[0]} ${(percent * 100).toFixed(0)}%`
                                                : ""
                                        }
                                        labelLine={{ stroke: "#d4d4d8", strokeWidth: 1 }}
                                        style={{ fontSize: 10, fill: "#6b7280" }}
                                    >
                                        {serviceChartData.map((entry) => (
                                            <Cell key={entry.name} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }}
                                        formatter={(v) => [`${v} job${Number(v) !== 1 ? "s" : ""}`, ""]}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                {/* Horizontal bar chart card */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <div className="mb-4">
                        <h3 className="text-sm font-semibold text-gray-900">Service Count Ranking</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Most performed services today</p>
                    </div>

                    {serviceChartData.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10">
                            <BarChart3 size={32} className="text-gray-200 mb-2" />
                            <p className="text-sm text-gray-400">No jobs added yet today</p>
                        </div>
                    ) : (
                        <div className="space-y-3 pt-1">
                            {serviceChartData.map((s) => {
                                const max = serviceChartData[0].value
                                const pct = Math.round((s.value / max) * 100)
                                return (
                                    <div key={s.name}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-gray-700">{s.name}</span>
                                            <span className="text-xs font-semibold text-gray-900 tabular-nums">{s.value}</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{ width: `${pct}%`, background: s.color }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { title: "Add Client", desc: "Register a new client profile", icon: Users, href: "/dashboard/clients" },
                    { title: "Manage Services", desc: "Update pricing & service list", icon: Scissors, href: "/dashboard/services" },
                    { title: "View Reports", desc: "Monthly revenue & insights", icon: BarChart3, href: "/dashboard/reports" },
                ].map(({ title, desc, icon: Icon, href }) => (
                    <Link
                        key={title}
                        href={href}
                        className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-left hover:border-brand hover:shadow-md transition group"
                    >
                        <Icon size={24} className="mb-3 text-gray-500 group-hover:text-brand transition" />
                        <p className="text-sm font-semibold text-gray-900">{title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                    </Link>
                ))}
            </div>
        </>
    )
}

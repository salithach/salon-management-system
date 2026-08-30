"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Users, Scissors, BarChart3, UserCheck, ChevronRight, Plus, X, CalendarDays, Briefcase, DollarSign } from "lucide-react"
import { toast } from "sonner"
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
    PieChart, Pie, Cell
} from "recharts"
import { StaffMember, StaffState, useStaffAssignmentStore } from "@/store/staffStore"
import { useAuthStore } from "@/store/authStore"
import { useMetadataStore } from "@/store/metadataStore"
import { JobDetails, JobList, useJobStore } from "@/store/jobStore"
import { useShallow } from "zustand/react/shallow"
import LoadingOverlay from "@/components/LoadingOverlay"
import DropDown from "@/components/DropDown"


export default function DashboardPage() {
    const { assignedToday, assignmentsLoading, fetchAssignments } = useStaffAssignmentStore(
        useShallow((s: StaffState) => ({
            assignedToday:      s.assignedToday,
            assignmentsLoading: s.assignmentsLoading,
            fetchAssignments:   s.fetchAssignments,
        }))
    )
    const assignedStaff = assignedToday ?? []

    const { _hasHydrated: authReady, fetchProfile, user } = useAuthStore()
    const currency = user?.salon?.currency?.toUpperCase() || "xxx"
    const { jobTypes, metadataLoading: jobTypesLoading } = useMetadataStore()
    const { jobs, jobsLoading, fetchJobs, addJob } = useJobStore()

    const jobTypeOptions = jobTypes.map((t) => ({ label: t.value, value: t.key }))

    // Build a per-username job map from the fetched JobList[]
    const todayJobs = jobs.reduce<Record<string, JobDetails[]>>((acc, jl: JobList) => {
        acc[jl.assignee] = [...(acc[jl.assignee] ?? []), ...(jl.jobs ?? [])]
        return acc
    }, {})

    useEffect(() => {
        if (!authReady) return
        if (!user) fetchProfile().then(() => {})
        fetchAssignments().then(() => {})
        fetchJobs().then(() => {})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authReady])

    // Modal state
    const [modalMember, setModalMember] = useState<StaffMember | null>(null)
    const [service, setService] = useState<string[]>([])
    const [price, setPrice] = useState("")
    const [description, setDescription] = useState("")

    const [jobSaving, setJobSaving] = useState(false)

    const openModal = (member: StaffMember) => {
        setModalMember(member)
        setService([])
        setPrice("")
        setDescription("")
    }

    const closeModal = () => setModalMember(null)

    const handleAddJob = async () => {
        if (!modalMember || !price || service.length === 0) return
        const resolveLabel = (key: string) => jobTypes.find((t) => t.key === key)?.value ?? key
        setJobSaving(true)
        try {
            await addJob(modalMember, service, parseFloat(price), description.trim() || undefined)
            await fetchJobs()
            closeModal()
            toast.success("Job added", {
                description: `${service.map(resolveLabel).join(" + ")} · $${parseFloat(price).toFixed(2)} for ${modalMember.name}`,
            })
        } catch (err) {
            toast.error((err as Error).message)
        } finally {
            setJobSaving(false)
        }
    }

    const getJobs = (username: string): JobDetails[] => todayJobs[username] ?? []
    const getIncome = (username: string) => getJobs(username).reduce((s, j) => s + j.price, 0)

    // Compute service category counts from all today's jobs
    const SERVICE_COLORS = [
        "#27272a", "#3f3f46", "#52525b", "#71717a",
        "#a1a1aa", "#d4d4d8", "#18181b", "#09090b",
    ]
    const allJobs: JobDetails[] = Object.values(todayJobs).flat()
    const serviceCounts = allJobs.reduce<Record<string, number>>((acc, job) => {
        (job.services ?? []).forEach((s) => { acc[s] = (acc[s] ?? 0) + 1 })
        return acc
    }, {})
    const serviceChartData = Object.entries(serviceCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([name, value], i) => ({ name, value, color: SERVICE_COLORS[i % SERVICE_COLORS.length] }))

    return (
        <>
            {(assignmentsLoading || jobsLoading) && <LoadingOverlay message="Loading dashboard…" />}
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* Today's Staff */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-600 font-semibold">Today&apos;s Staff</p>
                        <UserCheck size={15} className="text-gray-300" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{assignedStaff.length}</p>
                    <p className="text-xs text-gray-500">
                        {assignedStaff.length === 0 ? "No staff assigned yet" : `${assignedStaff.length} member${assignedStaff.length !== 1 ? "s" : ""} on duty`}
                    </p>
                </div>

                {/* Today's Jobs */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-600 font-semibold">Today&apos;s Jobs</p>
                        <Briefcase size={15} className="text-gray-300" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{allJobs.length}</p>
                    <p className="text-xs text-gray-500">
                        {allJobs.length === 0 ? "No jobs logged yet" : `Across ${assignedStaff.length} staff member${assignedStaff.length !== 1 ? "s" : ""}`}
                    </p>
                </div>

                {/* Today's Income */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-600 font-semibold">Today&apos;s Income</p>
                        <DollarSign size={15} className="text-gray-300" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                        {allJobs.reduce((sum, j) => sum + j.price, 0).toFixed(2)}
                        <span className="text-xs font-normal text-gray-400 ml-1">{currency}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                        {allJobs.length === 0 ? "No revenue yet today" : `From ${allJobs.length} job${allJobs.length !== 1 ? "s" : ""}`}
                    </p>
                </div>

                {/* Today's Appointments */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-600 font-semibold">Today&apos;s Appointments</p>
                        <CalendarDays size={15} className="text-gray-300" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">—</p>
                    <p className="text-xs text-gray-500">Coming soon</p>
                </div>
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
                {assignedStaff.length === 0 ? (
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
                            {assignedStaff.map((member) => {
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
                                                <p className="text-lg font-bold text-gray-900">
                                                    {income.toFixed(0)}
                                                    <span className="text-[10px] font-normal text-gray-400 ml-0.5">{currency}</span>
                                                </p>
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

                        {/* Charts */}
                        {(() => {
                            const chartData = assignedStaff.map((m) => ({
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
                                                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={48}
                                                    tickFormatter={(v) => `${v} ${currency}`} />
                                                <Tooltip
                                                    contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }}
                                                    cursor={{ fill: "#f3f4f6" }}
                                                    formatter={(v) => [`${Number(v).toFixed(2)} ${currency}`, "Revenue"]}
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
                                disabled={jobSaving}
                                className="flex-1 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddJob}
                                disabled={!price || service.length === 0 || jobSaving}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {jobSaving ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</> : "Add Job"}
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

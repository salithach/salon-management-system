"use client"

import {
    Area,
    AreaChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import {BarChart3, CalendarDays, Users} from "lucide-react"
import {useEffect, useMemo} from "react";
import {useAppointmentStore} from "@/store/appointmentStore";
import {useStatStore} from "@/store/statStore";

import LoadingOverlay from "@/components/LoadingOverlay";

const COMING_SOON = false

const monthlyRevenue = [
    { month: "Nov", revenue: 4800, appointments: 68 },
    { month: "Dec", revenue: 5200, appointments: 74 },
    { month: "Jan", revenue: 4400, appointments: 62 },
    { month: "Feb", revenue: 5600, appointments: 80 },
    { month: "Mar", revenue: 5900, appointments: 84 },
    { month: "Apr", revenue: 6100, appointments: 88 },
    { month: "May", revenue: 6420, appointments: 92 },
]

const topServices = [
    { name: "Hair Coloring", revenue: "$1,960", share: 30 },
    { name: "Manicure", revenue: "$1,320", share: 21 },
    { name: "Haircut & Blowout", revenue: "$1,040", share: 16 },
    { name: "Full Highlights", revenue: "$840", share: 13 },
    { name: "Others", revenue: "$1,260", share: 20 },
]

const weeklyRevenue = [
    { day: "Mon", revenue: 820 },
    { day: "Tue", revenue: 1240 },
    { day: "Wed", revenue: 960 },
    { day: "Thu", revenue: 1580 },
    { day: "Fri", revenue: 2100 },
    { day: "Sat", revenue: 2840 },
    { day: "Sun", revenue: 580 },
]

const serviceBreakdown = [
    { name: "Hair",   value: 48, color: "#27272a" },
    { name: "Nails",  value: 32, color: "#52525b" },
    { name: "Beauty", value: 20, color: "#a1a1aa" },
]

const appointmentStatus = [
    { name: "Confirmed", value: 8, color: "#27272a" },
    { name: "Pending",   value: 4, color: "#d4d4d8" },
]

const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue))

export default function ReportsPage() {
    const {
        appointments,
        appointmentsLoading,
        fetchAppointments,
    } = useAppointmentStore()

    const {
        stats,
        statsLoading,
        fetchStats,
    } = useStatStore()

    useEffect(() => {
        fetchStats().then(() => {})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const dailyJobStats = useMemo(() => {
        const map = new Map<
            string,
            {
                date: string
                jobs: number
                confirmed: number
                pending: number
                cancelled: number
            }
        >()

        appointments.forEach((appointment) => {
            if (!appointment.date) return

            const existing = map.get(
                appointment.date
            ) ?? {
                date: appointment.date,
                jobs: 0,
                confirmed: 0,
                pending: 0,
                cancelled: 0,
            }

            if (
                appointment.status === "CONFIRMED"
            ) {
                existing.confirmed++
                existing.jobs++
            } else if (
                appointment.status === "PENDING"
            ) {
                existing.pending++
                existing.jobs++
            } else if (
                appointment.status === "CANCELLED"
            ) {
                existing.cancelled++
            }

            map.set(
                appointment.date,
                existing
            )
        })

        return Array.from(map.values()).sort(
            (a, b) =>
                a.date.localeCompare(b.date)
        )
    }, [appointments])

    const staffWorkDistribution = useMemo(() => {
        const staff = new Map<
            string,
            {
                name: string
                jobs: number
                confirmed: number
                pending: number
            }
        >()

        appointments.forEach((appointment) => {
            if (appointment.status === "CANCELLED") {
                return
            }
            const name = appointment.assignee?.trim()
            if (!name) return
            const existing = staff.get(name) ?? {
                name,
                jobs: 0,
                confirmed: 0,
                pending: 0,
            }
            existing.jobs++
            if (
                appointment.status === "CONFIRMED"
            ) {
                existing.confirmed++
            }
            if (
                appointment.status === "PENDING"
            ) {
                existing.pending++
            }
            staff.set(name, existing)
        })

        const totalJobs = Array.from(
            staff.values()
        ).reduce(
            (total, member) =>
                total + member.jobs,
            0
        )

        return Array.from(staff.values())
            .map((member) => ({
                ...member,

                workload:
                    totalJobs > 0
                        ? (member.jobs /
                            totalJobs) *
                        100
                        : 0,
            }))
            .sort(
                (a, b) =>
                    b.jobs - a.jobs
            )
    }, [appointments])

    const maxStaffJobs = Math.max(
        ...staffWorkDistribution.map(
            (member) => member.jobs
        ),
        1
    )

    const totalJobs = dailyJobStats.reduce(
        (total, day) =>
            total + day.jobs,
        0
    )

    const totalConfirmed =
        dailyJobStats.reduce(
            (total, day) =>
                total + day.confirmed,
            0
        )

    const activeStaff = staffWorkDistribution.length

    const avgJobsPerStaff = activeStaff > 0 ? totalJobs / activeStaff : 0

    if (COMING_SOON) return (
        <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center">
                <BarChart3 size={28} className="text-zinc-400" />
            </div>
            <div>
                <h2 className="text-lg font-semibold text-gray-900">Reports — Coming Soon</h2>
                <p className="text-sm text-gray-400 mt-1 max-w-sm">
                    Revenue insights, appointment analytics and staff performance reports are on their way.
                </p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-500">
                In Development
            </span>
        </div>
    )

    return (
        <>
            {appointmentsLoading && (
                <LoadingOverlay message="Preparing reports…" />
            )}
            <>
                        {/* KPI cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                            {[
                                { label: "Monthly Revenue", value: "$6,420", change: "+12% vs last month" },
                                { label: "Total Appointments", value: "92", change: "+5% vs last month" },
                                { label: "New Clients", value: "24", change: "+8 vs last month" },
                                { label: "Avg. Ticket", value: "$69.8", change: "+6% vs last month" },
                            ].map((s) => (
                                <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                                    <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                                    <p className="text-3xl font-bold text-gray-900">{s.value}</p>
                                    <p className="text-xs text-gray-400 mt-1">{s.change}</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                            {/* Bar chart */}
                            <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                                <h2 className="text-sm font-semibold text-gray-900 mb-6">Monthly Revenue</h2>
                                <div className="flex items-end gap-3 h-40">
                                    {monthlyRevenue.map((m) => {
                                        const height = Math.round((m.revenue / maxRevenue) * 100)
                                        return (
                                            <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                                                <span className="text-xs text-gray-500">${(m.revenue / 1000).toFixed(1)}k</span>
                                                <div
                                                    className="w-full rounded-t-md bg-black transition-all"
                                                    style={{ height: `${height}%` }}
                                                />
                                                <span className="text-xs text-gray-400">{m.month}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Top services */}
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                                <h2 className="text-sm font-semibold text-gray-900 mb-6">Revenue by Service</h2>
                                <div className="space-y-4">
                                    {topServices.map((svc) => (
                                        <div key={svc.name}>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs text-gray-700">{svc.name}</span>
                                                <span className="text-xs font-medium text-gray-900">{svc.revenue}</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-black rounded-full"
                                                    style={{ width: `${svc.share}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Analytics Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                            {/* Weekly Revenue — Area chart (spans 2 cols) */}
                            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                                <div className="flex items-center justify-between mb-5">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900">Weekly Revenue</h3>
                                        <p className="text-xs text-gray-400 mt-0.5">This week&apos;s daily earnings</p>
                                    </div>
                                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">+12% vs last week</span>
                                </div>
                                <ResponsiveContainer width="100%" height={180}>
                                    <AreaChart data={weeklyRevenue}>
                                        <defs>
                                            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#27272a" stopOpacity={0.15} />
                                                <stop offset="95%" stopColor="#27272a" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                                        <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={40}
                                               tickFormatter={(v) => `$${v}`} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }}
                                            formatter={(v) => [`$${Number(v).toLocaleString()}`, "Revenue"]}
                                        />
                                        <Area type="monotone" dataKey="revenue" stroke="#27272a" strokeWidth={2}
                                              fill="url(#revenueGrad)" dot={{ fill: "#27272a", r: 3 }} activeDot={{ r: 5 }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Right column: 2 small donuts */}
                            <div className="flex flex-col gap-4">
                                {/* Service category donut (static) */}
                                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex-1">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Services Mix</h3>
                                    <p className="text-xs text-gray-400 mb-3">Appointments by category</p>
                                    <div className="flex items-center gap-4">
                                        <ResponsiveContainer width={100} height={100}>
                                            <PieChart>
                                                <Pie data={serviceBreakdown} cx="50%" cy="50%" innerRadius={28} outerRadius={46}
                                                     dataKey="value" strokeWidth={2}>
                                                    {serviceBreakdown.map((entry) => (
                                                        <Cell key={entry.name} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }}
                                                         formatter={(v) => [`${v}%`, ""]} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="flex flex-col gap-1.5">
                                            {serviceBreakdown.map((s) => (
                                                <div key={s.name} className="flex items-center gap-2 text-xs text-gray-600">
                                                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                                                    {s.name} <span className="ml-auto text-gray-400 font-medium">{s.value}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Appointment status donut */}
                                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex-1">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Appointment Status</h3>
                                    <p className="text-xs text-gray-400 mb-3">Today&apos;s confirmation rate</p>
                                    <div className="flex items-center gap-4">
                                        <ResponsiveContainer width={100} height={100}>
                                            <PieChart>
                                                <Pie data={appointmentStatus} cx="50%" cy="50%" innerRadius={28} outerRadius={46}
                                                     dataKey="value" strokeWidth={2}>
                                                    {appointmentStatus.map((entry) => (
                                                        <Cell key={entry.name} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="flex flex-col gap-1.5">
                                            {appointmentStatus.map((s) => (
                                                <div key={s.name} className="flex items-center gap-2 text-xs text-gray-600">
                                                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                                                    {s.name} <span className="ml-auto font-medium text-gray-800">{s.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Monthly breakdown table */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h2 className="text-sm font-semibold text-gray-900">Monthly Breakdown</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                    <tr className="bg-gray-50 text-left">
                                        {["Month", "Revenue", "Appointments", "Avg. Ticket"].map((h) => (
                                            <th key={h} className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                    {[...monthlyRevenue].reverse().map((m) => (
                                        <tr key={m.month} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 font-medium text-gray-700">{m.month}</td>
                                            <td className="px-6 py-4 text-gray-900">${m.revenue.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-gray-600">{m.appointments}</td>
                                            <td className="px-6 py-4 text-gray-600">${(m.revenue / m.appointments).toFixed(0)}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="pt-2">
                            <div>
                                <h2 className="text-base font-bold text-gray-900">
                                    Job & Staff Analytics
                                </h2>

                                <p className="text-xs text-gray-400 mt-1">
                                    Daily workload and staff job distribution
                                    based on appointment activity.
                                </p>
                            </div>
                        </div>

                        {/* Job KPI cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Total Jobs
                                        </p>

                                        <p className="text-3xl font-bold text-gray-900 mt-1">
                                            {totalJobs}
                                        </p>
                                    </div>

                                    <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center">
                                        <CalendarDays
                                            size={18}
                                            className="text-zinc-700"
                                        />
                                    </div>
                                </div>

                                <p className="text-[10px] text-gray-400 mt-3">
                                    Non-cancelled appointments
                                </p>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Confirmed Jobs
                                        </p>

                                        <p className="text-3xl font-bold text-gray-900 mt-1">
                                            {totalConfirmed}
                                        </p>
                                    </div>

                                    <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center">
                                        <BarChart3
                                            size={18}
                                            className="text-zinc-700"
                                        />
                                    </div>
                                </div>

                                <p className="text-[10px] text-gray-400 mt-3">
                                    Confirmed appointments
                                </p>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Active Staff
                                        </p>

                                        <p className="text-3xl font-bold text-gray-900 mt-1">
                                            {activeStaff}
                                        </p>
                                    </div>

                                    <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center">
                                        <Users
                                            size={18}
                                            className="text-zinc-700"
                                        />
                                    </div>
                                </div>

                                <p className="text-[10px] text-gray-400 mt-3">
                                    Staff with assigned jobs
                                </p>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Avg. Jobs / Staff
                                    </p>

                                    <p className="text-3xl font-bold text-gray-900 mt-1">
                                        {avgJobsPerStaff.toFixed(1)}
                                    </p>
                                </div>

                                <p className="text-[10px] text-gray-400 mt-3">
                                    Average workload per staff member
                                </p>
                            </div>
                        </div>

                        {/* Daily jobs chart */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900">
                                        Daily Job Activity
                                    </h3>

                                    <p className="text-xs text-gray-400 mt-0.5">
                                        Number of active jobs scheduled per day
                                    </p>
                                </div>

                                <CalendarDays
                                    size={18}
                                    className="text-gray-400"
                                />
                            </div>

                            {dailyJobStats.length === 0 ? (
                                <div className="h-52 flex items-center justify-center">
                                    <p className="text-xs text-gray-400">
                                        No appointment activity available.
                                    </p>
                                </div>
                            ) : (
                                <ResponsiveContainer
                                    width="100%"
                                    height={220}
                                >
                                    <AreaChart
                                        data={dailyJobStats}
                                    >
                                        <defs>
                                            <linearGradient
                                                id="jobActivityGradient"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="#27272a"
                                                    stopOpacity={0.15}
                                                />

                                                <stop
                                                    offset="95%"
                                                    stopColor="#27272a"
                                                    stopOpacity={0}
                                                />
                                            </linearGradient>
                                        </defs>

                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#f3f4f6"
                                            vertical={false}
                                        />

                                        <XAxis
                                            dataKey="date"
                                            tick={{
                                                fontSize: 10,
                                                fill: "#9ca3af",
                                            }}
                                            axisLine={false}
                                            tickLine={false}
                                            tickFormatter={(date) =>
                                                new Date(
                                                    `${date}T00:00:00`
                                                ).toLocaleDateString(
                                                    "en-US",
                                                    {
                                                        month: "short",
                                                        day: "numeric",
                                                    }
                                                )
                                            }
                                        />

                                        <YAxis
                                            allowDecimals={false}
                                            tick={{
                                                fontSize: 10,
                                                fill: "#9ca3af",
                                            }}
                                            axisLine={false}
                                            tickLine={false}
                                            width={30}
                                        />

                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: 10,
                                                border:
                                                    "1px solid #e5e7eb",
                                                fontSize: 12,
                                            }}
                                            labelFormatter={(date) =>
                                                new Date(
                                                    `${date}T00:00:00`
                                                ).toLocaleDateString(
                                                    "en-US",
                                                    {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    }
                                                )
                                            }
                                        />

                                        <Area
                                            type="monotone"
                                            dataKey="jobs"
                                            name="Jobs"
                                            stroke="#27272a"
                                            strokeWidth={2}
                                            fill="url(#jobActivityGradient)"
                                            dot={{
                                                fill: "#27272a",
                                                r: 3,
                                            }}
                                            activeDot={{
                                                r: 5,
                                            }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>

                        {/* Staff Work Distribution */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900">
                                        Staff Work Distribution
                                    </h3>

                                    <p className="text-xs text-gray-400 mt-1">
                                        Distribution of active jobs across staff
                                        members
                                    </p>
                                </div>

                                <Users
                                    size={18}
                                    className="text-gray-400"
                                />
                            </div>

                            {staffWorkDistribution.length === 0 ? (
                                <div className="py-12 text-center">
                                    <p className="text-xs text-gray-400">
                                        No staff assignments available.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                        <tr className="bg-gray-50 text-left">
                                            <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                                Staff
                                            </th>

                                            <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">
                                                Jobs
                                            </th>

                                            <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">
                                                Confirmed
                                            </th>

                                            <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">
                                                Pending
                                            </th>

                                            <th className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                                Workload
                                            </th>
                                        </tr>
                                        </thead>

                                        <tbody className="divide-y divide-gray-100">
                                        {staffWorkDistribution.map(
                                            (member) => {
                                                const initials =
                                                    member.name
                                                        .split(" ")
                                                        .map(
                                                            (part) =>
                                                                part[0]
                                                        )
                                                        .join("")
                                                        .substring(0, 2)
                                                        .toUpperCase()

                                                return (
                                                    <tr
                                                        key={
                                                            member.name
                                                        }
                                                        className="hover:bg-gray-50/50 transition"
                                                    >
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-9 h-9 rounded-full bg-zinc-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                                                                    {initials ||
                                                                        "U"}
                                                                </div>

                                                                <span className="font-semibold text-gray-900">
                                                {
                                                    member.name
                                                }
                                            </span>
                                                            </div>
                                                        </td>

                                                        <td className="px-6 py-4 text-center font-bold text-gray-900">
                                                            {
                                                                member.jobs
                                                            }
                                                        </td>

                                                        <td className="px-6 py-4 text-center text-gray-600">
                                                            {
                                                                member.confirmed
                                                            }
                                                        </td>

                                                        <td className="px-6 py-4 text-center text-gray-600">
                                                            {
                                                                member.pending
                                                            }
                                                        </td>

                                                        <td className="px-6 py-4 min-w-56">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                                    <div
                                                                        className="h-full bg-zinc-800 rounded-full"
                                                                        style={{
                                                                            width: `${Math.max(
                                                                                4,
                                                                                (member.jobs /
                                                                                    maxStaffJobs) *
                                                                                100
                                                                            )}%`,
                                                                        }}
                                                                    />
                                                                </div>

                                                                <span className="w-12 text-right text-xs font-semibold text-gray-700">
                                                {member.workload.toFixed(
                                                    1
                                                )}
                                                                    %
                                            </span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Daily Job Breakdown */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h3 className="text-sm font-semibold text-gray-900">
                                    Daily Job Breakdown
                                </h3>

                                <p className="text-xs text-gray-400 mt-1">
                                    Daily confirmed, pending and cancelled
                                    appointment activity
                                </p>
                            </div>

                            {dailyJobStats.length === 0 ? (
                                <div className="py-12 text-center">
                                    <p className="text-xs text-gray-400">
                                        No daily job data available.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                        <tr className="bg-gray-50 text-left">
                                            {[
                                                "Date",
                                                "Jobs",
                                                "Confirmed",
                                                "Pending",
                                                "Cancelled",
                                            ].map((heading) => (
                                                <th
                                                    key={heading}
                                                    className="px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider"
                                                >
                                                    {heading}
                                                </th>
                                            ))}
                                        </tr>
                                        </thead>

                                        <tbody className="divide-y divide-gray-100">
                                        {[...dailyJobStats]
                                            .reverse()
                                            .map((day) => (
                                                <tr
                                                    key={day.date}
                                                    className="hover:bg-gray-50/50 transition"
                                                >
                                                    <td className="px-6 py-4 font-semibold text-gray-900">
                                                        {new Date(
                                                            `${day.date}T00:00:00`
                                                        ).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                month: "short",
                                                                day: "numeric",
                                                                year: "numeric",
                                                            }
                                                        )}
                                                    </td>

                                                    <td className="px-6 py-4 font-bold text-gray-900">
                                                        {day.jobs}
                                                    </td>

                                                    <td className="px-6 py-4 text-gray-600">
                                                        {day.confirmed}
                                                    </td>

                                                    <td className="px-6 py-4 text-gray-600">
                                                        {day.pending}
                                                    </td>

                                                    <td className="px-6 py-4 text-red-600">
                                                        {day.cancelled}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
        </>
    )
}


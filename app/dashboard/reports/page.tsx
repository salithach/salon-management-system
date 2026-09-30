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
import {BarChart3, CalendarDays, Download, Users} from "lucide-react"
import {useEffect, useMemo, useRef, useState} from "react";
import {useStatStore} from "@/store/statStore";
import {useAuthStore} from "@/store/authStore";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

import LoadingOverlay from "@/components/LoadingOverlay";

const COMING_SOON = false

const SERVICE_COLORS = ["#27272a", "#52525b", "#71717a", "#a1a1aa", "#d4d4d8"]
const STATUS_COLORS = { confirmed: "#27272a", pending: "#d4d4d8" }


const formatSignedPercent = (value: number) => {
    const v = value ?? 0
    return `${v > 0 ? "+" : ""}${v.toFixed(1)}%`
}

const formatSignedNumber = (value: number) => {
    const v = value ?? 0
    return `${v > 0 ? "+" : ""}${v}`
}

const formatDateLabel = (date: string, withYear = false) =>
    new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        ...(withYear ? { year: "numeric" as const } : {}),
    })

export default function ReportsPage() {
    const {
        stats,
        statsLoading,
        fetchStats,
    } = useStatStore()

    const { user, _hasHydrated: authReady, fetchProfile } = useAuthStore()
    const currency = user?.salon?.currency?.toUpperCase() || "USD"

    const formatCurrency = (value: number) =>
        `${(value ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 })} ${currency}`

    const formatCurrencyCompact = (value: number) =>
        `${(value / 1000).toFixed(1)}k ${currency}`

    useEffect(() => {
        if (authReady && !user) fetchProfile().then(() => {})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authReady])

    useEffect(() => {
        fetchStats().then(() => {})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const reportRef = useRef<HTMLDivElement>(null)
    const [exporting, setExporting] = useState(false)

    const handleExportPdf = async () => {
        if (!reportRef.current || exporting) return
        setExporting(true)
        try {
            const canvas = await html2canvas(reportRef.current, {
                scale: 1.5,
                backgroundColor: "#f9fafb",
                useCORS: true,
            })
            // JPEG compresses dramatically better than PNG for this kind of
            // content (gradients/anti-aliased text), keeping file size small.
            const imgData = canvas.toDataURL("image/jpeg", 0.85)

            const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4", compress: true })
            const pageWidth = pdf.internal.pageSize.getWidth()
            const pageHeight = pdf.internal.pageSize.getHeight()
            const imgWidth = pageWidth
            const imgHeight = (canvas.height * imgWidth) / canvas.width

            let heightLeft = imgHeight
            let position = 0

            pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight)
            heightLeft -= pageHeight

            while (heightLeft > 0) {
                position = heightLeft - imgHeight
                pdf.addPage()
                pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight)
                heightLeft -= pageHeight
            }

            const dateStr = new Date().toISOString().slice(0, 10)
            pdf.save(`salon-report-${dateStr}.pdf`)
        } catch (err) {
            console.error("Failed to export report as PDF", err)
        } finally {
            setExporting(false)
        }
    }

    const overview = stats?.overview
    const appointmentStatus = stats?.appointmentStatus
    const jobStaffAnalytics = stats?.jobStaffAnalytics

    const monthlyBreakdown = useMemo(
        () => stats?.monthlyBreakdown ?? [],
        [stats?.monthlyBreakdown]
    )
    const revenueByService = useMemo(
        () => stats?.revenueByService ?? [],
        [stats?.revenueByService]
    )
    const weeklyRevenue = useMemo(
        () => stats?.weeklyRevenue ?? [],
        [stats?.weeklyRevenue]
    )
    const servicesMix = useMemo(
        () => stats?.servicesMix ?? [],
        [stats?.servicesMix]
    )
    const dailyJobActivity = useMemo(
        () => jobStaffAnalytics?.dailyJobActivity ?? [],
        [jobStaffAnalytics?.dailyJobActivity]
    )
    const staffWorkDistribution = useMemo(
        () => jobStaffAnalytics?.staffWorkDistribution ?? [],
        [jobStaffAnalytics?.staffWorkDistribution]
    )
    const dailyJobBreakdown = useMemo(
        () => jobStaffAnalytics?.dailyJobBreakdown ?? [],
        [jobStaffAnalytics?.dailyJobBreakdown]
    )

    const maxMonthlyRevenue = useMemo(
        () => Math.max(...monthlyBreakdown.map((m) => m.revenue), 1),
        [monthlyBreakdown]
    )

    const totalServiceRevenue = useMemo(
        () => revenueByService.reduce((total, s) => total + s.revenue, 0),
        [revenueByService]
    )

    const servicesMixData = useMemo(
        () =>
            servicesMix.map((s, i) => ({
                name: s.category,
                value: s.percent,
                count: s.count,
                color: SERVICE_COLORS[i % SERVICE_COLORS.length],
            })),
        [servicesMix]
    )

    const appointmentStatusData = useMemo(() => {
        if (!appointmentStatus) return []
        return [
            { name: "Confirmed", value: appointmentStatus.confirmed, color: STATUS_COLORS.confirmed },
            { name: "Pending", value: appointmentStatus.pending, color: STATUS_COLORS.pending },
        ]
    }, [appointmentStatus])

    const maxStaffJobs = useMemo(
        () => Math.max(...staffWorkDistribution.map((m) => m.jobs), 1),
        [staffWorkDistribution]
    )

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

    if (!statsLoading && !stats) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center">
                    <BarChart3 size={28} className="text-zinc-400" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">No report data available</h2>
                    <p className="text-sm text-gray-400 mt-1 max-w-sm">
                        We couldn&apos;t find any analytics for this salon yet.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <>
            {statsLoading && (
                <LoadingOverlay message="Preparing reports…" />
            )}

            <div className="flex items-center justify-between mb-2">
                <div>
                    <h1 className="text-lg font-semibold text-gray-900">Reports</h1>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Revenue, appointment and staff performance insights
                    </p>
                </div>

                <button
                    onClick={handleExportPdf}
                    disabled={exporting || statsLoading || !stats}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    <Download size={16} />
                    {exporting ? "Exporting…" : "Export PDF"}
                </button>
            </div>

            <div ref={reportRef} className="space-y-6 bg-gray-50 p-1">
                        {/* KPI cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                            {[
                                {
                                    label: "Monthly Revenue",
                                    value: formatCurrency(overview?.monthlyRevenue ?? 0),
                                    change: `${formatSignedPercent(overview?.monthlyRevenueChangePercent ?? 0)} vs last month`,
                                },
                                {
                                    label: "Total Appointments",
                                    value: String(overview?.totalAppointments ?? 0),
                                    change: `${formatSignedPercent(overview?.appointmentsChangePercent ?? 0)} vs last month`,
                                },
                                {
                                    label: "New Clients",
                                    value: String(overview?.newClients ?? 0),
                                    change: `${formatSignedNumber(overview?.newClientsChange ?? 0)} vs last month`,
                                },
                                {
                                    label: "Avg. Ticket",
                                    value: formatCurrency(overview?.avgTicket ?? 0),
                                    change: `${formatSignedPercent(overview?.avgTicketChangePercent ?? 0)} vs last month`,
                                },
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
                                {monthlyBreakdown.length === 0 ? (
                                    <div className="h-40 flex items-center justify-center">
                                        <p className="text-xs text-gray-400">No revenue data available.</p>
                                    </div>
                                ) : (
                                    <div className="flex items-end gap-3 h-40">
                                        {monthlyBreakdown.map((m) => {
                                            const height = Math.round((m.revenue / maxMonthlyRevenue) * 100)
                                            return (
                                                <div key={m.month} className="flex-1 flex flex-col items-center gap-2 h-full">
                                                    <span className="text-xs text-gray-500">{formatCurrencyCompact(m.revenue)}</span>
                                                    <div className="w-full flex-1 flex items-end">
                                                        <div
                                                            className="w-full rounded-t-md bg-black transition-all"
                                                            style={{ height: `${Math.max(height, m.revenue > 0 ? 2 : 0)}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-gray-400">{m.month}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Top services */}
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                                <h2 className="text-sm font-semibold text-gray-900 mb-6">Revenue by Service</h2>
                                {revenueByService.length === 0 ? (
                                    <p className="text-xs text-gray-400">No service revenue data available.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {revenueByService.map((svc) => {
                                            const share = totalServiceRevenue > 0
                                                ? (svc.revenue / totalServiceRevenue) * 100
                                                : 0
                                            return (
                                                <div key={svc.service}>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-xs text-gray-700">{svc.service}</span>
                                                        <span className="text-xs font-medium text-gray-900">{formatCurrency(svc.revenue)}</span>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-black rounded-full"
                                                            style={{ width: `${share}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
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
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                        (stats?.weeklyRevenueChangePercent ?? 0) >= 0
                                            ? "text-green-600 bg-green-50"
                                            : "text-red-600 bg-red-50"
                                    }`}>
                                        {formatSignedPercent(stats?.weeklyRevenueChangePercent ?? 0)} vs last week
                                    </span>
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
                                        <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={40}
                                               tickFormatter={(v) => `${v}`} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }}
                                            formatter={(v) => [`${Number(v).toLocaleString()} ${currency}`, "Revenue"]}
                                        />
                                        <Area type="monotone" dataKey="revenue" stroke="#27272a" strokeWidth={2}
                                              fill="url(#revenueGrad)" dot={{ fill: "#27272a", r: 3 }} activeDot={{ r: 5 }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Right column: 2 small donuts */}
                            <div className="flex flex-col gap-4">
                                {/* Service category donut */}
                                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex-1">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Services Mix</h3>
                                    <p className="text-xs text-gray-400 mb-3">Appointments by category</p>
                                    {servicesMixData.length === 0 ? (
                                        <p className="text-xs text-gray-400">No category data available.</p>
                                    ) : (
                                        <div className="flex items-center gap-4">
                                            <ResponsiveContainer width={100} height={100}>
                                                <PieChart>
                                                    <Pie data={servicesMixData} cx="50%" cy="50%" innerRadius={28} outerRadius={46}
                                                         dataKey="value" strokeWidth={2}>
                                                        {servicesMixData.map((entry) => (
                                                            <Cell key={entry.name} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }}
                                                             formatter={(v) => [`${v}%`, ""]} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="flex flex-col gap-1.5">
                                                {servicesMixData.map((s) => (
                                                    <div key={s.name} className="flex items-center gap-2 text-xs text-gray-600">
                                                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                                                        {s.name} <span className="ml-auto text-gray-400 font-medium">{s.value}%</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Appointment status donut */}
                                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex-1">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Appointment Status</h3>
                                    <p className="text-xs text-gray-400 mb-3">Today&apos;s confirmation rate</p>
                                    {appointmentStatusData.length === 0 ? (
                                        <p className="text-xs text-gray-400">No appointment status data available.</p>
                                    ) : (
                                        <div className="flex items-center gap-4">
                                            <ResponsiveContainer width={100} height={100}>
                                                <PieChart>
                                                    <Pie data={appointmentStatusData} cx="50%" cy="50%" innerRadius={28} outerRadius={46}
                                                         dataKey="value" strokeWidth={2}>
                                                        {appointmentStatusData.map((entry) => (
                                                            <Cell key={entry.name} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="flex flex-col gap-1.5">
                                                {appointmentStatusData.map((s) => (
                                                    <div key={s.name} className="flex items-center gap-2 text-xs text-gray-600">
                                                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                                                        {s.name} <span className="ml-auto font-medium text-gray-800">{s.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Monthly breakdown table */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h2 className="text-sm font-semibold text-gray-900">Monthly Breakdown</h2>
                            </div>
                            {monthlyBreakdown.length === 0 ? (
                                <div className="py-12 text-center">
                                    <p className="text-xs text-gray-400">No monthly data available.</p>
                                </div>
                            ) : (
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
                                        {[...monthlyBreakdown].reverse().map((m) => (
                                            <tr key={m.month} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 font-medium text-gray-700">{m.month}</td>
                                                <td className="px-6 py-4 text-gray-900">{formatCurrency(m.revenue)}</td>
                                                <td className="px-6 py-4 text-gray-600">{m.appointments}</td>
                                                <td className="px-6 py-4 text-gray-600">{formatCurrency(m.avgTicket)}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
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
                                            {jobStaffAnalytics?.totalJobs ?? 0}
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
                                            {jobStaffAnalytics?.confirmedJobs ?? 0}
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
                                            {jobStaffAnalytics?.activeStaff ?? 0}
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
                                        {(jobStaffAnalytics?.avgJobsPerStaff ?? 0).toFixed(1)}
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

                            {dailyJobActivity.length === 0 ? (
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
                                        data={dailyJobActivity}
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
                                            dataKey="jobCount"
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
                                                    member.staff
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
                                                            member.staff
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
                                                    member.staff
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
                                                {member.workloadPercent.toFixed(
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

                            {dailyJobBreakdown.length === 0 ? (
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
                                        {[...dailyJobBreakdown]
                                            .reverse()
                                            .map((day) => (
                                                <tr
                                                    key={day.date}
                                                    className="hover:bg-gray-50/50 transition"
                                                >
                                                    <td className="px-6 py-4 font-semibold text-gray-900">
                                                        {formatDateLabel(day.date, true)}
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
                    </div>
        </>
    )
}


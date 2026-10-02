"use client"

import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import {BarChart3, CalendarDays, Download, Users} from "lucide-react"
import {useEffect, useMemo, useRef, useState} from "react";
import {useStatStore} from "@/store/statStore";
import {useAuthStore} from "@/store/authStore";
import {DateRange, RangeKeyDict} from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

import LoadingOverlay from "@/components/LoadingOverlay";
import DonutCard from "@/components/DonutCard";
import {getLocalDateString} from "@/lib/apiFetch";

const COMING_SOON = false

const SERVICE_COLORS = ["#27272a", "#52525b", "#71717a", "#a1a1aa", "#d4d4d8"]
const STATUS_COLORS = { confirmed: "#27272a", pending: "#d4d4d8" }



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


    useEffect(() => {
        if (authReady && !user) fetchProfile().then(() => {})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authReady])


    const today = new Date()
    const [dateRange, setDateRange] = useState<Array<{
        startDate: Date
        endDate: Date
        key: string
    }>>([
        {
            startDate: today,
            endDate: today,
            key: "selection",
        },
    ])
    const [showDatePicker, setShowDatePicker] = useState(false)

    // Range that has actually been applied (both start & end chosen) — drives the API call
    const [appliedRange, setAppliedRange] = useState<{ startDate: Date; endDate: Date }>({
        startDate: today,
        endDate: today,
    })
    // true after the first click (start date) until the second click (end date)
    const selectingEndRef = useRef(false)

    const closeDatePicker = () => {
        // Discard a half-finished selection (start picked, end not picked)
        if (selectingEndRef.current) {
            selectingEndRef.current = false
            setDateRange([{ ...appliedRange, key: "selection" }])
        }
        setShowDatePicker(false)
    }

    const rangeStart = appliedRange.startDate
    const rangeEnd = appliedRange.endDate
    const rangeDays = rangeStart && rangeEnd
        ? Math.round(
            (new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), rangeEnd.getDate()).getTime() -
                new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate()).getTime()) /
            86400000
        ) + 1
        : 1
    const rangeLabel = rangeStart && rangeEnd
        ? rangeDays === 1
            ? rangeStart.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            : `${rangeStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${rangeEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
        : ""

    useEffect(() => {
        fetchStats(
            getLocalDateString(appliedRange.startDate),
            getLocalDateString(appliedRange.endDate)
        ).then(() => {})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appliedRange])

    const reportRef = useRef<HTMLDivElement>(null)
    const [exporting, setExporting] = useState(false)

    const handleExportPdf = async () => {
        if (!reportRef.current || exporting) return
        setExporting(true)
        try {
            // Render each top-level section on its own so page breaks never cut
            // through a card (e.g. the donut charts).
            const sections = Array.from(reportRef.current.children) as HTMLElement[]

            const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4", compress: true })
            const pageWidth = pdf.internal.pageSize.getWidth()
            const pageHeight = pdf.internal.pageSize.getHeight()
            const margin = 24
            const gap = 12
            const contentWidth = pageWidth - margin * 2
            const maxHeight = pageHeight - margin * 2
            let y = margin

            for (const el of sections) {
                const canvas = await html2canvas(el, {
                    scale: 1.5,
                    backgroundColor: "#f9fafb",
                    useCORS: true,
                })
                const ratio = contentWidth / canvas.width
                const drawHeight = canvas.height * ratio

                if (drawHeight <= maxHeight) {
                    // Fits on a page: move to a new page if the rest of this one is too small
                    if (y + drawHeight > pageHeight - margin && y > margin) {
                        pdf.addPage()
                        y = margin
                    }
                    // JPEG keeps file size small for gradients/anti-aliased text
                    pdf.addImage(canvas.toDataURL("image/jpeg", 0.85), "JPEG", margin, y, contentWidth, drawHeight)
                    y += drawHeight + gap
                } else {
                    // Taller than a page (long tables): slice across pages
                    if (y > margin) {
                        pdf.addPage()
                        y = margin
                    }
                    const slicePx = Math.floor(maxHeight / ratio)
                    for (let sy = 0; sy < canvas.height; sy += slicePx) {
                        const h = Math.min(slicePx, canvas.height - sy)
                        const slice = document.createElement("canvas")
                        slice.width = canvas.width
                        slice.height = h
                        slice.getContext("2d")?.drawImage(canvas, 0, sy, canvas.width, h, 0, 0, canvas.width, h)
                        if (sy > 0) {
                            pdf.addPage()
                            y = margin
                        }
                        pdf.addImage(slice.toDataURL("image/jpeg", 0.85), "JPEG", margin, y, contentWidth, h * ratio)
                        y += h * ratio + gap
                    }
                }
            }

            const startStr = getLocalDateString(appliedRange.startDate)
            const endStr = getLocalDateString(appliedRange.endDate)
            pdf.save(`salon-analytics-${startStr}-${endStr}.pdf`)
        } catch (err) {
            console.error("Failed to export report as PDF", err)
        } finally {
            setExporting(false)
        }
    }

    const overview = stats?.overview
    const appointmentStatus = stats?.appointmentStatus
    const jobStaffAnalytics = stats?.jobStaffAnalytics

    const dailyRevenue = useMemo(
        () => stats?.dailyRevenue ?? [],
        [stats?.dailyRevenue]
    )
    const revenueByService = useMemo(
        () => stats?.revenueByService ?? [],
        [stats?.revenueByService]
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


    const jobsByDate = useMemo(
        () => new Map(dailyJobBreakdown.map((d) => [d.date, d.jobs])),
        [dailyJobBreakdown]
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

    const revenueShareData = useMemo(
        () =>
            revenueByService
                .filter((s) => s.revenue > 0)
                .map((s, i) => ({
                    name: s.service,
                    value: s.revenue,
                    color: SERVICE_COLORS[i % SERVICE_COLORS.length],
                })),
        [revenueByService]
    )

    const staffWorkloadData = useMemo(
        () =>
            staffWorkDistribution
                .filter((m) => m.jobs > 0)
                .map((m, i) => ({
                    name: m.staff,
                    value: m.jobs,
                    color: SERVICE_COLORS[i % SERVICE_COLORS.length],
                })),
        [staffWorkDistribution]
    )

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
                    <h1 className="text-lg font-semibold text-gray-900">Analyse Your Salon</h1>
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

            {/* Date Range Picker */}
            <div className="mb-6 relative">
                <button
                    onClick={() => (showDatePicker ? closeDatePicker() : setShowDatePicker(true))}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-900 hover:bg-gray-50 transition"
                >
                    📅 {dateRange[0]?.startDate?.toLocaleDateString("en-US")}
                    {dateRange[0]?.startDate?.getTime() !== dateRange[0]?.endDate?.getTime() &&
                        ` - ${dateRange[0]?.endDate?.toLocaleDateString("en-US")}`}
                </button>
                {showDatePicker && (
                    <div className="absolute z-50 mt-2 bg-white rounded-lg border border-gray-200 shadow-lg left-0 overflow-hidden">
                        <div className="p-4 flex flex-col gap-3">
                            <DateRange
                                ranges={dateRange}
                                onChange={(item: RangeKeyDict) => {
                                    const selection = item.selection
                                    if (selection?.startDate && selection?.endDate) {
                                        setDateRange([{
                                            startDate: selection.startDate,
                                            endDate: selection.endDate,
                                            key: "selection",
                                        }])
                                        if (!selectingEndRef.current) {
                                            // first click: start date chosen, wait for end date
                                            selectingEndRef.current = true
                                        } else {
                                            // second click: both dates chosen → apply & fetch
                                            selectingEndRef.current = false
                                            setAppliedRange({
                                                startDate: selection.startDate,
                                                endDate: selection.endDate,
                                            })
                                        }
                                    }
                                }}
                                showDateDisplay={false}
                                showPreview={true}
                            />
                            <button
                                onClick={closeDatePicker}
                                className="px-4 py-2 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div ref={reportRef} className="space-y-6 bg-gray-50 p-1">
                {/* KPI cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {[
                        {
                            label: "Revenue",
                            value: formatCurrency(overview?.monthlyRevenue ?? 0),
                            change: rangeLabel,
                        },
                        {
                            label: "Jobs",
                            value: String(overview?.monthlyJobs ?? 0),
                            change: `Avg ${(rangeDays > 0 ? (overview?.monthlyJobs ?? 0) / rangeDays : 0).toFixed(1)} per day`,
                        },
                        {
                            label: "Appointments",
                            value: String(overview?.totalAppointments ?? 0),
                            change: `Avg ${(rangeDays > 0 ? (overview?.totalAppointments ?? 0) / rangeDays : 0).toFixed(1)} per day`,
                        },
                        {
                            label: "Avg. Daily Revenue",
                            value: formatCurrency(rangeDays > 0 ? (overview?.monthlyRevenue ?? 0) / rangeDays : 0),
                            change: `Over ${rangeDays} day${rangeDays !== 1 ? "s" : ""}`,
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
                    {/* Revenue over the selected range */}
                    <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="text-sm font-semibold text-gray-900">Daily Revenue</h2>
                                <p className="text-xs text-gray-400 mt-0.5">Revenue per day · {rangeLabel}</p>
                            </div>
                            <CalendarDays size={18} className="text-gray-400" />
                        </div>
                        {dailyRevenue.length === 0 ? (
                            <div className="h-52 flex items-center justify-center">
                                <p className="text-xs text-gray-400">No revenue data for selected date range.</p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={220}>
                                <AreaChart data={dailyRevenue}>
                                    <defs>
                                        <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#27272a" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#27272a" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false}
                                           tickFormatter={(d) => formatDateLabel(String(d))} />
                                    <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={40} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }}
                                        labelFormatter={(d) => formatDateLabel(String(d), true)}
                                        formatter={(v) => [`${Number(v).toLocaleString()} ${currency}`, "Revenue"]}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#27272a" strokeWidth={2}
                                          fill="url(#revenueGrad)" dot={{ fill: "#27272a", r: 3 }} activeDot={{ r: 5 }} />
                                </AreaChart>
                            </ResponsiveContainer>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <DonutCard
                        title="Appointments Services Mix"
                        subtitle="Appointments by category"
                        data={servicesMixData}
                        format={(v) => `${v}%`}
                        emptyText="No category data available."
                    />
                    <DonutCard
                        title="Appointment Status"
                        subtitle="Confirmation rate"
                        data={appointmentStatusData}
                        emptyText="No appointment status data available."
                    />
                    <DonutCard
                        title="Revenue Share"
                        subtitle="Revenue by service"
                        data={revenueShareData}
                        format={formatCurrency}
                        emptyText="No service revenue data available."
                    />
                    <DonutCard
                        title="Staff Workload"
                        subtitle="Jobs per staff member"
                        data={staffWorkloadData}
                        emptyText="No staff assignments available."
                    />
                </div>

                {/* Daily breakdown table */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-sm font-semibold text-gray-900">Daily Income Breakdown</h2>
                    </div>
                    {dailyRevenue.length === 0 ? (
                        <div className="py-12 text-center">
                            <p className="text-xs text-gray-400">No data available for selected date range.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                <tr className="bg-gray-50 text-left">
                                    {["Date", "Revenue", "Jobs"].map((h) => (
                                        <th key={h} className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                {[...dailyRevenue].reverse().map((d) => (
                                    <tr key={d.date} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-medium text-gray-700">{formatDateLabel(d.date, true)}</td>
                                        <td className="px-6 py-4 text-gray-900">{formatCurrency(d.revenue)}</td>
                                        <td className="px-6 py-4 text-gray-600">{jobsByDate.get(d.date) ?? 0}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Daily jobs chart */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">
                                Daily Job Activity
                            </h3>

                            <p className="text-xs text-gray-400 mt-0.5">
                                Active jobs per day in selected date range
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
                                Staff Appointment Distribution
                            </h3>

                            <p className="text-xs text-gray-400 mt-1">
                                Job distribution across staff for selected date range
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

                {/* Daily Appointment Breakdown */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h3 className="text-sm font-semibold text-gray-900">
                                    Daily Appointment Breakdown
                                </h3>

                                <p className="text-xs text-gray-400 mt-1">
                                    Appointment status per day for selected date range
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


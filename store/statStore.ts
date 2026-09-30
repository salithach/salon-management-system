import { create } from "zustand"

import {apiFetch, getLocalDateString} from "@/lib/apiFetch"
import { useAuthStore } from "@/store/authStore"


const authHeaders = (): Record<string, string> => {
    const token = useAuthStore.getState().token
    return token ? { Authorization: `Bearer ${token}` } : {}
}

export type ReportsOverview = {
    monthlyRevenue: number
    monthlyRevenueChangePercent: number
    monthlyJobs: number
    monthlyJobsChangePercent: number
    totalAppointments: number
    appointmentsChangePercent: number
    newClients: number
    newClientsChange: number
    avgJobRevenue: number
    avgJobRevenueChangePercent: number
}

export type RevenueTrendPoint = {
    label: string
    revenue: number
}

export type RevenueByServiceItem = {
    service: string
    revenue: number
}

export type ServicesMixItem = {
    category: string
    count: number
    percent: number
}

export type AppointmentStatusSummary = {
    confirmed: number
    pending: number
}

export type MonthlyBreakdownItem = {
    month: string
    revenue: number
    jobs: number
    appointments: number
    avgJobRevenue: number
}

export type DailyJobActivityPoint = {
    date: string
    jobCount: number
}

export type StaffWorkDistributionItem = {
    staff: string
    jobs: number
    confirmed: number
    pending: number
    workloadPercent: number
}

export type DailyJobBreakdownItem = {
    date: string
    jobs: number
    confirmed: number
    pending: number
    cancelled: number
}

export type JobStaffAnalytics = {
    totalJobs: number
    confirmedJobs: number
    activeStaff: number
    avgJobsPerStaff: number
    dailyJobActivity: DailyJobActivityPoint[]
    staffWorkDistribution: StaffWorkDistributionItem[]
    dailyJobBreakdown: DailyJobBreakdownItem[]
}

export type ReportData = {
    overview: ReportsOverview
    monthlyRevenueTrend: RevenueTrendPoint[]
    revenueByService: RevenueByServiceItem[]
    weeklyRevenue: RevenueTrendPoint[]
    weeklyRevenueChangePercent: number
    servicesMix: ServicesMixItem[]
    appointmentStatus: AppointmentStatusSummary
    monthlyBreakdown: MonthlyBreakdownItem[]
    jobStaffAnalytics: JobStaffAnalytics
}

type StatState = {
    stats: ReportData | null
    statsLoading: boolean
    error: string | null
    fetchStats: (date?: string) => Promise<void>
}

export const useStatStore =
    create<StatState>()((set, get) => ({
        stats: null,
        statsLoading: false,
        error: null,
        fetchStats: async (date?: string) => {
            if (get().statsLoading) return
            set({ statsLoading: true, error: null })
            try {
                const d = date ?? getLocalDateString()
                const res = await apiFetch(`/api/stats?date=${d}`, { headers: authHeaders() })
                const data = await res.json()
                if (!res.ok) {
                    set({ error: data?.message || "Failed to fetch stats", statsLoading: false })
                    return
                }
                set({ stats: data?.data, statsLoading: false })
            } catch (err) {
                set({ error: (err as Error).message, statsLoading: false })
            }
        },
}))
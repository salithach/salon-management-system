import { create } from "zustand"

import { apiFetch } from "@/lib/apiFetch"
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

export type DailyRevenuePoint = {
    date: string      // YYYY-MM-DD
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
    revenueByService: RevenueByServiceItem[]
    dailyRevenue: DailyRevenuePoint[]
    dailyRevenueChangePercent: number
    servicesMix: ServicesMixItem[]
    appointmentStatus: AppointmentStatusSummary
    jobStaffAnalytics: JobStaffAnalytics
}

type StatState = {
    stats: ReportData | null
    statsLoading: boolean
    error: string | null
    fetchStats: (startDate?: string, endDate?: string) => Promise<void>
}

export const useStatStore =
    create<StatState>()((set, get) => ({
        stats: null,
        statsLoading: false,
        error: null,
        fetchStats: async (startDate?: string, endDate?: string) => {
            if (get().statsLoading) return
            set({ statsLoading: true, error: null })
            try {
                const params = new URLSearchParams()
                if (startDate) params.set("startDate", startDate)
                if (endDate) params.set("endDate", endDate)
                const qs = params.toString()
                const res = await apiFetch(`/api/stats${qs ? `?${qs}` : ""}`, { headers: authHeaders() })
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
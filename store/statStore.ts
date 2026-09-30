import { create } from "zustand"

import {apiFetch, getLocalDateString} from "@/lib/apiFetch"
import { useAuthStore } from "@/store/authStore"


const authHeaders = (): Record<string, string> => {
    const token = useAuthStore.getState().token
    return token ? { Authorization: `Bearer ${token}` } : {}
}

export type ReportData = {
    [key: string]: unknown
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
                console.log(data)
                set({ stats: data?.data, statsLoading: false })
            } catch (err) {
                set({ error: (err as Error).message, statsLoading: false })
            }
        },
}))
import { create } from "zustand"
import { apiFetch } from "@/lib/apiFetch"
import { useAuthStore } from "@/store/authStore"

const authHeaders = (): Record<string, string> => {
    const token = useAuthStore.getState().token
    return token ? { Authorization: `Bearer ${token}` } : {}
}

export type JobType = {
    key: string
    value: string
}

export type JobTypesState = {
    jobTypes: JobType[]
    jobTypesLoading: boolean
    error: string | null
    fetchJobTypes: () => Promise<void>
}

export const useJobTypesStore = create<JobTypesState>()((set, get) => ({
    jobTypes: [],
    jobTypesLoading: false,
    error: null,

    fetchJobTypes: async () => {
        if (get().jobTypesLoading) return
        set({ jobTypesLoading: true, error: null })
        try {
            const res = await apiFetch("/api/jobTypes", { headers: authHeaders() })
            const data = await res.json()
            if (!res.ok) {
                set({ error: data?.error?.message || "Failed to fetch job types", jobTypesLoading: false })
                return
            }
            set({ jobTypes: data?.data, jobTypesLoading: false })
        } catch (err) {
            set({ error: (err as Error).message, jobTypesLoading: false })
        }
    },
}))


import { create } from "zustand"
import {apiFetch} from "@/lib/apiFetch";
import {useAuthStore} from "@/store/authStore";

const authHeaders = (): Record<string, string> => {
    const token = useAuthStore.getState().token
    return token ? { Authorization: `Bearer ${token}` } : {}
}

export type JobRole = {
    key: string
    value: string
}

export type JobRolesState = {
    jobRoles: JobRole[]
    jobRolesLoading: boolean
    error: string | null
    fetchJobRoles: () => Promise<void>
}

export const useJobRolesStore = create<JobRolesState>()((set, get) => ({
    jobRoles: [],
    jobRolesLoading: false,
    error: null,

    fetchJobRoles: async () => {
        if (get().jobRolesLoading) return
        set({ jobRolesLoading: true, error: null })
        try {
            const res = await apiFetch("/api/jobRoles", { headers: authHeaders() })
            const data = await res.json()
            if (!res.ok) {
                set({ error: data?.error?.message || "Failed to fetch job roles", jobRolesLoading: false })
                return
            }

            set({ jobRoles: data?.data, jobRolesLoading: false })
        } catch (err) {
            set({ error: (err as Error).message, jobRolesLoading: false })
        }
    }
}))

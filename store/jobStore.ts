import { create } from "zustand"
import { apiFetch, getLocalDateString } from "@/lib/apiFetch"
import { useAuthStore } from "@/store/authStore"
import { StaffMember } from "@/store/staffStore"

const authHeaders = (): Record<string, string> => {
    const token = useAuthStore.getState().token
    return token ? { Authorization: `Bearer ${token}` } : {}
}

export type JobDetails = {
    price: number
    services: string[]
    description: string | null
}

export type JobList = {
    id: string
    date: string
    assignee: string // username
    jobs: JobDetails[]
}

export type JobState = {
    jobs: JobList[]
    jobsLoading: boolean
    error: string | null
    fetchJobs: (date?: string) => Promise<void>
    addJob: (member: StaffMember, services: string[], price: number, description?: string) => Promise<void>
}

export const useJobStore = create<JobState>()((set, get) => ({
    jobs: [],
    jobsLoading: false,
    error: null,

    fetchJobs: async (date?: string) => {
        if (get().jobsLoading) return
        set({ jobsLoading: true, error: null })
        try {
            const d = date ?? getLocalDateString()
            const res = await apiFetch(`/api/jobs?date=${d}`, { headers: authHeaders() })
            const data = await res.json()
            if (!res.ok) {
                set({ error: data?.message || "Failed to fetch jobs", jobsLoading: false })
                return
            }
            set({ jobs: data?.data, jobsLoading: false })
        } catch (err) {
            set({ error: (err as Error).message, jobsLoading: false })
        }
    },

    addJob: async (member, services, price, description) => {
        const date = getLocalDateString()
        const res = await apiFetch("/api/jobs", {
            method: "POST",
            headers: { "Content-Type": "application/json", ...authHeaders() },
            body: JSON.stringify({
                date,
                assignee: member,
                services,
                price,
                description,
            }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data?.message || "Failed to add job")

        const newDetail: JobDetails = { price, services, description: description ?? null }
        set((state) => {
            const existing = state.jobs.find((jl) => jl.assignee === member.username)
            if (existing) {
                return {
                    jobs: state.jobs.map((jl) =>
                        jl.assignee === member.username
                            ? { ...jl, jobs: [...jl.jobs, newDetail] }
                            : jl
                    ),
                }
            }
            return {
                jobs: [...state.jobs, {
                    id: `${date}-${member.username}-jobs`,
                    date,
                    assignee: member.username,
                    jobs: [newDetail],
                }],
            }
        })
    },
}))

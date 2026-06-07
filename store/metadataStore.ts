import { create } from "zustand"
import { persist } from "zustand/middleware"
import { apiFetch } from "@/lib/apiFetch"
import { useAuthStore } from "@/store/authStore"

export type JobType = {
    key: string
    value: string
    category?: string
}

export type JobRole = {
    key: string
    value: string
}

type MetadataState = {
    jobTypes: JobType[]
    jobRoles: JobRole[]
    metadataLoading: boolean
    error: string | null
    hasFetched: boolean
    fetchMetadata: (options?: { force?: boolean }) => Promise<void>
    addJobType: (entry: JobType) => Promise<void>
    clearMetadata: () => void
}

const authHeaders = (): Record<string, string> => {
    const token = useAuthStore.getState().token
    return token ? { Authorization: `Bearer ${token}` } : {}
}

const toSafeArray = (value: unknown): JobType[] => {
    if (!Array.isArray(value)) return []
    return value.filter((item): item is JobType => {
        return typeof item === "object" && item !== null && "key" in item && "value" in item
    }).map((item) => ({
        key: item.key,
        value: item.value,
        ...(item.category ? { category: item.category } : {}),
    }))
}

export const useMetadataStore = create<MetadataState>()(
    persist(
        (set, get) => ({
            jobTypes: [],
            jobRoles: [],
            metadataLoading: false,
            error: null,
            hasFetched: false,

            fetchMetadata: async (options) => {
                if (get().metadataLoading) return
                if (!options?.force && get().hasFetched) return

                set({ metadataLoading: true, error: null })
                try {
                    const res = await apiFetch("/api/metadata", { headers: authHeaders() })
                    const data = await res.json()

                    if (!res.ok) {
                        set({
                            error: data?.message || data?.error?.message || "Failed to fetch metadata",
                            metadataLoading: false,
                        })
                        return
                    }

                    const payload = data?.data ?? data ?? {}
                    const jobTypes = toSafeArray(payload?.jobTypes)
                    const jobRoles = toSafeArray(payload?.jobRoles)

                    set({ jobTypes, jobRoles, metadataLoading: false, error: null, hasFetched: true })
                } catch (err) {
                    set({ error: (err as Error).message, metadataLoading: false })
                }
            },

            addJobType: async (entry: JobType) => {
                // POST to backend first — only update local state/localStorage on success
                const res = await apiFetch("/api/jobTypes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", ...authHeaders() },
                    body: JSON.stringify([entry]),
                })

                const data = await res.json().catch(() => ({}))

                if (!res.ok) {
                    const msg =
                        data?.message ||
                        data?.errors?.[0]?.message ||
                        "Failed to add service"
                    throw new Error(msg)
                }

                // Only reached if backend succeeded — persist middleware auto-saves to localStorage
                set((state) => ({
                    jobTypes: [...state.jobTypes, entry],
                }))
            },

            clearMetadata: () => {
                set({
                    jobTypes: [],
                    jobRoles: [],
                    metadataLoading: false,
                    error: null,
                    hasFetched: false,
                })
            },
        }),
        {
            name: "metadata-storage",
            partialize: (state) => ({
                jobTypes: state.jobTypes,
                jobRoles: state.jobRoles,
            }),
        }
    )
)

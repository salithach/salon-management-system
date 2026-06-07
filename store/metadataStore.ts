import { create } from "zustand"
import { persist } from "zustand/middleware"
import { apiFetch } from "@/lib/apiFetch"
import { useAuthStore } from "@/store/authStore"

export type JobType = {
    key: string
    value: string
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
    clearMetadata: () => void
}

const authHeaders = (): Record<string, string> => {
    const token = useAuthStore.getState().token
    return token ? { Authorization: `Bearer ${token}` } : {}
}

const toSafeArray = (value: unknown): Array<{ key: string; value: string }> => {
    if (!Array.isArray(value)) return []
    return value.filter((item): item is { key: string; value: string } => {
        return typeof item === "object" && item !== null && "key" in item && "value" in item
    })
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

                    set({
                        jobTypes,
                        jobRoles,
                        metadataLoading: false,
                        error: null,
                        hasFetched: true,
                    })
                } catch (err) {
                    set({
                        error: (err as Error).message,
                        metadataLoading: false,
                    })
                }
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


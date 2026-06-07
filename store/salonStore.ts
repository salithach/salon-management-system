import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { DropDownOption } from "@/components/DropDown"

type SalonState = {
    salonTypeOptions: DropDownOption[]
    salonTypesLoading: boolean
    salonTypesFetched: boolean
    fetchSalonTypes: () => Promise<void>
}

export const useSalonStore = create<SalonState>()(
    persist(
        (set, get) => ({
            salonTypeOptions: [],
            salonTypesLoading: false,
            salonTypesFetched: false,

            fetchSalonTypes: async () => {
                if (get().salonTypesLoading) return
                if (get().salonTypesFetched) return

                set({ salonTypesLoading: true })
                try {
                    const res = await fetch("/api/salons/types")
                    const data = await res.json()

                    // Support both { key, value }[] and { code, description }[] shapes
                    const raw: unknown[] = Array.isArray(data)
                        ? data
                        : Array.isArray(data?.data)
                            ? data.data
                            : []
                    if (raw.length === 0) {
                        // Keep static fallback, but still mark as fetched
                        set({ salonTypesFetched: true })
                        return
                    }

                    const mapped: DropDownOption[] = raw.map((item) => {
                        const i = item as Record<string, string>
                        return {
                            label: i.value ?? i.description ?? String(item),
                            value: i.key   ?? i.code        ?? String(item),
                        }
                    })
                    set({ salonTypeOptions: mapped, salonTypesFetched: true })
                } catch {
                    // silently keep static fallback
                    set({ salonTypesFetched: true })
                } finally {
                    set({ salonTypesLoading: false })
                }
            },
        }),
        {
            name: "salon-storage",
            partialize: (state) => ({
                salonTypeOptions: state.salonTypeOptions,
                salonTypesFetched: state.salonTypesFetched,
            }),
        }
    )
)


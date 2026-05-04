import { create } from "zustand"
import { persist } from "zustand/middleware"

export type JobEntry = { service: string[]; price: number; description?: string }

export type StaffAssignmentState = {
    assignedToday: string[]
    todayJobs: Record<string, JobEntry[]>
    _hasHydrated: boolean
    assign: (names: string[]) => void
    addJob: (name: string, job: JobEntry) => void
    clear: () => void
    setHasHydrated: (v: boolean) => void
}

export const useStaffAssignmentStore = create<StaffAssignmentState>()(
    persist(
        (set) => ({
            assignedToday: [],
            todayJobs: {},
            _hasHydrated: false,
            setHasHydrated: (v) => set({ _hasHydrated: v }),
            assign: (names) => set({ assignedToday: names }),
            addJob: (name, job) =>
                set((state) => ({
                    todayJobs: {
                        ...state.todayJobs,
                        [name]: [...(state.todayJobs[name] ?? []), job],
                    },
                })),
            clear: () => set({ assignedToday: [], todayJobs: {} }),
        }),
        {
            name: "staff-assignment",
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true)
            },
        }
    )
)

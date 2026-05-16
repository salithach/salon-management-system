import { create } from "zustand"
import { useAuthStore } from "@/store/authStore"

const authHeaders = (): Record<string, string> => {
    const token = useAuthStore.getState().token
    return token ? { Authorization: `Bearer ${token}` } : {}
}

export type JobEntry = { service: string[]; price: number; description?: string }

export type StaffMember = {
    id: string
    name: string
    username: string
    email: string
    phone: string
    address: string
    role: string
    specialty: string
}

type StaffState = {
    // ── Staff list ──────────────────────────────────────────
    staff: StaffMember[]
    loading: boolean
    error: string | null
    fetchStaff: () => Promise<void>
    addStaff: (data: { name: string; username: string; email: string; phone: string; address: string; role: string; specialty: string }) => Promise<StaffMember>
    removeStaff: (id: string) => Promise<void>

    // ── Today's assignments (in-memory only) ─────────────────
    assignedToday: string[]
    todayJobs: Record<string, JobEntry[]>
    assign: (names: string[]) => void
    unassign: (name: string) => void
    addJob: (name: string, job: JobEntry) => void
    clear: () => void
}

export const useStaffAssignmentStore = create<StaffState>()((set, get) => ({
    // ── Staff list ──────────────────────────────────────────
    staff: [],
    loading: false,
    error: null,

    fetchStaff: async () => {
        if (get().loading) return          // already in-flight — skip (covers StrictMode double-invoke)
        set({ loading: true, error: null })
        try {
            const res = await fetch("/api/staff", { headers: authHeaders() })
            const data = await res.json()
            if (!res.ok) throw new Error(data?.message || "Failed to fetch staff")
            // Normalise response — handle both array and { data: [...] } shapes
            const list: StaffMember[] = (Array.isArray(data) ? data : data?.data ?? []).map(
                (m: Record<string, unknown>) => ({
                    id: String(m.id ?? m._id ?? ""),
                    name: String(m.name ?? ""),
                    username: String(m.username ?? ""),
                    email: String(m.email ?? ""),
                    phone: String(m.phone ?? m.phoneNumber ?? ""),
                    address: String(m.address ?? ""),
                    role: String(m.role ?? ""),
                    specialty: String(m.specialty ?? m.specialty ?? ""),
                })
            )
            set({ staff: list, loading: false })
        } catch (err) {
            set({ error: (err as Error).message, loading: false })
        }
    },

    addStaff: async ({ name, username, email, phone, address, role, specialty }) => {
        const res = await fetch("/api/staff", {
            method: "POST",
            headers: { "Content-Type": "application/json", ...authHeaders() },
            body: JSON.stringify({ name, username, email, phone, address, role, specialty, status: "Available" }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.message || "Failed to add staff member")
        const raw = data?.data ?? data
        const newMember: StaffMember = {
            id: String(raw.id ?? raw._id ?? Date.now()),
            name: String(raw.name ?? name),
            username: String(raw.username ?? username),
            email: String(raw.email ?? email),
            phone: String(raw.phone ?? raw.phoneNumber ?? phone),
            address: String(raw.address ?? address),
            role: String(raw.role ?? role),
            specialty: String(raw.specialty ?? specialty),
        }
        set((state) => ({ staff: [...state.staff, newMember] }))
        return newMember
    },

    removeStaff: async (id: string) => {
        const res = await fetch(`/api/staff/${id}`, { method: "DELETE", headers: authHeaders() })
        if (!res.ok) {
            const data = await res.json().catch(() => ({}))
            throw new Error(data?.message || "Failed to remove staff member")
        }
        set((state) => ({ staff: state.staff.filter((s) => s.id !== id) }))
        // Also remove from today's assignments if present
        const member = get().staff.find((s) => s.id === id)
        if (member) {
            set((state) => ({
                assignedToday: state.assignedToday.filter((n) => n !== member.name),
            }))
        }
    },

    // ── Today's assignments (in-memory only) ─────────────────
    assignedToday: [],
    todayJobs: {},

    assign: (names) =>
        set((state) => ({
            assignedToday: [
                ...state.assignedToday,
                ...names.filter((n) => !state.assignedToday.includes(n)),
            ],
        })),

    unassign: (name) =>
        set((state) => ({
            assignedToday: state.assignedToday.filter((n) => n !== name),
        })),

    addJob: (name, job) =>
        set((state) => ({
            todayJobs: {
                ...state.todayJobs,
                [name]: [...(state.todayJobs[name] ?? []), job],
            },
        })),

    clear: () => set({ assignedToday: [], todayJobs: {} }),
}))

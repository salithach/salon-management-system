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


export type StaffState = {
    // ── Staff list ──────────────────────────────────────────
    staff: StaffMember[]
    staffLoading: boolean
    error: string | null
    fetchStaff: () => Promise<void>
    addStaff: (data: { name: string; username: string; email: string; phone: string; address: string; role: string; specialty: string }) => Promise<StaffMember>
    removeStaff: (username: string) => Promise<void>

    // ── Today's assignments ───────────────────────────────────
    assignedToday: string[]        // usernames — used by staff page for isAssigned checks
    assignedStaff: StaffMember[]   // full objects — used by dashboard for display
    assignmentsLoading: boolean
    todayJobs: Record<string, JobEntry[]>
    fetchAssignments: () => Promise<void>
    assign: (members: StaffMember[]) => Promise<void>
    unassign: (member: StaffMember) => Promise<void>
    addJob: (name: string, job: JobEntry) => void
    clear: () => void
}

export const useStaffAssignmentStore = create<StaffState>()((set, get) => ({
    // ── Staff list ──────────────────────────────────────────
    staff: [],
    staffLoading: false,
    error: null,

    fetchStaff: async () => {
        if (get().staffLoading) return
        set({ staffLoading: true, error: null })
        const MIN_MS = 800
        const start = Date.now()
        const wait = () => {
            const elapsed = Date.now() - start
            return new Promise<void>((r) => setTimeout(r, Math.max(0, MIN_MS - elapsed)))
        }
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
                    specialty: String(m.speciality ?? m.specialty ?? ""),
                })
            )
            await wait()
            set({ staff: list, staffLoading: false })
        } catch (err) {
            await wait()
            set({ error: (err as Error).message, staffLoading: false })
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

    removeStaff: async (username: string) => {
        const res = await fetch(`/api/staff/${username}`, { method: "DELETE", headers: authHeaders() })
        if (!res.ok) {
            const data = await res.json().catch(() => ({}))
            throw new Error(data?.message || "Failed to remove staff member")
        }
        set((state) => ({
            staff: state.staff.filter((s) => s.username !== username),
            assignedToday: state.assignedToday.filter((u) => u !== username),
            assignedStaff: state.assignedStaff.filter((m) => m.username !== username),
        }))
    },

    // ── Today's assignments ───────────────────────────────────
    assignedToday: [],
    assignedStaff: [],
    assignmentsLoading: false,
    todayJobs: {},

    fetchAssignments: async () => {
        if (get().assignmentsLoading) return
        set({ assignmentsLoading: true })
        const MIN_MS = 800
        const start = Date.now()
        const wait = () => {
            const elapsed = Date.now() - start
            return new Promise<void>((r) => setTimeout(r, Math.max(0, MIN_MS - elapsed)))
        }
        try {
            const date = new Date().toISOString().slice(0, 10) // yyyy-mm-dd
            const res = await fetch(`/api/assignments?date=${date}`, { headers: authHeaders() })
            const data = await res.json()
            if (!res.ok) { set({ assignmentsLoading: false }); return }

            const assignees: StaffMember[] = data?.data?.members
            console.log("[fetchAssignments] raw response:", JSON.stringify(assignees, null, 2))
            await wait()
            set({
                assignedStaff: assignees,
                assignedToday: assignees.map((m) => m.username),
                assignmentsLoading: false,
            })
        } catch {
            await wait()
            set({ assignmentsLoading: false })
        }
    },

    assign: async (members) => {
        const usernames = members.map((m) => m.username)
        const date = new Date().toISOString().slice(0, 10) // yyyy-mm-dd
        // POST to server first — only update state if it succeeds
        const res = await fetch("/api/assignments", {
            method: "POST",
            headers: { "Content-Type": "application/json", ...authHeaders() },
            body: JSON.stringify({ date, staffUsernames: usernames, members }),
        })
        if (!res.ok) {
            const data = await res.json().catch(() => ({}))
            throw new Error(data?.message || "Failed to assign staff")
        }
        // Update in-memory state only after confirmed by server
        set((state) => ({
            assignedStaff: [
                ...state.assignedStaff,
                ...members.filter((m) => !state.assignedToday.includes(m.username)),
            ],
            assignedToday: [
                ...state.assignedToday,
                ...usernames.filter((u) => !state.assignedToday.includes(u)),
            ],
        }))
    },

    unassign: async (member) => {
        const date = new Date().toISOString().slice(0, 10)
        const res = await fetch("/api/assignments", {
            method: "DELETE",
            headers: { "Content-Type": "application/json", ...authHeaders() },
            body: JSON.stringify({ date, members: [member] }),
        })
        if (!res.ok) {
            const data = await res.json().catch(() => ({}))
            throw new Error(data?.message || "Failed to unassign staff")
        }
        set((state) => ({
            assignedToday: state.assignedToday.filter((u) => u !== member.username),
            assignedStaff: state.assignedStaff.filter((m) => m.username !== member.username),
        }))
    },

    addJob: (name, job) =>
        set((state) => ({
            todayJobs: {
                ...state.todayJobs,
                [name]: [...(state.todayJobs[name] ?? []), job],
            },
        })),

    clear: () => set({ assignedToday: [], assignedStaff: [], todayJobs: {} }),
}))

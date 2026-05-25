import { create } from "zustand"
import { useAuthStore } from "@/store/authStore"
import { apiFetch } from "@/lib/apiFetch"

const authHeaders = (): Record<string, string> => {
    const token = useAuthStore.getState().token
    return token ? { Authorization: `Bearer ${token}` } : {}
}

const wait = (start: number = Date.now(), MIN_MS: number = 800): Promise<void> => {
    const elapsed = Date.now() - start
    return new Promise<void>(
        (r) => setTimeout(r, Math.max(0, MIN_MS - elapsed))
    )
}

export type StaffMember = {
    id: string
    name: string
    username: string
    email: string
    phone: string
    address: string
    role: Role
    specialty: string
}

export type Role = {
    key: string
    name: string
}

export type JobEntry = {
    date: string
    service: string | string[]
    price: number
    description?: string
    assignee: StaffMember
}

export type Assignment = {
    id: string
    members: StaffMember[],
    date: string
}

export type StaffState = {
    // ── Staff list ──────────────────────────────────────────
    staff: StaffMember[]
    staffLoading: boolean
    error: string | null
    fetchStaff: () => Promise<void>
    addStaff: (data: { name: string; username: string; email: string; phone: string; address: string; role: Role; specialty: string }) => Promise<StaffMember>
    removeStaff: (username: string) => Promise<void>

    // ── Today's assignments ───────────────────────────────────
    assignmentId: string | null    // ID of today's assignment record
    assignedToday: StaffMember[]   // keyed by username
    assignmentsLoading: boolean
    fetchAssignments: () => Promise<void>
    assign: (members: StaffMember[]) => Promise<void>
    unassign: (member: StaffMember) => Promise<void>
    clear: () => Promise<void>
}

export const useStaffAssignmentStore = create<StaffState>()((set, get) => ({
    staff: [],
    staffLoading: false,
    error: null,

    assignmentId: null,
    assignedToday: [],
    assignmentsLoading: false,

    fetchStaff: async () => {
        if (get().staffLoading) return
        set({ staffLoading: true, error: null })
        try {
            const res = await apiFetch("/api/staff", { headers: authHeaders() })
            const data = await res.json()
            if (!res.ok) throw new Error(data?.message || "Failed to fetch staff")
            await wait()
            set({ staff: data?.data, staffLoading: false })
        } catch (err) {
            await wait()
            set({ error: (err as Error).message, staffLoading: false })
        }
    },

    addStaff: async ({ name, username, email, phone, address, role, specialty }) => {
        const res = await apiFetch("/api/staff", {
            method: "POST",
            headers: { "Content-Type": "application/json", ...authHeaders() },
            body: JSON.stringify({ name, username, email, phone, address, role, specialty, status: "Available" }),
        })
        const data = await res.json()
        const newMember = data?.data
        if (!res.ok) throw new Error(data?.error?.message || "Failed to add staff member")
        set((state) => ({ staff: [...state.staff, newMember] }))
        return newMember
    },

    removeStaff: async (username: string) => {
        const res = await apiFetch(`/api/staff/${username}`, { method: "DELETE", headers: authHeaders() })
        if (!res.ok) {
            const data = await res.json().catch(() => ({}))
            throw new Error(data?.message || "Failed to remove staff member")
        }
        set((state) => ({
            staff: state.staff.filter((s) => s.username !== username),
            assignedToday: state.assignedToday.filter((m) => m.username !== username),
        }))
    },

    fetchAssignments: async () => {
        if (get().assignmentsLoading) return
        set({ assignmentsLoading: true })
        try {
            const date = new Date().toISOString().slice(0, 10)
            const res = await apiFetch(`/api/assignments?date=${date}`, { headers: authHeaders() })
            const data = await res.json()
            if (!res.ok) { set({ assignmentsLoading: false }); return }
            const assignment: Assignment | null = data?.data ?? null
            await wait()
            set({ assignmentId: assignment?.id ?? null, assignedToday: assignment?.members ?? [], assignmentsLoading: false })
        } catch (err) {
            await wait()
            set({ error: (err as Error).message, assignmentsLoading: false })
        }
    },

    assign: async (members) => {
        const date = new Date().toISOString().slice(0, 10)
        const res = await apiFetch("/api/assignments", {
            method: "POST",
            headers: { "Content-Type": "application/json", ...authHeaders() },
            body: JSON.stringify({ date, members }),
        })
        if (!res.ok) {
            const data = await res.json().catch(() => ({}))
            throw new Error(data?.message || "Failed to assign staff")
        }
        const data = await res.json().catch(() => ({}))
        const assignment: Assignment = data?.data
        set((state) => ({
            assignmentId: assignment?.id ?? state.assignmentId,
            assignedToday: [
                ...(state.assignedToday ?? []),
                ...members.filter((m) => !(state.assignedToday ?? []).some((a) => a.username === m.username)),
            ],
        }))
    },

    unassign: async (member) => {
        const date = new Date().toISOString().slice(0, 10)
        const res = await apiFetch("/api/assignments", {
            method: "DELETE",
            headers: { "Content-Type": "application/json", ...authHeaders() },
            body: JSON.stringify({ date, members: [member] }),
        })
        if (!res.ok) {
            const data = await res.json().catch(() => ({}))
            throw new Error(data?.message || "Failed to unassign staff")
        }
        set((state) => ({
            assignedToday: state.assignedToday.filter((m) => m.username !== member.username),
        }))
    },

    clear: async () => {
        const { assignmentId } = get()
        if (assignmentId) {
            const res = await apiFetch(`/api/assignments/${assignmentId}`, {
                method: "DELETE",
                headers: authHeaders(),
            })
            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error(data?.message || "Failed to reset today's assignments")
            }
        }
        set({ assignedToday: [], assignmentId: null })
    },
}))



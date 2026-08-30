import { create } from "zustand"
import { persist } from "zustand/middleware"
import { apiFetch } from "@/lib/apiFetch"
import { useAuthStore } from "@/store/authStore"

export type AppointmentStatus = "CONFIRMED" | "PENDING" | "CANCELLED"

export type Client = {
    name: string
    phone?: string
    email?: string
}

export type Appointment = {
    id: string
    date: string          // YYYY-MM-DD
    time: string          // HH:MM (24h)
    client: Client
    services: string[]    // list of service keys (e.g. ["HAIR_CUT"])
    assignee: string
    status: AppointmentStatus
    notes?: string
    createdAt: string
}

const authHeaders = (): Record<string, string> => {
    const token = useAuthStore.getState().token
    return token ? { Authorization: `Bearer ${token}` } : {}
}

/** Normalise whatever the API returns ("confirmed", "Confirmed", "CONFIRMED") → "CONFIRMED" */
function normalizeStatus(raw: string): AppointmentStatus {
    switch (raw?.toUpperCase()) {
        case "CONFIRMED": return "CONFIRMED"
        case "CANCELLED": return "CANCELLED"
        default:          return "PENDING"
    }
}

/**
 * Normalise a raw API response into a clean Appointment object.
 * Handles common field-naming variations returned by the backend.
 */
function normalizeAppointment(raw: unknown): Appointment {
    const a = raw as Record<string, unknown>

    const rawServices = a.services ?? []
    const services: string[] = Array.isArray(rawServices)
        ? (rawServices as unknown[]).map((s) =>
            typeof s === "object" && s !== null
                ? String((s as Record<string, unknown>).key ?? (s as Record<string, unknown>).value ?? (s as Record<string, unknown>).name ?? "")
                : String(s)
          ).filter(Boolean)
        : String(rawServices).trim()
            ? [String(rawServices)]
            : []

    const rawClient = a.client as Record<string, string> | undefined
    const client: Client = rawClient && typeof rawClient === "object"
        ? { name: rawClient.name ?? "", phone: rawClient.phone ?? undefined, email: rawClient.email ?? undefined }
        : {
            name:  String(a.clientName ?? a.client_name ?? ""),
            phone: a.clientPhone ? String(a.clientPhone) : undefined,
            email: a.clientEmail ? String(a.clientEmail) : undefined,
          }

    return {
        id: String(a.id ?? ""),
        date: String(a.date ?? ""),
        time: String(a.time ?? "").slice(0, 5) || "09:00",
        client,
        services,
        assignee: String(a.assignee ?? ""),
        status: normalizeStatus(String(a.status ?? "")),
        notes: a.notes ? String(a.notes) : undefined,
        createdAt: String(a.createdAt ?? new Date().toISOString()),
    }
}

type AppointmentState = {
    appointments: Appointment[]
    appointmentsLoading: boolean
    error: string | null
    fetchAppointments: (date?: string) => Promise<void>
    addAppointment: (data: Omit<Appointment, "id" | "createdAt">) => Promise<Appointment>
    updateAppointment: (id: string, patch: Partial<Omit<Appointment, "id" | "createdAt">>) => Promise<void>
    deleteAppointment: (id: string) => Promise<void>
}

export const useAppointmentStore = create<AppointmentState>()(
    persist(
        (set, get) => ({
            appointments: [],
            appointmentsLoading: false,
            error: null,

            fetchAppointments: async (date?) => {
                if (get().appointmentsLoading) return
                set({ appointmentsLoading: true, error: null })
                try {
                    const url = `/api/appointments${date ? `?date=${date}` : ""}`
                    const res = await apiFetch(url, { headers: authHeaders() })
                    const data = await res.json()

                    if (!res.ok) {
                        const raw = data?.message
                        set({
                            error: (typeof raw === "object" ? raw?.message : raw) || "Failed to fetch appointments",
                            appointmentsLoading: false,
                        })
                        return
                    }

                    const fetched: Appointment[] = (data?.data ?? data ?? []).map(normalizeAppointment)
                    set((s) => ({
                        // Replace appointments for the fetched date; keep all other dates untouched
                        appointments: date
                            ? [...s.appointments.filter((a) => a.date !== date), ...fetched]
                            : fetched,
                        appointmentsLoading: false,
                    }))
                } catch (err) {
                    set({ error: (err as Error).message, appointmentsLoading: false })
                }
            },

            addAppointment: async (data) => {
                const res = await apiFetch("/api/appointments", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", ...authHeaders() },
                    body: JSON.stringify(data),
                })
                const json = await res.json().catch(() => ({}))
                if (!res.ok) {
                    const msg = json?.message || json?.errors?.[0]?.message || "Failed to create appointment"
                    throw new Error(msg)
                }
                const newAppt: Appointment = normalizeAppointment(json?.data ?? json)
                set((s) => ({ appointments: [...s.appointments, newAppt] }))
                return newAppt
            },

            updateAppointment: async (id, patch) => {
                // Optimistically update local state first
                const prev = get().appointments
                set((s) => ({
                    appointments: s.appointments.map((a) =>
                        a.id === id ? { ...a, ...patch } : a
                    ),
                }))
                try {
                    const current = get().appointments.find((a) => a.id === id)
                    const res = await apiFetch(`/api/appointments/${id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json", ...authHeaders() },
                        body: JSON.stringify(current),
                    })
                    const json = await res.json().catch(() => ({}))
                    if (!res.ok) {
                        // Rollback on failure
                        set({ appointments: prev })
                        const msg = json?.message || json?.errors?.[0]?.message || "Failed to update appointment"
                        throw new Error(msg)
                    }
                    const updated: Appointment = normalizeAppointment(json?.data ?? json)
                    set((s) => ({
                        appointments: s.appointments.map((a) => a.id === id ? updated : a),
                    }))
                } catch (err) {
                    set({ appointments: prev })
                    throw err
                }
            },

            deleteAppointment: async (id) => {
                // Optimistically remove from local state
                const prev = get().appointments
                set((s) => ({ appointments: s.appointments.filter((a) => a.id !== id) }))
                try {
                    const res = await apiFetch(`/api/appointments/${id}`, {
                        method: "DELETE",
                        headers: authHeaders(),
                    })
                    if (!res.ok) {
                        const json = await res.json().catch(() => ({}))
                        set({ appointments: prev })
                        const msg = json?.message || json?.errors?.[0]?.message || "Failed to delete appointment"
                        throw new Error(msg)
                    }
                } catch (err) {
                    set({ appointments: prev })
                    throw err
                }
            },
        }),
        {
            name: "appointments-storage",
            // Migrate stale data: ensure services is always string[]
            onRehydrateStorage: () => (state) => {
                if (!state) return
                state.appointments = state.appointments.map((a) => {
                    const raw = a as unknown as Record<string, unknown>
                    const legacyServices = raw.services ?? raw.service
                    return {
                        ...a,
                        services: Array.isArray(legacyServices)
                            ? legacyServices as string[]
                            : legacyServices ? [String(legacyServices)] : [],
                    }
                })
            },
        }
    )
)

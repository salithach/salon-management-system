import { create } from "zustand"
import { persist } from "zustand/middleware"

export type AppointmentStatus = "Confirmed" | "Pending" | "Cancelled"

export type Appointment = {
    id: string
    date: string          // YYYY-MM-DD
    time: string          // HH:MM (24h)
    clientName: string
    clientPhone?: string
    service: string       // service key or label
    stylistName: string
    status: AppointmentStatus
    notes?: string
    createdAt: string
}

type AppointmentState = {
    appointments: Appointment[]
    addAppointment: (data: Omit<Appointment, "id" | "createdAt">) => Appointment
    updateAppointment: (id: string, patch: Partial<Omit<Appointment, "id" | "createdAt">>) => void
    deleteAppointment: (id: string) => void
    getByDate: (date: string) => Appointment[]
}

export const useAppointmentStore = create<AppointmentState>()(
    persist(
        (set, get) => ({
            appointments: [],

            addAppointment: (data) => {
                const newAppt: Appointment = {
                    ...data,
                    id: `appt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                    createdAt: new Date().toISOString(),
                }
                set((s) => ({ appointments: [...s.appointments, newAppt] }))
                return newAppt
            },

            updateAppointment: (id, patch) => {
                set((s) => ({
                    appointments: s.appointments.map((a) =>
                        a.id === id ? { ...a, ...patch } : a
                    ),
                }))
            },

            deleteAppointment: (id) => {
                set((s) => ({ appointments: s.appointments.filter((a) => a.id !== id) }))
            },

            getByDate: (date) => {
                return get().appointments.filter((a) => a.date === date)
            },
        }),
        { name: "appointments-storage" }
    )
)


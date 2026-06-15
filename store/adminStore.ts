import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useAuthStore } from "@/store/authStore"
import {headersWithAuth} from "@/lib/auth";
import {Options} from "@/store/metadataStore";
import {apiFetch} from "@/lib/apiFetch";
import { CONTENT_TYPES, REQUEST_HEADERS } from "@/lib/constants"

const authHeaders = (): Record<string, string> => {
    const token = useAuthStore.getState().token
    return token ? { Authorization: `Bearer ${token}` } : {}
}

/** Normalize a raw backend user/salon object into a flat AdminSalon.
 *  Handles nested  { salon:{salonName,salonType}, owner:{name}, location:{city} }
 *  as well as flat { salonName, ownerName, city } shapes.
 */
function normalizeSalon(item: unknown): Salon {
    const i        = item as Record<string, unknown>
    const salonObj = ((i.salon    ?? {}) as Record<string, string>)
    const ownerObj = ((i.owner    ?? {}) as Record<string, string>)
    const locObj   = ((i.location ?? {}) as Record<string, string>)
    return {
        id:        String(i.id  ?? i._id ?? i.username ?? ""),
        username:  String(i.username ?? ""),
        email:     String(i.email    ?? ""),
        active:    typeof i.active === "boolean" ? i.active : typeof i.enabled === "boolean" ? i.enabled : undefined,
        salonName: salonObj.salonName ?? (i.salonName as string) ?? "",
        salonType: salonObj.salonType ?? (i.salonType as string) ?? "",
        website:   salonObj.website   ?? (i.website   as string) ?? "",
        ownerName: ownerObj.name      ?? ownerObj.ownerName ?? (i.ownerName as string) ?? "",
        phone:     ownerObj.phoneNumber ?? ownerObj.phone ?? (i.phone as string) ?? "",
        address:   locObj.address ?? (i.address as string) ?? "",
        city:      locObj.city    ?? (i.city    as string) ?? "",
        state:     locObj.state   ?? (i.state   as string) ?? "",
        zipCode:   locObj.zipCode ?? (i.zipCode as string) ?? "",
        country:   locObj.country ?? (i.country as string) ?? "",
    }
}

export type Salon = {
    id: string
    username: string
    email?: string
    active?: boolean
    // salon section
    salonName: string
    salonType: string
    website?: string
    // owner section
    ownerName?: string
    phone?: string
    // location section
    address?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
}

export type AdminStaffMember = {
    id: string
    name: string
    username: string
    email?: string
    phone?: string
    address?: string
    specialty?: string
    role?: { key?: string; name?: string } | string
}

export type JobType = {
    key: string
    value: string
    category?: string
}

export type JobRole = {
    key: string
    value: string
}

export type AddStaffPayload = {
    name: string
    username: string
    email: string
    phone: string
    address: string
    role: { key: string; name: string }
    specialty: string
}

type AdminState = {
    salons: Salon[]
    salonsLoading: boolean
    salonsError: string | null

    selectedSalon: Salon | null
    selectedSalonLoading: boolean

    salonStaff: AdminStaffMember[]
    salonStaffLoading: boolean

    salonServices: JobType[]
    salonServicesLoading: boolean

    salonRoles: JobRole[]
    salonRolesLoading: boolean

    saving: boolean

    fetchSalons: (options?: { force?: boolean }) => Promise<void>
    fetchSalonById: (id: string) => Promise<void>
    setSelectedSalon: (salon: Salon) => void
    updateSalon: (id: string, data: Partial<Salon>) => Promise<void>
    fetchSalonStaff: (salonId: string, options: Options) => Promise<void>
    fetchSalonMetaData: (salonId: string, options: Options) => Promise<void>
    addSalonStaff: (salonId: string, options: Options, payload: AddStaffPayload) => Promise<void>
    fetchSalonRoles: (salonId: string) => Promise<void>
    addSalonRole: (salonId: string, entry: JobRole) => Promise<void>
    activateUser: (salonId: string) => Promise<void>
    clearSelected: () => void
}

export const useAdminStore = create<AdminState>()(
    persist(
        (set, get) => ({
    salons: [],
    salonsLoading: false,
    salonsError: null,

    selectedSalon: null,
    selectedSalonLoading: false,

    salonStaff: [],
    salonStaffLoading: false,

    salonServices: [],
    salonServicesLoading: false,

    salonRoles: [],
    salonRolesLoading: false,

    saving: false,

    fetchSalons: async (options) => {
        if (get().salonsLoading) return
        if (!options?.force && get().salons.length > 0) return
        set({ salonsLoading: true, salonsError: null })
        try {
            const res = await apiFetch("/api/admin/salons", { headers: authHeaders() })
            const data = await res.json()
            if (!res.ok) throw new Error(data?.message || "Failed to fetch salons")
            const raw: unknown[] = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
            // Exclude admin accounts — only show regular salon owners
            const salonOnly = raw.filter((item) => {
                const roles = ((item as Record<string, unknown>).roles ?? []) as { name?: string }[]
                return !roles.some((r) => r.name === "ROLE_ADMIN")
            })
            set({ salons: salonOnly.map(normalizeSalon), salonsLoading: false })
        } catch (err) {
            set({ salonsError: (err as Error).message, salonsLoading: false })
        }
    },

    fetchSalonById: async (id: string) => {
        if (get().selectedSalonLoading) return
        set({ selectedSalonLoading: true })
        try {
            const res = await apiFetch(`/api/admin/salons/${id}`, { headers: authHeaders() })
            const data = await res.json()
            if (!res.ok) throw new Error(data?.message || "Failed to fetch salon")
            const raw = data?.data ?? data
            set({ selectedSalon: normalizeSalon(raw), selectedSalonLoading: false })
        } catch {
            set({ selectedSalonLoading: false })
        }
    },

    updateSalon: async (id: string, payload: Partial<Salon>) => {
        set({ saving: true })
        try {
            const res = await apiFetch(`/api/admin/salons/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", ...authHeaders() },
                body: JSON.stringify(payload),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data?.message || "Failed to update salon")
            const updated = data?.data ?? data
            set((state) => ({
                saving: false,
                selectedSalon: state.selectedSalon?.id === id
                    ? { ...state.selectedSalon, ...updated }
                    : state.selectedSalon,
                salons: state.salons.map((s) => s.id === id ? { ...s, ...updated } : s),
            }))
        } catch (err) {
            set({ saving: false })
            throw err
        }
    },

    fetchSalonStaff: async (salonId: string, options: Options) => {
        if (get().salonStaffLoading) return
        set({ salonStaffLoading: true })
        try {
            const jwtHeaders = authHeaders();
            const tenantHeaders = headersWithAuth(jwtHeaders, options)
            const headers = {
                ...jwtHeaders,
                ...tenantHeaders
            }
            const res = await apiFetch(`/api/admin/salons/${salonId}/staff`, { headers })
            const data = await res.json()
            if (!res.ok) throw new Error(data?.message || "Failed to fetch staff")
            const raw: unknown[] = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
            set({ salonStaff: raw as AdminStaffMember[], salonStaffLoading: false })
        } catch {
            set({ salonStaffLoading: false })
        }
    },

    fetchSalonMetaData: async (salonId: string, options: Options) => {
        if (get().salonServicesLoading) return
        set({ salonServicesLoading: true })
        try {
            const jwtHeaders = authHeaders();
            const tenantHeaders = headersWithAuth(jwtHeaders, options)
            const headers = {
                ...jwtHeaders,
                ...tenantHeaders
            }
            const res = await apiFetch(`/api/admin/salons/${salonId}/metadata`, { headers })
            const data = await res.json()
            if (!res.ok) throw new Error(data?.message || "Failed to fetch services")
            const payload = data?.data ?? data ?? {}
            const raw: unknown[] = Array.isArray(payload?.jobTypes) ? payload.jobTypes
                : Array.isArray(payload) ? payload : []
            set({ salonServices: raw as JobType[], salonServicesLoading: false })
        } catch {
            set({ salonServicesLoading: false })
        }
    },

    addSalonStaff: async (salonId: string, options: Options, payload: AddStaffPayload) => {
        const jwtHeaders = authHeaders()
        const tenantHeaders = headersWithAuth(jwtHeaders, options) as Record<string, string>
        const res = await apiFetch(`/api/admin/salons/${salonId}/staff`, {
            method: "POST",
            headers: {
                ...jwtHeaders,
                ...tenantHeaders,
            },
            body: JSON.stringify({ ...payload, status: "Available" }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data?.message || data?.errors?.[0]?.message || "Failed to add staff")
        // Append to local list
        const newMember = data?.data ?? data
        set((state) => ({ salonStaff: [...state.salonStaff, newMember as AdminStaffMember] }))
    },

    fetchSalonRoles: async (salonId: string) => {
        if (get().salonRolesLoading) return
        set({ salonRolesLoading: true })
        try {
            const jwt      = authHeaders()
            const tenantId = get().selectedSalon?.username ?? ""
            const res = await apiFetch(`/api/admin/salons/${salonId}/roles`, {
                headers: {
                    ...jwt,
                    ...(tenantId ? { [REQUEST_HEADERS.TENANT_ID]: tenantId } : {}),
                },
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data?.message || "Failed to fetch roles")
            const payload = data?.data ?? data ?? {}
            const raw: unknown[] = Array.isArray(payload?.jobRoles) ? payload.jobRoles
                : Array.isArray(payload) ? payload : []
            set({ salonRoles: raw as JobRole[], salonRolesLoading: false })
        } catch {
            set({ salonRolesLoading: false })
        }
    },

    addSalonRole: async (salonId: string, entry: JobRole) => {
        const jwt      = authHeaders()
        const tenantId = get().selectedSalon?.username ?? ""
        const res = await apiFetch(`/api/admin/salons/${salonId}/roles`, {
            method: "POST",
            headers: {
                [REQUEST_HEADERS.CONTENT_TYPE]: CONTENT_TYPES.JSON,
                ...jwt,
                ...(tenantId ? { [REQUEST_HEADERS.TENANT_ID]: tenantId } : {}),
            },
            body: JSON.stringify([entry]),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data?.message || data?.errors?.[0]?.message || "Failed to add role")
        set((state) => ({ salonRoles: [...state.salonRoles, entry] }))
    },

    activateUser: async (salonId: string) => {
        const res = await apiFetch(`/api/admin/salons/${salonId}/activate`, {
            method: "PATCH",
            headers: authHeaders(),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data?.message || "Failed to activate user")
        // Mark as active in both the list and the selected salon
        set((state) => ({
            salons: state.salons.map((s) => s.id === salonId ? { ...s, active: true } : s),
            selectedSalon: state.selectedSalon?.id === salonId
                ? { ...state.selectedSalon, active: true }
                : state.selectedSalon,
        }))
    },

    clearSelected: () => set({
        selectedSalon: null,
        salonStaff: [],
        salonServices: [],
        salonRoles: [],
        selectedSalonLoading: false,
        salonStaffLoading: false,
        salonServicesLoading: false,
        salonRolesLoading: false,
    }),
    setSelectedSalon: (salon: Salon) => set({ selectedSalon: salon }),
        }),
        {
            name: "admin-storage",
            partialize: (state) => ({ salons: state.salons }),
        }
    )
)

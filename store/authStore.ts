import { create } from "zustand"
import { persist } from "zustand/middleware"

export type AuthUser = {
    _id?: string
    email?: string
    username: string
    roles: { name: string }[]
    owner?: { name: string; phoneNumber?: string }
    salon?: { salonName: string; salonType: string; website?: string; currency?: string }
    location?: { address?: string; city?: string; state?: string; zipCode?: string; country?: string }
}

type AuthState = {
    user: AuthUser | null
    token: string | null
    loading: boolean
    profileLoading: boolean
    error: string | null
    _hasHydrated: boolean
    login: (username: string, password: string) => Promise<boolean>
    register: (data: Record<string, unknown>) => Promise<void>
    fetchProfile: () => Promise<void>
    logout: () => void
    setHasHydrated: (value: boolean) => void
}

/** Strip sensitive / internal fields before saving to store / localStorage */
function sanitize(raw: Record<string, unknown>): AuthUser {
    const { password: _p, _class: _c, token: _t, ...safe } = raw
    void _p; void _c; void _t
    return safe as AuthUser
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            loading: false,
            profileLoading: false,
            error: null,
            _hasHydrated: false,
            setHasHydrated: (value) => set({ _hasHydrated: value }),

            login: async (username, password) => {
                set({ loading: true, error: null })
                try {
                    const res = await fetch("/api/login", {
                        method: "POST",
                        body: JSON.stringify({ username, password }),
                        headers: { "Content-Type": "application/json" },
                    })
                    const result = await res.json()
                    if (!res.ok) {
                        const msg =
                            (typeof result.message === "object"
                                ? result.message?.message
                                : result.message) || "Login failed"
                        set({ error: msg, loading: false })
                        return false
                    }
                    const raw = result.data ?? result
                    const token = raw.token as string
                    set({ user: null, token, loading: false })
                    return true
                } catch {
                    set({ error: "Network error. Please try again.", loading: false })
                    return false
                }
            },

            fetchProfile: async () => {
                const { token, profileLoading } = get()
                if (!token || profileLoading) return   // skip if no token or already fetching
                set({ profileLoading: true })
                try {
                    const res = await fetch("/api/users/me", {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    if (!res.ok) return
                    const data = await res.json()
                    const raw = data?.data ?? data
                    set({ user: sanitize(raw) })
                } catch { /* silently ignore */ } finally {
                    set({ profileLoading: false })
                }
            },

            register: async (formData: Record<string, unknown>) => {
                try {
                    set({ loading: true, error: null })
                    const res = await fetch("/api/register", {
                        method: "POST",
                        body: JSON.stringify(formData),
                        headers: { "Content-Type": "application/json" },
                    })
                    const result = await res.json()
                    if (!res.ok) {
                        const msg =
                            (typeof result.message === "object"
                                ? result.message?.message
                                : result.message) || "Registration failed"
                        set({ error: msg as string, loading: false })
                        return
                    }
                    set({ loading: false })
                } catch (err: unknown) {
                    const message = err instanceof Error ? err.message : "Network error"
                    set({ error: message, loading: false })
                }
            },

            logout: () => { set({ user: null, token: null }) },
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({ user: state.user, token: state.token }),
            onRehydrateStorage: () => (state) => { state?.setHasHydrated(true) },
        }
    )
)
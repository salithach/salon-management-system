import { create } from "zustand"
import { persist } from "zustand/middleware"

export type AuthUser = {
    _id: string
    email: string
    username: string
    roles: { name: string }[]
    owner?: {
        name: string
        phoneNumber?: string
    }
    salon?: {
        salonName: string
        salonType: string
        website?: string
    }
    location?: {
        address?: string
        city?: string
        state?: string
        zipCode?: string
        country?: string
    }
}

type AuthState = {
    user: AuthUser | null
    token: string | null
    loading: boolean
    error: string | null
    _hasHydrated: boolean
    login: (username: string, password: string) => Promise<boolean>
    register: (data: Record<string, unknown>) => Promise<void>
    logout: () => void
    setHasHydrated: (value: boolean) => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            loading: false,
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
                    const { token, password: _pw, _class, ...userFields } = raw

                    set({
                        user: userFields as AuthUser,
                        token,
                        loading: false,
                    })
                    return true
                } catch {
                    set({ error: "Network error. Please try again.", loading: false })
                    return false
                }
            },

            register: async (formData: Record<string, unknown>) => {
                try {
                    set({ loading: true, error: null })
                    console.log("Registering user with data:", formData)

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

            logout: () => {
                set({ user: null, token: null })
            },
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                user: state.user,
                token: state.token,
            }),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true)
            },
        }
    )
)
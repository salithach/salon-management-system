import { create } from "zustand"
import { persist } from "zustand/middleware"

type AuthState = {
    user: { roles: string[] } | null
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

                    const json = await res.json()
                    console.log(json)

                    if (!res.ok) {
                        const msg =
                            (typeof json.message === "object"
                                ? json.message?.message
                                : json.message) || "Login failed"
                        set({ error: msg, loading: false })
                        return false
                    }

                    const { token, roles } = json.data
                    set({ user: { roles }, token, loading: false })
                    return true
                } catch {
                    set({ error: "Network error. Please try again.", loading: false })
                    return false
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

                    const data = await res.json()
                    if (!res.ok) {
                        set({ error: data.message ?? "Registration failed", loading: false })
                        return
                    }

                    set({
                        user: data.user,
                        token: data.token,
                        loading: false,
                    })
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
import { create } from "zustand"
import { apiFetch } from "@/lib/apiFetch"
import { useAuthStore } from "@/store/authStore"

export type ClientInfo = {
    id: string
    name: string
    phone?: string
    email?: string
    tenantId?: string
}

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

type ClientState = {
    clients: ClientInfo[]
    clientsLoading: boolean
    error: string | null
    fetchClients: () => Promise<void>
}

function normalizeClient(raw: any): ClientInfo {
    return {
        id: String(raw.id ?? raw._id ?? ""),
        name: String(raw.name ?? ""),
        phone: raw.phone ? String(raw.phone) : undefined,
        email: raw.email ? String(raw.email) : undefined,
        tenantId: raw.tenantId ? String(raw.tenantId) : undefined,
    }
}

export const useClientStore = create<ClientState>()(
    (set, get) => ({
        clients: [],
        clientsLoading: false,
        error: null,

        fetchClients: async () => {
            if (get().clientsLoading) return
            set({ clientsLoading: true, error: null })
            try {
                const res = await apiFetch("/api/clients", { headers: authHeaders() })
                const data = await res.json()

                if (!res.ok) {
                    const raw = data?.message
                    await wait()
                    set({
                        error: (typeof raw === "object" ? raw?.message : raw) || "Failed to fetch clients",
                        clientsLoading: false,
                    })
                    return
                }

                // API response can be array or { data: Array }
                const list = data?.data ?? data ?? []
                const fetched: ClientInfo[] = list.map(normalizeClient)

                await wait()
                set({
                    clients: fetched,
                    clientsLoading: false,
                })
            } catch (err) {
                await wait()
                set({ error: (err as Error).message, clientsLoading: false })
            }
        }
    })
)


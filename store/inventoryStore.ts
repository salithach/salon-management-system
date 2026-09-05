import { create } from "zustand"
import { apiFetch } from "@/lib/apiFetch"
import { useAuthStore } from "@/store/authStore"

export type InventoryItem = {
    id: string
    name: string
    category: string
    quantity: number
    unit: string
    threshold: number
    notes?: string
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

type InventoryState = {
    items: InventoryItem[]
    inventoryLoading: boolean
    error: string | null
    _hasHydrated: boolean
    setHasHydrated: (v: boolean) => void
    fetchInventory: () => Promise<void>
    addItem: (item: Omit<InventoryItem, "id">) => Promise<void>
    updateItem: (id: string, updates: Partial<Omit<InventoryItem, "id">>) => Promise<void>
    deleteItem: (id: string) => Promise<void>
    adjustQty: (id: string, delta: number) => Promise<void>
}

function normalizeItem(raw: unknown): InventoryItem {
    const r = raw as Record<string, unknown>
    return {
        id: String(r.id ?? r._id ?? ""),
        name: String(r.name ?? ""),
        category: String(r.category ?? ""),
        quantity: Number(r.quantity ?? 0),
        unit: String(r.unit ?? ""),
        threshold: Number(r.lowStockThreshold ?? r.threshold ?? 0),
        notes: r.notes ? String(r.notes) : undefined,
    }
}

export const useInventoryStore = create<InventoryState>()(
    (set, get) => ({
        items: [],
        inventoryLoading: false,
        error: null,
        _hasHydrated: false,
        setHasHydrated: (v) => set({ _hasHydrated: v }),

        fetchInventory: async () => {
            if (get().inventoryLoading) return
            set({ inventoryLoading: true, error: null })
            try {
                const res = await apiFetch("/api/inventory", { headers: authHeaders() })
                const data = await res.json()

                if (!res.ok) {
                    const raw = data?.message
                    await wait()
                    set({
                        error: (typeof raw === "object" ? raw?.message : raw) || "Failed to fetch inventory",
                        inventoryLoading: false,
                    })
                    return
                }

                const list = data?.data ?? data ?? []
                const fetched: InventoryItem[] = list.map(normalizeItem)

                await wait()
                set({
                    items: fetched,
                    inventoryLoading: false,
                    _hasHydrated: true,
                })
            } catch (err) {
                await wait()
                set({ error: (err as Error).message, inventoryLoading: false })
            }
        },

        addItem: async (item) => {
            const res = await apiFetch("/api/inventory", {
                method: "POST",
                headers: { "Content-Type": "application/json", ...authHeaders() },
                body: JSON.stringify(item),
            })
            const json = await res.json().catch(() => ({}))
            if (!res.ok) {
                const msg = json?.message || json?.errors?.[0]?.message || "Failed to create inventory item"
                throw new Error(msg)
            }
            const newItem = normalizeItem(json?.data ?? json)
            set((s) => ({
                items: [...s.items, newItem],
            }))
        },

        updateItem: async (id, updates) => {
            const currentItem = get().items.find((i) => i.id === id)
            if (!currentItem) return

            // Optimistic update
            const prevState = get().items
            const merged = { ...currentItem, ...updates }
            set((s) => ({
                items: s.items.map((i) => i.id === id ? merged : i),
            }))

            try {
                const res = await apiFetch(`/api/inventory/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", ...authHeaders() },
                    body: JSON.stringify(merged),
                })
                const json = await res.json().catch(() => ({}))
                if (!res.ok) {
                    set({ items: prevState })
                    const msg = json?.message || "Failed to update item"
                    throw new Error(msg)
                }
                const updated = normalizeItem(json?.data ?? json)
                set((s) => ({
                    items: s.items.map((i) => i.id === id ? updated : i),
                }))
            } catch (err) {
                set({ items: prevState })
                throw err
            }
        },

        deleteItem: async (id) => {
            const prevState = get().items
            // Optimistic remove
            set((s) => ({
                items: s.items.filter((i) => i.id !== id),
            }))

            try {
                const res = await apiFetch(`/api/inventory/${id}`, {
                    method: "DELETE",
                    headers: authHeaders(),
                })
                if (!res.ok) {
                    const json = await res.json().catch(() => ({}))
                    set({ items: prevState })
                    const msg = json?.message || "Failed to delete item"
                    throw new Error(msg)
                }
            } catch (err) {
                set({ items: prevState })
                throw err
            }
        },

        adjustQty: async (id, delta) => {
            const currentItem = get().items.find((i) => i.id === id)
            if (!currentItem) return
            const newQty = Math.max(0, currentItem.quantity + delta)

            try {
                await get().updateItem(id, { quantity: newQty })
            } catch (err) {
                // Return promise rejection or let caller bubble up
                throw err
            }
        },
    })
)


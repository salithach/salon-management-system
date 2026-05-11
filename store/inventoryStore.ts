import { create } from "zustand"
import { persist } from "zustand/middleware"

export type InventoryItem = {
    id: string
    name: string
    category: string
    quantity: number
    unit: string
    lowStockThreshold: number
    notes?: string
}

type InventoryState = {
    items: InventoryItem[]
    _hasHydrated: boolean
    setHasHydrated: (v: boolean) => void
    addItem: (item: Omit<InventoryItem, "id">) => void
    updateItem: (id: string, updates: Partial<Omit<InventoryItem, "id">>) => void
    deleteItem: (id: string) => void
    adjustQty: (id: string, delta: number) => void
}

const defaultItems: InventoryItem[] = [
    { id: "1", name: "Hair Wax",         category: "Styling",   quantity: 8,  unit: "pcs",    lowStockThreshold: 3 },
    { id: "2", name: "Bleach Powder",    category: "Coloring",  quantity: 2,  unit: "kg",     lowStockThreshold: 1 },
    { id: "3", name: "Hair Dye – Black", category: "Coloring",  quantity: 12, unit: "tubes",  lowStockThreshold: 4 },
    { id: "4", name: "Hair Dye – Brown", category: "Coloring",  quantity: 3,  unit: "tubes",  lowStockThreshold: 4 },
    { id: "5", name: "Shampoo (1L)",     category: "Hair Care", quantity: 6,  unit: "bottles",lowStockThreshold: 2 },
    { id: "6", name: "Conditioner",      category: "Hair Care", quantity: 4,  unit: "bottles",lowStockThreshold: 2 },
    { id: "7", name: "Nail Polish Remover", category: "Nail Care", quantity: 1, unit: "bottles", lowStockThreshold: 2 },
    { id: "8", name: "Gel Top Coat",     category: "Nail Care", quantity: 5,  unit: "pcs",    lowStockThreshold: 2 },
    { id: "9", name: "Face Mask",        category: "Skin Care", quantity: 20, unit: "pcs",    lowStockThreshold: 5 },
    { id: "10", name: "Waxing Strips",   category: "Waxing",    quantity: 0,  unit: "pcs",    lowStockThreshold: 10 },
]

export const useInventoryStore = create<InventoryState>()(
    persist(
        (set) => ({
            items: defaultItems,
            _hasHydrated: false,
            setHasHydrated: (v) => set({ _hasHydrated: v }),

            addItem: (item) => set((s) => ({
                items: [...s.items, { ...item, id: crypto.randomUUID() }],
            })),

            updateItem: (id, updates) => set((s) => ({
                items: s.items.map((i) => i.id === id ? { ...i, ...updates } : i),
            })),

            deleteItem: (id) => set((s) => ({
                items: s.items.filter((i) => i.id !== id),
            })),

            adjustQty: (id, delta) => set((s) => ({
                items: s.items.map((i) =>
                    i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
                ),
            })),
        }),
        {
            name: "inventory-storage",
            onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
        }
    )
)


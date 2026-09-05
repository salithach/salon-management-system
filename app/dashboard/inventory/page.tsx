"use client"

import { useState } from "react"
import { Package, Plus, X, Search, AlertTriangle, Pencil, Trash2, Minus, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { useInventoryStore, InventoryItem } from "@/store/inventoryStore"
import DropDown from "@/components/DropDown"
import LoadingOverlay from "@/components/LoadingOverlay"
import { INVENTORY_CATEGORIES, INVENTORY_CATEGORY_OPTIONS, INVENTORY_UNIT_OPTIONS } from "@/lib/constants"

// ─── Feature flag ────────────────────────────────────────────────────────────
const COMING_SOON = false
// ─────────────────────────────────────────────────────────────────────────────

const inputCls = "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-zinc-850 bg-white text-gray-900 focus:ring-zinc-800"
const labelCls = "block text-xs font-bold text-gray-600 mb-1.5"

function stockStatus(item: InventoryItem) {
    if (item.quantity === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-800 border border-red-200" }
    if (item.quantity <= item.threshold) return { label: "Low Stock", color: "bg-amber-100 text-amber-800 border border-amber-200" }
    return { label: "In Stock", color: "bg-zinc-100 text-zinc-800 border border-zinc-200" }
}

function getCategoryLabel(categoryCode: string) {
    const code = categoryCode?.toUpperCase().replace(/\s+/g, "_")
    return INVENTORY_CATEGORIES.find(c => c.code === code)?.description ?? categoryCode
}

type FormData = { name: string; category: string; quantity: string; unit: string; threshold: string; notes: string }
const emptyForm: FormData = { name: "", category: "STYLING", quantity: "", unit: "pcs", threshold: "3", notes: "" }

import { useEffect } from "react"

export default function InventoryPage() {
    const { items, _hasHydrated, inventoryLoading, fetchInventory, addItem, updateItem, deleteItem, adjustQty } = useInventoryStore()

    const [search, setSearch] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("ALL")
    const [modal, setModal] = useState<"add" | "edit" | null>(null)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState<FormData>(emptyForm)
    const [formError, setFormError] = useState("")
    const [confirmDel, setConfirmDel] = useState<InventoryItem | null>(null)

    useEffect(() => {
        fetchInventory().then(() => {})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // ── Feature flag: show Coming Soon instead of actual content ──────────────
    if (COMING_SOON) return (
        <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center">
                <Package size={28} className="text-zinc-400" />
            </div>
            <div>
                <h2 className="text-lg font-semibold text-gray-900">Inventory — Coming Soon</h2>
                <p className="text-sm text-gray-400 mt-1 max-w-sm">
                    Full inventory management with stock tracking, low-stock alerts and supplier notes is on its way.
                </p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-500">
                In Development
            </span>
        </div>
    )


    const showLoading = !_hasHydrated || inventoryLoading

    const filtered = items.filter((item) => {
        const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
        const itemCatNormalized = item.category?.toUpperCase().replace(/\s+/g, "_")
        const matchCat = categoryFilter === "ALL" || itemCatNormalized === categoryFilter.toUpperCase()
        return matchSearch && matchCat
    })

    const lowCount = items.filter((i) => i.quantity > 0 && i.quantity <= i.threshold).length
    const outCount = items.filter((i) => i.quantity === 0).length

    const openAdd = () => { setForm(emptyForm); setFormError(""); setModal("add") }
    const openEdit = (item: InventoryItem) => {
        setForm({
            name: item.name, category: item.category,
            quantity: String(item.quantity), unit: item.unit,
            threshold: String(item.threshold),
            notes: item.notes ?? "",
        })
        setEditingId(item.id)
        setFormError("")
        setModal("edit")
    }
    const closeModal = () => { setModal(null); setEditingId(null) }

    const handleSave = async () => {
        if (!form.name.trim()) { setFormError("Item name is required."); return }
        if (!form.quantity || isNaN(Number(form.quantity))) { setFormError("Valid quantity is required."); return }
        const payload = {
            name: form.name.trim(),
            category: form.category,
            quantity: Number(form.quantity),
            unit: form.unit,
            threshold: Number(form.threshold) || 0,
            notes: form.notes.trim() || undefined,
        }
        try {
            if (modal === "add") {
                await addItem(payload)
                toast.success("Item added", { description: `${payload.name} added to inventory.` })
            } else if (modal === "edit" && editingId) {
                await updateItem(editingId, payload)
                toast.success("Item updated", { description: `${payload.name} has been updated.` })
            }
            closeModal()
        } catch (err) {
            setFormError((err as Error).message)
        }
    }

    const handleDelete = async (item: InventoryItem) => {
        try {
            await deleteItem(item.id)
            toast.success("Item removed", { description: `${item.name} removed from inventory.` })
        } catch (err) {
            toast.error((err as Error).message)
        }
    }

    const handleAdjustQty = async (id: string, delta: number) => {
        try {
            await adjustQty(id, delta)
        } catch (err) {
            toast.error((err as Error).message)
        }
    }

    return (
        <>
            {showLoading && <LoadingOverlay message="Loading inventory…" />}
            {/* Alert banner */}
            {(lowCount > 0 || outCount > 0) && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 flex items-center gap-3 flex-wrap">
                    <AlertTriangle size={16} className="text-amber-500 shrink-0" />
                    <p className="text-sm text-amber-700">
                        {outCount > 0 && <span className="font-semibold">{outCount} item{outCount > 1 ? "s" : ""} out of stock</span>}
                        {outCount > 0 && lowCount > 0 && " · "}
                        {lowCount > 0 && <span>{lowCount} item{lowCount > 1 ? "s" : ""} running low</span>}
                    </p>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: "Total Items",  value: items.length },
                    { label: "In Stock",     value: items.filter(i => i.quantity > i.threshold).length },
                    { label: "Low Stock",    value: lowCount },
                    { label: "Out of Stock", value: outCount },
                ].map((s) => (
                    <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                        <p className="text-3xl font-bold text-gray-900">{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 min-w-44">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search items…"
                        className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-zinc-800"
                    />
                </div>

                {/* Category filter */}
                <div className="flex items-center gap-2 flex-wrap">
                    {INVENTORY_CATEGORIES.map((c) => (
                        <button
                            key={c.code}
                            onClick={() => setCategoryFilter(c.code)}
                            className={`text-xs px-3 py-1.5 rounded-full border transition ${
                                categoryFilter === c.code
                                    ? "bg-zinc-800 text-white border-zinc-800"
                                    : "border-gray-200 text-gray-600 hover:border-gray-400"
                            }`}
                        >
                            {c.description}
                        </button>
                    ))}
                </div>

                <button
                    onClick={openAdd}
                    className="ml-auto flex items-center gap-1.5 text-sm bg-zinc-800 text-white px-4 py-2 rounded-lg hover:bg-zinc-700 transition shrink-0"
                >
                    <Plus size={14} /> Add Item
                </button>
            </div>

            {/* Inventory grid */}
            {filtered.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-12 text-center">
                    <Package size={32} className="mx-auto text-gray-200 mb-2" />
                    <p className="text-sm text-gray-400">No items found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map((item) => {
                        const status = stockStatus(item)
                        return (
                            <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:border-gray-300 hover:shadow-md transition">
                                {/* Header */}
                                <div className="flex items-start justify-between gap-2 mb-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                                        <p className="text-xs text-gray-450 text-gray-500 font-medium mt-0.5">{getCategoryLabel(item.category)}</p>
                                    </div>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${status.color}`}>
                                        {status.label}
                                    </span>
                                </div>

                                {/* Quantity control */}
                                <div className="flex items-center justify-between border-t border-gray-50 pt-3 pb-3">
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{item.quantity}</p>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wide">{item.unit}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleAdjustQty(item.id, -1)}
                                            disabled={item.quantity === 0}
                                            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition disabled:opacity-30"
                                        >
                                            <Minus size={13} />
                                        </button>
                                        <button
                                            onClick={() => handleAdjustQty(item.id, 1)}
                                            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
                                        >
                                            <Plus size={13} />
                                        </button>
                                    </div>
                                </div>

                                {/* Low stock indicator */}
                                <div className="mb-3">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[10px] text-gray-400">Stock level</span>
                                        <span className="text-[10px] text-gray-400">Threshold: {item.threshold}</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${
                                                item.quantity === 0 ? "bg-red-400" :
                                                item.quantity <= item.threshold ? "bg-amber-400" : "bg-green-400"
                                            }`}
                                            style={{ width: `${Math.min(100, (item.quantity / Math.max(item.threshold * 3, 1)) * 100)}%` }}
                                        />
                                    </div>
                                </div>

                                {item.notes && (
                                    <p className="text-xs text-gray-400 mb-3 italic truncate">{item.notes}</p>
                                )}

                                {/* Actions */}
                                <div className="flex items-center gap-2 border-t border-gray-50 pt-3">
                                    <button
                                        onClick={() => openEdit(item)}
                                        className="flex-1 flex items-center justify-center gap-1.5 text-xs border border-gray-200 py-2 rounded-lg hover:bg-gray-50 transition"
                                    >
                                        <Pencil size={12} /> Edit
                                    </button>
                                    <button
                                        onClick={() => setConfirmDel(item)}
                                        className="flex items-center justify-center gap-1.5 text-xs border border-red-100 text-red-500 py-2 px-3 rounded-lg hover:bg-red-50 transition"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Add / Edit Modal */}
            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h3 className="text-base font-semibold text-gray-900">{modal === "add" ? "Add Item" : "Edit Item"}</h3>
                                <p className="text-xs text-gray-400 mt-0.5">Salon inventory</p>
                            </div>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-700 transition"><X size={20} /></button>
                        </div>

                        {formError && (
                            <div className="mb-4 px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">{formError}</div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className={labelCls}>Item Name</label>
                                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                    placeholder="e.g. Hair Wax" className={inputCls} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelCls}>Category</label>
                                    <DropDown
                                        options={INVENTORY_CATEGORY_OPTIONS}
                                        value={form.category}
                                        onChange={(v) => setForm({ ...form, category: v })}
                                    />
                                </div>
                                <div>
                                    <label className={labelCls}>Unit</label>
                                    <DropDown
                                        options={INVENTORY_UNIT_OPTIONS}
                                        value={form.unit}
                                        onChange={(v) => setForm({ ...form, unit: v })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelCls}>Quantity</label>
                                    <input type="number" min="0" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })}
                                        placeholder="0" className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>Low Stock Alert At</label>
                                    <input type="number" min="0" value={form.threshold} onChange={e => setForm({ ...form, threshold: e.target.value })}
                                        placeholder="3" className={inputCls} />
                                </div>
                            </div>
                            <div>
                                <label className={labelCls}>Notes <span className="text-gray-400">(optional)</span></label>
                                <input type="text" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                                    placeholder="e.g. Order from supplier X" className={inputCls} />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button onClick={closeModal} className="flex-1 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition">Cancel</button>
                            <button onClick={handleSave}
                                className="flex-1 py-2.5 text-sm bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition flex items-center justify-center gap-1.5">
                                <CheckCircle2 size={14} />
                                {modal === "add" ? "Add Item" : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Delete confirmation modal */}
            {confirmDel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="absolute inset-0" onClick={() => setConfirmDel(null)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4 text-gray-900 border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                <Trash2 size={17} className="text-red-650 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">Remove Inventory Item</h3>
                                <p className="text-xs text-gray-400 mt-1">This action cannot be undone.</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Are you sure you want to permanently remove <span className="font-semibold text-gray-700">&ldquo;{confirmDel.name}&rdquo;</span> from your salon inventory directory?
                        </p>
                        <div className="flex gap-3 pt-1">
                            <button onClick={() => setConfirmDel(null)} className="flex-1 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 transition font-semibold">Cancel</button>
                            <button
                                onClick={async () => {
                                    await handleDelete(confirmDel)
                                    setConfirmDel(null)
                                }}
                                className="flex-1 py-2.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-bold"
                            >
                                Remove Item
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}


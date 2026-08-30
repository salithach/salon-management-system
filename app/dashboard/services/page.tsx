"use client"

import { useState } from "react"
import { Tag, Plus, X, Trash2, Layers } from "lucide-react"
import { toast } from "sonner"
import { useMetadataStore, JobType } from "@/store/metadataStore"
import DropDown from "@/components/DropDown"

const emptyForm = { key: "", value: "", category: "" }

export default function ServicesPage() {
    const { jobTypes, metadataLoading, addJobType } = useMetadataStore()

    const [activeCategory, setActiveCategory] = useState("All")
    const [showModal, setShowModal] = useState(false)
    const [form, setForm] = useState(emptyForm)
    const [formErrors, setFormErrors] = useState<string[]>([])
    const [saving, setSaving] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState<JobType | null>(null)

    // Derived categories from live jobTypes
    const categories = [
        "All",
        ...Array.from(new Set(jobTypes.map((t) => t.category ?? "Uncategorized"))).sort(),
    ]

    // DropDown options — { label: category string, value: category string }
    const categoryOptions = Array.from(
        new Set(jobTypes.map((t) => t.category).filter((c): c is string => !!c))
    )
        .sort()
        .map((cat) => ({ label: cat, value: cat }))

    const filtered = activeCategory === "All"
        ? jobTypes
        : jobTypes.filter((t) => (t.category ?? "Uncategorized") === activeCategory)

    // Stats
    const totalServices = jobTypes.length

    // Find the category with the most services
    const categoryCounts = jobTypes.reduce<Record<string, number>>((acc, t) => {
        const cat = t.category ?? "Uncategorized"
        acc[cat] = (acc[cat] ?? 0) + 1
        return acc
    }, {})
    const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]

    const openAdd = () => {
        setForm(emptyForm)
        setFormErrors([])
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setForm(emptyForm)
        setFormErrors([])
    }

    const handleSave = async () => {
        const errs: string[] = []
        if (!form.key.trim())   errs.push("Key is required.")
        if (!form.value.trim()) errs.push("Display name is required.")
        if (!form.category.trim()) errs.push("Category is required.")
        if (jobTypes.some((t) => t.key === form.key.trim()))
            errs.push(`A service with key "${form.key.trim()}" already exists.`)
        if (errs.length) { setFormErrors(errs); return }

        setSaving(true)
        try {
            await addJobType({
                key: form.key.trim(),
                value: form.value.trim(),
                ...(form.category.trim() ? { category: form.category.trim() } : {}),
            })
            toast.success(`"${form.value.trim()}" added to services`)
            closeModal()
        } catch (err) {
            toast.error((err as Error).message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <>
            {/* Page header */}
            <div className="flex items-center justify-between gap-4">
                <p className="text-lg text-gray-500 font-bold">Service types that we offer</p>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 bg-black text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:opacity-80 transition shrink-0"
                >
                    <Plus size={15} /> Add Service
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <p className="text-xs text-gray-500 mb-1">Total Services</p>
                    <p className="text-3xl font-bold text-gray-900">{totalServices}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <p className="text-xs text-gray-500 mb-1">Categories</p>
                    <p className="text-3xl font-bold text-gray-900">{categories.length - 1}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <p className="text-xs text-gray-500 mb-1">Most in Category</p>
                    <p className="text-xl font-bold text-gray-900 truncate">
                        {topCategory ? topCategory[0] : "—"}
                    </p>
                    {topCategory && (
                        <p className="text-xs text-gray-400 mt-1">{topCategory[1]} service{topCategory[1] !== 1 ? "s" : ""}</p>
                    )}
                </div>
            </div>

            {/* Category pills */}
            <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-1.5 rounded-full text-sm border transition ${
                            activeCategory === cat
                                ? "bg-black text-white border-black"
                                : "bg-white text-gray-600 border-gray-200 hover:border-black hover:text-black"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Services grid */}
            {metadataLoading && jobTypes.length === 0 ? (
                <div className="flex items-center justify-center py-20 text-sm text-gray-400">Loading services…</div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Layers size={32} className="text-gray-200 mb-2" />
                    <p className="text-sm text-gray-400">No services in this category yet.</p>
                    <button onClick={openAdd} className="mt-3 text-xs text-black underline font-medium">
                        Add one now →
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map((svc, index) => (
                        <div
                            key={svc.key[index] + "-" + index}
                            className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:border-gray-300 hover:shadow-md transition"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1 min-w-0 pr-2">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{svc.value}</p>
                                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                                            <Tag size={10} /> {svc.key}
                                        </span>
                                        {svc.category && (
                                            <span className="inline-block text-xs px-2 py-0.5 bg-zinc-800 text-white rounded-full">
                                                {svc.category}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setConfirmDelete(svc)}
                                    className="text-gray-200 hover:text-red-500 transition p-0.5 shrink-0"
                                    title="Remove service"
                                >
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Service Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-semibold text-gray-900">Add Service</h3>
                                <p className="text-xs text-gray-400 mt-0.5">Saved to metadata store &amp; localStorage instantly</p>
                            </div>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-700 transition">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="h-px bg-gray-100" />

                        {formErrors.length > 0 && (
                            <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 space-y-1">
                                {formErrors.map((e) => <p key={e} className="text-xs text-red-600">{e}</p>)}
                            </div>
                        )}

                        <div className="space-y-4">
                            {/* value — display name */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                                    Service Display Name <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={form.value}
                                    onChange={(e) => {
                                        const name = e.target.value
                                        const autoKey = name.trim().toUpperCase().replace(/\s+/g, "_").replace(/[^A-Z0-9_]/g, "")
                                        setForm({ ...form, value: name, key: autoKey })
                                    }}
                                    placeholder="e.g. Hair Cut"
                                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-zinc-800 text-gray-900 placeholder:text-gray-400 bg-white"
                                />
                            </div>

                            {/* key — identifier */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                                    Service Key <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={form.key}
                                    onChange={(e) => setForm({ ...form, key: e.target.value.toUpperCase().replace(/\s+/g, "_").replace(/[^A-Z0-9_]/g, "") })}
                                    placeholder="e.g. HAIR_CUT"
                                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-zinc-800 text-gray-900 placeholder:text-gray-400 bg-white font-mono"
                                />
                                <p className="text-[10px] text-gray-400 mt-1">Uppercase, underscores only. Auto-populated from service name.</p>
                            </div>

                            {/* category */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                                    Service Category <span className="text-red-400">*</span>
                                </label>
                                <DropDown
                                    options={categoryOptions}
                                    value={form.category}
                                    onChange={(v) => setForm({ ...form, category: v })}
                                    placeholder="Select a category…"
                                    disabled={categoryOptions.length === 0}
                                />
                                {categoryOptions.length === 0 && (
                                    <p className="text-[10px] text-gray-400 mt-1">
                                        No categories yet — add your first service to create one.
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3 pt-1">
                            <button
                                onClick={closeModal}
                                disabled={saving}
                                className="flex-1 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition disabled:opacity-50"
                            >
                                {saving
                                    ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
                                    : "Submit"
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Delete Modal */}
            {confirmDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                <Trash2 size={17} className="text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900">Remove Service</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Removes from store &amp; localStorage</p>
                            </div>
                        </div>
                        <div className="h-px bg-gray-100" />
                        <p className="text-sm text-gray-600">
                            Remove <span className="font-semibold text-gray-900">&quot;{confirmDelete.value}&quot;</span>{" "}
                            <span className="text-gray-400">(key: {confirmDelete.key})</span>?
                        </p>
                        <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="text-sm text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    const { jobTypes: current } = useMetadataStore.getState()
                                    useMetadataStore.setState({
                                        jobTypes: current.filter((t) => t.key !== confirmDelete!.key),
                                    })
                                    toast.success(`"${confirmDelete!.value}" removed`)
                                    setConfirmDelete(null)
                                }}
                                className="flex items-center gap-2 text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                            >
                                <Trash2 size={13} /> Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}


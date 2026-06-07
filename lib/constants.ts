// ─────────────────────────────────────────────────────────────────────────────
// Shared option lists used across the app.
// Each item has a machine-readable `code` and a human-readable `description`.
// Use the helper `toDropDownOptions()` to convert to DropDown's { label, value } shape.
// ─────────────────────────────────────────────────────────────────────────────

export type OptionItem = { code: string; description: string }

/** Convert an OptionItem[] to the { label, value } shape expected by <DropDown /> */
export const toDropDownOptions = (items: OptionItem[]) =>
    items.map((i) => ({ label: i.description, value: i.code }))

/** Resolve a code back to its human-readable description */
export const resolveDescription = (items: OptionItem[], code: string): string =>
    items.find((i) => i.code === code)?.description ?? code

// ── Inventory categories ──────────────────────────────────────────────────────
export const INVENTORY_CATEGORIES: OptionItem[] = [
    { code: "ALL",       description: "All" },
    { code: "STYLING",   description: "Styling" },
    { code: "COLORING",  description: "Coloring" },
    { code: "HAIR_CARE", description: "Hair Care" },
    { code: "NAIL_CARE", description: "Nail Care" },
    { code: "SKIN_CARE", description: "Skin Care" },
    { code: "WAXING",    description: "Waxing" },
    { code: "TOOLS",     description: "Tools" },
    { code: "CLEANING",  description: "Cleaning" },
    { code: "OTHER",     description: "Other" },
]
export const INVENTORY_CATEGORY_OPTIONS = toDropDownOptions(
    INVENTORY_CATEGORIES.filter((c) => c.code !== "ALL")
)

// ── Inventory units ───────────────────────────────────────────────────────────
export const INVENTORY_UNITS: OptionItem[] = [
    { code: "pcs",     description: "pcs" },
    { code: "bottles", description: "bottles" },
    { code: "tubes",   description: "tubes" },
    { code: "kg",      description: "kg" },
    { code: "g",       description: "g" },
    { code: "ml",      description: "ml" },
    { code: "L",       description: "L" },
    { code: "boxes",   description: "boxes" },
    { code: "rolls",   description: "rolls" },
]
export const INVENTORY_UNIT_OPTIONS = toDropDownOptions(INVENTORY_UNITS)


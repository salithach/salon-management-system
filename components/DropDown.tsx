"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Check } from "lucide-react"

export type DropDownOption = string | { label: string; value: string }

type SingleProps = {
    multiple?: false
    value: string
    onChange: (v: string) => void
}

type MultiProps = {
    multiple: true
    value: string[]
    onChange: (v: string[]) => void
}

type Props = (SingleProps | MultiProps) & {
    options: DropDownOption[]
    placeholder?: string
    disabled?: boolean
}

// Normalise to { label, value } regardless of input shape
function normalise(opt: DropDownOption): { label: string; value: string } {
    return typeof opt === "string" ? { label: opt, value: opt } : opt
}

export default function DropDown({ options, placeholder = "Select…", ...props }: Props) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const disabled = (props as { disabled?: boolean }).disabled ?? false

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    const normalised = options.map(normalise)

    const isSelected = (val: string) =>
        props.multiple ? props.value.includes(val) : props.value === val

    const handleSelect = (val: string) => {
        if (props.multiple) {
            const current = props.value
            props.onChange(
                current.includes(val) ? current.filter((v) => v !== val) : [...current, val]
            )
        } else {
            props.onChange(val)
            setOpen(false)
        }
    }

    const displayLabel = () => {
        if (props.multiple) {
            if (props.value.length === 0) return placeholder
            if (props.value.length === 1) {
                const match = normalised.find((o) => o.value === props.value[0])
                return match?.label ?? props.value[0]
            }
            return `${props.value.length} selected`
        }
        const match = normalised.find((o) => o.value === props.value)
        return match?.label ?? props.value ?? placeholder
    }

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => !disabled && setOpen((o) => !o)}
                disabled={disabled}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white transition focus:outline-none focus:ring-2 focus:ring-zinc-800 ${
                    disabled ? "opacity-50 cursor-not-allowed" : "hover:border-gray-400"
                }`}
            >
                <span className={`truncate ${props.multiple ? (props.value.length === 0 ? "text-gray-400" : "text-gray-700") : (props.value ? "text-gray-700" : "text-gray-400")}`}>
                    {displayLabel()}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                    {props.multiple && props.value.length > 0 && (
                        <span className="bg-zinc-800 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                            {props.value.length}
                        </span>
                    )}
                    <ChevronDown
                        size={15}
                        className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    />
                </div>
            </button>

            {open && (
                <ul className="absolute z-50 mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-56 overflow-y-auto py-1">
                    {normalised.map((opt) => {
                        const selected = isSelected(opt.value)
                        return (
                            <li
                                key={opt.value}
                                onClick={() => handleSelect(opt.value)}
                                className={`flex items-center justify-between px-3 py-2.5 mx-1 text-sm cursor-pointer rounded-lg transition ${
                                    selected ? "bg-zinc-800 text-white" : "text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                                <span>{opt.label}</span>
                                {selected && <Check size={14} className="shrink-0" />}
                            </li>
                        )
                    })}
                    {props.multiple && props.value.length > 0 && (
                        <li className="px-3 pt-1 pb-1 mx-1">
                            <button
                                type="button"
                                onClick={() => { props.onChange([]); setOpen(false) }}
                                className="w-full text-xs text-gray-400 hover:text-red-500 transition text-center py-1 border-t border-gray-100 mt-0.5"
                            >
                                Clear selection
                            </button>
                        </li>
                    )}
                </ul>
            )}
        </div>
    )
}

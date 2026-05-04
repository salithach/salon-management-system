"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Check } from "lucide-react"

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
    options: string[]
    placeholder?: string
}

export default function DropDown({ options, placeholder = "Select…", ...props }: Props) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    const isSelected = (opt: string) =>
        props.multiple ? props.value.includes(opt) : props.value === opt

    const handleSelect = (opt: string) => {
        if (props.multiple) {
            const current = props.value
            props.onChange(
                current.includes(opt) ? current.filter((v) => v !== opt) : [...current, opt]
            )
            // stay open for multi-select
        } else {
            props.onChange(opt)
            setOpen(false)
        }
    }

    const displayLabel = () => {
        if (props.multiple) {
            return props.value.length === 0
                ? placeholder
                : props.value.length === 1
                    ? props.value[0]
                    : `${props.value.length} selected`
        }
        return props.value || placeholder
    }

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white hover:border-gray-400 transition focus:outline-none focus:ring-2 focus:ring-zinc-800"
            >
                <span className="truncate text-gray-700">{displayLabel()}</span>
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
                    {options.map((opt) => {
                        const selected = isSelected(opt)
                        return (
                            <li
                                key={opt}
                                onClick={() => handleSelect(opt)}
                                className={`flex items-center justify-between px-3 py-2.5 mx-1 text-sm cursor-pointer rounded-lg transition ${
                                    selected
                                        ? "bg-zinc-800 text-white"
                                        : "text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                                <span>{opt}</span>
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

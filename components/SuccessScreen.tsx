"use client"

import Link from "next/link"
import { CheckCircle2, LucideIcon } from "lucide-react"

type Bullet = {
    label: string
    value: string
}

type Action = {
    label: string
    href: string
    variant?: "primary" | "secondary"
}

type Props = {
    title?: string
    subtitle?: string
    /** Highlighted name shown in the description line */
    entityName?: string
    entityLabel?: string
    /** Extra bullet rows showing what was set up */
    bullets?: Bullet[]
    /** Primary + optional secondary CTA */
    actions?: Action[]
    /** Override the default CheckCircle2 icon */
    icon?: LucideIcon
}

export default function SuccessScreen({
    title = "You're all set!",
    subtitle,
    entityName,
    entityLabel = "Account",
    bullets = [],
    actions = [{ label: "Continue", href: "/", variant: "primary" }],
    icon: Icon = CheckCircle2,
}: Props) {
    return (
        <div className="flex-1 flex items-center justify-center bg-gray-50 px-4 py-8">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm w-full max-w-md overflow-hidden">

                {/* Top accent strip */}
                <div className="h-1.5 w-full bg-black" />

                <div className="p-8 flex flex-col items-center text-center gap-5">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center shadow-lg">
                        <Icon size={30} className="text-white" />
                    </div>

                    {/* Heading */}
                    <div className="space-y-1.5">
                        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                        <hr className="text-gray-300 mt-4 mb-6" />
                        {entityName && (
                            <p className="text-sm text-gray-500">
                                {entityLabel}{" "}
                                <span className="font-semibold text-gray-800">{entityName}</span>
                                {" "}is created successfully. You are ready to use SalonHQ!
                            </p>
                        )}
                        {subtitle && (
                            <p className="text-xs text-gray-500 leading-relaxed">{subtitle}</p>
                        )}

                    </div>

                    {/* Bullet details */}
                    {bullets.length > 0 && (
                        <div className="w-full bg-gray-50 rounded-xl border border-gray-100 divide-y divide-gray-100 text-left">
                            {bullets.map((b) => (
                                <div key={b.label} className="flex items-center justify-between px-4 py-3">
                                    <span className="text-xs text-gray-500">{b.label}</span>
                                    <span className="text-xs font-semibold text-gray-800 truncate max-w-[55%] text-right">{b.value}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="w-full flex flex-col gap-2.5 pt-1">
                        {actions.map((a) =>
                            a.variant === "secondary" ? (
                                <Link
                                    key={a.label}
                                    href={a.href}
                                    className="w-full text-sm text-gray-500 hover:text-gray-800 py-2.5 rounded-xl border border-gray-200 hover:border-gray-400 transition text-center"
                                >
                                    {a.label}
                                </Link>
                            ) : (
                                <Link
                                    key={a.label}
                                    href={a.href}
                                    className="w-full text-sm font-semibold bg-black text-white py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition text-center"
                                >
                                    {a.label}
                                </Link>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}


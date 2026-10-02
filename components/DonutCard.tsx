"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

export type DonutDatum = { name: string; value: number; color: string }

type DonutCardProps = {
    title: string
    subtitle: string
    data: DonutDatum[]
    format?: (value: number) => string
    emptyText: string
}

export default function DonutCard({
    title,
    subtitle,
    data,
    format = (v) => String(v),
    emptyText,
}: DonutCardProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-xs text-gray-400 mb-4">{subtitle} in selected range</p>
            {data.length === 0 ? (
                <p className="text-xs text-gray-400 py-6">{emptyText}</p>
            ) : (
                <div className="flex items-center gap-4">
                    <ResponsiveContainer width={100} height={100} className="shrink-0">
                        <PieChart>
                            <Pie data={data} cx="50%" cy="50%" innerRadius={28} outerRadius={46}
                                 dataKey="value" strokeWidth={2}>
                                {data.map((entry) => (
                                    <Cell key={entry.name} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: 8, fontSize: 12 }}
                                formatter={(v) => [format(Number(v)), ""]}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                        {data.map((s) => (
                            <div key={s.name} className="flex items-center gap-2 text-xs text-gray-600">
                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                                <span className="truncate">{s.name}</span>
                                <span className="ml-auto text-gray-800 font-medium shrink-0">{format(s.value)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}


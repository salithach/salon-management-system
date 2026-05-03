const monthlyRevenue = [
    { month: "Nov", revenue: 4800, appointments: 68 },
    { month: "Dec", revenue: 5200, appointments: 74 },
    { month: "Jan", revenue: 4400, appointments: 62 },
    { month: "Feb", revenue: 5600, appointments: 80 },
    { month: "Mar", revenue: 5900, appointments: 84 },
    { month: "Apr", revenue: 6100, appointments: 88 },
    { month: "May", revenue: 6420, appointments: 92 },
]

const topServices = [
    { name: "Hair Coloring", revenue: "$1,960", share: 30 },
    { name: "Manicure", revenue: "$1,320", share: 21 },
    { name: "Haircut & Blowout", revenue: "$1,040", share: 16 },
    { name: "Full Highlights", revenue: "$840", share: 13 },
    { name: "Others", revenue: "$1,260", share: 20 },
]

const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue))

export default function ReportsPage() {
    return (
        <>
            {/* KPI cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                    { label: "Monthly Revenue", value: "$6,420", change: "+12% vs last month" },
                    { label: "Total Appointments", value: "92", change: "+5% vs last month" },
                    { label: "New Clients", value: "24", change: "+8 vs last month" },
                    { label: "Avg. Ticket", value: "$69.8", change: "+6% vs last month" },
                ].map((s) => (
                    <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                        <p className="text-3xl font-bold text-gray-900">{s.value}</p>
                        <p className="text-xs text-gray-400 mt-1">{s.change}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                {/* Bar chart */}
                <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-sm font-semibold text-gray-900 mb-6">Monthly Revenue</h2>
                    <div className="flex items-end gap-3 h-40">
                        {monthlyRevenue.map((m) => {
                            const height = Math.round((m.revenue / maxRevenue) * 100)
                            return (
                                <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                                    <span className="text-xs text-gray-500">${(m.revenue / 1000).toFixed(1)}k</span>
                                    <div
                                        className="w-full rounded-t-md bg-black transition-all"
                                        style={{ height: `${height}%` }}
                                    />
                                    <span className="text-xs text-gray-400">{m.month}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Top services */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-sm font-semibold text-gray-900 mb-6">Revenue by Service</h2>
                    <div className="space-y-4">
                        {topServices.map((svc) => (
                            <div key={svc.name}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-gray-700">{svc.name}</span>
                                    <span className="text-xs font-medium text-gray-900">{svc.revenue}</span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-black rounded-full"
                                        style={{ width: `${svc.share}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Monthly breakdown table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-sm font-semibold text-gray-900">Monthly Breakdown</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                {["Month", "Revenue", "Appointments", "Avg. Ticket"].map((h) => (
                                    <th key={h} className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {[...monthlyRevenue].reverse().map((m) => (
                                <tr key={m.month} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-medium text-gray-700">{m.month}</td>
                                    <td className="px-6 py-4 text-gray-900">${m.revenue.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-gray-600">{m.appointments}</td>
                                    <td className="px-6 py-4 text-gray-600">${(m.revenue / m.appointments).toFixed(0)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}


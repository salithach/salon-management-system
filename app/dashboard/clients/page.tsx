const clients = [
    { name: "Emma Johnson", email: "emma@example.com", phone: "555-0101", visits: 12, lastVisit: "Apr 28, 2026", spent: "$840" },
    { name: "Olivia Smith", email: "olivia@example.com", phone: "555-0102", visits: 8, lastVisit: "May 1, 2026", spent: "$560" },
    { name: "Sophia Lee", email: "sophia@example.com", phone: "555-0103", visits: 5, lastVisit: "Apr 15, 2026", spent: "$310" },
    { name: "Ava Brown", email: "ava@example.com", phone: "555-0104", visits: 20, lastVisit: "May 3, 2026", spent: "$1,420" },
    { name: "Isabella Davis", email: "isabella@example.com", phone: "555-0105", visits: 3, lastVisit: "Mar 22, 2026", spent: "$195" },
    { name: "Mia Wilson", email: "mia@example.com", phone: "555-0106", visits: 15, lastVisit: "Apr 30, 2026", spent: "$1,080" },
    { name: "Charlotte Moore", email: "charlotte@example.com", phone: "555-0107", visits: 7, lastVisit: "Apr 10, 2026", spent: "$490" },
    { name: "Amelia Taylor", email: "amelia@example.com", phone: "555-0108", visits: 9, lastVisit: "May 2, 2026", spent: "$630" },
]

export default function ClientsPage() {
    return (
        <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Total Clients", value: "348" },
                    { label: "New This Month", value: "24" },
                    { label: "Returning Clients", value: "91%" },
                ].map((s) => (
                    <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                        <p className="text-3xl font-bold text-gray-900">{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-sm font-semibold text-gray-900">All Clients</h2>
                    <button className="bg-black text-white text-xs px-3 py-1.5 rounded-lg hover:opacity-80 transition">
                        + Add Client
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                {["Name", "Email", "Phone", "Visits", "Last Visit", "Total Spent", ""].map((h) => (
                                    <th key={h} className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {clients.map((c, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{c.name}</td>
                                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{c.email}</td>
                                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{c.phone}</td>
                                    <td className="px-6 py-4 text-gray-700 whitespace-nowrap">{c.visits}</td>
                                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{c.lastVisit}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{c.spent}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-xs text-gray-400 hover:text-black transition">View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}


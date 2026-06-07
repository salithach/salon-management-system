import { CalendarDays } from "lucide-react"

// ─── Feature flag ────────────────────────────────────────────────────────────
const COMING_SOON = true
// ─────────────────────────────────────────────────────────────────────────────

const allAppointments = [
    { date: "Today", time: "09:00 AM", client: "Emma Johnson", service: "Hair Coloring", stylist: "Mia Chen", status: "Confirmed" },
    { date: "Today", time: "10:30 AM", client: "Olivia Smith", service: "Haircut & Blowout", stylist: "Lena Park", status: "Confirmed" },
    { date: "Today", time: "11:00 AM", client: "Sophia Lee", service: "Manicure", stylist: "Sara Kim", status: "Pending" },
    { date: "Today", time: "01:00 PM", client: "Ava Brown", service: "Deep Conditioning", stylist: "Mia Chen", status: "Confirmed" },
    { date: "Today", time: "02:30 PM", client: "Isabella Davis", service: "Eyebrow Threading", stylist: "Lena Park", status: "Pending" },
    { date: "Today", time: "04:00 PM", client: "Mia Wilson", service: "Full Highlights", stylist: "Sara Kim", status: "Confirmed" },
    { date: "Tomorrow", time: "10:00 AM", client: "Charlotte Moore", service: "Nail Art", stylist: "Sara Kim", status: "Confirmed" },
    { date: "Tomorrow", time: "01:30 PM", client: "Amelia Taylor", service: "Hair Coloring", stylist: "Mia Chen", status: "Pending" },
    { date: "Tomorrow", time: "03:00 PM", client: "Harper Anderson", service: "Facial", stylist: "Lena Park", status: "Confirmed" },
]

const statusColor: Record<string, string> = {
    Confirmed: "bg-black text-white",
    Pending: "bg-gray-100 text-gray-700",
    Cancelled: "bg-red-100 text-red-700",
}

export default function AppointmentsPage() {
    if (COMING_SOON) return (
        <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center">
                <CalendarDays size={28} className="text-zinc-400" />
            </div>
            <div>
                <h2 className="text-lg font-semibold text-gray-900">Appointments — Coming Soon</h2>
                <p className="text-sm text-gray-400 mt-1 max-w-sm">
                    Full appointment scheduling with calendar view, booking management and reminders is on its way.
                </p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-500">
                In Development
            </span>
        </div>
    )

    return (
        <>
            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Total Today", value: "6" },
                    { label: "Pending Confirmation", value: "3" },
                    { label: "This Week", value: "24" },
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
                    <h2 className="text-sm font-semibold text-gray-900">All Appointments</h2>
                    <button className="bg-black text-white text-xs px-3 py-2 rounded-lg hover:opacity-80 transition">
                        + New
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                {["Date", "Time", "Client", "Service", "Stylist", "Status", ""].map((h) => (
                                    <th key={h} className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {allAppointments.map((a, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{a.date}</td>
                                    <td className="px-6 py-4 font-medium text-gray-700 whitespace-nowrap">{a.time}</td>
                                    <td className="px-6 py-4 text-gray-900 whitespace-nowrap">{a.client}</td>
                                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{a.service}</td>
                                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{a.stylist}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[a.status] ?? "bg-gray-100 text-gray-700"}`}>
                                            {a.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-xs text-gray-400 hover:text-black transition">Edit</button>
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


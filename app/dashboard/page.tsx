import Link from "next/link"
import { Users, Scissors, BarChart3 } from "lucide-react"

const stats = [
    { label: "Today's Appointments", value: "12", change: "+3 from yesterday" },
    { label: "Total Clients", value: "348", change: "+8 this week" },
    { label: "Monthly Revenue", value: "$6,420", change: "+12% vs last month" },
    { label: "Pending Bookings", value: "5", change: "Needs confirmation" },
]

const appointments = [
    { time: "09:00 AM", client: "Emma Johnson", service: "Hair Coloring", stylist: "Mia Chen", status: "Confirmed" },
    { time: "10:30 AM", client: "Olivia Smith", service: "Haircut & Blowout", stylist: "Lena Park", status: "Confirmed" },
    { time: "11:00 AM", client: "Sophia Lee", service: "Manicure", stylist: "Sara Kim", status: "Pending" },
    { time: "01:00 PM", client: "Ava Brown", service: "Deep Conditioning", stylist: "Mia Chen", status: "Confirmed" },
    { time: "02:30 PM", client: "Isabella Davis", service: "Eyebrow Threading", stylist: "Lena Park", status: "Pending" },
    { time: "04:00 PM", client: "Mia Wilson", service: "Full Highlights", stylist: "Sara Kim", status: "Confirmed" },
]

export default function DashboardPage() {
    return (
        <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
                    </div>
                ))}
            </div>

            {/* Appointments Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-sm font-semibold text-gray-900">Today&apos;s Appointments</h2>
                    <Link href="/dashboard/appointments" className="text-xs text-gray-500 hover:text-black transition">
                        View all →
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Stylist</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {appointments.map((appt, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-medium text-gray-700 whitespace-nowrap">{appt.time}</td>
                                    <td className="px-6 py-4 text-gray-900 whitespace-nowrap">{appt.client}</td>
                                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{appt.service}</td>
                                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{appt.stylist}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            appt.status === "Confirmed" ? "bg-black text-white" : "bg-gray-100 text-gray-700"
                                        }`}>
                                            {appt.status}
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

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { title: "Add Client", desc: "Register a new client profile", icon: Users, href: "/dashboard/clients" },
                    { title: "Manage Services", desc: "Update pricing & service list", icon: Scissors, href: "/dashboard/services" },
                    { title: "View Reports", desc: "Monthly revenue & insights", icon: BarChart3, href: "/dashboard/reports" },
                ].map(({ title, desc, icon: Icon, href }) => (
                    <Link
                        key={title}
                        href={href}
                        className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-left hover:border-brand hover:shadow-md transition group"
                    >
                        <Icon size={24} className="mb-3 text-gray-500 group-hover:text-brand transition" />
                        <p className="text-sm font-semibold text-gray-900">{title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                    </Link>
                ))}
            </div>
        </>
    )
}

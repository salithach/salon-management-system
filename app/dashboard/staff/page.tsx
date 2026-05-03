const staff = [
    { name: "Mia Chen", role: "Senior Stylist", speciality: "Hair Coloring, Highlights", appointments: 18, rating: "4.9", status: "Available" },
    { name: "Lena Park", role: "Stylist", speciality: "Haircuts, Threading", appointments: 14, rating: "4.8", status: "Available" },
    { name: "Sara Kim", role: "Nail Technician", speciality: "Manicure, Nail Art", appointments: 22, rating: "4.9", status: "Busy" },
    { name: "Jade Rivera", role: "Esthetician", speciality: "Facials, Lash Extensions", appointments: 10, rating: "4.7", status: "Off Today" },
    { name: "Priya Nair", role: "Stylist", speciality: "Blowouts, Deep Conditioning", appointments: 12, rating: "4.8", status: "Available" },
]

const statusColor: Record<string, string> = {
    Available: "bg-black text-white",
    Busy: "bg-gray-100 text-gray-700",
    "Off Today": "bg-gray-100 text-gray-400",
}

export default function StaffPage() {
    return (
        <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Total Staff", value: "5" },
                    { label: "Available Today", value: "3" },
                    { label: "Avg. Rating", value: "4.82" },
                ].map((s) => (
                    <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                        <p className="text-3xl font-bold text-gray-900">{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Staff cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {staff.map((member) => (
                    <div
                        key={member.name}
                        className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:border-black hover:shadow-md transition"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-lg font-semibold shrink-0">
                                {member.name[0]}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{member.name}</p>
                                <p className="text-xs text-gray-500">{member.role}</p>
                            </div>
                            <span className={`ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[member.status] ?? "bg-gray-100 text-gray-700"}`}>
                                {member.status}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">✂️ {member.speciality}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-50 pt-3">
                            <span>{member.appointments} appts this month</span>
                            <span className="font-medium text-gray-900">★ {member.rating}</span>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <button className="flex-1 text-xs border border-gray-200 rounded-lg py-1.5 hover:border-black hover:text-black transition">
                                Schedule
                            </button>
                            <button className="flex-1 text-xs bg-black text-white rounded-lg py-1.5 hover:opacity-80 transition">
                                Profile
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}


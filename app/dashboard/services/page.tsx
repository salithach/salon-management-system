import { Clock, BookOpen } from "lucide-react"

const services = [
    { name: "Haircut & Blowout", category: "Hair", duration: "60 min", price: "$65", bookings: 48 },
    { name: "Hair Coloring", category: "Hair", duration: "120 min", price: "$140", bookings: 35 },
    { name: "Full Highlights", category: "Hair", duration: "150 min", price: "$180", bookings: 28 },
    { name: "Deep Conditioning", category: "Hair", duration: "45 min", price: "$50", bookings: 22 },
    { name: "Manicure", category: "Nails", duration: "40 min", price: "$35", bookings: 60 },
    { name: "Pedicure", category: "Nails", duration: "50 min", price: "$45", bookings: 42 },
    { name: "Nail Art", category: "Nails", duration: "60 min", price: "$55", bookings: 30 },
    { name: "Eyebrow Threading", category: "Beauty", duration: "20 min", price: "$20", bookings: 75 },
    { name: "Facial", category: "Beauty", duration: "60 min", price: "$80", bookings: 18 },
    { name: "Lash Extensions", category: "Beauty", duration: "90 min", price: "$120", bookings: 14 },
]

const categories = ["All", "Hair", "Nails", "Beauty"]

export default function ServicesPage() {
    return (
        <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Total Services", value: "10" },
                    { label: "Most Booked", value: "Threading" },
                    { label: "Avg. Price", value: "$79" },
                ].map((s) => (
                    <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                        <p className="text-3xl font-bold text-gray-900">{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Category pills */}
            <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        className={`px-4 py-1.5 rounded-full text-sm border transition ${
                            cat === "All"
                                ? "bg-black text-white border-black"
                                : "bg-white text-gray-600 border-gray-200 hover:border-black hover:text-black"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Services grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {services.map((svc) => (
                    <div
                        key={svc.name}
                        className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:border-black hover:shadow-md transition group"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{svc.name}</p>
                                <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{svc.category}</span>
                            </div>
                            <p className="text-lg font-bold text-gray-900">{svc.price}</p>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="flex items-center gap-1"><Clock size={12} /> {svc.duration}</span>
                            <span className="flex items-center gap-1"><BookOpen size={12} /> {svc.bookings} bookings</span>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <button className="flex-1 text-xs border border-gray-200 rounded-lg py-1.5 hover:border-black hover:text-black transition">
                                Edit
                            </button>
                            <button className="flex-1 text-xs bg-black text-white rounded-lg py-1.5 hover:opacity-80 transition">
                                Book
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}


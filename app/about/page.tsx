export default function AboutPage() {
    const stats = [
        { value: "4,000+", label: "Salons using SalonHQ" },
        { value: "2M+",    label: "Appointments managed" },
        { value: "99.9%",  label: "Platform uptime" },
        { value: "4.9 ★",  label: "Average rating" },
    ];

    const pillars = [
        {
            label: "Scheduling",
            icon: "📅",
            title: "Built around the calendar",
            body: "Real-time booking, automated reminders, and zero double-bookings — so your team focuses on clients, not admin.",
        },
        {
            label: "Staff",
            icon: "👥",
            title: "Your whole team, one place",
            body: "Rosters, commission tracking, daily jobs, and performance reports — all unified under one clean dashboard.",
        },
        {
            label: "Analytics",
            icon: "📊",
            title: "Data that drives decisions",
            body: "Revenue by service, staff, and period. Retention insights and trend reports that actually help you grow.",
        },
    ];

    const team = [
        { name: "Alex Rivera",   role: "CEO & Co-founder",  initial: "A" },
        { name: "Priya Nair",    role: "Head of Product",    initial: "P" },
        { name: "James Cho",     role: "Lead Engineer",      initial: "J" },
        { name: "Sofia Martins", role: "Customer Success",   initial: "S" },
    ];

    return (
        <main className="bg-[#f8fafc] text-slate-900 min-h-screen">

            {/* ── Hero ── */}
            <section className="bg-white border-b border-slate-200 px-6 py-28 text-center">
                <span className="inline-block text-xs font-semibold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full mb-6">
                    Est. 2020 · Salon Software
                </span>
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] text-slate-900 mb-6 max-w-3xl mx-auto">
                    Built for salons,<br className="hidden sm:block" /> by people who get it.
                </h1>
                <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed mb-10">
                    SalonHQ is the all-in-one platform that replaces the spreadsheets,
                    missed calls, and disconnected tools — for good.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                    <a href="/pricing" className="px-7 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-full hover:bg-indigo-700 transition-colors shadow-sm">
                        View Plans
                    </a>
                    <a href="/contact" className="px-7 py-3 border border-slate-300 text-slate-600 text-sm font-semibold rounded-full hover:border-slate-900 hover:text-slate-900 transition-colors">
                        Book a Demo
                    </a>
                </div>
            </section>

            {/* ── Stats ── */}
            <section className="bg-slate-900 px-6 py-14">
                <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((s) => (
                        <div key={s.label}>
                            <p className="text-3xl font-bold tracking-tight text-white">{s.value}</p>
                            <p className="text-slate-400 text-sm mt-1.5">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Story ── */}
            <section className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
                <div>
                    <span className="inline-block text-xs font-semibold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full mb-5">
                        Our Story
                    </span>
                    <h2 className="text-4xl font-bold tracking-tight leading-tight text-slate-900 mb-6">
                        We saw the chaos.<br />We built the fix.
                    </h2>
                    <p className="text-slate-500 leading-relaxed mb-4">
                        SalonHQ started when our founders — former salon owners — got tired of
                        juggling three apps, a paper book, and a group chat just to run one shift.
                        They set out to build the software they always wished existed.
                    </p>
                    <p className="text-slate-500 leading-relaxed">
                        Today, thousands of salons trust SalonHQ for scheduling, staff management,
                        client records, and real-time revenue insight — from one clean dashboard.
                    </p>
                </div>

                {/* Mock dashboard card */}
                <div className="relative">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Today&apos;s Overview</p>
                            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                            </span>
                        </div>
                        {[
                            { icon: "📅", label: "Appointments",  value: "42 booked" },
                            { icon: "👤", label: "New clients",   value: "3 today" },
                            { icon: "💳", label: "Revenue",       value: "$2,840" },
                            { icon: "⭐", label: "Reviews",       value: "4 × 5-star" },
                        ].map((row) => (
                            <div key={row.label} className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                                <div className="flex items-center gap-2.5 text-sm text-slate-600">
                                    <span>{row.icon}</span>
                                    <span>{row.label}</span>
                                </div>
                                <span className="text-sm font-semibold text-slate-900">{row.value}</span>
                            </div>
                        ))}
                    </div>
                    <div className="absolute -top-3 -right-3 bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                        Live Dashboard
                    </div>
                </div>
            </section>

            {/* ── Pillars ── */}
            <section className="border-y border-slate-200 py-24 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full mb-4">
                            Why SalonHQ
                        </span>
                        <h2 className="text-4xl font-bold tracking-tight text-slate-900">What we get right</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {pillars.map((p) => (
                            <div key={p.title} className="bg-[#f8fafc] border border-slate-200 rounded-2xl p-7 hover:border-indigo-400 hover:shadow-md transition-all group">
                                <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xl mb-5">
                                    {p.icon}
                                </div>
                                <span className="inline-block text-xs font-semibold uppercase tracking-widest text-indigo-600 mb-3">
                                    {p.label}
                                </span>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{p.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{p.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Team ── */}
            <section className="max-w-6xl mx-auto px-6 py-24">
                <div className="text-center mb-14">
                    <span className="inline-block text-xs font-semibold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full mb-4">
                        The Team
                    </span>
                    <h2 className="text-4xl font-bold tracking-tight text-slate-900">People behind the platform</h2>
                    <p className="text-slate-500 mt-3 max-w-md mx-auto text-sm">
                        Engineers, designers, and former salon operators who care about getting this right.
                    </p>
                </div>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
                    {team.map((m) => (
                        <div key={m.name} className="bg-white border border-slate-200 rounded-2xl p-6 text-center hover:border-indigo-400 hover:shadow-md transition-all group">
                            <div className="w-14 h-14 rounded-full bg-indigo-50 border border-indigo-100 mx-auto mb-4 flex items-center justify-center text-lg font-bold text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                {m.initial}
                            </div>
                            <p className="font-semibold text-slate-900 text-sm">{m.name}</p>
                            <p className="text-slate-400 text-xs mt-1">{m.role}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="bg-slate-900 text-white px-6 py-24 text-center">
                <span className="inline-block text-xs font-semibold uppercase tracking-widest text-indigo-400 bg-indigo-950 px-3 py-1.5 rounded-full mb-6">
                    Get Started
                </span>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5 leading-tight">
                    Ready to modernise<br />your salon?
                </h2>
                <p className="text-slate-400 max-w-md mx-auto mb-10 text-sm leading-relaxed">
                    Join 4,000+ salons already running smarter with SalonHQ. No contracts. Cancel anytime.
                </p>
                <a href="/contact" className="inline-block px-8 py-3.5 bg-indigo-600 text-white font-semibold text-sm rounded-full hover:bg-indigo-700 transition-colors shadow-lg">
                    Book a Free Demo
                </a>
            </section>

        </main>
    );
}
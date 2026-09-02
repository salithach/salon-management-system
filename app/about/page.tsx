export default function AboutPage() {
    const stats = [
        { value: "4,000+", label: "Salons using SalonHQ", icon: "🏢" },
        { value: "2M+",    label: "Appointments managed", icon: "📅" },
        { value: "99.9%",  label: "Platform uptime",      icon: "⚡" },
        { value: "4.9 ★",  label: "Average rating",       icon: "⭐" },
    ];

    const pillars = [
        {
            label: "Scheduling",
            icon: "📅",
            title: "Built around the calendar",
            body: "Real-time booking, automated reminders, and zero double-bookings — so your team focuses on clients, not admin.",
            gradient: "from-blue-500 to-indigo-500",
        },
        {
            label: "Staff",
            icon: "👥",
            title: "Your whole team, one place",
            body: "Rosters, commission tracking, daily jobs, and performance reports — all unified under one clean dashboard.",
            gradient: "from-blue-500 to-sky-500",
        },
        {
            label: "Analytics",
            icon: "📊",
            title: "Data that drives decisions",
            body: "Revenue by service, staff, and period. Retention insights and trend reports that actually help you grow.",
            gradient: "from-indigo-500 to-blue-400",
        },
    ];

    const team = [
        { name: "Alex Rivera",   role: "CEO & Co-founder",  initial: "A", gradient: "from-blue-600 to-indigo-600" },
        { name: "Priya Nair",    role: "Head of Product",    initial: "P", gradient: "from-blue-600 to-sky-600"   },
        { name: "James Cho",     role: "Lead Engineer",      initial: "J", gradient: "from-indigo-600 to-blue-600"  },
        { name: "Sofia Martins", role: "Customer Success",   initial: "S", gradient: "from-rose-500 to-orange-500"     },
    ];

    return (
        <main className="bg-slate-950 text-slate-100 min-h-screen">

            {/* ── Hero ── */}
            <section className="relative overflow-hidden bg-linear-to-br from-slate-950 via-blue-950/40 to-slate-950 px-6 py-32 text-center">
                {/* Glow orbs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-112.5 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-100 h-75 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative max-w-3xl mx-auto">
                    <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-300 bg-blue-500/10 border border-blue-500/25 px-4 py-1.5 rounded-full mb-7">
                        Est. 2020 · Salon Software
                    </span>
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] text-white mb-7">
                        Built for salons,{" "}
                        <span className="bg-linear-to-r from-blue-300 via-indigo-300 to-sky-300 bg-clip-text text-transparent">
                            by people who get it.
                        </span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed mb-10">
                        SalonHQ is the all-in-one platform that replaces the spreadsheets,
                        missed calls, and disconnected tools — for good.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <a href="/pricing"
                           className="px-7 py-3.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-full transition-all shadow-lg shadow-blue-950/50 hover:-translate-y-0.5">
                            View Plans
                        </a>
                        <a href="/contact"
                           className="px-7 py-3.5 border border-white/20 text-slate-350 hover:text-white text-sm font-semibold rounded-full hover:border-white/40 backdrop-blur-sm transition-all hover:-translate-y-0.5">
                            Book a Demo
                        </a>
                    </div>
                </div>
            </section>

            {/* ── Stats ── */}
            <section className="bg-linear-to-r from-blue-950/60 via-slate-900 to-blue-950/60 border-y border-white/5 px-6 py-16">
                <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((s) => (
                        <div key={s.label} className="group">
                            <p className="text-3xl mb-1">{s.icon}</p>
                            <p className="text-3xl font-bold tracking-tight text-blue-400">{s.value}</p>
                            <p className="text-slate-400 text-sm mt-1.5">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Story ── */}
            <section className="max-w-6xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-16 items-center bg-slate-950">
                <div>
                    <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-300 bg-blue-500/10 border border-blue-400/20 px-4 py-1.5 rounded-full mb-6">
                        Our Story
                    </span>
                    <h2 className="text-4xl font-bold tracking-tight leading-tight text-white mb-7">
                        We saw the chaos.{" "}
                        <span className="bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                            We built the fix.
                        </span>
                    </h2>
                    <p className="text-slate-400 leading-relaxed mb-5 text-[15px]">
                        SalonHQ started when our founders — former salon owners — got tired of
                        juggling three apps, a paper book, and a group chat just to run one shift.
                        They set out to build the software they always wished existed.
                    </p>
                    <p className="text-slate-400 leading-relaxed text-[15px]">
                        Today, thousands of salons trust SalonHQ for scheduling, staff management,
                        client records, and real-time revenue insight — from one clean dashboard.
                    </p>
                </div>

                {/* Mock dashboard card */}
                <div className="relative">
                    <div className="absolute -inset-4 bg-linear-to-br from-blue-500/10 to-indigo-500/10 rounded-3xl blur-2xl" />
                    <div className="relative bg-white/5 border border-white/10 rounded-2xl p-7 shadow-xl shadow-black/20 space-y-3">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Today&apos;s Overview</p>
                            <span className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold bg-indigo-950/50 border border-indigo-500/20 px-2.5 py-1 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" /> Live
                            </span>
                        </div>
                        {[
                            { icon: "📅", label: "Appointments",  value: "42 booked",   color: "bg-blue-500/10 border-blue-400/20" },
                            { icon: "👤", label: "New clients",   value: "3 today",     color: "bg-sky-500/10 border-sky-400/20" },
                            { icon: "💳", label: "Revenue",       value: "$2,840",      color: "bg-indigo-500/10 border-indigo-400/20" },
                            { icon: "⭐", label: "Reviews",       value: "4 × 5-star",  color: "bg-amber-500/10 border-amber-400/20"   },
                        ].map((row) => (
                            <div key={row.label} className={`flex items-center justify-between ${row.color} border rounded-xl px-4 py-3`}>
                                <div className="flex items-center gap-2.5 text-sm text-slate-300">
                                    <span>{row.icon}</span>
                                    <span className="font-medium">{row.label}</span>
                                </div>
                                <span className="text-sm font-bold text-white">{row.value}</span>
                            </div>
                        ))}
                    </div>
                    <div className="absolute -top-3 -right-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg shadow-blue-950/50 font-sans">
                        Live Dashboard
                    </div>
                </div>
            </section>

            {/* ── Pillars ── */}
            <section className="py-28 px-6 bg-linear-to-b from-slate-900 to-slate-950">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-300 bg-blue-500/10 border border-blue-400/20 px-4 py-1.5 rounded-full mb-5">
                            Why SalonHQ
                        </span>
                        <h2 className="text-4xl font-bold tracking-tight text-white">
                            What we{" "}
                            <span className="bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                                get right
                            </span>
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {pillars.map((p) => (
                            <div key={p.title} className="group bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-blue-500/30 hover:bg-white/10 hover:shadow-xl hover:shadow-blue-950/40 transition-all hover:-translate-y-1">
                                <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${p.gradient} flex items-center justify-center text-xl mb-6 shadow-lg`}>
                                    {p.icon}
                                </div>
                                <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">
                                    {p.label}
                                </span>
                                <h3 className="text-lg font-bold text-white mb-2.5">{p.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{p.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Team ── */}
            <section className="max-w-6xl mx-auto px-6 py-28 bg-slate-950">
                <div className="text-center mb-16">
                        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-300 bg-blue-500/10 border border-blue-400/20 px-4 py-1.5 rounded-full mb-5">
                        The Team
                    </span>
                    <h2 className="text-4xl font-bold tracking-tight text-white">
                        People behind the{" "}
                        <span className="bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">platform</span>
                    </h2>
                    <p className="text-slate-500 mt-3 max-w-md mx-auto text-sm leading-relaxed">
                        Engineers, designers, and former salon operators who care about getting this right.
                    </p>
                </div>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
                    {team.map((m) => (
                            <div key={m.name} className="group bg-white/5 border border-white/10 rounded-2xl p-7 text-center hover:border-blue-500/30 hover:bg-white/10 hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className={`w-16 h-16 rounded-full bg-linear-to-br ${m.gradient} mx-auto mb-5 flex items-center justify-center text-xl font-bold text-white shadow-lg`}>
                                {m.initial}
                            </div>
                            <p className="font-bold text-white text-sm">{m.name}</p>
                            <p className="text-slate-400 text-xs mt-1">{m.role}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="relative overflow-hidden bg-linear-to-br from-slate-950 via-blue-950/60 to-slate-950 px-6 py-28 text-center border-t border-white/5">
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-175 h-100 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative max-w-2xl mx-auto">
                    <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-200 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-7 font-sans">
                        Get Started
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight text-white">
                        Ready to modernise<br />your salon?
                    </h2>
                    <p className="text-blue-200 max-w-md mx-auto mb-10 text-sm leading-relaxed text-blue-200/80">
                        Join 4,000+ salons already running smarter with SalonHQ. No contracts. Cancel anytime.
                    </p>
                    <a href="/contact"
                       className="inline-flex items-center gap-2 px-9 py-3.5 bg-white text-blue-950 font-bold text-sm rounded-full hover:bg-blue-50 transition-all shadow-xl hover:-translate-y-0.5">
                        Book a Free Demo
                        <span>→</span>
                    </a>
                </div>
            </section>

        </main>
    );
}
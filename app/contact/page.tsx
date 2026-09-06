export default function ContactPage() {
    const info = [
        // { icon: "📍", label: "Headquarters", value: "340 5th Avenue, New York, NY 10001", color: "bg-slate-900/50 border-white/10" },
        { icon: "📞", label: "Sales",         value: "+94 (077) 878-7607",                 color: "bg-slate-900/50 border-white/10" },
        { icon: "✉️", label: "Email",          value: "hello@salonhq.com",                  color: "bg-slate-900/50 border-white/10"    },
        { icon: "🕐", label: "Support Hours",  value: "Mon–Fri 8am–8pm · Sat 9am–5pm IST", color: "bg-slate-900/50 border-white/10" },
    ];

    const trust = [
        { text: "Everything In One Place", icon: "🏠" },
        { text: "Secure & Reliable", icon: "🔐" },
        { text: "Effortless Scheduling", icon: "📅" },
        { text: "Powerful Reports", icon: "📊" },
        { text: "Manage Team Effectively", icon: "👥" },
        { text: "Simplified Tracking", icon: "📈" },
        { text: "Smart Inventory Management", icon: "📦" },
        { text: "Better Client Management", icon: "💇‍♀️" },
        { text: "Built For Busy Salons", icon: "🚀" },
    ];

    return (
        <main className="bg-slate-950 text-slate-100 min-h-screen">

            {/* ── Header ── */}
            <section className="relative overflow-hidden bg-linear-to-br from-slate-950 via-blue-950/40 to-slate-950 px-6 py-28 text-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-175 h-100 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-87.5 h-62.5 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative max-w-2xl mx-auto">
                    <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-300 bg-blue-500/10 border border-blue-500/25 px-4 py-1.5 rounded-full mb-7">
                        Contact
                    </span>
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] text-white mb-6">
                        Let&apos;s{" "}
                        <span className="bg-linear-to-r from-blue-300 via-indigo-300 to-sky-300 bg-clip-text text-transparent">
                            talk.
                        </span>
                    </h1>
                    <p className="text-slate-400 max-w-md mx-auto text-lg leading-relaxed">
                        Want a demo, have a question, or need help picking a plan? We respond within one business day.
                    </p>
                </div>
            </section>

            {/* ── Body ── */}
            <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-5 gap-10">

                {/* Left — info */}
                <aside className="md:col-span-2 space-y-6">
                    <div className="space-y-4">
                        {info.map((i) => (
                            <div key={i.label} className={`flex gap-4 ${i.color} border rounded-2xl px-4 py-4 items-start hover:border-blue-500/20 transition-all group`}>
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg shrink-0 shadow-sm group-hover:border-blue-500/30 group-hover:bg-blue-500/5 transition-all">
                                    {i.icon}
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-0.5">{i.label}</p>
                                    <p className="text-slate-300 text-sm font-medium">{i.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <hr className="border-white/10" />
                    <div className="bg-linear-to-br from-slate-950 to-blue-950/65 rounded-2xl p-6 border border-white/10">
                        <p className="text-xs font-bold uppercase tracking-widest text-blue-300 mb-5">Why teams trust us</p>
                        <div className="space-y-3">
                            {trust.map((t) => (
                                <div key={t.text} className="flex items-center gap-3 text-sm text-slate-300">
                                    <span className="text-base shrink-0">{t.icon}</span>
                                    {t.text}
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Right — form */}
                <div className="md:col-span-3">
                    <div className="relative">
                        <div className="absolute -inset-1 bg-linear-to-br from-blue-500/10 to-indigo-500/10 rounded-3xl blur-2xl pointer-events-none" />
                        <div className="relative bg-slate-900/50 border border-white/10 rounded-2xl p-8 md:p-10 shadow-xl backdrop-blur-sm">
                            <h2 className="text-2xl font-bold text-white mb-1.5">Request a free demo</h2>
                            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                                Tell us about your salon and we&apos;ll set up a personalised walkthrough within one business day.
                            </p>

                            <form className="space-y-5">
                                <div className="grid sm:grid-cols-2 gap-5">
                                    {[
                                        { label: "First Name", type: "text",  placeholder: "Jane" },
                                        { label: "Last Name",  type: "text",  placeholder: "Doe"  },
                                    ].map((f) => (
                                        <div key={f.label}>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">{f.label}</label>
                                            <input type={f.type} placeholder={f.placeholder}
                                                   className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-650 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 transition-all bg-white/5 hover:border-white/20" />
                                        </div>
                                    ))}
                                </div>

                                {[
                                    { label: "Work Email",  type: "email", placeholder: "jane@yoursalon.com" },
                                    { label: "Salon Name",  type: "text",  placeholder: "Luxe Hair Studio"   },
                                ].map((f) => (
                                    <div key={f.label}>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">{f.label}</label>
                                        <input type={f.type} placeholder={f.placeholder}
                                               className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-650 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 transition-all bg-white/5 hover:border-white/20" />
                                    </div>
                                ))}

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">What are you looking for?</label>
                                    <textarea rows={4} placeholder="Scheduling, staff management, reporting…"
                                              className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-650 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 transition-all resize-none bg-white/5 hover:border-white/20" />
                                </div>

                                <button type="submit"
                                        className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all text-sm shadow-lg shadow-blue-950/50 hover:-translate-y-0.5">
                                    Book My Free Demo →
                                </button>

                                <p className="text-center text-slate-400 text-xs">
                                    No credit card required · Cancel anytime · Setup in minutes
                                </p>
                            </form>
                        </div>
                    </div>
                </div>

            </section>

        </main>
    );
}
export default function ContactPage() {
    const info = [
        { icon: "📍", label: "Headquarters", value: "340 5th Avenue, New York, NY 10001", color: "bg-violet-50 border-violet-100" },
        { icon: "📞", label: "Sales",         value: "+1 (800) 555-0190",                 color: "bg-indigo-50 border-indigo-100" },
        { icon: "✉️", label: "Email",          value: "hello@salonhq.com",                  color: "bg-blue-50 border-blue-100"    },
        { icon: "🕐", label: "Support Hours",  value: "Mon–Fri 8am–8pm · Sat 9am–5pm EST", color: "bg-emerald-50 border-emerald-100" },
    ];

    const trust = [
        { text: "4,000+ salons worldwide",    icon: "🌐" },
        { text: "SOC 2 Type II Certified",    icon: "🔐" },
        { text: "GDPR Compliant",             icon: "✅" },
        { text: "99.9% uptime SLA",           icon: "⚡" },
    ];

    return (
        <main className="bg-white text-slate-900 min-h-screen">

            {/* ── Header ── */}
            <section className="relative overflow-hidden bg-linear-to-br from-slate-950 via-indigo-950 to-violet-950 px-6 py-28 text-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-175 h-100 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-87.5 h-62.5 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative max-w-2xl mx-auto">
                    <span className="inline-block text-xs font-semibold uppercase tracking-widest text-indigo-300 bg-indigo-500/10 border border-indigo-500/25 px-4 py-1.5 rounded-full mb-7">
                        Contact
                    </span>
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] text-white mb-6">
                        Let&apos;s{" "}
                        <span className="bg-linear-to-r from-violet-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
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
                <aside className="md:col-span-2 space-y-7">
                    <div className="space-y-4">
                        {info.map((i) => (
                            <div key={i.label} className={`flex gap-4 ${i.color} border rounded-2xl px-4 py-4 items-start`}>
                                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-lg shrink-0 shadow-sm">
                                    {i.icon}
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-0.5">{i.label}</p>
                                    <p className="text-slate-700 text-sm font-medium">{i.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border border-slate-200 rounded-2xl overflow-hidden">
                        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3">
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Quick Links</p>
                        </div>
                        {[
                            { label: "Documentation & Guides", href: "#", icon: "📖" },
                            { label: "Live Chat Support",       href: "#", icon: "💬" },
                            { label: "Schedule a Demo Call",    href: "#", icon: "📅" },
                        ].map((l) => (
                            <a key={l.label} href={l.href}
                               className="flex items-center justify-between text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all px-5 py-3.5 border-b border-slate-100 last:border-0 group">
                                <div className="flex items-center gap-2.5">
                                    <span>{l.icon}</span>
                                    <span>{l.label}</span>
                                </div>
                                <span className="text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all">→</span>
                            </a>
                        ))}
                    </div>

                    <div className="bg-linear-to-br from-slate-950 to-indigo-950 rounded-2xl p-6 border border-white/10">
                        <p className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-5">Why teams trust us</p>
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
                        <div className="absolute -inset-1 bg-linear-to-br from-violet-500/20 to-indigo-500/20 rounded-3xl blur-2xl" />
                        <div className="relative bg-white border border-slate-200 rounded-2xl p-8 md:p-10 shadow-xl">
                            <h2 className="text-2xl font-bold text-slate-900 mb-1.5">Request a free demo</h2>
                            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                                Tell us about your salon and we&apos;ll set up a personalised walkthrough within one business day.
                            </p>

                            <form className="space-y-5">
                                <div className="grid sm:grid-cols-2 gap-5">
                                    {[
                                        { label: "First Name", type: "text",  placeholder: "Jane" },
                                        { label: "Last Name",  type: "text",  placeholder: "Doe"  },
                                    ].map((f) => (
                                        <div key={f.label}>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{f.label}</label>
                                            <input type={f.type} placeholder={f.placeholder}
                                                   className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all bg-slate-50/50 hover:border-slate-300" />
                                        </div>
                                    ))}
                                </div>

                                {[
                                    { label: "Work Email",  type: "email", placeholder: "jane@yoursalon.com" },
                                    { label: "Salon Name",  type: "text",  placeholder: "Luxe Hair Studio"   },
                                ].map((f) => (
                                    <div key={f.label}>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{f.label}</label>
                                        <input type={f.type} placeholder={f.placeholder}
                                               className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all bg-slate-50/50 hover:border-slate-300" />
                                    </div>
                                ))}

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Number of Locations</label>
                                    <select className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all appearance-none bg-slate-50/50 hover:border-slate-300">
                                        <option value="">Select…</option>
                                        <option>1 location</option>
                                        <option>2 – 5 locations</option>
                                        <option>6 – 20 locations</option>
                                        <option>20+ locations</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">What are you looking for?</label>
                                    <textarea rows={4} placeholder="Scheduling, staff management, reporting…"
                                              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none bg-slate-50/50 hover:border-slate-300" />
                                </div>

                                <button type="submit"
                                        className="w-full bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all text-sm shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5">
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
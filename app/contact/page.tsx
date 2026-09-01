export default function ContactPage() {
    const info = [
        { icon: "📍", label: "Headquarters", value: "340 5th Avenue, New York, NY 10001", color: "bg-slate-900/50 border-white/10" },
        { icon: "📞", label: "Sales",         value: "+1 (800) 555-0190",                 color: "bg-slate-900/50 border-white/10" },
        { icon: "✉️", label: "Email",          value: "hello@salonhq.com",                  color: "bg-slate-900/50 border-white/10"    },
        { icon: "🕐", label: "Support Hours",  value: "Mon–Fri 8am–8pm · Sat 9am–5pm EST", color: "bg-slate-900/50 border-white/10" },
    ];

    const trust = [
        { text: "4,000+ salons worldwide",    icon: "🌐" },
        { text: "SOC 2 Type II Certified",    icon: "🔐" },
        { text: "GDPR Compliant",             icon: "✅" },
        { text: "99.9% uptime SLA",           icon: "⚡" },
    ];

    return (
        <main className="bg-slate-950 text-slate-100 min-h-screen">

            {/* ── Header ── */}
            <section className="relative overflow-hidden bg-linear-to-br from-slate-950 via-teal-950/40 to-slate-950 px-6 py-28 text-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-175 h-100 bg-teal-600/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-87.5 h-62.5 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative max-w-2xl mx-auto">
                    <span className="inline-block text-xs font-semibold uppercase tracking-widest text-teal-300 bg-teal-500/10 border border-teal-500/25 px-4 py-1.5 rounded-full mb-7">
                        Contact
                    </span>
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] text-white mb-6">
                        Let&apos;s{" "}
                        <span className="bg-linear-to-r from-teal-300 via-emerald-300 to-cyan-350 bg-clip-text text-transparent">
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
                            <div key={i.label} className={`flex gap-4 ${i.color} border rounded-2xl px-4 py-4 items-start hover:border-teal-500/20 transition-all group`}>
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg shrink-0 shadow-sm group-hover:border-teal-500/30 group-hover:bg-teal-500/5 transition-all">
                                    {i.icon}
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-0.5">{i.label}</p>
                                    <p className="text-slate-300 text-sm font-medium">{i.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border border-white/10 rounded-2xl overflow-hidden">
                        <div className="bg-white/5 border-b border-white/10 px-5 py-3">
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Quick Links</p>
                        </div>
                        {[
                            { label: "Documentation & Guides", href: "#", icon: "📖" },
                            { label: "Live Chat Support",       href: "#", icon: "💬" },
                            { label: "Schedule a Demo Call",    href: "#", icon: "📅" },
                        ].map((l) => (
                            <a key={l.label} href={l.href}
                               className="flex items-center justify-between text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all px-5 py-3.5 border-b border-white/5 last:border-0 group">
                                <div className="flex items-center gap-2.5">
                                    <span>{l.icon}</span>
                                    <span>{l.label}</span>
                                </div>
                                <span className="text-slate-600 group-hover:text-teal-400 group-hover:translate-x-1 transition-all">→</span>
                            </a>
                        ))}
                    </div>

                    <div className="bg-linear-to-br from-slate-950 to-teal-950/65 rounded-2xl p-6 border border-white/10">
                        <p className="text-xs font-bold uppercase tracking-widest text-teal-300 mb-5">Why teams trust us</p>
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
                        <div className="absolute -inset-1 bg-linear-to-br from-teal-500/10 to-emerald-500/10 rounded-3xl blur-2xl pointer-events-none" />
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
                                                   className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-650 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/25 transition-all bg-white/5 hover:border-white/20" />
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
                                               className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-650 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/25 transition-all bg-white/5 hover:border-white/20" />
                                    </div>
                                ))}

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Number of Locations</label>
                                    <div className="relative">
                                        <select className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/25 transition-all appearance-none bg-white/5 hover:border-white/20">
                                            <option value="" className="bg-slate-900 text-slate-300">Select…</option>
                                            <option className="bg-slate-900 text-slate-300">1 location</option>
                                            <option className="bg-slate-900 text-slate-300">2 – 5 locations</option>
                                            <option className="bg-slate-900 text-slate-300">6 – 20 locations</option>
                                            <option className="bg-slate-900 text-slate-300">20+ locations</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">What are you looking for?</label>
                                    <textarea rows={4} placeholder="Scheduling, staff management, reporting…"
                                              className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-650 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/25 transition-all resize-none bg-white/5 hover:border-white/20" />
                                </div>

                                <button type="submit"
                                        className="w-full bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold py-3.5 rounded-xl transition-all text-sm shadow-lg shadow-teal-950/50 hover:-translate-y-0.5">
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
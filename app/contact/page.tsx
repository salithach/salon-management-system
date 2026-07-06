export default function ContactPage() {
    const info = [
        { icon: "📍", label: "Headquarters", value: "340 5th Avenue, New York, NY 10001" },
        { icon: "📞", label: "Sales",         value: "+1 (800) 555-0190" },
        { icon: "✉️", label: "Email",          value: "hello@salonhq.com" },
        { icon: "🕐", label: "Support Hours",  value: "Mon–Fri 8am–8pm · Sat 9am–5pm EST" },
    ];

    const trust = ["4,000+ salons worldwide", "SOC 2 Type II Certified", "GDPR Compliant", "99.9% uptime SLA"];

    return (
        <main className="bg-[#f8fafc] text-slate-900 min-h-screen">

            {/* ── Header ── */}
            <section className="bg-white border-b border-slate-200 px-6 py-20 text-center">
                <span className="inline-block text-xs font-semibold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full mb-5">
                    Contact
                </span>
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] text-slate-900 mb-5">
                    Let&apos;s talk.
                </h1>
                <p className="text-slate-500 max-w-md mx-auto text-lg">
                    Want a demo, have a question, or need help picking a plan? We respond within one business day.
                </p>
            </section>

            {/* ── Body ── */}
            <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-5 gap-10">

                {/* Left — info */}
                <aside className="md:col-span-2 space-y-8">
                    <div className="space-y-5">
                        {info.map((i) => (
                            <div key={i.label} className="flex gap-4">
                                <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-lg shrink-0">
                                    {i.icon}
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-0.5">{i.label}</p>
                                    <p className="text-slate-700 text-sm">{i.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-slate-200 pt-6">
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Quick Links</p>
                        {[
                            { label: "Documentation & Guides", href: "#" },
                            { label: "Live Chat Support",       href: "#" },
                            { label: "Schedule a Demo Call",    href: "#" },
                        ].map((l) => (
                            <a key={l.label} href={l.href}
                               className="flex items-center justify-between text-sm text-slate-500 hover:text-indigo-600 transition-colors py-2 border-b border-slate-100 last:border-0">
                                <span>{l.label}</span>
                                <span className="text-slate-300">→</span>
                            </a>
                        ))}
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Why teams trust us</p>
                        <div className="space-y-2.5">
                            {trust.map((t) => (
                                <div key={t} className="flex items-center gap-2.5 text-sm text-slate-600">
                                    <span className="w-4 h-4 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 text-xs shrink-0">✓</span>
                                    {t}
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Right — form */}
                <div className="md:col-span-3 bg-white border border-slate-200 rounded-2xl p-8 md:p-10 shadow-sm">
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">Request a free demo</h2>
                    <p className="text-slate-500 text-sm mb-8">
                        Tell us about your salon and we&apos;ll set up a personalised walkthrough within one business day.
                    </p>

                    <form className="space-y-5">
                        <div className="grid sm:grid-cols-2 gap-5">
                            {[
                                { label: "First Name", type: "text",  placeholder: "Jane" },
                                { label: "Last Name",  type: "text",  placeholder: "Doe" },
                            ].map((f) => (
                                <div key={f.label}>
                                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">{f.label}</label>
                                    <input type={f.type} placeholder={f.placeholder}
                                           className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all" />
                                </div>
                            ))}
                        </div>

                        {[
                            { label: "Work Email",  type: "email", placeholder: "jane@yoursalon.com" },
                            { label: "Salon Name",  type: "text",  placeholder: "Luxe Hair Studio" },
                        ].map((f) => (
                            <div key={f.label}>
                                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">{f.label}</label>
                                <input type={f.type} placeholder={f.placeholder}
                                       className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all" />
                            </div>
                        ))}

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Number of Locations</label>
                            <select className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all appearance-none bg-white">
                                <option value="">Select…</option>
                                <option>1 location</option>
                                <option>2 – 5 locations</option>
                                <option>6 – 20 locations</option>
                                <option>20+ locations</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">What are you looking for?</label>
                            <textarea rows={4} placeholder="Scheduling, staff management, reporting…"
                                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all resize-none" />
                        </div>

                        <button type="submit"
                                className="w-full bg-indigo-600 text-white font-semibold py-3.5 rounded-xl hover:bg-indigo-700 transition-colors text-sm shadow-sm">
                            Book My Free Demo
                        </button>

                        <p className="text-center text-slate-400 text-xs">
                            No credit card required · Cancel anytime · Setup in minutes
                        </p>
                    </form>
                </div>

            </section>

        </main>
    );
}
export default function PricingPage() {
    const plans = [
        {
            name: "Starter",
            tag: "For independent salons",
            price: "3000 LKR",
            period: "/mo",
            note: "Save 20% with annual billing",
            features: [
                "Up to 5 staff members",
                "Manage daily assignments",
                "Basic reporting",
                "Real time notifications",
            ],
            highlight: false,
            cta: "Start free trial",
            iconBg: "from-white/5 to-white/10",
            icon: "🚀",
        },
        {
            name: "Pro",
            tag: "For growing businesses",
            price: "4000 LKR",
            period: "/mo",
            note: "Save 20% with annual billing",
            features: [
                "Up to 10 staff members",
                "Manage daily assignments",
                "Appointment scheduling",
                "Advanced reporting",
                "Real time notifications",
            ],
            highlight: true,
            cta: "Start free trial",
            iconBg: "from-blue-500 to-indigo-500",
            icon: "⚡",
        },
        {
            name: "Premium",
            tag: "For salon groups & chains",
            price: "5000 LKR",
            period: "/mo",
            note: "Talk to our sales team",
            features: [
                "Unlimited staff",
                "Manage daily assignments",
                "Appointment scheduling",
                "Revenue & pay analytics",
                "Client management",
                "Inventory management",
                "Real time notifications",
            ],
            highlight: false,
            cta: "Contact sales",
            iconBg: "from-white/5 to-white/10",
            icon: "🏢",
        },
    ];

    return (
        <main className="bg-slate-950 text-slate-100 min-h-screen">

            {/* ── Hero ── */}
            <section className="relative overflow-hidden bg-linear-to-br from-slate-950 via-blue-950/40 to-slate-950 px-6 py-28 text-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-175 h-100 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-100 h-75 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative max-w-2xl mx-auto">
                    <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-300 bg-blue-500/10 border border-blue-500/25 px-4 py-1.5 rounded-full mb-7">
                        Pricing
                    </span>
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] text-white mb-6">
                        Simple,{" "}
                        <span className="bg-linear-to-r from-blue-300 via-indigo-300 to-sky-300 bg-clip-text text-transparent">
                            transparent
                        </span>{" "}
                        pricing.
                    </h1>
                    <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
                        No hidden fees. No long-term contracts. Start free for 14 days — upgrade or cancel anytime.
                    </p>
                </div>
            </section>

            {/* ── Plans ── */}
            <section className="max-w-6xl mx-auto px-6 py-20">
                <div className="grid md:grid-cols-3 gap-6 items-stretch">
                    {plans.map((plan) => (
                        <div key={plan.name}
                             className={`relative flex flex-col rounded-2xl border transition-all ${
                                 plan.highlight
                                     ? "bg-linear-to-br from-blue-950 via-slate-900 to-blue-900/80 border-blue-500/80 shadow-2xl shadow-blue-500/15"
                                     : "bg-slate-900/50 border-white/10 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1"
                             }`}>
                            {plan.highlight && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-amber-400 to-orange-400 text-slate-900 text-xs font-black px-5 py-1.5 rounded-full shadow-lg tracking-wide uppercase">
                                    ✨ Most popular
                                </div>
                            )}

                            <div className="p-8 flex flex-col flex-1">
                                <div className="mb-7">
                                    <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${plan.highlight ? "from-white/20 to-white/10" : plan.iconBg} flex items-center justify-center text-xl mb-4 ${plan.highlight ? "" : "border border-white/10"}`}>
                                        {plan.icon}
                                    </div>
                                    <p className={`text-xs font-bold uppercase tracking-widest mb-1.5 ${plan.highlight ? "text-blue-300" : "text-slate-500"}`}>
                                        {plan.tag}
                                    </p>
                                    <h2 className={`text-2xl font-bold ${plan.highlight ? "text-white" : "text-white"}`}>{plan.name}</h2>
                                </div>

                                <div className={`pb-7 mb-7 border-b ${plan.highlight ? "border-white/20" : "border-white/10"}`}>
                                    <p className={`text-4xl font-bold tracking-tight ${plan.highlight ? "text-white" : "text-white"}`}>
                                        {plan.price}
                                        <span className={`text-base font-normal ml-1 ${plan.highlight ? "text-blue-300" : "text-slate-500"}`}>{plan.period}</span>
                                    </p>
                                    <p className={`text-xs mt-2 ${plan.highlight ? "text-blue-300" : "text-slate-500"}`}>{plan.note}</p>
                                </div>

                                <ul className="space-y-3 flex-1 mb-8">
                                    {plan.features.map((f) => (
                                        <li key={f} className={`flex items-start gap-2.5 text-sm ${plan.highlight ? "text-blue-100" : "text-slate-300"}`}>
                                            <span className={`mt-0.5 shrink-0 font-black text-xs ${plan.highlight ? "text-blue-400" : "text-blue-400"}`}>✓</span>
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                <a href="/contact"
                                   className={`block text-center py-3.5 rounded-xl text-sm font-bold transition-all ${
                                       plan.highlight
                                           ? "bg-white text-blue-950 hover:bg-blue-50 shadow-lg hover:-translate-y-0.5"
                                           : "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/10 hover:-translate-y-0.5"
                                   }`}>
                                    {plan.cta} →
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="relative overflow-hidden bg-linear-to-br from-slate-950 via-blue-950/60 to-slate-950 px-6 py-28 text-center border-t border-white/5">
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-175 h-100 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 right-0 w-125 h-100 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative max-w-2xl mx-auto">
                    <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-200 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full mb-7">
                        Start today
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight text-white">
                        Run your salon smarter.
                    </h2>
                    <p className="text-blue-200/80 max-w-md mx-auto mb-10 text-sm leading-relaxed">
                        Join with SalonHQ. Make your lives easier. Setup takes under 10 minutes.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        <a href="/contact"
                           className="px-8 py-3.5 bg-white text-blue-900 font-bold text-sm rounded-full hover:bg-blue-50 transition-all shadow-xl hover:-translate-y-0.5">
                            Start Free Trial →
                        </a>
                        <a href="/about"
                           className="px-8 py-3.5 border border-white/25 text-blue-200 hover:text-white text-sm font-medium rounded-full hover:border-white/40 backdrop-blur-sm transition-all hover:-translate-y-0.5">
                            Learn More
                        </a>
                    </div>
                </div>
            </section>

        </main>
    );
}
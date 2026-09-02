export default function PricingPage() {
    const plans = [
        {
            name: "Starter",
            tag: "For independent salons",
            price: "$29",
            period: "/mo",
            note: "Save 20% with annual billing",
            features: [
                "1 location",
                "Up to 5 staff members",
                "Online appointment booking",
                "Client management (CRM)",
                "Basic reporting",
                "Email notifications",
            ],
            highlight: false,
            cta: "Start free trial",
            iconBg: "from-white/5 to-white/10",
            icon: "🚀",
        },
        {
            name: "Pro",
            tag: "For growing businesses",
            price: "$79",
            period: "/mo",
            note: "Save 20% with annual billing",
            features: [
                "Up to 3 locations",
                "Unlimited staff",
                "Advanced scheduling & waitlist",
                "Staff commission tracking",
                "Inventory management",
                "Revenue & retention analytics",
                "SMS & email reminders",
                "Priority support",
            ],
            highlight: true,
            cta: "Start free trial",
            iconBg: "from-blue-500 to-indigo-500",
            icon: "⚡",
        },
        {
            name: "Enterprise",
            tag: "For salon groups & chains",
            price: "Custom",
            period: "",
            note: "Talk to our sales team",
            features: [
                "Unlimited locations",
                "Unlimited staff",
                "Multi-location dashboard",
                "Custom roles & permissions",
                "API access & integrations",
                "Dedicated account manager",
                "White-label option",
                "SLA & uptime guarantee",
            ],
            highlight: false,
            cta: "Contact sales",
            iconBg: "from-white/5 to-white/10",
            icon: "🏢",
        },
    ];

    const comparison = [
        { feature: "Online Booking",     starter: true,  pro: true,  enterprise: true  },
        { feature: "Staff Management",   starter: true,  pro: true,  enterprise: true  },
        { feature: "Client CRM",         starter: true,  pro: true,  enterprise: true  },
        { feature: "Inventory Tracking", starter: false, pro: true,  enterprise: true  },
        { feature: "Commission Reports", starter: false, pro: true,  enterprise: true  },
        { feature: "Multi-location",     starter: false, pro: true,  enterprise: true  },
        { feature: "API Access",         starter: false, pro: false, enterprise: true  },
        { feature: "White-label",        starter: false, pro: false, enterprise: true  },
    ];

    const faqs = [
        { q: "Is there a free trial?",        a: "Yes — every plan starts with a 14-day free trial. No credit card required." },
        { q: "Can I switch plans later?",     a: "Absolutely. Upgrade or downgrade any time from your dashboard, effective immediately." },
        { q: "What counts as a location?",   a: "Any individual salon branch or physical address. Each location gets its own calendar, staff list, and reports." },
        { q: "Do you offer onboarding help?", a: "Pro and Enterprise plans include an onboarding session and data migration assistance." },
        { q: "Is my data secure?",            a: "SalonHQ is SOC 2 Type II certified and GDPR compliant. Data is encrypted at rest and in transit." },
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
                                    <p className={`text-5xl font-bold tracking-tight ${plan.highlight ? "text-white" : "text-white"}`}>
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
                <p className="text-center text-slate-400 text-xs mt-6">
                    All plans include a 14-day free trial · No credit card required
                </p>
            </section>

            {/* ── Comparison ── */}
            <section className="bg-linear-to-b from-slate-900 to-slate-950 py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-300 bg-blue-500/10 border border-blue-500/25 px-4 py-1.5 rounded-full mb-5">
                            Compare
                        </span>
                        <h2 className="text-3xl font-bold tracking-tight text-white">
                            Feature{" "}
                            <span className="bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">breakdown</span>
                        </h2>
                    </div>
                    <div className="border border-white/10 rounded-2xl overflow-hidden shadow-sm">
                        <div className="grid grid-cols-4 bg-linear-to-r from-slate-900 to-blue-950/70 px-6 py-4">
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Feature</p>
                            {["Starter", "Pro", "Enterprise"].map((h) => (
                                <p key={h} className="text-center text-xs font-bold uppercase tracking-widest text-slate-300">{h}</p>
                            ))}
                        </div>
                        {comparison.map((row, i) => (
                            <div key={row.feature} className={`grid grid-cols-4 px-6 py-4 border-b border-white/5 last:border-0 ${i % 2 !== 0 ? "bg-white/5" : "bg-slate-950/20"}`}>
                                <p className="text-sm font-medium text-slate-300">{row.feature}</p>
                                <p className="text-center text-sm">{row.starter    ? <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/10 text-blue-300 border border-blue-400/25 text-xs font-black">✓</span> : <span className="text-slate-600 font-bold">–</span>}</p>
                                <p className="text-center text-sm">{row.pro        ? <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-400/25 text-xs font-black">✓</span> : <span className="text-slate-600 font-bold">–</span>}</p>
                                <p className="text-center text-sm">{row.enterprise ? <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-sky-500/10 text-sky-300 border border-sky-400/25 text-xs font-black">✓</span> : <span className="text-slate-600 font-bold">–</span>}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section className="max-w-3xl mx-auto px-6 py-24">
                <div className="text-center mb-14">
                    <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-300 bg-blue-500/10 border border-blue-500/25 px-4 py-1.5 rounded-full mb-5">
                        FAQ
                    </span>
                    <h2 className="text-3xl font-bold tracking-tight text-white">
                        Common{" "}
                        <span className="bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">questions</span>
                    </h2>
                </div>
                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <div key={faq.q} className="group bg-slate-900/50 border border-white/10 rounded-2xl px-7 py-6 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/5 transition-all hover:-translate-y-0.5">
                            <div className="flex items-start gap-4">
                                <div className="w-7 h-7 rounded-lg bg-linear-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-black shrink-0 mt-0.5">
                                    {i + 1}
                                </div>
                                <div>
                                    <p className="font-bold text-white mb-2">{faq.q}</p>
                                    <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                                </div>
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
                        Join 4,000+ salons who&apos;ve switched to SalonHQ. Setup takes under 10 minutes.
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
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
        <main className="bg-[#f8fafc] text-slate-900 min-h-screen">

            {/* ── Hero ── */}
            <section className="bg-white border-b border-slate-200 px-6 py-24 text-center">
                <span className="inline-block text-xs font-semibold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full mb-5">
                    Pricing
                </span>
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] text-slate-900 mb-5">
                    Simple, transparent pricing.
                </h1>
                <p className="text-slate-500 text-lg max-w-xl mx-auto">
                    No hidden fees. No long-term contracts. Start free for 14 days — upgrade or cancel anytime.
                </p>
            </section>

            {/* ── Plans ── */}
            <section className="max-w-6xl mx-auto px-6 py-16">
                <div className="grid md:grid-cols-3 gap-5 items-stretch">
                    {plans.map((plan) => (
                        <div key={plan.name}
                             className={`relative flex flex-col rounded-2xl p-8 border transition-all ${
                                 plan.highlight
                                     ? "bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-200"
                                     : "bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md"
                             }`}>
                            {plan.highlight && (
                                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white text-indigo-600 text-xs font-bold px-4 py-1.5 rounded-full border border-indigo-200 shadow-sm">
                                    Most popular
                                </div>
                            )}

                            <div className="mb-6">
                                <p className={`text-xs font-semibold uppercase tracking-widest mb-2 ${plan.highlight ? "text-indigo-200" : "text-slate-400"}`}>
                                    {plan.tag}
                                </p>
                                <h2 className="text-2xl font-bold">{plan.name}</h2>
                            </div>

                            <div className={`pb-6 mb-6 border-b ${plan.highlight ? "border-indigo-500" : "border-slate-100"}`}>
                                <p className="text-5xl font-bold tracking-tight">
                                    {plan.price}
                                    <span className={`text-base font-normal ml-1 ${plan.highlight ? "text-indigo-200" : "text-slate-400"}`}>{plan.period}</span>
                                </p>
                                <p className={`text-xs mt-2 ${plan.highlight ? "text-indigo-200" : "text-slate-400"}`}>{plan.note}</p>
                            </div>

                            <ul className="space-y-2.5 flex-1 mb-8">
                                {plan.features.map((f) => (
                                    <li key={f} className={`flex items-start gap-2.5 text-sm ${plan.highlight ? "text-indigo-100" : "text-slate-600"}`}>
                                        <span className={`mt-0.5 shrink-0 font-bold text-xs ${plan.highlight ? "text-indigo-200" : "text-indigo-500"}`}>✓</span>
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <a href="/contact"
                               className={`block text-center py-3 rounded-xl text-sm font-semibold transition-colors ${
                                   plan.highlight
                                       ? "bg-white text-indigo-600 hover:bg-indigo-50"
                                       : "border border-slate-300 text-slate-700 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50"
                               }`}>
                                {plan.cta}
                            </a>
                        </div>
                    ))}
                </div>
                <p className="text-center text-slate-400 text-xs mt-5">
                    All plans include a 14-day free trial · No credit card required
                </p>
            </section>

            {/* ── Comparison ── */}
            <section className="bg-white border-y border-slate-200 py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full mb-4">
                            Compare
                        </span>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Feature breakdown</h2>
                    </div>
                    <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="grid grid-cols-4 bg-slate-50 border-b border-slate-200 px-6 py-4">
                            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Feature</p>
                            {["Starter", "Pro", "Enterprise"].map((h) => (
                                <p key={h} className="text-center text-xs font-semibold uppercase tracking-widest text-slate-500">{h}</p>
                            ))}
                        </div>
                        {comparison.map((row, i) => (
                            <div key={row.feature} className={`grid grid-cols-4 px-6 py-4 ${i % 2 !== 0 ? "bg-slate-50/40" : "bg-white"}`}>
                                <p className="text-sm text-slate-700">{row.feature}</p>
                                <p className="text-center text-sm">{row.starter ? <span className="text-indigo-500 font-bold">✓</span> : <span className="text-slate-300">–</span>}</p>
                                <p className="text-center text-sm">{row.pro     ? <span className="text-indigo-500 font-bold">✓</span> : <span className="text-slate-300">–</span>}</p>
                                <p className="text-center text-sm">{row.enterprise ? <span className="text-indigo-500 font-bold">✓</span> : <span className="text-slate-300">–</span>}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section className="max-w-3xl mx-auto px-6 py-20">
                <div className="text-center mb-12">
                    <span className="inline-block text-xs font-semibold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full mb-4">
                        FAQ
                    </span>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Common questions</h2>
                </div>
                <div className="space-y-3">
                    {faqs.map((faq) => (
                        <div key={faq.q} className="bg-white border border-slate-200 rounded-2xl px-6 py-5 hover:border-indigo-300 transition-colors">
                            <p className="font-semibold text-slate-900 mb-2">{faq.q}</p>
                            <p className="text-slate-500 text-sm leading-relaxed">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="bg-slate-900 text-white px-6 py-24 text-center">
                <span className="inline-block text-xs font-semibold uppercase tracking-widest text-indigo-400 bg-indigo-950 px-3 py-1.5 rounded-full mb-6">
                    Start today
                </span>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5 leading-tight">
                    Run your salon smarter.
                </h2>
                <p className="text-slate-400 max-w-md mx-auto mb-10 text-sm leading-relaxed">
                    Join 4,000+ salons who&apos;ve switched to SalonHQ. Setup takes under 10 minutes.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                    <a href="/contact" className="px-7 py-3 bg-indigo-600 text-white font-semibold text-sm rounded-full hover:bg-indigo-700 transition-colors shadow-lg">
                        Start Free Trial
                    </a>
                    <a href="/about" className="px-7 py-3 border border-slate-700 text-slate-400 text-sm font-medium rounded-full hover:border-slate-500 hover:text-white transition-colors">
                        Learn More
                    </a>
                </div>
            </section>

        </main>
    );
}
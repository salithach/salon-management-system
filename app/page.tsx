"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Users,
  Scissors,
  BarChart3,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Star,
  CheckCircle2,
  Zap,
  Shield,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: CalendarDays,
    title: "Smart Scheduling",
    desc: "Drag-and-drop appointment calendar with real-time availability, automated reminders, and conflict detection across all staff members.",
    tag: "Appointments",
    gradient: "from-blue-500 to-indigo-500",
    glow: "group-hover:shadow-indigo-500/25",
  },
  {
    icon: Users,
    title: "Client Management",
    desc: "Maintain rich client profiles with visit history, preferences, allergy notes, and automated birthday messages.",
    tag: "Clients",
    gradient: "from-indigo-500 to-sky-500",
    glow: "group-hover:shadow-sky-500/25",
  },
  {
    icon: UserCheck,
    title: "Staff & Shift Control",
    desc: "Assign staff to shifts, track daily jobs, monitor individual revenue contribution, and manage time-off requests effortlessly.",
    tag: "Staff",
    gradient: "from-blue-500 to-sky-500",
    glow: "group-hover:shadow-sky-500/25",
  },
  {
    icon: Scissors,
    title: "Service Catalogue",
    desc: "Create and price your full service menu. Group by category, set duration, and link services directly to bookings.",
    tag: "Services",
    gradient: "from-rose-500 to-blue-500",
    glow: "group-hover:shadow-blue-500/25",
  },
  {
    icon: BarChart3,
    title: "Revenue Reports",
    desc: "Visual dashboards for daily, weekly, and monthly revenue. Break down earnings by service, staff member, or client segment.",
    tag: "Reports",
    gradient: "from-indigo-500 to-blue-500",
    glow: "group-hover:shadow-indigo-500/25",
  },
  {
    icon: Zap,
    title: "Instant Notifications",
    desc: "Real-time toast alerts for new bookings, cancellations, and staff check-ins keep the whole team in sync throughout the day.",
    tag: "Alerts",
    gradient: "from-amber-500 to-blue-500",
    glow: "group-hover:shadow-blue-500/25",
  },
];

const services = [
  { label: "Haircut & Blowout",   emoji: "✂️",  color: "from-blue-500/5 to-indigo-500/5 border-white/5 hover:border-blue-500/40 hover:bg-blue-500/10" },
  { label: "Hair Coloring",       emoji: "🎨",  color: "from-rose-500/5 to-pink-500/5 border-white/5 hover:border-rose-500/40 hover:bg-rose-500/10" },
  { label: "Full Highlights",     emoji: "✨",  color: "from-amber-500/5 to-yellow-500/5 border-white/5 hover:border-amber-500/40 hover:bg-amber-500/10" },
  { label: "Manicure & Pedicure", emoji: "💅",  color: "from-pink-500/5 to-blue-500/5 border-white/5 hover:border-pink-500/40 hover:bg-pink-500/10" },
  { label: "Facial Treatments",   emoji: "🧖",  color: "from-blue-500/5 to-indigo-500/5 border-white/5 hover:border-indigo-500/40 hover:bg-indigo-500/10" },
  { label: "Lash Extensions",     emoji: "👁️",  color: "from-blue-500/5 to-sky-500/5 border-white/5 hover:border-blue-500/40 hover:bg-blue-500/10" },
  { label: "Eyebrow Threading",   emoji: "🪡",  color: "from-indigo-500/5 to-blue-500/5 border-white/5 hover:border-indigo-500/40 hover:bg-indigo-500/10" },
  { label: "Deep Conditioning",   emoji: "💆",  color: "from-sky-500/5 to-blue-500/5 border-white/5 hover:border-sky-500/40 hover:bg-sky-500/10" },
  { label: "Nail Art",            emoji: "🖌️",  color: "from-blue-500/5 to-pink-500/5 border-white/5 hover:border-blue-500/40 hover:bg-blue-500/10" },
];

const testimonials = [
  {
    name: "Sophie Williams",
    role: "Owner, Glow Studio NYC",
    quote: "SalonHQ transformed the way we run daily operations. We cut no-shows by 40% in the first month alone.",
    rating: 5,
  },
  {
    name: "Marcus Leung",
    role: "Manager, Fade & Flow Barbershop",
    quote: "The staff tracking feature is brilliant. I can see exactly who's earning what without digging through spreadsheets.",
    rating: 5,
  },
  {
    name: "Aaliya Patel",
    role: "Lead Stylist, Velvet Hair Lounge",
    quote: "Booking used to be a nightmare. Now clients book online, reminders go out automatically, and I just focus on styling.",
    rating: 5,
  },
  {
    name: "Jordan Hayes",
    role: "Owner, Luxe Beauty Bar",
    quote: "The revenue reports alone justified the subscription. Best investment I've made for the salon this year.",
    rating: 5,
  },
];

const statItems = [
  { value: "12,000+", label: "Bookings managed" },
  { value: "98%",     label: "Client satisfaction" },
  { value: "40%",     label: "Fewer no-shows" },
  { value: "3 min",   label: "Average setup time" },
];

const whyItems = [
  { icon: Zap,      title: "Lightning fast",    desc: "Built on Next.js for sub-second load times on any device.", gradient: "from-amber-500 to-orange-500" },
  { icon: Shield,   title: "Secure by default", desc: "JWT auth, encrypted data, and role-based access control.", gradient: "from-indigo-500 to-blue-500" },
  { icon: Clock,    title: "Always in sync",    desc: "Real-time updates across all devices and staff members.", gradient: "from-sky-500 to-blue-500" },
  { icon: Sparkles, title: "Beautiful UI",      desc: "A clean, modern interface your whole team will love.", gradient: "from-blue-400 to-indigo-500" },
];

// ─── Carousel hook ────────────────────────────────────────────────────────────

function useCarousel(length: number, autoInterval = 4000) {
  const [index, setIndex] = useState(0);
  const prev = useCallback(() => setIndex((i) => (i - 1 + length) % length), [length]);
  const next = useCallback(() => setIndex((i) => (i + 1) % length), [length]);
  useEffect(() => {
    const t = setInterval(next, autoInterval);
    return () => clearInterval(t);
  }, [next, autoInterval]);
  return { index, setIndex, prev, next };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const feat = useCarousel(features.length, 4500);
  const test = useCarousel(testimonials.length, 5000);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-linear-to-br from-slate-950 via-blue-950/40 to-slate-950 pt-32 pb-28 px-6">
        {/* Decorative glow orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-225 h-125 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-125 h-87.5 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-0 w-75 h-75 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center flex flex-col items-center gap-7">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-blue-300 bg-blue-500/10 border border-blue-500/25 px-4 py-1.5 rounded-full backdrop-blur-sm">
            <Sparkles size={11} className="text-blue-400" /> Next-generation salon management
          </span>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight text-white">
            Run your salon
            <br />
            <span className="bg-linear-to-r from-blue-400 via-indigo-400 to-sky-400 bg-clip-text text-transparent">
              without the chaos.
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
            SalonHQ brings appointments, staff, clients, and revenue into one clean dashboard —
            so you spend more time creating, less time managing.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <Link href="/register"
              className="group flex items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold px-7 py-3.5 rounded-full transition-all shadow-lg shadow-blue-950/50 hover:shadow-blue-900/50 hover:-translate-y-0.5">
              Get Started Free
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/pricing"
              className="text-slate-300 hover:text-white text-sm font-medium px-7 py-3.5 rounded-full border border-white/15 hover:border-white/30 backdrop-blur-sm transition-all hover:-translate-y-0.5">
              See Pricing
            </Link>
          </div>
          <p className="text-slate-400/40 text-xs">No credit card required · Free 14-day trial</p>
        </div>
      </section>

      {/* ── Stats Banner ── */}
      <section className="bg-linear-to-r from-blue-950/60 via-slate-900 to-blue-950/60 border-y border-white/5 py-14 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {statItems.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold tracking-tight text-blue-400">{s.value}</p>
              <p className="text-xs text-slate-400 mt-1.5 uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Carousel ── */}
      <section className="py-28 px-6 bg-linear-to-b from-slate-900 via-slate-950 to-slate-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-300 bg-blue-500/10 border border-blue-400/20 px-4 py-1.5 rounded-full mb-5">
              Features
            </span>
            <h2 className="text-4xl font-bold text-white tracking-tight">
              Everything your salon{" "}
              <span className="bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">needs</span>
            </h2>
            <p className="text-slate-400 mt-3 text-sm">One platform, every workflow.</p>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <div className="flex transition-transform duration-500 ease-in-out"
                   style={{ transform: `translateX(-${feat.index * 100}%)` }}>
                {features.map((f) => {
                  const Icon = f.icon;
                  return (
                    <div key={f.title} className="min-w-full px-2">
                      <div className={`group bg-white/5 border border-white/10 rounded-2xl p-9 flex flex-col gap-5 max-w-lg mx-auto hover:border-blue-500/30 hover:bg-white/10 hover:shadow-xl ${f.glow} transition-all duration-300`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${f.gradient} flex items-center justify-center shrink-0 shadow-lg`}>
                            <Icon size={20} className="text-white" />
                          </div>
                          <span className="text-xs font-semibold uppercase tracking-widest text-blue-300 bg-blue-500/10 border border-blue-400/20 px-3 py-1 rounded-full">
                            {f.tag}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white">{f.title}</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {[{ dir: "prev", cls: "-left-5", fn: feat.prev, Icon: ChevronLeft },
              { dir: "next", cls: "-right-5",  fn: feat.next, Icon: ChevronRight }]
              .map(({ dir, cls, fn, Icon }) => (
                <button key={dir} onClick={fn}
                  className={`absolute ${cls} top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-800 border border-white/10 shadow-md flex items-center justify-center hover:border-blue-400 hover:shadow-blue-500/20 transition-all`}>
                  <Icon size={16} className="text-slate-300" />
                </button>
              ))}
          </div>

          <div className="flex items-center justify-center gap-2 mt-8">
            {features.map((_, i) => (
              <button key={i} onClick={() => feat.setIndex(i)}
                 className={`rounded-full transition-all duration-300 ${i === feat.index ? "w-7 h-2.5 bg-linear-to-r from-blue-500 to-indigo-500" : "w-2.5 h-2.5 bg-slate-700 hover:bg-slate-600"}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section className="py-28 px-6 bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-300 bg-blue-500/10 border border-blue-400/20 px-4 py-1.5 rounded-full mb-5">
              Services
            </span>
            <h2 className="text-4xl font-bold text-white tracking-tight">
              Built for every service{" "}
              <span className="bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">you offer</span>
            </h2>
            <p className="text-slate-400 mt-3 text-sm">Track, schedule, and analyse any treatment in your menu.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {services.map((s) => (
              <div key={s.label}
                 className={`flex items-center gap-3 bg-linear-to-br border ${s.color} rounded-2xl px-5 py-4 transition-all group hover:-translate-y-0.5 hover:shadow-md`}>
                <span className="text-2xl">{s.emoji}</span>
                 <span className="text-sm font-semibold text-slate-300 group-hover:text-white">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why SalonHQ ── */}
      <section className="relative overflow-hidden py-28 px-6 bg-linear-to-br from-slate-950 via-blue-950/40 to-slate-900">
        <div className="absolute top-0 right-0 w-150 h-100 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-100 h-75 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-300 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full mb-5">
              Why Us
            </span>
            <h2 className="text-4xl font-bold tracking-tight text-white">
              Why{" "}
              <span className="bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                SalonHQ?
              </span>
            </h2>
            <p className="text-slate-400 mt-3 text-sm">Designed by salon owners, for salon owners.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {whyItems.map((w) => {
              const Icon = w.icon;
              return (
                <div key={w.title} className="group bg-white/5 border border-white/10 rounded-2xl p-7 hover:bg-white/10 hover:border-blue-500/20 transition-all hover:-translate-y-1">
                  <div className={`w-11 h-11 rounded-xl bg-linear-to-br ${w.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <p className="text-sm font-bold text-white mb-2">{w.title}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{w.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials Carousel ── */}
      <section className="py-28 px-6 bg-linear-to-b from-slate-950 to-slate-900">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-300 bg-blue-500/10 border border-blue-400/20 px-4 py-1.5 rounded-full mb-5">
              Reviews
            </span>
            <h2 className="text-4xl font-bold text-white tracking-tight">
              Loved by salon{" "}
              <span className="bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">professionals</span>
            </h2>
            <p className="text-slate-400 mt-3 text-sm">Real feedback from real teams.</p>
          </div>

          <div className="relative">
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-500 ease-in-out"
                   style={{ transform: `translateX(-${test.index * 100}%)` }}>
                {testimonials.map((t) => (
                  <div key={t.name} className="min-w-full px-1">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-9 flex flex-col gap-5 shadow-sm hover:shadow-lg hover:border-blue-500/30 hover:bg-white/10 transition-all">
                      <div className="flex gap-1">
                        {Array.from({ length: t.rating }).map((_, i) => (
                           <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-slate-300 text-base leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
                      <div className="flex items-center gap-3.5 pt-5 border-t border-white/10">
                        <div className="w-11 h-11 rounded-full bg-linear-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-md">
                          {t.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{t.name}</p>
                          <p className="text-xs text-slate-500">{t.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {[{ dir: "prev", cls: "-left-5", fn: test.prev, Icon: ChevronLeft },
              { dir: "next", cls: "-right-5",  fn: test.next, Icon: ChevronRight }]
              .map(({ dir, cls, fn, Icon }) => (
                <button key={dir} onClick={fn}
                  className={`absolute ${cls} top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-800 border border-white/10 shadow-md flex items-center justify-center hover:border-blue-400 transition-all`}>
                  <Icon size={16} className="text-slate-300" />
                </button>
              ))}
          </div>

          <div className="flex items-center justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => test.setIndex(i)}
                 className={`rounded-full transition-all duration-300 ${i === test.index ? "w-7 h-2.5 bg-linear-to-r from-blue-500 to-indigo-500" : "w-2.5 h-2.5 bg-slate-700 hover:bg-slate-600"}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-28 px-6 bg-linear-to-br from-slate-950 via-blue-950/60 to-slate-950 border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-125 h-125 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-3xl mx-auto text-center flex flex-col items-center gap-7">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-200 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-sm">
            Get Started
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            Ready to simplify<br />your salon?
          </h2>
          <p className="text-slate-350 text-sm max-w-md leading-relaxed">
            Join thousands of salons already running smarter with SalonHQ.
          </p>
          <ul className="flex flex-col sm:flex-row gap-5 text-sm text-blue-200/80">
            {["Free 14-day trial", "No setup fees", "Cancel anytime"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-blue-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3 justify-center pt-1">
            <Link href="/register"
              className="group flex items-center gap-2 bg-white text-blue-950 text-sm font-bold px-8 py-3.5 rounded-full hover:bg-blue-50 transition-all shadow-xl hover:-translate-y-0.5">
              Start Free Trial
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/about"
              className="text-blue-200 hover:text-white text-sm font-medium px-8 py-3.5 rounded-full border border-white/20 hover:border-white/40 backdrop-blur-sm transition-all hover:-translate-y-0.5">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-950 text-slate-500 text-xs py-7 px-6 text-center border-t border-slate-800/50">
        © {new Date().getFullYear()} SalonHQ · Built for modern salons
      </footer>
    </div>
  );
}

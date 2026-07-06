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
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: CalendarDays,
    title: "Smart Scheduling",
    desc: "Drag-and-drop appointment calendar with real-time availability, automated reminders, and conflict detection across all staff members.",
    tag: "Appointments",
  },
  {
    icon: Users,
    title: "Client Management",
    desc: "Maintain rich client profiles with visit history, preferences, allergy notes, and automated birthday messages.",
    tag: "Clients",
  },
  {
    icon: UserCheck,
    title: "Staff & Shift Control",
    desc: "Assign staff to shifts, track daily jobs, monitor individual revenue contribution, and manage time-off requests effortlessly.",
    tag: "Staff",
  },
  {
    icon: Scissors,
    title: "Service Catalogue",
    desc: "Create and price your full service menu. Group by category, set duration, and link services directly to bookings.",
    tag: "Services",
  },
  {
    icon: BarChart3,
    title: "Revenue Reports",
    desc: "Visual dashboards for daily, weekly, and monthly revenue. Break down earnings by service, staff member, or client segment.",
    tag: "Reports",
  },
  {
    icon: Zap,
    title: "Instant Notifications",
    desc: "Real-time toast alerts for new bookings, cancellations, and staff check-ins keep the whole team in sync throughout the day.",
    tag: "Alerts",
  },
];

const services = [
  { label: "Haircut & Blowout",    emoji: "✂️" },
  { label: "Hair Coloring",        emoji: "🎨" },
  { label: "Full Highlights",      emoji: "✨" },
  { label: "Manicure & Pedicure",  emoji: "💅" },
  { label: "Facial Treatments",    emoji: "🧖" },
  { label: "Lash Extensions",      emoji: "👁️" },
  { label: "Eyebrow Threading",    emoji: "🪡" },
  { label: "Deep Conditioning",    emoji: "💆" },
  { label: "Nail Art",             emoji: "🖌️" },
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
  { icon: Zap,      title: "Lightning fast",    desc: "Built on Next.js for sub-second load times on any device." },
  { icon: Shield,   title: "Secure by default", desc: "JWT auth, encrypted data, and role-based access control." },
  { icon: Clock,    title: "Always in sync",    desc: "Real-time updates across all devices and staff members." },
  { icon: Sparkles, title: "Beautiful UI",      desc: "A clean, modern interface your whole team will love." },
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
    <div className="flex flex-col min-h-screen bg-[#f8fafc] text-slate-900 font-sans">

      {/* ── Hero ── */}
      <section className="bg-white border-b border-slate-200 pt-28 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
            <Sparkles size={11} /> Next-generation salon management
          </span>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight text-slate-900">
            Run your salon
            <br />
            <span className="text-slate-400">without the chaos.</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-xl leading-relaxed">
            SalonHQ brings appointments, staff, clients, and revenue into one clean dashboard —
            so you spend more time creating, less time managing.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/register"
              className="bg-indigo-600 text-white text-sm font-semibold px-7 py-3 rounded-full hover:bg-indigo-700 transition-colors shadow-sm">
              Get Started Free
            </Link>
            <Link href="/pricing"
              className="text-slate-600 hover:text-slate-900 text-sm font-medium px-7 py-3 rounded-full border border-slate-300 hover:border-slate-900 transition-colors">
              See Pricing
            </Link>
          </div>
          <p className="text-slate-400 text-xs">No credit card required · Free 14-day trial</p>
        </div>
      </section>

      {/* ── Stats Banner ── */}
      <section className="bg-slate-900 text-white py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {statItems.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold tracking-tight">{s.value}</p>
              <p className="text-xs text-slate-400 mt-1.5 uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Carousel ── */}
      <section className="py-24 px-6 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full mb-4">
              Features
            </span>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Everything your salon needs</h2>
            <p className="text-slate-500 mt-3 text-sm">One platform, every workflow.</p>
          </div>

          <div className="relative">
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-500 ease-in-out"
                   style={{ transform: `translateX(-${feat.index * 100}%)` }}>
                {features.map((f) => {
                  const Icon = f.icon;
                  return (
                    <div key={f.title} className="min-w-full px-2">
                      <div className="bg-[#f8fafc] border border-slate-200 rounded-2xl p-8 flex flex-col gap-5 max-w-lg mx-auto hover:border-indigo-300 hover:shadow-md transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                            <Icon size={18} className="text-indigo-600" />
                          </div>
                          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                            {f.tag}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">{f.title}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {[{ dir: "prev", cls: "-translate-x-4 left-0", fn: feat.prev, Icon: ChevronLeft },
              { dir: "next", cls: "translate-x-4 right-0",  fn: feat.next, Icon: ChevronRight }]
              .map(({ dir, cls, fn, Icon }) => (
                <button key={dir} onClick={fn}
                  className={`absolute ${cls} top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:border-indigo-400 transition-colors`}>
                  <Icon size={16} className="text-slate-500" />
                </button>
              ))}
          </div>

          <div className="flex items-center justify-center gap-2 mt-8">
            {features.map((_, i) => (
              <button key={i} onClick={() => feat.setIndex(i)}
                className={`rounded-full transition-all duration-300 ${i === feat.index ? "w-6 h-2 bg-indigo-600" : "w-2 h-2 bg-slate-300 hover:bg-slate-400"}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full mb-4">
              Services
            </span>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Built for every service you offer</h2>
            <p className="text-slate-500 mt-3 text-sm">Track, schedule, and analyse any treatment in your menu.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {services.map((s) => (
              <div key={s.label}
                className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-4 hover:border-indigo-300 hover:shadow-sm transition-all group">
                <span className="text-2xl">{s.emoji}</span>
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why SalonHQ ── */}
      <section className="py-24 px-6 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-indigo-400 bg-indigo-950 px-3 py-1.5 rounded-full mb-4">
              Why Us
            </span>
            <h2 className="text-4xl font-bold tracking-tight">Why SalonHQ?</h2>
            <p className="text-slate-400 mt-3 text-sm">Designed by salon owners, for salon owners.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {whyItems.map((w) => {
              const Icon = w.icon;
              return (
                <div key={w.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 hover:border-indigo-500/30 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mb-5">
                    <Icon size={18} className="text-indigo-400" />
                  </div>
                  <p className="text-sm font-semibold text-white mb-1.5">{w.title}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{w.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials Carousel ── */}
      <section className="py-24 px-6 bg-white border-y border-slate-200">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full mb-4">
              Reviews
            </span>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Loved by salon professionals</h2>
            <p className="text-slate-500 mt-3 text-sm">Real feedback from real teams.</p>
          </div>

          <div className="relative">
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-500 ease-in-out"
                   style={{ transform: `translateX(-${test.index * 100}%)` }}>
                {testimonials.map((t) => (
                  <div key={t.name} className="min-w-full px-1">
                    <div className="bg-[#f8fafc] border border-slate-200 rounded-2xl p-8 flex flex-col gap-5">
                      <div className="flex gap-0.5">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
                      <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold shrink-0">
                          {t.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                          <p className="text-xs text-slate-400">{t.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {[{ dir: "prev", cls: "-translate-x-4 left-0", fn: test.prev, Icon: ChevronLeft },
              { dir: "next", cls: "translate-x-4 right-0",  fn: test.next, Icon: ChevronRight }]
              .map(({ dir, cls, fn, Icon }) => (
                <button key={dir} onClick={fn}
                  className={`absolute ${cls} top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:border-indigo-400 transition-colors`}>
                  <Icon size={16} className="text-slate-500" />
                </button>
              ))}
          </div>

          <div className="flex items-center justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => test.setIndex(i)}
                className={`rounded-full transition-all duration-300 ${i === test.index ? "w-6 h-2 bg-indigo-600" : "w-2 h-2 bg-slate-300 hover:bg-slate-400"}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-indigo-400 bg-indigo-950 px-3 py-1.5 rounded-full">
            Get Started
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            Ready to simplify<br />your salon?
          </h2>
          <p className="text-slate-400 text-sm max-w-md leading-relaxed">
            Join thousands of salons already running smarter with SalonHQ.
          </p>
          <ul className="flex flex-col sm:flex-row gap-4 text-sm text-slate-400">
            {["Free 14-day trial", "No setup fees", "Cancel anytime"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-indigo-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/register"
              className="bg-indigo-600 text-white text-sm font-semibold px-8 py-3 rounded-full hover:bg-indigo-700 transition-colors shadow-lg">
              Start Free Trial
            </Link>
            <Link href="/about"
              className="text-slate-400 hover:text-white text-sm font-medium px-8 py-3 rounded-full border border-slate-700 hover:border-slate-500 transition-colors">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-950 text-slate-500 text-xs py-6 px-6 text-center">
        © {new Date().getFullYear()} SalonHQ · Built for modern salons
      </footer>
    </div>
  );
}

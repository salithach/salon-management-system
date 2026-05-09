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
  { label: "Haircut & Blowout", emoji: "✂️" },
  { label: "Hair Coloring", emoji: "🎨" },
  { label: "Full Highlights", emoji: "✨" },
  { label: "Manicure & Pedicure", emoji: "💅" },
  { label: "Facial Treatments", emoji: "🧖" },
  { label: "Lash Extensions", emoji: "👁️" },
  { label: "Eyebrow Threading", emoji: "🪡" },
  { label: "Deep Conditioning", emoji: "💆" },
  { label: "Nail Art", emoji: "🖌️" },
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
  { value: "98%", label: "Client satisfaction" },
  { value: "40%", label: "Fewer no-shows" },
  { value: "3 min", label: "Average setup time" },
];

const whyItems = [
  { icon: Zap, title: "Lightning fast", desc: "Built on Next.js for sub-second load times on any device." },
  { icon: Shield, title: "Secure by default", desc: "JWT auth, encrypted data, and role-based access control." },
  { icon: Clock, title: "Always up to date", desc: "Real-time sync across all devices and staff members." },
  { icon: Sparkles, title: "Beautiful UI", desc: "A clean, modern interface your whole team will love." },
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
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="bg-zinc-800 text-white pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-white/10 text-white/80 px-3 py-1 rounded-full border border-white/10">
            <Sparkles size={11} /> Next-generation salon management
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
            Run your salon
            <br />
            <span className="text-white/50">without the chaos.</span>
          </h1>
          <p className="text-white/60 text-base sm:text-lg max-w-xl leading-relaxed">
            SalonHQ brings appointments, staff, clients, and revenue into one clean dashboard — so you spend more time creating, less time managing.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            <Link
              href="/register"
              className="bg-white text-zinc-900 text-sm font-semibold px-6 py-3 rounded-full hover:opacity-90 active:scale-95 transition"
            >
              Get Started Free
            </Link>
            <Link
              href="/pricing"
              className="text-white/70 hover:text-white text-sm font-medium px-6 py-3 rounded-full border border-white/20 hover:border-white/40 transition"
            >
              See Pricing
            </Link>
          </div>
          <p className="text-white/30 text-xs mt-2">No credit card required · Free 14-day trial</p>
        </div>
      </section>

      {/* ── Stats Banner ──────────────────────────────────────────────── */}
      <section className="bg-zinc-900 text-white py-10 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {statItems.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="text-xs text-white/50 mt-1 uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Carousel ─────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Everything your salon needs</h2>
            <p className="text-gray-500 mt-2 text-sm">One platform, every workflow.</p>
          </div>

          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${feat.index * 100}%)` }}
              >
                {features.map((f) => {
                  const Icon = f.icon;
                  return (
                    <div key={f.title} className="min-w-full px-2">
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col gap-4 max-w-lg mx-auto">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0">
                            <Icon size={18} className="text-white" />
                          </div>
                          <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">{f.tag}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">{f.title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={feat.prev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition"
            >
              <ChevronLeft size={16} className="text-gray-600" />
            </button>
            <button
              onClick={feat.next}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition"
            >
              <ChevronRight size={16} className="text-gray-600" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 mt-6">
            {features.map((_, i) => (
              <button
                key={i}
                onClick={() => feat.setIndex(i)}
                className={`rounded-full transition-all duration-300 ${i === feat.index ? "w-6 h-2 bg-zinc-800" : "w-2 h-2 bg-gray-300 hover:bg-gray-400"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Services Grid ─────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Built for every service you offer</h2>
            <p className="text-gray-500 mt-2 text-sm">Track, schedule, and analyse any treatment in your menu.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {services.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-3 bg-gray-50 rounded-xl border border-gray-100 px-4 py-4 hover:border-zinc-300 hover:shadow-sm transition"
              >
                <span className="text-2xl">{s.emoji}</span>
                <span className="text-sm font-medium text-gray-700">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why SalonHQ ───────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-zinc-800 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Why SalonHQ?</h2>
            <p className="text-white/50 mt-2 text-sm">Designed by salon owners, for salon owners.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyItems.map((w) => {
              const Icon = w.icon;
              return (
                <div key={w.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition">
                  <Icon size={22} className="text-white/70 mb-4" />
                  <p className="text-sm font-semibold mb-1">{w.title}</p>
                  <p className="text-xs text-white/50 leading-relaxed">{w.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials Carousel ─────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Loved by salon professionals</h2>
            <p className="text-gray-500 mt-2 text-sm">Real feedback from real teams.</p>
          </div>

          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${test.index * 100}%)` }}
              >
                {testimonials.map((t) => (
                  <div key={t.name} className="min-w-full px-1">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col gap-4">
                      <div className="flex gap-0.5">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
                      <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
                        <div className="w-9 h-9 rounded-full bg-zinc-800 text-white flex items-center justify-center text-sm font-semibold shrink-0">
                          {t.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                          <p className="text-xs text-gray-400">{t.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={test.prev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition"
            >
              <ChevronLeft size={16} className="text-gray-600" />
            </button>
            <button
              onClick={test.next}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition"
            >
              <ChevronRight size={16} className="text-gray-600" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => test.setIndex(i)}
                className={`rounded-full transition-all duration-300 ${i === test.index ? "w-6 h-2 bg-zinc-800" : "w-2 h-2 bg-gray-300 hover:bg-gray-400"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
          <h2 className="text-3xl font-bold text-gray-900">Ready to simplify your salon?</h2>
          <p className="text-gray-500 text-sm max-w-md">Join thousands of salons already running smarter with SalonHQ.</p>
          <ul className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600">
            {["Free 14-day trial", "No setup fees", "Cancel anytime"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-green-500 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/register"
              className="bg-zinc-800 text-white text-sm font-semibold px-7 py-3 rounded-full hover:bg-zinc-700 active:scale-95 transition"
            >
              Start Free Trial
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium px-7 py-3 rounded-full border border-gray-200 hover:border-gray-400 transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="bg-zinc-800 text-white/50 text-xs py-6 px-6 text-center mt-auto">
        © {new Date().getFullYear()} SalonHQ · Built for modern salons
      </footer>
    </div>
  );
}

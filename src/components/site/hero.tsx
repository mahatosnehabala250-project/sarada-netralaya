"use client";

import Image from "next/image";
import {
  CalendarCheck, Phone, Star, ShieldCheck, MapPin, Sparkles,
  Eye, Stethoscope, Zap, Clock, Award,
} from "lucide-react";
import { SITE, PHONES, ADDRESS } from "@/lib/site-info";

const STATS = [
  { icon: Star, value: SITE.rating, label: `${SITE.reviewsCount} Google Reviews`, tone: "amber" as const },
  { icon: ShieldCheck, value: `${SITE.yearsExperience} Yrs`, label: "Trusted Eye Care", tone: "teal" as const },
  { icon: Award, value: "FICO (U.K.)", label: "Qualified Surgeon", tone: "emerald" as const },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-gradient-to-br from-[#052f3f] via-[#074860] to-[#0b6e8f]">
      {/* Decorative layers */}
      <div className="pointer-events-none absolute -top-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-emerald-400/15 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 h-[28rem] w-[28rem] rounded-full bg-cyan-400/10 blur-[100px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
          backgroundSize: "34px 34px",
        }}
      />
      {/* top sheen */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-14 items-center">
          {/* Left: copy */}
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
              {SITE.tagline}
            </span>

            <h1 className="mt-6 text-[2rem] sm:text-5xl lg:text-[3.4rem] font-bold leading-[1.08] tracking-tight text-white">
              Caring for Your Eyes,
              <span className="block mt-1 bg-gradient-to-r from-emerald-200 via-emerald-300 to-teal-200 bg-clip-text text-transparent">
                Backed by 30+ Years of Trust
              </span>
            </h1>

            <p className="mt-6 max-w-xl mx-auto lg:mx-0 text-base sm:text-lg leading-[1.7] text-white/75">
              Advanced eye care in the heart of Sakchi, Jamshedpur. From
              painless <span className="text-white font-semibold">Topical Phaco</span> cataract
              surgery (no injection, no patch) to a fully equipped{" "}
              <span className="text-white font-semibold">laser facility</span> —
              your vision is in expert hands.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <a
                href="#book"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#book")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-7 py-4 text-base font-semibold text-white shadow-[0_10px_30px_-8px_rgba(16,185,129,0.6)] transition-all hover:shadow-[0_14px_40px_-8px_rgba(16,185,129,0.7)] hover:-translate-y-0.5"
              >
                <CalendarCheck className="h-5 w-5" />
                Book Appointment Online
                <span className="ml-0.5 transition-transform group-hover:translate-x-0.5">→</span>
              </a>
              <a
                href={`tel:${PHONES.primaryTel}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/8 hover:bg-white/15 border border-white/20 px-7 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5"
              >
                <Phone className="h-5 w-5 text-emerald-300" />
                {PHONES.primary}
              </a>
            </div>

            {/* Stats row */}
            <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-4 max-w-xl mx-auto lg:mx-0">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-white/12 bg-white/[0.07] backdrop-blur-md p-3.5 sm:p-4 text-center hover:bg-white/[0.1] transition-colors"
                >
                  <s.icon className={`mx-auto h-5 w-5 sm:h-5 sm:w-5 ${TONE_TEXT[s.tone]}`} strokeWidth={2} />
                  <div className="mt-1.5 text-base sm:text-lg font-bold text-white leading-tight tracking-tight">
                    {s.value}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-white/55 leading-tight mt-0.5">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: visual */}
          <div className="relative hidden lg:block">
            <div className="relative mx-auto max-w-md">
              {/* glow ring behind */}
              <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-tr from-emerald-500/20 via-transparent to-cyan-400/15 blur-2xl" />

              {/* main framed visual */}
              <div className="relative rounded-[2rem] overflow-hidden border border-white/15 shadow-2xl shadow-black/40 ring-1 ring-white/5">
                <div className="aspect-[4/3] relative bg-gradient-to-br from-[#0b6e8f] to-[#052f3f]">
                  <Image
                    src="/images/hero-eye.png"
                    alt="Close-up of a healthy human eye — Sarada Netralaya eye care"
                    fill
                    priority
                    sizes="(min-width: 1024px) 30rem, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#052f3f]/85 via-[#052f3f]/10 to-transparent" />

                  {/* bottom overlay info */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                    <div className="rounded-xl bg-black/30 backdrop-blur-md border border-white/15 px-3.5 py-2">
                      <div className="text-[9px] uppercase tracking-[0.12em] text-emerald-300 font-bold">Specialist</div>
                      <div className="text-[13px] font-bold text-white leading-tight">Advanced Ophthalmology</div>
                    </div>
                    <span className="rounded-lg bg-emerald-500 px-2.5 py-1.5 text-[10px] font-bold text-white shadow-lg shadow-emerald-900/40 tracking-wider">
                      EST. 30+ YRS
                    </span>
                  </div>
                </div>
              </div>

              {/* floating feature chips — 2 clean cards */}
              <div className="absolute -left-6 top-10 rounded-2xl bg-white shadow-[0_20px_50px_-12px_rgba(8,79,103,0.4)] p-4 flex items-center gap-3 ring-1 ring-black/5 animate-[float_4s_ease-in-out_infinite]">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#0b6e8f] to-[#084f67] text-white shrink-0 shadow-md">
                  <Zap className="h-5 w-5" strokeWidth={2.2} />
                </span>
                <div className="leading-tight">
                  <div className="text-[13px] font-bold text-[#084f67]">Latest Phaco</div>
                  <div className="text-[10.5px] text-slate-500 mt-0.5">& Laser Facility</div>
                </div>
              </div>

              <div className="absolute -right-5 bottom-20 rounded-2xl bg-white shadow-[0_20px_50px_-12px_rgba(8,79,103,0.4)] p-4 flex items-center gap-3 ring-1 ring-black/5 animate-[float_4s_ease-in-out_infinite_0.9s]">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shrink-0 shadow-md">
                  <Stethoscope className="h-5 w-5" strokeWidth={2.2} />
                </span>
                <div className="leading-tight">
                  <div className="text-[13px] font-bold text-[#084f67]">No Injection</div>
                  <div className="text-[10.5px] text-slate-500 mt-0.5">No Patch Surgery</div>
                </div>
              </div>

              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white shadow-xl ring-1 ring-black/5 text-[11px] font-bold px-4 py-2 whitespace-nowrap flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-slate-800">4.9</span>
                <span className="text-slate-300">·</span>
                <span className="text-slate-500 font-semibold">329+ Reviews</span>
              </div>
            </div>
          </div>
        </div>

        {/* Location strip */}
        <div className="mt-14 lg:mt-20 flex flex-wrap items-center justify-center gap-x-7 gap-y-2.5 text-sm text-white/65 border-t border-white/10 pt-6">
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald-300" />
            {ADDRESS.short}
          </span>
          <span className="hidden sm:inline text-white/25">•</span>
          <span className="inline-flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-300" />
            Mon–Sat · 10:00 AM – 7:30 PM
          </span>
          <span className="hidden sm:inline text-white/25">•</span>
          <span className="inline-flex items-center gap-2">
            <Eye className="h-4 w-4 text-emerald-300" />
            Sunday Closed
          </span>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-9px); }
        }
      `}</style>
    </section>
  );
}

const TONE_TEXT: Record<"amber" | "teal" | "emerald", string> = {
  amber: "text-amber-300",
  teal: "text-teal-300",
  emerald: "text-emerald-300",
};

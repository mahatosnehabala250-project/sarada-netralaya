"use client";

import Image from "next/image";
import { CalendarCheck, Phone, Star, ShieldCheck, MapPin, Sparkles, Eye, Stethoscope, Zap } from "lucide-react";
import { SITE, PHONES, ADDRESS } from "@/lib/site-info";

const BADGES = [
  { icon: Star, label: `${SITE.rating} Rating`, sub: `${SITE.reviewsCount} Reviews`, tone: "amber" },
  { icon: ShieldCheck, label: `${SITE.yearsExperience} Years`, sub: "of trusted care", tone: "teal" },
  { icon: MapPin, label: "Sakchi", sub: "Jamshedpur", tone: "emerald" },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-gradient-to-br from-[#063b4f] via-[#084f67] to-[#0b6e8f]">
      {/* Decorative glows */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#10b981]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[#0ea5e9]/15 blur-3xl" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left: copy */}
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-[#6ee7b7]" />
              {SITE.tagline}
            </span>

            <h1 className="mt-5 text-3xl sm:text-4xl lg:text-[2.9rem] font-bold leading-[1.1] tracking-tight text-white">
              Caring for Your Eyes,
              <span className="block bg-gradient-to-r from-[#6ee7b7] to-[#34d399] bg-clip-text text-transparent">
                Backed by 30+ Years of Trust
              </span>
            </h1>

            <p className="mt-5 max-w-xl mx-auto lg:mx-0 text-base sm:text-lg leading-relaxed text-white/80">
              Advanced eye care in the heart of Sakchi, Jamshedpur. From
              painless <span className="text-white font-medium">Topical Phaco</span> cataract
              surgery (no injection, no patch) to a fully equipped{" "}
              <span className="text-white font-medium">laser facility</span> —
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
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#10b981] hover:bg-[#059669] px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-900/30 transition-all hover:shadow-xl hover:shadow-emerald-900/40 hover:-translate-y-0.5"
              >
                <CalendarCheck className="h-5 w-5" />
                Book Appointment Online
              </a>
              <a
                href={`tel:${PHONES.primaryTel}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 px-6 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5"
              >
                <Phone className="h-5 w-5" />
                {PHONES.primary}
              </a>
            </div>

            {/* Trust badges */}
            <div className="mt-9 grid grid-cols-3 gap-3 sm:gap-4 max-w-lg mx-auto lg:mx-0">
              {BADGES.map((b) => (
                <div
                  key={b.label}
                  className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-sm p-3 sm:p-4 text-center"
                >
                  <b.icon className="mx-auto h-5 w-5 sm:h-6 sm:w-6 text-[#6ee7b7]" />
                  <div className="mt-1.5 text-sm sm:text-base font-bold text-white leading-tight">
                    {b.label}
                  </div>
                  <div className="text-[11px] sm:text-xs text-white/65 leading-tight">
                    {b.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: visual */}
          <div className="relative hidden lg:block">
            <div className="relative mx-auto max-w-md">
              {/* main framed visual */}
              <div className="relative rounded-[2rem] overflow-hidden border border-white/20 shadow-2xl shadow-black/30">
                <div className="aspect-[4/3] relative bg-gradient-to-br from-[#0b6e8f] to-[#063b4f]">
                  <Image
                    src="/images/hero-eye.png"
                    alt="Close-up of a healthy human eye — Sarada Netralaya eye care"
                    fill
                    priority
                    sizes="(min-width: 1024px) 28rem, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#063b4f]/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span className="rounded-lg bg-white/15 backdrop-blur-md border border-white/20 px-3 py-1.5 text-xs font-semibold text-white">
                      👁️ Advanced Ophthalmology
                    </span>
                    <span className="rounded-lg bg-[#10b981] px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                      30+ Yrs
                    </span>
                  </div>
                </div>
              </div>

              {/* floating feature chips */}
              <div className="absolute -left-6 top-10 rounded-2xl bg-white shadow-xl p-3 flex items-center gap-2.5 max-w-[200px] animate-[float_4s_ease-in-out_infinite]">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0b6e8f]/10 text-[#0b6e8f]">
                  <Zap className="h-5 w-5" />
                </span>
                <div className="leading-tight">
                  <div className="text-xs font-bold text-[#084f67]">Latest Phaco</div>
                  <div className="text-[10px] text-[#0f2f3a]/60">& Laser Facility</div>
                </div>
              </div>

              <div className="absolute -right-5 bottom-12 rounded-2xl bg-white shadow-xl p-3 flex items-center gap-2.5 max-w-[210px] animate-[float_4s_ease-in-out_infinite_0.8s]">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <Stethoscope className="h-5 w-5" />
                </span>
                <div className="leading-tight">
                  <div className="text-xs font-bold text-[#084f67]">No Injection</div>
                  <div className="text-[10px] text-[#0f2f3a]/60">No Patch Cataract Surgery</div>
                </div>
              </div>

              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-[#10b981] text-white text-xs font-bold px-4 py-2 shadow-lg shadow-emerald-900/40 whitespace-nowrap">
                ⭐ 4.9 · 329+ Google Reviews
              </div>
            </div>
          </div>
        </div>

        {/* Location strip */}
        <div className="mt-12 lg:mt-16 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/70 border-t border-white/10 pt-6">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-[#6ee7b7]" />
            {ADDRESS.short}
          </span>
          <span className="hidden sm:inline text-white/30">•</span>
          <span className="inline-flex items-center gap-1.5">
            <Eye className="h-4 w-4 text-[#6ee7b7]" />
            Mon–Sat · 10:00 AM – 7:30 PM
          </span>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  );
}



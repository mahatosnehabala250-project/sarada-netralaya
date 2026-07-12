"use client";

import Image from "next/image";
import { ArrowRight, Phone, Star, CheckCircle2 } from "lucide-react";
import { SITE, PHONES } from "@/lib/site-info";

export function Hero() {
  return (
    <section id="top" className="relative bg-white overflow-hidden">
      {/* Top bar */}
      <div className="bg-[#0a3d4a] text-white text-xs sm:text-sm py-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Open Today · 10 AM – 7:30 PM
          </span>
          <a href={`tel:${PHONES.primaryTel}`} className="hidden sm:flex items-center gap-1.5 font-semibold hover:text-emerald-300 transition-colors">
            <Phone className="h-3 w-3" /> {PHONES.primary}
          </a>
        </div>
      </div>

      {/* Hero content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left — copy */}
          <div className="order-2 lg:order-1">
            {/* Rating badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-3 py-1.5 mb-5">
              <div className="flex">
                {[0,1,2,3,4].map((i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-amber-800">{SITE.rating} · {SITE.reviewsCount} Google Reviews</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] tracking-tight text-[#0a3d4a]">
              See the world
              <br />
              <span className="text-[#10b981]">clearly again.</span>
            </h1>

            {/* Subtext */}
            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-lg">
              Your dream of perfect vision is our mission. At Sarada Netralaya,
              we've helped <strong className="text-[#0a3d4a]">50,000+ patients</strong> see
              clearly with painless cataract surgery, advanced retina care, and
              expert glaucoma treatment — for over <strong className="text-[#0a3d4a]">30+ years</strong>.
            </p>

            {/* Trust points */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-md">
              {[
                "Painless Phaco surgery (no injection)",
                "30+ years of trusted eye care",
                "FICO (U.K.) qualified surgeon",
                "Same-day appointment available",
              ].map((point) => (
                <div key={point} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#10b981] shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">{point}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="#book"
                onClick={(e) => { e.preventDefault(); document.querySelector("#book")?.scrollIntoView({ behavior: "smooth" }); }}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#10b981] hover:bg-[#059669] px-7 py-4 text-base font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:shadow-xl hover:shadow-emerald-600/30 min-h-[52px]"
              >
                Book Free Appointment
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href={`tel:${PHONES.primaryTel}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#0a3d4a] text-[#0a3d4a] px-7 py-4 text-base font-bold hover:bg-[#0a3d4a] hover:text-white transition-colors min-h-[52px]"
              >
                <Phone className="h-5 w-5" />
                {PHONES.primary}
              </a>
            </div>

            {/* Stats row */}
            <div className="mt-8 flex items-center gap-6 pt-6 border-t border-slate-100">
              <div>
                <div className="text-2xl font-bold text-[#0a3d4a]">30+</div>
                <div className="text-xs text-slate-500 font-medium">Years</div>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <div className="text-2xl font-bold text-[#0a3d4a]">50K+</div>
                <div className="text-xs text-slate-500 font-medium">Patients</div>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <div className="text-2xl font-bold text-[#0a3d4a]">4.9★</div>
                <div className="text-xs text-slate-500 font-medium">Rating</div>
              </div>
            </div>
          </div>

          {/* Right — image */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-[#0a3d4a]/20 aspect-[4/3]">
              <Image
                src="/images/hero-patient.png"
                alt="Happy patient with clear vision after treatment at Sarada Netralaya"
                fill
                priority
                sizes="(min-width: 1024px) 40rem, 100vw"
                className="object-cover"
              />
              {/* Floating rating card */}
              <div className="absolute bottom-4 left-4 right-4 sm:left-4 sm:right-auto rounded-xl bg-white/95 backdrop-blur-sm shadow-xl p-3.5 flex items-center gap-3 max-w-[260px]">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#0a3d4a]">Clear vision restored</div>
                  <div className="text-xs text-slate-500">Same day recovery · No pain</div>
                </div>
              </div>
            </div>
            {/* Decorative accent */}
            <div className="absolute -top-3 -right-3 -z-10 h-32 w-32 rounded-full bg-emerald-200/40 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

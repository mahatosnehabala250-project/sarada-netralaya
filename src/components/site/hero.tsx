"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone, CheckCircle2, Star } from "lucide-react";
import { PHONES, SITE } from "@/lib/site-info";

export function Hero() {
  return (
    <section id="top" className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#0047AB]">
      {/* Full-width background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-new.png"
          alt="Eye care specialist examining a patient at Sarada Netralaya"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0047AB]/90 via-[#0047AB]/60 to-transparent" />
      </div>

      {/* Top bar */}
      <div className="absolute top-0 inset-x-0 bg-[#0047AB] text-white text-xs sm:text-sm py-2 z-10">
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

      {/* Text overlaid on image */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32 w-full z-10">
        <div className="max-w-2xl">
          {/* Subtitle */}
          <div className="text-white/80 text-xs sm:text-sm font-bold uppercase tracking-[0.15em] mb-3">
            Expert Care for Every Eye
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-white">
            Your Vision,
            <br />
            Our Mission
          </h1>

          {/* Underline */}
          <div className="h-0.5 w-12 bg-white mt-4 mb-5" />

          {/* Body copy */}
          <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-lg">
            Advanced technology, experienced specialists, and compassionate
            care – all dedicated to protecting your precious vision.
          </p>

          {/* Trust points */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-md">
            {[
              "Painless Phaco surgery (no injection)",
              "FICO (U.K.) qualified surgeon",
              "30+ years of trusted eye care",
              "Same-day appointment available",
            ].map((point) => (
              <div key={point} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-sm text-white/90">{point}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/book"
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-white hover:bg-gray-100 px-7 py-4 text-base font-bold text-[#0047AB] shadow-lg transition-all min-h-[52px]"
            >
              Book Appointment
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href={`tel:${PHONES.primaryTel}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white/40 text-white px-7 py-4 text-base font-bold hover:bg-white/10 transition-colors min-h-[52px]"
            >
              <Phone className="h-5 w-5" />
              Call Now
            </a>
          </div>

          {/* Stats */}
          <div className="mt-8 flex items-center gap-6 pt-6 border-t border-white/20">
            <div>
              <div className="text-2xl font-bold text-white">1000+</div>
              <div className="text-xs text-white/60 font-medium">Happy Patients</div>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-2xl font-bold text-white">{SITE.rating}</span>
              <span className="text-xs text-white/60 font-medium">Rating</span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div>
              <div className="text-2xl font-bold text-white">30+</div>
              <div className="text-xs text-white/60 font-medium">Years</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

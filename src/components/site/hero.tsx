"use client";

import Image from "next/image";
import { ArrowRight, Phone, Star } from "lucide-react";
import { SITE, PHONES } from "@/lib/site-info";

export function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] flex items-center overflow-hidden bg-[#0a3d4a]">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-eye.png"
          alt="Close-up of a healthy human eye"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a3d4a] via-[#0a3d4a]/80 to-[#0a3d4a]/50" />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-28 sm:py-32 w-full">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-5 reveal" style={{ animationDelay: "0.1s" }}>
            <span className="h-px w-10 bg-emerald-400" />
            <span className="text-emerald-300 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]">
              Eye Care · Since 1995
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif-display text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white reveal" style={{ animationDelay: "0.2s" }}>
            Caring for
            <br />
            <span className="italic text-emerald-300">your vision</span>
            <br />
            with trust.
          </h1>

          {/* Subtext */}
          <p className="mt-6 max-w-lg text-base sm:text-lg leading-relaxed text-white/70 reveal" style={{ animationDelay: "0.3s" }}>
            Advanced eye care in Sakchi, Jamshedpur — from painless Topical Phaco
            cataract surgery to a fully equipped laser facility.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 reveal" style={{ animationDelay: "0.4s" }}>
            <a
              href="#book"
              onClick={(e) => { e.preventDefault(); document.querySelector("#book")?.scrollIntoView({ behavior: "smooth" }); }}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-400 px-7 py-4 text-sm font-bold text-[#0a3d4a] transition-all hover:gap-3 min-h-[52px]"
            >
              Book Appointment
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href={`tel:${PHONES.primaryTel}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 text-white px-7 py-4 text-sm font-bold hover:bg-white/10 transition-colors min-h-[52px]"
            >
              <Phone className="h-4 w-4" />
              Call Now
            </a>
          </div>

          {/* Trust badges — clean, simple */}
          <div className="mt-10 flex items-center gap-5 reveal" style={{ animationDelay: "0.5s" }}>
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-bold text-white">{SITE.rating}</span>
              <span className="text-xs text-white/50">({SITE.reviewsCount})</span>
            </div>
            <span className="h-4 w-px bg-white/20" />
            <span className="text-sm text-white/70">{SITE.yearsExperience} years</span>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { ArrowRight, Phone, Star } from "lucide-react";
import { SITE, PHONES, ADDRESS } from "@/lib/site-info";

export function Hero() {
  return (
    <section id="top" className="relative min-h-screen flex items-end overflow-hidden bg-[#0a3d4a]">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-eye.png"
          alt="Close-up of a healthy human eye"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a3d4a] via-[#0a3d4a]/60 to-[#0a3d4a]/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a3d4a]/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24 pt-32 w-full">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6 reveal" style={{ animationDelay: "0.1s" }}>
            <span className="h-px w-12 bg-emerald-400" />
            <span className="text-emerald-300 text-xs font-bold uppercase tracking-[0.25em]">
              Eye Care · Since 1995
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif-display text-[2.75rem] sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-white reveal" style={{ animationDelay: "0.2s" }}>
            Caring for
            <br />
            <span className="italic text-emerald-300">your vision</span> with
            <br />
            three decades of trust.
          </h1>

          {/* Subtext */}
          <p className="mt-8 max-w-xl text-base sm:text-lg leading-relaxed text-white/70 reveal" style={{ animationDelay: "0.3s" }}>
            Advanced eye care in Sakchi, Jamshedpur — from painless Topical Phaco
            cataract surgery to a fully equipped laser facility. Your sight is in
            expert hands.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row gap-3 reveal" style={{ animationDelay: "0.4s" }}>
            <a
              href="#book"
              onClick={(e) => { e.preventDefault(); document.querySelector("#book")?.scrollIntoView({ behavior: "smooth" }); }}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-400 px-7 py-4 text-sm font-bold text-[#0a3d4a] transition-all hover:gap-3"
            >
              Book Appointment
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href={`tel:${PHONES.primaryTel}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 text-white px-7 py-4 text-sm font-bold hover:bg-white/10 transition-colors"
            >
              <Phone className="h-4 w-4" />
              {PHONES.primary}
            </a>
          </div>

          {/* Trust strip */}
          <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 reveal" style={{ animationDelay: "0.5s" }}>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[0,1,2,3,4].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm font-semibold text-white">{SITE.rating}</span>
              <span className="text-sm text-white/50">{SITE.reviewsCount} reviews</span>
            </div>
            <span className="h-4 w-px bg-white/20" />
            <span className="text-sm text-white/70">{SITE.yearsExperience} years of practice</span>
            <span className="h-4 w-px bg-white/20" />
            <span className="text-sm text-white/70">{ADDRESS.short}</span>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 right-6 hidden lg:flex flex-col items-center gap-2 text-white/40">
        <span className="text-[10px] uppercase tracking-[0.2em] font-semibold rotate-90 origin-center mb-6">Scroll</span>
        <span className="h-12 w-px bg-white/20" />
      </div>
    </section>
  );
}

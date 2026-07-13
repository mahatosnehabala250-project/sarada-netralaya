"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone, CheckCircle2, Star } from "lucide-react";
import { PHONES, SITE } from "@/lib/site-info";

export function Hero() {
  return (
    <section id="top" className="bg-white">
      {/* Top bar */}
      <div className="bg-[#0047AB] text-white text-xs sm:text-sm py-2">
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

      {/* Split layout: 40% text | 60% image */}
      <div className="mx-auto max-w-[1920px] flex flex-col lg:flex-row">
        {/* Left — Text Area (40%) */}
        <div className="w-full lg:w-[40%] flex items-center px-6 sm:px-10 lg:px-14 py-10 sm:py-14 lg:py-20">
          <div className="max-w-lg">
            {/* Subtitle */}
            <div className="text-[#0047AB] text-xs sm:text-sm font-bold uppercase tracking-[0.15em] mb-3">
              Expert Care for Every Eye
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] tracking-tight text-[#0047AB]">
              Your Vision,
              <br />
              Our Mission
            </h1>

            {/* Underline */}
            <div className="h-0.5 w-12 bg-[#0047AB] mt-4 mb-5" />

            {/* Body copy */}
            <p className="text-base sm:text-lg text-[#333333] leading-relaxed">
              Advanced technology, experienced specialists, and compassionate
              care – all dedicated to protecting your precious vision.
            </p>

            {/* Trust points */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                "Painless Phaco surgery (no injection)",
                "FICO (U.K.) qualified surgeon",
                "30+ years of trusted eye care",
                "Same-day appointment available",
              ].map((point) => (
                <div key={point} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0047AB] shrink-0 mt-0.5" />
                  <span className="text-sm text-[#333333]">{point}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/book"
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-[#0047AB] hover:bg-[#003a8c] px-7 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/20 transition-all min-h-[52px]"
              >
                Book Appointment
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href={`tel:${PHONES.primaryTel}`}
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[#0047AB] text-[#0047AB] px-7 py-4 text-base font-bold hover:bg-[#0047AB] hover:text-white transition-colors min-h-[52px]"
              >
                <Phone className="h-5 w-5" />
                Call Now
              </a>
            </div>

            {/* Stats */}
            <div className="mt-8 flex items-center gap-6 pt-6 border-t border-[#E0E0E0]">
              <div>
                <div className="text-2xl font-bold text-[#0047AB]">1000+</div>
                <div className="text-xs text-[#666] font-medium">Happy Patients</div>
              </div>
              <div className="h-8 w-px bg-[#E0E0E0]" />
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-2xl font-bold text-[#0047AB]">{SITE.rating}</span>
                <span className="text-xs text-[#666] font-medium">Rating</span>
              </div>
              <div className="h-8 w-px bg-[#E0E0E0]" />
              <div>
                <div className="text-2xl font-bold text-[#0047AB]">30+</div>
                <div className="text-xs text-[#666] font-medium">Years</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Image Area (60%) */}
        <div className="w-full lg:w-[60%] relative min-h-[300px] sm:min-h-[400px] lg:min-h-[700px]">
          <Image
            src="/images/hero-final.png"
            alt="Eye examination — doctor examining patient with ophthalmic equipment at Sarada Netralaya"
            fill
            priority
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

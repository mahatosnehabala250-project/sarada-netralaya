"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { PHONES } from "@/lib/site-info";

export function Hero() {
  return (
    <section id="top" className="relative bg-[#0047AB]">
      {/* Top bar */}
      <div className="bg-[#0047AB] text-white text-xs sm:text-sm py-2 relative z-10">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Mon–Sat · 9:30 AM – 7:00 PM
          </span>
          <a href={`tel:${PHONES.primaryTel}`} className="hidden sm:flex items-center gap-1.5 font-semibold hover:text-blue-200 transition-colors">
            <Phone className="h-3 w-3" /> {PHONES.primary}
          </a>
        </div>
      </div>

      {/* Mobile/tablet: dedicated portrait poster (headline is baked into the
          image), with CTAs + stats below. Desktop (lg+): full-bleed photo with
          HTML text over its empty left side. */}
      <div className="relative w-full lg:min-h-[750px]">
        <div className="relative lg:hidden aspect-[1023/1537] w-full">
          <Image
            src="/images/hero-mobile.png"
            alt="Your Vision, Our Mission — expert eye care at Sarada Netralaya; doctor examining a patient"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="relative hidden lg:block lg:absolute lg:inset-0">
          <Image
            src="/images/hero-final.png"
            alt="Eye examination — doctor examining patient at Sarada Netralaya"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <div className="bg-white lg:bg-transparent lg:absolute lg:inset-0 lg:flex lg:items-center">
          <div className="w-full lg:w-[42%] px-6 sm:px-10 lg:px-14 py-8 sm:py-10">
            <div className="max-w-lg">
              {/* Headline block — hidden on mobile: the poster image above
                  already carries the same headline and copy. */}
              <div className="hidden lg:block">
                {/* Subtitle */}
                <div className="text-[#0047AB]/90 text-xs sm:text-sm font-bold uppercase tracking-[0.15em] mb-3 ">
                  Expert Care for Every Eye
                </div>

                {/* Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] tracking-tight text-[#0047AB] ">
                  Your Vision,
                  <br />
                  Our Mission
                </h1>

                {/* Underline */}
                <div className="h-0.5 w-12 bg-[#0047AB] mt-4 mb-5" />

                {/* Body copy */}
                <p className="text-base sm:text-lg text-[#0047AB]/90 leading-relaxed ">
                  Advanced technology, experienced specialists, and compassionate
                  care – all dedicated to protecting your precious vision.
                </p>
              </div>

              {/* CTAs */}
              <div className="mt-0 lg:mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/book"
                  className="group inline-flex items-center justify-center gap-2 rounded-lg bg-[#0047AB] hover:bg-[#003a8c] px-7 py-4 text-base font-bold text-white shadow-lg transition-all min-h-[52px]"
                >
                  Book Appointment
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <a
                  href={`tel:${PHONES.primaryTel}`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[#0047AB] text-[#0047AB] px-7 py-4 text-base font-bold hover:bg-[#0047AB]/10 transition-colors min-h-[52px]"
                >
                  <Phone className="h-5 w-5" />
                  Call Now
                </a>
              </div>

              {/* Stats */}
              <div className="mt-8 flex items-center gap-5 pt-6 border-t border-[#0047AB]/20">
                <div>
                  <div className="text-2xl font-bold text-[#0047AB] ">1,000+</div>
                  <div className="text-xs text-[#0047AB]/70 font-medium">Surgeries</div>
                </div>
                <div className="h-8 w-px bg-[#0047AB]/20" />
                <div>
                  <div className="text-2xl font-bold text-[#0047AB] ">15</div>
                  <div className="text-xs text-[#0047AB]/70 font-medium">Yrs Experience</div>
                </div>
                <div className="h-8 w-px bg-[#0047AB]/20" />
                <div>
                  <div className="text-2xl font-bold text-[#0047AB] ">Since 2015</div>
                  <div className="text-xs text-[#0047AB]/70 font-medium">Trusted Care</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

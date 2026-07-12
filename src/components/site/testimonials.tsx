"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { SITE } from "@/lib/site-info";

const TESTIMONIALS = [
  {
    name: "Ramesh Agarwal",
    detail: "Cataract Surgery · Sakchi",
    text: "I was nervous about cataract surgery, but Dr. Dhira explained everything calmly. The Topical Phaco procedure was completely painless — no injection, no patch. I could see clearly the very next morning.",
    initials: "RA",
  },
  {
    name: "Sunita Devi",
    detail: "Glaucoma Evaluation · Bistupur",
    text: "The OCT scan and detailed glaucoma check gave me complete peace of mind. The staff is courteous and the clinic is spotless. Dr. Dhira never rushes — he listens patiently. Best eye hospital in Jamshedpur.",
    initials: "SD",
  },
  {
    name: "Md. Imran",
    detail: "Pediatric Eye Check · Mango",
    text: "Brought my 7-year-old daughter for a squint consultation. The doctor was wonderful with children — made her comfortable throughout. Honest diagnosis, no unnecessary tests. Highly recommend for kids.",
    initials: "MI",
  },
  {
    name: "Priya Sharma",
    detail: "Optical & Eyewear · Kadma",
    text: "Got my computerized eye testing done and picked up stylish frames within my budget. The optical section has a fantastic range for every price point. Quick service, glasses ready in two days.",
    initials: "PS",
  },
  {
    name: "Birendra Mahato",
    detail: "Retina Consultation · Adityapur",
    text: "Travelled from Adityapur specifically for Dr. Dhira's retinal evaluation. Worth every minute. The HVF and OCT reports were explained in simple language. Thirty years of experience really shows.",
    initials: "BM",
  },
];

export function Testimonials() {
  const [active, setActive] = useState(0);
  const count = TESTIMONIALS.length;
  const go = (dir: number) => setActive((i) => (i + dir + count) % count);
  const t = TESTIMONIALS[active];

  return (
    <section id="testimonials" className="py-20 sm:py-32 bg-[#faf8f3]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#0a3d4a]/40">03 — Stories</span>
          <h2 className="mt-4 font-serif-display text-4xl sm:text-5xl font-bold tracking-tight text-[#0a3d4a]">
            In their words
          </h2>
          <div className="mt-4 inline-flex items-center gap-2">
            <div className="flex">
              {[0,1,2,3,4].map((i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-sm font-semibold text-[#0a3d4a]">{SITE.rating}</span>
            <span className="text-sm text-[#0a3d4a]/50">· {SITE.reviewsCount} Google reviews</span>
          </div>
        </div>

        {/* Large quote */}
        <div className="relative max-w-3xl mx-auto">
          <Quote className="absolute -top-4 -left-2 h-16 w-16 text-[#0a3d4a]/8" fill="currentColor" />

          <div key={active} className="reveal">
            <p className="font-serif-display text-2xl sm:text-3xl leading-[1.4] text-[#0a3d4a] font-medium relative z-10">
              "{t.text}"
            </p>

            <div className="mt-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0a3d4a] text-[#faf8f3] font-serif-display text-sm font-bold">
                  {t.initials}
                </span>
                <div>
                  <div className="font-bold text-[#0a3d4a]">{t.name}</div>
                  <div className="text-xs text-[#0a3d4a]/50">{t.detail}</div>
                </div>
              </div>

              {/* Nav */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => go(-1)}
                  aria-label="Previous"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0a3d4a]/15 text-[#0a3d4a] hover:bg-[#0a3d4a] hover:text-[#faf8f3] transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => go(1)}
                  aria-label="Next"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0a3d4a]/15 text-[#0a3d4a] hover:bg-[#0a3d4a] hover:text-[#faf8f3] transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="mt-8 flex justify-center gap-1.5">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Story ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === active ? "w-8 bg-[#0a3d4a]" : "w-1.5 bg-[#0a3d4a]/20 hover:bg-[#0a3d4a]/40"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

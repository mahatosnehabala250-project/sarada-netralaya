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
    text: "Travelled from Adityapur specifically for Dr. Dhira's retinal evaluation. Worth every minute. The HVF and OCT reports were explained in simple language. 30+ years of experience really shows.",
    initials: "BM",
  },
];

export function Testimonials() {
  const [active, setActive] = useState(0);
  const count = TESTIMONIALS.length;
  const go = (dir: number) => setActive((i) => (i + dir + count) % count);
  const t = TESTIMONIALS[active];

  return (
    <section id="testimonials" className="py-14 sm:py-20 lg:py-24 bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#10b981] mb-3">
            Patient Stories
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0a3d4a]">
            Loved by thousands
          </h2>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white border border-amber-200 px-4 py-2 shadow-sm">
            <div className="flex">
              {[0,1,2,3,4].map((i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-sm font-bold text-[#0a3d4a]">{SITE.rating}</span>
            <span className="text-sm text-slate-500">· {SITE.reviewsCount} Google reviews</span>
          </div>
        </div>

        {/* Quote card */}
        <div className="relative rounded-2xl bg-white border border-slate-200 shadow-lg p-6 sm:p-10">
          <Quote className="absolute top-6 left-6 h-10 w-10 text-[#10b981]/15" fill="currentColor" />

          <div key={active} className="reveal">
            <p className="text-lg sm:text-xl lg:text-2xl leading-relaxed text-slate-700 font-medium relative z-10 pl-8 sm:pl-10">
              "{t.text}"
            </p>

            <div className="mt-6 sm:mt-8 flex items-center justify-between gap-4 pl-8 sm:pl-10">
              <div className="flex items-center gap-3 min-w-0">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0a3d4a] text-white font-bold">
                  {t.initials}
                </span>
                <div className="min-w-0">
                  <div className="font-bold text-[#0a3d4a] truncate">{t.name}</div>
                  <div className="text-xs text-slate-400 truncate">{t.detail}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => go(-1)}
                  aria-label="Previous"
                  className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-[#0a3d4a] hover:text-white hover:border-[#0a3d4a] transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => go(1)}
                  aria-label="Next"
                  className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-[#0a3d4a] hover:text-white hover:border-[#0a3d4a] transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="mt-6 flex justify-center gap-1.5">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Story ${i + 1}`}
              className={`h-2 rounded-full transition-all ${i === active ? "w-8 bg-[#10b981]" : "w-2 bg-slate-300 hover:bg-slate-400"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

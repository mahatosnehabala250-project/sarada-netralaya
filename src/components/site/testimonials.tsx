"use client";

import { useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

type Testimonial = {
  name: string;
  detail: string;
  text: string;
  rating: number;
  initials: string;
  tone: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Ramesh Agarwal",
    detail: "Cataract Surgery · Sakchi",
    rating: 5,
    initials: "RA",
    tone: "from-teal-500 to-cyan-600",
    text: "I was nervous about cataract surgery, but Dr. Dhira explained everything calmly. The Topical Phaco procedure was completely painless — no injection, no patch. I could see clearly the very next morning. Truly grateful to the entire team.",
  },
  {
    name: "Sunita Devi",
    detail: "Glaucoma Evaluation · Bistupur",
    rating: 5,
    initials: "SD",
    tone: "from-emerald-500 to-teal-600",
    text: "The OCT scan and detailed glaucoma check gave me complete peace of mind. The staff is courteous and the clinic is spotless. Dr. Dhira never rushes — he listens patiently. Best eye hospital in Jamshedpur, hands down.",
  },
  {
    name: "Md. Imran",
    detail: "Pediatric Eye Check · Mango",
    rating: 5,
    initials: "MI",
    tone: "from-sky-500 to-blue-600",
    text: "Brought my 7-year-old daughter for a squint consultation. The doctor was wonderful with children — made her comfortable throughout. The diagnosis was clear and honest, with no unnecessary tests. Highly recommend for kids' eye care.",
  },
  {
    name: "Priya Sharma",
    detail: "Optical & Eyewear · Kadma",
    rating: 5,
    initials: "PS",
    tone: "from-amber-500 to-orange-600",
    text: "Got my new computerized eye testing done and picked up stylish frames within my budget. The optical section has a fantastic range for every price point. Quick service and the glasses were ready in two days. Very satisfied!",
  },
  {
    name: "Birendra Mahato",
    detail: "Retina Consultation · Adityapur",
    rating: 5,
    initials: "BM",
    tone: "from-rose-500 to-pink-600",
    text: "Travelled from Adityapur specifically for Dr. Dhira's retinal evaluation. Worth every minute of the journey. The HVF and OCT reports were explained in simple language. Thirty years of experience really shows in his diagnosis.",
  },
  {
    name: "Anita Sahu",
    detail: "Squint Correction · Sonari",
    rating: 5,
    initials: "AS",
    tone: "from-violet-500 to-purple-600",
    text: "After years of hiding my squint, I finally got it corrected at Sarada Netralaya. The result is life-changing. The clinic follows strict hygiene and the follow-up care was excellent. Thank you for giving me my confidence back.",
  },
];

export function Testimonials() {
  const [active, setActive] = useState(0);
  const count = TESTIMONIALS.length;

  const go = (dir: number) => setActive((i) => (i + dir + count) % count);

  return (
    <section id="testimonials" className="py-16 sm:py-24 bg-white relative overflow-hidden">
      <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-teal-50 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-emerald-50 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 ring-1 ring-amber-200">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" /> Patient Stories
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-[#084f67]">
            Loved by Thousands of Patients
          </h2>
          <div className="mt-3 inline-flex items-center gap-2 text-sm text-slate-600">
            <span className="flex items-center gap-0.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </span>
            <span className="font-bold text-[#084f67]">4.9</span>
            <span className="text-slate-400">·</span>
            <span>329+ Google Reviews</span>
          </div>
        </div>

        {/* Featured testimonial carousel */}
        <div className="mt-12 max-w-3xl mx-auto">
          <div className="relative rounded-3xl bg-gradient-to-br from-[#f0f9fb] to-white border border-slate-200 shadow-xl p-8 sm:p-10">
            <Quote className="absolute top-6 right-6 h-12 w-12 text-[#0b6e8f]/10" fill="currentColor" />

            <div className="flex items-center gap-0.5 mb-4">
              {Array.from({ length: TESTIMONIALS[active].rating }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
              ))}
            </div>

            <p className="text-lg sm:text-xl leading-relaxed text-slate-700 font-medium relative z-10">
              "{TESTIMONIALS[active].text}"
            </p>

            <div className="mt-6 flex items-center gap-3">
              <span className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${TESTIMONIALS[active].tone} text-white font-bold shadow-md`}>
                {TESTIMONIALS[active].initials}
              </span>
              <div>
                <div className="font-bold text-[#084f67]">{TESTIMONIALS[active].name}</div>
                <div className="text-xs text-slate-500">{TESTIMONIALS[active].detail}</div>
              </div>
            </div>

            {/* Nav */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex gap-1.5">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      i === active ? "w-7 bg-[#0b6e8f]" : "w-1.5 bg-slate-300 hover:bg-slate-400"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => go(-1)}
                  aria-label="Previous testimonial"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-[#0b6e8f] hover:text-white hover:border-[#0b6e8f] transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => go(1)}
                  aria-label="Next testimonial"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-[#0b6e8f] hover:text-white hover:border-[#0b6e8f] transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mini grid of all testimonials */}
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.name}
              onClick={() => setActive(i)}
              className={`text-left rounded-2xl border p-4 transition-all ${
                i === active
                  ? "border-[#0b6e8f] bg-teal-50/50 shadow-md"
                  : "border-slate-200 bg-white hover:border-[#0b6e8f]/30 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${t.tone} text-white text-xs font-bold`}>
                  {t.initials}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-[#084f67] truncate">{t.name}</div>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-2.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {t.text}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

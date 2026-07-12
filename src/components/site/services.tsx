"use client";

import { useState } from "react";
import { ArrowRight, Eye, Microscope, Glasses, Plus, Minus } from "lucide-react";

type ServiceGroup = {
  num: string;
  icon: typeof Eye;
  title: string;
  desc: string;
  items: string[];
};

const GROUPS: ServiceGroup[] = [
  {
    num: "01",
    icon: Eye,
    title: "Comprehensive Eye Care",
    desc: "Complete medical and surgical eye services — from routine examinations to advanced procedures.",
    items: [
      "Cataract — Topical Phaco (No Injection, No Patch)",
      "Glaucoma Evaluation & Management",
      "Pediatric Eye Diseases",
      "Squint Correction",
      "Retinal Diseases",
      "Oculoplasty",
    ],
  },
  {
    num: "02",
    icon: Microscope,
    title: "Advanced Diagnostics",
    desc: "Precision instrumentation for accurate diagnosis and modern surgical outcomes.",
    items: [
      "Optical Biometry (Premium Cataract Surgery)",
      "OCT — Retina & Glaucoma Evaluation",
      "HVF — Glaucoma Visual Field Analysis",
      "Latest Phaco & Laser Facility",
    ],
  },
  {
    num: "03",
    icon: Glasses,
    title: "Optical Services",
    desc: "Eyewear solutions for every need and budget, with in-house computerized testing.",
    items: [
      "Eyeglasses for Every Budget",
      "Contact Lenses",
      "Computerized Eye Testing",
      "Kids' Frames",
    ],
  },
];

export function Services() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="services" className="py-14 sm:py-20 lg:py-32 bg-[#faf8f3]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 sm:mb-16 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#0a3d4a]/40">01 — Care</span>
            </div>
            <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0a3d4a] leading-[1.1]">
              What we treat
            </h2>
          </div>
          <p className="hidden sm:block max-w-xs text-sm text-[#0a3d4a]/55 leading-relaxed pb-2">
            From routine eye testing to advanced surgical care — delivered with
            three decades of expertise.
          </p>
        </div>

        {/* Editorial list */}
        <div className="border-t border-[#0a3d4a]/10">
          {GROUPS.map((g, i) => {
            const isOpen = open === i;
            return (
              <div key={g.num} className="border-b border-[#0a3d4a]/10">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="group w-full flex items-center gap-3 sm:gap-8 py-5 sm:py-8 text-left hover:bg-[#0a3d4a]/[0.02] transition-colors px-1 sm:px-2 -mx-1 sm:-mx-2 min-h-[56px]"
                >
                  <span className="font-serif-display text-xl sm:text-2xl lg:text-3xl font-bold text-[#0a3d4a]/25 tabular-nums w-8 sm:w-12 shrink-0">
                    {g.num}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif-display text-xl sm:text-2xl lg:text-3xl font-bold text-[#0a3d4a] leading-tight">
                      {g.title}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-[#0a3d4a]/50 hidden sm:block">{g.desc}</p>
                  </div>
                  <span className="shrink-0 flex h-9 w-9 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-[#0a3d4a]/15 text-[#0a3d4a] group-hover:bg-[#0a3d4a] group-hover:text-[#faf8f3] transition-colors">
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>
                {/* Expand */}
                {isOpen && (
                  <div className="pb-6 sm:pb-8 pl-11 sm:pl-16 lg:pl-20 pr-1 sm:pr-4 animate-[reveal-up_0.3s_ease-out]">
                    <p className="sm:hidden text-xs sm:text-sm text-[#0a3d4a]/50 mb-3 sm:mb-4">{g.desc}</p>
                    <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
                      {g.items.map((item) => (
                        <div key={item} className="flex items-start gap-2.5 py-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                          <span className="text-sm text-[#0a3d4a]/80">{item}</span>
                        </div>
                      ))}
                    </div>
                    <a
                      href="#book"
                      onClick={(e) => { e.preventDefault(); document.querySelector("#book")?.scrollIntoView({ behavior: "smooth" }); }}
                      className="mt-5 sm:mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-[#0a3d4a] hover:gap-2.5 transition-all min-h-[44px]"
                    >
                      Book this service
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

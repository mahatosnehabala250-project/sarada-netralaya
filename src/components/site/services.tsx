"use client";

import { Eye, Microscope, Glasses, Check, Stethoscope, Baby, EyeOff, Scan, Activity, Zap, MonitorSmartphone, Contact, ArrowRight, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Service = {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  accent: string;
  iconWrap: string;
  tag: string;
  items: { icon: LucideIcon; label: string }[];
};

const SERVICES: Service[] = [
  {
    icon: Eye,
    title: "Centre for Comprehensive Eye Care",
    subtitle: "Complete medical eye services under one roof",
    accent: "from-[#0b6e8f] to-[#084f67]",
    iconWrap: "bg-gradient-to-br from-[#0b6e8f] to-[#084f67] text-white",
    tag: "Medical",
    items: [
      { icon: Stethoscope, label: "Cataract — Topical Phaco (No Injection, No Patch)" },
      { icon: Activity, label: "Glaucoma Evaluation & Management" },
      { icon: Baby, label: "Pediatric Eye Diseases" },
      { icon: EyeOff, label: "Squint Correction" },
      { icon: Scan, label: "Retinal Diseases" },
      { icon: Eye, label: "Oculoplasty" },
    ],
  },
  {
    icon: Microscope,
    title: "Advanced Technology",
    subtitle: "Precision diagnostics & modern surgical equipment",
    accent: "from-[#084f67] to-[#063b4f]",
    iconWrap: "bg-gradient-to-br from-emerald-500 to-teal-600 text-white",
    tag: "Diagnostics",
    items: [
      { icon: Scan, label: "Optical Biometry (Premium Cataract Surgery)" },
      { icon: Microscope, label: "OCT (Retina & Glaucoma Evaluation)" },
      { icon: Activity, label: "HVF (Glaucoma Evaluation)" },
      { icon: Zap, label: "Latest Phaco & Laser Facility" },
    ],
  },
  {
    icon: Glasses,
    title: "Optical Services",
    subtitle: "Eyewear solutions for every need and budget",
    accent: "from-[#10b981] to-[#059669]",
    iconWrap: "bg-gradient-to-br from-[#10b981] to-[#059669] text-white",
    tag: "Eyewear",
    items: [
      { icon: Glasses, label: "Eyeglasses for Every Budget" },
      { icon: Contact, label: "Contact Lenses" },
      { icon: MonitorSmartphone, label: "Computerized Eye Testing" },
      { icon: Baby, label: "Kids' Frames" },
    ],
  },
];

export function Services() {
  const goBook = () => document.querySelector("#book")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="services" className="py-16 sm:py-24 bg-gradient-to-b from-white to-[#f0f9fb] relative overflow-hidden">
      <div className="pointer-events-none absolute top-20 -right-16 h-64 w-64 rounded-full bg-teal-50 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0b6e8f]/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#0b6e8f] ring-1 ring-[#0b6e8f]/15">
            <Sparkles className="h-3.5 w-3.5" /> Our Services
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-[#084f67]">
            Complete Eye Care, Advanced Technology
          </h2>
          <p className="mt-3 text-base text-slate-600">
            From routine eye testing to advanced surgical care — everything you
            need for healthy vision, delivered with three decades of expertise.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:gap-7 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <article
              key={s.title}
              className="group relative rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-7 shadow-sm hover:shadow-xl hover:shadow-[#0b6e8f]/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
            >
              {/* top accent bar */}
              <div className={`absolute inset-x-0 top-0 h-1.5 rounded-t-3xl bg-gradient-to-r ${s.accent}`} />

              {/* tag */}
              <span className="absolute top-5 right-5 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {s.tag}
              </span>

              <div className="flex items-center gap-4">
                <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${s.iconWrap} shadow-md group-hover:scale-105 group-hover:rotate-3 transition-all`}>
                  <s.icon className="h-7 w-7" strokeWidth={2.1} />
                </span>
                <div className="text-5xl font-black text-slate-100 leading-none group-hover:text-[#0b6e8f]/10 transition-colors">
                  {String(i + 1).padStart(2, "0")}
                </div>
              </div>

              <h3 className="mt-5 text-lg font-bold text-[#084f67] leading-snug">
                {s.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500">{s.subtitle}</p>

              <ul className="mt-5 space-y-2.5 flex-1">
                {s.items.map((it) => (
                  <li key={it.label} className="flex items-start gap-2.5 group/item">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 group-hover/item:bg-emerald-100 transition-colors">
                      <Check className="h-3.5 w-3.5 text-emerald-600" strokeWidth={3} />
                    </span>
                    <span className="text-sm text-slate-700 leading-relaxed">
                      {it.label}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={goBook}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-[#0b6e8f] hover:text-[#084f67] group/cta"
              >
                Book this service
                <ArrowRight className="h-4 w-4 transition-transform group-hover/cta:translate-x-1" />
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

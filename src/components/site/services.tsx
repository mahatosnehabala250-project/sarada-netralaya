"use client";

import { Eye, Microscope, Glasses, Check, Stethoscope, Baby, EyeOff, Scan, Activity, Zap, MonitorSmartphone, Contact } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Service = {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  accent: string;
  iconWrap: string;
  items: { icon: LucideIcon; label: string }[];
};

const SERVICES: Service[] = [
  {
    icon: Eye,
    title: "Centre for Comprehensive Eye Care",
    subtitle: "Complete medical eye services under one roof",
    accent: "from-[#0b6e8f] to-[#084f67]",
    iconWrap: "bg-[#0b6e8f]/10 text-[#0b6e8f]",
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
    iconWrap: "bg-emerald-100 text-emerald-700",
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
    iconWrap: "bg-[#10b981]/10 text-[#10b981]",
    items: [
      { icon: Glasses, label: "Eyeglasses for Every Budget" },
      { icon: Contact, label: "Contact Lenses" },
      { icon: MonitorSmartphone, label: "Computerized Eye Testing" },
      { icon: Baby, label: "Kids' Frames" },
    ],
  },
];

export function Services() {
  return (
    <section id="services" className="py-16 sm:py-24 bg-gradient-to-b from-white to-[#f0f9fb]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block rounded-full bg-[#0b6e8f]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#0b6e8f]">
            Our Services
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-[#084f67]">
            Complete Eye Care, Advanced Technology
          </h2>
          <p className="mt-3 text-base text-[#0f2f3a]/65">
            From routine eye testing to advanced surgical care — everything you
            need for healthy vision, delivered with three decades of expertise.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:gap-7 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <article
              key={s.title}
              className="group relative rounded-2xl bg-white border border-[#0b6e8f]/10 p-6 sm:p-7 shadow-sm hover:shadow-xl hover:shadow-[#0b6e8f]/10 hover:-translate-y-1 transition-all duration-300"
            >
              {/* top accent bar */}
              <div className={`absolute inset-x-0 top-0 h-1.5 rounded-t-2xl bg-gradient-to-r ${s.accent}`} />

              <div className="flex items-center gap-4">
                <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${s.iconWrap} group-hover:scale-105 transition-transform`}>
                  <s.icon className="h-7 w-7" strokeWidth={2.1} />
                </span>
                <div className="text-5xl font-black text-[#0b6e8f]/8 leading-none">
                  {String(i + 1).padStart(2, "0")}
                </div>
              </div>

              <h3 className="mt-5 text-lg font-bold text-[#084f67] leading-snug">
                {s.title}
              </h3>
              <p className="mt-1 text-sm text-[#0f2f3a]/60">{s.subtitle}</p>

              <ul className="mt-5 space-y-2.5">
                {s.items.map((it) => (
                  <li key={it.label} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#10b981]/15">
                      <Check className="h-3.5 w-3.5 text-emerald-600" strokeWidth={3} />
                    </span>
                    <span className="text-sm text-[#0f2f3a]/80 leading-relaxed">
                      {it.label}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

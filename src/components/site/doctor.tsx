"use client";

import { Award, GraduationCap, Stethoscope, ArrowRight, BadgeCheck } from "lucide-react";
import { DOCTOR, SITE } from "@/lib/site-info";

const QUALS = [
  { label: "DOMS", desc: "Ophthalmic Medicine & Surgery" },
  { label: "DNB", desc: "Diplomate, National Board" },
  { label: "FICO (U.K.)", desc: "International Council of Ophthalmology" },
];

export function Doctor() {
  return (
    <section id="doctor" className="py-14 sm:py-20 lg:py-32 bg-[#0a3d4a] relative overflow-hidden">
      <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 rounded-full bg-emerald-500/8 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-20 items-center">
          {/* Portrait panel */}
          <div className="relative">
            <div className="relative aspect-[4/5] max-w-[280px] sm:max-w-sm mx-auto">
              {/* Frame */}
              <div className="absolute -inset-2 sm:-inset-3 border border-white/15 rounded-[1.5rem] sm:rounded-[2rem]" />
              <div className="relative h-full w-full rounded-[1.5rem] sm:rounded-[2rem] bg-gradient-to-br from-[#0f5263] to-[#082e38] overflow-hidden ring-1 ring-white/10 flex items-center justify-center">
                <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "24px 24px" }} />
                <span className="font-serif-display text-[6rem] sm:text-[8rem] font-bold text-white/15">ND</span>
                <span className="absolute bottom-4 sm:bottom-5 left-4 sm:left-5 right-4 sm:right-5">
                  <div className="text-white font-serif-display text-lg sm:text-xl font-bold">{DOCTOR.name}</div>
                  <div className="text-emerald-300 text-[10px] sm:text-xs uppercase tracking-wider mt-1">{DOCTOR.role}</div>
                </span>
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-3 -right-2 sm:-bottom-4 sm:-right-4 rounded-xl sm:rounded-2xl bg-emerald-500 text-[#0a3d4a] px-3 py-2 sm:px-4 sm:py-3 shadow-xl">
                <div className="font-serif-display text-xl sm:text-2xl font-bold leading-none">{SITE.yearsExperience}</div>
                <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mt-0.5">Years</div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-emerald-300/60">02 — Your Surgeon</span>
            </div>
            <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.1]">
              {DOCTOR.name}
            </h2>
            <p className="mt-2 text-emerald-300/80 text-xs sm:text-sm font-medium">
              {DOCTOR.role} · {DOCTOR.qualifications}
            </p>

            <p className="mt-5 sm:mt-6 text-sm sm:text-base text-white/65 leading-relaxed max-w-xl">
              {DOCTOR.bio}
            </p>

            {/* Training */}
            <div className="mt-6 sm:mt-8 flex items-start gap-3 rounded-xl bg-white/[0.04] border border-white/10 p-3.5 sm:p-4 max-w-md">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
                <Stethoscope className="h-4 w-4" />
              </span>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/60">Trained at</div>
                <div className="text-sm text-white font-medium mt-0.5">{DOCTOR.training}</div>
              </div>
            </div>

            {/* Qualifications */}
            <div className="mt-6 sm:mt-8 space-y-2.5 sm:space-y-3">
              {QUALS.map((q) => (
                <div key={q.label} className="flex flex-col xs:flex-row xs:items-baseline gap-0.5 xs:gap-4 pb-2.5 sm:pb-3 border-b border-white/8 last:border-0">
                  <span className="font-serif-display text-base sm:text-lg font-bold text-white xs:w-28 shrink-0">{q.label}</span>
                  <span className="text-xs sm:text-sm text-white/50">{q.desc}</span>
                </div>
              ))}
            </div>

            <a
              href="#book"
              onClick={(e) => { e.preventDefault(); document.querySelector("#book")?.scrollIntoView({ behavior: "smooth" }); }}
              className="mt-6 sm:mt-8 inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 px-5 sm:px-6 py-3 text-sm font-bold text-white transition-all hover:gap-3 min-h-[44px]"
            >
              Book a consultation
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

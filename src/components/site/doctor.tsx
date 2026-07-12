"use client";

import {
  Award, GraduationCap, Stethoscope, BadgeCheck, Quote,
  Sparkles, MapPin, ArrowRight, ShieldCheck, Eye,
} from "lucide-react";
import { DOCTOR, SITE } from "@/lib/site-info";

const QUALS = [
  { icon: GraduationCap, label: "DOMS", desc: "Diploma in Ophthalmic Medicine & Surgery" },
  { icon: GraduationCap, label: "DNB", desc: "Diplomate of National Board" },
  { icon: Award, label: "FICO (U.K.)", desc: "Fellow, International Council of Ophthalmology" },
];

const EXPERTISE = [
  "Topical Phaco Cataract Surgery",
  "Glaucoma Diagnosis & Management",
  "Retinal Disease Evaluation",
  "Squint & Pediatric Eye Care",
  "Oculoplasty",
  "Comprehensive Eye Examination",
];

export function Doctor() {
  return (
    <section id="doctor" className="py-16 sm:py-24 bg-white relative overflow-hidden">
      <div className="pointer-events-none absolute top-10 -left-20 h-72 w-72 rounded-full bg-teal-50 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 -right-20 h-72 w-72 rounded-full bg-emerald-50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0b6e8f]/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#0b6e8f] ring-1 ring-[#0b6e8f]/15">
            <Sparkles className="h-3.5 w-3.5" /> Meet Your Doctor
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-[#084f67]">
            Expert Care You Can Trust
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Three decades of dedication to eye health, backed by international
            qualifications and advanced training.
          </p>
        </div>

        <div className="mt-12 max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-[#0b6e8f]/8">
            <div className="grid md:grid-cols-[300px_1fr]">
              {/* Portrait / monogram panel */}
              <div className="relative bg-gradient-to-br from-[#0b6e8f] via-[#074860] to-[#052f3f] p-8 md:p-10 flex flex-col items-center justify-center text-center overflow-hidden">
                <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "22px 22px" }} />
                <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-emerald-400/20 blur-2xl" />

                <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/25 shadow-2xl">
                  <span className="text-5xl font-bold text-white tracking-tight">ND</span>
                  <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 border-2 border-[#052f3f]">
                    <BadgeCheck className="h-4 w-4 text-white" />
                  </span>
                </div>
                <div className="relative mt-5 text-white">
                  <div className="text-xl font-bold leading-tight">{DOCTOR.name}</div>
                  <div className="text-sm text-white/70 mt-0.5">{DOCTOR.role}</div>
                </div>
                <div className="relative mt-5 flex flex-wrap gap-1.5 justify-center">
                  {QUALS.map((q) => (
                    <span
                      key={q.label}
                      className="inline-flex items-center gap-1 rounded-full bg-white/12 border border-white/20 px-2.5 py-1 text-[10.5px] font-semibold text-white backdrop-blur-sm"
                    >
                      <q.icon className="h-3 w-3" />
                      {q.label}
                    </span>
                  ))}
                </div>
                <div className="relative mt-6 flex items-center gap-1.5 text-[11px] text-white/60">
                  <MapPin className="h-3 w-3" />
                  Sakchi, Jamshedpur
                </div>
              </div>

              {/* Bio */}
              <div className="p-7 sm:p-9">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-[#084f67] leading-tight">
                      {DOCTOR.name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {DOCTOR.role} · {DOCTOR.qualifications}
                    </p>
                  </div>
                </div>

                {/* Training highlight */}
                <div className="mt-5 flex items-start gap-3 rounded-xl bg-gradient-to-r from-[#0b6e8f]/8 to-emerald-50/50 border border-[#0b6e8f]/12 p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0b6e8f] text-white">
                    <Stethoscope className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#0b6e8f]">Specialist Training</div>
                    <p className="text-sm text-slate-700 mt-0.5 font-medium">
                      {DOCTOR.training}
                    </p>
                  </div>
                </div>

                {/* Bio quote */}
                <div className="relative mt-5">
                  <Quote className="absolute -top-1 -left-1 h-7 w-7 text-[#0b6e8f]/12" fill="currentColor" />
                  <p className="pl-7 text-[15px] leading-relaxed text-slate-700">
                    {DOCTOR.bio}
                  </p>
                </div>

                {/* Credentials list */}
                <div className="mt-6">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">Qualifications</div>
                  <div className="space-y-2">
                    {QUALS.map((q) => (
                      <div key={q.label} className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#0b6e8f]/10 text-[#0b6e8f]">
                          <q.icon className="h-3.5 w-3.5" />
                        </span>
                        <div>
                          <span className="text-sm font-bold text-[#084f67]">{q.label}</span>
                          <span className="text-xs text-slate-500 ml-1.5">— {q.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expertise tags */}
                <div className="mt-5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Areas of Expertise</div>
                  <div className="flex flex-wrap gap-1.5">
                    {EXPERTISE.map((e) => (
                      <span key={e} className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
                        <Eye className="h-3 w-3 text-[#0b6e8f]/60" />
                        {e}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats + CTA */}
                <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="grid grid-cols-3 gap-2 flex-1">
                    <Stat value={`${SITE.yearsExperience}+`} label="Years" />
                    <Stat value={SITE.rating} label="Rating" />
                    <Stat value={SITE.reviewsCount} label="Reviews" />
                  </div>
                  <a
                    href="#book"
                    onClick={(e) => { e.preventDefault(); document.querySelector("#book")?.scrollIntoView({ behavior: "smooth" }); }}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0b6e8f] hover:bg-[#084f67] px-5 py-3 text-sm font-bold text-white shadow-md group"
                  >
                    Book Consultation
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-2.5 text-center">
      <div className="text-xl font-bold text-[#0b6e8f] tabular-nums">{value}</div>
      <div className="text-[10px] font-medium text-slate-500 leading-tight mt-0.5">
        {label}
      </div>
    </div>
  );
}

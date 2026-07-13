"use client";

import Image from "next/image";
import { GraduationCap, Stethoscope, ArrowRight, BadgeCheck, Award } from "lucide-react";
import { DOCTOR, SITE } from "@/lib/site-info";

const QUALS = [
  { icon: GraduationCap, label: "DOMS", desc: "Ophthalmic Medicine & Surgery" },
  { icon: GraduationCap, label: "DNB", desc: "Diplomate, National Board" },
  { icon: Award, label: "FICO (U.K.)", desc: "International Council of Ophthalmology" },
];

export function Doctor() {
  return (
    <section id="doctor" className="py-14 sm:py-20 lg:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Portrait */}
          <div className="relative order-2 lg:order-1">
            <div className="relative max-w-md mx-auto">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl shadow-[#0a3d4a]/15">
                <Image
                  src="/images/doctor-real.jpg"
                  alt={`${DOCTOR.name} — ${DOCTOR.role}`}
                  fill
                  sizes="(min-width: 1024px) 28rem, 100vw"
                  className="object-cover"
                />
              </div>
              {/* Experience badge */}
              <div className="absolute -bottom-4 -right-2 sm:-right-4 rounded-2xl bg-[#10b981] text-white px-5 py-4 shadow-xl">
                <div className="text-3xl font-bold leading-none">30+</div>
                <div className="text-[10px] font-bold uppercase tracking-wider mt-1">Years Experience</div>
              </div>
              {/* Verified badge */}
              <div className="absolute top-4 -left-2 sm:-left-4 flex items-center gap-1.5 rounded-full bg-white shadow-lg px-3 py-1.5">
                <BadgeCheck className="h-4 w-4 text-[#10b981]" />
                <span className="text-xs font-bold text-[#0a3d4a]">Verified</span>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="order-1 lg:order-2">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#10b981] mb-3">
              Meet Your Surgeon
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0a3d4a] leading-tight">
              {DOCTOR.name}
            </h2>
            <p className="mt-2 text-[#10b981] font-semibold text-sm sm:text-base">
              {DOCTOR.role} · {DOCTOR.qualifications}
            </p>

            <p className="mt-5 text-base text-slate-600 leading-relaxed">
              {DOCTOR.bio}
            </p>

            {/* Training */}
            <div className="mt-6 flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-200 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0a3d4a] text-white">
                <Stethoscope className="h-5 w-5" />
              </span>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Specialist Training</div>
                <div className="text-sm text-[#0a3d4a] font-semibold mt-0.5">{DOCTOR.training}</div>
              </div>
            </div>

            {/* Qualifications */}
            <div className="mt-6 grid sm:grid-cols-3 gap-3">
              {QUALS.map((q) => (
                <div key={q.label} className="rounded-xl border border-slate-200 bg-white p-3.5 text-center">
                  <q.icon className="mx-auto h-5 w-5 text-[#10b981]" />
                  <div className="mt-1.5 text-sm font-bold text-[#0a3d4a]">{q.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{q.desc}</div>
                </div>
              ))}
            </div>

            <a
              href="#book"
              onClick={(e) => { e.preventDefault(); document.querySelector("#book")?.scrollIntoView({ behavior: "smooth" }); }}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#0a3d4a] hover:bg-[#082e38] text-white px-6 py-3.5 text-sm font-bold transition-colors min-h-[48px]"
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

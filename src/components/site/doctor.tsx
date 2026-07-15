"use client";

import Image from "next/image";
import Link from "next/link";
import { GraduationCap, Stethoscope, ArrowRight, Award, Trophy, Eye as EyeIcon } from "lucide-react";
import { DOCTORS } from "@/lib/site-info";

export function Doctor() {
  return (
    <section id="doctor" className="py-14 sm:py-20 lg:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#0047AB] mb-3">
            Meet Our Surgeons
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0047AB]">
            Expert care you can trust
          </h2>
          <p className="mt-3 text-base text-[#333] max-w-2xl mx-auto">
            Our team of qualified ophthalmic surgeons brings decades of combined
            experience and international qualifications to your eye care.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {DOCTORS.map((doc) => (
            <div key={doc.name} className="rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden shadow-sm">
              <div className="relative">
                {doc.image ? (
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={doc.image} alt={doc.name} fill sizes="(min-width: 1024px) 36rem, 100vw" className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0047AB]/80 to-transparent" />
                  </div>
                ) : (
                  <div className="relative aspect-[16/10] bg-gradient-to-br from-[#0047AB] to-[#003a8c] flex items-center justify-center">
                    <span className="text-6xl font-bold text-white/20">NB</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">{doc.name}</h3>
                  <p className="text-white/80 text-sm mt-0.5">{doc.role}</p>
                </div>
                <div className="absolute top-4 right-4 rounded-xl bg-white shadow-lg px-4 py-2.5">
                  <div className="text-2xl font-bold text-[#0047AB] leading-none">{doc.experience}</div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Experience</div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex items-start gap-3 mb-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0047AB] text-white">
                    <GraduationCap className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Qualifications</div>
                    <div className="text-sm font-semibold text-[#374151] mt-0.5">{doc.qualifications}</div>
                  </div>
                </div>

                <p className="text-sm text-[#333] leading-relaxed mb-4">{doc.bio}</p>

                <div className="flex items-start gap-3 mb-4 rounded-lg bg-white border border-slate-200 p-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0047AB]/10 text-[#0047AB]">
                    <Stethoscope className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Trained at</div>
                    <div className="text-sm font-medium text-[#374151] mt-0.5">{doc.training}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Areas of Expertise</div>
                  <div className="flex flex-wrap gap-1.5">
                    {doc.expertise.map((e) => (
                      <span key={e} className="inline-flex items-center gap-1 rounded-md bg-[#0047AB]/8 px-2 py-1 text-[11px] font-medium text-[#0047AB]">
                        <EyeIcon className="h-3 w-3" />{e}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-4 pt-4 border-t border-slate-200">
                  <div className="shrink-0">
                    <div className="text-lg font-bold text-[#0047AB]">{doc.surgeries}</div>
                    <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Surgeries</div>
                  </div>
                  {"awards" in doc && (doc as unknown as { awards?: string[] }).awards && (
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                        <Trophy className="h-3 w-3" /> Awards &amp; Achievements
                      </div>
                      <ul className="space-y-1">
                        {(doc as unknown as { awards: string[] }).awards.map((award) => (
                          <li key={award} className="text-[11px] text-[#333] flex items-start gap-1.5">
                            <Award className="h-3 w-3 text-amber-500 shrink-0 mt-0.5" />{award}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/book" className="inline-flex items-center gap-2 rounded-xl bg-[#0047AB] hover:bg-[#003a8c] text-white px-7 py-3.5 text-sm font-bold transition-colors min-h-[48px]">
            Book a consultation
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

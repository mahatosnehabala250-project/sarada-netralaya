"use client";

import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  Stethoscope,
  ArrowRight,
  ArrowLeft,
  Award,
  Trophy,
  Eye as EyeIcon,
  Phone,
} from "lucide-react";
import { DOCTORS, PHONES } from "@/lib/site-info";
import { SiteHeader } from "./header";

export function DoctorsPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#faf8f3]">
        {/* Hero banner */}
        <section className="bg-[#0047AB] py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-white/50 mb-3">
              Our Surgeons
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Expert care you can trust
            </h1>
            <p className="mt-4 text-base sm:text-lg text-white/70 max-w-2xl mx-auto">
              Our team of qualified ophthalmic surgeons brings decades of combined
              experience and international qualifications to your eye care.
            </p>
          </div>
        </section>

        {/* Doctor cards */}
        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-12 lg:space-y-16">
              {DOCTORS.map((doc, i) => (
                <article
                  key={doc.name}
                  className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-lg shadow-[#0047AB]/5"
                >
                  <div className="lg:grid lg:grid-cols-5">
                    {/* Photo column */}
                    <div className={`lg:col-span-2 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                      <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full overflow-hidden">
                        <Image
                          src={doc.image}
                          alt={doc.name}
                          fill
                          quality={90}
                          sizes="(min-width: 1024px) 24rem, 100vw"
                          className="object-cover"
                        />
                        <div className="absolute top-4 right-4 rounded-xl bg-white shadow-lg px-4 py-2.5">
                          <div className="text-2xl font-bold text-[#0047AB] leading-none">
                            {doc.experience}
                          </div>
                          <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                            Experience
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Details column */}
                    <div className={`lg:col-span-3 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                      <div className="bg-[#0047AB] px-6 py-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-white">
                          {doc.name}
                        </h2>
                        <p className="text-white/80 text-sm mt-0.5">{doc.role}</p>
                      </div>

                      <div className="p-6 sm:p-8 space-y-5">
                        {/* Qualifications */}
                        <div className="flex items-start gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0047AB] text-white">
                            <GraduationCap className="h-4 w-4" />
                          </span>
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Qualifications
                            </div>
                            <div className="text-sm font-semibold text-[#374151] mt-0.5">
                              {doc.qualifications}
                            </div>
                          </div>
                        </div>

                        {/* Training */}
                        <div className="flex items-start gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0047AB]/10 text-[#0047AB]">
                            <Stethoscope className="h-4 w-4" />
                          </span>
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Trained at
                            </div>
                            <div className="text-sm font-medium text-[#374151] mt-0.5">
                              {doc.training}
                            </div>
                          </div>
                        </div>

                        {/* Bio */}
                        <p className="text-sm text-[#333] leading-relaxed">
                          {doc.bio}
                        </p>

                        {/* Expertise tags */}
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                            Areas of Expertise
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {doc.expertise.map((e) => (
                              <span
                                key={e}
                                className="inline-flex items-center gap-1 rounded-md bg-[#0047AB]/8 px-2.5 py-1.5 text-xs font-medium text-[#0047AB]"
                              >
                                <EyeIcon className="h-3 w-3" />
                                {e}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Stats & Awards */}
                        <div className="flex items-start gap-6 pt-4 border-t border-slate-200">
                          <div className="shrink-0">
                            <div className="text-xl font-bold text-[#0047AB]">
                              {doc.surgeries}
                            </div>
                            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                              Surgeries
                            </div>
                          </div>
                          {"awards" in doc &&
                            (doc as unknown as { awards?: string[] }).awards && (
                              <div className="flex-1 min-w-0">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                                  <Trophy className="h-3 w-3" /> Awards &amp;
                                  Achievements
                                </div>
                                <ul className="space-y-1">
                                  {(
                                    doc as unknown as { awards: string[] }
                                  ).awards.map((award) => (
                                    <li
                                      key={award}
                                      className="text-xs text-[#333] flex items-start gap-1.5"
                                    >
                                      <Award className="h-3 w-3 text-amber-500 shrink-0 mt-0.5" />
                                      {award}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="pb-14 sm:pb-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0047AB] mb-3">
              Ready for a consultation?
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              Book an appointment online or call us — we're here Monday to
              Saturday, 9:30 AM to 7:00 PM.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/book"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0047AB] hover:bg-[#003a8c] text-white px-7 py-3.5 text-sm font-bold transition-colors min-h-[48px]"
              >
                <ArrowRight className="h-4 w-4" />
                Book an appointment
              </Link>
              <a
                href={`tel:${PHONES.primaryTel}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#0047AB] text-[#0047AB] hover:bg-[#0047AB] hover:text-white px-7 py-3.5 text-sm font-bold transition-colors min-h-[48px]"
              >
                <Phone className="h-4 w-4" />
                {PHONES.primary}
              </a>
            </div>
            <div className="mt-8">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0047AB]/60 hover:text-[#0047AB] transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to homepage
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

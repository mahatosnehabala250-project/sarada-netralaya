"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

type Service = {
  image: string;
  title: string;
  desc: string;
  items: string[];
  tag: string;
};

const SERVICES: Service[] = [
  {
    image: "/images/service-cataract.jpg",
    tag: "Surgical",
    title: "Cataract & Comprehensive Eye Care",
    desc: "From cataract surgery to glaucoma and retina treatment — complete medical eye care under one roof.",
    items: [
      "Cataract Surgery (Phaco)",
      "Glaucoma Evaluation & Management",
      "Retina Treatment",
      "Pediatric Eye Care, Squint & Pterygium",
    ],
  },
  {
    image: "/images/service-diagnostics.jpg",
    tag: "Diagnostics",
    title: "Advanced Technology & Diagnostics",
    desc: "Precision instrumentation for accurate diagnosis and modern surgical outcomes — all in-house, no running around.",
    items: [
      "OCT — Retina & Glaucoma Scan",
      "Optical Biometry (Premium IOL)",
      "Auto Refractometer & Slit Lamp",
      "Non-Contact Tonometer & Phaco Machine",
    ],
  },
  {
    image: "/images/service-optical.jpg",
    tag: "Eyewear",
    title: "Optical Services & Eyewear",
    desc: "A dedicated optical counter with a wide variety of spectacles — get your new glasses right where you got your eyes tested.",
    items: [
      "Wide Variety of Spectacles",
      "Frames for Every Budget",
      "Prescription Spectacles Made to Order",
    ],
  },
];

export function Services() {
  return (
    <section id="services" className="py-14 sm:py-20 lg:py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14 max-w-2xl mx-auto">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#0047AB] mb-3">
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0047AB] leading-tight">
            Complete eye care for
            <br className="hidden sm:block" /> your whole family
          </h2>
          <p className="mt-4 text-base text-slate-600">
            From routine eye testing to advanced surgical care — everything you
            need for healthy vision, delivered with expert, patient-first care.
          </p>
        </div>

        {/* Service cards with images */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {SERVICES.map((s) => (
            <article
              key={s.title}
              className="group rounded-3xl bg-white/70 backdrop-blur-md border border-white/60 overflow-hidden shadow-lg shadow-[#0047AB]/5 hover:shadow-xl hover:shadow-[#0047AB]/10 hover:shadow-[#0047AB]/8 hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  sizes="(min-width: 1024px) 24rem, (min-width: 768px) 36rem, 100vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0047AB]/40 to-transparent" />
                <span className="absolute top-3 right-3 rounded-full bg-white/95 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#0047AB] shadow-sm">
                  {s.tag}
                </span>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col">
                <h3 className="text-lg sm:text-xl font-bold text-[#0047AB] leading-snug">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{s.desc}</p>

                <ul className="mt-4 space-y-2 flex-1">
                  {s.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50">
                        <Check className="h-3 w-3 text-emerald-600" strokeWidth={3} />
                      </span>
                      <span className="text-sm text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/book"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[#0047AB] hover:text-[#003a8c] transition-colors group/link min-h-[40px]"
                >
                  Book this service
                  <ArrowRight className="h-4 w-4 group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

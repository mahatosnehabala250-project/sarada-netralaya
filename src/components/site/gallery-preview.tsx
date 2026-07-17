"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Camera } from "lucide-react";

const PREVIEW = [
  { src: "/images/operation-theater.jpg", title: "Operation Theater" },
  { src: "/images/waiting-hall.jpg", title: "Waiting Area" },
  { src: "/images/consult-room.jpg", title: "Consultation Room" },
  { src: "/images/optical-lab.jpg", title: "Optical Lab" },
];

export function GalleryPreview() {
  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 sm:mb-10 flex-wrap gap-4">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#0047AB] mb-3">
              Our Facility
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0047AB]">
              Inside our clinic
            </h2>
          </div>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0047AB] hover:text-[#003a8c] transition-colors group"
          >
            View full gallery
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Image grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {PREVIEW.map((p) => (
            <Link
              key={p.src}
              href="/gallery"
              className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={p.src}
                  alt={p.title}
                  fill
                  sizes="(min-width: 1024px) 18rem, (min-width: 640px) 24rem, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0047AB]/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-xs sm:text-sm font-bold leading-tight">{p.title}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

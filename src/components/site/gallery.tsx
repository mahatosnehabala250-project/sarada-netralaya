"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Camera } from "lucide-react";

type Photo = {
  src: string;
  title: string;
  desc: string;
  category: string;
};

const PHOTOS: Photo[] = [
  { src: "/images/gate-view.png", title: "Hospital Entrance", desc: "Sarada Netralaya — 33, Swastik Ambika Tower, Near HDFC Bank, Baradwari, Jamshedpur", category: "Facility" },
  { src: "/images/operation-theater.png", title: "Operation Theater", desc: "State-of-the-art Phaco surgery suite with advanced microscope", category: "Surgical" },
  { src: "/images/waiting-hall.png", title: "Patient Waiting Area", desc: "Comfortable, welcoming space for patients and families", category: "Facility" },
  { src: "/images/consult-room.png", title: "Consultation Room", desc: "Modern examination room with slit lamp and diagnostic equipment", category: "Diagnostics" },
  { src: "/images/reception.png", title: "Reception", desc: "Friendly front desk to assist you with bookings and queries", category: "Facility" },
  { src: "/images/service-diagnostics.png", title: "OCT & Diagnostic Lab", desc: "Advanced OCT, Optical Biometry and Auto Refractometer — all under one roof", category: "Diagnostics" },
  { src: "/images/optical-lab.png", title: "Optical Lab", desc: "In-house lens cutting and eyewear fitting for quick turnaround", category: "Optical" },
  { src: "/images/service-cataract.png", title: "Phaco Machine", desc: "Latest phacoemulsification technology for painless cataract surgery", category: "Surgical" },
  { src: "/images/service-optical.png", title: "Eyewear Collection", desc: "Wide range of frames for every budget, including kids' frames", category: "Optical" },
];

const CATEGORIES = ["All", "Surgical", "Diagnostics", "Facility", "Optical"];

import { useState } from "react";

export function GalleryPage() {
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState<Photo | null>(null);

  const photos = filter === "All" ? PHOTOS : PHOTOS.filter((p) => p.category === filter);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-[#0047AB] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0047AB] to-[#10b981]">
              <Camera className="h-4 w-4 text-white" />
            </span>
            <span className="font-bold text-white">Gallery</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#10b981] mb-3">
            Take a Tour
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0047AB]">
            Inside Sarada Netralaya
          </h1>
          <p className="mt-4 text-base text-slate-600 max-w-2xl mx-auto">
            See our modern facility — from the operation theater to the waiting
            area. We've built a space where advanced technology meets patient comfort.
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                filter === cat
                  ? "bg-[#0047AB] text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-[#0047AB]/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {photos.map((photo) => (
            <button
              key={photo.src}
              onClick={() => setLightbox(photo)}
              className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all text-left"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={photo.src}
                  alt={photo.title}
                  fill
                  sizes="(min-width: 1024px) 24rem, (min-width: 768px) 36rem, 100vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0047AB]/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="inline-block rounded-full bg-[#10b981] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 mb-2">
                    {photo.category}
                  </span>
                  <h3 className="text-white font-bold text-lg leading-tight">{photo.title}</h3>
                  <p className="text-white/70 text-xs mt-1 leading-snug">{photo.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#0047AB] py-12">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Want to see it in person?</h2>
          <p className="mt-2 text-sm text-white/60">Book a visit and experience our facility yourself.</p>
          <Link href="/book" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white px-7 py-3.5 text-base font-bold transition-colors">
            Book Appointment
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-10 right-0 text-white/60 hover:text-white text-sm font-semibold"
            >
              ✕ Close
            </button>
            <div className="relative rounded-2xl overflow-hidden">
              <div className="relative aspect-[4/3]">
                <Image src={lightbox.src} alt={lightbox.title} fill sizes="100vw" className="object-cover" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <span className="inline-block rounded-full bg-[#10b981] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 mb-2">
                  {lightbox.category}
                </span>
                <h3 className="text-white font-bold text-xl">{lightbox.title}</h3>
                <p className="text-white/70 text-sm mt-1">{lightbox.desc}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

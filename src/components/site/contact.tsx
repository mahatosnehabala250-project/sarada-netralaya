"use client";

import { MapPin, Phone, Mail, Clock, Navigation, MessageCircle, Building2 } from "lucide-react";
import { ADDRESS, PHONES, EMAIL, HOURS, BRANCHES } from "@/lib/site-info";

export function Contact() {
  return (
    <section id="contact" className="py-14 sm:py-20 lg:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#0047AB] mb-3">
            Get in Touch
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0047AB]">
            Visit Us
          </h2>
          <p className="mt-3 text-base text-[#333] max-w-2xl mx-auto">
            We have two branches to serve you better. Walk in, call, or book online.
          </p>
        </div>

        {/* Branch cards */}
        <div className="grid md:grid-cols-2 gap-5 sm:gap-6 mb-8">
          {BRANCHES.map((branch) => {
            const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(branch.mapQuery)}&output=embed`;
            const mapDir = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(branch.mapQuery)}`;
            return (
              <div
                key={branch.name}
                className={`rounded-2xl bg-white border p-5 sm:p-6 shadow-sm hover:shadow-lg transition-shadow ${
                  branch.isMain ? "border-[#0047AB]/30 ring-1 ring-[#0047AB]/10" : "border-slate-200"
                }`}
              >
                {/* Branch header */}
                <div className="flex items-center gap-3 mb-4">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    branch.isMain ? "bg-[#0047AB] text-white" : "bg-slate-100 text-slate-600"
                  }`}>
                    <Building2 className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-[#0047AB]">{branch.name}</h3>
                    {branch.isMain && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#0047AB]/10 text-[#0047AB] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 mt-0.5">
                        Main Branch
                      </span>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3 mb-3">
                  <MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-[#333] leading-relaxed">{branch.address}</p>
                </div>

                {/* Phones */}
                <div className="flex items-start gap-3 mb-3">
                  <Phone className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <div className="flex flex-col gap-1">
                    {branch.phones.map((phone, i) => (
                      <a
                        key={i}
                        href={`tel:${branch.phoneTels[i]}`}
                        className="text-sm font-semibold text-[#0047AB] hover:underline"
                      >
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3 mb-4">
                  <Clock className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <div className="text-sm text-[#333]">
                    <span>Mon–Sat: 9:30 AM – 7:00 PM</span>
                    <span className="block text-rose-500">Sunday: Closed</span>
                  </div>
                </div>

                {/* Map */}
                <div className="relative rounded-xl overflow-hidden border border-slate-200 mb-3 h-48">
                  <iframe
                    title={`${branch.name} location`}
                    src={mapEmbed}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>

                {/* Directions */}
                <a
                  href={mapDir}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#0047AB] hover:bg-[#003a8c] text-white px-4 py-2.5 text-sm font-bold transition-colors min-h-[40px]"
                >
                  <Navigation className="h-4 w-4" /> Get Directions
                </a>
              </div>
            );
          })}
        </div>

        {/* Bottom info row */}
        <div className="grid sm:grid-cols-3 gap-4">
          {/* Email */}
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0047AB]/10 text-[#0047AB]">
              <Mail className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email</div>
              <a href={`mailto:${EMAIL}`} className="text-sm font-semibold text-[#0047AB] hover:underline break-all">{EMAIL}</a>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <MessageCircle className="h-5 w-5" />
            </span>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">WhatsApp</div>
              <a href={`https://wa.me/${PHONES.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-emerald-600 hover:underline">
                Chat with us
              </a>
            </div>
          </div>

          {/* Phone */}
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0047AB]/10 text-[#0047AB]">
              <Phone className="h-5 w-5" />
            </span>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Call</div>
              <a href={`tel:${PHONES.primaryTel}`} className="text-sm font-semibold text-[#0047AB] hover:underline">{PHONES.primary}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

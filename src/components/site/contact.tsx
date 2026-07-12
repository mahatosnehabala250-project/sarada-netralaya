"use client";

import { MapPin, Phone, Mail, Clock, Navigation, MessageCircle } from "lucide-react";
import { ADDRESS, PHONES, EMAIL, HOURS } from "@/lib/site-info";

const MAP_QUERY = encodeURIComponent("Swastik Ambika Tower, Sakchi, Jamshedpur, Jharkhand 831001");
const MAP_EMBED = `https://www.google.com/maps?q=${MAP_QUERY}&output=embed`;
const MAP_DIR = `https://www.google.com/maps/dir/?api=1&destination=${MAP_QUERY}`;

export function Contact() {
  return (
    <section id="contact" className="py-20 sm:py-32 bg-[#0a3d4a]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left — info */}
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-300/60">06 — Visit</span>
            <h2 className="mt-4 font-serif-display text-4xl sm:text-5xl font-bold tracking-tight text-white leading-[1.1]">
              Find us in
              <br />
              <span className="italic text-emerald-300">Sakchi, Jamshedpur</span>
            </h2>

            <div className="mt-10 space-y-6">
              {/* Address */}
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-emerald-300">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/60">Address</div>
                  <p className="mt-1 text-sm text-white/75 leading-relaxed max-w-sm">
                    {ADDRESS.line1}, {ADDRESS.line2}, {ADDRESS.line3}, {ADDRESS.city} – {ADDRESS.pincode}
                  </p>
                  <a href={MAP_DIR} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 hover:text-emerald-200">
                    <Navigation className="h-3 w-3" /> Get directions
                  </a>
                </div>
              </div>

              {/* Phones */}
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-emerald-300">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/60">Call</div>
                  <div className="mt-1 flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <a href={`tel:${PHONES.primaryTel}`} className="text-sm font-bold text-white hover:text-emerald-300">{PHONES.primary}</a>
                    <a href={`tel:${PHONES.secondaryTel}`} className="text-sm font-bold text-white hover:text-emerald-300">{PHONES.secondary}</a>
                  </div>
                  <a href={`https://wa.me/${PHONES.whatsapp}`} target="_blank" rel="noopener noreferrer" className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300/80 hover:text-emerald-300">
                    <MessageCircle className="h-3 w-3" /> Or message on WhatsApp
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-emerald-300">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/60">Email</div>
                  <a href={`mailto:${EMAIL}`} className="mt-1 text-sm font-medium text-white hover:text-emerald-300 break-all">{EMAIL}</a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-emerald-300">
                  <Clock className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/60">Hours</div>
                  <ul className="mt-1 space-y-1">
                    {HOURS.map((h) => (
                      <li key={h.day} className="flex items-center justify-between text-sm max-w-xs">
                        <span className="text-white/70">{h.day}</span>
                        <span className={`font-semibold ${h.time === "Closed" ? "text-rose-300" : "text-white"}`}>{h.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right — map */}
          <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl min-h-[400px] lg:min-h-[560px]">
            <iframe
              title="Sarada Netralaya location"
              src={MAP_EMBED}
              width="100%" height="100%"
              style={{ border: 0, minHeight: 400 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div className="absolute top-4 left-4 rounded-xl bg-[#0a3d4a]/90 backdrop-blur-md px-4 py-3 shadow-lg pointer-events-none">
              <div className="font-serif-display text-sm font-bold text-white">Sarada Netralaya</div>
              <div className="text-[10px] text-emerald-300/70 uppercase tracking-wider mt-0.5">{ADDRESS.short}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

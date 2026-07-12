"use client";

import {
  MapPin, Phone, Mail, Clock, Navigation, MessageCircle,
  CalendarCheck, Sparkles, ExternalLink,
} from "lucide-react";
import { ADDRESS, PHONES, EMAIL, HOURS } from "@/lib/site-info";

const MAP_QUERY = encodeURIComponent(
  "Swastik Ambika Tower, Sakchi, Jamshedpur, Jharkhand 831001"
);
const MAP_EMBED = `https://www.google.com/maps?q=${MAP_QUERY}&output=embed`;
const MAP_DIR = `https://www.google.com/maps/dir/?api=1&destination=${MAP_QUERY}`;

export function Contact() {
  return (
    <section id="contact" className="py-16 sm:py-24 bg-gradient-to-b from-white to-[#f0f9fb] relative overflow-hidden">
      <div className="pointer-events-none absolute top-20 -right-20 h-64 w-64 rounded-full bg-teal-50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0b6e8f]/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#0b6e8f] ring-1 ring-[#0b6e8f]/15">
            <Sparkles className="h-3.5 w-3.5" /> Get in Touch
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-[#084f67]">
            Visit Us in Sakchi, Jamshedpur
          </h2>
          <p className="mt-3 text-base text-slate-600">
            We're here six days a week. Walk in, call, or book online — we'll
            take care of the rest.
          </p>
        </div>

        {/* Quick action banner */}
        <div className="mt-10 max-w-4xl mx-auto">
          <div className="rounded-2xl bg-gradient-to-r from-[#0b6e8f] to-[#084f67] p-1 shadow-xl">
            <div className="rounded-xl bg-gradient-to-r from-[#0b6e8f] to-[#084f67] px-5 py-4 sm:px-7 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <div className="text-white font-bold text-base sm:text-lg">Ready to book your appointment?</div>
                <div className="text-white/70 text-xs sm:text-sm mt-0.5">Fastest confirmation — call us directly</div>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                <a
                  href={`tel:${PHONES.primaryTel}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-[#084f67] hover:bg-white/95 shadow-sm"
                >
                  <Phone className="h-4 w-4" /> Call Now
                </a>
                <a
                  href="#book"
                  onClick={(e) => { e.preventDefault(); document.querySelector("#book")?.scrollIntoView({ behavior: "smooth" }); }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 px-4 py-2.5 text-sm font-bold text-white shadow-sm"
                >
                  <CalendarCheck className="h-4 w-4" /> Book Online
                </a>
                <a
                  href={`https://wa.me/${PHONES.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 hover:bg-white/25 border border-white/25 px-4 py-2.5 text-sm font-bold text-white backdrop-blur-sm"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Info cards */}
          <div className="space-y-4">
            {/* Address */}
            <ContactCard icon={MapPin} title="Our Address" accent="bg-gradient-to-br from-[#0b6e8f] to-[#084f67]">
              <p className="text-sm leading-relaxed text-slate-700">
                {ADDRESS.line1}
                <br />
                {ADDRESS.line2}
                <br />
                {ADDRESS.line3}, {ADDRESS.city} – {ADDRESS.pincode}
              </p>
              <a
                href={MAP_DIR}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#0b6e8f]/8 hover:bg-[#0b6e8f]/12 px-3 py-1.5 text-xs font-semibold text-[#0b6e8f] transition-colors"
              >
                <Navigation className="h-3.5 w-3.5" /> Get Directions
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            </ContactCard>

            {/* Phones */}
            <ContactCard icon={Phone} title="Call Us" accent="bg-gradient-to-br from-emerald-500 to-emerald-700">
              <div className="flex flex-col sm:flex-row gap-2">
                <a
                  href={`tel:${PHONES.primaryTel}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-[#084f67] hover:bg-[#0b6e8f]/5 hover:border-[#0b6e8f]/30 transition-colors"
                >
                  <Phone className="h-4 w-4 text-[#0b6e8f]" /> {PHONES.primary}
                </a>
                <a
                  href={`tel:${PHONES.secondaryTel}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-[#084f67] hover:bg-[#0b6e8f]/5 hover:border-[#0b6e8f]/30 transition-colors"
                >
                  <Phone className="h-4 w-4 text-[#0b6e8f]" /> {PHONES.secondary}
                </a>
              </div>
              <a
                href={`https://wa.me/${PHONES.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                <MessageCircle className="h-3.5 w-3.5" /> Or chat with us on WhatsApp
              </a>
            </ContactCard>

            {/* Email */}
            <ContactCard icon={Mail} title="Email Us" accent="bg-gradient-to-br from-[#084f67] to-[#063b4f]">
              <a
                href={`mailto:${EMAIL}`}
                className="text-sm font-medium text-[#0b6e8f] hover:underline break-all inline-flex items-center gap-1.5"
              >
                {EMAIL}
              </a>
              <p className="mt-1.5 text-xs text-slate-500">We reply within one business day</p>
            </ContactCard>

            {/* Hours */}
            <ContactCard icon={Clock} title="Opening Hours" accent="bg-gradient-to-br from-[#0b6e8f] to-[#084f67]">
              <ul className="space-y-1.5">
                {HOURS.map((h) => (
                  <li key={h.day} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 font-medium">{h.day}</span>
                    <span
                      className={`font-semibold inline-flex items-center gap-1.5 ${
                        h.time === "Closed" ? "text-rose-500" : "text-[#084f67]"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${h.time === "Closed" ? "bg-rose-400" : "bg-emerald-400"}`} />
                      {h.time}
                    </span>
                  </li>
                ))}
              </ul>
            </ContactCard>
          </div>

          {/* Map */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-lg bg-white min-h-[360px] lg:min-h-full">
            <iframe
              title="Sarada Netralaya location map"
              src={MAP_EMBED}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 360 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            {/* Map overlay label */}
            <div className="absolute top-4 left-4 right-4 pointer-events-none">
              <div className="inline-flex items-center gap-2 rounded-xl bg-white/95 backdrop-blur-sm shadow-lg border border-slate-200 px-3.5 py-2 pointer-events-auto">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0b6e8f] text-white">
                  <MapPin className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-xs font-bold text-[#084f67] leading-tight">Sarada Netralaya</div>
                  <div className="text-[10px] text-slate-500 leading-tight">Sakchi, Jamshedpur</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactCard({
  icon: Icon,
  title,
  accent,
  children,
}: {
  icon: typeof MapPin;
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-[#0b6e8f]/20 transition-all">
      <div className="flex items-start gap-4">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accent} text-white shadow-md group-hover:scale-105 transition-transform`}>
          <Icon className="h-5 w-5" />
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-[#084f67]">{title}</h3>
          <div className="mt-2">{children}</div>
        </div>
      </div>
    </div>
  );
}

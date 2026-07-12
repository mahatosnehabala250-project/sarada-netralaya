"use client";

import { MapPin, Phone, Mail, Clock, Navigation, MessageCircle } from "lucide-react";
import { ADDRESS, PHONES, EMAIL, HOURS } from "@/lib/site-info";

const MAP_QUERY = encodeURIComponent(
  "Swastik Ambika Tower, Sakchi, Jamshedpur, Jharkhand 831001"
);
const MAP_EMBED = `https://www.google.com/maps?q=${MAP_QUERY}&output=embed`;
const MAP_DIR = `https://www.google.com/maps/dir/?api=1&destination=${MAP_QUERY}`;

export function Contact() {
  return (
    <section id="contact" className="py-16 sm:py-24 bg-gradient-to-b from-white to-[#f0f9fb]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block rounded-full bg-[#0b6e8f]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#0b6e8f]">
            Get in Touch
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-[#084f67]">
            Visit Us in Sakchi, Jamshedpur
          </h2>
          <p className="mt-3 text-base text-[#0f2f3a]/65">
            We're here six days a week. Walk in, call, or book online — we'll
            take care of the rest.
          </p>
        </div>

        <div className="mt-12 grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Info cards */}
          <div className="space-y-5">
            {/* Address */}
            <ContactCard icon={MapPin} title="Our Address" accent="bg-[#0b6e8f]">
              <p className="text-sm leading-relaxed text-[#0f2f3a]/80">
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
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#0b6e8f]/10 hover:bg-[#0b6e8f]/15 px-3 py-1.5 text-xs font-semibold text-[#0b6e8f] transition-colors"
              >
                <Navigation className="h-3.5 w-3.5" /> Get Directions
              </a>
            </ContactCard>

            {/* Phones */}
            <ContactCard icon={Phone} title="Call Us" accent="bg-emerald-600">
              <div className="flex flex-col sm:flex-row gap-2">
                <a
                  href={`tel:${PHONES.primaryTel}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-[#0b6e8f]/20 bg-white px-4 py-2.5 text-sm font-bold text-[#084f67] hover:bg-[#0b6e8f]/5 transition-colors"
                >
                  <Phone className="h-4 w-4" /> {PHONES.primary}
                </a>
                <a
                  href={`tel:${PHONES.secondaryTel}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-[#0b6e8f]/20 bg-white px-4 py-2.5 text-sm font-bold text-[#084f67] hover:bg-[#0b6e8f]/5 transition-colors"
                >
                  <Phone className="h-4 w-4" /> {PHONES.secondary}
                </a>
              </div>
              <a
                href={`https://wa.me/${PHONES.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                <MessageCircle className="h-3.5 w-3.5" /> Or chat with us on WhatsApp
              </a>
            </ContactCard>

            {/* Email */}
            <ContactCard icon={Mail} title="Email Us" accent="bg-[#084f67]">
              <a
                href={`mailto:${EMAIL}`}
                className="text-sm font-medium text-[#0b6e8f] hover:underline break-all"
              >
                {EMAIL}
              </a>
            </ContactCard>

            {/* Hours */}
            <ContactCard icon={Clock} title="Opening Hours" accent="bg-[#0b6e8f]">
              <ul className="space-y-1.5">
                {HOURS.map((h) => (
                  <li key={h.day} className="flex items-center justify-between text-sm">
                    <span className="text-[#0f2f3a]/75 font-medium">{h.day}</span>
                    <span
                      className={`font-semibold ${
                        h.time === "Closed" ? "text-rose-500" : "text-[#084f67]"
                      }`}
                    >
                      {h.time}
                    </span>
                  </li>
                ))}
              </ul>
            </ContactCard>
          </div>

          {/* Map */}
          <div className="rounded-3xl overflow-hidden border border-[#0b6e8f]/10 shadow-lg bg-white min-h-[360px] lg:min-h-full">
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
    <div className="rounded-2xl bg-white border border-[#0b6e8f]/10 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accent} text-white shadow-sm`}>
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

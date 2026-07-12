import Link from "next/link";
import { Eye, MapPin, Phone, Mail, Clock } from "lucide-react";
import { SITE, ADDRESS, PHONES, EMAIL, HOURS } from "@/lib/site-info";

export function Footer() {
  return (
    <footer className="mt-auto bg-[#063b4f] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0b6e8f] to-[#10b981]">
                <Eye className="h-5 w-5 text-white" strokeWidth={2.4} />
              </span>
              <div className="leading-none">
                <div className="text-lg font-bold">Sarada Netralaya</div>
                <div className="text-[10.5px] uppercase tracking-[0.14em] text-white/55">
                  Eye Care Hospital
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/65">
              {SITE.tagline}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white/10 border border-white/15 px-3 py-1.5 text-xs">
              <span className="text-amber-300">⭐ {SITE.rating}</span>
              <span className="text-white/40">·</span>
              <span className="text-white/70">{SITE.reviewsCount} Reviews</span>
            </div>
          </div>

          {/* Address */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white/80">
              <MapPin className="h-4 w-4 text-[#6ee7b7]" /> Address
            </h3>
            <address className="mt-3 not-italic text-sm leading-relaxed text-white/65">
              {ADDRESS.line1}
              <br />
              {ADDRESS.line2}
              <br />
              {ADDRESS.line3}
              <br />
              {ADDRESS.city} – {ADDRESS.pincode}
              <br />
              {ADDRESS.state}, India
            </address>
          </div>

          {/* Contact */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white/80">
              <Phone className="h-4 w-4 text-[#6ee7b7]" /> Contact
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href={`tel:${PHONES.primaryTel}`} className="text-white/70 hover:text-white inline-flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-white/40" /> {PHONES.primary}
                </a>
              </li>
              <li>
                <a href={`tel:${PHONES.secondaryTel}`} className="text-white/70 hover:text-white inline-flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-white/40" /> {PHONES.secondary}
                </a>
              </li>
              <li className="pt-1">
                <a href={`mailto:${EMAIL}`} className="text-white/70 hover:text-white inline-flex items-center gap-2 break-all">
                  <Mail className="h-3.5 w-3.5 text-white/40 shrink-0" /> {EMAIL}
                </a>
              </li>
            </ul>
          </div>

          {/* Hours + links */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white/80">
              <Clock className="h-4 w-4 text-[#6ee7b7]" /> Hours & Links
            </h3>
            <ul className="mt-3 space-y-1.5 text-sm text-white/65">
              {HOURS.map((h) => (
                <li key={h.day} className="flex justify-between gap-2">
                  <span>{h.day}</span>
                  <span className={h.time === "Closed" ? "text-rose-300" : "text-white/80 font-medium"}>
                    {h.time}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs">
              <a href="#services" className="text-white/55 hover:text-white">Services</a>
              <a href="#doctor" className="text-white/55 hover:text-white">Doctor</a>
              <a href="#book" className="text-white/55 hover:text-white">Book Appointment</a>
              <Link href="/track" className="text-white/55 hover:text-white">Track Appointment</Link>
              <Link href="/admin" className="text-white/55 hover:text-white">Owner Login</Link>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/50 text-center sm:text-left">
            © 2026 Sarada Netralaya. All rights reserved. ·{" "}
            <span className="text-white/40">Passion for Excellence • Committed to Care</span>
          </p>
          <p className="text-xs text-white/40">
            {ADDRESS.city}, {ADDRESS.state}
          </p>
        </div>
      </div>
    </footer>
  );
}

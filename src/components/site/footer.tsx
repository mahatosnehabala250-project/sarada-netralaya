import Link from "next/link";
import { MapPin, Phone, Mail, Star } from "lucide-react";
import { SITE, ADDRESS, PHONES, EMAIL } from "@/lib/site-info";

export function Footer() {
  return (
    <footer className="mt-auto bg-[#082e38] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif-display text-xl font-bold">Sarada Netralaya</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Est. 1995</span>
            </div>
            <p className="mt-3 text-sm text-white/50 max-w-xs leading-relaxed">
              {SITE.tagline}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-xs">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold">{SITE.rating}</span>
              <span className="text-white/40">·</span>
              <span className="text-white/60">{SITE.reviewsCount} reviews</span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300/50 mb-4">Contact</div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-white/60">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-white/30" />
                <span>{ADDRESS.short}</span>
              </li>
              <li>
                <a href={`tel:${PHONES.primaryTel}`} className="flex items-center gap-2 text-white/60 hover:text-white">
                  <Phone className="h-4 w-4 text-white/30" /> {PHONES.primary}
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`} className="flex items-start gap-2 text-white/60 hover:text-white break-all">
                  <Mail className="h-4 w-4 mt-0.5 shrink-0 text-white/30" /> {EMAIL}
                </a>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300/50 mb-4">Quick Links</div>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#services" className="text-white/60 hover:text-white">Care</a></li>
              <li><a href="#doctor" className="text-white/60 hover:text-white">Surgeon</a></li>
              <li><a href="#book" className="text-white/60 hover:text-white">Book Appointment</a></li>
              <li><Link href="/track" className="text-white/60 hover:text-white">Track Appointment</Link></li>
              <li><Link href="/admin" className="text-white/60 hover:text-white">Owner Login</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">© 2026 Sarada Netralaya. All rights reserved.</p>
          <p className="text-xs text-white/30">{ADDRESS.city}, {ADDRESS.state}</p>
        </div>
      </div>
    </footer>
  );
}

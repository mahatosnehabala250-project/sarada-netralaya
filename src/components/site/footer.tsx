import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";
import { SITE, ADDRESS, PHONES, EMAIL, SOCIAL } from "@/lib/site-info";

export function Footer() {
  return (
    <footer className="mt-auto bg-[#003a8c] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-[1.5fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <Image src="/images/logo.jpg" alt="Sarada Netralaya logo" width={44} height={30} className="shrink-0" />
              <div className="leading-none">
                <span className="font-serif-display text-lg sm:text-xl font-bold">Sarada Netralaya</span>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-white/40 mt-1">Est. 2015</span>
              </div>
            </div>
            <p className="mt-3 text-sm text-white/50 max-w-xs leading-relaxed">
              {SITE.tagline}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200/70 mb-3 sm:mb-4">Contact</div>
            <ul className="space-y-2.5 sm:space-y-3 text-sm">
              <li className="flex items-start gap-2 text-white/60">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-white/30" />
                <span>{ADDRESS.short}</span>
              </li>
              <li>
                <a href={`tel:${PHONES.primaryTel}`} className="flex items-center gap-2 text-white/60 hover:text-white min-h-[36px]">
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
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200/70 mb-3 sm:mb-4">Quick Links</div>
            <ul className="space-y-2 sm:space-y-2.5 text-sm">
              <li><a href="#services" className="text-white/60 hover:text-white">Our Services</a></li>
              <li><a href="#doctor" className="text-white/60 hover:text-white">Our Doctors</a></li>
              <li><Link href="/gallery" className="text-white/60 hover:text-white">Gallery</Link></li>
              <li><Link href="/reviews" className="text-white/60 hover:text-white">Reviews</Link></li>
              <li><Link href="/book" className="text-white/60 hover:text-white">Book Appointment</Link></li>
              <li><Link href="/track" className="text-white/60 hover:text-white">Track Appointment</Link></li>
              <li><Link href="/admin" className="text-white/60 hover:text-white">Owner Login</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 sm:mt-12 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40 text-center sm:text-left">© 2026 Sarada Netralaya. All rights reserved.</p>
          <p className="text-xs text-white/30">{ADDRESS.city}, {ADDRESS.state}</p>
        </div>
      </div>
    </footer>
  );
}

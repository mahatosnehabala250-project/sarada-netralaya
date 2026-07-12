"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Phone, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { PHONES } from "@/lib/site-info";

const NAV = [
  { label: "Services", href: "#services" },
  { label: "Doctor", href: "#doctor" },
  { label: "Reviews", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    if (href.startsWith("/")) {
      window.location.assign(href);
      return;
    }
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200"
          : "bg-white border-b border-slate-100"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 h-16">
        {/* Logo */}
        <a
          href="#top"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          className="flex items-center gap-2 shrink-0"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0a3d4a] text-white text-sm font-bold">
            SN
          </span>
          <div className="leading-none">
            <div className="text-base sm:text-lg font-bold text-[#0a3d4a]">Sarada Netralaya</div>
            <div className="hidden sm:block text-[9px] uppercase tracking-[0.15em] text-slate-400 font-semibold">Eye Care Hospital</div>
          </div>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((n) => (
            <button
              key={n.href}
              onClick={() => go(n.href)}
              className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-[#0a3d4a] transition-colors"
            >
              {n.label}
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={`tel:${PHONES.primaryTel}`}
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[#0a3d4a] hover:text-[#10b981] transition-colors"
          >
            <Phone className="h-4 w-4" />
            <span className="hidden lg:inline">{PHONES.primary}</span>
            <span className="lg:hidden">Call</span>
          </a>
          <a
            href="#book"
            onClick={(e) => { e.preventDefault(); document.querySelector("#book")?.scrollIntoView({ behavior: "smooth" }); }}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#10b981] hover:bg-[#059669] text-white px-4 py-2 text-sm font-bold transition-colors"
          >
            <Calendar className="h-4 w-4" />
            Book Now
          </a>
          <Link
            href="/admin"
            className="hidden sm:inline-flex items-center rounded-full border border-slate-200 text-slate-600 hover:text-[#0a3d4a] hover:border-[#0a3d4a]/30 px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Owner
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg text-[#0a3d4a] hover:bg-slate-100 transition-colors"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-slate-200">
          <nav className="px-4 py-3 flex flex-col">
            {NAV.map((n) => (
              <button
                key={n.href}
                onClick={() => go(n.href)}
                className="text-left py-3 px-2 text-base font-medium text-slate-700 border-b border-slate-100 last:border-0"
              >
                {n.label}
              </button>
            ))}
            <div className="flex items-center gap-2 pt-3 pb-2">
              <a href={`tel:${PHONES.primaryTel}`} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-200 py-2.5 text-sm font-semibold text-[#0a3d4a] min-h-[44px]">
                <Phone className="h-4 w-4" /> Call
              </a>
              <a href="#book" onClick={() => setOpen(false)} className="flex-1 inline-flex items-center justify-center rounded-full bg-[#10b981] text-white py-2.5 text-sm font-bold min-h-[44px]">
                Book Now
              </a>
            </div>
            <Link href="/admin" onClick={() => setOpen(false)} className="text-center py-2 text-xs text-slate-400 uppercase tracking-wider">
              Owner Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

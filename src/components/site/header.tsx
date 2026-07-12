"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { PHONES } from "@/lib/site-info";

const NAV = [
  { label: "Care", href: "#services" },
  { label: "Surgeon", href: "#doctor" },
  { label: "Stories", href: "#testimonials" },
  { label: "Book", href: "#book" },
  { label: "Visit", href: "#contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
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
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-[#faf8f3]/95 backdrop-blur-md border-b border-[#0a3d4a]/10 py-2.5 sm:py-3"
          : "bg-transparent py-4 sm:py-5"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* Logo — wordmark */}
        <a
          href="#top"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          className="flex items-baseline gap-2 group min-w-0"
        >
          <span className={cn("font-serif-display text-lg sm:text-xl lg:text-2xl font-bold tracking-tight transition-colors truncate", scrolled ? "text-[#0a3d4a]" : "text-white")}>
            Sarada Netralaya
          </span>
          <span className={cn("hidden lg:block text-[10px] uppercase tracking-[0.2em] font-semibold transition-colors shrink-0", scrolled ? "text-[#0a3d4a]/50" : "text-white/50")}>
            Est. 1995
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((n) => (
            <button
              key={n.href}
              onClick={() => go(n.href)}
              className={cn(
                "px-3.5 py-2 text-sm font-medium transition-colors",
                scrolled ? "text-[#0a3d4a]/70 hover:text-[#0a3d4a]" : "text-white/75 hover:text-white"
              )}
            >
              {n.label}
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href={`tel:${PHONES.primaryTel}`}
            className={cn(
              "hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold transition-colors",
              scrolled ? "text-[#0a3d4a] hover:text-[#0a3d4a]/70" : "text-white hover:text-white/70"
            )}
          >
            <Phone className="h-3.5 w-3.5" />
            {PHONES.primary}
          </a>
          <Link
            href="/admin"
            className={cn(
              "hidden sm:inline-flex items-center rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all",
              scrolled
                ? "bg-[#0a3d4a] text-[#faf8f3] hover:bg-[#082e38]"
                : "bg-white/10 text-white border border-white/20 backdrop-blur-sm hover:bg-white/20"
            )}
          >
            Owner
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className={cn("md:hidden flex h-10 w-10 items-center justify-center rounded-lg transition-colors", scrolled ? "text-[#0a3d4a] hover:bg-[#0a3d4a]/5" : "text-white hover:bg-white/10")}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#faf8f3] border-t border-[#0a3d4a]/10 mt-2.5">
          <nav className="px-4 py-3 flex flex-col gap-0.5">
            {NAV.map((n) => (
              <button
                key={n.href}
                onClick={() => go(n.href)}
                className="text-left py-3.5 px-2 text-base font-medium text-[#0a3d4a]/80 border-b border-[#0a3d4a]/5 last:border-0 active:bg-[#0a3d4a]/5"
              >
                {n.label}
              </button>
            ))}
            <div className="flex items-center gap-3 pt-4 pb-2">
              <a href={`tel:${PHONES.primaryTel}`} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-[#0a3d4a]/20 py-3 text-sm font-semibold text-[#0a3d4a] min-h-[44px]">
                <Phone className="h-4 w-4" /> Call
              </a>
              <Link href="/admin" onClick={() => setOpen(false)} className="flex-1 inline-flex items-center justify-center rounded-full bg-[#0a3d4a] text-[#faf8f3] py-3 text-sm font-bold min-h-[44px]">
                Owner Login
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Eye, LogIn, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PHONES } from "@/lib/site-info";

const NAV = [
  { label: "Services", href: "#services" },
  { label: "Doctor", href: "#doctor" },
  { label: "Book Appointment", href: "#book" },
  { label: "Contact", href: "#contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-[0_4px_24px_-12px_rgba(8,79,103,0.25)] border-b border-[#0b6e8f]/10"
          : "bg-white/80 backdrop-blur-sm border-b border-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-2.5 group"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0b6e8f] to-[#084f67] shadow-md shadow-[#0b6e8f]/30 group-hover:scale-105 transition-transform">
            <Eye className="h-5 w-5 text-white" strokeWidth={2.4} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[17px] font-bold tracking-tight text-[#084f67]">
              Sarada Netralaya
            </span>
            <span className="hidden sm:block text-[10.5px] font-medium uppercase tracking-[0.14em] text-[#0b6e8f]/70">
              Eye Care Hospital
            </span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((n) => (
            <button
              key={n.href}
              onClick={() => go(n.href)}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-[#0f2f3a]/75 hover:text-[#084f67] hover:bg-[#0b6e8f]/5 transition-colors"
            >
              {n.label}
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <a
            href={`tel:${PHONES.primaryTel}`}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-[#084f67] hover:bg-[#0b6e8f]/5 transition-colors"
          >
            <Phone className="h-4 w-4" />
            <span className="hidden xl:inline">{PHONES.primary}</span>
            <span className="xl:hidden">Call</span>
          </a>
          <Link href="/admin">
            <Button
              size="sm"
              className="hidden sm:inline-flex bg-[#0b6e8f] hover:bg-[#084f67] text-white shadow-sm"
            >
              <LogIn className="mr-1.5 h-4 w-4" />
              Owner Login
            </Button>
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg text-[#084f67] hover:bg-[#0b6e8f]/5"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-[#0b6e8f]/10 bg-white">
          <nav className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-1">
            {NAV.map((n) => (
              <button
                key={n.href}
                onClick={() => go(n.href)}
                className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[#0f2f3a]/80 hover:bg-[#0b6e8f]/5"
              >
                {n.label}
              </button>
            ))}
            <div className="flex items-center gap-2 pt-2 mt-1 border-t border-[#0b6e8f]/10">
              <a
                href={`tel:${PHONES.primaryTel}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-[#084f67] border border-[#0b6e8f]/20"
              >
                <Phone className="h-4 w-4" /> Call Now
              </a>
              <Link href="/admin" className="flex-1" onClick={() => setOpen(false)}>
                <Button
                  size="sm"
                  className="w-full bg-[#0b6e8f] hover:bg-[#084f67] text-white"
                >
                  <LogIn className="mr-1.5 h-4 w-4" /> Owner Login
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

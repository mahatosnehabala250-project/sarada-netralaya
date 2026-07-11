"use client";

import { useState, useEffect } from "react";
import { CalendarCheck, Phone, ArrowUp } from "lucide-react";
import { PHONES } from "@/lib/site-info";

/** Sticky bottom CTA bar — mobile only. Appears after scrolling past hero. */
export function MobileCtaBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // show after 600px (past hero)
      setShow(window.scrollY > 600);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_-8px_rgba(8,79,103,0.2)]">
      <div className="grid grid-cols-2 gap-2 p-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))]">
        <a
          href="#book"
          onClick={(e) => {
            e.preventDefault();
            document.querySelector("#book")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm"
        >
          <CalendarCheck className="h-4 w-4" /> Book
        </a>
        <a
          href={`tel:${PHONES.primaryTel}`}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#0b6e8f] hover:bg-[#084f67] px-4 py-3 text-sm font-bold text-white shadow-sm"
        >
          <Phone className="h-4 w-4" /> Call Now
        </a>
      </div>
    </div>
  );
}

/** Scroll-to-top floating button — appears after scrolling down. */
export function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 800);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className="hidden sm:flex fixed bottom-6 left-6 z-40 h-11 w-11 items-center justify-center rounded-full bg-white border border-slate-200 text-[#084f67] shadow-lg hover:bg-[#0b6e8f] hover:text-white hover:border-[#0b6e8f] transition-all hover:-translate-y-0.5"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}

"use client";

import { useState, useEffect } from "react";
import { CalendarCheck, Phone, ArrowUp } from "lucide-react";
import { PHONES } from "@/lib/site-info";

export function MobileCtaBar() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-[#faf8f3]/95 backdrop-blur-md border-t border-[#0a3d4a]/10 shadow-[0_-4px_20px_-8px_rgba(10,61,74,0.2)]">
      <div className="grid grid-cols-2 gap-2 p-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))]">
        <a href="#book" onClick={(e) => { e.preventDefault(); document.querySelector("#book")?.scrollIntoView({ behavior: "smooth" }); }}
          className="flex items-center justify-center gap-2 rounded-full bg-[#0a3d4a] px-4 py-3 text-sm font-bold text-[#faf8f3]">
          <CalendarCheck className="h-4 w-4" /> Book
        </a>
        <a href={`tel:${PHONES.primaryTel}`} className="flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-4 py-3 text-sm font-bold text-[#0a3d4a]">
          <Phone className="h-4 w-4" /> Call Now
        </a>
      </div>
    </div>
  );
}

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
    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Scroll to top"
      className="hidden sm:flex fixed bottom-6 left-6 z-40 h-11 w-11 items-center justify-center rounded-full bg-[#0a3d4a] text-[#faf8f3] shadow-lg hover:bg-[#082e38] transition-all hover:-translate-y-0.5">
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}

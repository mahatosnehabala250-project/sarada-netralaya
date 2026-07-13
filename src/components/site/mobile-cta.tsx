"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
    <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-[#faf8f3]/95 backdrop-blur-md border-t border-[#0047AB]/10 shadow-[0_-4px_20px_-8px_rgba(10,61,74,0.2)]">
      <div className="grid grid-cols-2 gap-2 p-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))]">
        <Link href="/book"
          className="flex items-center justify-center gap-2 rounded-full bg-[#0047AB] px-4 py-3 text-sm font-bold text-[#faf8f3]">
          <CalendarCheck className="h-4 w-4" /> Book
        </Link>
        <a href={`tel:${PHONES.primaryTel}`} className="flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-4 py-3 text-sm font-bold text-[#0047AB]">
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
      className="hidden sm:flex fixed bottom-6 left-6 z-40 h-11 w-11 items-center justify-center rounded-full bg-[#0047AB] text-[#faf8f3] shadow-lg hover:bg-[#003a8c] transition-all hover:-translate-y-0.5">
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}

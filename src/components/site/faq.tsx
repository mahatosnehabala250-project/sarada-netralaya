"use client";

import { useState } from "react";
import { Plus, Minus, Phone, MessageCircle } from "lucide-react";
import { PHONES } from "@/lib/site-info";

const FAQS = [
  { q: "What is Topical Phaco cataract surgery?", a: "Topical Phaco is a modern, stitch-free cataract technique performed using only eye drops as anaesthesia — no injection and no patch. Most patients feel no pain and recover vision within a day. Dr. Dhira uses the latest Phaco machine for safe, precise outcomes." },
  { q: "How do I book an appointment?", a: "You can book in three ways: fill the online form on this page and our team will call you to confirm, call us directly at +91 70910 90014 / 90016, or chat with us on WhatsApp. Online bookings receive a 6-digit reference number." },
  { q: "What are your timings?", a: "We are open Monday to Saturday, from 10:00 AM to 7:30 PM. Sunday is closed. We recommend booking in advance to minimise your waiting time, especially for retina and glaucoma evaluations which require dilatation." },
  { q: "Do you treat children's eye problems?", a: "Yes. We provide comprehensive pediatric eye care including routine testing, squint evaluation and correction, amblyopia management, and refractive error correction. We have a dedicated selection of kids' frames in our optical section." },
  { q: "What diagnostic facilities are available?", a: "We have advanced equipment on-site: Optical Biometry for premium cataract IOL calculation, OCT for retina and glaucoma evaluation, HVF for glaucoma assessment, and the latest Phaco & laser facility — so you don't need to visit multiple centres." },
  { q: "Do you offer optical services?", a: "Yes. Our optical section offers eyeglasses for every budget, branded contact lenses, computerized eye testing, and kids' frames. Most spectacle orders are ready within 2–3 working days." },
  { q: "What should I bring to my appointment?", a: "Please bring a valid photo ID, any previous eye prescription or old spectacles, a list of current medications, and your booking reference. For dilated retina/glaucoma checks, avoid driving yourself back — arrange a driver or use a cab." },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-14 sm:py-20 lg:py-32 bg-[#faf8f3]">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#0047AB]/40">05 — Questions</span>
          <h2 className="mt-3 sm:mt-4 font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0047AB]">
            Good to know
          </h2>
        </div>

        <div className="space-y-1">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="border-b border-[#0047AB]/10">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-start gap-3 sm:gap-4 py-4 sm:py-5 text-left group min-h-[52px]"
                >
                  <span className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full border border-[#0047AB]/15 text-[#0047AB] mt-0.5 group-hover:bg-[#0047AB] group-hover:text-[#faf8f3] transition-colors">
                    {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  </span>
                  <span className={`flex-1 text-base sm:text-lg font-semibold pt-0.5 transition-colors ${isOpen ? "text-[#0047AB]" : "text-[#0047AB]/80"}`}>
                    {f.q}
                  </span>
                </button>
                {isOpen && (
                  <p className="pb-4 sm:pb-5 pl-10 sm:pl-11 pr-2 text-sm text-[#0047AB]/60 leading-relaxed animate-[reveal-up_0.3s_ease-out]">
                    {f.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-8 sm:mt-10 text-center">
          <p className="text-sm text-[#0047AB]/50 mb-4">Still have a question? We're a call away.</p>
          <div className="flex flex-col xs:flex-row flex-wrap gap-2 justify-center">
            <a href={`tel:${PHONES.primaryTel}`} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0047AB] text-[#faf8f3] px-5 py-3 text-sm font-bold hover:bg-[#003a8c] min-h-[44px]">
              <Phone className="h-4 w-4" /> {PHONES.primary}
            </a>
            <a href={`https://wa.me/${PHONES.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 text-[#0047AB] px-5 py-3 text-sm font-bold hover:bg-emerald-400 min-h-[44px]">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

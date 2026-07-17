"use client";

import { useState } from "react";
import { Plus, Minus, Phone } from "lucide-react";
import { PHONES } from "@/lib/site-info";

const FAQS = [
  { q: "What eye services do you offer?", a: "We offer Cataract surgery, Glaucoma care, Retina treatment, Pediatric eye care, Squint correction and Pterygium treatment. Dr. Dhira uses a modern Phaco machine for cataract surgery. We also have a full optical section for spectacles." },
  { q: "How do I book an appointment?", a: "You can book in three ways: fill the online form on this page and our team will call you to confirm, call us directly at +91 70910 90014 / 90016, or chat with us on WhatsApp. Online bookings receive a booking reference number." },
  { q: "What are your timings?", a: "We are open Monday to Saturday, from 9:30 AM to 7:00 PM. Sunday is closed. We recommend booking in advance to minimise your waiting time, especially for retina and glaucoma evaluations which require dilatation." },
  { q: "Do you treat children's eye problems?", a: "Yes. We provide comprehensive pediatric eye care including routine testing, squint evaluation and correction, and refractive error correction. We also have a selection of spectacles in our optical section." },
  { q: "What diagnostic facilities are available?", a: "We have advanced equipment on-site: OCT for retina and glaucoma evaluation, Optical Biometry for premium cataract IOL calculation, Auto Refractometer, Slit Lamp, Non-Contact Tonometer and a Phaco machine — so you don't need to visit multiple centres." },
  { q: "Do you offer optical services?", a: "Yes. Our optical counter stocks a wide variety of spectacles — you can get your new glasses made right after your eye check-up, with frames to suit every budget." },
  { q: "What should I bring to my appointment?", a: "Please bring any previous eye prescription or old spectacles, a list of current medications, and your booking reference. For dilated retina/glaucoma checks, avoid driving yourself back — arrange a driver or use a cab." },
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
            <a href={`https://wa.me/${PHONES.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] text-white px-5 py-3 text-sm font-bold hover:bg-[#1ebe5b] min-h-[44px]">
              <WhatsAppIcon className="h-[18px] w-[18px]" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Official WhatsApp logo glyph (brand mark, filled). */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

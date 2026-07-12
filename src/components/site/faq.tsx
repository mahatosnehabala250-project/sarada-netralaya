"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Phone, MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { PHONES } from "@/lib/site-info";

type QA = { q: string; a: string };

const FAQS: QA[] = [
  {
    q: "What is Topical Phaco cataract surgery? Is it really painless?",
    a: "Topical Phaco is a modern, stitch-free cataract technique where the procedure is performed using only eye drops as anaesthesia — no injection around the eye and no patch afterwards. Most patients feel no pain and recover vision within a day. Dr. Nitin Dhira uses the latest Phaco machine for safe, precise outcomes.",
  },
  {
    q: "How do I book an appointment at Sarada Netralaya?",
    a: "You can book in three ways: (1) fill the online appointment form on this page and our team will call you to confirm, (2) call us directly at +91 70910 90014 / 90016, or (3) chat with us on WhatsApp. Online bookings receive a 6-digit reference number for your records.",
  },
  {
    q: "What are your timings and which days are you open?",
    a: "We are open Monday to Saturday, from 10:00 AM to 7:30 PM. Sunday is closed. We recommend booking an appointment in advance to minimise your waiting time, especially for retina and glaucoma evaluations which require dilatation.",
  },
  {
    q: "Do you treat children's eye problems?",
    a: "Yes. We provide comprehensive pediatric eye care including routine eye testing, squint (strabismus) evaluation and correction, amblyopia (lazy eye) management, and refractive error correction. We have a dedicated selection of kids' frames in our optical section.",
  },
  {
    q: "What diagnostic facilities are available in-house?",
    a: "We have advanced diagnostic equipment on-site: Optical Biometry for premium cataract surgery IOL power calculation, OCT for detailed retina and glaucoma evaluation, HVF (Humphrey Visual Field) for glaucoma assessment, and the latest Phaco & laser facility — so you don't need to visit multiple centres.",
  },
  {
    q: "Do you offer optical services and contact lenses?",
    a: "Yes. Our optical section offers eyeglasses for every budget, branded contact lenses, computerized eye testing, and a wide range of kids' frames. Most spectacle orders are ready within 2–3 working days.",
  },
  {
    q: "Is parking available at your Sakchi clinic?",
    a: "We are located at Swastik Ambika Tower, near HDFC Bank in Kashidih New Layout Area, Sakchi. Street and limited paid parking is available nearby. For elderly patients, we recommend being dropped off at the entrance. Call us if you need directions.",
  },
  {
    q: "What should I bring to my first appointment?",
    a: "Please bring a valid photo ID, any previous eye prescription or old spectacles, a list of current medications, and your booking reference number (if booked online). For dilated retina/glaucoma checks, avoid driving yourself back — arrange a driver or use a cab.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-16 sm:py-24 bg-gradient-to-b from-white to-[#f0f9fb]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0b6e8f]/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#0b6e8f] ring-1 ring-[#0b6e8f]/15">
            <HelpCircle className="h-3.5 w-3.5" /> Frequently Asked
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-[#084f67]">
            Your Questions, Answered
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Everything you need to know before your visit. Can't find what you're
            looking for? We're just a call away.
          </p>
        </div>

        <div className="mt-10 space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={`rounded-2xl border bg-white overflow-hidden transition-all ${
                  isOpen
                    ? "border-[#0b6e8f]/30 shadow-md shadow-[#0b6e8f]/5"
                    : "border-slate-200 hover:border-[#0b6e8f]/25"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 sm:px-6 py-4 text-left"
                >
                  <span className={`text-[15px] sm:text-base font-semibold ${isOpen ? "text-[#084f67]" : "text-slate-800"}`}>
                    {f.q}
                  </span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all ${
                      isOpen ? "bg-[#0b6e8f] text-white rotate-180" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 sm:px-6 pb-5 text-sm leading-relaxed text-slate-600">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* CTA strip */}
        <div className="mt-10 rounded-2xl bg-gradient-to-r from-[#0b6e8f] to-[#084f67] p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-bold text-white">Still have a question?</h3>
            <p className="text-sm text-white/75 mt-0.5">
              Our friendly team is happy to help — talk to us directly.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <a
              href={`tel:${PHONES.primaryTel}`}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-[#084f67] hover:bg-white/95 shadow-sm"
            >
              <Phone className="h-4 w-4" /> {PHONES.primary}
            </a>
            <a
              href={`https://wa.me/${PHONES.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 px-4 py-2.5 text-sm font-bold text-white shadow-sm"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

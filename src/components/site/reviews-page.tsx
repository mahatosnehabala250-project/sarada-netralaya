"use client";

import Link from "next/link";
import { Star, ArrowLeft, Quote, CheckCircle2 } from "lucide-react";
import { SITE } from "@/lib/site-info";

const REVIEWS = [
  { name: "Ramesh Agarwal", detail: "Cataract Surgery · Sakchi", rating: 5, initials: "RA", text: "I was nervous about cataract surgery, but Dr. Dhira explained everything calmly. The Topical Phaco procedure was completely painless — no injection, no patch. I could see clearly the very next morning. Truly grateful to the entire team.", date: "2 months ago" },
  { name: "Sunita Devi", detail: "Glaucoma Evaluation · Bistupur", rating: 5, initials: "SD", text: "The OCT scan and detailed glaucoma check gave me complete peace of mind. The staff is courteous and the clinic is spotless. Dr. Dhira never rushes — he listens patiently. Best eye hospital in Jamshedpur, hands down.", date: "1 month ago" },
  { name: "Md. Imran", detail: "Pediatric Eye Check · Mango", rating: 5, initials: "MI", text: "Brought my 7-year-old daughter for a squint consultation. The doctor was wonderful with children — made her comfortable throughout. The diagnosis was clear and honest, with no unnecessary tests. Highly recommend for kids' eye care.", date: "3 weeks ago" },
  { name: "Priya Sharma", detail: "Optical & Eyewear · Kadma", rating: 5, initials: "PS", text: "Got my new computerized eye testing done and picked up stylish frames within my budget. The optical section has a fantastic range for every price point. Quick service and the glasses were ready in two days. Very satisfied!", date: "1 week ago" },
  { name: "Birendra Mahato", detail: "Retina Consultation · Adityapur", rating: 5, initials: "BM", text: "Travelled from Adityapur specifically for Dr. Dhira's retinal evaluation. Worth every minute of the journey. The HVF and OCT reports were explained in simple language. 30+ years of experience really shows in his diagnosis.", date: "1 month ago" },
  { name: "Anita Sahu", detail: "Squint Correction · Sonari", rating: 5, initials: "AS", text: "After years of hiding my squint, I finally got it corrected at Sarada Netralaya. The result is life-changing. The clinic follows strict hygiene and the follow-up care was excellent. Thank you for giving me my confidence back.", date: "2 weeks ago" },
  { name: "Rajesh Verma", detail: "Cataract Surgery · Sakchi", rating: 5, initials: "RV", text: "My 68-year-old father had cataract surgery here. The whole process was smooth — from booking to surgery to recovery. No pain, no complications. The staff called the next day to check on him. Highly professional team.", date: "3 months ago" },
  { name: "Kavita Singh", detail: "Routine Checkup · Bistupur", rating: 5, initials: "KS", text: "Best eye clinic in Jamshedpur. Clean, modern, and the doctor actually takes time to explain everything. Got my new prescription glasses made here too — great quality and reasonable price.", date: "2 weeks ago" },
  { name: "Sunil Goswami", detail: "Glaucoma Treatment · Kadma", rating: 5, initials: "SG", text: "Dr. Dhira detected my glaucoma early during a routine check. The treatment plan was clear and affordable. The HVF testing was done in-house — no running around to different labs. Very convenient and professional.", date: "1 month ago" },
];

export function ReviewsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-[#0a3d4a] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0a3d4a] to-[#10b981]">
              <Star className="h-4 w-4 text-white fill-white" />
            </span>
            <span className="font-bold text-white">Reviews</span>
          </div>
        </div>
      </header>

      {/* Rating summary */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 text-center">
          <div className="inline-flex items-center gap-3 rounded-2xl bg-amber-50 border border-amber-200 px-6 py-4 mb-6">
            <div className="text-5xl font-bold text-[#0a3d4a]">{SITE.rating}</div>
            <div className="text-left">
              <div className="flex">
                {[0,1,2,3,4].map((i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="text-sm text-slate-500 mt-1">{SITE.reviewsCount} Google Reviews</div>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0a3d4a]">
            What our patients say
          </h1>
          <p className="mt-4 text-base text-slate-600 max-w-2xl mx-auto">
            Real stories from real patients. We're proud of the trust we've built
            over 30+ years of dedicated eye care in Jamshedpur.
          </p>
        </div>
      </div>

      {/* Reviews grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {REVIEWS.map((r, i) => (
            <div key={i} className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0a3d4a] text-white font-bold">
                  {r.initials}
                </span>
                <div className="min-w-0">
                  <div className="font-bold text-[#0a3d4a] truncate">{r.name}</div>
                  <div className="text-xs text-slate-400 truncate">{r.detail}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-slate-400">{r.date}</span>
              </div>
              <Quote className="h-5 w-5 text-[#10b981]/20 mb-1" fill="currentColor" />
              <p className="text-sm text-slate-600 leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#0a3d4a] py-12">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <div className="inline-flex items-center gap-2 text-[#10b981] text-sm font-bold mb-3">
            <CheckCircle2 className="h-5 w-5" /> Ready to see clearly?
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Join 50,000+ happy patients</h2>
          <p className="mt-2 text-sm text-white/60">Book your appointment today and experience the difference.</p>
          <a href="/#book" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white px-7 py-3.5 text-base font-bold transition-colors">
            Book Appointment
          </a>
        </div>
      </div>
    </div>
  );
}

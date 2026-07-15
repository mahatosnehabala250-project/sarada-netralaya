"use client";

import Link from "next/link";
import { Star, ArrowLeft, Quote, ExternalLink } from "lucide-react";

// Real Google review links provided by the clinic.
const GOOGLE_REVIEWS = [
  "https://share.google/98WwefXxUgmmAGbG9",
  "https://share.google/q8lwbznXXrmvEufcT",
  "https://share.google/DE81V7IuKvVQz0cZN",
  "https://share.google/CAca3lzRmOr0klUWy",
  "https://share.google/uC126e8QifN42eDXa",
];

const REVIEWS_SEARCH =
  "https://www.google.com/search?q=Sarada+Netralaya+Baradwari+Jamshedpur+reviews";

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

      {/* Intro */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0a3d4a]">
            What our patients say
          </h1>
          <p className="mt-4 text-base text-slate-600 max-w-2xl mx-auto">
            Our patients share their experiences on Google. Read genuine reviews
            from people we&apos;ve cared for at Sarada Netralaya, Jamshedpur.
          </p>
          <a
            href={REVIEWS_SEARCH}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0a3d4a] px-7 py-3.5 text-base font-bold text-white hover:bg-[#0c4a5a] transition-colors"
          >
            Read all reviews on Google
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Real Google review links */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {GOOGLE_REVIEWS.map((url, i) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:border-[#0a3d4a]/30 transition-all"
            >
              <Quote className="h-6 w-6 text-[#10b981]/25" fill="currentColor" />
              <div className="mt-3 flex">
                {[0, 1, 2, 3, 4].map((s) => (
                  <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="mt-3 font-bold text-[#0a3d4a]">Verified Google Review #{i + 1}</div>
              <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-slate-500 group-hover:text-[#0a3d4a]">
                Read this review on Google
                <ExternalLink className="h-3.5 w-3.5" />
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#0a3d4a] py-12">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Ready to see clearly?</h2>
          <p className="mt-2 text-sm text-white/60">Book your appointment today and experience the difference.</p>
          <Link href="/book" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white px-7 py-3.5 text-base font-bold transition-colors">
            Book Appointment
          </Link>
        </div>
      </div>
    </div>
  );
}

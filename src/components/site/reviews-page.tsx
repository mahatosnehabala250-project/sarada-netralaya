import Link from "next/link";
import { Star, ArrowLeft, Quote, ExternalLink } from "lucide-react";
import { REVIEWS, REVIEWS_URL } from "@/lib/site-info";

function initials(name: string) {
  return name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export function ReviewsPage() {
  const avg = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-[#0047AB] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#003a8c] to-[#3b82f6]">
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
            <div className="text-5xl font-bold text-[#0047AB]">{avg}</div>
            <div className="text-left">
              <div className="flex">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="text-sm text-slate-500 mt-1">Based on Google reviews</div>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0047AB]">
            What our patients say
          </h1>
          <p className="mt-4 text-base text-slate-600 max-w-2xl mx-auto">
            Real stories from patients we&apos;ve cared for at Sarada Netralaya, Baradwari, Jamshedpur.
          </p>
          <a href={REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0047AB] px-7 py-3.5 text-base font-bold text-white hover:bg-[#003a8c] transition-colors">
            View on Google <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Reviews grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
          {REVIEWS.map((r) => (
            <div key={r.name + r.when} className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0047AB] text-white font-bold">
                  {initials(r.name)}
                </span>
                <div className="min-w-0">
                  <div className="font-bold text-[#0047AB] truncate">{r.name}</div>
                  <div className="text-xs text-slate-400 truncate">{r.detail} · {r.when}</div>
                </div>
              </div>
              <div className="flex mb-3">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <Quote className="h-5 w-5 text-[#0047AB]/20 mb-1" fill="currentColor" />
              <p className="text-sm text-slate-600 leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#0047AB] py-12">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Ready to see clearly?</h2>
          <p className="mt-2 text-sm text-white/60">Book your appointment today and experience the difference.</p>
          <Link href="/book" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white hover:bg-blue-50 text-[#0047AB] px-7 py-3.5 text-base font-bold transition-colors">
            Book Appointment
          </Link>
        </div>
      </div>
    </div>
  );
}

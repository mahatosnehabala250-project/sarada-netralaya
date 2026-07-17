import Link from "next/link";
import { Star, ExternalLink, Quote } from "lucide-react";
import { REVIEWS, REVIEWS_URL } from "@/lib/site-info";

// Show the 3 most detailed reviews on the homepage; full list on /reviews.
const FEATURED = REVIEWS.slice(0, 3);

function initials(name: string) {
  return name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export function Testimonials() {
  return (
    <section id="testimonials" className="py-14 sm:py-20 lg:py-24 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14 max-w-2xl mx-auto">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#0047AB] mb-3">
            Patient Reviews
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0047AB]">
            What our patients say
          </h2>
          <p className="mt-4 text-base text-slate-600">
            Genuine reviews from patients we&apos;ve cared for at Sarada Netralaya.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {FEATURED.map((r) => (
            <article key={r.name + r.when} className="flex flex-col rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
              <Quote className="h-7 w-7 text-[#0047AB]/15" fill="currentColor" />
              <div className="mt-2 flex">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mt-3 flex-1 text-sm text-slate-600 leading-relaxed line-clamp-[10]">{r.text}</p>
              <div className="mt-5 flex items-center gap-3 pt-4 border-t border-slate-100">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0047AB] text-white text-sm font-bold">
                  {initials(r.name)}
                </span>
                <div className="min-w-0">
                  <div className="font-bold text-[#0047AB] text-sm truncate">{r.name}</div>
                  <div className="text-xs text-slate-400">{r.detail} · {r.when}</div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/reviews" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0047AB] px-7 py-3.5 text-sm font-bold text-white hover:bg-[#003a8c] transition-colors">
              Read all patient reviews
            </Link>
            <a href={REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-7 py-3.5 text-sm font-bold text-[#0047AB] hover:bg-slate-50 transition-colors">
              View on Google <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

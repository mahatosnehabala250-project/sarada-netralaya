import { Star, ExternalLink, Quote } from "lucide-react";

// Real Google review links provided by the clinic. We link to the genuine
// reviews rather than displaying invented quotes.
const GOOGLE_REVIEWS = [
  "https://share.google/98WwefXxUgmmAGbG9",
  "https://share.google/q8lwbznXXrmvEufcT",
  "https://share.google/DE81V7IuKvVQz0cZN",
  "https://share.google/CAca3lzRmOr0klUWy",
  "https://share.google/uC126e8QifN42eDXa",
];

const REVIEWS_SEARCH =
  "https://www.google.com/search?q=Sarada+Netralaya+Baradwari+Jamshedpur+reviews";

export function Testimonials() {
  return (
    <section id="testimonials" className="py-14 sm:py-20 lg:py-24 bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#0047AB] mb-3">
          Patient Reviews
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0047AB]">
          What our patients say
        </h2>
        <p className="mt-4 text-base text-slate-600 max-w-xl mx-auto">
          Our patients share their experiences on Google. Read genuine reviews
          from people we&apos;ve cared for at Sarada Netralaya.
        </p>

        {/* Real Google review links */}
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GOOGLE_REVIEWS.map((url, i) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl bg-white border border-slate-200 p-5 text-left shadow-sm hover:shadow-lg hover:border-[#0047AB]/30 transition-all"
            >
              <Quote className="h-6 w-6 text-[#0047AB]/20" fill="currentColor" />
              <div className="mt-3 flex">
                {[0, 1, 2, 3, 4].map((s) => (
                  <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="mt-3 text-sm font-semibold text-[#0047AB]">
                Verified Google Review #{i + 1}
              </div>
              <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-slate-500 group-hover:text-[#0047AB]">
                Read on Google
                <ExternalLink className="h-3 w-3" />
              </span>
            </a>
          ))}
        </div>

        <a
          href={REVIEWS_SEARCH}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex items-center justify-center gap-2 rounded-lg bg-[#0047AB] px-7 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-[#003a8c] transition-colors"
        >
          Read all reviews on Google
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}

import { SITE, DOCTOR } from "@/lib/site-info";

const METRICS = [
  { value: `${SITE.yearsExperience}`, label: "Years of Practice" },
  { value: "50,000+", label: "Patients Served" },
  { value: SITE.rating, label: "Google Rating" },
  { value: "FICO", label: "U.K. Qualified" },
];

export function StatsBand() {
  return (
    <section className="bg-[#0a3d4a] border-y border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-4">
          {METRICS.map((m, i) => (
            <div
              key={m.label}
              className={`text-center lg:text-left ${i > 0 ? "lg:border-l lg:border-white/10 lg:pl-6" : ""}`}
            >
              <div className="font-serif-display text-4xl sm:text-5xl font-bold text-emerald-300 tracking-tight">
                {m.value}
              </div>
              <div className="mt-1.5 text-xs sm:text-[13px] text-white/50 font-medium uppercase tracking-wider">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

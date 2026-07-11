import { Eye, Users, Star, Calendar, Award, Heart } from "lucide-react";
import { SITE } from "@/lib/site-info";

const STATS = [
  { icon: Calendar, value: `${SITE.yearsExperience}`, suffix: "+", label: "Years of Experience", tone: "from-teal-400 to-cyan-500" },
  { icon: Users, value: "50,000", suffix: "+", label: "Happy Patients", tone: "from-emerald-400 to-teal-500" },
  { icon: Star, value: SITE.rating, suffix: "", label: `${SITE.reviewsCount} Reviews`, tone: "from-amber-400 to-orange-500" },
  { icon: Eye, value: "10", suffix: "+", label: "Eye Care Services", tone: "from-sky-400 to-blue-500" },
];

const TRUST = [
  { icon: Award, label: "FICO (U.K.) Qualified Surgeon" },
  { icon: Heart, label: "Trained at L.V. Prasad Eye Institute" },
  { icon: Eye, label: "Latest Phaco & Laser Technology" },
];

export function StatsBand() {
  return (
    <section className="relative bg-gradient-to-r from-[#052f3f] via-[#074860] to-[#0b6e8f] overflow-hidden">
      {/* decorative */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "30px 30px" }} />
      <div className="pointer-events-none absolute -top-20 right-10 h-64 w-64 rounded-full bg-emerald-400/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${s.tone} shadow-lg ring-4 ring-white/10`}>
                <s.icon className="h-7 w-7 text-white" strokeWidth={2} />
              </div>
              <div className="mt-4 text-4xl sm:text-5xl font-black text-white tracking-tight tabular-nums">
                {s.value}
                <span className="text-emerald-300">{s.suffix}</span>
              </div>
              <div className="mt-1 text-xs sm:text-sm font-medium text-white/65 uppercase tracking-wider">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* trust row */}
        <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {TRUST.map((t) => (
            <div key={t.label} className="flex items-center gap-2 text-sm text-white/70">
              <t.icon className="h-4 w-4 text-emerald-300" />
              <span className="font-medium">{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

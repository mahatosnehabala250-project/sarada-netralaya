import { Eye, Users, Star, Award } from "lucide-react";
import { SITE } from "@/lib/site-info";

const METRICS = [
  { icon: Award, value: "30+", label: "Years Experience" },
  { icon: Users, value: "50,000+", label: "Patients Treated" },
  { icon: Star, value: SITE.rating, label: "Google Rating" },
  { icon: Eye, value: "10+", label: "Eye Care Services" },
];

export function StatsBand() {
  return (
    <section className="bg-[#0a3d4a]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {METRICS.map((m, i) => (
            <div
              key={m.label}
              className={`flex items-center gap-3 ${i > 0 ? "lg:border-l lg:border-white/10 lg:pl-6" : ""}`}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-emerald-300">
                <m.icon className="h-5 w-5" />
              </span>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white leading-tight">{m.value}</div>
                <div className="text-[11px] sm:text-xs text-white/50 font-medium uppercase tracking-wider mt-0.5">{m.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Users, Stethoscope, Eye, Award } from "lucide-react";

const METRICS = [
  { icon: Stethoscope, value: "1,000+", label: "Surgeries Performed" },
  { icon: Award, value: "15 Yrs", label: "Doctor's Experience" },
  { icon: Eye, value: "6", label: "Eye Care Services" },
  { icon: Users, value: "Since 2015", label: "Trusted Care" },
];

export function StatsBand() {
  return (
    <section className="bg-[#0047AB]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {METRICS.map((m) => (
            <div key={m.label} className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-[#10b981]">
                <m.icon className="h-5 w-5" />
              </span>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white leading-tight">{m.value}</div>
                <div className="text-[11px] sm:text-xs text-white/60 font-medium uppercase tracking-wider mt-0.5">{m.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

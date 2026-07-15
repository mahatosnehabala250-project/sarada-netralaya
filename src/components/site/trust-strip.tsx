import { Syringe, Zap, ShieldCheck, Clock4, HeartHandshake, Award } from "lucide-react";

const POINTS = [
  { icon: Syringe, title: "Modern Phaco", desc: "Phaco machine for cataract surgery" },
  { icon: Zap, title: "In-house Diagnostics", desc: "OCT, Biometry & more on-site" },
  { icon: ShieldCheck, title: "Since 2015", desc: "Trusted eye care in Jamshedpur" },
  { icon: Award, title: "FICO (U.K.)", desc: "Internationally qualified surgeon" },
  { icon: Clock4, title: "Quick Turnaround", desc: "Minimal wait, efficient consultations" },
  { icon: HeartHandshake, title: "Patient First", desc: "Compassionate, honest guidance" },
];

export function TrustStrip() {
  return (
    <section className="bg-white border-b border-[#0047AB]/8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {POINTS.map((p) => (
            <div
              key={p.title}
              className="flex flex-col items-center text-center group"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0047AB]/10 to-[#3b82f6]/10 text-[#0047AB] group-hover:from-[#0047AB] group-hover:to-[#003a8c] group-hover:text-white transition-all duration-300">
                <p.icon className="h-6 w-6" strokeWidth={2} />
              </span>
              <h3 className="mt-2.5 text-sm font-bold text-[#084f67]">{p.title}</h3>
              <p className="mt-0.5 text-[11px] leading-tight text-[#0f2f3a]/55">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

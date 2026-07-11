import { Award, GraduationCap, Stethoscope, BadgeCheck, Quote } from "lucide-react";
import { DOCTOR, SITE } from "@/lib/site-info";

const QUALS = [
  { icon: GraduationCap, label: "DOMS" },
  { icon: GraduationCap, label: "DNB" },
  { icon: Award, label: "FICO (U.K.)" },
];

export function Doctor() {
  return (
    <section id="doctor" className="py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block rounded-full bg-[#0b6e8f]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#0b6e8f]">
            Meet Your Doctor
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-[#084f67]">
            Expert Care You Can Trust
          </h2>
        </div>

        <div className="mt-12 max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl border border-[#0b6e8f]/10 bg-gradient-to-br from-white to-[#f0f9fb] shadow-lg">
            <div className="grid md:grid-cols-[280px_1fr]">
              {/* Portrait / monogram */}
              <div className="relative bg-gradient-to-br from-[#0b6e8f] to-[#063b4f] p-8 md:p-10 flex flex-col items-center justify-center text-center">
                <div className="pointer-events-none absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "22px 22px" }} />
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm border-2 border-white/30">
                  <span className="text-4xl font-bold text-white">ND</span>
                </div>
                <div className="relative mt-4 text-white">
                  <div className="text-xl font-bold">{DOCTOR.name}</div>
                  <div className="text-sm text-white/75">{DOCTOR.role}</div>
                </div>
                <div className="relative mt-5 flex flex-wrap gap-2 justify-center">
                  {QUALS.map((q) => (
                    <span
                      key={q.label}
                      className="inline-flex items-center gap-1 rounded-full bg-white/15 border border-white/20 px-2.5 py-1 text-[11px] font-semibold text-white"
                    >
                      <q.icon className="h-3 w-3" />
                      {q.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <div className="p-7 sm:p-10">
                <div className="flex items-start gap-2">
                  <BadgeCheck className="h-5 w-5 text-[#10b981] mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-[#084f67]">
                      {DOCTOR.name}
                    </h3>
                    <p className="text-sm text-[#0f2f3a]/60">
                      {DOCTOR.role} · {DOCTOR.qualifications}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-[#0b6e8f]/5 border border-[#0b6e8f]/10 p-4">
                  <Stethoscope className="h-4 w-4 text-[#0b6e8f] mt-0.5 shrink-0" />
                  <p className="text-sm text-[#0f2f3a]/75">
                    <span className="font-semibold text-[#084f67]">Trained at</span>{" "}
                    {DOCTOR.training}
                  </p>
                </div>

                <div className="relative mt-5">
                  <Quote className="absolute -top-1 -left-1 h-6 w-6 text-[#0b6e8f]/15" />
                  <p className="pl-6 text-[15px] leading-relaxed text-[#0f2f3a]/80">
                    {DOCTOR.bio}
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <Stat value={`${SITE.yearsExperience}`} label="Years Experience" />
                  <Stat value={SITE.rating} label="Google Rating" />
                  <Stat value={SITE.reviewsCount} label="Happy Reviews" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-[#0b6e8f]/10 bg-white p-3 text-center">
      <div className="text-2xl font-bold text-[#0b6e8f]">{value}</div>
      <div className="text-[11px] font-medium text-[#0f2f3a]/55 leading-tight mt-0.5">
        {label}
      </div>
    </div>
  );
}

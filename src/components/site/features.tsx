import { UserCheck, Cpu, ShieldCheck, HeartHandshake } from "lucide-react";

const FEATURES = [
  { icon: UserCheck, title: "Expert Doctors", desc: "Highly qualified & experienced team" },
  { icon: Cpu, title: "Advanced Technology", desc: "State-of-the-art equipment for accurate diagnosis" },
  { icon: ShieldCheck, title: "Safe & Trusted", desc: "Patient safety and care is our top priority" },
  { icon: HeartHandshake, title: "Patient First", desc: "Compassionate care with personal attention" },
];

export function Features() {
  return (
    <section className="bg-white py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
          {FEATURES.map((f) => (
            <div key={f.title} className="text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E6F0FF] text-[#0047AB]">
                <f.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-3 text-sm sm:text-base font-bold text-[#0047AB] uppercase tracking-wide">
                {f.title}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-[#333333] leading-snug">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

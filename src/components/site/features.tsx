"use client";

import { motion } from "framer-motion";
import { UserCheck, Cpu, ShieldCheck, HeartHandshake } from "lucide-react";

const FEATURES = [
  { icon: UserCheck, title: "Expert Doctors", desc: "Highly qualified & experienced team" },
  { icon: Cpu, title: "Advanced Technology", desc: "State-of-the-art equipment for accurate diagnosis" },
  { icon: ShieldCheck, title: "Safe & Trusted", desc: "Patient safety and care is our top priority" },
  { icon: HeartHandshake, title: "Patient First", desc: "Compassionate care with personal attention" },
];

export function Features() {
  return (
    <section className="bg-gradient-to-b from-white to-[#faf8f3] py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
        >
          {FEATURES.map((f) => (
            <motion.div
              key={f.title}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } }}
              className="group rounded-3xl bg-white/70 backdrop-blur-md border border-white/60 p-5 sm:p-6 text-center shadow-lg shadow-[#0047AB]/5 hover:shadow-xl hover:shadow-[#0047AB]/10 hover:-translate-y-1 transition-all duration-300"
            >
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0047AB] to-[#3b82f6] text-white shadow-md shadow-[#0047AB]/20 group-hover:scale-110 transition-transform">
                <f.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-sm sm:text-base font-bold text-[#0047AB] uppercase tracking-wide">
                {f.title}
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-[#333] leading-snug">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

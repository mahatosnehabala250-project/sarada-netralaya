"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CalendarCheck, Loader2, CheckCircle2, Phone, AlertCircle, Eye, Glasses,
  Search, ArrowLeft, ShieldCheck, Clock, Star, MapPin,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import { TIME_SLOTS } from "@/lib/appointments";
import { todayISTString } from "@/lib/ist";
import { PHONES, ADDRESS, SITE } from "@/lib/site-info";

type Dept = "" | "eye_care" | "optical";

export function BookingPage() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ ref: string; message: string } | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [department, setDepartment] = useState<Dept>("");
  const [preferredDate, setPreferredDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [note, setNote] = useState("");
  const [website, setWebsite] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const today = todayISTString();

  function fieldError(field: string): string | null {
    switch (field) {
      case "name": return !name.trim() ? "Required" : name.trim().length < 2 ? "Too short" : null;
      case "phone": return !phone.trim() ? "Required" : !/^[6-9]\d{9}$/.test(phone.trim()) ? "Enter a valid 10-digit mobile" : null;
      case "department": return department ? null : "Choose a department";
      case "preferredDate": return !preferredDate ? "Required" : preferredDate < today ? "Cannot be in the past" : null;
      case "timeSlot": return timeSlot ? null : "Choose a slot";
      default: return null;
    }
  }

  function validate(): string | null {
    const fields = ["name", "phone", "department", "preferredDate", "timeSlot"];
    setTouched(Object.fromEntries(fields.map((f) => [f, true])));
    for (const f of fields) { const e = fieldError(f); if (e) return e; }
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (success) setSuccess(null);
    const err = validate();
    if (err) { toast.error(err); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim(), age: age || undefined, department, preferredDate, timeSlot, note: note.trim() || undefined, website }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Something went wrong. Please call us."); return; }
      setSuccess({ ref: data.ref, message: data.message });
      toast.success("Appointment requested!");
      setName(""); setPhone(""); setAge(""); setDepartment(""); setPreferredDate(""); setTimeSlot(""); setNote(""); setWebsite(""); setTouched({});
    } catch { toast.error("Network error. Please call us instead."); }
    finally { setSubmitting(false); }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-[#0A5CFF] text-white sticky top-0 z-40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="Sarada Netralaya" width={32} height={22} className="shrink-0" />
            <span className="font-bold text-white text-sm sm:text-base">Book Appointment</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid lg:grid-cols-[1fr_320px] gap-6 lg:gap-8">
          {/* Left — form */}
          <div className="min-w-0">
            {success ? (
              <div className="rounded-2xl bg-white p-8 sm:p-12 text-center shadow-lg">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle2 className="h-9 w-9 text-emerald-600" />
                </div>
                <h2 className="mt-6 text-2xl font-bold text-[#0A5CFF]">Request received!</h2>
                <p className="mt-2 text-sm text-slate-600 max-w-sm mx-auto">{success.message}</p>
                <div className="mt-6 inline-flex flex-col items-center rounded-xl border-2 border-dashed border-[#0A5CFF]/20 bg-slate-50 px-10 py-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Your Reference</span>
                  <span className="mt-1 text-3xl font-black tracking-wider text-[#0A5CFF]">#{success.ref}</span>
                </div>
                <div className="mt-7 flex flex-col sm:flex-row gap-2.5 justify-center">
                  <a href={`tel:${PHONES.primaryTel}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A5CFF] text-white px-5 py-3 text-sm font-bold min-h-[44px]">
                    <Phone className="h-4 w-4" /> Call to confirm faster
                  </a>
                  <Link href="/track" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 text-[#0A5CFF] px-5 py-3 text-sm font-bold hover:bg-slate-50 min-h-[44px]">
                    <Search className="h-4 w-4" /> Track later
                  </Link>
                  <Button variant="outline" onClick={() => setSuccess(null)} className="border-slate-200 text-[#0A5CFF] min-h-[44px]">Book another</Button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-white shadow-lg overflow-hidden">
                {/* Form header */}
                <div className="bg-gradient-to-r from-[#0A5CFF] to-[#094FCC] px-6 py-5">
                  <h1 className="text-xl sm:text-2xl font-bold text-white">Schedule your visit</h1>
                  <p className="mt-1 text-sm text-white/60">Fill in your details — our team will call you to confirm. Takes less than a minute.</p>
                </div>

                <form onSubmit={onSubmit} className="p-5 sm:p-8" noValidate>
                  {/* Honeypot */}
                  <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
                    <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <Field label="Patient Name" required error={touched.name ? fieldError("name") : null}>
                      <Input value={name} onChange={(e) => setName(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, name: true }))} placeholder="e.g. Ramesh Kumar" maxLength={80}
                        className="h-12 sm:h-11 border-slate-200 focus-visible:border-[#0A5CFF] focus-visible:ring-[#0A5CFF]/20 text-base" />
                    </Field>
                    <Field label="Mobile Number" required error={touched.phone ? fieldError("phone") : null}>
                      <div className="flex items-stretch">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-200 bg-slate-50 text-sm font-semibold text-slate-600">+91</span>
                        <Input value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} onBlur={() => setTouched((t) => ({ ...t, phone: true }))} placeholder="98765 43210" inputMode="numeric"
                          className="h-12 sm:h-11 rounded-l-none border-slate-200 focus-visible:border-[#0A5CFF] focus-visible:ring-[#0A5CFF]/20 text-base" />
                      </div>
                    </Field>
                    <Field label="Age" hint="Optional">
                      <Input value={age} onChange={(e) => setAge(e.target.value.replace(/\D/g, "").slice(0, 3))} placeholder="e.g. 62" inputMode="numeric"
                        className="h-12 sm:h-11 border-slate-200 focus-visible:border-[#0A5CFF] focus-visible:ring-[#0A5CFF]/20 text-base" />
                    </Field>
                    <Field label="Department" required error={touched.department ? fieldError("department") : null}>
                      <div className="grid grid-cols-2 gap-2" onBlur={() => setTouched((t) => ({ ...t, department: true }))}>
                        {[
                          { v: "eye_care" as const, l: "Eye Care", icon: Eye },
                          { v: "optical" as const, l: "Optical", icon: Glasses },
                        ].map((d) => {
                          const active = department === d.v;
                          return (
                            <button key={d.v} type="button" onClick={() => { setDepartment(d.v); setTouched((t) => ({ ...t, department: true })); }}
                              className={`flex items-center gap-2 rounded-lg border px-3 py-3 text-left transition-all min-h-[48px] ${active ? "border-[#0A5CFF] bg-emerald-50 ring-1 ring-[#0A5CFF]/30" : "border-slate-200 hover:border-slate-300"}`}>
                              <d.icon className={`h-4 w-4 shrink-0 ${active ? "text-[#0A5CFF]" : "text-slate-400"}`} />
                              <span className={`text-sm font-semibold ${active ? "text-[#0A5CFF]" : "text-slate-600"}`}>{d.l}</span>
                            </button>
                          );
                        })}
                      </div>
                    </Field>
                    <Field label="Preferred Date" required error={touched.preferredDate ? fieldError("preferredDate") : null}>
                      <Input type="date" min={today} value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, preferredDate: true }))}
                        className="h-12 sm:h-11 border-slate-200 focus-visible:border-[#0A5CFF] focus-visible:ring-[#0A5CFF]/20 text-base" />
                    </Field>
                    <Field label="Time Slot" required error={touched.timeSlot ? fieldError("timeSlot") : null}>
                      <select value={timeSlot} onChange={(e) => { setTimeSlot(e.target.value); setTouched((t) => ({ ...t, timeSlot: true })); }} onBlur={() => setTouched((t) => ({ ...t, timeSlot: true }))}
                        className="h-12 sm:h-11 w-full appearance-none rounded-md border border-slate-200 bg-white px-3 text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0A5CFF]/20 focus:border-[#0A5CFF]">
                        <option value="">Select a slot</option>
                        {TIME_SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </Field>
                  </div>

                  <div className="mt-4 sm:mt-5">
                    <Field label="Reason for visit" hint="Optional">
                      <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Cataract — blurry vision in left eye" maxLength={500}
                        className="border-slate-200 focus-visible:border-[#0A5CFF] focus-visible:ring-[#0A5CFF]/20 min-h-[80px] text-base" />
                    </Field>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <Button type="submit" disabled={submitting} className="h-12 flex-1 bg-[#0A5CFF] hover:bg-[#094FCC] text-white text-base font-bold rounded-xl">
                      {submitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...</> : <><CalendarCheck className="mr-2 h-5 w-5" /> Book Appointment</>}
                    </Button>
                    <a href={`tel:${PHONES.primaryTel}`} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-slate-200 px-6 text-sm font-bold text-[#0A5CFF] hover:bg-slate-50 min-h-[48px]">
                      <Phone className="h-4 w-4" /> Call instead
                    </a>
                  </div>
                  <p className="mt-4 text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> Your information is private & secure — we never share your details.
                  </p>
                </form>
              </div>
            )}
          </div>

          {/* Right — sidebar */}
          <aside className="space-y-4">
            {/* Trust card */}
            <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex">
                  {[0,1,2,3,4].map((i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                </div>
                <span className="text-sm font-bold text-[#0A5CFF]">{SITE.rating}</span>
                <span className="text-xs text-slate-400">· {SITE.reviewsCount} reviews</span>
              </div>
              <div className="space-y-2.5">
                {[
                  { icon: ShieldCheck, text: "30+ years of trusted eye care" },
                  { icon: CheckCircle2, text: "Painless Phaco (no injection)" },
                  { icon: Eye, text: "FICO (U.K.) qualified surgeon" },
                  { icon: Clock, text: "Same-day appointment available" },
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-2">
                    <item.icon className="h-4 w-4 text-[#0A5CFF] shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact card */}
            <div className="rounded-2xl bg-[#0A5CFF] p-5 text-white">
              <h3 className="text-sm font-bold mb-3">Prefer to call?</h3>
              <a href={`tel:${PHONES.primaryTel}`} className="flex items-center gap-2 text-sm font-bold text-emerald-300 hover:text-emerald-200 mb-2 min-h-[40px]">
                <Phone className="h-4 w-4" /> {PHONES.primary}
              </a>
              <a href={`tel:${PHONES.secondaryTel}`} className="flex items-center gap-2 text-sm font-bold text-emerald-300 hover:text-emerald-200 mb-3 min-h-[40px]">
                <Phone className="h-4 w-4" /> {PHONES.secondary}
              </a>
              <div className="flex items-start gap-2 text-xs text-white/60 pt-3 border-t border-white/10">
                <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <span>{ADDRESS.short}</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-white/60 mt-2">
                <Clock className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <span>Mon–Sat · 10:00 AM – 7:30 PM</span>
              </div>
            </div>

            {/* Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-md aspect-[4/3] hidden lg:block">
              <Image src="/images/waiting-hall.png" alt="Our comfortable waiting area" fill sizes="320px" className="object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0A5CFF]/80 to-transparent p-3">
                <p className="text-white text-xs font-bold">Our waiting area</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, hint, error, children }: { label: string; required?: boolean; hint?: string; error?: string | null; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <Label className="text-sm font-semibold text-[#0A5CFF]">{label} {required && <span className="text-rose-500">*</span>}</Label>
        {hint && <span className="text-[11px] text-slate-400">{hint}</span>}
      </div>
      {children}
      {error && <p className="mt-1 text-[11px] font-medium text-rose-600">{error}</p>}
    </div>
  );
}

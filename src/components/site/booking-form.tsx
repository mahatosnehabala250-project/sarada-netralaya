"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarCheck, Loader2, CheckCircle2, Phone, AlertCircle, Eye, Glasses, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import { TIME_SLOTS } from "@/lib/appointment-shared";
import { todayISTString } from "@/lib/ist";
import { PHONES } from "@/lib/site-info";

type Dept = "" | "eye_care" | "optical";

export function BookingForm() {
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
  // Stable per-attempt key: a retry after a network error reuses it, so the
  // server can return the original booking instead of creating a duplicate.
  const [idempotencyKey, setIdempotencyKey] = useState(() => crypto.randomUUID());
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
        body: JSON.stringify({ name: name.trim(), phone: phone.trim(), age: age || undefined, department, preferredDate, timeSlot, note: note.trim() || undefined, website, idempotencyKey }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Something went wrong"); return; }
      setSuccess({ ref: data.ref, message: data.message });
      toast.success("Appointment requested");
      setIdempotencyKey(crypto.randomUUID()); // fresh key for the next booking
      setName(""); setPhone(""); setAge(""); setDepartment(""); setPreferredDate(""); setTimeSlot(""); setNote(""); setWebsite(""); setTouched({});
    } catch { toast.error("Network error"); }
    finally { setSubmitting(false); }
  }

  return (
    <section id="book" className="py-14 sm:py-20 lg:py-24 bg-[#0047AB]">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#0047AB] mb-3">
            Book Appointment
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Schedule your visit
          </h2>
          <p className="mt-3 text-sm text-white/60 max-w-md mx-auto">
            Fill in your details and our team will call you to confirm. It takes less than a minute.
          </p>
        </div>

        {success ? (
          <div className="rounded-2xl bg-white p-6 sm:p-10 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-9 w-9 text-emerald-600" />
            </div>
            <h3 className="mt-6 text-2xl font-bold text-[#0047AB]">Request received!</h3>
            <p className="mt-2 text-sm text-slate-600 max-w-sm mx-auto">{success.message}</p>
            <div className="mt-6 inline-flex flex-col items-center rounded-xl border-2 border-dashed border-[#0047AB]/20 bg-slate-50 px-10 py-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Your Reference</span>
              <span className="mt-1 text-3xl font-black tracking-wider text-[#0047AB]">#{success.ref}</span>
            </div>
            <div className="mt-7 flex flex-col sm:flex-row gap-2.5 justify-center">
              <a href={`tel:${PHONES.primaryTel}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0047AB] text-white px-5 py-2.5 text-sm font-bold min-h-[44px]">
                <Phone className="h-4 w-4" /> Call to confirm
              </a>
              <Link href="/track" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 text-[#0047AB] px-5 py-2.5 text-sm font-bold hover:bg-slate-50 min-h-[44px]">
                <Search className="h-4 w-4" /> Track later
              </Link>
              <Button variant="outline" onClick={() => setSuccess(null)} className="border-slate-200 text-[#0047AB] min-h-[44px]">Book another</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="rounded-2xl bg-white p-5 sm:p-8 shadow-2xl" noValidate>
            <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
              <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <Field label="Patient Name" required error={touched.name ? fieldError("name") : null}>
                <Input value={name} onChange={(e) => setName(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, name: true }))} placeholder="e.g. Ramesh Kumar" maxLength={80}
                  className="h-12 sm:h-11 border-slate-200 focus-visible:border-[#0047AB] focus-visible:ring-[#0047AB]/20 text-base" />
              </Field>
              <Field label="Mobile Number" required error={touched.phone ? fieldError("phone") : null}>
                <div className="flex items-stretch">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-200 bg-slate-50 text-sm font-semibold text-slate-600">+91</span>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} onBlur={() => setTouched((t) => ({ ...t, phone: true }))} placeholder="98765 43210" inputMode="numeric"
                    className="h-12 sm:h-11 rounded-l-none border-slate-200 focus-visible:border-[#0047AB] focus-visible:ring-[#0047AB]/20 text-base" />
                </div>
              </Field>
              <Field label="Age" hint="Optional">
                <Input value={age} onChange={(e) => setAge(e.target.value.replace(/\D/g, "").slice(0, 3))} placeholder="e.g. 62" inputMode="numeric"
                  className="h-12 sm:h-11 border-slate-200 focus-visible:border-[#0047AB] focus-visible:ring-[#0047AB]/20 text-base" />
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
                        className={`flex items-center gap-2 rounded-lg border px-3 py-3 text-left transition-all min-h-[48px] ${active ? "border-[#0047AB] bg-emerald-50 ring-1 ring-[#0047AB]/30" : "border-slate-200 hover:border-slate-300"}`}>
                        <d.icon className={`h-4 w-4 shrink-0 ${active ? "text-[#0047AB]" : "text-slate-400"}`} />
                        <span className={`text-sm font-semibold ${active ? "text-[#0047AB]" : "text-slate-600"}`}>{d.l}</span>
                      </button>
                    );
                  })}
                </div>
              </Field>
              <Field label="Preferred Date" required error={touched.preferredDate ? fieldError("preferredDate") : null}>
                <Input type="date" min={today} value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, preferredDate: true }))}
                  className="h-12 sm:h-11 border-slate-200 focus-visible:border-[#0047AB] focus-visible:ring-[#0047AB]/20 text-base" />
              </Field>
              <Field label="Time Slot" required error={touched.timeSlot ? fieldError("timeSlot") : null}>
                <select value={timeSlot} onChange={(e) => { setTimeSlot(e.target.value); setTouched((t) => ({ ...t, timeSlot: true })); }} onBlur={() => setTouched((t) => ({ ...t, timeSlot: true }))}
                  className="h-12 sm:h-11 w-full appearance-none rounded-md border border-slate-200 bg-white px-3 text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB]">
                  <option value="">Select a slot</option>
                  {TIME_SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            </div>

            <div className="mt-4 sm:mt-5">
              <Field label="Reason for visit" hint="Optional">
                <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Cataract — blurry vision in left eye" maxLength={500}
                  className="border-slate-200 focus-visible:border-[#0047AB] focus-visible:ring-[#0047AB]/20 min-h-[80px] text-base" />
              </Field>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button type="submit" disabled={submitting} className="h-12 flex-1 bg-[#0047AB] hover:bg-[#003a8c] text-white text-base font-bold rounded-xl">
                {submitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...</> : <><CalendarCheck className="mr-2 h-5 w-5" /> Book Appointment</>}
              </Button>
              <a href={`tel:${PHONES.primaryTel}`} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-slate-200 px-6 text-sm font-bold text-[#0047AB] hover:bg-slate-50 min-h-[48px]">
                <Phone className="h-4 w-4" /> Call instead
              </a>
            </div>
            <p className="mt-4 text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
              <AlertCircle className="h-3 w-3" /> Your information is private & secure — we never share your details.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({ label, required, hint, error, children }: { label: string; required?: boolean; hint?: string; error?: string | null; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <Label className="text-sm font-semibold text-[#0047AB]">{label} {required && <span className="text-rose-500">*</span>}</Label>
        {hint && <span className="text-[11px] text-slate-400">{hint}</span>}
      </div>
      {children}
      {error && <p className="mt-1 text-[11px] font-medium text-rose-600">{error}</p>}
    </div>
  );
}

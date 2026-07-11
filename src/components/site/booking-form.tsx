"use client";

import { useState } from "react";
import {
  CalendarCheck, Loader2, CheckCircle2, Phone, AlertCircle,
  CalendarDays, Clock, Eye, Glasses, ShieldCheck, User,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TIME_SLOTS } from "@/lib/appointments";
import { todayISTString } from "@/lib/ist";
import { PHONES } from "@/lib/site-info";

type Dept = "" | "eye_care" | "optical";

const DEPT_OPTIONS: {
  value: "eye_care" | "optical";
  label: string;
  icon: typeof Eye;
  desc: string;
}[] = [
  { value: "eye_care", label: "Eye Care", icon: Eye, desc: "Consultation / Surgery" },
  { value: "optical", label: "Optical", icon: Glasses, desc: "Eyewear / Testing" },
];

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
  const [website, setWebsite] = useState(""); // honeypot

  // touched fields for inline validation feedback
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const today = todayISTString();

  function fieldError(field: string): string | null {
    switch (field) {
      case "name":
        if (!name.trim()) return "Name is required";
        if (name.trim().length < 2) return "Name is too short";
        return null;
      case "phone":
        if (!phone.trim()) return "Mobile number is required";
        if (!/^[6-9]\d{9}$/.test(phone.trim()))
          return "Enter a valid 10-digit Indian mobile";
        return null;
      case "department":
        return department ? null : "Please choose a department";
      case "preferredDate":
        if (!preferredDate) return "Please choose a date";
        if (preferredDate < today) return "Date cannot be in the past";
        return null;
      case "timeSlot":
        return timeSlot ? null : "Please choose a time slot";
      default:
        return null;
    }
  }

  function validate(): string | null {
    const fields = ["name", "phone", "department", "preferredDate", "timeSlot"];
    // mark all touched
    setTouched(Object.fromEntries(fields.map((f) => [f, true])));
    for (const f of fields) {
      const e = fieldError(f);
      if (e) return e;
    }
    return null;
  }

  function markTouched(field: string) {
    setTouched((t) => ({ ...t, [field]: true }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (success) setSuccess(null);

    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          age: age || undefined,
          department,
          preferredDate,
          timeSlot,
          note: note.trim() || undefined,
          website,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Something went wrong. Please call us.");
        return;
      }
      setSuccess({ ref: data.ref, message: data.message });
      toast.success("Appointment request submitted!");
      setName(""); setPhone(""); setAge(""); setDepartment("");
      setPreferredDate(""); setTimeSlot(""); setNote(""); setWebsite("");
      setTouched({});
    } catch {
      toast.error("Network error. Please call us instead.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="book" className="relative py-16 sm:py-24 bg-gradient-to-b from-[#f0f9fb] to-white overflow-hidden">
      {/* soft background accents */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-teal-100/50 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -left-20 h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-200">
            <CalendarCheck className="h-3.5 w-3.5" /> Book Appointment
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-[#084f67]">
            Schedule Your Visit
          </h2>
          <p className="mt-3 text-base text-slate-600 max-w-lg mx-auto">
            Fill in your details and our team will call you to confirm your
            appointment. It takes less than a minute.
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs text-slate-500 ring-1 ring-slate-200 shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            Your information is private & secure
          </div>
        </div>

        <div className="mt-10 rounded-3xl bg-white border border-slate-200/80 shadow-[0_30px_60px_-20px_rgba(8,79,103,0.18)] ring-1 ring-slate-100/50 overflow-hidden">
          {/* form header strip */}
          <div className="bg-gradient-to-r from-[#0b6e8f] to-[#084f67] px-6 sm:px-8 py-4 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
              <CalendarDays className="h-5 w-5 text-white" />
            </span>
            <div>
              <div className="text-sm font-bold text-white">Appointment Request Form</div>
              <div className="text-[11px] text-white/70">Fields marked with * are required</div>
            </div>
          </div>

          {success ? (
            <SuccessCard
              ref_={success.ref}
              message={success.message}
              onReset={() => setSuccess(null)}
            />
          ) : (
            <form onSubmit={onSubmit} className="p-6 sm:p-8" noValidate>
              {/* Honeypot */}
              <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
                <label htmlFor="website_sn">Website</label>
                <input
                  id="website_sn"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              {/* Personal info group */}
              <FormGroup title="Patient Details" icon={User}>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Patient Name" required error={touched.name ? fieldError("name") : null}>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={() => markTouched("name")}
                      placeholder="e.g. Ramesh Kumar"
                      maxLength={80}
                      className="h-11 bg-slate-50 border-slate-200 focus-visible:ring-[#0b6e8f]/25 focus-visible:border-[#0b6e8f] focus-visible:bg-white"
                    />
                  </Field>

                  <Field label="Mobile Number" required hint="10-digit Indian mobile" error={touched.phone ? fieldError("phone") : null}>
                    <div className="flex items-stretch">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-200 bg-slate-100 text-sm font-semibold text-[#084f67]">
                        +91
                      </span>
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        onBlur={() => markTouched("phone")}
                        placeholder="98765 43210"
                        inputMode="numeric"
                        className="h-11 rounded-l-none bg-slate-50 border-slate-200 focus-visible:ring-[#0b6e8f]/25 focus-visible:border-[#0b6e8f] focus-visible:bg-white"
                      />
                    </div>
                  </Field>

                  <Field label="Age" hint="Optional">
                    <Input
                      value={age}
                      onChange={(e) => setAge(e.target.value.replace(/\D/g, "").slice(0, 3))}
                      placeholder="e.g. 62"
                      inputMode="numeric"
                      className="h-11 bg-slate-50 border-slate-200 focus-visible:ring-[#0b6e8f]/25 focus-visible:border-[#0b6e8f] focus-visible:bg-white"
                    />
                  </Field>

                  <Field label="Department" required error={touched.department ? fieldError("department") : null}>
                    <div className="grid grid-cols-2 gap-2.5" onBlur={() => markTouched("department")}>
                      {DEPT_OPTIONS.map((d) => {
                        const active = department === d.value;
                        return (
                          <button
                            key={d.value}
                            type="button"
                            onClick={() => { setDepartment(d.value); markTouched("department"); }}
                            className={`group flex items-center gap-2.5 rounded-xl border px-3.5 py-3 text-left transition-all ${
                              active
                                ? "border-[#0b6e8f] bg-teal-50 ring-2 ring-[#0b6e8f]/20 shadow-sm"
                                : "border-slate-200 bg-slate-50 hover:border-[#0b6e8f]/40 hover:bg-teal-50/50"
                            }`}
                          >
                            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                              active ? "bg-[#0b6e8f] text-white" : "bg-white text-slate-400 group-hover:text-[#0b6e8f]"
                            }`}>
                              <d.icon className="h-4.5 w-4.5" strokeWidth={2} />
                            </span>
                            <div className="leading-tight">
                              <div className={`text-sm font-bold ${active ? "text-[#084f67]" : "text-slate-700"}`}>
                                {d.label}
                              </div>
                              <div className="text-[10.5px] text-slate-400 leading-none mt-0.5">{d.desc}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </Field>
                </div>
              </FormGroup>

              {/* Appointment group */}
              <FormGroup title="Appointment Preferences" icon={CalendarCheck} className="mt-7">
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Preferred Date" required error={touched.preferredDate ? fieldError("preferredDate") : null}>
                    <div className="relative">
                      <CalendarDays className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        type="date"
                        min={today}
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        onBlur={() => markTouched("preferredDate")}
                        className="h-11 pl-9 bg-slate-50 border-slate-200 focus-visible:ring-[#0b6e8f]/25 focus-visible:border-[#0b6e8f] focus-visible:bg-white"
                      />
                    </div>
                  </Field>

                  <Field label="Preferred Time Slot" required error={touched.timeSlot ? fieldError("timeSlot") : null}>
                    <div className="relative">
                      <Clock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                      <select
                        value={timeSlot}
                        onChange={(e) => { setTimeSlot(e.target.value); markTouched("timeSlot"); }}
                        onBlur={() => markTouched("timeSlot")}
                        className="h-11 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 pl-9 pr-9 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0b6e8f]/25 focus:border-[#0b6e8f] focus:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select a slot</option>
                        {TIME_SLOTS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="none">
                        <path d="M5 7l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </Field>
                </div>
              </FormGroup>

              {/* Note */}
              <div className="mt-7">
                <Field label="Problem / Reason for Visit" hint="Optional">
                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Cataract — blurry vision in left eye"
                    maxLength={500}
                    className="bg-slate-50 border-slate-200 focus-visible:ring-[#0b6e8f]/25 focus-visible:border-[#0b6e8f] focus-visible:bg-white min-h-[90px]"
                  />
                </Field>
              </div>

              {/* Submit */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="h-12 flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-base font-semibold shadow-lg shadow-emerald-900/20"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      <CalendarCheck className="mr-2 h-5 w-5" /> Book Appointment
                    </>
                  )}
                </Button>
                <a
                  href={`tel:${PHONES.primaryTel}`}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                >
                  <Phone className="h-4 w-4 text-[#0b6e8f]" /> Call Instead
                </a>
              </div>

              <p className="mt-4 flex items-start gap-1.5 text-xs text-slate-500">
                <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0 text-slate-400" />
                By submitting, you agree to be contacted by Sarada Netralaya regarding
                your appointment. We respect your privacy — your details are never shared.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------- Field group wrapper (visual section divider) ---------- */
function FormGroup({
  title, icon: Icon, children, className = "",
}: {
  title: string; icon: typeof User; children: React.ReactNode; className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-3.5">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#0b6e8f]/10 text-[#0b6e8f]">
          <Icon className="h-3.5 w-3.5" strokeWidth={2.2} />
        </span>
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#084f67]">{title}</h3>
        <div className="flex-1 h-px bg-slate-100" />
      </div>
      {children}
    </div>
  );
}

/* ---------- Field with label + error ---------- */
function Field({
  label, required, hint, error, children,
}: {
  label: string; required?: boolean; hint?: string;
  error?: string | null; children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <Label className={`text-sm font-semibold ${error ? "text-rose-600" : "text-slate-700"}`}>
          {label} {required && <span className="text-rose-500">*</span>}
        </Label>
        {hint && <span className="text-[11px] text-slate-400">{hint}</span>}
      </div>
      {children}
      {error && (
        <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-rose-600">
          <AlertCircle className="h-3 w-3 shrink-0" /> {error}
        </p>
      )}
    </div>
  );
}

/* ---------- Success card ---------- */
function SuccessCard({
  ref_, message, onReset,
}: {
  ref_: string; message: string; onReset: () => void;
}) {
  return (
    <div className="p-8 sm:p-12 text-center relative overflow-hidden">
      {/* confetti dots */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute top-6 left-10 h-2 w-2 rounded-full bg-emerald-300" />
        <div className="absolute top-12 right-16 h-2.5 w-2.5 rounded-full bg-teal-300" />
        <div className="absolute bottom-20 left-20 h-2 w-2 rounded-full bg-emerald-400" />
        <div className="absolute bottom-10 right-10 h-2 w-2 rounded-full bg-teal-400" />
      </div>
      <div className="relative">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 ring-8 ring-emerald-50">
          <CheckCircle2 className="h-11 w-11 text-emerald-600" />
        </div>
        <h3 className="mt-6 text-2xl font-bold text-[#084f67]">Request Received!</h3>
        <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">{message}</p>

        <div className="mt-7 inline-flex flex-col items-center rounded-2xl border-2 border-dashed border-[#0b6e8f]/25 bg-teal-50/50 px-10 py-5">
          <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#0b6e8f]/70">
            Your Booking Reference
          </span>
          <span className="mt-1.5 text-4xl font-black tracking-wider text-[#084f67]">
            #{ref_}
          </span>
          <span className="mt-1 text-xs text-slate-500">
            Please keep this for your records
          </span>
        </div>

        <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`tel:${PHONES.primaryTel}`}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#0b6e8f] hover:bg-[#084f67] px-5 py-2.5 text-sm font-semibold text-white shadow-sm"
          >
            <Phone className="h-4 w-4" /> Call to confirm faster
          </a>
          <Button
            variant="outline"
            onClick={onReset}
            className="border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            Book Another Appointment
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { CalendarCheck, Loader2, CheckCircle2, Phone, AlertCircle, CalendarDays, Clock, Eye, Glasses } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TIME_SLOTS } from "@/lib/appointments";
import { todayISTString } from "@/lib/ist";
import { PHONES } from "@/lib/site-info";

type Dept = "" | "eye_care" | "optical";

const DEPT_OPTIONS: { value: "eye_care" | "optical"; label: string; icon: typeof Eye; desc: string }[] = [
  { value: "eye_care", label: "Eye Care", icon: Eye, desc: "Consultation / Surgery" },
  { value: "optical", label: "Optical", icon: Glasses, desc: "Eyewear / Testing" },
];

export function BookingForm() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ ref: string; message: string } | null>(null);

  // form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [department, setDepartment] = useState<Dept>("");
  const [preferredDate, setPreferredDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [note, setNote] = useState("");
  const [website, setWebsite] = useState(""); // honeypot

  const today = todayISTString();

  function validate(): string | null {
    if (!name.trim() || name.trim().length < 2) return "Please enter your full name";
    if (!/^[6-9]\d{9}$/.test(phone.trim()))
      return "Enter a valid 10-digit Indian mobile number";
    if (age && (Number(age) < 0 || Number(age) > 130)) return "Enter a valid age";
    if (!department) return "Please choose a department";
    if (!preferredDate) return "Please choose a preferred date";
    if (preferredDate < today) return "Please choose today or a future date";
    if (!timeSlot) return "Please choose a time slot";
    return null;
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
          website, // honeypot
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Something went wrong. Please call us.");
        return;
      }
      setSuccess({ ref: data.ref, message: data.message });
      toast.success("Appointment request submitted!");
      // reset (keep so user can see what they sent? we reset)
      setName(""); setPhone(""); setAge(""); setDepartment("");
      setPreferredDate(""); setTimeSlot(""); setNote(""); setWebsite("");
    } catch {
      toast.error("Network error. Please call us instead.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="book" className="py-16 sm:py-24 bg-gradient-to-b from-[#f0f9fb] to-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-block rounded-full bg-[#10b981]/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#059669]">
            Book Appointment
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-[#084f67]">
            Schedule Your Visit
          </h2>
          <p className="mt-3 text-base text-[#0f2f3a]/65">
            Fill in your details and our team will call you to confirm your
            appointment. It takes less than a minute.
          </p>
        </div>

        <div className="mt-10 rounded-3xl bg-white border border-[#0b6e8f]/10 shadow-xl shadow-[#0b6e8f]/5 overflow-hidden">
          {success ? (
            <SuccessCard
              ref_={success.ref}
              message={success.message}
              onReset={() => setSuccess(null)}
            />
          ) : (
            <form onSubmit={onSubmit} className="p-6 sm:p-8" noValidate>
              {/* Honeypot (hidden from humans) */}
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

              <div className="grid sm:grid-cols-2 gap-5">
                {/* Name */}
                <Field label="Patient Name" required>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    maxLength={80}
                    className="h-11 border-[#0b6e8f]/20 focus-visible:ring-[#0b6e8f]/30 focus-visible:border-[#0b6e8f]"
                  />
                </Field>

                {/* Phone */}
                <Field label="Mobile Number" required hint="10-digit Indian mobile">
                  <div className="flex items-stretch">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-[#0b6e8f]/20 bg-[#0b6e8f]/5 text-sm font-medium text-[#084f67]">
                      +91
                    </span>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="98765 43210"
                      inputMode="numeric"
                      className="h-11 rounded-l-none border-[#0b6e8f]/20 focus-visible:ring-[#0b6e8f]/30 focus-visible:border-[#0b6e8f]"
                    />
                  </div>
                </Field>

                {/* Age */}
                <Field label="Age" hint="Optional">
                  <Input
                    value={age}
                    onChange={(e) => setAge(e.target.value.replace(/\D/g, "").slice(0, 3))}
                    placeholder="e.g. 62"
                    inputMode="numeric"
                    className="h-11 border-[#0b6e8f]/20 focus-visible:ring-[#0b6e8f]/30 focus-visible:border-[#0b6e8f]"
                  />
                </Field>

                {/* Department */}
                <Field label="Department" required>
                  <div className="grid grid-cols-2 gap-2">
                    {DEPT_OPTIONS.map((d) => {
                      const active = department === d.value;
                      return (
                        <button
                          key={d.value}
                          type="button"
                          onClick={() => setDepartment(d.value)}
                          className={`flex flex-col items-start gap-0.5 rounded-lg border px-3 py-2.5 text-left transition-all ${
                            active
                              ? "border-[#0b6e8f] bg-[#0b6e8f]/5 ring-1 ring-[#0b6e8f]/30"
                              : "border-[#0b6e8f]/15 hover:border-[#0b6e8f]/40 hover:bg-[#0b6e8f]/5"
                          }`}
                        >
                          <d.icon className={`h-4 w-4 ${active ? "text-[#0b6e8f]" : "text-[#0f2f3a]/50"}`} />
                          <span className={`text-sm font-semibold ${active ? "text-[#084f67]" : "text-[#0f2f3a]/75"}`}>
                            {d.label}
                          </span>
                          <span className="text-[10px] text-[#0f2f3a]/45 leading-none">{d.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </Field>

                {/* Date */}
                <Field label="Preferred Date" required>
                  <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0b6e8f]/50" />
                    <Input
                      type="date"
                      min={today}
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="h-11 pl-9 border-[#0b6e8f]/20 focus-visible:ring-[#0b6e8f]/30 focus-visible:border-[#0b6e8f]"
                    />
                  </div>
                </Field>

                {/* Time slot */}
                <Field label="Preferred Time Slot" required>
                  <div className="relative">
                    <Clock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0b6e8f]/50 z-10" />
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="h-11 w-full appearance-none rounded-md border border-[#0b6e8f]/20 bg-white pl-9 pr-9 text-sm text-[#0f2f3a] focus:outline-none focus:ring-2 focus:ring-[#0b6e8f]/30 focus:border-[#0b6e8f] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select a slot</option>
                      {TIME_SLOTS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0b6e8f]/50" viewBox="0 0 20 20" fill="none">
                      <path d="M5 7l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </Field>
              </div>

              {/* Note */}
              <div className="mt-5">
                <Field label="Problem / Reason for Visit" hint="Optional">
                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Cataract — blurry vision in left eye"
                    maxLength={500}
                    className="border-[#0b6e8f]/20 focus-visible:ring-[#0b6e8f]/30 focus-visible:border-[#0b6e8f] min-h-[90px]"
                  />
                </Field>
              </div>

              {/* Submit */}
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="h-12 flex-1 bg-[#10b981] hover:bg-[#059669] text-white text-base font-semibold shadow-lg shadow-emerald-900/20"
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
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-[#0b6e8f]/25 px-5 text-sm font-semibold text-[#084f67] hover:bg-[#0b6e8f]/5"
                >
                  <Phone className="h-4 w-4" /> Call Instead
                </a>
              </div>

              <p className="mt-4 flex items-start gap-1.5 text-xs text-[#0f2f3a]/50">
                <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
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

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <Label className="text-sm font-semibold text-[#084f67]">
          {label} {required && <span className="text-rose-500">*</span>}
        </Label>
        {hint && <span className="text-[11px] text-[#0f2f3a]/40">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function SuccessCard({
  ref_,
  message,
  onReset,
}: {
  ref_: string;
  message: string;
  onReset: () => void;
}) {
  return (
    <div className="p-8 sm:p-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
        <CheckCircle2 className="h-9 w-9 text-emerald-600" />
      </div>
      <h3 className="mt-5 text-2xl font-bold text-[#084f67]">Request Received!</h3>
      <p className="mt-2 text-sm text-[#0f2f3a]/70 max-w-md mx-auto">{message}</p>

      <div className="mt-6 inline-flex flex-col items-center rounded-xl border border-dashed border-[#0b6e8f]/30 bg-[#0b6e8f]/5 px-8 py-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#0b6e8f]/70">
          Your Booking Reference
        </span>
        <span className="mt-1 text-3xl font-black tracking-wider text-[#084f67]">
          #{ref_}
        </span>
        <span className="mt-1 text-xs text-[#0f2f3a]/50">
          Please keep this for your records
        </span>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href={`tel:${PHONES.primaryTel}`}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#0b6e8f] hover:bg-[#084f67] px-5 py-2.5 text-sm font-semibold text-white"
        >
          <Phone className="h-4 w-4" /> Call to confirm faster
        </a>
        <Button
          variant="outline"
          onClick={onReset}
          className="border-[#0b6e8f]/25 text-[#084f67] hover:bg-[#0b6e8f]/5"
        >
          Book Another Appointment
        </Button>
      </div>
    </div>
  );
}

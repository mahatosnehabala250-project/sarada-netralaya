"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search, Loader2, CalendarCheck, Clock, Eye, Glasses, User,
  AlertCircle, ArrowLeft, CheckCircle2, Phone, FileText,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import { PHONES } from "@/lib/site-info";

type Result = {
  ref: string;
  name: string;
  phoneLast4: string;
  age: number | null;
  department: string;
  doctorLabel: string;
  preferredDateLabel: string;
  timeSlot: string;
  status: string;
  statusLabel: string;
  statusEmoji: string;
  note: string | null;
};

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  pending: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  confirmed: { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200" },
  done: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  cancelled: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
};

export function TrackAppointment() {
  const [ref, setRef] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [notFound, setNotFound] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    setNotFound(false);

    if (!ref.trim()) {
      toast.error("Please enter your booking reference");
      return;
    }
    if (!phone.trim() || phone.trim().length < 4) {
      toast.error("Please enter the last 4 digits of your mobile number");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/appointments/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ref: ref.trim(), phone: phone.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 404) {
          setNotFound(true);
        } else {
          toast.error(data.error ?? "Lookup failed");
        }
        return;
      }
      setResult(data.appointment);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f9fb] to-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#003a8c] hover:text-[#0047AB]">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-lg">👁️</span>
            <span className="font-bold text-[#003a8c]">Sarada Netralaya</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Title */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0047AB]/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#0047AB] ring-1 ring-[#0047AB]/15">
              <Search className="h-3.5 w-3.5" /> Track Appointment
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#003a8c]">
              Check Your Appointment Status
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Enter your booking reference number and the last 4 digits of your
              mobile number to see your appointment details.
            </p>
          </div>

          {/* Form card */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-xl shadow-[#0047AB]/5 overflow-hidden">
            <div className="bg-gradient-to-r from-[#0047AB] to-[#003a8c] px-6 py-4 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                <Search className="h-5 w-5 text-white" />
              </span>
              <div>
                <div className="text-sm font-bold text-white">Appointment Lookup</div>
                <div className="text-[11px] text-white/70">Have your reference number ready</div>
              </div>
            </div>

            <form onSubmit={onSubmit} className="p-6 space-y-4">
              <div>
                <Label htmlFor="ref" className="text-sm font-semibold text-slate-700">
                  Booking Reference <span className="text-rose-500">*</span>
                </Label>
                <div className="relative mt-1.5">
                  <FileText className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="ref"
                    value={ref}
                    onChange={(e) => setRef(e.target.value)}
                    placeholder="e.g. 87459812"
                    inputMode="numeric"
                    maxLength={10}
                    className="h-11 pl-9 bg-slate-50 border-slate-200 focus-visible:border-[#0047AB] focus-visible:bg-white font-mono"
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  The reference number from your booking confirmation
                </p>
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-semibold text-slate-700">
                  Last 4 Digits of Mobile <span className="text-rose-500">*</span>
                </Label>
                <div className="relative mt-1.5">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="e.g. 3210"
                    inputMode="numeric"
                    maxLength={4}
                    className="h-11 pl-9 bg-slate-50 border-slate-200 focus-visible:border-[#0047AB] focus-visible:bg-white font-mono"
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  For verification — we never share your full number
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#0047AB] hover:bg-[#003a8c] text-white font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" /> Check Status
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Result */}
          {result && (
            <div className="mt-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg overflow-hidden animate-[fadeIn_0.3s_ease-out]">
              <div className="bg-emerald-50 px-6 py-4 flex items-center gap-3 border-b border-emerald-200">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                <div>
                  <div className="text-sm font-bold text-emerald-800">Appointment Found</div>
                  <div className="text-xs text-emerald-600">Reference #{result.ref}</div>
                </div>
              </div>
              <div className="p-6">
                {/* Status pill */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Current Status</span>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold border ${STATUS_STYLES[result.status]?.bg ?? "bg-slate-50"} ${STATUS_STYLES[result.status]?.text ?? "text-slate-700"} ${STATUS_STYLES[result.status]?.border ?? "border-slate-200"}`}>
                    <span>{result.statusEmoji}</span> {result.statusLabel}
                  </span>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-3">
                  <DetailBlock icon={User} label="Patient" value={result.name} sub={result.age != null ? `${result.age} years` : undefined} />
                  <DetailBlock icon={Phone} label="Mobile" value={`••••••${result.phoneLast4}`} />
                  <DetailBlock icon={CalendarCheck} label="Date" value={result.preferredDateLabel} />
                  <DetailBlock icon={Clock} label="Time Slot" value={result.timeSlot} />
                  <DetailBlock icon={result.department === "optical" ? Glasses : Eye} label="Doctor" value={result.doctorLabel} />
                </div>

                {result.note && (
                  <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Your Note</div>
                    <p className="text-sm text-slate-700">{result.note}</p>
                  </div>
                )}

                {/* Status-specific message */}
                <div className={`mt-5 rounded-xl p-4 ${STATUS_STYLES[result.status]?.bg ?? "bg-slate-50"} border ${STATUS_STYLES[result.status]?.border ?? "border-slate-200"}`}>
                  <p className={`text-sm ${STATUS_STYLES[result.status]?.text ?? "text-slate-700"}`}>
                    {result.status === "pending" && "⏳ Your request is pending review. Our team will call you shortly to confirm the appointment."}
                    {result.status === "confirmed" && "📌 Your appointment is confirmed! Please arrive 10 minutes before your scheduled time. Bring a valid photo ID."}
                    {result.status === "done" && "✅ This appointment has been completed. Thank you for visiting Sarada Netralaya."}
                    {result.status === "cancelled" && "✕ This appointment was cancelled. To rebook, please book a new appointment or call us."}
                  </p>
                </div>

                {/* Help */}
                <div className="mt-5 flex flex-wrap gap-3 justify-center">
                  <a href={`tel:${PHONES.primaryTel}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0047AB] hover:underline">
                    <Phone className="h-4 w-4" /> Call us for help
                  </a>
                  <Link href="/#book" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0047AB] hover:underline">
                    <CalendarCheck className="h-4 w-4" /> Book new appointment
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Not found */}
          {notFound && (
            <div className="mt-6 rounded-2xl bg-white border-2 border-rose-200 shadow-lg p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100">
                <AlertCircle className="h-7 w-7 text-rose-600" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#003a8c]">Appointment Not Found</h3>
              <p className="mt-1 text-sm text-slate-600 max-w-sm mx-auto">
                We couldn't find an appointment with that reference number. Please
                check the number from your booking confirmation and try again.
              </p>
              <a href={`tel:${PHONES.primaryTel}`} className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#0047AB] hover:bg-[#003a8c] px-4 py-2 text-sm font-semibold text-white">
                <Phone className="h-4 w-4" /> Call us for help
              </a>
            </div>
          )}

          <p className="mt-6 text-center text-xs text-slate-400">
            Lost your reference number? Call us at{" "}
            <a href={`tel:${PHONES.primaryTel}`} className="font-semibold text-[#0047AB] hover:underline">
              {PHONES.primary}
            </a>{" "}
            and we'll help you find it.
          </p>
        </div>
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function DetailBlock({
  icon: Icon, label, value, sub,
}: { icon: typeof User; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="text-sm font-semibold text-slate-800">{value}</div>
      {sub && <div className="text-[11px] text-slate-500 mt-0.5">{sub}</div>}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import {
  Loader2, Phone, Save, X, User, CalendarDays, Clock,
  Eye, Glasses, FileText, UserPlus, CheckCircle2,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/lib/toast";
import {
  TIME_SLOTS, STATUSES, STATUS_META, DOCTOR_CHOICES,
  type Status, type DoctorId,
} from "@/lib/appointment-shared";
import { todayISTString } from "@/lib/ist";

export type NewAppt = {
  id: string; ref: string; name: string; phone: string; age: number | null;
  department: string; doctor: string | null; preferredDate: string; timeSlot: string;
  note: string | null; status: string; createdAt: string;
};

export function CreateAppointmentDialog({
  open, onOpenChange, onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: (a: NewAppt) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [doctor, setDoctor] = useState<DoctorId>("nitin-dhira");
  const [preferredDate, setPreferredDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<Status>("confirmed");
  const [success, setSuccess] = useState<NewAppt | null>(null);

  const today = todayISTString();

  useEffect(() => {
    if (open) {
      // reset on open
      setName(""); setPhone(""); setAge(""); setDoctor("nitin-dhira");
      setPreferredDate(""); setTimeSlot(""); setNote(""); setStatus("confirmed");
      setSuccess(null);
    }
  }, [open]);

  function validate(): string | null {
    if (name.trim().length < 2) return "Please enter the patient's name";
    if (!/^[6-9]\d{9}$/.test(phone.trim())) return "Enter a valid 10-digit mobile number";
    if (!preferredDate) return "Please choose a date";
    if (preferredDate < today) return "Date cannot be in the past";
    if (!timeSlot) return "Please choose a time slot";
    return null;
  }

  async function submit() {
    const err = validate();
    if (err) { toast.error(err); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/appointments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          age: age || undefined,
          doctor,
          preferredDate,
          timeSlot,
          note: note.trim() || undefined,
          status,
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Failed to create"); return; }
      toast.success(`Appointment #${data.item.ref} created`);
      setSuccess(data.item as NewAppt);
      onCreated(data.item as NewAppt);
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-6 py-5 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
            <UserPlus className="h-5 w-5 text-white" />
          </span>
          <div>
            <DialogTitle className="text-lg font-bold text-white">
              New Appointment
            </DialogTitle>
            <DialogDescription className="text-white/75 text-xs mt-0.5">
              Add a walk-in or phone booking directly
            </DialogDescription>
          </div>
        </div>

        <div className="p-6">
          {success ? (
            <CreatedSuccess appt={success} onDone={() => onOpenChange(false)} />
          ) : (
            <>
              {/* Patient group */}
              <SectionHeader icon={User} title="Patient Details" />
              <div className="grid sm:grid-cols-2 gap-4 mb-5">
                <div>
                  <Label className="text-sm font-semibold text-slate-700">Patient Name <span className="text-rose-500">*</span></Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={80}
                    placeholder="e.g. Ramesh Kumar"
                    className="mt-1.5 bg-slate-50 border-slate-200 focus-visible:border-[#3b82f6] focus-visible:bg-white" />
                </div>
                <div>
                  <Label className="text-sm font-semibold text-slate-700">Mobile Number <span className="text-rose-500">*</span></Label>
                  <div className="flex items-stretch mt-1.5">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-200 bg-slate-100 text-sm font-semibold text-[#2563eb]">+91</span>
                    <Input value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="98765 43210" inputMode="numeric"
                      className="rounded-l-none bg-slate-50 border-slate-200 focus-visible:border-[#3b82f6] focus-visible:bg-white" />
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-slate-700">Age</Label>
                  <Input value={age}
                    onChange={(e) => setAge(e.target.value.replace(/\D/g, "").slice(0, 3))}
                    placeholder="Optional" inputMode="numeric"
                    className="mt-1.5 bg-slate-50 border-slate-200 focus-visible:border-[#3b82f6] focus-visible:bg-white" />
                </div>
                <div>
                  <Label className="text-sm font-semibold text-slate-700">Initial Status</Label>
                  <select value={status} onChange={(e) => setStatus(e.target.value as Status)}
                    className="mt-1.5 h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/25 focus:border-[#3b82f6]">
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{STATUS_META[s].emoji} {STATUS_META[s].label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Appointment group */}
              <SectionHeader icon={CalendarDays} title="Appointment Details" />
              <div className="grid sm:grid-cols-2 gap-4 mb-5">
                <div className="sm:col-span-2">
                  <Label className="text-sm font-semibold text-slate-700">See Doctor <span className="text-rose-500">*</span></Label>
                  <div className="space-y-2 mt-1.5">
                    {DOCTOR_CHOICES.map((d) => {
                      const active = doctor === d.id;
                      const Icon = d.id === "optical" ? Glasses : Eye;
                      return (
                        <button key={d.id} type="button" onClick={() => setDoctor(d.id)}
                          className={`group flex w-full items-center gap-2 rounded-lg border px-3 py-2.5 text-left transition-all ${
                            active ? "border-[#3b82f6] bg-blue-50 ring-1 ring-[#3b82f6]/30"
                                   : "border-slate-200 bg-slate-50 hover:border-[#3b82f6]/40"
                          }`}>
                          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${active ? "bg-[#3b82f6] text-white" : "bg-white text-slate-400"}`}>
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="min-w-0">
                            <span className={`block text-sm font-semibold truncate ${active ? "text-[#2563eb]" : "text-slate-600"}`}>{d.name}</span>
                            <span className="block text-xs text-slate-400 truncate">{d.role}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-slate-700">Preferred Date <span className="text-rose-500">*</span></Label>
                  <div className="relative mt-1.5">
                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input type="date" min={today} value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="pl-9 bg-slate-50 border-slate-200 focus-visible:border-[#3b82f6] focus-visible:bg-white" />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-sm font-semibold text-slate-700">Time Slot <span className="text-rose-500">*</span></Label>
                  <div className="relative mt-1.5">
                    <Clock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                    <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}
                      className="h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 pl-9 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/25 focus:border-[#3b82f6]">
                      <option value="">Select a slot</option>
                      {TIME_SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="none">
                      <path d="M5 7l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-sm font-semibold text-slate-700">Note</Label>
                  <Textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={500}
                    placeholder="Optional — reason for visit, patient concerns, etc."
                    className="mt-1.5 bg-slate-50 border-slate-200 focus-visible:border-[#3b82f6] focus-visible:bg-white min-h-[70px]" />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}
                  className="border-slate-200 text-slate-700">
                  <X className="h-4 w-4 mr-1.5" /> Cancel
                </Button>
                <Button onClick={submit} disabled={saving}
                  className="bg-[#3b82f6] hover:bg-[#2563eb] text-white">
                  {saving ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Save className="h-4 w-4 mr-1.5" />}
                  Create Appointment
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SectionHeader({ icon: Icon, title }: { icon: typeof User; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3.5">
      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#3b82f6]/10 text-[#3b82f6]">
        <Icon className="h-3.5 w-3.5" strokeWidth={2.2} />
      </span>
      <h3 className="text-xs font-bold uppercase tracking-wider text-[#2563eb]">{title}</h3>
      <div className="flex-1 h-px bg-slate-100" />
    </div>
  );
}

function CreatedSuccess({ appt, onDone }: { appt: NewAppt; onDone: () => void }) {
  return (
    <div className="text-center py-6">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 ring-8 ring-emerald-50">
        <CheckCircle2 className="h-9 w-9 text-emerald-600" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-[#2563eb]">Appointment Created!</h3>
      <p className="mt-1 text-sm text-slate-600">
        Booking reference <span className="font-mono font-bold text-[#3b82f6]">#{appt.ref}</span> for{" "}
        <span className="font-semibold">{appt.name}</span>.
      </p>
      <div className="mt-5 flex justify-center gap-2">
        <Button onClick={onDone} className="bg-[#3b82f6] hover:bg-[#2563eb] text-white">
          Done
        </Button>
      </div>
    </div>
  );
}

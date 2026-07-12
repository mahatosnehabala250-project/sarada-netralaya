"use client";

import { useState, useEffect } from "react";
import {
  Loader2, Phone, Save, Trash2, X, CalendarDays, Clock,
  Eye, Glasses, User, FileText, AlertCircle, ExternalLink,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/lib/toast";
import {
  DEPT_LABEL, STATUS_META, TIME_SLOTS, DEPARTMENTS,
  type Status, type Department,
} from "@/lib/appointments";
import { formatDateLong, formatCreatedAtIST, todayISTString } from "@/lib/ist";

export type Appt = {
  id: string;
  ref: string;
  name: string;
  phone: string;
  age: number | null;
  department: string;
  preferredDate: string;
  timeSlot: string;
  note: string | null;
  status: string;
  createdAt: string;
};

export function AppointmentDetailDialog({
  appt, open, onOpenChange, onUpdated, onDeleted,
}: {
  appt: Appt | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onUpdated: (a: Appt) => void;
  onDeleted: (id: string) => void;
}) {
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // editable fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [department, setDepartment] = useState<Department>("eye_care");
  const [preferredDate, setPreferredDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<Status>("pending");

  const today = todayISTString();

  useEffect(() => {
    if (appt) {
      setName(appt.name);
      setPhone(appt.phone);
      setAge(appt.age != null ? String(appt.age) : "");
      setDepartment(appt.department as Department);
      setPreferredDate(appt.preferredDate);
      setTimeSlot(appt.timeSlot);
      setNote(appt.note ?? "");
      setStatus(appt.status as Status);
      setMode("view");
    }
  }, [appt]);

  if (!appt) return null;

  const st = appt.status as Status;
  const meta = STATUS_META[st];

  async function save() {
    if (!appt) return;
    // basic validation
    if (name.trim().length < 2) { toast.error("Name is too short"); return; }
    if (!/^[6-9]\d{9}$/.test(phone.trim())) { toast.error("Invalid phone number"); return; }
    if (preferredDate < today) { toast.error("Date cannot be in the past"); return; }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/appointments/${appt.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          age: age || null,
          department,
          preferredDate,
          timeSlot,
          note: note.trim(),
          status,
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Update failed"); return; }
      toast.success("Appointment updated");
      onUpdated(data.item as Appt);
      setMode("view");
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  }

  async function doDelete() {
    if (!appt) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/appointments/${appt.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { toast.error(data.error ?? "Delete failed"); return; }
      toast.success("Appointment deleted");
      onDeleted(appt.id);
      setConfirmDelete(false);
      onOpenChange(false);
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
          {/* Header band */}
          <div className="bg-gradient-to-r from-[#0b6e8f] to-[#084f67] px-6 py-5 flex items-start justify-between gap-3">
            <div className="text-white">
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                Appointment
                <span className="rounded-md bg-white/15 px-2 py-0.5 text-sm font-mono">#{appt.ref}</span>
              </DialogTitle>
              <DialogDescription className="text-white/70 text-xs mt-1">
                Booked {formatCreatedAtIST(appt.createdAt)}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${meta.badge}`}>
                <span>{meta.emoji}</span> {meta.label}
              </span>
            </div>
          </div>

          <div className="p-6">
            {mode === "view" ? (
              <ViewMode appt={appt} onEdit={() => setMode("edit")} />
            ) : (
              <EditMode
                name={name} setName={setName}
                phone={phone} setPhone={setPhone}
                age={age} setAge={setAge}
                department={department} setDepartment={setDepartment}
                preferredDate={preferredDate} setPreferredDate={setPreferredDate}
                timeSlot={timeSlot} setTimeSlot={setTimeSlot}
                note={note} setNote={setNote}
                status={status} setStatus={setStatus}
                today={today}
                onCancel={() => setMode("view")}
                onSave={save}
                saving={saving}
                onDelete={() => setConfirmDelete(true)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#084f67]">Delete this appointment?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the appointment <strong>#{appt.ref}</strong> for{" "}
              <strong>{appt.name}</strong>. This action cannot be undone. Consider cancelling
              instead if you want to keep a record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={doDelete}
              disabled={saving}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Trash2 className="h-4 w-4 mr-1" />}
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

/* ---------- View Mode ---------- */
function ViewMode({ appt, onEdit }: { appt: Appt; onEdit: () => void }) {
  const st = appt.status as Status;
  return (
    <>
      <div className="grid sm:grid-cols-2 gap-4">
        <InfoBlock icon={User} label="Patient">
          <div className="font-bold text-[#084f67]">{appt.name}</div>
          <div className="text-sm text-slate-500 mt-0.5">
            {appt.age != null ? `${appt.age} years old` : "Age not specified"}
          </div>
        </InfoBlock>
        <InfoBlock icon={Phone} label="Mobile">
          <a href={`tel:${appt.phone}`} className="font-bold text-[#0b6e8f] hover:underline">
            {appt.phone}
          </a>
          <a
            href={`https://wa.me/91${appt.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-emerald-600 hover:underline inline-flex items-center gap-1 mt-0.5"
          >
            Message on WhatsApp <ExternalLink className="h-3 w-3" />
          </a>
        </InfoBlock>
        <InfoBlock icon={CalendarDays} label="Preferred Date">
          <div className="font-semibold text-slate-800">{formatDateLong(appt.preferredDate)}</div>
        </InfoBlock>
        <InfoBlock icon={Clock} label="Time Slot">
          <div className="font-semibold text-slate-800">{appt.timeSlot}</div>
        </InfoBlock>
        <InfoBlock icon={appt.department === "eye_care" ? Eye : Glasses} label="Department">
          <span className="inline-flex items-center gap-1 rounded-md bg-[#0b6e8f]/8 px-2 py-0.5 text-sm font-semibold text-[#0b6e8f]">
            {DEPT_LABEL[appt.department as Department] ?? appt.department}
          </span>
        </InfoBlock>
        <InfoBlock icon={AlertCircle} label="Current Status">
          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${STATUS_META[st].badge}`}>
            <span>{STATUS_META[st].emoji}</span> {STATUS_META[st].label}
          </span>
        </InfoBlock>
      </div>

      {appt.note ? (
        <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-4">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            <FileText className="h-3.5 w-3.5" /> Patient's Note
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">{appt.note}</p>
        </div>
      ) : (
        <div className="mt-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 p-4 text-center text-sm text-slate-400">
          No note provided by patient
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2 justify-end">
        <Button variant="outline" onClick={onEdit} className="border-slate-200 text-slate-700">
          <FileText className="h-4 w-4 mr-1.5" /> Edit / Reschedule
        </Button>
      </div>
    </>
  );
}

/* ---------- Edit Mode ---------- */
function EditMode(props: {
  name: string; setName: (v: string) => void;
  phone: string; setPhone: (v: string) => void;
  age: string; setAge: (v: string) => void;
  department: Department; setDepartment: (v: Department) => void;
  preferredDate: string; setPreferredDate: (v: string) => void;
  timeSlot: string; setTimeSlot: (v: string) => void;
  note: string; setNote: (v: string) => void;
  status: Status; setStatus: (v: Status) => void;
  today: string;
  onCancel: () => void; onSave: () => void; saving: boolean;
  onDelete: () => void;
}) {
  return (
    <>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-semibold text-slate-700">Patient Name</Label>
          <Input value={props.name} onChange={(e) => props.setName(e.target.value)} maxLength={80}
            className="mt-1.5 bg-slate-50 border-slate-200 focus-visible:border-[#0b6e8f]" />
        </div>
        <div>
          <Label className="text-sm font-semibold text-slate-700">Mobile Number</Label>
          <Input value={props.phone}
            onChange={(e) => props.setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
            inputMode="numeric" className="mt-1.5 bg-slate-50 border-slate-200 focus-visible:border-[#0b6e8f]" />
        </div>
        <div>
          <Label className="text-sm font-semibold text-slate-700">Age</Label>
          <Input value={props.age}
            onChange={(e) => props.setAge(e.target.value.replace(/\D/g, "").slice(0, 3))}
            inputMode="numeric" placeholder="Optional"
            className="mt-1.5 bg-slate-50 border-slate-200 focus-visible:border-[#0b6e8f]" />
        </div>
        <div>
          <Label className="text-sm font-semibold text-slate-700">Status</Label>
          <select value={props.status} onChange={(e) => props.setStatus(e.target.value as Status)}
            className="mt-1.5 h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b6e8f]/25 focus:border-[#0b6e8f]">
            {(["pending", "confirmed", "done", "cancelled"] as Status[]).map((s) => (
              <option key={s} value={s}>{STATUS_META[s].emoji} {STATUS_META[s].label}</option>
            ))}
          </select>
        </div>
        <div>
          <Label className="text-sm font-semibold text-slate-700">Department</Label>
          <select value={props.department} onChange={(e) => props.setDepartment(e.target.value as Department)}
            className="mt-1.5 h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b6e8f]/25 focus:border-[#0b6e8f]">
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{DEPT_LABEL[d]}</option>
            ))}
          </select>
        </div>
        <div>
          <Label className="text-sm font-semibold text-slate-700">Preferred Date</Label>
          <Input type="date" min={props.today} value={props.preferredDate}
            onChange={(e) => props.setPreferredDate(e.target.value)}
            className="mt-1.5 bg-slate-50 border-slate-200 focus-visible:border-[#0b6e8f]" />
        </div>
        <div className="sm:col-span-2">
          <Label className="text-sm font-semibold text-slate-700">Time Slot</Label>
          <select value={props.timeSlot} onChange={(e) => props.setTimeSlot(e.target.value)}
            className="mt-1.5 h-10 w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b6e8f]/25 focus:border-[#0b6e8f]">
            {TIME_SLOTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <Label className="text-sm font-semibold text-slate-700">Note</Label>
          <Textarea value={props.note} onChange={(e) => props.setNote(e.target.value)} maxLength={500}
            className="mt-1.5 bg-slate-50 border-slate-200 focus-visible:border-[#0b6e8f] min-h-[80px]" />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
        <Button variant="outline" onClick={props.onDelete}
          className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700">
          <Trash2 className="h-4 w-4 mr-1.5" /> Delete
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={props.onCancel} disabled={props.saving}
            className="border-slate-200 text-slate-700">
            <X className="h-4 w-4 mr-1.5" /> Cancel
          </Button>
          <Button onClick={props.onSave} disabled={props.saving}
            className="bg-[#0b6e8f] hover:bg-[#084f67] text-white">
            {props.saving ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Save className="h-4 w-4 mr-1.5" />}
            Save Changes
          </Button>
        </div>
      </div>
    </>
  );
}

/* ---------- Info block ---------- */
function InfoBlock({
  icon: Icon, label, children,
}: { icon: typeof User; label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3.5">
      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      {children}
    </div>
  );
}

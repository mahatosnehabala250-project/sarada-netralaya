"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Users, Search, Phone, CalendarDays, ChevronDown, ChevronUp,
  Inbox, RefreshCw, Eye,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { STATUS_META, doctorOrDeptLabel, type Status } from "@/lib/appointment-shared";
import { formatDateLong, timeAgoIST } from "@/lib/ist";
import { formatPhone, telHref } from "@/lib/utils";
import { SkeletonTable } from "@/components/admin/skeleton";
import { AppointmentDetailDialog } from "@/components/admin/appointment-dialog";

type Appt = {
  id: string; ref: string; name: string; phone: string; age: number | null;
  department: string; doctor: string | null; preferredDate: string; timeSlot: string;
  note: string | null; status: string; createdAt: string;
};

type Patient = {
  phone: string;
  name: string;
  age: number | null;
  totalVisits: number;
  lastVisit: string;
  appointments: Appt[];
};

export function PatientsPanel() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [qDebounced, setQDebounced] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [dialogAppt, setDialogAppt] = useState<Appt | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setQDebounced(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/patients?q=${encodeURIComponent(qDebounced)}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setPatients(data.patients ?? []);
      }
    } catch {} finally { setLoading(false); }
  }, [qDebounced]);

  useEffect(() => { fetchPatients(); }, [fetchPatients]);

  function toggle(phone: string) {
    setExpanded((prev) => { const next = new Set(prev); if (next.has(phone)) next.delete(phone); else next.add(phone); return next; });
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl font-bold text-[#374151]">Patients</h2>
          <p className="text-sm text-[#6b7280] mt-0.5">All unique patients grouped by phone number</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchPatients} className="border-slate-200 text-slate-600 hover:bg-slate-50">
          <RefreshCw className="h-4 w-4 mr-1.5" /> Refresh
        </Button>
      </div>

      <div className="relative max-w-md mb-4">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or phone..."
          className="h-10 pl-9 border-slate-200 focus-visible:border-[#3b82f6] focus-visible:ring-[#3b82f6]/20" />
      </div>

      {loading ? (
        <SkeletonTable rows={8} />
      ) : patients.length === 0 ? (
        <div className="rounded-xl bg-white border border-slate-200 p-10 shadow-sm">
          <div className="flex flex-col items-center justify-center text-center py-8">
            <Inbox className="h-8 w-8 text-slate-300" />
            <h3 className="mt-3 text-base font-bold text-[#374151]">No patients found</h3>
            <p className="mt-1 text-sm text-slate-500">{qDebounced ? "Try a different search term." : "Patients will appear here when bookings come in."}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {patients.map((p) => {
            const isOpen = expanded.has(p.phone);
            return (
              <div key={p.phone} className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
                <button onClick={() => toggle(p.phone)}
                  className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors text-left">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3b82f6]/10 text-[#3b82f6] text-sm font-bold">
                    {p.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[#374151]">{p.name}</div>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-500">
                      <a href={telHref(p.phone)} onClick={(e) => e.stopPropagation()} className="text-[#3b82f6] font-semibold hover:underline inline-flex items-center gap-0.5">
                        <Phone className="h-3 w-3" />{formatPhone(p.phone)}
                      </a>
                      {p.age && <span>{p.age} yrs</span>}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-[#374151] tabular-nums">{p.totalVisits}</div>
                    <div className="text-[10px] text-slate-400">visits</div>
                  </div>
                  <div className="text-right shrink-0 hidden sm:block">
                    <div className="text-xs font-medium text-slate-600">{formatDateLong(p.lastVisit)}</div>
                    <div className="text-[10px] text-slate-400">last visit</div>
                  </div>
                  {isOpen ? <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" /> : <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />}
                </button>
                {isOpen && p.appointments.length > 0 && (
                  <div className="border-t border-slate-100 bg-slate-50/50">
                    <div className="px-5 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Appointment History</div>
                    <div className="divide-y divide-slate-100">
                      {p.appointments.map((a) => {
                        const meta = STATUS_META[a.status as Status];
                        return (
                          <button key={a.id} onClick={() => { setDialogAppt(a); setDialogOpen(true); }}
                            className="w-full flex items-center gap-3 px-5 py-2.5 hover:bg-white transition-colors text-left text-xs">
                            <span className={`h-2 w-2 rounded-full shrink-0 ${meta.dot}`} />
                            <span className="font-medium text-[#374151] w-28 shrink-0">{formatDateLong(a.preferredDate)}</span>
                            <span className="text-slate-500 w-32 shrink-0 truncate">{a.timeSlot}</span>
                            <span className="text-slate-500 flex-1 truncate">{doctorOrDeptLabel(a.doctor, a.department)}</span>
                            <span className={`inline-flex items-center gap-0.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold shrink-0 ${meta.badge}`}>
                              {meta.emoji} {meta.label}
                            </span>
                            <span className="text-slate-400 shrink-0">#{a.ref}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <AppointmentDetailDialog appt={dialogAppt} open={dialogOpen} onOpenChange={setDialogOpen}
        onUpdated={(u) => { setDialogAppt(u); fetchPatients(); }}
        onDeleted={() => fetchPatients()} />
    </>
  );
}

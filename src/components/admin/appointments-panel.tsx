"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye, CalendarDays, Download, Loader2, Phone, CheckCircle2, Check, X,
  Inbox, Filter, RefreshCw, Clock, UserCircle2, UserPlus, Printer, Search,
  Eye as EyeIcon, CalendarPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/lib/toast";
import {
  STATUS_META, DOCTOR_CHOICES, doctorOrDeptLabel, type Status, type Department, type DoctorId,
} from "@/lib/appointment-shared";
import { formatDateLong, formatCreatedAtIST, timeAgoIST } from "@/lib/ist";
import { formatPhone, telHref } from "@/lib/utils";
import { AppointmentDetailDialog } from "@/components/admin/appointment-dialog";
import { CreateAppointmentDialog, type NewAppt } from "@/components/admin/create-dialog";
import { printAppointmentSlip } from "@/components/admin/print-slip";
import { SkeletonTable, SkeletonRow } from "@/components/admin/skeleton";

type Appt = {
  id: string; ref: string; name: string; phone: string; age: number | null;
  department: string; doctor: string | null; preferredDate: string; timeSlot: string;
  note: string | null; status: string; createdAt: string;
};

type Tab = "today" | "today_bookings" | "upcoming" | "past" | "all" | "range";

const TABS: { id: Tab; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "today_bookings", label: "Today's Bookings" },
  { id: "upcoming", label: "Upcoming" },
  { id: "past", label: "Past" },
  { id: "range", label: "Date Range" },
  { id: "all", label: "All" },
];

export function AppointmentsPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<Appt[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const initTab = (searchParams.get("tab") as Tab) || "today";
  const initStatus = searchParams.get("status") || "all";

  const [tab, setTab] = useState<Tab>(initTab);
  const [department, setDepartment] = useState<"all" | Department>("all");
  const [doctor, setDoctor] = useState<"all" | DoctorId>("all");
  const [status, setStatus] = useState<"all" | Status>(initStatus as "all" | Status);
  const [q, setQ] = useState("");
  const [qDebounced, setQDebounced] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);
  const [dialogAppt, setDialogAppt] = useState<Appt | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setQDebounced(q), 280);
    return () => clearTimeout(t);
  }, [q]);

  const fetchList = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const params = new URLSearchParams({ tab, department, doctor, status, q: qDebounced });
      if (tab === "range") {
        if (dateFrom) params.set("dateFrom", dateFrom);
        if (dateTo) params.set("dateTo", dateTo);
      }
      const res = await fetch(`/api/admin/appointments?${params}`, { cache: "no-store" });
      if (res.status === 401) { router.refresh(); return; }
      const data = await res.json();
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
    } catch { toast.error("Failed to load appointments"); }
    finally { setLoading(false); setRefreshing(false); }
  }, [tab, department, doctor, status, qDebounced, dateFrom, dateTo, router]);

  useEffect(() => { fetchList(); }, [fetchList]);

  useEffect(() => {
    const onFocus = () => fetchList(true);
    window.addEventListener("focus", onFocus);
    const interval = setInterval(() => fetchList(true), 60000);
    return () => { window.removeEventListener("focus", onFocus); clearInterval(interval); };
  }, [fetchList]);

  async function updateStatus(id: string, newStatus: Status) {
    setItems((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
    setBusyId(id);
    try {
      const res = await fetch("/api/admin/appointments", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Update failed"); fetchList(true); return; }
      toast.success(`Marked as ${STATUS_META[newStatus].label}`);
      fetchList(true);
    } catch { toast.error("Network error"); fetchList(true); }
    finally { setBusyId(null); }
  }

  const allSelected = items.length > 0 && items.every((a) => selected.has(a.id));
  const someSelected = selected.size > 0;

  function toggleSelect(id: string) {
    setSelected((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  }
  function toggleSelectAll() { if (allSelected) setSelected(new Set()); else setSelected(new Set(items.map((a) => a.id))); }
  function clearSelection() { setSelected(new Set()); }

  async function bulkUpdate(newStatus: Status) {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    setBulkBusy(true);
    setItems((prev) => prev.map((a) => (selected.has(a.id) ? { ...a, status: newStatus } : a)));
    try {
      await Promise.all(ids.map((id) => fetch("/api/admin/appointments", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: newStatus }) }).catch(() => null)));
      toast.success(`${ids.length} appointment${ids.length > 1 ? "s" : ""} marked as ${STATUS_META[newStatus].label}`);
      clearSelection(); fetchList(true);
    } catch { toast.error("Bulk update failed"); fetchList(true); }
    finally { setBulkBusy(false); }
  }

  function openDetail(a: Appt) { setDialogAppt(a); setDialogOpen(true); }
  function onDialogUpdated(updated: Appt) { setItems((prev) => prev.map((a) => (a.id === updated.id ? updated : a))); setDialogAppt(updated); fetchList(true); }
  function onDialogDeleted(id: string) { setItems((prev) => prev.filter((a) => a.id !== id)); setTotal((t) => Math.max(0, t - 1)); fetchList(true); }
  function onCreated(_a: NewAppt) { fetchList(true); }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl font-bold text-[#374151]">Appointments</h2>
          <p className="text-sm text-[#6b7280] mt-0.5">Manage all patient appointments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => fetchList(true)} className="border-slate-200 text-slate-600 hover:bg-slate-50">
            <RefreshCw className={`h-4 w-4 mr-1.5 ${refreshing ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button size="sm" onClick={() => setCreateOpen(true)} className="bg-[#3b82f6] hover:bg-[#2563eb] text-white">
            <UserPlus className="h-4 w-4 mr-1.5" /> New
          </Button>
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <a href={`/api/admin/appointments/export?${new URLSearchParams({ tab, department, doctor, status, q: qDebounced, ...(tab === "range" && dateFrom ? { dateFrom } : {}), ...(tab === "range" && dateTo ? { dateTo } : {}) }).toString()}`}>
                  <Button size="sm" className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">
                    <Download className="h-4 w-4 mr-1.5" /> Export
                  </Button>
                </a>
              </TooltipTrigger>
              <TooltipContent>Download as CSV</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="inline-flex rounded-lg bg-slate-100 p-1 self-start overflow-x-auto">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-3 py-1.5 text-[12px] font-semibold rounded-lg transition-all whitespace-nowrap ${tab === t.id ? "bg-white text-[#3b82f6] shadow-sm" : "text-slate-500 hover:text-[#3b82f6]"}`}>
                {t.label}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone, ref..."
              className="h-9 pl-9 border-slate-200 focus-visible:border-[#3b82f6] focus-visible:ring-[#3b82f6]/20" />
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <FilterDropdown icon={Filter} label="Department" value={department} onChange={(v) => setDepartment(v as typeof department)}
            options={[{ value: "all", label: "All Departments" }, { value: "eye_care", label: "Eye Care" }, { value: "optical", label: "Optical" }]} />
          <FilterDropdown icon={UserCircle2} label="Doctor" value={doctor} onChange={(v) => setDoctor(v as typeof doctor)}
            options={[{ value: "all", label: "All Doctors" }, ...DOCTOR_CHOICES.map((d) => ({ value: d.id, label: d.name }))]} />
          <FilterDropdown icon={CheckCircle2} label="Status" value={status} onChange={(v) => setStatus(v as typeof status)}
            options={[{ value: "all", label: "All Statuses" }, { value: "pending", label: "⏳ Pending" }, { value: "confirmed", label: "📌 Confirmed" }, { value: "done", label: "✅ Done" }, { value: "cancelled", label: "✕ Cancelled" }]} />
          {someSelected && (
            <button onClick={clearSelection} className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
              <X className="h-3 w-3" /> Clear
            </button>
          )}
          <span className="ml-auto text-xs text-slate-400">Showing <span className="font-semibold text-[#374151]">{items.length}</span> of {total}</span>
        </div>
        {tab === "range" && (
          <div className="mt-3 flex flex-wrap items-end gap-3 rounded-lg bg-slate-50 border border-slate-200 p-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">From</label>
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="h-9 w-auto bg-white border-slate-200 text-sm" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">To</label>
              <Input type="date" value={dateTo} min={dateFrom || undefined} onChange={(e) => setDateTo(e.target.value)} className="h-9 w-auto bg-white border-slate-200 text-sm" />
            </div>
          </div>
        )}
      </div>

      {/* Bulk action bar */}
      {someSelected && (
        <div className="mt-3 flex items-center gap-3 rounded-xl bg-[#3b82f6] px-4 py-2.5 shadow-md">
          <span className="text-sm font-bold text-white">{selected.size} selected</span>
          <div className="h-4 w-px bg-white/20" />
          <button onClick={() => bulkUpdate("confirmed")} disabled={bulkBusy} className="inline-flex items-center gap-1 rounded-md bg-white/15 hover:bg-white/25 px-2.5 py-1 text-xs font-semibold text-white"><Check className="h-3 w-3" /> Confirm</button>
          <button onClick={() => bulkUpdate("done")} disabled={bulkBusy} className="inline-flex items-center gap-1 rounded-md bg-white/15 hover:bg-white/25 px-2.5 py-1 text-xs font-semibold text-white"><CheckCircle2 className="h-3 w-3" /> Done</button>
          <button onClick={() => bulkUpdate("cancelled")} disabled={bulkBusy} className="inline-flex items-center gap-1 rounded-md bg-rose-500/30 hover:bg-rose-500/40 px-2.5 py-1 text-xs font-semibold text-white"><X className="h-3 w-3" /> Cancel</button>
          {bulkBusy && <Loader2 className="h-4 w-4 animate-spin text-white" />}
          <button onClick={clearSelection} className="ml-auto text-xs font-medium text-white/60 hover:text-white">Clear</button>
        </div>
      )}

      {/* List */}
      <div className="mt-4">
        {loading ? (
          <>
            <div className="hidden lg:block"><SkeletonTable rows={6} /></div>
            <div className="lg:hidden space-y-3">{[0, 1, 2, 3].map((i) => <SkeletonRow key={i} />)}</div>
          </>
        ) : items.length === 0 ? (
          <EmptyState tab={tab} hasFilters={department !== "all" || doctor !== "all" || status !== "all" || qDebounced !== ""} onClear={() => { setDepartment("all"); setDoctor("all"); setStatus("all"); setQ(""); setDateFrom(""); setDateTo(""); }} />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden lg:block rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                      <th className="px-4 py-3 w-8"><input type="checkbox" checked={allSelected} onChange={toggleSelectAll} className="h-4 w-4 rounded border-slate-300 text-[#3b82f6] focus:ring-[#3b82f6]/30 cursor-pointer" /></th>
                      <th className="px-4 py-3 font-semibold">Patient</th>
                      <th className="px-4 py-3 font-semibold">Date & Time</th>
                      <th className="px-4 py-3 font-semibold">Dept</th>
                      <th className="px-4 py-3 font-semibold">Reason</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((a) => (
                      <ApptRow key={a.id} a={a} busy={busyId === a.id} selected={selected.has(a.id)} onToggleSelect={toggleSelect} onAction={updateStatus} onView={openDetail} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Mobile cards */}
            <div className="lg:hidden space-y-3">
              {items.map((a) => (
                <ApptCard key={a.id} a={a} busy={busyId === a.id} onAction={updateStatus} onView={openDetail} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Dialogs */}
      <AppointmentDetailDialog appt={dialogAppt} open={dialogOpen} onOpenChange={setDialogOpen} onUpdated={onDialogUpdated} onDeleted={onDialogDeleted} />
      <CreateAppointmentDialog open={createOpen} onOpenChange={setCreateOpen} onCreated={onCreated} />
    </>
  );
}

/* ---------- Sub-components ---------- */

function FilterDropdown({ icon: Icon, label, value, onChange, options }: {
  icon: typeof Filter; label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
      <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)}
        className="h-9 appearance-none rounded-md border border-slate-200 bg-white pl-8 pr-8 text-xs sm:text-sm font-medium text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6]">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" viewBox="0 0 20 20" fill="none">
        <path d="M5 7l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function ApptRow({ a, busy, onAction, onView, selected, onToggleSelect }: {
  a: Appt; busy: boolean; onAction: (id: string, s: Status) => void; onView: (a: Appt) => void; selected?: boolean; onToggleSelect?: (id: string) => void;
}) {
  const st = a.status as Status;
  const meta = STATUS_META[st];
  return (
    <tr className={`hover:bg-slate-50/50 transition-colors cursor-pointer group ${selected ? "bg-[#3b82f6]/[0.03]" : ""}`} onClick={() => onView(a)}>
      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
        <input type="checkbox" checked={selected ?? false} onChange={() => onToggleSelect?.(a.id)} className="h-4 w-4 rounded border-slate-300 text-[#3b82f6] focus:ring-[#3b82f6]/30 cursor-pointer" />
      </td>
      <td className="px-4 py-3">
        <div className="font-semibold text-[#374151] group-hover:text-[#3b82f6] transition-colors">{a.name}</div>
        <a href={telHref(a.phone)} onClick={(e) => e.stopPropagation()} className="text-xs font-semibold text-[#3b82f6] hover:underline inline-flex items-center gap-1 mt-0.5">
          <Phone className="h-3 w-3" />{formatPhone(a.phone)}
        </a>
        <div className="text-[11px] text-slate-400 mt-0.5">{a.age != null && <span>{a.age} yrs · </span>}#{a.ref} · {timeAgoIST(a.createdAt)}</div>
      </td>
      <td className="px-4 py-3">
        <div className="font-medium text-[#374151] text-[13px]">{formatDateLong(a.preferredDate)}</div>
        <div className="text-xs text-slate-500 mt-0.5">{a.timeSlot}</div>
      </td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-1 rounded-md bg-[#3b82f6]/8 px-2 py-0.5 text-xs font-semibold text-[#3b82f6]">{doctorOrDeptLabel(a.doctor, a.department)}</span>
      </td>
      <td className="px-4 py-3 max-w-[220px]"><p className="text-xs text-slate-500 line-clamp-2">{a.note || "—"}</p></td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${meta.badge}`}><span>{meta.emoji}</span> {meta.label}</span>
      </td>
      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => onView(a)} title="View" className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-[#3b82f6]"><EyeIcon className="h-4 w-4" /></button>
          <a href={telHref(a.phone)} title="Call" className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-[#3b82f6] hover:bg-[#3b82f6]/5"><Phone className="h-4 w-4" /></a>
          <button onClick={() => printAppointmentSlip(a)} title="Print" className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-[#3b82f6]"><Printer className="h-4 w-4" /></button>
          {st === "pending" && <ActionBtn busy={busy} onClick={() => onAction(a.id, "confirmed")} title="Confirm" className="border-sky-200 text-sky-700 hover:bg-sky-50"><Check className="h-4 w-4" /></ActionBtn>}
          {(st === "confirmed" || st === "pending") && <ActionBtn busy={busy} onClick={() => onAction(a.id, "done")} title="Done" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"><CheckCircle2 className="h-4 w-4" /></ActionBtn>}
          {(st === "pending" || st === "confirmed") && <ActionBtn busy={busy} onClick={() => onAction(a.id, "cancelled")} title="Cancel" className="border-rose-200 text-rose-600 hover:bg-rose-50"><X className="h-4 w-4" /></ActionBtn>}
        </div>
      </td>
    </tr>
  );
}

function ApptCard({ a, busy, onAction, onView }: { a: Appt; busy: boolean; onAction: (id: string, s: Status) => void; onView: (a: Appt) => void }) {
  const st = a.status as Status;
  const meta = STATUS_META[st];
  return (
    <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <button onClick={() => onView(a)} className="min-w-0 text-left">
          <div className="font-bold text-[#374151]">{a.name}</div>
          <div className="text-xs font-semibold text-[#3b82f6] mt-0.5">{formatPhone(a.phone)} {a.age != null && <span className="text-slate-500 font-normal">· {a.age} yrs</span>}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">#{a.ref} · tap to view</div>
        </button>
        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold shrink-0 ${meta.badge}`}><span>{meta.emoji}</span> {meta.label}</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg bg-slate-50 p-2">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Date & Time</div>
          <div className="font-medium text-[#374151] mt-0.5">{formatDateLong(a.preferredDate)}</div>
          <div className="text-slate-500">{a.timeSlot}</div>
        </div>
        <div className="rounded-lg bg-slate-50 p-2">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Doctor</div>
          <div className="font-medium text-[#374151] mt-0.5">{doctorOrDeptLabel(a.doctor, a.department)}</div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <CardBtn onClick={() => onView(a)} className="border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-[#3b82f6]"><EyeIcon className="h-3.5 w-3.5" /> Details</CardBtn>
        <a href={telHref(a.phone)} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#3b82f6]/20 px-2 py-2 text-xs font-semibold text-[#3b82f6] hover:bg-[#3b82f6]/5"><Phone className="h-3.5 w-3.5" /> Call</a>
        <CardBtn onClick={() => printAppointmentSlip(a)} className="border-slate-200 text-slate-600 hover:bg-slate-50"><Printer className="h-3.5 w-3.5" /> Slip</CardBtn>
        {st === "pending" && <CardBtn busy={busy} onClick={() => onAction(a.id, "confirmed")} className="border-sky-200 text-sky-700 hover:bg-sky-50"><Check className="h-3.5 w-3.5" /> Confirm</CardBtn>}
        {(st === "confirmed" || st === "pending") && <CardBtn busy={busy} onClick={() => onAction(a.id, "done")} className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"><CheckCircle2 className="h-3.5 w-3.5" /> Done</CardBtn>}
        {(st === "pending" || st === "confirmed") && <CardBtn busy={busy} onClick={() => onAction(a.id, "cancelled")} className="border-rose-200 text-rose-600 hover:bg-rose-50"><X className="h-3.5 w-3.5" /> Cancel</CardBtn>}
      </div>
    </div>
  );
}

function CardBtn({ busy, onClick, className, children }: { busy?: boolean; onClick: () => void; className?: string; children: React.ReactNode }) {
  return (
    <button onClick={onClick} disabled={busy}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-semibold disabled:opacity-50 disabled:cursor-wait ${className ?? ""}`}>
      {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : children}
    </button>
  );
}

function ActionBtn({ busy, onClick, title, className, children }: { busy: boolean; onClick: () => void; title: string; className?: string; children: React.ReactNode }) {
  return (
    <button onClick={onClick} disabled={busy} title={title}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md border disabled:opacity-50 disabled:cursor-wait ${className ?? ""}`}>
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
    </button>
  );
}

function EmptyState({ tab, hasFilters, onClear }: { tab: Tab; hasFilters: boolean; onClear: () => void }) {
  const message = hasFilters
    ? "No appointments match your filters."
    : tab === "today" ? "No appointments scheduled for today."
    : tab === "today_bookings" ? "No bookings made today yet."
    : tab === "upcoming" ? "No upcoming appointments."
    : tab === "past" ? "No past appointments."
    : "No appointments in the system yet.";
  return (
    <div className="rounded-xl bg-white border border-slate-200 p-10 shadow-sm">
      <div className="flex flex-col items-center justify-center text-center py-8">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"><Inbox className="h-7 w-7" /></span>
        <h3 className="mt-4 text-base font-bold text-[#374151]">No appointments found</h3>
        <p className="mt-1 text-sm text-slate-500 max-w-sm">{message}</p>
        {hasFilters && <button onClick={onClear} className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#3b82f6] hover:bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white"><X className="h-4 w-4" /> Clear filters</button>}
      </div>
    </div>
  );
}

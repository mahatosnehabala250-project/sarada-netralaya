"use client";

import { useCallback, useEffect, useState } from "react";
import {
  FileText, Download, Filter, CalendarDays, UserCircle2, CheckCircle2,
  Search, Inbox, RefreshCw, Printer, TrendingUp, Users, DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  STATUS_META, DOCTOR_CHOICES, doctorOrDeptLabel, DEPT_LABEL,
  type Status, type Department, type DoctorId,
} from "@/lib/appointment-shared";
import { formatDateLong, formatCreatedAtIST, todayISTString } from "@/lib/ist";
import { formatPhone } from "@/lib/utils";
import { SkeletonTable } from "@/components/admin/skeleton";

type Appt = {
  id: string; ref: string; name: string; phone: string; age: number | null;
  department: string; doctor: string | null; preferredDate: string; timeSlot: string;
  note: string | null; status: string; createdAt: string; feeCharged: number | null;
};

type Period = "today" | "this_week" | "this_month" | "this_year" | "custom";

const PERIODS: { id: Period; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "this_week", label: "This Week" },
  { id: "this_month", label: "This Month" },
  { id: "this_year", label: "This Year" },
  { id: "custom", label: "Custom Range" },
];

function getDateRange(period: Period): { from: string; to: string } {
  const today = new Date();
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const todayStr = fmt(today);

  switch (period) {
    case "today":
      return { from: todayStr, to: todayStr };
    case "this_week": {
      const start = new Date(today);
      start.setDate(today.getDate() - today.getDay());
      return { from: fmt(start), to: todayStr };
    }
    case "this_month": {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return { from: fmt(start), to: fmt(end) };
    }
    case "this_year": {
      const start = new Date(today.getFullYear(), 0, 1);
      const end = new Date(today.getFullYear(), 11, 31);
      return { from: fmt(start), to: fmt(end) };
    }
    default:
      return { from: "", to: "" };
  }
}

const inr = (n: number) => "₹" + Number(n || 0).toLocaleString("en-IN");

export function ReportsPanel() {
  const [items, setItems] = useState<Appt[]>([]);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState<Period>("this_month");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [doctor, setDoctor] = useState<"all" | DoctorId>("all");
  const [status, setStatus] = useState<"all" | Status>("all");
  const [q, setQ] = useState("");

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const range = period === "custom" ? { from: customFrom, to: customTo } : getDateRange(period);
      if (!range.from || !range.to) { setLoading(false); return; }
      const params = new URLSearchParams({
        tab: "range", department: "all", doctor, status, q,
        dateFrom: range.from, dateTo: range.to,
      });
      const res = await fetch(`/api/admin/appointments?${params}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setItems(data.items ?? []);
      }
    } catch {} finally { setLoading(false); }
  }, [period, customFrom, customTo, doctor, status, q]);

  useEffect(() => {
    if (period !== "custom" || (customFrom && customTo)) fetchReport();
  }, [fetchReport, period, customFrom, customTo]);

  const totalAppts = items.length;
  const doneAppts = items.filter((a) => a.status === "done").length;
  const totalRevenue = items.filter((a) => a.status === "done").reduce((s, a) => s + (a.feeCharged ?? 0), 0);
  const uniquePatients = new Set(items.map((a) => a.phone)).size;

  function downloadCSV() {
    const range = period === "custom" ? { from: customFrom, to: customTo } : getDateRange(period);
    const params = new URLSearchParams({
      tab: "range", department: "all", doctor, status, q,
      dateFrom: range.from, dateTo: range.to,
    });
    window.open(`/api/admin/appointments/export?${params}`, "_blank");
  }

  function printReport() {
    const printWin = window.open("", "_blank");
    if (!printWin) return;
    const range = period === "custom" ? { from: customFrom, to: customTo } : getDateRange(period);
    const rows = items.map((a) => `
      <tr>
        <td style="padding:6px 8px;border-bottom:1px solid #e2e8f0;font-size:12px">${a.ref}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #e2e8f0;font-size:12px">${a.name}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #e2e8f0;font-size:12px">${a.phone}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #e2e8f0;font-size:12px">${formatDateLong(a.preferredDate)}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #e2e8f0;font-size:12px">${doctorOrDeptLabel(a.doctor, a.department)}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #e2e8f0;font-size:12px">${STATUS_META[a.status as Status]?.label ?? a.status}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #e2e8f0;font-size:12px;text-align:right">${a.feeCharged != null ? inr(a.feeCharged) : "—"}</td>
      </tr>`).join("");

    printWin.document.write(`<!DOCTYPE html><html><head><title>Report — Sarada Netralaya</title>
      <style>body{font-family:system-ui,sans-serif;margin:20px}table{border-collapse:collapse;width:100%}th{text-align:left;padding:8px;border-bottom:2px solid #334155;font-size:11px;text-transform:uppercase;color:#64748b}@media print{body{margin:10mm}}</style>
      </head><body>
      <h2 style="margin:0 0 4px">Sarada Netralaya — Report</h2>
      <p style="color:#64748b;font-size:13px;margin:0 0 16px">${range.from} to ${range.to} · ${totalAppts} appointments · ${doneAppts} completed · Revenue: ${inr(totalRevenue)}</p>
      <table><thead><tr><th>Ref</th><th>Name</th><th>Phone</th><th>Date</th><th>Doctor</th><th>Status</th><th style="text-align:right">Fee</th></tr></thead><tbody>${rows}</tbody></table>
      </body></html>`);
    printWin.document.close();
    printWin.print();
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl font-bold text-[#374151]">Reports</h2>
          <p className="text-sm text-[#6b7280] mt-0.5">Generate and download clinic reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={downloadCSV} className="border-slate-200 text-slate-600 hover:bg-slate-50">
            <Download className="h-4 w-4 mr-1.5" /> Excel/CSV
          </Button>
          <Button variant="outline" size="sm" onClick={printReport} className="border-slate-200 text-slate-600 hover:bg-slate-50">
            <Printer className="h-4 w-4 mr-1.5" /> Print PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-lg bg-slate-100 p-1">
            {PERIODS.map((p) => (
              <button key={p.id} onClick={() => setPeriod(p.id)}
                className={`px-3 py-1.5 text-[12px] font-semibold rounded-lg transition-all whitespace-nowrap ${period === p.id ? "bg-white text-[#3b82f6] shadow-sm" : "text-slate-500 hover:text-[#3b82f6]"}`}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {period === "custom" && (
          <div className="mt-3 flex flex-wrap items-end gap-3 rounded-lg bg-slate-50 border border-slate-200 p-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">From</label>
              <Input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className="h-9 w-auto bg-white border-slate-200 text-sm" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">To</label>
              <Input type="date" value={customTo} min={customFrom || undefined} onChange={(e) => setCustomTo(e.target.value)} className="h-9 w-auto bg-white border-slate-200 text-sm" />
            </div>
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <FilterSelect icon={UserCircle2} label="Doctor" value={doctor} onChange={(v) => setDoctor(v as typeof doctor)}
            options={[{ value: "all", label: "All Doctors" }, ...DOCTOR_CHOICES.map((d) => ({ value: d.id, label: d.name }))]} />
          <FilterSelect icon={CheckCircle2} label="Status" value={status} onChange={(v) => setStatus(v as typeof status)}
            options={[{ value: "all", label: "All Statuses" }, { value: "pending", label: "Pending" }, { value: "confirmed", label: "Confirmed" }, { value: "done", label: "Done" }, { value: "cancelled", label: "Cancelled" }]} />
          <div className="relative flex-1 max-w-[200px]">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Patient..."
              className="h-9 pl-8 text-sm border-slate-200 focus-visible:border-[#3b82f6]" />
          </div>
          <Button variant="outline" size="sm" onClick={fetchReport} className="border-slate-200 text-slate-600 hover:bg-slate-50 ml-auto">
            <RefreshCw className="h-4 w-4 mr-1.5" /> Generate
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      {!loading && items.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <SummaryCard icon={CalendarDays} label="Total Appointments" value={totalAppts} color="text-[#3b82f6]" bg="bg-[#3b82f6]/10" />
          <SummaryCard icon={CheckCircle2} label="Completed" value={doneAppts} color="text-emerald-600" bg="bg-emerald-50" />
          <SummaryCard icon={Users} label="Unique Patients" value={uniquePatients} color="text-[#8b5cf6]" bg="bg-[#8b5cf6]/10" />
          <SummaryCard icon={DollarSign} label="Revenue" value={inr(totalRevenue)} color="text-[#f59e0b]" bg="bg-[#f59e0b]/10" />
        </div>
      )}

      {/* Data table */}
      {loading ? (
        <SkeletonTable rows={8} />
      ) : items.length === 0 ? (
        <div className="rounded-xl bg-white border border-slate-200 p-10 shadow-sm">
          <div className="flex flex-col items-center justify-center text-center py-8">
            <Inbox className="h-8 w-8 text-slate-300" />
            <h3 className="mt-3 text-base font-bold text-[#374151]">No data for this period</h3>
            <p className="mt-1 text-sm text-slate-500">Adjust filters or select a different date range.</p>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden lg:block rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-4 py-3 font-semibold">Ref</th>
                    <th className="px-4 py-3 font-semibold">Patient</th>
                    <th className="px-4 py-3 font-semibold">Phone</th>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">Doctor</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-right">Fee</th>
                    <th className="px-4 py-3 font-semibold">Booked At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((a) => {
                    const meta = STATUS_META[a.status as Status];
                    return (
                      <tr key={a.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-2.5 text-xs font-mono text-slate-500">#{a.ref}</td>
                        <td className="px-4 py-2.5 font-medium text-[#374151]">{a.name}</td>
                        <td className="px-4 py-2.5 text-xs text-[#3b82f6] font-semibold">{formatPhone(a.phone)}</td>
                        <td className="px-4 py-2.5 text-xs">{formatDateLong(a.preferredDate)}</td>
                        <td className="px-4 py-2.5 text-xs">{doctorOrDeptLabel(a.doctor, a.department)}</td>
                        <td className="px-4 py-2.5">
                          <span className={`inline-flex items-center gap-0.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${meta?.badge ?? ""}`}>
                            {meta?.emoji} {meta?.label ?? a.status}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-right text-xs font-semibold tabular-nums">{a.feeCharged != null ? inr(a.feeCharged) : "—"}</td>
                        <td className="px-4 py-2.5 text-[11px] text-slate-400">{formatCreatedAtIST(a.createdAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          {/* Mobile */}
          <div className="lg:hidden space-y-2">
            {items.map((a) => {
              const meta = STATUS_META[a.status as Status];
              return (
                <div key={a.id} className="rounded-xl bg-white border border-slate-200 p-3 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-[#374151] text-sm">{a.name}</div>
                      <div className="text-xs text-[#3b82f6] font-semibold mt-0.5">{formatPhone(a.phone)}</div>
                    </div>
                    <span className={`inline-flex items-center gap-0.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold shrink-0 ${meta?.badge ?? ""}`}>
                      {meta?.emoji} {meta?.label}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
                    <span>{formatDateLong(a.preferredDate)}</span>
                    <span>{doctorOrDeptLabel(a.doctor, a.department)}</span>
                    <span className="font-semibold">{a.feeCharged != null ? inr(a.feeCharged) : "—"}</span>
                    <span>#{a.ref}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}

function FilterSelect({ icon: Icon, label, value, onChange, options }: {
  icon: typeof Filter; label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
      <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)}
        className="h-9 appearance-none rounded-md border border-slate-200 bg-white pl-8 pr-8 text-xs font-medium text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6]">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, color, bg }: {
  icon: typeof TrendingUp; label: string; value: number | string; color: string; bg: string;
}) {
  return (
    <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg} ${color}`}>
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <div className="text-[11px] text-slate-500 font-medium">{label}</div>
          <div className={`text-lg font-bold ${color} tabular-nums`}>{value}</div>
        </div>
      </div>
    </div>
  );
}

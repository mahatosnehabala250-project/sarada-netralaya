"use client";

import { useEffect, useState } from "react";
import {
  Download, FileText, Loader2, Calendar, Users, CheckCircle2,
  XCircle, Clock, TrendingUp, IndianRupee,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/lib/toast";
import { formatDateLong } from "@/lib/ist";
import { AdminShell } from "@/components/admin/layout/admin-shell";

type ReportItem = {
  ref: string; name: string; phone: string; age: number | null;
  department: string; preferredDate: string; timeSlot: string;
  note: string | null; status: string; createdAt: string;
};

export function AdminReports() {
  const [items, setItems] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [department, setDepartment] = useState("all");
  const [status, setStatus] = useState("all");
  const [monthFilter, setMonthFilter] = useState("");

  async function loadReport() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ tab: "all", q: "" });
      if (dateFrom && dateTo) { params.set("tab", "range"); params.set("dateFrom", dateFrom); params.set("dateTo", dateTo); }
      if (department !== "all") params.set("department", department);
      if (status !== "all") params.set("status", status);
      const res = await fetch(`/api/admin/appointments?${params}`, { cache: "no-store" });
      if (res.status === 401) { window.location.href = "/admin"; return; }
      const data = await res.json();
      let filtered = data.items || [];
      if (monthFilter) { filtered = filtered.filter((a: ReportItem) => a.preferredDate.startsWith(monthFilter)); }
      setItems(filtered);
    } catch { toast.error("Failed to load report"); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadReport(); }, []);

  const stats = {
    total: items.length,
    pending: items.filter(a => a.status === "pending").length,
    confirmed: items.filter(a => a.status === "confirmed").length,
    done: items.filter(a => a.status === "done").length,
    cancelled: items.filter(a => a.status === "cancelled").length,
    eyeCare: items.filter(a => a.department === "eye_care").length,
    optical: items.filter(a => a.department === "optical").length,
  };

  function exportExcel() {
    const header = "Ref,Name,Phone,Age,Department,Preferred Date,Time Slot,Status,Note,Created At\n";
    const rows = items.map(a => {
      const note = (a.note || "").replace(/"/g, '""');
      const escaped = [a.ref, a.name, a.phone, a.age ?? "", a.department === "eye_care" ? "Eye Care" : "Optical", a.preferredDate, a.timeSlot, a.status, note, a.createdAt].map(v => `"${v}"`).join(",");
      return escaped;
    }).join("\n");
    const csv = header + rows;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `report-${dateFrom || "all"}-${dateTo || "all"}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success("Excel report downloaded");
  }

  function exportPDF() {
    const win = window.open("", "_blank");
    if (!win) { toast.error("Popup blocked. Allow popups to download PDF."); return; }
    const html = `
      <html><head><title>Sarada Netralaya — Report</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
        h1 { color: #3b82f6; margin-bottom: 5px; }
        .meta { color: #888; font-size: 12px; margin-bottom: 20px; }
        .stats { display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap; }
        .stat { background: #f8f9fa; padding: 10px 15px; border-radius: 8px; border: 1px solid #e5e7eb; }
        .stat .v { font-size: 20px; font-weight: bold; color: #3b82f6; }
        .stat .l { font-size: 10px; color: #888; text-transform: uppercase; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th { background: #3b82f6; color: white; padding: 8px; text-align: left; }
        td { padding: 6px 8px; border-bottom: 1px solid #e5e7eb; }
        tr:nth-child(even) { background: #f8f9fa; }
        .footer { margin-top: 30px; font-size: 10px; color: #aaa; text-align: center; }
      </style></head><body>
      <h1>Sarada Netralaya — Appointment Report</h1>
      <div class="meta">Generated: ${new Date().toLocaleString("en-IN")} | Period: ${dateFrom || "All"} to ${dateTo || "All"} | Department: ${department === "all" ? "All" : department} | Status: ${status === "all" ? "All" : status}</div>
      <div class="stats">
        <div class="stat"><div class="v">${stats.total}</div><div class="l">Total</div></div>
        <div class="stat"><div class="v">${stats.pending}</div><div class="l">Pending</div></div>
        <div class="stat"><div class="v">${stats.confirmed}</div><div class="l">Confirmed</div></div>
        <div class="stat"><div class="v">${stats.done}</div><div class="l">Done</div></div>
        <div class="stat"><div class="v">${stats.cancelled}</div><div class="l">Cancelled</div></div>
      </div>
      <table><thead><tr><th>Ref</th><th>Name</th><th>Phone</th><th>Date</th><th>Time</th><th>Dept</th><th>Status</th></tr></thead><tbody>
      ${items.map(a => `<tr><td>#${a.ref}</td><td>${a.name}</td><td>${a.phone}</td><td>${a.preferredDate}</td><td>${a.timeSlot}</td><td>${a.department === "eye_care" ? "Eye Care" : "Optical"}</td><td>${a.status}</td></tr>`).join("")}
      </tbody></table>
      <div class="footer">© 2026 Sarada Netralaya. Generated by Admin Dashboard.</div>
      </body></html>`;
    win.document.write(html);
    win.document.close();
    setTimeout(() => { win.print(); }, 500);
    toast.success("PDF report opening...");
  }

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#374151]">Reports</h1>
        <p className="text-sm text-slate-500 mt-0.5">Filter and download appointment reports</p>
      </div>

      {/* Filters */}
      <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm mb-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label className="text-xs font-semibold text-slate-600">From Date</Label>
            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="h-10 mt-1 border-slate-200" />
          </div>
          <div>
            <Label className="text-xs font-semibold text-slate-600">To Date</Label>
            <Input type="date" value={dateTo} min={dateFrom || undefined} onChange={(e) => setDateTo(e.target.value)} className="h-10 mt-1 border-slate-200" />
          </div>
          <div>
            <Label className="text-xs font-semibold text-slate-600">Month</Label>
            <Input type="month" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className="h-10 mt-1 border-slate-200" />
          </div>
          <div>
            <Label className="text-xs font-semibold text-slate-600">Department</Label>
            <select value={department} onChange={(e) => setDepartment(e.target.value)} className="h-10 mt-1 w-full appearance-none rounded-md border border-slate-200 bg-white px-3 text-sm">
              <option value="all">All Departments</option>
              <option value="eye_care">Eye Care</option>
              <option value="optical">Optical</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="flex-1">
            <Label className="text-xs font-semibold text-slate-600">Status</Label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 mt-1 w-full max-w-xs appearance-none rounded-md border border-slate-200 bg-white px-3 text-sm">
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="done">Done</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <Button onClick={loadReport} disabled={loading} className="bg-[#3b82f6] hover:bg-[#2563eb] text-white mt-5">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate Report"}
          </Button>
        </div>
      </div>

      {/* Export buttons */}
      <div className="flex gap-3 mb-4">
        <Button onClick={exportExcel} disabled={!items.length} className="bg-emerald-500 hover:bg-emerald-600 text-white">
          <Download className="h-4 w-4 mr-1.5" /> Export Excel (CSV)
        </Button>
        <Button onClick={exportPDF} disabled={!items.length} className="bg-rose-500 hover:bg-rose-600 text-white">
          <FileText className="h-4 w-4 mr-1.5" /> Export PDF
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
        <StatCard icon={Users} label="Total" value={stats.total} color="text-[#3b82f6]" bg="bg-[#3b82f6]/10" />
        <StatCard icon={Clock} label="Pending" value={stats.pending} color="text-amber-600" bg="bg-amber-50" />
        <StatCard icon={CheckCircle2} label="Confirmed" value={stats.confirmed} color="text-sky-600" bg="bg-sky-50" />
        <StatCard icon={TrendingUp} label="Done" value={stats.done} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard icon={XCircle} label="Cancelled" value={stats.cancelled} color="text-rose-600" bg="bg-rose-50" />
      </div>

      {/* Table */}
      {loading ? (
        <div className="rounded-xl bg-white border border-slate-200 p-10 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#3b82f6] mx-auto" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl bg-white border border-slate-200 p-10 text-center">
          <p className="text-sm text-slate-500">No data for selected filters</p>
        </div>
      ) : (
        <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead><tr className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3 font-semibold">Ref</th><th className="px-4 py-3 font-semibold">Patient</th>
              <th className="px-4 py-3 font-semibold">Date</th><th className="px-4 py-3 font-semibold">Time</th>
              <th className="px-4 py-3 font-semibold">Dept</th><th className="px-4 py-3 font-semibold">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((a, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-mono text-xs">#{a.ref}</td>
                  <td className="px-4 py-3"><div className="font-semibold text-[#374151]">{a.name}</div><div className="text-xs text-slate-400">{a.phone}</div></td>
                  <td className="px-4 py-3 text-[#374151]">{a.preferredDate}</td>
                  <td className="px-4 py-3 text-slate-600">{a.timeSlot}</td>
                  <td className="px-4 py-3"><span className="text-xs font-semibold text-[#3b82f6]">{a.department === "eye_care" ? "Eye Care" : "Optical"}</span></td>
                  <td className="px-4 py-3"><span className={`text-xs font-semibold capitalize ${a.status === "done" ? "text-emerald-600" : a.status === "cancelled" ? "text-rose-600" : a.status === "confirmed" ? "text-sky-600" : "text-amber-600"}`}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      )}
    </AdminShell>
  );
}

function StatCard({ icon: Icon, label, value, color, bg }: { icon: typeof Users; label: string; value: number; color: string; bg: string }) {
  return (
    <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
      <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${bg} ${color}`}><Icon className="h-5 w-5" /></span>
      <div className="mt-2 text-2xl font-bold text-[#374151]">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

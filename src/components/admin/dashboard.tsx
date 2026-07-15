"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Eye, CalendarDays, LogOut, ExternalLink, Search, Download, Loader2,
  Phone, CheckCircle2, Check, X, Inbox, Filter, RefreshCw, Clock,
  TrendingUp, Hourglass, CalendarCheck, UserCircle2, Menu, X as CloseIcon,
  Eye as EyeIcon, ChevronRight, UserPlus, AlertCircle, Printer, Star,
  Users, DollarSign, BarChart3, Bell, ChevronDown, Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/lib/toast";
import {
  DEPT_LABEL, STATUS_META, type Status, type Department,
} from "@/lib/appointments";
import { greetingIST, fullTodayIST, formatDateLong, formatCreatedAtIST, timeAgoIST } from "@/lib/ist";
import { PHONES } from "@/lib/site-info";
import { formatPhone, telHref } from "@/lib/utils";
import { AppointmentDetailDialog } from "@/components/admin/appointment-dialog";
import { CreateAppointmentDialog, type NewAppt } from "@/components/admin/create-dialog";
import { AnalyticsPanel } from "@/components/admin/analytics";
import { ActivityFeed } from "@/components/admin/activity-feed";
import { printAppointmentSlip } from "@/components/admin/print-slip";

type Appt = {
  id: string; ref: string; name: string; phone: string; age: number | null;
  department: string; preferredDate: string; timeSlot: string;
  note: string | null; status: string; createdAt: string;
};

type Kpis = {
  today: number; pending: number; upcoming: number;
  done: number; cancelled: number; total: number;
  patients?: number; doneThisMonth?: number; revenueThisMonth?: number; fee?: number;
};

const inr = (n: number) => "₹" + Number(n || 0).toLocaleString("en-IN");

type Tab = "today" | "upcoming" | "past" | "all" | "range";

const TABS: { id: Tab; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "upcoming", label: "Upcoming" },
  { id: "past", label: "Past" },
  { id: "range", label: "Date Range" },
  { id: "all", label: "All" },
];

export function AdminDashboard() {
  const router = useRouter();
  const [items, setItems] = useState<Appt[]>([]);
  const [kpis, setKpis] = useState<Kpis>({ today: 0, pending: 0, upcoming: 0, done: 0, cancelled: 0, total: 0 });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [tab, setTab] = useState<Tab>("today");
  const [department, setDepartment] = useState<"all" | Department>("all");
  const [status, setStatus] = useState<"all" | Status>("all");
  const [q, setQ] = useState("");
  const [qDebounced, setQDebounced] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [greeting, setGreeting] = useState("Good Morning");
  const [todayStr, setTodayStr] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);
  const [dialogAppt, setDialogAppt] = useState<Appt | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    setGreeting(greetingIST());
    setTodayStr(fullTodayIST());
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setQDebounced(q), 280);
    return () => clearTimeout(t);
  }, [q]);

  const fetchList = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const params = new URLSearchParams({ tab, department, status, q: qDebounced });
      if (tab === "range") {
        if (dateFrom) params.set("dateFrom", dateFrom);
        if (dateTo) params.set("dateTo", dateTo);
      }
      const res = await fetch(`/api/admin/appointments?${params}`, { cache: "no-store" });
      if (res.status === 401) { router.refresh(); return; }
      const data = await res.json();
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
      setKpis(data.kpis ?? kpis);
    } catch { toast.error("Failed to load appointments"); }
    finally { setLoading(false); setRefreshing(false); }
  }, [tab, department, status, qDebounced, dateFrom, dateTo]);

  useEffect(() => { fetchList(); }, [fetchList]);

  useEffect(() => {
    const onFocus = () => fetchList(true);
    window.addEventListener("focus", onFocus);
    const interval = setInterval(() => fetchList(true), 60000);
    return () => { window.removeEventListener("focus", onFocus); clearInterval(interval); };
  }, [fetchList]);

  async function logout() {
    try { await fetch("/api/admin/logout", { method: "POST" }); } catch {}
    router.refresh();
  }

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

  const visibleItems = items;
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
  function onCreated(a: NewAppt) { setItems((prev) => [a as Appt, ...prev]); setTotal((t) => t + 1); fetchList(true); }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-white border-r border-slate-200">
        <SidebarContent onLogout={logout} />
      </aside>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-60 max-w-[80vw] flex flex-col bg-white border-r border-slate-200">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-3 right-3 text-slate-400 hover:text-slate-700">
              <CloseIcon className="h-5 w-5" />
            </button>
            <SidebarContent onLogout={logout} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between bg-white border-b border-slate-200 px-4 h-14">
          <button onClick={() => setSidebarOpen(true)} aria-label="Open menu"><Menu className="h-5 w-5 text-[#374151]" /></button>
          <div className="flex items-center gap-2"><Image src="/images/logo.png" alt="Logo" width={28} height={19} /><span className="font-bold text-sm text-[#374151]">Sarada Netralaya</span></div>
          <button onClick={() => fetchList(true)} aria-label="Refresh"><RefreshCw className={`h-5 w-5 text-slate-500 ${refreshing ? "animate-spin" : ""}`} /></button>
        </header>

        {/* Desktop top bar */}
        <header className="hidden lg:flex sticky top-0 z-30 items-center gap-4 bg-white border-b border-slate-200 px-6 h-16">
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-[#374151] leading-tight">Dashboard</h1>
            <p className="text-xs text-[#6b7280]">Welcome back, Admin! Here&apos;s what&apos;s happening today.</p>
          </div>
          <div className="ml-auto relative w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search patients, appointments…" className="h-10 pl-9 rounded-full bg-slate-50 border-slate-200 focus-visible:border-[#3b82f6] focus-visible:ring-[#3b82f6]/20" />
          </div>
          <button onClick={() => { setStatus("pending"); setTab("all"); }} title="Pending appointments" className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:text-[#3b82f6] hover:border-[#3b82f6] transition-colors">
            <Bell className="h-5 w-5" />
            {kpis.pending > 0 && <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white border-2 border-white">{kpis.pending}</span>}
          </button>
          <div className="flex items-center gap-2 pl-1">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white text-xs font-bold">AU</span>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-[#374151]">Admin User</div>
              <div className="text-[11px] text-slate-400">Super Admin</div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 max-w-[1400px] w-full mx-auto">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#374151]">Today&apos;s Overview</h2>
              <p className="text-sm text-[#6b7280] mt-0.5">{greeting}! · {todayStr}</p>
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
                    <a href={`/api/admin/appointments/export?${new URLSearchParams({ tab, department, status, q: qDebounced, ...(tab === "range" && dateFrom ? { dateFrom } : {}), ...(tab === "range" && dateTo ? { dateTo } : {}) }).toString()}`}>
                      <Button size="sm" className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">
                        <Download className="h-4 w-4 mr-1.5" /> Export
                      </Button>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>Download the current filtered view as CSV</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* KPI tiles — 4 cards matching mockup */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard icon={CalendarCheck} label="Today's Appointments" value={kpis.today} sub={kpis.pending ? `${kpis.pending} pending review` : "All reviewed"} iconColor="text-[#3b82f6]" iconBg="bg-[#3b82f6]/10" valueColor="text-[#3b82f6]" />
            <KpiCard icon={Users} label="Total Patients" value={kpis.patients ?? 0} sub="Unique patient records" iconColor="text-[#10b981]" iconBg="bg-[#10b981]/10" valueColor="text-[#374151]" />
            <KpiCard icon={CheckCircle2} label="Completed This Month" value={kpis.doneThisMonth ?? 0} sub={`${kpis.done} completed all-time`} iconColor="text-[#8b5cf6]" iconBg="bg-[#8b5cf6]/10" valueColor="text-[#374151]" />
            <KpiCard icon={DollarSign} label="Est. Revenue (Month)" value={inr(kpis.revenueThisMonth ?? 0)} sub={`≈ ${inr(kpis.fee ?? 0)}/visit · consultation`} iconColor="text-[#f59e0b]" iconBg="bg-[#f59e0b]/10" valueColor="text-[#374151]" />
          </div>

          {/* Analytics charts */}
          <div className="mt-5">
            <AnalyticsPanel />
          </div>

          {/* Filters */}
          <div id="appointments" className="mt-6 rounded-xl bg-white border border-slate-200 p-4 shadow-sm scroll-mt-20">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="inline-flex rounded-lg bg-slate-100 p-1 self-start">
                {TABS.map((t) => (
                  <button key={t.id} onClick={() => setTab(t.id)}
                    className={`px-3.5 py-1.5 text-[13px] font-semibold rounded-lg transition-all ${tab === t.id ? "bg-white text-[#3b82f6] shadow-sm" : "text-slate-500 hover:text-[#3b82f6]"}`}>
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
              <FilterDropdown icon={CheckCircle2} label="Status" value={status} onChange={(v) => setStatus(v as typeof status)}
                options={[{ value: "all", label: "All Statuses" }, { value: "pending", label: "⏳ Pending" }, { value: "confirmed", label: "📌 Confirmed" }, { value: "done", label: "✅ Done" }, { value: "cancelled", label: "✕ Cancelled" }]} />
              {someSelected && (
                <button onClick={clearSelection} className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#3b82f6]">
                  <X className="h-3 w-3" /> Clear
                </button>
              )}
              <span className="ml-auto text-xs text-slate-400">Showing <span className="font-semibold text-[#374151]">{visibleItems.length}</span> of {total}</span>
            </div>
            {tab === "range" && (
              <div className="mt-3 flex flex-wrap items-end gap-3 rounded-lg bg-slate-50 border border-slate-200 p-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">From Date</label>
                  <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="h-9 w-auto bg-white border-slate-200 text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">To Date</label>
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
              <button onClick={() => bulkUpdate("confirmed")} disabled={bulkBusy} className="inline-flex items-center gap-1 rounded-md bg-white/15 hover:bg-white/25 px-2.5 py-1 text-xs font-semibold text-white"><Check className="h-3 w-3" /> Confirm all</button>
              <button onClick={() => bulkUpdate("done")} disabled={bulkBusy} className="inline-flex items-center gap-1 rounded-md bg-white/15 hover:bg-white/25 px-2.5 py-1 text-xs font-semibold text-white"><CheckCircle2 className="h-3 w-3" /> Mark all done</button>
              <button onClick={() => bulkUpdate("cancelled")} disabled={bulkBusy} className="inline-flex items-center gap-1 rounded-md bg-rose-500/30 hover:bg-rose-500/40 px-2.5 py-1 text-xs font-semibold text-white"><X className="h-3 w-3" /> Cancel all</button>
              {bulkBusy && <Loader2 className="h-4 w-4 animate-spin text-white" />}
              <button onClick={clearSelection} className="ml-auto text-xs font-medium text-white/60 hover:text-white">Clear</button>
            </div>
          )}

          {/* List */}
          <div id="patients" className="mt-5 scroll-mt-20">
            {loading ? (
              <LoadingState />
            ) : visibleItems.length === 0 ? (
              <EmptyState tab={tab} hasFilters={department !== "all" || status !== "all" || qDebounced !== "" || (tab === "range" && (dateFrom !== "" || dateTo !== ""))} onClear={() => { setDepartment("all"); setStatus("all"); setQ(""); setDateFrom(""); setDateTo(""); }} />
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden lg:block rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                          <th className="px-4 py-3 w-8"><input type="checkbox" checked={allSelected} onChange={toggleSelectAll} className="h-4 w-4 rounded border-slate-300 text-[#3b82f6] focus:ring-[#3b82f6]/30 cursor-pointer" aria-label="Select all" /></th>
                          <th className="px-4 py-3 font-semibold">Patient</th>
                          <th className="px-4 py-3 font-semibold">Date & Time</th>
                          <th className="px-4 py-3 font-semibold">Dept</th>
                          <th className="px-4 py-3 font-semibold">Reason</th>
                          <th className="px-4 py-3 font-semibold">Status</th>
                          <th className="px-4 py-3 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {visibleItems.map((a) => (
                          <ApptRow key={a.id} a={a} busy={busyId === a.id} selected={selected.has(a.id)} onToggleSelect={toggleSelect} onAction={updateStatus} onView={openDetail} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* Mobile cards */}
                <div className="lg:hidden space-y-3">
                  {visibleItems.map((a) => (
                    <ApptCard key={a.id} a={a} busy={busyId === a.id} onAction={updateStatus} onView={openDetail} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Activity feed */}
          <div className="mt-6">
            <ActivityFeed onView={(id) => { const appt = items.find((a) => a.id === id); if (appt) openDetail(appt); }} />
          </div>

          {/* Quick Actions */}
          <div className="mt-6">
            <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm">
              <h3 className="text-base font-bold text-[#374151] mb-4">Quick Actions</h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {[
                  { icon: CalendarCheck, label: "Add Appointment", onClick: () => setCreateOpen(true) },
                  { icon: Users, label: "Add Patient", href: "/book" },
                  { icon: UserCircle2, label: "Add Doctor", href: "/admin/settings" },
                  { icon: Download, label: "Export CSV", href: "/api/admin/appointments/export" },
                  { icon: Eye, label: "View Gallery", href: "/gallery" },
                  { icon: Star, label: "View Reviews", href: "/reviews" },
                ].map((action) => (
                  <button key={action.label} onClick={() => action.onClick ? action.onClick() : window.open(action.href, "_self")}
                    className="group flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-[#3b82f6]/5 transition-colors">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#3b82f6] group-hover:bg-[#3b82f6] group-hover:text-white transition-colors shadow-sm">
                      <action.icon className="h-5 w-5" />
                    </span>
                    <span className="text-[10px] sm:text-xs font-semibold text-[#374151] text-center leading-tight">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-[#6b7280]">© 2026 Sarada Netralaya. All Rights Reserved.</p>
            <p className="text-xs text-[#6b7280]">Version 1.0.0</p>
          </footer>
        </main>
      </div>

      {/* Dialogs */}
      <AppointmentDetailDialog appt={dialogAppt} open={dialogOpen} onOpenChange={setDialogOpen} onUpdated={onDialogUpdated} onDeleted={onDialogDeleted} />
      <CreateAppointmentDialog open={createOpen} onOpenChange={setCreateOpen} onCreated={onCreated} />
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}

/* ---------- Sidebar ---------- */
function SidebarContent({ onLogout }: { onLogout: () => void }) {
  const soon = (name: string) => toast(`${name} module is coming soon`);
  const linkCls = "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#3b82f6] transition-colors";
  const iconCls = "h-[18px] w-[18px] text-slate-400 group-hover:text-[#3b82f6]";
  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <Image src="/images/logo.png" alt="Sarada Netralaya" width={38} height={26} className="shrink-0" />
          <div className="leading-none">
            <div className="text-sm font-bold text-[#374151]">Sarada Netralaya</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Clear Vision, Better Life</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <a href="/admin" className="flex items-center gap-3 rounded-lg bg-[#3b82f6] px-3 py-2.5 text-sm font-bold text-white shadow-sm">
          <BarChart3 className="h-[18px] w-[18px]" /> Dashboard
        </a>
        <a href="#appointments" className={linkCls}><CalendarDays className={iconCls} /> Appointments</a>
        <a href="#patients" className={linkCls}><Users className={iconCls} /> Patients</a>
        <a href="/admin/settings" className={linkCls}><UserCircle2 className={iconCls} /> Doctors</a>
        <a href="/reviews" className={linkCls}><Star className={iconCls} /> Reviews</a>
        <a href="/api/admin/appointments/export" className={linkCls}><Download className={iconCls} /> Reports</a>
        <a href="/admin/settings" className={linkCls}><UserCircle2 className={iconCls} /> Settings</a>

        <div className="px-3 pt-4 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">More Modules</div>
        {[
          { label: "Billing", icon: DollarSign },
          { label: "Payments", icon: DollarSign },
          { label: "Inventory", icon: Inbox },
          { label: "Users & Roles", icon: Users },
          { label: "System Logs", icon: Filter },
        ].map((m) => (
          <button key={m.label} onClick={() => soon(m.label)} className={`${linkCls} w-full text-left`}>
            <m.icon className={iconCls} />
            <span className="flex-1">{m.label}</span>
            <span className="text-[9px] font-bold uppercase tracking-wide text-slate-400 bg-slate-100 rounded px-1.5 py-0.5">Soon</span>
          </button>
        ))}

        <div className="px-3 pt-4 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Site</div>
        <a href="/" className={linkCls}><ExternalLink className={iconCls} /> View Website</a>
        <a href="/gallery" className={linkCls}><Eye className={iconCls} /> Gallery</a>
      </nav>

      {/* Help + User */}
      <div className="p-3 border-t border-slate-100 space-y-2">
        <a href={`https://wa.me/${PHONES.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 rounded-xl bg-[#3b82f6]/5 border border-[#3b82f6]/10 px-3 py-2.5 hover:bg-[#3b82f6]/10 transition-colors">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#3b82f6] text-white"><Headphones className="h-4 w-4" /></span>
          <div className="leading-tight min-w-0">
            <div className="text-[13px] font-bold text-[#374151]">Need Help?</div>
            <div className="text-[11px] text-slate-400">Get quick support</div>
          </div>
        </a>
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white text-xs font-bold">AU</span>
          <div className="leading-tight min-w-0 flex-1">
            <div className="text-sm font-semibold text-[#374151] truncate">Admin User</div>
            <div className="text-[11px] text-slate-400 truncate">Super Admin</div>
          </div>
          <button onClick={onLogout} title="Logout" className="text-slate-400 hover:text-rose-500 transition-colors p-1.5">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- KPI Card (mockup style: label top, big value, icon top-right, subtext) ---------- */
function KpiCard({
  icon: Icon, label, value, sub, iconColor, iconBg, valueColor,
}: { icon: typeof Eye; label: string; value: number | string; sub?: string; iconColor: string; iconBg: string; valueColor: string }) {
  return (
    <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-[#6b7280] font-medium leading-tight">{label}</p>
          <div className={`mt-2 text-2xl sm:text-[1.75rem] font-bold ${valueColor} tabular-nums leading-none`}>{value}</div>
        </div>
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}>
          <Icon className="h-5 w-5" strokeWidth={2} />
        </span>
      </div>
      {sub && <p className="mt-3 text-xs text-slate-400 truncate">{sub}</p>}
    </div>
  );
}

/* ---------- Filter Dropdown ---------- */
function FilterDropdown({
  icon: Icon, label, value, onChange, options,
}: { icon: typeof Filter; label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
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

/* ---------- Table Row ---------- */
function ApptRow({ a, busy, onAction, onView, selected, onToggleSelect }: { a: Appt; busy: boolean; onAction: (id: string, s: Status) => void; onView: (a: Appt) => void; selected?: boolean; onToggleSelect?: (id: string) => void }) {
  const st = a.status as Status;
  const meta = STATUS_META[st];
  return (
    <tr className={`hover:bg-slate-50/50 transition-colors cursor-pointer group ${selected ? "bg-[#3b82f6]/[0.03]" : ""}`} onClick={() => onView(a)}>
      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
        <input type="checkbox" checked={selected ?? false} onChange={() => onToggleSelect?.(a.id)} className="h-4 w-4 rounded border-slate-300 text-[#3b82f6] focus:ring-[#3b82f6]/30 cursor-pointer" aria-label={`Select ${a.name}`} />
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
        <span className="inline-flex items-center gap-1 rounded-md bg-[#3b82f6]/8 px-2 py-0.5 text-xs font-semibold text-[#3b82f6]">{DEPT_LABEL[a.department as Department] ?? a.department}</span>
      </td>
      <td className="px-4 py-3 max-w-[220px]"><p className="text-xs text-slate-500 line-clamp-2">{a.note || "—"}</p></td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${meta.badge}`}><span>{meta.emoji}</span> {meta.label}</span>
      </td>
      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => onView(a)} title="View / Edit" className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-[#3b82f6]"><EyeIcon className="h-4 w-4" /></button>
          <a href={telHref(a.phone)} title={`Call ${formatPhone(a.phone)}`} className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-[#3b82f6] hover:bg-[#3b82f6]/5"><Phone className="h-4 w-4" /></a>
          <button onClick={() => printAppointmentSlip(a)} title="Print slip" className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-[#3b82f6]"><Printer className="h-4 w-4" /></button>
          {st === "pending" && <ActionBtn busy={busy} onClick={() => onAction(a.id, "confirmed")} title="Confirm" className="border-sky-200 text-sky-700 hover:bg-sky-50"><Check className="h-4 w-4" /></ActionBtn>}
          {(st === "confirmed" || st === "pending") && <ActionBtn busy={busy} onClick={() => onAction(a.id, "done")} title="Mark Done" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"><CheckCircle2 className="h-4 w-4" /></ActionBtn>}
          {(st === "pending" || st === "confirmed") && <ActionBtn busy={busy} onClick={() => onAction(a.id, "cancelled")} title="Cancel" className="border-rose-200 text-rose-600 hover:bg-rose-50"><X className="h-4 w-4" /></ActionBtn>}
          {st === "done" && <span className="text-[10px] text-emerald-600/70 px-1">Completed</span>}
          {st === "cancelled" && <span className="text-[10px] text-rose-500/70 px-1">Cancelled</span>}
        </div>
      </td>
    </tr>
  );
}

/* ---------- Mobile Card ---------- */
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
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Department</div>
          <div className="font-medium text-[#374151] mt-0.5">{DEPT_LABEL[a.department as Department] ?? a.department}</div>
        </div>
      </div>
      {a.note && <div className="mt-2 text-xs text-slate-500 bg-slate-50 rounded-lg p-2 border border-slate-100"><span className="font-semibold text-[#3b82f6]">Note: </span>{a.note}</div>}
      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={() => onView(a)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#3b82f6]"><EyeIcon className="h-3.5 w-3.5" /> Details</button>
        <a href={telHref(a.phone)} className="inline-flex items-center gap-1.5 rounded-lg border border-[#3b82f6]/20 px-3 py-1.5 text-xs font-semibold text-[#3b82f6] hover:bg-[#3b82f6]/5"><Phone className="h-3.5 w-3.5" /> Call</a>
        <button onClick={() => printAppointmentSlip(a)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#3b82f6]"><Printer className="h-3.5 w-3.5" /> Slip</button>
        {st === "pending" && <ActionBtn busy={busy} onClick={() => onAction(a.id, "confirmed")} title="Confirm" className="border-sky-200 text-sky-700 hover:bg-sky-50 !px-3 !h-8 text-xs"><Check className="h-3.5 w-3.5" /> Confirm</ActionBtn>}
        {(st === "confirmed" || st === "pending") && <ActionBtn busy={busy} onClick={() => onAction(a.id, "done")} title="Mark Done" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 !px-3 !h-8 text-xs"><CheckCircle2 className="h-3.5 w-3.5" /> Done</ActionBtn>}
        {(st === "pending" || st === "confirmed") && <ActionBtn busy={busy} onClick={() => onAction(a.id, "cancelled")} title="Cancel" className="border-rose-200 text-rose-600 hover:bg-rose-50 !px-3 !h-8 text-xs ml-auto"><X className="h-3.5 w-3.5" /> Cancel</ActionBtn>}
      </div>
    </div>
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

/* ---------- States ---------- */
function LoadingState() {
  return (
    <div className="rounded-xl bg-white border border-slate-200 p-10 shadow-sm">
      <div className="flex flex-col items-center justify-center text-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-[#3b82f6]" />
        <p className="mt-3 text-sm text-slate-500">Loading appointments...</p>
      </div>
      <div className="mt-4 space-y-2">{[0, 1, 2].map((i) => <div key={i} className="h-14 rounded-lg bg-slate-50 animate-pulse" />)}</div>
    </div>
  );
}

function EmptyState({ tab, hasFilters, onClear }: { tab: Tab; hasFilters: boolean; onClear: () => void }) {
  const message = hasFilters
    ? "No appointments match your current filters. Try clearing them or switching tabs."
    : tab === "today" ? "No appointments scheduled for today. Switch to 'Upcoming' to view future bookings."
    : tab === "upcoming" ? "No upcoming appointments. New bookings from the website will appear here automatically."
    : tab === "past" ? "No past appointments yet. Completed and past-date appointments will show up here."
    : "There are no appointments in the system yet. Bookings made from the website will appear here.";
  return (
    <div className="rounded-xl bg-white border border-slate-200 p-10 shadow-sm">
      <div className="flex flex-col items-center justify-center text-center py-12">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"><Inbox className="h-8 w-8" /></span>
        <h3 className="mt-4 text-lg font-bold text-[#374151]">No appointments found</h3>
        <p className="mt-1 text-sm text-slate-500 max-w-sm">{message}</p>
        {hasFilters && <button onClick={onClear} className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#3b82f6] hover:bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white"><X className="h-4 w-4" /> Clear all filters</button>}
      </div>
    </div>
  );
}

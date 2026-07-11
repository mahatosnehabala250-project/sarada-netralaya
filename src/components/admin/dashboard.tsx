"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye, CalendarDays, LogOut, ExternalLink, Search, Download, Loader2,
  Phone, CheckCircle2, Check, X, Inbox, Filter, RefreshCw, Clock,
  TrendingUp, Hourglass, CalendarCheck, UserCircle2, Menu, X as CloseIcon,
  Eye as EyeIcon, ChevronRight, UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import {
  DEPT_LABEL, STATUS_META, type Status, type Department,
} from "@/lib/appointments";
import { greetingIST, fullTodayIST, formatDateLong, formatCreatedAtIST, timeAgoIST } from "@/lib/ist";
import { PHONES, SITE } from "@/lib/site-info";
import { AppointmentDetailDialog } from "@/components/admin/appointment-dialog";
import { CreateAppointmentDialog, type NewAppt } from "@/components/admin/create-dialog";
import { AnalyticsPanel } from "@/components/admin/analytics";

type Appt = {
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

type Kpis = {
  today: number; pending: number; upcoming: number;
  done: number; cancelled: number; total: number;
};

type Tab = "today" | "upcoming" | "past" | "all";

const TABS: { id: Tab; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "upcoming", label: "Upcoming" },
  { id: "past", label: "Past" },
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

  // Greeting computed after mount (avoid hydration mismatch)
  const [greeting, setGreeting] = useState("Good Morning");
  const [todayStr, setTodayStr] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [dialogAppt, setDialogAppt] = useState<Appt | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    setGreeting(greetingIST());
    setTodayStr(fullTodayIST());
  }, []);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setQDebounced(q), 280);
    return () => clearTimeout(t);
  }, [q]);

  const fetchList = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const params = new URLSearchParams({
        tab, department, status, q: qDebounced,
      });
      const res = await fetch(`/api/admin/appointments?${params}`, { cache: "no-store" });
      if (res.status === 401) {
        router.refresh();
        return;
      }
      const data = await res.json();
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
      setKpis(data.kpis ?? kpis);
    } catch {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [tab, department, status, qDebounced]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  // refetch on window focus
  useEffect(() => {
    const onFocus = () => fetchList(true);
    window.addEventListener("focus", onFocus);
    const interval = setInterval(() => fetchList(true), 60000); // auto-refresh every 60s
    return () => {
      window.removeEventListener("focus", onFocus);
      clearInterval(interval);
    };
  }, [fetchList]);

  async function logout() {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch { /* ignore */ }
    router.refresh();
  }

  async function updateStatus(id: string, newStatus: Status) {
    // optimistic
    setItems((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
    setBusyId(id);
    try {
      const res = await fetch("/api/admin/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Update failed");
        // revert by refetching
        fetchList(true);
        return;
      }
      toast.success(`Marked as ${STATUS_META[newStatus].label}`);
      // update KPIs locally
      setKpis((k) => {
        const next = { ...k };
        return next;
      });
      fetchList(true);
    } catch {
      toast.error("Network error");
      fetchList(true);
    } finally {
      setBusyId(null);
    }
  }

  const visibleItems = items;

  const hasActiveFilters = department !== "all" || status !== "all" || qDebounced !== "";

  function clearFilters() {
    setDepartment("all");
    setStatus("all");
    setQ("");
  }

  function openDetail(a: Appt) {
    setDialogAppt(a);
    setDialogOpen(true);
  }

  function onDialogUpdated(updated: Appt) {
    setItems((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setDialogAppt(updated);
    fetchList(true);
  }

  function onDialogDeleted(id: string) {
    setItems((prev) => prev.filter((a) => a.id !== id));
    setTotal((t) => Math.max(0, t - 1));
    fetchList(true);
  }

  function onCreated(a: NewAppt) {
    // prepend the new appointment and refresh KPIs/analytics
    setItems((prev) => [a as Appt, ...prev]);
    setTotal((t) => t + 1);
    fetchList(true);
  }

  return (
    <div className="min-h-screen bg-[#f6f8fa] flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-gradient-to-b from-[#063b4f] to-[#084f67] text-white">
        <SidebarContent onLogout={logout} />
      </aside>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 max-w-[80vw] flex flex-col bg-gradient-to-b from-[#063b4f] to-[#084f67] text-white">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-3 right-3 text-white/60 hover:text-white">
              <CloseIcon className="h-5 w-5" />
            </button>
            <SidebarContent onLogout={logout} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between bg-[#063b4f] text-white px-4 h-14">
          <button onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            <span className="font-bold text-sm">Sarada Netralaya</span>
          </div>
          <button onClick={() => fetchList(true)} aria-label="Refresh">
            <RefreshCw className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#084f67]">
                {greeting} <span className="inline-block">👋</span>
              </h1>
              <p className="text-sm text-[#0f2f3a]/55 mt-0.5">
                {todayStr || "Loading date..."}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchList(true)}
                className="border-[#0b6e8f]/20 text-[#084f67] hover:bg-[#0b6e8f]/5"
              >
                <RefreshCw className={`h-4 w-4 mr-1.5 ${refreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button
                size="sm"
                onClick={() => setCreateOpen(true)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <UserPlus className="h-4 w-4 mr-1.5" /> New
              </Button>
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a href="/api/admin/appointments/export">
                      <Button size="sm" className="bg-[#0b6e8f] hover:bg-[#084f67] text-white">
                        <Download className="h-4 w-4 mr-1.5" /> Export
                      </Button>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>Download all appointments as a CSV file</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* KPI tiles */}
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <KpiTile icon={CalendarCheck} label="Today's Appointments" value={kpis.today} tone="teal" />
            <KpiTile icon={Hourglass} label="Pending Review" value={kpis.pending} tone="amber" />
            <KpiTile icon={TrendingUp} label="Upcoming" value={kpis.upcoming} tone="sky" />
            <KpiTile icon={CheckCircle2} label="Completed" value={kpis.done} tone="emerald" />
          </div>

          {/* Analytics charts */}
          <div className="mt-5">
            <AnalyticsPanel />
          </div>

          {/* Filters */}
          <div className="mt-6 rounded-2xl bg-white border border-[#0b6e8f]/10 p-4 shadow-sm">
            {/* Tabs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="inline-flex rounded-lg bg-[#f0f9fb] p-1 border border-[#0b6e8f]/10 self-start">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`px-3.5 py-1.5 text-sm font-semibold rounded-md transition-all ${
                      tab === t.id
                        ? "bg-white text-[#084f67] shadow-sm"
                        : "text-[#0f2f3a]/55 hover:text-[#084f67]"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="relative flex-1 max-w-xs">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0b6e8f]/50" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search name, phone, ref..."
                  className="h-9 pl-9 border-[#0b6e8f]/20 focus-visible:ring-[#0b6e8f]/30"
                />
              </div>
            </div>

            {/* Dropdowns */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <FilterDropdown
                icon={Filter}
                label="Department"
                value={department}
                onChange={(v) => setDepartment(v as typeof department)}
                options={[
                  { value: "all", label: "All Departments" },
                  { value: "eye_care", label: "Eye Care" },
                  { value: "optical", label: "Optical" },
                ]}
              />
              <FilterDropdown
                icon={CheckCircle2}
                label="Status"
                value={status}
                onChange={(v) => setStatus(v as typeof status)}
                options={[
                  { value: "all", label: "All Statuses" },
                  { value: "pending", label: "⏳ Pending" },
                  { value: "confirmed", label: "📌 Confirmed" },
                  { value: "done", label: "✅ Done" },
                  { value: "cancelled", label: "✕ Cancelled" },
                ]}
              />
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#084f67]"
                >
                  <X className="h-3 w-3" /> Clear
                </button>
              )}
              <span className="ml-auto text-xs text-[#0f2f3a]/45">
                Showing <span className="font-semibold text-[#084f67]">{visibleItems.length}</span> of {total}
              </span>
            </div>
          </div>

          {/* List */}
          <div className="mt-5">
            {loading ? (
              <LoadingState />
            ) : visibleItems.length === 0 ? (
              <EmptyState tab={tab} hasFilters={hasActiveFilters} onClear={clearFilters} />
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden lg:block rounded-2xl bg-white border border-[#0b6e8f]/10 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#f0f9fb] text-left text-xs uppercase tracking-wider text-[#0b6e8f]/70">
                          <th className="px-4 py-3 font-semibold">Patient</th>
                          <th className="px-4 py-3 font-semibold">Date & Time</th>
                          <th className="px-4 py-3 font-semibold">Dept</th>
                          <th className="px-4 py-3 font-semibold">Reason</th>
                          <th className="px-4 py-3 font-semibold">Status</th>
                          <th className="px-4 py-3 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#0b6e8f]/8">
                        {visibleItems.map((a) => (
                          <ApptRow
                            key={a.id}
                            a={a}
                            busy={busyId === a.id}
                            onAction={updateStatus}
                            onView={openDetail}
                          />
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
        </main>
      </div>

      {/* Appointment detail / edit dialog */}
      <AppointmentDetailDialog
        appt={dialogAppt}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onUpdated={onDialogUpdated}
        onDeleted={onDialogDeleted}
      />

      {/* Create appointment dialog */}
      <CreateAppointmentDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={onCreated}
      />
    </div>
  );
}

/* ---------- Sidebar ---------- */
function SidebarContent({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0b6e8f] to-[#10b981]">
            <Eye className="h-5 w-5 text-white" strokeWidth={2.3} />
          </span>
          <div className="leading-none">
            <div className="text-base font-bold">Sarada Netralaya</div>
            <div className="text-[10px] uppercase tracking-[0.14em] text-white/50">Owner Panel</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        <div className="flex items-center gap-2.5 rounded-lg bg-white/10 px-3 py-2.5 text-sm font-semibold text-white">
          <CalendarDays className="h-4 w-4" /> Appointments
        </div>
        <a
          href="/"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5"
        >
          <ExternalLink className="h-4 w-4" /> View Website
        </a>
        <a
          href="/#book"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5"
        >
          <CalendarCheck className="h-4 w-4" /> Booking Form
        </a>
      </nav>

      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 mb-1">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
            <UserCircle2 className="h-5 w-5 text-white" />
          </span>
          <div className="leading-tight min-w-0">
            <div className="text-sm font-semibold text-white truncate">Owner</div>
            <div className="text-[11px] text-white/50 truncate">{SITE.domain}</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-200 hover:text-white hover:bg-rose-500/20 transition-colors"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </div>
  );
}

/* ---------- KPI Tile ---------- */
const TONE_MAP: Record<string, { bg: string; text: string; ring: string }> = {
  teal: { bg: "bg-[#0b6e8f]/10", text: "text-[#0b6e8f]", ring: "ring-[#0b6e8f]/15" },
  amber: { bg: "bg-amber-100", text: "text-amber-700", ring: "ring-amber-200" },
  sky: { bg: "bg-sky-100", text: "text-sky-700", ring: "ring-sky-200" },
  emerald: { bg: "bg-emerald-100", text: "text-emerald-700", ring: "ring-emerald-200" },
};

function KpiTile({
  icon: Icon, label, value, tone,
}: { icon: typeof Eye; label: string; value: number; tone: keyof typeof TONE_MAP }) {
  const t = TONE_MAP[tone];
  return (
    <div className="rounded-2xl bg-white border border-[#0b6e8f]/10 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${t.bg} ${t.text} ring-4 ${t.ring}`}>
          <Icon className="h-5 w-5" />
        </span>
        <span className="text-3xl font-black text-[#084f67] tabular-nums">{value}</span>
      </div>
      <p className="mt-3 text-xs sm:text-sm font-medium text-[#0f2f3a]/55 leading-tight">{label}</p>
    </div>
  );
}

/* ---------- Filter Dropdown ---------- */
function FilterDropdown({
  icon: Icon, label, value, onChange, options,
}: {
  icon: typeof Filter; label: string; value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#0b6e8f]/50" />
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 appearance-none rounded-md border border-[#0b6e8f]/20 bg-white pl-8 pr-8 text-xs sm:text-sm font-medium text-[#0f2f3a] focus:outline-none focus:ring-2 focus:ring-[#0b6e8f]/30 focus:border-[#0b6e8f]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#0b6e8f]/50" viewBox="0 0 20 20" fill="none">
        <path d="M5 7l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ---------- Table Row ---------- */
function ApptRow({
  a, busy, onAction, onView,
}: { a: Appt; busy: boolean; onAction: (id: string, s: Status) => void; onView: (a: Appt) => void }) {
  const st = a.status as Status;
  const meta = STATUS_META[st];
  return (
    <tr className="hover:bg-[#f0f9fb]/50 transition-colors cursor-pointer group" onClick={() => onView(a)}>
      <td className="px-4 py-3">
        <div className="font-semibold text-[#084f67] group-hover:text-[#0b6e8f] transition-colors">{a.name}</div>
        <div className="text-xs text-[#0f2f3a]/55 flex items-center gap-1.5 mt-0.5">
          <span className="inline-flex items-center gap-1">
            <Phone className="h-3 w-3" />{a.phone}
          </span>
          {a.age != null && <span>· {a.age} yrs</span>}
        </div>
        <div className="text-[10px] text-[#0f2f3a]/35 mt-0.5">#{a.ref} · {timeAgoIST(a.createdAt)}</div>
      </td>
      <td className="px-4 py-3">
        <div className="font-medium text-[#0f2f3a]/85 text-[13px]">{formatDateLong(a.preferredDate)}</div>
        <div className="text-xs text-[#0f2f3a]/55 mt-0.5">{a.timeSlot}</div>
      </td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-1 rounded-md bg-[#0b6e8f]/8 px-2 py-0.5 text-xs font-semibold text-[#0b6e8f]">
          {DEPT_LABEL[a.department as Department] ?? a.department}
        </span>
      </td>
      <td className="px-4 py-3 max-w-[220px]">
        <p className="text-xs text-[#0f2f3a]/65 line-clamp-2">{a.note || "—"}</p>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${meta.badge}`}>
          <span>{meta.emoji}</span> {meta.label}
        </span>
      </td>
      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onView(a)}
            title="View / Edit details"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-[#084f67]"
          >
            <EyeIcon className="h-4 w-4" />
          </button>
          <a
            href={`tel:${a.phone}`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#0b6e8f]/20 text-[#0b6e8f] hover:bg-[#0b6e8f]/5"
            title="Call patient"
          >
            <Phone className="h-4 w-4" />
          </a>
          {st === "pending" && (
            <ActionBtn busy={busy} onClick={() => onAction(a.id, "confirmed")} title="Confirm" className="border-sky-200 text-sky-700 hover:bg-sky-50">
              <Check className="h-4 w-4" />
            </ActionBtn>
          )}
          {(st === "confirmed" || st === "pending") && (
            <ActionBtn busy={busy} onClick={() => onAction(a.id, "done")} title="Mark Done" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
              <CheckCircle2 className="h-4 w-4" />
            </ActionBtn>
          )}
          {(st === "pending" || st === "confirmed") && (
            <ActionBtn busy={busy} onClick={() => onAction(a.id, "cancelled")} title="Cancel" className="border-rose-200 text-rose-600 hover:bg-rose-50">
              <X className="h-4 w-4" />
            </ActionBtn>
          )}
          {st === "done" && (
            <span className="text-[10px] text-emerald-600/70 px-1">Completed</span>
          )}
          {st === "cancelled" && (
            <span className="text-[10px] text-rose-500/70 px-1">Cancelled</span>
          )}
        </div>
      </td>
    </tr>
  );
}

/* ---------- Mobile Card ---------- */
function ApptCard({
  a, busy, onAction, onView,
}: { a: Appt; busy: boolean; onAction: (id: string, s: Status) => void; onView: (a: Appt) => void }) {
  const st = a.status as Status;
  const meta = STATUS_META[st];
  return (
    <div className="rounded-2xl bg-white border border-[#0b6e8f]/10 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <button onClick={() => onView(a)} className="min-w-0 text-left">
          <div className="font-bold text-[#084f67]">{a.name}</div>
          <div className="text-xs text-[#0f2f3a]/55 mt-0.5">
            {a.phone} {a.age != null && `· ${a.age} yrs`}
          </div>
          <div className="text-[10px] text-[#0f2f3a]/35 mt-0.5">#{a.ref} · tap to view</div>
        </button>
        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold shrink-0 ${meta.badge}`}>
          <span>{meta.emoji}</span> {meta.label}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg bg-[#f0f9fb] p-2">
          <div className="text-[10px] uppercase tracking-wider text-[#0b6e8f]/60 font-semibold">Date & Time</div>
          <div className="font-medium text-[#0f2f3a]/85 mt-0.5">{formatDateLong(a.preferredDate)}</div>
          <div className="text-[#0f2f3a]/55">{a.timeSlot}</div>
        </div>
        <div className="rounded-lg bg-[#f0f9fb] p-2">
          <div className="text-[10px] uppercase tracking-wider text-[#0b6e8f]/60 font-semibold">Department</div>
          <div className="font-medium text-[#0f2f3a]/85 mt-0.5">
            {DEPT_LABEL[a.department as Department] ?? a.department}
          </div>
        </div>
      </div>

      {a.note && (
        <div className="mt-2 text-xs text-[#0f2f3a]/65 bg-[#0b6e8f]/4 rounded-lg p-2 border border-[#0b6e8f]/8">
          <span className="font-semibold text-[#0b6e8f]">Note: </span>{a.note}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => onView(a)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#084f67]"
        >
          <EyeIcon className="h-3.5 w-3.5" /> Details
        </button>
        <a
          href={`tel:${a.phone}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#0b6e8f]/20 px-3 py-1.5 text-xs font-semibold text-[#0b6e8f] hover:bg-[#0b6e8f]/5"
        >
          <Phone className="h-3.5 w-3.5" /> Call
        </a>
        {st === "pending" && (
          <ActionBtn busy={busy} onClick={() => onAction(a.id, "confirmed")} title="Confirm" className="border-sky-200 text-sky-700 hover:bg-sky-50 !px-3 !h-8 text-xs">
            <Check className="h-3.5 w-3.5" /> Confirm
          </ActionBtn>
        )}
        {(st === "confirmed" || st === "pending") && (
          <ActionBtn busy={busy} onClick={() => onAction(a.id, "done")} title="Mark Done" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 !px-3 !h-8 text-xs">
            <CheckCircle2 className="h-3.5 w-3.5" /> Done
          </ActionBtn>
        )}
        {(st === "pending" || st === "confirmed") && (
          <ActionBtn busy={busy} onClick={() => onAction(a.id, "cancelled")} title="Cancel" className="border-rose-200 text-rose-600 hover:bg-rose-50 !px-3 !h-8 text-xs ml-auto">
            <X className="h-3.5 w-3.5" /> Cancel
          </ActionBtn>
        )}
      </div>
    </div>
  );
}

function ActionBtn({
  busy, onClick, title, className, children,
}: {
  busy: boolean; onClick: () => void; title: string; className?: string; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={busy}
      title={title}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md border disabled:opacity-50 disabled:cursor-wait ${className ?? ""}`}
    >
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
    </button>
  );
}

/* ---------- States ---------- */
function LoadingState() {
  return (
    <div className="rounded-2xl bg-white border border-[#0b6e8f]/10 p-10 shadow-sm">
      <div className="flex flex-col items-center justify-center text-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-[#0b6e8f]" />
        <p className="mt-3 text-sm text-[#0f2f3a]/55">Loading appointments...</p>
      </div>
      <div className="mt-4 space-y-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-14 rounded-lg bg-[#f0f9fb] animate-pulse" />
        ))}
      </div>
    </div>
  );
}

function EmptyState({
  tab, hasFilters, onClear,
}: { tab: Tab; hasFilters: boolean; onClear: () => void }) {
  const message = hasFilters
    ? "No appointments match your current filters. Try clearing them or switching tabs."
    : tab === "today"
      ? "No appointments scheduled for today. Switch to 'Upcoming' to view future bookings."
      : tab === "upcoming"
        ? "No upcoming appointments. New bookings from the website will appear here automatically."
        : tab === "past"
          ? "No past appointments yet. Completed and past-date appointments will show up here."
          : "There are no appointments in the system yet. Bookings made from the website will appear here.";

  return (
    <div className="rounded-2xl bg-white border border-[#0b6e8f]/10 p-10 shadow-sm">
      <div className="flex flex-col items-center justify-center text-center py-12">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0b6e8f]/8 text-[#0b6e8f]">
          <Inbox className="h-8 w-8" />
        </span>
        <h3 className="mt-4 text-lg font-bold text-[#084f67]">No appointments found</h3>
        <p className="mt-1 text-sm text-[#0f2f3a]/55 max-w-sm">{message}</p>
        {hasFilters && (
          <button
            onClick={onClear}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#0b6e8f] hover:bg-[#084f67] px-4 py-2 text-sm font-semibold text-white"
          >
            <X className="h-4 w-4" /> Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}

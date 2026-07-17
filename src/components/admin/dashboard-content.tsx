"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarCheck, Users, CheckCircle2, DollarSign, CalendarPlus,
  Clock, Phone, ChevronRight, UserPlus, RefreshCw, Eye,
  Star, Download, ArrowRight, Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  STATUS_META, doctorOrDeptLabel, type Status,
} from "@/lib/appointment-shared";
import { greetingIST, fullTodayIST, formatDateLong, timeAgoIST } from "@/lib/ist";
import { formatPhone, telHref } from "@/lib/utils";
import { AnalyticsPanel } from "@/components/admin/analytics";
import { SkeletonCard, SkeletonRow } from "@/components/admin/skeleton";
import { CreateAppointmentDialog, type NewAppt } from "@/components/admin/create-dialog";
import { AppointmentDetailDialog } from "@/components/admin/appointment-dialog";

type Appt = {
  id: string; ref: string; name: string; phone: string; age: number | null;
  department: string; doctor: string | null; preferredDate: string; timeSlot: string;
  note: string | null; status: string; createdAt: string;
};

type Kpis = {
  today: number; pending: number; upcoming: number;
  done: number; cancelled: number; total: number;
  patients?: number; doneThisMonth?: number; revenueThisMonth?: number;
  todayBookings?: number;
  fees?: { eye_care: number; optical: number };
};

const inr = (n: number) => "₹" + Number(n || 0).toLocaleString("en-IN");

export function DashboardContent() {
  const [kpis, setKpis] = useState<Kpis | null>(null);
  const [todayBookings, setTodayBookings] = useState<Appt[]>([]);
  const [todayAppts, setTodayAppts] = useState<Appt[]>([]);
  const [upcomingAppts, setUpcomingAppts] = useState<Appt[]>([]);
  const [kpiLoading, setKpiLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [todayApptsLoading, setTodayApptsLoading] = useState(true);
  const [upcomingLoading, setUpcomingLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [greeting, setGreeting] = useState("Good Morning");
  const [todayStr, setTodayStr] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [dialogAppt, setDialogAppt] = useState<Appt | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    setGreeting(greetingIST());
    setTodayStr(fullTodayIST());
  }, []);

  const fetchKpis = useCallback(async (silent = false) => {
    if (!silent) setKpiLoading(true);
    try {
      const res = await fetch("/api/admin/appointments?tab=today&department=all&doctor=all&status=all&q=", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setKpis(data.kpis ?? null);
      }
    } catch {} finally { setKpiLoading(false); }
  }, []);

  const fetchTodayBookings = useCallback(async (silent = false) => {
    if (!silent) setBookingsLoading(true);
    try {
      const res = await fetch("/api/admin/appointments?tab=today_bookings&department=all&doctor=all&status=all&q=", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setTodayBookings(data.items ?? []);
      }
    } catch {} finally { setBookingsLoading(false); }
  }, []);

  const fetchTodayAppts = useCallback(async (silent = false) => {
    if (!silent) setTodayApptsLoading(true);
    try {
      const res = await fetch("/api/admin/appointments?tab=today&department=all&doctor=all&status=all&q=", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setTodayAppts((data.items ?? []).slice(0, 8));
      }
    } catch {} finally { setTodayApptsLoading(false); }
  }, []);

  const fetchUpcoming = useCallback(async (silent = false) => {
    if (!silent) setUpcomingLoading(true);
    try {
      const res = await fetch("/api/admin/appointments?tab=upcoming&department=all&doctor=all&status=all&q=", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setUpcomingAppts((data.items ?? []).slice(0, 8));
      }
    } catch {} finally { setUpcomingLoading(false); }
  }, []);

  useEffect(() => { fetchKpis(); fetchTodayBookings(); fetchTodayAppts(); fetchUpcoming(); }, [fetchKpis, fetchTodayBookings, fetchTodayAppts, fetchUpcoming]);

  useEffect(() => {
    const interval = setInterval(() => { fetchKpis(true); fetchTodayBookings(true); fetchTodayAppts(true); fetchUpcoming(true); }, 60000);
    const onFocus = () => { fetchKpis(true); fetchTodayBookings(true); fetchTodayAppts(true); fetchUpcoming(true); };
    window.addEventListener("focus", onFocus);
    return () => { clearInterval(interval); window.removeEventListener("focus", onFocus); };
  }, [fetchKpis, fetchTodayBookings, fetchTodayAppts, fetchUpcoming]);

  function refresh() {
    setRefreshing(true);
    Promise.all([fetchKpis(true), fetchTodayBookings(true), fetchTodayAppts(true), fetchUpcoming(true)])
      .finally(() => setRefreshing(false));
  }

  function onCreated(_a: NewAppt) { refresh(); }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#374151]">Today&apos;s Overview</h2>
          <p className="text-sm text-[#6b7280] mt-0.5">{greeting}! · {todayStr}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refresh} className="border-slate-200 text-slate-600 hover:bg-slate-50">
            <RefreshCw className={`h-4 w-4 mr-1.5 ${refreshing ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button size="sm" onClick={() => setCreateOpen(true)} className="bg-[#3b82f6] hover:bg-[#2563eb] text-white">
            <UserPlus className="h-4 w-4 mr-1.5" /> New Booking
          </Button>
        </div>
      </div>

      {/* KPI tiles */}
      {kpiLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : kpis && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <KpiCard icon={CalendarPlus} label="Today's Bookings" value={kpis.todayBookings ?? 0}
            sub="Booked today (any date)" iconColor="text-[#f59e0b]" iconBg="bg-[#f59e0b]/10" valueColor="text-[#f59e0b]" href="/admin/appointments?tab=today_bookings" />
          <KpiCard icon={CalendarCheck} label="Today's Appointments" value={kpis.today}
            sub={kpis.pending ? `${kpis.pending} pending` : "All reviewed"} iconColor="text-[#3b82f6]" iconBg="bg-[#3b82f6]/10" valueColor="text-[#3b82f6]" href="/admin/appointments?tab=today" />
          <KpiCard icon={Users} label="Total Patients" value={kpis.patients ?? 0}
            sub="Unique records" iconColor="text-[#10b981]" iconBg="bg-[#10b981]/10" valueColor="text-[#374151]" href="/admin/patients" />
          <KpiCard icon={CheckCircle2} label="Done This Month" value={kpis.doneThisMonth ?? 0}
            sub={`${kpis.done} all-time`} iconColor="text-[#8b5cf6]" iconBg="bg-[#8b5cf6]/10" valueColor="text-[#374151]" href="/admin/appointments?status=done" />
          <KpiCard icon={DollarSign} label="Revenue (Month)" value={inr(kpis.revenueThisMonth ?? 0)}
            sub={kpis.fees ? `Eye ${inr(kpis.fees.eye_care)} · Opt ${inr(kpis.fees.optical)}` : ""} iconColor="text-emerald-600" iconBg="bg-emerald-50" valueColor="text-[#374151]" href="/admin/reports" />
        </div>
      )}

      {/* Today's Bookings + Today's Appointments + Upcoming — 3 columns */}
      <div className="mt-6 grid lg:grid-cols-3 gap-4">
        {/* Today's Bookings */}
        <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f59e0b]/10 text-[#f59e0b]">
                <CalendarPlus className="h-3.5 w-3.5" />
              </span>
              <h3 className="text-sm font-bold text-[#374151]">Today&apos;s Bookings</h3>
            </div>
            <Link href="/admin/appointments?tab=today_bookings" className="text-xs font-semibold text-[#3b82f6] hover:underline flex items-center gap-0.5">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="max-h-[320px] overflow-y-auto">
            {bookingsLoading ? (
              <div className="p-4 space-y-3">{[0, 1, 2].map((i) => <SkeletonRow key={i} />)}</div>
            ) : todayBookings.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center px-4">
                <Inbox className="h-8 w-8 text-slate-300" />
                <p className="mt-2 text-sm text-slate-500">No bookings made today yet</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {todayBookings.slice(0, 6).map((a) => (
                  <MiniApptRow key={a.id} a={a} onClick={() => { setDialogAppt(a); setDialogOpen(true); }} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3b82f6]/10 text-[#3b82f6]">
                <CalendarCheck className="h-3.5 w-3.5" />
              </span>
              <h3 className="text-sm font-bold text-[#374151]">Today&apos;s Appointments</h3>
            </div>
            <Link href="/admin/appointments?tab=today" className="text-xs font-semibold text-[#3b82f6] hover:underline flex items-center gap-0.5">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="max-h-[320px] overflow-y-auto">
            {todayApptsLoading ? (
              <div className="p-4 space-y-3">{[0, 1, 2].map((i) => <SkeletonRow key={i} />)}</div>
            ) : todayAppts.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center px-4">
                <Inbox className="h-8 w-8 text-slate-300" />
                <p className="mt-2 text-sm text-slate-500">No appointments scheduled today</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {todayAppts.map((a) => (
                  <MiniApptRow key={a.id} a={a} onClick={() => { setDialogAppt(a); setDialogOpen(true); }} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#10b981]/10 text-[#10b981]">
                <Clock className="h-3.5 w-3.5" />
              </span>
              <h3 className="text-sm font-bold text-[#374151]">Upcoming Appointments</h3>
            </div>
            <Link href="/admin/appointments?tab=upcoming" className="text-xs font-semibold text-[#3b82f6] hover:underline flex items-center gap-0.5">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="max-h-[320px] overflow-y-auto">
            {upcomingLoading ? (
              <div className="p-4 space-y-3">{[0, 1, 2].map((i) => <SkeletonRow key={i} />)}</div>
            ) : upcomingAppts.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center px-4">
                <Inbox className="h-8 w-8 text-slate-300" />
                <p className="mt-2 text-sm text-slate-500">No upcoming appointments</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {upcomingAppts.map((a) => (
                  <MiniApptRow key={a.id} a={a} onClick={() => { setDialogAppt(a); setDialogOpen(true); }} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Analytics */}
      <div className="mt-6">
        <AnalyticsPanel />
      </div>

      {/* Quick Actions */}
      <div className="mt-6 rounded-xl bg-white border border-slate-200 p-5 shadow-sm">
        <h3 className="text-sm font-bold text-[#374151] mb-4">Quick Actions</h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[
            { icon: CalendarCheck, label: "New Appointment", onClick: () => setCreateOpen(true) },
            { icon: Users, label: "Patients", href: "/admin/patients" },
            { icon: Download, label: "Reports", href: "/admin/reports" },
            { icon: DollarSign, label: "Set Fees", href: "/admin/settings?tab=fees" },
            { icon: Eye, label: "View Site", href: "/" },
            { icon: Star, label: "Reviews", href: "/reviews" },
          ].map((action) => (
            <button key={action.label}
              onClick={() => action.onClick ? action.onClick() : window.open(action.href, "_self")}
              className="group flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-[#3b82f6]/5 transition-colors">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#3b82f6] group-hover:bg-[#3b82f6] group-hover:text-white transition-colors shadow-sm">
                <action.icon className="h-5 w-5" />
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-[#374151] text-center leading-tight">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-xs text-[#6b7280]">© 2026 Sarada Netralaya. All Rights Reserved.</p>
        <p className="text-xs text-[#6b7280]">Version 2.0.0</p>
      </footer>

      {/* Dialogs */}
      <AppointmentDetailDialog appt={dialogAppt} open={dialogOpen} onOpenChange={setDialogOpen}
        onUpdated={(u) => { setDialogAppt(u); refresh(); }}
        onDeleted={() => refresh()} />
      <CreateAppointmentDialog open={createOpen} onOpenChange={setCreateOpen} onCreated={onCreated} />
    </>
  );
}

function KpiCard({ icon: Icon, label, value, sub, iconColor, iconBg, valueColor, href }: {
  icon: typeof CalendarCheck; label: string; value: number | string; sub?: string;
  iconColor: string; iconBg: string; valueColor: string; href?: string;
}) {
  const inner = (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs sm:text-sm text-[#6b7280] font-medium leading-tight">{label}</p>
          <div className={`mt-1.5 text-xl sm:text-2xl font-bold ${valueColor} tabular-nums leading-none`}>{value}</div>
        </div>
        <span className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
        </span>
      </div>
      {sub && <p className="mt-2 text-[11px] text-slate-400 truncate">{sub}</p>}
    </>
  );
  const cls = "rounded-xl bg-white border border-slate-200 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer group";
  if (href) return <Link href={href} className={cls}>{inner}</Link>;
  return <div className={cls}>{inner}</div>;
}

function MiniApptRow({ a, onClick }: { a: Appt; onClick: () => void }) {
  const st = a.status as Status;
  const meta = STATUS_META[st];
  return (
    <button onClick={onClick} className="w-full block px-4 py-3 hover:bg-slate-50/60 transition-colors text-left">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-[#374151] truncate">{a.name}</span>
        <span className={`inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0 text-[9px] font-bold shrink-0 ${meta.badge}`}>
          {meta.emoji} {meta.label}
        </span>
      </div>
      <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#3b82f6] font-semibold">
        <Phone className="h-2.5 w-2.5 shrink-0" />
        <a href={telHref(a.phone)} onClick={(e) => e.stopPropagation()} className="hover:underline">{formatPhone(a.phone)}</a>
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500">
        <span>{formatDateLong(a.preferredDate)}</span>
        <span className="text-slate-300">·</span>
        <span>{a.timeSlot}</span>
        <span className="text-slate-300">·</span>
        <span className="truncate">{doctorOrDeptLabel(a.doctor, a.department)}</span>
      </div>
    </button>
  );
}

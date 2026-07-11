"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie,
} from "recharts";
import {
  Loader2, TrendingUp, PieChart as PieIcon, CalendarClock, Activity,
} from "lucide-react";
import { STATUS_META, type Status } from "@/lib/appointments";

type Stats = {
  statusDist: { name: string; value: number }[];
  deptDist: { name: string; value: number }[];
  weekly: { date: string; label: string; bookings: number }[];
  slotOccupancy: { slot: string; count: number }[];
  summary: { total: number; todayCount: number; upcomingCount: number };
};

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  confirmed: "#0ea5e9",
  done: "#10b981",
  cancelled: "#f43f5e",
};

const DEPT_COLORS: Record<string, string> = {
  eye_care: "#0b6e8f",
  optical: "#10b981",
};

const DEPT_LABEL: Record<string, string> = {
  eye_care: "Eye Care",
  optical: "Optical",
};

export function AnalyticsPanel() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/admin/stats", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (active) setStats(data);
        }
      } catch {
        /* ignore */
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 90000); // refresh every 90s
    return () => { active = false; clearInterval(interval); };
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl bg-white border border-[#0b6e8f]/10 p-6 shadow-sm">
        <div className="flex items-center gap-2 text-[#0b6e8f]">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm font-medium">Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (!stats || stats.summary.total === 0) {
    return null; // hide panel if no data
  }

  const totalStatus = stats.statusDist.reduce((s, x) => s + x.value, 0) || 1;

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      {/* Weekly trend — spans 2 cols */}
      <div className="lg:col-span-2 rounded-2xl bg-white border border-[#0b6e8f]/10 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0b6e8f]/10 text-[#0b6e8f]">
              <TrendingUp className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-[#084f67]">Booking Trend</h3>
              <p className="text-[11px] text-slate-500">Appointments per day · last 7 days</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-[#084f67] tabular-nums">
              {stats.weekly.reduce((s, w) => s + w.bookings, 0)}
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">this week</div>
          </div>
        </div>
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.weekly} margin={{ top: 4, right: 4, bottom: 0, left: -22 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                cursor={{ fill: "#0b6e8f08" }}
                contentStyle={{
                  borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 12,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
                formatter={(v: number) => [`${v} booking${v !== 1 ? "s" : ""}`, ""]}
                labelFormatter={(l) => `${l}`}
              />
              <Bar dataKey="bookings" radius={[6, 6, 0, 0]} maxBarSize={42}>
                {stats.weekly.map((entry, i) => (
                  <Cell key={i} fill={entry.bookings > 0 ? "#0b6e8f" : "#cbd5e1"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status distribution donut */}
      <div className="rounded-2xl bg-white border border-[#0b6e8f]/10 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0b6e8f]/10 text-[#0b6e8f]">
            <PieIcon className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-[#084f67]">Status Mix</h3>
            <p className="text-[11px] text-slate-500">All appointments</p>
          </div>
        </div>
        <div className="h-[140px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats.statusDist}
                dataKey="value"
                nameKey="name"
                cx="50%" cy="50%"
                innerRadius={42} outerRadius={62}
                paddingAngle={2}
              >
                {stats.statusDist.map((entry) => (
                  <Cell key={entry.name} fill={STATUS_COLORS[entry.name] ?? "#94a3b8"} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 12 }}
                formatter={(v: number, n: string) => [`${v}`, STATUS_META[n as Status]?.label ?? n]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-[#084f67] tabular-nums">{totalStatus}</span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400">Total</span>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-1.5">
          {stats.statusDist.map((s) => (
            <div key={s.name} className="flex items-center gap-1.5 text-[11px]">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[s.name] ?? "#94a3b8" }} />
              <span className="text-slate-600 font-medium">{STATUS_META[s.name as Status]?.label ?? s.name}</span>
              <span className="ml-auto font-bold text-slate-700 tabular-nums">{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Today's slot occupancy */}
      {stats.slotOccupancy.some((s) => s.count > 0) && (
        <div className="lg:col-span-3 rounded-2xl bg-white border border-[#0b6e8f]/10 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0b6e8f]/10 text-[#0b6e8f]">
              <CalendarClock className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-[#084f67]">Today's Slot Occupancy</h3>
              <p className="text-[11px] text-slate-500">Active appointments per time slot (excl. cancelled)</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.slotOccupancy.map((s) => {
              const max = Math.max(...stats.slotOccupancy.map((x) => x.count), 1);
              const pct = (s.count / max) * 100;
              return (
                <div key={s.slot} className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-slate-600 leading-tight">{s.slot}</span>
                    <span className="text-lg font-bold text-[#084f67] tabular-nums">{s.count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#0b6e8f] to-[#10b981] transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

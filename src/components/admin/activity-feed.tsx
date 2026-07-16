"use client";

import { useEffect, useState } from "react";
import {
  Loader2, Clock, Phone, Eye, Glasses, CalendarClock,
  ArrowRight, Bell,
} from "lucide-react";
import { STATUS_META, type Status } from "@/lib/appointment-shared";

type ActivityItem = {
  id: string;
  ref: string;
  name: string;
  phoneLast4: string;
  department: string;
  doctorLabel: string;
  status: string;
  preferredDate: string;
  timeSlot: string;
  createdAt: string;
  timeAgo: string;
};

export function ActivityFeed({ onView }: { onView?: (id: string) => void }) {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/admin/activity", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (active) setItems(data.items ?? []);
        }
      } catch {
        /* ignore */
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 60000);
    return () => { active = false; clearInterval(interval); };
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-sm">
        <div className="flex items-center gap-2 text-[#0b6e8f]">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm font-medium">Loading activity...</span>
        </div>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
      {/* header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0b6e8f]/10 text-[#0b6e8f]">
            <Bell className="h-3.5 w-3.5" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-[#084f67] leading-tight">Recent Activity</h3>
            <p className="text-[10px] text-slate-400 leading-tight mt-0.5">Latest bookings</p>
          </div>
        </div>
        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </span>
      </div>

      {/* timeline */}
      <div className="divide-y divide-slate-50">
        {items.map((a, idx) => {
          const st = a.status as Status;
          const meta = STATUS_META[st];
          return (
            <button
              key={a.id}
              onClick={() => onView?.(a.id)}
              className="group w-full flex items-start gap-3 px-5 py-3 hover:bg-slate-50/60 transition-colors text-left relative"
            >
              {/* timeline dot */}
              <div className="relative flex flex-col items-center pt-1">
                <span className={`h-2.5 w-2.5 rounded-full ${meta.dot} ring-4 ring-white`} />
                {idx < items.length - 1 && (
                  <span className="absolute top-4 h-full w-px bg-slate-100" />
                )}
              </div>

              {/* content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-[#084f67] group-hover:text-[#0b6e8f] transition-colors truncate">
                    {a.name}
                  </span>
                  <span className={`inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0 text-[9px] font-bold ${meta.badge}`}>
                    {meta.emoji} {meta.label}
                  </span>
                  <span className="text-[10px] text-slate-400 ml-auto shrink-0 inline-flex items-center gap-0.5">
                    <Clock className="h-2.5 w-2.5" />{a.timeAgo}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-500 flex-wrap">
                  <span className="inline-flex items-center gap-0.5 text-[#0b6e8f] font-semibold">
                    <Phone className="h-2.5 w-2.5" />•••• {a.phoneLast4}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="inline-flex items-center gap-0.5">
                    {a.department === "optical" ? <Glasses className="h-2.5 w-2.5" /> : <Eye className="h-2.5 w-2.5" />}
                    {a.doctorLabel}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="inline-flex items-center gap-0.5">
                    <CalendarClock className="h-2.5 w-2.5" />#{a.ref}
                  </span>
                </div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-[#0b6e8f] group-hover:translate-x-0.5 transition-all shrink-0 mt-1.5" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

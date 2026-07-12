// GET /api/admin/stats — aggregate analytics for the dashboard.
// Returns: status distribution, weekly appointment counts (last 7 days IST),
// department split, and today's slot occupancy. Gracefully handles DB errors.

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureDbSchema } from "@/lib/db-ensure";
import { isOwnerAuthenticated } from "@/lib/auth";
import { TIME_SLOTS } from "@/lib/appointments";
import { todayISTString } from "@/lib/ist";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function istDateOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export async function GET(_req: NextRequest) {
  const ok = await isOwnerAuthenticated();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const today = todayISTString();
  await ensureDbSchema();

  // Defaults (returned if DB is unavailable)
  let statusDist: { name: string; value: number }[] = [];
  let deptDist: { name: string; value: number }[] = [];
  let weekly: { date: string; label: string; bookings: number }[] = [];
  let slotOccupancy: { slot: string; count: number }[] = TIME_SLOTS.map((slot) => ({ slot, count: 0 }));
  let summary = { total: 0, todayCount: 0, upcomingCount: 0 };

  try {
    // Status distribution (all-time)
    const statusGroups = await db.appointment.groupBy({
      by: ["status"],
      _count: { _all: true },
    });
    statusDist = statusGroups.map((g) => ({ name: g.status, value: g._count._all }));

    // Department split (all-time)
    const deptGroups = await db.appointment.groupBy({
      by: ["department"],
      _count: { _all: true },
    });
    deptDist = deptGroups.map((g) => ({ name: g.department, value: g._count._all }));

    // Weekly trend: last 7 days counts by preferredDate
    const weekDates: string[] = [];
    const weekLabels: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const ds = istDateOffset(i);
      weekDates.push(ds);
      const d = new Date(ds);
      weekLabels.push(d.toLocaleDateString("en-US", { weekday: "short" }));
    }

    const weekCounts = await db.appointment.groupBy({
      by: ["preferredDate"],
      where: { preferredDate: { in: weekDates } },
      _count: { _all: true },
    });
    const countMap = new Map(weekCounts.map((w) => [w.preferredDate, w._count._all]));
    weekly = weekDates.map((d, i) => ({
      date: d,
      label: weekLabels[i],
      bookings: countMap.get(d) ?? 0,
    }));

    // Today's slot occupancy
    const todayAppts = await db.appointment.findMany({
      where: { preferredDate: today, status: { notIn: ["cancelled"] } },
      select: { timeSlot: true },
    });
    slotOccupancy = TIME_SLOTS.map((slot) => ({
      slot,
      count: todayAppts.filter((a) => a.timeSlot === slot).length,
    }));

    // Totals
    const total = await db.appointment.count();
    const upcomingCount = await db.appointment.count({
      where: { preferredDate: { gte: today }, status: { notIn: ["cancelled", "done"] } },
    });
    summary = { total, todayCount: todayAppts.length, upcomingCount };
  } catch (err) {
    console.error("[admin/stats] DB error:", err);
    // return defaults (empty arrays + zeros)
  }

  return NextResponse.json({ statusDist, deptDist, weekly, slotOccupancy, summary });
}

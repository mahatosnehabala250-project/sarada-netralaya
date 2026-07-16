// GET /api/admin/activity — recent bookings for the dashboard activity feed.
// Returns the 8 most recent appointments (by createdAt) for the activity panel.
//
// PRIVACY: Returns only phoneLast4 (not full phone) to minimize PHI exposure
// on the dashboard's always-visible activity panel. The owner can click a
// row to open the full detail dialog (which fetches the complete record
// through /api/admin/appointments/[id]).

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureDbSchema } from "@/lib/db-ensure";
import { isOwnerAuthenticated } from "@/lib/auth";
import { doctorOrDeptLabel } from "@/lib/appointments";
import { timeAgoIST } from "@/lib/ist";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  const ok = await isOwnerAuthenticated();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await ensureDbSchema();

  let items: Awaited<ReturnType<typeof db.appointment.findMany>> = [];
  try {
    items = await db.appointment.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      // Select only the columns the activity feed needs — never select more
      // PHI than necessary. (Returning a partial type via `select` is fine
      // because we only read the listed fields below.)
      select: {
        id: true,
        ref: true,
        name: true,
        phone: true,
        department: true,
        doctor: true,
        status: true,
        preferredDate: true,
        timeSlot: true,
        createdAt: true,
        // Deliberately NOT selecting: age, note, ipHash.
      },
    }) as Awaited<ReturnType<typeof db.appointment.findMany>>;
  } catch (err) {
    console.error("[admin/activity] DB error:", err);
  }

  const activity = items.map((a) => ({
    id: a.id,
    ref: a.ref,
    name: a.name,
    phoneLast4: a.phone.slice(-4),
    department: a.department,
    doctorLabel: doctorOrDeptLabel(a.doctor, a.department),
    status: a.status,
    preferredDate: a.preferredDate,
    timeSlot: a.timeSlot,
    createdAt: a.createdAt,
    timeAgo: timeAgoIST(a.createdAt),
  }));

  return NextResponse.json({ items: activity });
}

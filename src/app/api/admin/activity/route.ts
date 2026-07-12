// GET /api/admin/activity — recent bookings for the dashboard activity feed.
// Returns the 8 most recent appointments (by createdAt) for the activity panel.

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureDbSchema } from "@/lib/db-ensure";
import { isOwnerAuthenticated } from "@/lib/auth";
import { DEPT_LABEL, type Department } from "@/lib/appointments";
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
    });
  } catch (err) {
    console.error("[admin/activity] DB error:", err);
  }

  const activity = items.map((a) => ({
    id: a.id,
    ref: a.ref,
    name: a.name,
    phone: a.phone,
    department: DEPT_LABEL[a.department as Department] ?? a.department,
    status: a.status,
    preferredDate: a.preferredDate,
    timeSlot: a.timeSlot,
    createdAt: a.createdAt,
    timeAgo: timeAgoIST(a.createdAt),
  }));

  return NextResponse.json({ items: activity });
}

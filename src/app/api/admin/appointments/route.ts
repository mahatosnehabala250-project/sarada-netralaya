// GET  /api/admin/appointments  — list appointments (owner only), with filters.
// PATCH /api/admin/appointments — update a single appointment's status.

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isOwnerAuthenticated } from "@/lib/auth";
import { STATUSES, type Status } from "@/lib/appointments";
import { todayISTString } from "@/lib/ist";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function ensureAuth() {
  const ok = await isOwnerAuthenticated();
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET(req: NextRequest) {
  const authFail = await ensureAuth();
  if (authFail) return authFail;

  const url = req.nextUrl;
  const tab = url.searchParams.get("tab") ?? "all"; // today|upcoming|past|all
  const department = url.searchParams.get("department") ?? "all"; // all|eye_care|optical
  const status = url.searchParams.get("status") ?? "all"; // all|pending|confirmed|done|cancelled
  const q = url.searchParams.get("q")?.trim() ?? "";

  const today = todayISTString();

  // Build where clause
  const where: Record<string, unknown> = {};
  if (department !== "all") where.department = department;
  if (status !== "all") where.status = status;
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { phone: { contains: q } },
      { ref: { contains: q } },
    ];
  }
  if (tab === "today") {
    where.preferredDate = today;
  } else if (tab === "upcoming") {
    where.preferredDate = { gte: today };
  } else if (tab === "past") {
    where.preferredDate = { lt: today };
  }

  const [items, total] = await Promise.all([
    db.appointment.findMany({
      where,
      orderBy: [{ preferredDate: "asc" }, { createdAt: "asc" }],
      take: 500,
    }),
    db.appointment.count({ where }),
  ]);

  // KPI counts (across all data, ignoring filters, for dashboard tiles)
  const [
    todayCount,
    pendingCount,
    upcomingCount,
    doneCount,
    cancelledCount,
    totalCount,
  ] = await Promise.all([
    db.appointment.count({ where: { preferredDate: today } }),
    db.appointment.count({ where: { status: "pending" } }),
    db.appointment.count({ where: { preferredDate: { gte: today } } }),
    db.appointment.count({ where: { status: "done" } }),
    db.appointment.count({ where: { status: "cancelled" } }),
    db.appointment.count(),
  ]);

  return NextResponse.json({
    items,
    total,
    kpis: {
      today: todayCount,
      pending: pendingCount,
      upcoming: upcomingCount,
      done: doneCount,
      cancelled: cancelledCount,
      total: totalCount,
    },
  });
}

export async function PATCH(req: NextRequest) {
  const authFail = await ensureAuth();
  if (authFail) return authFail;

  let body: { id?: string; status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const id = body.id;
  const newStatus = body.status;
  if (!id || !newStatus) {
    return NextResponse.json(
      { error: "Missing id or status" },
      { status: 400 }
    );
  }
  if (!STATUSES.includes(newStatus as Status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = await db.appointment.update({
    where: { id },
    data: { status: newStatus },
  });

  return NextResponse.json({ ok: true, item: updated });
}

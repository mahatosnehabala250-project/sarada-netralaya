// GET  /api/admin/appointments  — list appointments (owner only), with filters.
// PATCH /api/admin/appointments — update a single appointment's status.

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureDbSchema } from "@/lib/db-ensure";
import { isOwnerAuthenticated } from "@/lib/auth";
import { STATUSES, type Status } from "@/lib/appointments";
import { todayISTString } from "@/lib/ist";
import { CONSULTATION_FEE } from "@/lib/site-info";

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
  const tab = url.searchParams.get("tab") ?? "all"; // today|upcoming|past|all|range
  const department = url.searchParams.get("department") ?? "all"; // all|eye_care|optical
  const status = url.searchParams.get("status") ?? "all"; // all|pending|confirmed|done|cancelled
  const q = url.searchParams.get("q")?.trim() ?? "";
  const dateFrom = url.searchParams.get("dateFrom")?.trim() ?? ""; // yyyy-MM-dd
  const dateTo = url.searchParams.get("dateTo")?.trim() ?? ""; // yyyy-MM-dd

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
  } else if (tab === "range" && dateFrom && dateTo) {
    // custom date range (inclusive both ends)
    where.preferredDate = { gte: dateFrom, lte: dateTo };
  }

  await ensureDbSchema();

  let items: Awaited<ReturnType<typeof db.appointment.findMany>> = [];
  let total = 0;
  try {
    [items, total] = await Promise.all([
      db.appointment.findMany({
        where,
        orderBy: [{ preferredDate: "asc" }, { createdAt: "asc" }],
        take: 500,
      }),
      db.appointment.count({ where }),
    ]);
  } catch (dbErr) {
    console.error("[admin/appointments list] DB error:", dbErr);
    // Return empty state instead of 500 — dashboard shows "no appointments"
  }

  // KPI counts (across all data, ignoring filters, for dashboard tiles)
  const monthPrefix = today.slice(0, 7); // "YYYY-MM" — current month in IST
  let todayCount = 0, pendingCount = 0, upcomingCount = 0, doneCount = 0,
    cancelledCount = 0, totalCount = 0, uniquePatients = 0, doneThisMonth = 0;
  try {
    const [
      tCount, pCount, uCount, dCount, cCount, allCount, patientGroups, dMonth,
    ] = await Promise.all([
      db.appointment.count({ where: { preferredDate: today } }),
      db.appointment.count({ where: { status: "pending" } }),
      db.appointment.count({ where: { preferredDate: { gte: today } } }),
      db.appointment.count({ where: { status: "done" } }),
      db.appointment.count({ where: { status: "cancelled" } }),
      db.appointment.count(),
      db.appointment.groupBy({ by: ["phone"] }),         // distinct patients
      db.appointment.count({ where: { status: "done", preferredDate: { startsWith: monthPrefix } } }),
    ]);
    todayCount = tCount; pendingCount = pCount; upcomingCount = uCount;
    doneCount = dCount; cancelledCount = cCount; totalCount = allCount;
    uniquePatients = patientGroups.length; doneThisMonth = dMonth;
  } catch {
    // DB unavailable — KPIs stay 0
  }

  // Estimated revenue = completed visits this month × consultation fee.
  // This is an ESTIMATE (there is no billing backend), based on the clinic's
  // consultation fee set in site-info (CONSULTATION_FEE).
  const revenueThisMonth = doneThisMonth * CONSULTATION_FEE;

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
      patients: uniquePatients,
      doneThisMonth,
      revenueThisMonth,
      fee: CONSULTATION_FEE,
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

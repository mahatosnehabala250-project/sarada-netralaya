// GET  /api/admin/appointments  — list appointments (owner only), with filters.
// PATCH /api/admin/appointments — update a single appointment's status.

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureDbSchema } from "@/lib/db-ensure";
import { isOwnerAuthenticated } from "@/lib/auth";
import { STATUSES, type Status } from "@/lib/appointments";
import { todayISTString } from "@/lib/ist";
import { getFees } from "@/lib/settings";

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
  let revenueThisMonth = 0;
  const fees = await getFees();
  try {
    const [
      tCount, pCount, uCount, dCount, cCount, allCount, patientGroups, doneMonthRows,
    ] = await Promise.all([
      db.appointment.count({ where: { preferredDate: today } }),
      db.appointment.count({ where: { status: "pending" } }),
      db.appointment.count({ where: { preferredDate: { gte: today } } }),
      db.appointment.count({ where: { status: "done" } }),
      db.appointment.count({ where: { status: "cancelled" } }),
      db.appointment.count(),
      db.appointment.groupBy({ by: ["phone"] }),         // distinct patients
      db.appointment.findMany({                          // completed this month, by dept
        where: { status: "done", preferredDate: { startsWith: monthPrefix } },
        select: { department: true, feeCharged: true },
      }),
    ]);
    todayCount = tCount; pendingCount = pCount; upcomingCount = uCount;
    doneCount = dCount; cancelledCount = cCount; totalCount = allCount;
    uniquePatients = patientGroups.length; doneThisMonth = doneMonthRows.length;

    // Revenue = sum of the fee captured when each visit was marked done.
    // Legacy rows completed before fee capture existed fall back to the
    // current per-department fee from Settings.
    revenueThisMonth = doneMonthRows.reduce(
      (sum, a) =>
        sum +
        (a.feeCharged ??
          (a.department === "eye_care" ? fees.eye_care : fees.optical)),
      0
    );
  } catch {
    // DB unavailable — KPIs stay 0
  }

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
      fees,
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

  let updated;
  try {
    const existing = await db.appointment.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Capture the consultation fee the first time a visit is marked done,
    // so later fee changes in Settings don't rewrite past revenue.
    let feeCharged = existing.feeCharged;
    if (newStatus === "done" && feeCharged == null) {
      const fees = await getFees();
      feeCharged = existing.department === "eye_care" ? fees.eye_care : fees.optical;
    }

    updated = await db.appointment.update({
      where: { id },
      data: { status: newStatus, feeCharged, version: { increment: 1 } },
    });
  } catch (dbErr) {
    console.error("[admin/appointments patch] DB error:", dbErr);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, item: updated });
}

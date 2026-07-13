// GET /api/admin/appointments/export — CSV export of all appointments (owner only).

import { NextRequest } from "next/server";
import { db } from "@/lib/db"
import { ensureDbSchema } from "@/lib/db-ensure";
import { isOwnerAuthenticated } from "@/lib/auth";
import { DEPT_LABEL } from "@/lib/appointments";
import { formatDateLong, formatCreatedAtIST } from "@/lib/ist";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function csvEscape(value: unknown): string {
  let s = value == null ? "" : String(value);
  // CSV injection protection: prefix dangerous leading chars with a single quote
  // so Excel/LibreOffice doesn't interpret them as formulas
  if (/^[=+\-@\t\r]/.test(s)) {
    s = "'" + s;
  }
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET(req: NextRequest) {
  const ok = await isOwnerAuthenticated();
  if (!ok) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Support the same filters as the list endpoint so the owner can export
  // the currently-filtered view, not just all appointments.
  const url = req.nextUrl;
  const tab = url.searchParams.get("tab") ?? "all";
  const department = url.searchParams.get("department") ?? "all";
  const status = url.searchParams.get("status") ?? "all";
  const q = url.searchParams.get("q")?.trim() ?? "";
  const dateFrom = url.searchParams.get("dateFrom")?.trim() ?? "";
  const dateTo = url.searchParams.get("dateTo")?.trim() ?? "";

  const today = new Date().toISOString().slice(0, 10);

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
    where.preferredDate = { gte: dateFrom, lte: dateTo };
  }

  await ensureDbSchema();
  let items: Awaited<ReturnType<typeof db.appointment.findMany>> = [];
  try {
    items = await db.appointment.findMany({
      where,
      orderBy: [{ preferredDate: "asc" }, { createdAt: "asc" }],
    });
  } catch (err) {
    console.error("[export] DB error:", err);
    // return empty CSV with header only
  }

  const header = [
    "Ref",
    "Name",
    "Phone",
    "Age",
    "Department",
    "Preferred Date",
    "Time Slot",
    "Status",
    "Note",
    "Booked At",
  ];

  const rows = items.map((a) =>
    [
      a.ref,
      a.name,
      a.phone,
      a.age ?? "",
      DEPT_LABEL[a.department as keyof typeof DEPT_LABEL] ?? a.department,
      formatDateLong(a.preferredDate),
      a.timeSlot,
      a.status,
      a.note ?? "",
      formatCreatedAtIST(a.createdAt),
    ]
      .map(csvEscape)
      .join(",")
  );

  const csv = [header.map(csvEscape).join(","), ...rows].join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="sarada-appointments-${todayFilename()}.csv"`,
    },
  });
}

function todayFilename(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

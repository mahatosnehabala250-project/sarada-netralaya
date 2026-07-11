// GET /api/admin/appointments/export — CSV export of all appointments (owner only).

import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { isOwnerAuthenticated } from "@/lib/auth";
import { DEPT_LABEL } from "@/lib/appointments";
import { formatDateLong, formatCreatedAtIST } from "@/lib/ist";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function csvEscape(value: unknown): string {
  const s = value == null ? "" : String(value);
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

  const items = await db.appointment.findMany({
    orderBy: [{ preferredDate: "asc" }, { createdAt: "asc" }],
  });

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

// POST /api/admin/appointments/create — owner creates an appointment directly
// (walk-in / phone bookings). Auth-gated. Validates all fields.

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"
import { ensureDbSchema } from "@/lib/db-ensure";
import { isOwnerAuthenticated } from "@/lib/auth";
import {
  bookingSchema, generateUniqueRef, DEPARTMENTS, TIME_SLOTS, STATUSES, type Status,
} from "@/lib/appointments";
import { todayISTString } from "@/lib/ist";
import { notifyNewBooking } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const ok = await isOwnerAuthenticated();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Reuse the public booking schema (it handles all field validation),
  // then allow an optional status override.
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message ?? "Invalid input", field: first?.path?.[0] },
      { status: 400 }
    );
  }
  const d = parsed.data;

  if (d.preferredDate < todayISTString()) {
    return NextResponse.json(
      { error: "Date cannot be in the past", field: "preferredDate" },
      { status: 400 }
    );
  }

  // Optional status override (owner can create as "confirmed" directly)
  const raw = body as Record<string, unknown>;
  let status: Status = "pending";
  if (typeof raw.status === "string" && STATUSES.includes(raw.status as Status)) {
    status = raw.status as Status;
  }

  await ensureDbSchema();
  const ref = await generateUniqueRef();
  const created = await db.appointment.create({
    data: {
      ref,
      name: d.name,
      phone: d.phone,
      age: d.age,
      department: d.department,
      preferredDate: d.preferredDate,
      timeSlot: d.timeSlot,
      note: d.note,
      status,
      ipHash: null, // owner-created, no IP
    },
  });

  // Send Telegram notification (await with timeout for serverless reliability)
  try {
    await Promise.race([
      notifyNewBooking({
        ref: created.ref,
        name: created.name,
        age: created.age,
        phone: created.phone,
        department: created.department as "eye_care" | "optical",
        preferredDate: created.preferredDate,
        timeSlot: created.timeSlot,
        note: created.note,
      }),
      new Promise((resolve) => setTimeout(resolve, 5000)),
    ]);
  } catch {
    /* swallow */
  }

  return NextResponse.json({ ok: true, item: created }, { status: 201 });
}

// Re-export for type-narrowing consumers
export { DEPARTMENTS, TIME_SLOTS };

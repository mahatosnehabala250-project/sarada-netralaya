// POST /api/appointments/lookup — public endpoint for patients to check
// their appointment status by booking reference + phone (last 4 digits).
// Returns limited info (no full phone, no IP). Does NOT require auth.

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureDbSchema } from "@/lib/db-ensure";
import { DEPT_LABEL, STATUS_META, type Status, type Department } from "@/lib/appointments";
import { formatDateLong } from "@/lib/ist";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { ref?: string; phone?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const ref = (body.ref ?? "").trim().replace(/^#/, "");
  const phone = (body.phone ?? "").trim().replace(/\D/g, "");

  if (!ref || ref.length < 4) {
    return NextResponse.json({ error: "Please enter your booking reference number" }, { status: 400 });
  }
  if (!phone || phone.length < 4) {
    return NextResponse.json({ error: "Please enter the last 4 digits of your mobile number" }, { status: 400 });
  }

  await ensureDbSchema();

  let appt;
  try {
    // Find by ref, then verify phone ends with the provided digits
    appt = await db.appointment.findUnique({ where: { ref } });
  } catch (err) {
    console.error("[lookup] DB error:", err);
    return NextResponse.json(
      { error: "Could not look up appointments right now. Please call us at +91 70910 90014." },
      { status: 503 }
    );
  }

  if (!appt) {
    return NextResponse.json(
      { error: "No appointment found with that reference number. Please check and try again." },
      { status: 404 }
    );
  }

  // Verify the phone matches (last 4 digits)
  if (!appt.phone.endsWith(phone) && phone.length >= 4) {
    // If they entered the full 10-digit number, also accept exact match
    if (appt.phone !== phone) {
      return NextResponse.json(
        { error: "The reference and phone number do not match. Please verify and try again." },
        { status: 403 }
      );
    }
  }

  const st = appt.status as Status;
  const meta = STATUS_META[st];

  // Return limited, safe info (no full phone, no IP hash)
  return NextResponse.json({
    ok: true,
    appointment: {
      ref: appt.ref,
      name: appt.name,
      phoneLast4: appt.phone.slice(-4),
      age: appt.age,
      department: DEPT_LABEL[appt.department as Department] ?? appt.department,
      preferredDate: appt.preferredDate,
      preferredDateLabel: formatDateLong(appt.preferredDate),
      timeSlot: appt.timeSlot,
      status: appt.status,
      statusLabel: meta.label,
      statusEmoji: meta.emoji,
      note: appt.note,
      createdAt: appt.createdAt,
    },
  });
}

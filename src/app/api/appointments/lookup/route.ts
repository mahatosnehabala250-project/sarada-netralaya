// POST /api/appointments/lookup — public endpoint for patients to check
// their appointment status by booking reference + phone (last 4 digits).
// Returns limited info (no full phone, no IP). Does NOT require auth.
// Rate limited (per-IP) AND per-ref lockout to prevent brute-force
// enumeration of patient data.

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureDbSchema } from "@/lib/db-ensure";
import {
  doctorOrDeptLabel,
  STATUS_META,
  type Status,
} from "@/lib/appointments";
import {
  getClientIp,
  checkLookupRateLimit,
  checkRefLockout,
  recordRefFailure,
  clearRefFailures,
} from "@/lib/request-security";
import { formatDateLong } from "@/lib/ist";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Per-IP rate limit (stricter than booking) — shared across instances.
  const ip = getClientIp(req);
  const rl = await checkLookupRateLimit(ip);
  if (!rl.ok) {
    return NextResponse.json(
      {
        error: `Too many attempts. Please try again in ${Math.ceil(
          rl.retryAfterSec / 60
        )} minute(s).`,
      },
      { status: 429 }
    );
  }

  let body: { ref?: string; phone?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Validate + sanitize inputs.
  const ref = (body.ref ?? "").trim().replace(/^#/, "").slice(0, 20);
  const phone = (body.phone ?? "").trim().replace(/\D/g, "").slice(0, 10);

  if (!ref || !/^\d{4,8}$/.test(ref)) {
    return NextResponse.json(
      { error: "Please enter your booking reference number (6–8 digits)" },
      { status: 400 }
    );
  }
  // Accept either exactly last-4 digits OR full 10-digit number.
  if (phone.length !== 4 && phone.length !== 10) {
    return NextResponse.json(
      { error: "Please enter the last 4 digits of your mobile number" },
      { status: 400 }
    );
  }

  // Per-ref lockout — if too many failed attempts against this ref, deny
  // even with the right phone. Protects against targeted enumeration.
  const lock = await checkRefLockout(ref);
  if (lock.locked) {
    return NextResponse.json(
      {
        error: `For security, this reference is temporarily locked. Please try again in ${Math.ceil(
          lock.retryAfterSec / 60
        )} minute(s) or call us at +91 70910 90014.`,
      },
      { status: 429 }
    );
  }

  await ensureDbSchema();

  let appt;
  try {
    // Find by ref, then verify phone matches (last-4 or exact)
    appt = await db.appointment.findUnique({ where: { ref } });
  } catch (err) {
    console.error("[lookup] DB error:", err);
    return NextResponse.json(
      { error: "Could not look up appointments right now. Please call us at +91 70910 90014." },
      { status: 503 }
    );
  }

  if (!appt) {
    // Don't record ref failure on "not found" — the ref might be genuinely
    // mistyped, and we don't want to lock out real patients. Just return 404.
    return NextResponse.json(
      { error: "No appointment found with that reference number. Please check and try again." },
      { status: 404 }
    );
  }

  // Strict phone verification: either exact 10-digit match OR last-4 suffix.
  const phoneMatches =
    appt.phone === phone ||
    (phone.length === 4 && appt.phone.endsWith(phone));
  if (!phoneMatches) {
    await recordRefFailure(ref);
    return NextResponse.json(
      { error: "The reference and phone number do not match. Please verify and try again." },
      { status: 403 }
    );
  }

  // Successful lookup — clear any prior failed attempts for this ref.
  await clearRefFailures(ref);

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
      department: appt.department,
      doctorLabel: doctorOrDeptLabel(appt.doctor, appt.department),
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

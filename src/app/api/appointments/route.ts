// POST /api/appointments — create a new booking (public).
// Validates input, enforces honeypot + shared per-IP rate limit, absorbs
// double-submits (idempotency key + request hash), persists to DB, and
// fires a Telegram notification (never allowed to fail the booking).

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureDbSchema } from "@/lib/db-ensure";
import {
  bookingSchema,
  generateUniqueRef,
  computeRequestHash,
} from "@/lib/appointments";
import {
  getClientIp,
  hashIp,
  checkBookingRateLimit,
} from "@/lib/request-security";
import { notifyNewBooking } from "@/lib/telegram";
import { todayISTString } from "@/lib/ist";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CONFIRM_MESSAGE =
  "Your appointment request has been received. Our team will call you shortly to confirm.";

function isUniqueViolation(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    (err as { code?: string }).code === "P2002"
  );
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  // Honeypot: if `website` is non-empty, silently accept but don't persist.
  // (Pretend success to not tip off bots.)
  const raw = (body ?? {}) as Record<string, unknown>;
  if (typeof raw.website === "string" && raw.website.trim() !== "") {
    return NextResponse.json(
      { ok: true, ref: "00000000", message: CONFIRM_MESSAGE },
      { status: 200 }
    );
  }

  // Shared (cross-instance) per-IP rate limit.
  const ip = getClientIp(req);
  const rl = await checkBookingRateLimit(ip);
  if (!rl.ok) {
    return NextResponse.json(
      {
        error: `Too many requests. Please try again in ${Math.ceil(
          rl.retryAfterSec / 60
        )} minute(s).`,
      },
      { status: 429 }
    );
  }

  // Validate
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return NextResponse.json(
      { error: firstError?.message ?? "Invalid input", field: firstError?.path?.[0] },
      { status: 400 }
    );
  }
  const d = parsed.data;

  // Double-check date isn't in the past (defense in depth)
  if (d.preferredDate < todayISTString()) {
    return NextResponse.json(
      { error: "Please choose today or a future date", field: "preferredDate" },
      { status: 400 }
    );
  }

  await ensureDbSchema();

  // Idempotency: a client retry (same key) returns the original booking
  // instead of creating a duplicate.
  const idempotencyKey =
    typeof raw.idempotencyKey === "string" && /^[\w-]{8,64}$/.test(raw.idempotencyKey)
      ? raw.idempotencyKey
      : null;
  if (idempotencyKey) {
    try {
      const existing = await db.appointment.findUnique({ where: { idempotencyKey } });
      if (existing) {
        return NextResponse.json(
          { ok: true, ref: existing.ref, message: CONFIRM_MESSAGE },
          { status: 200 }
        );
      }
    } catch (err) {
      console.error("[appointments/create] idempotency lookup failed:", err);
    }
  }

  // Duplicate guard (no key, e.g. double-tap): identical live booking exists →
  // return its ref instead of creating a second one.
  const requestHash = computeRequestHash(d);
  try {
    const dup = await db.appointment.findFirst({
      where: { requestHash, status: { in: ["pending", "confirmed"] } },
      orderBy: { createdAt: "desc" },
    });
    if (dup) {
      return NextResponse.json(
        {
          ok: true,
          ref: dup.ref,
          message: `This appointment is already booked — your reference is #${dup.ref}. Our team will call you to confirm.`,
        },
        { status: 200 }
      );
    }
  } catch (err) {
    console.error("[appointments/create] duplicate check failed:", err);
  }

  let created;
  try {
    const ref = await generateUniqueRef();
    created = await db.appointment.create({
      data: {
        ref,
        idempotencyKey,
        requestHash,
        name: d.name,
        phone: d.phone,
        age: d.age,
        department: d.department,
        preferredDate: d.preferredDate,
        timeSlot: d.timeSlot,
        note: d.note,
        status: "pending",
        ipHash: hashIp(ip),
      },
    });
  } catch (dbErr) {
    // Race on the idempotency key: another retry won — return its booking.
    if (isUniqueViolation(dbErr) && idempotencyKey) {
      const existing = await db.appointment
        .findUnique({ where: { idempotencyKey } })
        .catch(() => null);
      if (existing) {
        return NextResponse.json(
          { ok: true, ref: existing.ref, message: CONFIRM_MESSAGE },
          { status: 200 }
        );
      }
    }
    console.error("[appointments/create] DB error:", dbErr);
    return NextResponse.json(
      {
        ok: false,
        error:
          "We couldn't save your booking online right now. Please call us at +91 70910 90014 to book your appointment.",
      },
      { status: 503 }
    );
  }

  // Telegram notification — await with a short timeout so the message is
  // actually delivered on serverless (fire-and-forget can be killed before
  // completing on Vercel). Errors are swallowed so they never fail the booking.
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
      new Promise((resolve) => setTimeout(resolve, 5000)), // max 5s wait
    ]);
  } catch {
    /* swallow — notification failure must never fail the booking */
  }

  return NextResponse.json(
    { ok: true, ref: created.ref, message: CONFIRM_MESSAGE },
    { status: 201 }
  );
}

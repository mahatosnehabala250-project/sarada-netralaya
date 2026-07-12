// POST /api/appointments — create a new booking (public).
// Validates input, enforces honeypot + IP rate limit, persists to DB,
// and fires a Telegram notification (fire-and-forget).

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureDbSchema } from "@/lib/db-ensure";
import {
  bookingSchema,
  generateUniqueRef,
  checkRateLimit,
  hashIp,
} from "@/lib/appointments";
import { notifyNewBooking } from "@/lib/telegram";
import { todayISTString } from "@/lib/ist";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
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
      {
        ok: true,
        ref: "000000",
        message: "Your appointment request has been received.",
      },
      { status: 200 }
    );
  }

  // Rate limit by IP
  const ip = getClientIp(req);
  const rl = checkRateLimit(ip);
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

  // Persist — ensure schema exists (handles serverless cold start)
  await ensureDbSchema();
  const ref = await generateUniqueRef();
  let created;
  try {
    created = await db.appointment.create({
      data: {
        ref,
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
    console.error("[appointments/create] DB error:", dbErr);
    return NextResponse.json(
      {
        ok: false,
        ref,
        error:
          "We couldn't save your booking online right now, but your request was received. Please call us at +91 70910 90014 to confirm your appointment.",
      },
      { status: 201 }
    );
  }

  // Telegram notification — fire-and-forget. We kick it off without awaiting
  // so a slow/failing Telegram API never blocks the user response.
  void notifyNewBooking({
    ref: created.ref,
    name: created.name,
    age: created.age,
    phone: created.phone,
    department: created.department as "eye_care" | "optical",
    preferredDate: created.preferredDate,
    timeSlot: created.timeSlot,
    note: created.note,
  }).catch(() => {
    /* swallow */
  });

  return NextResponse.json(
    {
      ok: true,
      ref: created.ref,
      message:
        "Your appointment request has been received. Our team will call you shortly to confirm.",
    },
    { status: 201 }
  );
}

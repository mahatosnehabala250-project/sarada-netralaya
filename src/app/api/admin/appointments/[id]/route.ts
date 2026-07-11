// /api/admin/appointments/[id]
// GET    — fetch a single appointment (owner only)
// PATCH  — update fields (status, note, preferredDate, timeSlot, department) (owner only)
// DELETE — permanently delete an appointment (owner only)

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isOwnerAuthenticated } from "@/lib/auth";
import { STATUSES, DEPARTMENTS, TIME_SLOTS, type Status } from "@/lib/appointments";
import { todayISTString } from "@/lib/ist";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function ensureAuth() {
  const ok = await isOwnerAuthenticated();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authFail = await ensureAuth();
  if (authFail) return authFail;
  const { id } = await params;
  const item = await db.appointment.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ item });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authFail = await ensureAuth();
  if (authFail) return authFail;
  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Build update data, validating each provided field
  const data: Record<string, unknown> = {};

  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status as Status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    data.status = body.status;
  }

  if (body.note !== undefined) {
    if (typeof body.note !== "string" || body.note.length > 500) {
      return NextResponse.json({ error: "Note too long" }, { status: 400 });
    }
    data.note = body.note.trim() || null;
  }

  if (body.preferredDate !== undefined) {
    const d = String(body.preferredDate);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }
    if (d < todayISTString()) {
      return NextResponse.json({ error: "Date cannot be in the past" }, { status: 400 });
    }
    data.preferredDate = d;
  }

  if (body.timeSlot !== undefined) {
    if (!TIME_SLOTS.includes(body.timeSlot as never)) {
      return NextResponse.json({ error: "Invalid time slot" }, { status: 400 });
    }
    data.timeSlot = body.timeSlot;
  }

  if (body.department !== undefined) {
    if (!DEPARTMENTS.includes(body.department as never)) {
      return NextResponse.json({ error: "Invalid department" }, { status: 400 });
    }
    data.department = body.department;
  }

  if (body.name !== undefined) {
    const n = String(body.name).trim();
    if (n.length < 2 || n.length > 80) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }
    data.name = n;
  }

  if (body.phone !== undefined) {
    const p = String(body.phone).trim();
    if (!/^[6-9]\d{9}$/.test(p)) {
      return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
    }
    data.phone = p;
  }

  if (body.age !== undefined) {
    const a = body.age === null || body.age === "" ? null : Number(body.age);
    if (a !== null && (Number.isNaN(a) || a < 0 || a > 130)) {
      return NextResponse.json({ error: "Invalid age" }, { status: 400 });
    }
    data.age = a;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  try {
    const updated = await db.appointment.update({ where: { id }, data });
    return NextResponse.json({ ok: true, item: updated });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authFail = await ensureAuth();
  if (authFail) return authFail;
  const { id } = await params;
  try {
    await db.appointment.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

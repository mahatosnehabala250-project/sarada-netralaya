// GET   /api/admin/fees — read per-department consultation fees (owner only).
// PATCH /api/admin/fees — update the fees (owner only).

import { NextRequest, NextResponse } from "next/server";
import { isOwnerAuthenticated } from "@/lib/auth";
import { getFees, setFees } from "@/lib/settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isOwnerAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const fees = await getFees();
  return NextResponse.json({ fees });
}

export async function PATCH(req: NextRequest) {
  if (!(await isOwnerAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: { eye_care?: unknown; optical?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const eye = Number(body.eye_care);
  const opt = Number(body.optical);
  if (!Number.isFinite(eye) || !Number.isFinite(opt) || eye < 0 || opt < 0) {
    return NextResponse.json({ error: "Fees must be valid non-negative numbers" }, { status: 400 });
  }
  const fees = await setFees({ eye_care: eye, optical: opt });
  return NextResponse.json({ ok: true, fees });
}

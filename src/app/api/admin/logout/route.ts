// POST /api/admin/logout — clear owner session.

import { NextResponse } from "next/server";
import { clearOwnerSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  await clearOwnerSession();
  return NextResponse.json({ ok: true });
}

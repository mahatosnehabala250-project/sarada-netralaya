// POST /api/admin/login — owner login (sets session cookie).

import { NextRequest, NextResponse } from "next/server";
import { verifyOwnerCredentials, createOwnerSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const email = body.email?.trim() ?? "";
  const password = body.password ?? "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Please enter both email and password" },
      { status: 400 }
    );
  }

  if (!verifyOwnerCredentials(email, password)) {
    // Slight delay to blunt brute-force attempts
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  await createOwnerSession();
  return NextResponse.json({ ok: true });
}

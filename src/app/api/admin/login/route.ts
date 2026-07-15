// POST /api/admin/login — owner login (sets session cookie).
// Rate limited per-IP and per-email to blunt brute-force attempts.

import { NextRequest, NextResponse } from "next/server";
import { verifyOwnerCredentials, createOwnerSession } from "@/lib/auth";
import {
  getClientIp,
  checkLoginRateLimit,
  clearLoginFailures,
} from "@/lib/request-security";

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
  if (email.length > 254 || password.length > 200) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  const ip = getClientIp(req);
  const rl = await checkLoginRateLimit(ip, email);
  if (!rl.ok) {
    return NextResponse.json(
      {
        error: `Too many login attempts. Please try again in ${Math.ceil(
          rl.retryAfterSec / 60
        )} minute(s).`,
      },
      { status: 429 }
    );
  }

  if (!(await verifyOwnerCredentials(email, password))) {
    // Slight delay to blunt brute-force attempts
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  await clearLoginFailures(email);
  await createOwnerSession();
  return NextResponse.json({ ok: true });
}

// POST /api/admin/change-password — owner changes their password.
// Auth-gated. Validates the current password, persists the new bcrypt hash
// durably in the database, bumps the session version (logging out every
// other device), and re-issues this device's session so the owner stays in.

import { NextRequest, NextResponse } from "next/server";
import { isOwnerAuthenticated, createOwnerSession } from "@/lib/auth";
import { verifyPassword, setOwnerPassword } from "@/lib/owner-settings";
import {
  getClientIp,
  checkChangePasswordRateLimit,
} from "@/lib/request-security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const ok = await isOwnerAuthenticated();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Guards current-password brute force from a stolen session cookie.
  const rl = await checkChangePasswordRateLimit(getClientIp(req));
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

  let body: { currentPassword?: string; newPassword?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const currentPassword = body.currentPassword ?? "";
  const newPassword = body.newPassword ?? "";

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { error: "Please provide both current and new passwords" },
      { status: 400 }
    );
  }

  if (newPassword.length < 12) {
    return NextResponse.json(
      { error: "New password must be at least 12 characters" },
      { status: 400 }
    );
  }

  if (newPassword.length > 100) {
    return NextResponse.json(
      { error: "Password is too long (max 100 characters)" },
      { status: 400 }
    );
  }

  // Verify current password via bcrypt
  if (!(await verifyPassword(currentPassword))) {
    return NextResponse.json(
      { error: "Current password is incorrect" },
      { status: 403 }
    );
  }

  if (newPassword === currentPassword) {
    return NextResponse.json(
      { error: "New password must be different from the current one" },
      { status: 400 }
    );
  }

  try {
    const sessionVersion = await setOwnerPassword(newPassword);
    // Re-issue this device's session with the new version so the owner
    // stays logged in; sessions on other devices become invalid.
    await createOwnerSession(sessionVersion);
  } catch (error) {
    console.error("[change-password] failed:", error);
    return NextResponse.json(
      { error: "Failed to update password. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}

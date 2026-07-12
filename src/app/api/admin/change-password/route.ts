// POST /api/admin/change-password — owner changes their password.
// Auth-gated. Validates the current password, then sets the new one.

import { NextRequest, NextResponse } from "next/server";
import { isOwnerAuthenticated, verifyOwnerCredentials } from "@/lib/auth";
import { getOwnerEmail, setOwnerPassword, getOwnerPassword } from "@/lib/owner-settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const ok = await isOwnerAuthenticated();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

  if (newPassword.length < 6) {
    return NextResponse.json(
      { error: "New password must be at least 6 characters" },
      { status: 400 }
    );
  }

  if (newPassword.length > 100) {
    return NextResponse.json(
      { error: "Password is too long (max 100 characters)" },
      { status: 400 }
    );
  }

  // Verify current password
  if (!verifyOwnerCredentials(getOwnerEmail(), currentPassword)) {
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

  // Set new password
  const success = setOwnerPassword(newPassword);
  if (!success) {
    return NextResponse.json(
      { error: "Failed to update password" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}

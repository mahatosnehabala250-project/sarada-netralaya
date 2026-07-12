// Runtime owner settings store — allows changing the owner password at runtime
// without restarting the server. Persists to a JSON file in the db folder so
// changes survive server restarts in the sandbox.
//
// In production (Vercel/serverless), env vars (OWNER_EMAIL / OWNER_PASSWORD)
// are the source of truth and runtime changes are not persisted — set them
// via the Vercel dashboard instead.

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const SETTINGS_FILE = join(process.cwd(), "db", "owner-settings.json");

interface OwnerSettings {
  passwordOverride?: string;
  passwordChangedAt?: string;
}

let cache: OwnerSettings | null = null;

function load(): OwnerSettings {
  if (cache) return cache;
  try {
    if (existsSync(SETTINGS_FILE)) {
      const raw = readFileSync(SETTINGS_FILE, "utf8");
      cache = JSON.parse(raw);
    } else {
      cache = {};
    }
  } catch {
    cache = {};
  }
  return cache!;
}

function save(s: OwnerSettings) {
  cache = s;
  try {
    writeFileSync(SETTINGS_FILE, JSON.stringify(s, null, 2));
  } catch {
    // best-effort; in-memory still works
  }
}

/** Get the effective owner password (override if set, else env var). */
export function getOwnerPassword(): string {
  const s = load();
  if (s.passwordOverride) return s.passwordOverride;
  return process.env.OWNER_PASSWORD ?? "Sarada@2026";
}

/** Get the owner email (from env var — not changeable at runtime). */
export function getOwnerEmail(): string {
  return process.env.OWNER_EMAIL ?? "owner@saradanetralaya.in";
}

/** Set a new password override. Returns true on success. */
export function setOwnerPassword(newPassword: string): boolean {
  if (!newPassword || newPassword.length < 6) return false;
  save({
    passwordOverride: newPassword,
    passwordChangedAt: new Date().toISOString(),
  });
  return true;
}

/** Check if the password was changed at runtime (for display). */
export function getPasswordChangedAt(): string | null {
  return load().passwordChangedAt ?? null;
}

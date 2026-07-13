// Runtime owner settings store — allows changing the owner password at runtime.
// Passwords are stored as bcrypt hashes (never plaintext).
// Persists to a JSON file for local dev; in production (Vercel), env vars
// are the source of truth and runtime changes are not persisted.

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import bcrypt from "bcryptjs";

const SETTINGS_FILE = join(process.cwd(), "db", "owner-settings.json");

interface OwnerSettings {
  passwordHash?: string;
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
    // best-effort; in-memory still works (Vercel filesystem is read-only)
  }
}

/**
 * Get the effective owner password hash.
 * If a runtime override exists, use that; otherwise hash the env var password
 * (cached so we don't re-hash on every request).
 */
let envPasswordHash: string | null = null;

function getOwnerPasswordHash(): string {
  const s = load();
  if (s.passwordHash) return s.passwordHash;
  // Fall back to env var — hash it once and cache
  if (!envPasswordHash) {
    const plain = process.env.OWNER_PASSWORD ?? "Sarada@2026";
    envPasswordHash = bcrypt.hashSync(plain, 10);
  }
  return envPasswordHash;
}

/** Get the owner email (from env var — not changeable at runtime). */
export function getOwnerEmail(): string {
  return process.env.OWNER_EMAIL ?? "owner@saradanetralaya.in";
}

/**
 * Verify a plaintext password against the stored hash.
 * Uses bcrypt's constant-time comparison.
 */
export function verifyPassword(plain: string): boolean {
  try {
    return bcrypt.compareSync(plain, getOwnerPasswordHash());
  } catch {
    return false;
  }
}

/** Set a new password (hashes it before storing). */
export function setOwnerPassword(newPassword: string): boolean {
  if (!newPassword || newPassword.length < 6) return false;
  const hash = bcrypt.hashSync(newPassword, 10);
  save({
    passwordHash: hash,
    passwordChangedAt: new Date().toISOString(),
  });
  // Invalidate the env fallback cache
  envPasswordHash = null;
  return true;
}

/** Check if the password was changed at runtime (for display). */
export function getPasswordChangedAt(): string | null {
  return load().passwordChangedAt ?? null;
}

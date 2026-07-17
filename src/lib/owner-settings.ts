import "server-only";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

const OWNER_ID = "owner";
let envPasswordHash: string | null = null;

export function getOwnerEmail(): string {
  return process.env.OWNER_EMAIL ?? "owner@saradanetralaya.in";
}

function getEnvPasswordHash(): string {
  const plain = process.env.OWNER_PASSWORD;
  if (!plain) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("OWNER_PASSWORD must be set in production");
    }
    if (!envPasswordHash) envPasswordHash = bcrypt.hashSync("Sarada@2026", 12);
    return envPasswordHash;
  }
  if (!envPasswordHash) envPasswordHash = bcrypt.hashSync(plain, 12);
  return envPasswordHash;
}

async function getCredential() {
  return db.ownerCredential.findUnique({ where: { id: OWNER_ID } });
}

/** Verify against the durable override, or the deployment secret before first change. */
export async function verifyPassword(plain: string): Promise<boolean> {
  try {
    const credential = await getCredential();
    return bcrypt.compare(plain, credential?.passwordHash ?? getEnvPasswordHash());
  } catch (error) {
    console.error("[owner-settings/verify] failed", error);
    return false;
  }
}

export async function getSessionVersion(): Promise<number> {
  const credential = await getCredential();
  return credential?.sessionVersion ?? 0;
}

/** Persist a password hash and increment the global session version atomically. */
export async function setOwnerPassword(newPassword: string): Promise<number> {
  if (newPassword.length < 12 || newPassword.length > 100) {
    throw new Error("Password must be 12–100 characters");
  }
  const passwordHash = await bcrypt.hash(newPassword, 12);
  const credential = await db.ownerCredential.upsert({
    where: { id: OWNER_ID },
    create: { id: OWNER_ID, passwordHash, sessionVersion: 1 },
    update: { passwordHash, sessionVersion: { increment: 1 } },
  });
  envPasswordHash = null;
  return credential.sessionVersion;
}
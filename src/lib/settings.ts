// Editable clinic settings stored in the database (Setting table).
// Currently: per-department consultation fees used to estimate revenue.

import { db } from "@/lib/db";
import { CONSULTATION_FEE } from "@/lib/site-info";

const FEES_KEY = "consultation_fees";

export type DeptFees = { eye_care: number; optical: number };

const DEFAULT_FEES: DeptFees = { eye_care: CONSULTATION_FEE, optical: 300 };

function sanitize(n: unknown): number {
  const v = Math.round(Number(n));
  if (!Number.isFinite(v) || v < 0) return 0;
  return Math.min(v, 1_000_000); // sane upper bound
}

/** Read the per-department consultation fees (falls back to defaults). */
export async function getFees(): Promise<DeptFees> {
  try {
    const row = await db.setting.findUnique({ where: { key: FEES_KEY } });
    if (row) {
      const f = JSON.parse(row.value);
      return {
        eye_care: sanitize(f.eye_care ?? DEFAULT_FEES.eye_care),
        optical: sanitize(f.optical ?? DEFAULT_FEES.optical),
      };
    }
  } catch {
    /* table/row may not exist yet — return defaults */
  }
  return { ...DEFAULT_FEES };
}

/** Persist the per-department consultation fees. */
export async function setFees(fees: DeptFees): Promise<DeptFees> {
  const clean: DeptFees = { eye_care: sanitize(fees.eye_care), optical: sanitize(fees.optical) };
  const value = JSON.stringify(clean);
  await db.setting.upsert({
    where: { key: FEES_KEY },
    update: { value },
    create: { key: FEES_KEY, value },
  });
  return clean;
}

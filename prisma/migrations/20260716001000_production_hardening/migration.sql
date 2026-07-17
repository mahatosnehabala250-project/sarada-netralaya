-- Additive production hardening. Existing appointments are preserved.
ALTER TABLE "Appointment"
  ADD COLUMN "idempotencyKey" TEXT,
  ADD COLUMN "requestHash" TEXT,
  ADD COLUMN "feeCharged" INTEGER,
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "version" INTEGER NOT NULL DEFAULT 1;

CREATE UNIQUE INDEX "Appointment_idempotencyKey_key"
  ON "Appointment"("idempotencyKey");
CREATE INDEX "Appointment_preferredDate_createdAt_idx"
  ON "Appointment"("preferredDate", "createdAt");
CREATE INDEX "Appointment_status_preferredDate_idx"
  ON "Appointment"("status", "preferredDate");

CREATE TABLE "OwnerCredential" (
  "id" TEXT NOT NULL DEFAULT 'owner',
  "passwordHash" TEXT NOT NULL,
  "sessionVersion" INTEGER NOT NULL DEFAULT 1,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OwnerCredential_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RateLimitBucket" (
  "key" TEXT NOT NULL,
  "count" INTEGER NOT NULL,
  "resetAt" TIMESTAMP(3) NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RateLimitBucket_pkey" PRIMARY KEY ("key")
);
CREATE INDEX "RateLimitBucket_resetAt_idx" ON "RateLimitBucket"("resetAt");

-- Enforce invariants for all new/updated records without risking deployment
-- failure because of unknown legacy rows. Constraints can be validated later.
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_age_check"
  CHECK ("age" IS NULL OR ("age" BETWEEN 0 AND 130)) NOT VALID;
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_department_check"
  CHECK ("department" IN ('eye_care', 'optical')) NOT VALID;
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_status_check"
  CHECK ("status" IN ('pending', 'confirmed', 'done', 'cancelled')) NOT VALID;
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_date_check"
  CHECK ("preferredDate" ~ '^\d{4}-\d{2}-\d{2}$') NOT VALID;
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_fee_check"
  CHECK ("feeCharged" IS NULL OR "feeCharged" >= 0) NOT VALID;
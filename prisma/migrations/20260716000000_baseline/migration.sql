-- Baseline for databases created before Prisma migration history was introduced.
-- On the existing production database, mark this migration applied before deploy.
CREATE TABLE "Setting" (
  "key" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Setting_pkey" PRIMARY KEY ("key")
);

CREATE TABLE "Appointment" (
  "id" TEXT NOT NULL,
  "ref" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "age" INTEGER,
  "department" TEXT NOT NULL,
  "preferredDate" TEXT NOT NULL,
  "timeSlot" TEXT NOT NULL,
  "note" TEXT,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "ipHash" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Appointment_ref_key" ON "Appointment"("ref");
CREATE INDEX "Appointment_preferredDate_idx" ON "Appointment"("preferredDate");
CREATE INDEX "Appointment_status_idx" ON "Appointment"("status");
CREATE INDEX "Appointment_phone_idx" ON "Appointment"("phone");
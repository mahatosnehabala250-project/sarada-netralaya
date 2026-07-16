-- Additive: track which doctor the patient chose. Existing rows get NULL
-- (the app falls back to displaying the department for those).
ALTER TABLE "Appointment" ADD COLUMN "doctor" TEXT;

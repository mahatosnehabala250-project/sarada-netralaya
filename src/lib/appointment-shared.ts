// Browser-safe appointment constants and display metadata.
// Keep this module free of Prisma, Node APIs, and server-only imports.

export const DEPARTMENTS = ["eye_care", "optical"] as const;
export type Department = (typeof DEPARTMENTS)[number];

export const TIME_SLOTS = [
  "9:30 AM – 12:00 PM",
  "12:00 PM – 2:00 PM",
  "3:00 PM – 5:00 PM",
  "5:00 PM – 7:00 PM",
] as const;

export const STATUSES = ["pending", "confirmed", "done", "cancelled"] as const;
export type Status = (typeof STATUSES)[number];

export const STATUS_META: Record<
  Status,
  { label: string; emoji: string; badge: string; dot: string }
> = {
  pending: {
    label: "Pending",
    emoji: "⏳",
    badge: "bg-amber-100 text-amber-800 border-amber-200",
    dot: "bg-amber-500",
  },
  confirmed: {
    label: "Confirmed",
    emoji: "📌",
    badge: "bg-sky-100 text-sky-800 border-sky-200",
    dot: "bg-sky-500",
  },

  done: {
    label: "Done",
    emoji: "✅",
    badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
    dot: "bg-emerald-500",
  },
  cancelled: {
    label: "Cancelled",
    emoji: "✕",
    badge: "bg-rose-100 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
  },
};

export const DEPT_LABEL: Record<Department, string> = {
  eye_care: "Eye Care",
  optical: "Optical",
};

// Who a patient sees. Drives the booking form's doctor picker; the
// department (used for fees/filters/reporting) is derived from this.
export const DOCTOR_IDS = ["nitin-dhira", "nitish-bharadwaj", "optical"] as const;
export type DoctorId = (typeof DOCTOR_IDS)[number];

export const DOCTOR_CHOICES: { id: DoctorId; name: string; role: string; department: Department }[] = [
  { id: "nitin-dhira", name: "Dr. Nitin G Dhira", role: "Consultant Eye Surgeon & Founder", department: "eye_care" },
  { id: "nitish-bharadwaj", name: "Dr. Nitish R Bharadwaj", role: "Consultant Eye Surgeon", department: "eye_care" },
  { id: "optical", name: "Optical Services", role: "Spectacles, contact lenses & eye testing", department: "optical" },
];

export const DOCTOR_LABEL: Record<DoctorId, string> = {
  "nitin-dhira": "Dr. Nitin G Dhira",
  "nitish-bharadwaj": "Dr. Nitish R Bharadwaj",
  optical: "Optical Services",
};

export function departmentForDoctor(id: DoctorId): Department {
  return DOCTOR_CHOICES.find((d) => d.id === id)?.department ?? "eye_care";
}

/** Display label for an appointment's doctor, falling back to its department
 * for legacy rows recorded before doctor selection existed. */
export function doctorOrDeptLabel(doctor: string | null | undefined, department: string): string {
  if (doctor && doctor in DOCTOR_LABEL) return DOCTOR_LABEL[doctor as DoctorId];
  return DEPT_LABEL[department as Department] ?? department;
}
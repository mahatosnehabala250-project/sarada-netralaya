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
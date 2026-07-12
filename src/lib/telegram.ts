// Telegram Bot notification integration.
// Fire-and-forget: a failed notification must never fail a booking.

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export interface BookingNotifyInput {
  ref: string;
  name: string;
  age?: number | null;
  phone: string;
  department: "eye_care" | "optical";
  preferredDate: string; // yyyy-MM-dd
  timeSlot: string;
  note?: string | null;
}

const DEPT_LABEL: Record<string, string> = {
  eye_care: "Eye Care — Dr. Nitin Dhira",
  optical: "Optical Services",
};

/** Format a 10-digit Indian mobile as "+91 98765 43210" for display. */
function formatPhone(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.length === 10 && /^[6-9]/.test(d)) return `+91 ${d.slice(0, 5)} ${d.slice(5)}`;
  return phone;
}

/** Format the Telegram message body (HTML for bold labels). */
export function formatBookingMessage(b: BookingNotifyInput): string {
  const agePart = b.age ? ` (${b.age} yrs)` : "";
  const dept = DEPT_LABEL[b.department] ?? b.department;
  const dateLabel = formatDateForMessage(b.preferredDate);
  const note = b.note?.trim() ? `\n📝 <i>"${escapeHtml(b.note.trim())}"</i>` : "";
  const phone = formatPhone(b.phone);
  return (
    `🔔 <b>New Appointment — Sarada Netralaya</b>\n\n` +
    `👤 <b>${escapeHtml(b.name)}${agePart}</b>\n` +
    `📞 <a href="tel:${phone.replace(/\s/g, "")}">${phone}</a>\n` +
    `👁️ ${dept}\n` +
    `📅 ${dateLabel}, ${b.timeSlot}${note}\n\n` +
    `Ref: <code>#${b.ref}</code>`
  );
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function formatDateForMessage(dateStr: string): string {
  // dateStr is yyyy-MM-dd (IST calendar date). Format to "15 July 2026".
  const [y, m, d] = dateStr.split("-").map(Number);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  if (!y || !m || !d) return dateStr;
  return `${d} ${months[m - 1]} ${y}`;
}

/**
 * Send a Telegram message. Fire-and-forget — logs errors but never throws.
 * Returns true on success, false on failure (so callers may optionally log).
 */
export async function sendTelegramMessage(text: string): Promise<boolean> {
  if (!BOT_TOKEN || !CHAT_ID) {
    // Not configured — silently skip (e.g. local dev). Not an error.
    if (process.env.NODE_ENV !== "production") {
      console.log("[telegram] not configured, skipping message");
    }
    return false;
  }
  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      // Don't let this hang the request too long.
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[telegram] sendMessage failed:", res.status, body);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[telegram] sendMessage error:", err);
    return false;
  }
}

/** Convenience: format + send a booking notification, fire-and-forget. */
export async function notifyNewBooking(b: BookingNotifyInput): Promise<void> {
  const msg = formatBookingMessage(b);
  // Intentionally not awaited by callers in the request path; but if awaited,
  // we swallow all errors.
  try {
    await sendTelegramMessage(msg);
  } catch {
    /* no-op */
  }
}

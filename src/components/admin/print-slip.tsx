"use client";

import { useEffect, useRef } from "react";
import { Eye } from "lucide-react";
import { DEPT_LABEL, STATUS_META, type Department, type Status } from "@/lib/appointments";
import { formatDateLong } from "@/lib/ist";
import { SITE, ADDRESS, PHONES, DOCTOR } from "@/lib/site-info";

export type Appt = {
  id: string; ref: string; name: string; phone: string; age: number | null;
  department: string; preferredDate: string; timeSlot: string;
  note: string | null; status: string; createdAt: string;
};

/**
 * Opens a print-friendly appointment slip in a new window and triggers print.
 * Uses a hidden iframe approach to avoid navigating away from the dashboard.
 */
export function printAppointmentSlip(a: Appt) {
  const st = a.status as Status;
  const meta = STATUS_META[st];
  const dept = DEPT_LABEL[a.department as Department] ?? a.department;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Appointment Slip #${a.ref} — Sarada Netralaya</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #0f2f3a; background: #f0f9fb; padding: 24px;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  .slip {
    max-width: 480px; margin: 0 auto; background: #fff;
    border-radius: 16px; overflow: hidden;
    box-shadow: 0 4px 24px rgba(8,79,103,0.12);
    border: 1px solid #e2e8f0;
  }
  .header {
    background: linear-gradient(135deg, #0b6e8f, #084f67);
    color: #fff; padding: 20px 24px; display: flex; align-items: center; gap: 12px;
  }
  .logo {
    width: 44px; height: 44px; border-radius: 12px;
    background: rgba(255,255,255,0.15); display: flex; align-items: center;
    justify-content: center; font-size: 24px;
  }
  .header h1 { font-size: 18px; font-weight: 700; }
  .header p { font-size: 11px; opacity: 0.8; margin-top: 2px; }
  .ref-band {
    background: #f0f9fb; padding: 12px 24px; display: flex;
    justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0;
  }
  .ref-band .label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #0b6e8f; font-weight: 700; }
  .ref-band .ref { font-size: 20px; font-weight: 800; color: #084f67; font-family: monospace; }
  .ref-band .status {
    font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 999px;
    border: 1px solid;
  }
  .body { padding: 20px 24px; }
  .patient-name { font-size: 22px; font-weight: 700; color: #084f67; }
  .patient-sub { font-size: 13px; color: #64748b; margin-top: 2px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 18px; }
  .field { background: #f8fafc; border-radius: 10px; padding: 10px 12px; border: 1px solid #e2e8f0; }
  .field .k { font-size: 9px; text-transform: uppercase; letter-spacing: 0.08em; color: #0b6e8f; font-weight: 700; }
  .field .v { font-size: 13px; font-weight: 600; color: #0f2f3a; margin-top: 3px; }
  .note { margin-top: 14px; background: #f0f9fb; border-left: 3px solid #0b6e8f; padding: 10px 12px; border-radius: 6px; }
  .note .k { font-size: 9px; text-transform: uppercase; letter-spacing: 0.08em; color: #0b6e8f; font-weight: 700; }
  .note .v { font-size: 12px; color: #334155; margin-top: 3px; line-height: 1.5; }
  .footer {
    margin-top: 18px; padding-top: 14px; border-top: 1px dashed #cbd5e1;
    font-size: 10px; color: #64748b; line-height: 1.6;
  }
  .footer strong { color: #084f67; }
  .footer .addr { margin-top: 6px; }
  .instructions {
    margin-top: 12px; background: #fffbeb; border: 1px solid #fde68a;
    border-radius: 8px; padding: 10px 12px; font-size: 11px; color: #92400e; line-height: 1.5;
  }
  @media print {
    body { background: #fff; padding: 0; }
    .slip { box-shadow: none; border: none; max-width: 100%; }
    @page { margin: 12mm; }
  }
</style>
</head>
<body>
  <div class="slip">
    <div class="header">
      <div class="logo">👁</div>
      <div>
        <h1>Sarada Netralaya</h1>
        <p>${SITE.tagline}</p>
      </div>
    </div>
    <div class="ref-band">
      <div>
        <div class="label">Booking Reference</div>
        <div class="ref">#${a.ref}</div>
      </div>
      <div class="status" style="background:${st === 'confirmed' ? '#e0f2fe' : st === 'done' ? '#d1fae5' : st === 'cancelled' ? '#ffe4e6' : '#fef3c7'}; color:${st === 'confirmed' ? '#075985' : st === 'done' ? '#065f46' : st === 'cancelled' ? '#9f1239' : '#92400e'}; border-color:${st === 'confirmed' ? '#bae6fd' : st === 'done' ? '#a7f3d0' : st === 'cancelled' ? '#fecdd3' : '#fde68a'}">
        ${meta.emoji} ${meta.label}
      </div>
    </div>
    <div class="body">
      <div class="patient-name">${escapeHtml(a.name)}</div>
      <div class="patient-sub">${a.age != null ? `${a.age} years old` : "Age not specified"} · ${escapeHtml(a.phone)}</div>
      <div class="grid">
        <div class="field">
          <div class="k">Department</div>
          <div class="v">${dept}</div>
        </div>
        <div class="field">
          <div class="k">Consultant</div>
          <div class="v">${DOCTOR.name}</div>
        </div>
        <div class="field">
          <div class="k">Preferred Date</div>
          <div class="v">${formatDateLong(a.preferredDate)}</div>
        </div>
        <div class="field">
          <div class="k">Time Slot</div>
          <div class="v">${escapeHtml(a.timeSlot)}</div>
        </div>
      </div>
      ${a.note ? `<div class="note"><div class="k">Patient's Note</div><div class="v">${escapeHtml(a.note)}</div></div>` : ""}
      <div class="instructions">
        <strong>Please bring:</strong> a valid photo ID, any previous eye prescription or old spectacles, and this reference number. For dilated retina/glaucoma checks, please arrange a driver — do not drive yourself back.
      </div>
      <div class="footer">
        <strong>${SITE.name}</strong> · ${SITE.tagline}<br>
        <div class="addr">${ADDRESS.line1}, ${ADDRESS.line2}, ${ADDRESS.line3}, ${ADDRESS.city} – ${ADDRESS.pincode}<br>
        📞 ${PHONES.primary} / ${PHONES.secondary} · ✉ ${"saradanetralayajsr@gmail.com"}<br>
        🕐 Mon–Sat 10:00 AM – 7:30 PM · Sunday Closed<br>
        <span style="display:block;margin-top:6px;font-size:9px;color:#94a3b8">Slip generated on ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST · This is a computer-generated slip and does not require a signature.</span>
      </div>
    </div>
  </div>
  <script>
    window.onload = function() { window.print(); };
  </script>
</body>
</html>`;

  // Use a hidden iframe to print without navigating away
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);
  const doc = iframe.contentWindow?.document;
  if (doc) {
    doc.open();
    doc.write(html);
    doc.close();
  }
  // Clean up the iframe after print dialog
  setTimeout(() => {
    if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
  }, 60000);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

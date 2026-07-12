"use client";

import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { PHONES } from "@/lib/site-info";

export function WhatsAppFab() {
  const [show, setShow] = useState(false);
  const [tooltip, setTooltip] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 1500);
    const tt = setTimeout(() => setTooltip(true), 3000);
    const tth = setTimeout(() => setTooltip(false), 9000);
    return () => { clearTimeout(t); clearTimeout(tt); clearTimeout(tth); };
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      {tooltip && (
        <div className="relative max-w-[200px] rounded-2xl rounded-br-sm bg-white shadow-xl border border-[#0a3d4a]/10 px-4 py-2.5 animate-[reveal-up_0.3s_ease-out]">
          <button onClick={() => setTooltip(false)} className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#0a3d4a] text-white" aria-label="Close">
            <X className="h-3 w-3" />
          </button>
          <p className="text-xs font-semibold text-[#0a3d4a]">Need help? 👋</p>
          <p className="text-[11px] text-[#0a3d4a]/55 mt-0.5">Chat with us on WhatsApp.</p>
        </div>
      )}
      <a
        href={`https://wa.me/${PHONES.whatsapp}?text=${encodeURIComponent("Hello Sarada Netralaya, I would like to enquire about an appointment.")}`}
        target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-emerald-900/30 hover:scale-110 transition-transform"
      >
        <MessageCircle className="h-7 w-7 text-white" fill="currentColor" />
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 group-hover:opacity-0" />
      </a>
    </div>
  );
}

import { isOwnerAuthenticated } from "@/lib/auth";
import { AdminLogin } from "@/components/admin/login";
import { AppointmentsPanel } from "@/components/admin/appointments-panel";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata = {
  title: "Appointments — Sarada Netralaya",
  robots: { index: false, follow: false },
};

export default async function AppointmentsPage() {
  const authed = await isOwnerAuthenticated();
  if (!authed) return <AdminLogin />;
  return <AppointmentsPanel />;
}

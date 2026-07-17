import { isOwnerAuthenticated } from "@/lib/auth";
import { AdminLogin } from "@/components/admin/login";
import { AdminAppointments } from "@/components/admin/appointments-page";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata = { robots: { index: false, follow: false } };

export default async function AppointmentsPage() {
  const authed = await isOwnerAuthenticated();
  if (!authed) return <AdminLogin />;
  return <AdminAppointments />;
}

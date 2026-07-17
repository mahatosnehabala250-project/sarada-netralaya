import { isOwnerAuthenticated } from "@/lib/auth";
import { AdminLogin } from "@/components/admin/login";
import { AdminPatients } from "@/components/admin/patients-page";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata = { robots: { index: false, follow: false } };

export default async function PatientsPage() {
  const authed = await isOwnerAuthenticated();
  if (!authed) return <AdminLogin />;
  return <AdminPatients />;
}

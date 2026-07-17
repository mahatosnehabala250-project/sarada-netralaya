import { isOwnerAuthenticated } from "@/lib/auth";
import { AdminLogin } from "@/components/admin/login";
import { PatientsPanel } from "@/components/admin/patients-panel";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata = {
  title: "Patients — Sarada Netralaya",
  robots: { index: false, follow: false },
};

export default async function PatientsPage() {
  const authed = await isOwnerAuthenticated();
  if (!authed) return <AdminLogin />;
  return <PatientsPanel />;
}

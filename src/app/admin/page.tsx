import { isOwnerAuthenticated } from "@/lib/auth";
import { AdminLogin } from "@/components/admin/login";
import { DashboardContent } from "@/components/admin/dashboard-content";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata = {
  title: "Dashboard — Sarada Netralaya",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const authed = await isOwnerAuthenticated();
  if (!authed) return <AdminLogin />;
  return <DashboardContent />;
}

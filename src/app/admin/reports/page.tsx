import { isOwnerAuthenticated } from "@/lib/auth";
import { AdminLogin } from "@/components/admin/login";
import { AdminReports } from "@/components/admin/reports-page";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata = { robots: { index: false, follow: false } };

export default async function ReportsPage() {
  const authed = await isOwnerAuthenticated();
  if (!authed) return <AdminLogin />;
  return <AdminReports />;
}

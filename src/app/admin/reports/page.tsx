import { isOwnerAuthenticated } from "@/lib/auth";
import { AdminLogin } from "@/components/admin/login";
import { ReportsPanel } from "@/components/admin/reports-panel";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata = {
  title: "Reports — Sarada Netralaya",
  robots: { index: false, follow: false },
};

export default async function ReportsPage() {
  const authed = await isOwnerAuthenticated();
  if (!authed) return <AdminLogin />;
  return <ReportsPanel />;
}

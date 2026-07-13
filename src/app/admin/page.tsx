import { isOwnerAuthenticated } from "@/lib/auth";
import { AdminLogin } from "@/components/admin/login";
import { AdminDashboard } from "@/components/admin/dashboard";

// SSR: decide which view to render based on session cookie.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Never index the admin surface — defense-in-depth alongside robots.txt
// and the X-Robots-Tag header set in middleware.
export const metadata = {
  title: "Owner Login — Sarada Netralaya",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const authed = await isOwnerAuthenticated();
  return authed ? <AdminDashboard /> : <AdminLogin />;
}

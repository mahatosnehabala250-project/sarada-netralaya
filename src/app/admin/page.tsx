import { isOwnerAuthenticated } from "@/lib/auth";
import { AdminLogin } from "@/components/admin/login";
import { AdminDashboard } from "@/components/admin/dashboard";

// SSR: decide which view to render based on session cookie.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminPage() {
  const authed = await isOwnerAuthenticated();
  return authed ? <AdminDashboard /> : <AdminLogin />;
}

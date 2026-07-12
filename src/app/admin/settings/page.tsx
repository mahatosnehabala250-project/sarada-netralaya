import { isOwnerAuthenticated } from "@/lib/auth";
import { AdminDashboard } from "@/components/admin/dashboard";
import { AdminSettings } from "@/components/admin/settings";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminSettingsPage() {
  const authed = await isOwnerAuthenticated();
  if (!authed) {
    // not logged in — redirect to admin (shows login)
    return <AdminSettings />;
  }
  return <AdminSettings />;
}

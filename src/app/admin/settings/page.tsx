import { isOwnerAuthenticated } from "@/lib/auth";
import { AdminLogin } from "@/components/admin/login";
import { AdminSettings } from "@/components/admin/settings";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminSettingsPage() {
  const authed = await isOwnerAuthenticated();
  if (!authed) {
    // Not logged in — show the login screen (same as /admin)
    return <AdminLogin />;
  }
  return <AdminSettings />;
}

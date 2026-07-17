import { isOwnerAuthenticated } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isOwnerAuthenticated();
  if (!authed) return <>{children}</>;
  return <AdminShell>{children}</AdminShell>;
}

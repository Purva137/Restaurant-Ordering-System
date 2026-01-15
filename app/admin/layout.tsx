export const dynamic = "force-dynamic";

import AdminShell from "@/app/components/admin/AdminShell";
import { requireRolePage } from "@/app/lib/auth";

export default async function Layout({ children }: { children: React.ReactNode }) {
  await requireRolePage(["ADMIN", "STAFF"]);
  return <AdminShell>{children}</AdminShell>;
}

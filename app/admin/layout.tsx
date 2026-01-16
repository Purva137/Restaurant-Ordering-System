export const dynamic = "force-dynamic";

import AdminShell from "@/app/components/admin/AdminShell";
import { requireRole } from "@/app/lib/auth";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
  try {
    await requireRole(["ADMIN", "STAFF"]);
  } catch (error: any) {
    const message = String(error?.message || error || "");
    if (message === "UNAUTHENTICATED" || message === "FORBIDDEN") {
      redirect("/admin/login");
    }
    redirect("/admin/login");
  }

  return <AdminShell>{children}</AdminShell>;
}

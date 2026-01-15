import { requireRolePage } from "@/app/lib/auth";

export default async function KitchenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRolePage(["ADMIN", "STAFF"]);
  return <>{children}</>;
}


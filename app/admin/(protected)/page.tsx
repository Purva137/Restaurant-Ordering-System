import AdminOrderFilters from "@/app/components/admin/AdminOrderFilters";
import AdminOrdersTable from "@/app/components/admin/AdminOrdersTable";
import AdminAnalytics from "@/app/components/admin/AdminAnalytics";
import { requireRole } from "@/app/lib/auth";

export default async function AdminPage() {
  await requireRole(["ADMIN"]);
  return (
    <div className="p-6 text-white">
      <h1 className="text-xl font-semibold mb-4">Admin Dashboard</h1>
      <AdminOrderFilters />
      <AdminOrdersTable />
      <AdminAnalytics />
    </div>
  );
}

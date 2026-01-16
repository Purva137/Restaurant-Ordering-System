"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type Order = {
  id: string;
  tableNumber: string | null;
  status: string;
  itemsCount: number;
  totalAmount: number;
  createdAt: string;
};

function AdminOrdersTableInner() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") ?? "";

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
  
    fetch(`/api/admin/orders${status ? `?status=${status}` : ""}`)
      .then(async (r) => {
        if (!r.ok) return [];
        return r.json();
      })
      .then(setOrders)
      .finally(() => setLoading(false));
      }, [status]);  

  if (loading)
    return <p className="mt-6 text-white/60">Loading orders…</p>;

  if (!orders.length)
    return <p className="mt-6 text-white/60">No orders found</p>;

  return (
    <div className="mt-6 overflow-hidden rounded-lg border border-white/10">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-white/5 text-white/70">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Order ID</th>
            <th className="px-4 py-3 text-center font-medium">Table</th>
            <th className="px-4 py-3 text-center font-medium">Items</th>
            <th className="px-4 py-3 text-center font-medium">Status</th>
            <th className="px-4 py-3 text-right font-medium">Created</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr
              key={o.id}
              className="border-t border-white/10 hover:bg-white/5 transition"
            >
              <td className="px-4 py-3 font-mono">
                {o.id.slice(0, 6)}
              </td>
              <td className="px-4 py-3 text-center">
                {o.tableNumber ?? "-"}
              </td>
              <td className="px-4 py-3 text-center">
                {o.itemsCount}
              </td>
              <td className="px-4 py-3 text-center font-semibold">
                {o.status}
              </td>
              <td className="px-4 py-3 text-right text-white/60">
                {new Date(o.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminOrdersTable() {
  return (
    <Suspense fallback={<p className="mt-6 text-white/60">Loading orders…</p>}>
      <AdminOrdersTableInner />
    </Suspense>
  );
}

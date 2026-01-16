"use client";

import { useEffect, useState } from "react";

type Order = {
  id: string;
  tableNumber: string;
  status: string;
};

type StaffCall = {
  id: string;
  status: string;
  table: {
    code: string;
  };
  createdAt: string;
};

export default function StaffPage() {
  const [readyOrders, setReadyOrders] = useState<Order[]>([]);
  const [calls, setCalls] = useState<StaffCall[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [ordersRes, callsRes] = await Promise.all([
      fetch("/api/admin/orders?status=READY"),
      fetch("/api/staff-calls?status=OPEN"),
    ]);

    const ordersData = ordersRes.ok ? await ordersRes.json() : [];
    const callsData = callsRes.ok ? await callsRes.json() : [];

    setReadyOrders(ordersData);
    setCalls(callsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 5000);
    return () => clearInterval(id);
  }, []);

  const markDelivered = async (orderId: string) => {
    await fetch(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "COMPLETED" }),
    });
    fetchData();
  };

  const markHandled = async (callId: string) => {
    await fetch(`/api/staff-calls/${callId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "HANDLED" }),
    });
    fetchData();
  };

  if (loading) {
    return <p className="p-6 text-white/60">Loading staff console…</p>;
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-xl font-semibold mb-6">Staff Console</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-lg border border-white/10 p-4">
          <h2 className="text-sm font-semibold text-white/80 mb-4">
            Ready Orders
          </h2>
          {!readyOrders.length && (
            <p className="text-sm text-white/50">No ready orders</p>
          )}
          <div className="space-y-3">
            {readyOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-md bg-white/5 px-3 py-2 text-sm"
              >
                <div>
                  <div className="font-medium">Table {order.tableNumber}</div>
                  <div className="text-white/50">{order.id.slice(0, 6)}</div>
                </div>
                <button
                  onClick={() => markDelivered(order.id)}
                  className="rounded-md bg-emerald-600 px-3 py-1 text-xs font-medium"
                >
                  Delivered
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-white/10 p-4">
          <h2 className="text-sm font-semibold text-white/80 mb-4">
            Call Staff Notifications
          </h2>
          {!calls.length && (
            <p className="text-sm text-white/50">No active calls</p>
          )}
          <div className="space-y-3">
            {calls.map((call) => (
              <div
                key={call.id}
                className="flex items-center justify-between rounded-md bg-white/5 px-3 py-2 text-sm"
              >
                <div>
                  <div className="font-medium">Table {call.table.code}</div>
                  <div className="text-white/50">
                    {new Date(call.createdAt).toLocaleTimeString()}
                  </div>
                </div>
                <button
                  onClick={() => markHandled(call.id)}
                  className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium"
                >
                  Handled
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}


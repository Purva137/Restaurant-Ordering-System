"use client";

import { useEffect, useState } from "react";

type AnalyticsPayload = {
  orders: { today: number; month: number; year: number };
  revenue: { today: number; month: number; year: number };
  reservations: { today: number; month: number; year: number };
  reservationsCancelled: { today: number; month: number; year: number };
  reservationsByMonth: { month: string; count: number }[];
  bda: {
    topItems: { name: string; quantity: number }[];
    peakHours: { hour: number; count: number }[];
    tableUtilizationRate: number;
    avgPrepTimeMs: number;
    avgStaffResponseMs: number;
    reservationRatio: number;
  };
};

const formatMinutes = (ms: number) =>
  ms > 0 ? `${Math.round(ms / 60000)} min` : "—";

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsPayload | null>(null);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then(async (res) => (res.ok ? res.json() : null))
      .then(setData)
      .catch(() => setData(null));
  }, []);

  if (!data) {
    return <p className="mt-8 text-white/60">Loading analytics…</p>;
  }

  return (
    <div className="mt-10 space-y-6">
      <h2 className="text-lg font-semibold">Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-white/10 p-4">
          <p className="text-xs text-white/60">Orders</p>
          <p className="text-lg font-semibold">{data.orders.today} today</p>
          <p className="text-xs text-white/50">
            {data.orders.month} this month • {data.orders.year} this year
          </p>
        </div>
        <div className="rounded-lg border border-white/10 p-4">
          <p className="text-xs text-white/60">Revenue</p>
          <p className="text-lg font-semibold">₹{data.revenue.today}</p>
          <p className="text-xs text-white/50">
            ₹{data.revenue.month} this month • ₹{data.revenue.year} this year
          </p>
        </div>
        <div className="rounded-lg border border-white/10 p-4">
          <p className="text-xs text-white/60">Reservations</p>
          <p className="text-lg font-semibold">{data.reservations.today} today</p>
          <p className="text-xs text-white/50">
            {data.reservationsCancelled.today} cancelled today
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-lg border border-white/10 p-4">
          <h3 className="text-sm font-semibold text-white/80 mb-3">
            Top Items (Monthly)
          </h3>
          <div className="space-y-2 text-sm">
            {data.bda.topItems.length === 0 && (
              <p className="text-white/50">No data yet</p>
            )}
            {data.bda.topItems.map((item) => (
              <div key={item.name} className="flex justify-between">
                <span>{item.name}</span>
                <span className="text-white/60">{item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-white/10 p-4">
          <h3 className="text-sm font-semibold text-white/80 mb-3">
            Operational KPIs
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-white/50">Avg prep time</p>
              <p className="font-semibold">{formatMinutes(data.bda.avgPrepTimeMs)}</p>
            </div>
            <div>
              <p className="text-white/50">Avg staff response</p>
              <p className="font-semibold">
                {formatMinutes(data.bda.avgStaffResponseMs)}
              </p>
            </div>
            <div>
              <p className="text-white/50">Table utilization</p>
              <p className="font-semibold">
                {Math.round(data.bda.tableUtilizationRate * 100)}%
              </p>
            </div>
            <div>
              <p className="text-white/50">Reservation ratio</p>
              <p className="font-semibold">
                {Math.round(data.bda.reservationRatio * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-white/10 p-4">
        <h3 className="text-sm font-semibold text-white/80 mb-3">
          Reservations by Month (Year-to-date)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          {data.reservationsByMonth.map((entry) => (
            <div
              key={entry.month}
              className="rounded-md bg-white/5 px-3 py-2 flex items-center justify-between"
            >
              <span className="text-white/60">{entry.month}</span>
              <span className="font-semibold">{entry.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-white/10 p-4">
        <h3 className="text-sm font-semibold text-white/80 mb-3">
          Peak Ordering Hours (Today)
        </h3>
        <div className="grid grid-cols-6 gap-2 text-xs">
          {data.bda.peakHours.map((slot) => (
            <div
              key={slot.hour}
              className="rounded bg-white/5 px-2 py-2 text-center"
            >
              <div className="text-white/60">{slot.hour}:00</div>
              <div className="font-semibold">{slot.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


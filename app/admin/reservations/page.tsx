"use client";

import { useEffect, useState } from "react";

type Reservation = {
  id: string;
  name: string;
  phone: string;
  partySize: number;
  dateTime: string;
  status: "CONFIRMED" | "CANCELLED" | "NO_SHOW";
};

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReservations = async () => {
    setLoading(true);
    const res = await fetch("/api/reservations");
    const data = res.ok ? await res.json() : [];
    setReservations(data);
    setLoading(false);
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const updateStatus = async (id: string, status: Reservation["status"]) => {
    const res = await fetch(`/api/reservations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      alert(error.error ?? "Failed to update reservation");
      return;
    }
    loadReservations();
  };

  if (loading) {
    return <p className="p-6 text-white/60">Loading reservations…</p>;
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-xl font-semibold mb-6">Reservations</h1>

      {!reservations.length && (
        <p className="text-sm text-white/60">No reservations found.</p>
      )}

      <div className="space-y-3">
        {reservations.map((reservation) => (
          <div
            key={reservation.id}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-lg border border-white/10 p-4"
          >
            <div>
              <p className="font-medium">{reservation.name}</p>
              <p className="text-sm text-white/60">{reservation.phone}</p>
              <p className="text-sm text-white/60">
                {new Date(reservation.dateTime).toLocaleString()} •{" "}
                {reservation.partySize} guests
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
                {reservation.status}
              </span>
              <button
                onClick={() => updateStatus(reservation.id, "CONFIRMED")}
                className="rounded-md bg-emerald-600 px-3 py-1 text-xs"
              >
                Confirm
              </button>
              <button
                onClick={() => updateStatus(reservation.id, "CANCELLED")}
                className="rounded-md bg-red-600 px-3 py-1 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => updateStatus(reservation.id, "NO_SHOW")}
                className="rounded-md bg-yellow-600 px-3 py-1 text-xs"
              >
                No-show
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


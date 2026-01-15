"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ReservationDraft = {
  date: string;
  time: string;
  guests: number;
};

export default function ReservationConfirmationPage() {
  const router = useRouter();
  const [reservation, setReservation] = useState<ReservationDraft | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("reservationDraft");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as ReservationDraft;
      setReservation(parsed);
    } catch {
      setReservation(null);
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#2b0f14] text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-8">

        {/* Check icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-red-500/40">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Text */}
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold">
            Reservation Confirmed
          </h1>
          <p className="text-white/60 text-sm leading-relaxed">
            Your table has been successfully reserved.
            We look forward to welcoming you at Noboru.
          </p>
        </div>

        {/* Reservation summary (fake data for now) */}
        <div className="rounded-xl bg-black/30 px-6 py-4 text-sm text-white/80 space-y-2">
          <div className="flex justify-between">
            <span>Date</span>
            <span>{reservation?.date ?? "—"}</span>
          </div>
          <div className="flex justify-between">
            <span>Time</span>
            <span>{reservation?.time ?? "—"}</span>
          </div>
          <div className="flex justify-between">
            <span>Guests</span>
            <span>{reservation?.guests ?? 0} People</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => router.push("/")}
            className="w-full rounded-xl bg-[#8b2d3b] py-3 text-sm font-medium hover:bg-[#a23a4a] transition"
          >
            Back to Home
          </button>

          <button
            onClick={() => router.push("/menu")}
            className="w-full rounded-xl border border-white/20 py-3 text-sm text-white/80 hover:bg-white/10 transition"
          >
            View Menu
          </button>
        </div>

        {/* Footer note */}
        <p className="text-xs text-white/40 pt-4">
          Please arrive 10 minutes early. Seating is held for 15 minutes.
        </p>
      </div>
    </main>
  );
}

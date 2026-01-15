"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function ReservePage() {
  const router = useRouter();

  const months = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return [0, 1, 2].map((offset) => {
      const monthDate = new Date(start.getFullYear(), start.getMonth() + offset, 1);
      return {
        label: monthDate.toLocaleString("en-US", { month: "long", year: "numeric" }),
        year: monthDate.getFullYear(),
        month: monthDate.getMonth(),
      };
    });
  }, []);

  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  });
  const [selectedTime, setSelectedTime] = useState("6:30 PM");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(2);
  const [notes, setNotes] = useState("");

  const times = ["5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM"];

  const handleReserve = async () => {
    if (!name || !phone) return;

    const date = selectedDate.toISOString().slice(0, 10);
    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        date,
        time: selectedTime,
        partySize: guests,
        notes: notes.trim(),
      }),
    });

    if (!res.ok) {
      alert("Failed to create reservation");
      return;
    }

    const reservation = await res.json();
    localStorage.setItem(
      "reservationDraft",
      JSON.stringify({
        date,
        time: selectedTime,
        guests,
        name,
        phone,
        id: reservation.id,
      })
    );

    router.push("/reserve/confirmation");
  };

  return (
    <main className="relative min-h-screen grid grid-cols-1 md:grid-cols-[40%_60%] bg-[#2b0f14] text-white overflow-hidden pt-8 md:pt-0">
      <button 
        onClick={() => router.back()}
        className="text-sm text-white/60 hover:text-white transition absolute top-10 left-6 z-10"
      >
        ← Back
      </button>

      {/* LEFT — ATMOSPHERE */}
      <div className="relative flex items-center justify-center pt-20 md:pt-24 pb-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a070b] via-[#2b0f14] to-[#1a070b] animate-[pulse_6s_ease-in-out_infinite]" />

        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[60%] w-px bg-gradient-to-b from-transparent via-red-900/60 to-transparent" />

        <div className="relative px-10 text-left max-w-sm">
          <p className="text-xs tracking-widest text-red-500 mb-3">
            THE EXPERIENCE
          </p>
          <h2 className="text-3xl font-semibold leading-tight">
            Calm. Intentional.
            <br />
            Unrushed.
          </h2>
          <p className="mt-4 text-sm text-white/60 leading-relaxed">
            Noboru reservations are designed for unhurried dining —
            precision in timing, respect for experience.
          </p>
        </div>
      </div>

      {/* RIGHT — FORM */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl rounded-2xl bg-black/25 backdrop-blur-xl p-8 shadow-xl">
          <h1 className="text-2xl font-semibold mb-1">
            Reserve Your Table
          </h1>
          <p className="text-sm text-white/60 mb-6">
            Please select your preferred date and time
          </p>

          {/* DATE */}
          <div className="mb-6 rounded-xl bg-black/30 p-4">
            <p className="text-sm mb-3">Select Date</p>
            <div className="flex gap-2 mb-4 text-xs">
              {months.map((month, index) => (
                <button
                  key={month.label}
                  onClick={() => {
                    setSelectedMonthIndex(index);
                    const firstAvailable = new Date(
                      month.year,
                      month.month,
                      1
                    );
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    while (firstAvailable < today) {
                      firstAvailable.setDate(firstAvailable.getDate() + 1);
                    }
                    setSelectedDate(firstAvailable);
                  }}
                  className={`rounded-md px-3 py-2 transition ${
                    selectedMonthIndex === index
                      ? "bg-red-600"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  {month.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2 text-xs">
              {(() => {
                const month = months[selectedMonthIndex];
                const daysInMonth = new Date(month.year, month.month + 1, 0).getDate();
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                return Array.from({ length: daysInMonth }, (_, idx) => {
                  const dateOption = new Date(month.year, month.month, idx + 1);
                  const isActive =
                    selectedDate.toDateString() === dateOption.toDateString();
                  const isPast = dateOption < today;

                  return (
                    <button
                      key={dateOption.toISOString()}
                      onClick={() => setSelectedDate(dateOption)}
                      disabled={isPast}
                      className={`rounded-md py-2 transition ${
                        isActive
                          ? "bg-red-600"
                          : "bg-white/5 hover:bg-white/10"
                      } ${isPast ? "opacity-40 cursor-not-allowed" : ""}`}
                    >
                      <div className="text-sm font-medium">{idx + 1}</div>
                    </button>
                  );
                });
              })()}
            </div>
          </div>

          {/* TIME */}
          <div className="mb-6 rounded-xl bg-black/30 p-4">
            <p className="text-sm mb-3">Available Times</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {times.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`rounded-md py-2 transition ${
                    selectedTime === time
                      ? "bg-red-600"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* DETAILS */}
          <div className="space-y-3 mb-6">
            <input
              placeholder="Alex Kim"
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg bg-black/40 px-4 py-2 text-sm outline-none"
            />
            <input
              placeholder="9876543210"
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg bg-black/40 px-4 py-2 text-sm outline-none"
            />
            <input
              type="number"
              min={1}
              max={20}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value || 1))}
              placeholder="Number of People"
              className="w-full rounded-lg bg-black/40 px-4 py-2 text-sm outline-none"
            />
            <textarea
              placeholder="Special requests (optional)"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-lg bg-black/40 px-4 py-2 text-sm outline-none resize-none"
            />
          </div>

          <button
            onClick={handleReserve}
            className="w-full rounded-xl bg-[#8b2d3b] py-3 text-sm font-medium hover:bg-[#a23a4a] transition"
          >
            Reserve Table
          </button>
        </div>
      </div>
    </main>
  );
}

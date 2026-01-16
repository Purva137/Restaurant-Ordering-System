"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Props = {
  className?: string;
  label?: string;
};

function CallStaffButtonInner({ className, label = "Call Staff" }: Props) {
  const searchParams = useSearchParams();
  const [tableCode, setTableCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fromQuery = searchParams.get("table");
    const fromStorage = localStorage.getItem("tableCode");
    setTableCode(fromQuery ?? fromStorage);
  }, [searchParams]);

  const handleCall = async () => {
    if (!tableCode) {
      alert("Table not detected. Please scan your table QR code.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/staff-calls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tableCode }),
    });
    setLoading(false);

    if (!res.ok) {
      alert("Failed to notify staff.");
      return;
    }

    alert("Staff notified. Someone will assist you shortly.");
  };

  return (
    <button
      onClick={handleCall}
      className={
        className ??
        "rounded-full border border-white/20 px-4 py-2 text-xs text-white/80 hover:bg-white/10 transition"
      }
      disabled={loading}
    >
      {loading ? "Calling…" : label}
    </button>
  );
}

export default function CallStaffButton(props: Props) {
  return (
    <Suspense
      fallback={
        <button
          className={
            props.className ??
            "rounded-full border border-white/20 px-4 py-2 text-xs text-white/80 hover:bg-white/10 transition"
          }
          disabled
        >
          {props.label ?? "Call Staff"}
        </button>
      }
    >
      <CallStaffButtonInner {...props} />
    </Suspense>
  );
}


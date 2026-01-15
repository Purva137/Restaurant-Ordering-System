"use client";

import { useSearchParams, useRouter } from "next/navigation";

const STATUSES = ["ALL", "RECEIVED", "PREPARING", "READY", "COMPLETED", "CANCELLED"] as const;

export default function AdminOrderFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeStatus = searchParams.get("status") ?? "ALL";

  const setStatus = (status: string) => {
    if (status === "ALL") {
      router.push("/admin");
    } else {
      router.push(`/admin?status=${status}`);
    }
  };

  return (
    <div className="flex gap-2 mt-4">
      {STATUSES.map((status) => {
        const isActive =
          status === "ALL"
            ? !searchParams.get("status")
            : activeStatus === status;

        return (
          <button
            key={status}
            onClick={() => setStatus(status)}
            className={`px-4 py-1.5 rounded-md text-sm border transition
              ${
                isActive
                  ? "bg-white text-black border-white"
                  : "border-white/20 text-white/70 hover:bg-white/10"
              }`}
          >
            {status}
          </button>
        );
      })}
    </div>
  );
}

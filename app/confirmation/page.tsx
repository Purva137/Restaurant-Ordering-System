"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CallStaffButton from "@/app/components/CallStaffButton";

/* ---------------- TYPES ---------------- */

type OrderDraft = {
  tableNumber: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  subtotal?: number;
  tax?: number;
  tipAmount?: number;
  total?: number;
  paymentMethod: string;
  customer: {
    name: string;
    phone: string;
  };
  note: string;
  idempotencyKey?: string;
};

/* ---------------- PAGE ---------------- */

export default function ConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<OrderDraft | null>(null);

  /* ---------------- LOAD ORDER ---------------- */

  useEffect(() => {
    const raw = localStorage.getItem("orderDraft");

    if (!raw) {
      router.replace("/menu");
      return;
    }

    try {
      const parsed = JSON.parse(raw) as OrderDraft;

      // basic safety check
      if (!parsed.items || parsed.items.length === 0) {
        router.replace("/menu");
        return;
      }

      setOrder(parsed);
    } catch {
      router.replace("/menu");
    }
  }, [router]);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) return;
    const pendingPayment = localStorage.getItem("pendingPayment") === "true";
    if (!pendingPayment) return;

    const finalizeOrder = async () => {
      const verifyRes = await fetch(
        `/api/payments/stripe/verify?session_id=${sessionId}`
      );
      const verifyData = verifyRes.ok ? await verifyRes.json() : null;
      if (!verifyData?.paid) return;

      const raw = localStorage.getItem("orderDraft");
      if (!raw) return;

      const parsed = JSON.parse(raw) as OrderDraft;
      const payload = {
        tableCode: parsed.tableNumber,
        customerName: parsed.customer.name,
        customerNote: parsed.note,
        paymentMethod: parsed.paymentMethod.toUpperCase(),
        paymentReference: sessionId,
        taxAmount: parsed.tax,
        tipAmount: parsed.tipAmount,
        items: parsed.items.map((item) => ({
          menuItemId: item.id,
          quantity: item.quantity,
        })),
        idempotencyKey: parsed.idempotencyKey,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        localStorage.setItem("pendingPayment", "false");
      }
    };

    finalizeOrder().catch(() => {});
  }, [searchParams]);

  if (!order) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading confirmation…
      </main>
    );
  }

  /* ---------------- FINAL TOTAL (SAFE) ---------------- */

  const itemsTotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const finalTotal =
    typeof order.total === "number" && order.total > 0
      ? order.total
      : itemsTotal + (order.tax ?? 0) + (order.tipAmount ?? 0);

  /* ---------------- UI ---------------- */

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">
      <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-xl mb-6">
        ✓
      </div>

      <h1 className="text-2xl font-semibold mb-2">
        Kitchen has received your order
      </h1>

      <p className="text-white/60 mb-6">
        Sit back and relax. We'll bring it right over.
      </p>

      <div className="flex gap-4 mb-6">
        <div className="px-4 py-2 rounded bg-white/10">
          Table {order.tableNumber}
        </div>
        <div className="px-4 py-2 rounded bg-red-600">
          15 min
        </div>
      </div>

      <div className="w-72 rounded-xl bg-white/5 border border-white/10 p-4 mb-6">
        <div className="text-sm text-white/60 mb-2">Order Summary</div>

        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between text-sm mb-1"
          >
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}

        <div className="border-t border-white/10 mt-3 pt-3 flex justify-between font-semibold">
          <span>Total</span>
          <span>₹{finalTotal}</span>
        </div>
      </div>

      <div className="mb-4">
        <CallStaffButton />
      </div>

      <button
        onClick={() => {
          // optional cleanup
          localStorage.removeItem("orderDraft");
          const tableCode = localStorage.getItem("tableCode");
          router.push(tableCode ? `/menu?table=${tableCode}` : "/menu");
        }}
        className="px-6 py-2 rounded border border-red-600 text-red-500 hover:bg-red-600 hover:text-white transition"
      >
        + Order More
      </button>
    </main>
  );
}

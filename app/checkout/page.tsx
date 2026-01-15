"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

/* ---------------- TYPES ---------------- */

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type OrderDraft = {
  tableNumber: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  tipPercent: number;
  tipAmount: number;
  total: number;
  paymentMethod: "card" | "wallet" | "counter";
  paymentReference?: string;
  idempotencyKey?: string;
  customer: {
    name: string;
    phone: string;
  };
  note: string;
};

/* ---------------- PAGE ---------------- */

export default function CheckoutPage() {
  const router = useRouter();

  /* ---------------- STATE ---------------- */

  const [draft, setDraft] = useState<OrderDraft | null>(null);
  const [payment, setPayment] = useState<"card" | "wallet" | "counter">("card");
  const [tip, setTip] = useState(15);
  const [showCustomTip, setShowCustomTip] = useState(false);
  const [customTipValue, setCustomTipValue] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [walletId, setWalletId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  const isNameValid = name.trim().length > 0;
  const isPhoneValid = /^\d{10}$/.test(phone.trim());
  const isPaymentValid =
    payment === "counter" ||
    (payment === "card" &&
      cardName.trim().length > 0 &&
      cardNumber.trim().length >= 12 &&
      cardExpiry.trim().length >= 4 &&
      cardCvv.trim().length >= 3) ||
    (payment === "wallet" && walletId.trim().length > 0);

  const isFormValid = isNameValid && isPhoneValid && isPaymentValid;

  const loadRazorpay = () =>
    new Promise<boolean>((resolve) => {
      if (typeof window === "undefined") return resolve(false);
      if ((window as any).Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  /* ---------------- LOAD DRAFT ---------------- */

  useEffect(() => {
    const raw = localStorage.getItem("orderDraft");
    if (!raw) {
      router.push("/menu");
      return;
    }

    const parsed: OrderDraft = JSON.parse(raw);
    setDraft(parsed);
    setPayment(parsed.paymentMethod);
    setTip(parsed.tipPercent);
    setName(parsed.customer.name);
    setPhone(parsed.customer.phone);
    setNote(parsed.note);
  }, [router]);

  /* ---------------- RECALCULATE TOTALS ---------------- */

  useEffect(() => {
    if (!draft) return;

    const resolvedTipPercent = showCustomTip
      ? Number(customTipValue || 0)
      : tip;
    const tipAmount = Math.round((draft.subtotal * resolvedTipPercent) / 100);
    const total = draft.subtotal + draft.tax + tipAmount;
    const paymentReference =
      payment === "wallet"
        ? walletId.trim()
        : payment === "card"
          ? `${cardName.trim()} • ${cardNumber.slice(-4)}`
          : null;

    const updated: OrderDraft = {
      ...draft,
      tipPercent: resolvedTipPercent,
      tipAmount,
      total,
      paymentMethod: payment,
      customer: { name, phone },
      note,
      paymentReference,
    };

    const hasChanged =
      draft.tipPercent !== updated.tipPercent ||
      draft.tipAmount !== updated.tipAmount ||
      draft.total !== updated.total ||
      draft.paymentMethod !== updated.paymentMethod ||
      draft.note !== updated.note ||
      draft.customer.name !== updated.customer.name ||
      draft.customer.phone !== updated.customer.phone ||
      draft.paymentReference !== updated.paymentReference;

    if (hasChanged) {
      setDraft(updated);
      localStorage.setItem("orderDraft", JSON.stringify(updated));
    }
  }, [
    draft,
    tip,
    payment,
    name,
    phone,
    note,
    showCustomTip,
    customTipValue,
    cardName,
    cardNumber,
    cardExpiry,
    cardCvv,
    walletId,
  ]);

  if (!draft) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading checkout…
      </main>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-[#140709] to-black text-white px-10 py-10">
      {/* Header */}
      <header className="flex items-center justify-between mb-10">
        <button onClick={() => router.back()}>← Back</button>
        <h1 className="text-xl tracking-widest font-semibold">NOBORU</h1>
        <div className="rounded-full bg-white/5 px-4 py-1.5 text-sm">
          Order for Table {draft.tableNumber}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT */}
        <section className="lg:col-span-2 space-y-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-medium mb-4">Contact Info</h3>
            <div className="grid grid-cols-2 gap-6">
              <input
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`bg-transparent border-b py-2 outline-none ${
                  isNameValid ? "border-white/20" : "border-red-500"
                }`}
              />
              <input
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`bg-transparent border-b py-2 outline-none ${
                  isPhoneValid ? "border-white/20" : "border-red-500"
                }`}
              />
            </div>
          </div>

          {/* TIP */}
          <div className="rounded-xl bg-white/5 p-5">
            <h3 className="text-sm font-semibold mb-4">Tip</h3>
            <div className="grid grid-cols-5 gap-2 text-xs">
              {[10, 15, 20].map((value) => (
                <button
                  key={value}
                  onClick={() => {
                    setShowCustomTip(false);
                    setTip(value);
                  }}
                  className={`rounded-md py-2 transition ${
                    !showCustomTip && tip === value
                      ? "bg-red-600"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  {value}%
                </button>
              ))}
              <button
                onClick={() => {
                  setShowCustomTip(false);
                  setTip(0);
                }}
                className={`rounded-md py-2 transition ${
                  !showCustomTip && tip === 0
                    ? "bg-red-600"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                None
              </button>
              <button
                onClick={() => {
                  setShowCustomTip(true);
                }}
                className={`rounded-md py-2 transition ${
                  showCustomTip
                    ? "bg-red-600"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                Other
              </button>
            </div>
            {showCustomTip && (
              <input
                value={customTipValue}
                onChange={(e) => setCustomTipValue(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter tip %"
                className="mt-4 w-full rounded-lg bg-black/40 px-4 py-2 text-sm outline-none"
              />
            )}
          </div>

          {/* PAYMENT */}
          <div className="rounded-xl bg-white/5 p-5">
            <h3 className="text-sm font-semibold mb-4">Payment Method</h3>
            <div className="grid grid-cols-3 gap-2 text-xs mb-4">
              {[
                { key: "card", label: "Card" },
                { key: "wallet", label: "UPI/Wallet" },
                { key: "counter", label: "At Counter" },
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => setPayment(option.key as any)}
                  className={`rounded-md py-2 transition ${
                    payment === option.key
                      ? "bg-red-600"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {payment === "card" && (
              <div className="space-y-3 text-sm">
                <input
                  placeholder="Cardholder Name"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full rounded-lg bg-black/40 px-4 py-2 outline-none"
                />
                <input
                  placeholder="Card Number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full rounded-lg bg-black/40 px-4 py-2 outline-none"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full rounded-lg bg-black/40 px-4 py-2 outline-none"
                  />
                  <input
                    placeholder="CVV"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full rounded-lg bg-black/40 px-4 py-2 outline-none"
                  />
                </div>
              </div>
            )}

            {payment === "wallet" && (
              <input
                placeholder="UPI ID / Wallet Number"
                value={walletId}
                onChange={(e) => setWalletId(e.target.value)}
                className="w-full rounded-lg bg-black/40 px-4 py-2 text-sm outline-none"
              />
            )}

            {payment === "counter" && (
              <p className="text-sm text-white/60">
                Pay the bill at the counter after dining.
              </p>
            )}
          </div>
        </section>

        {/* RIGHT */}
        <aside className="bg-white/5 p-6 rounded-xl">
          <h3 className="text-sm font-semibold mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm mb-4">
            {draft.items.map((item) => (
              <div key={item.id} className="flex justify-between text-white/70">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{formatINR(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-sm border-t border-white/10 pt-4">
            <div className="flex justify-between">
              <span className="text-white/60">Subtotal</span>
              <span>{formatINR(draft.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Tax</span>
              <span>{formatINR(draft.tax)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Tip</span>
              <span>{formatINR(draft.tipAmount)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatINR(draft.total)}</span>
            </div>
          </div>

          <button
            disabled={!isFormValid}
            className={`w-full mt-6 py-3 rounded transition
              ${isFormValid ? "bg-red-600 hover:bg-red-700" : "bg-white/10 cursor-not-allowed"}
            `}
            onClick={async () => {
              if (!draft) return;

              const idempotencyKey =
                draft.idempotencyKey ?? `${draft.tableNumber}-${Date.now()}`;

              const payload = {
                tableCode: draft.tableNumber,
                customerName: draft.customer.name,
                customerNote: note,
                paymentMethod: draft.paymentMethod.toUpperCase(),
                paymentReference: draft.paymentReference,
                taxAmount: draft.tax,
                tipAmount: draft.tipAmount,
                items: draft.items.map((item) => ({
                  menuItemId: item.id,
                  quantity: item.quantity,
                })),
                idempotencyKey,
              };

              if (draft.paymentMethod === "counter") {
                const res = await fetch("/api/orders", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload),
                });

                if (!res.ok) {
                  const error = await res.json().catch(() => ({}));
                  alert(error.error ?? "Order failed to place");
                  return;
                }

                router.push("/confirmation");
                return;
              }

              const razorpayReady = await loadRazorpay();
              if (!razorpayReady) {
                alert("Failed to load Razorpay");
                return;
              }

              const amount =
                (draft.subtotal + draft.tax + draft.tipAmount) * 100;

              const orderRes = await fetch("/api/payments/razorpay/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  amount,
                  currency: "INR",
                  receipt: idempotencyKey,
                  notes: {
                    tableCode: draft.tableNumber,
                    customerName: draft.customer.name,
                    paymentMethod: draft.paymentMethod.toUpperCase(),
                  },
                }),
              });

              if (!orderRes.ok) {
                const error = await orderRes.json().catch(() => ({}));
                alert(error.error ?? "Failed to start payment");
                return;
              }

              const orderData = await orderRes.json();

              const options = {
                key: orderData.key,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Noboru",
                description: "Table order payment",
                order_id: orderData.id,
                prefill: {
                  name: draft.customer.name,
                  contact: draft.customer.phone,
                },
                method:
                  draft.paymentMethod === "wallet"
                    ? { upi: true }
                    : { card: true },
                handler: async (response: any) => {
                  const verifyRes = await fetch(
                    "/api/payments/razorpay/verify",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        orderId: response.razorpay_order_id,
                        paymentId: response.razorpay_payment_id,
                        signature: response.razorpay_signature,
                      }),
                    }
                  );

                  const verifyData = await verifyRes.json().catch(() => ({}));
                  if (!verifyRes.ok || !verifyData.verified) {
                    alert("Payment verification failed");
                    return;
                  }

                  const res = await fetch("/api/orders", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      ...payload,
                      paymentReference: response.razorpay_payment_id,
                      idempotencyKey,
                    }),
                  });

                  if (!res.ok) {
                    const error = await res.json().catch(() => ({}));
                    alert(error.error ?? "Order failed");
                    return;
                  }

                  router.push("/confirmation");
                },
                theme: {
                  color: "#b91c1c",
                },
              };

              const razorpay = new (window as any).Razorpay(options);
              razorpay.open();
            }}                  
          >
            Confirm Order
          </button>
        </aside>
      </div>
    </main>
  );
}

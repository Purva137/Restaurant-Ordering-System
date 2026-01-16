"use client";

import { useEffect, useRef, useState } from "react";

type OrderItem = {
  quantity: number;
  menuItemName: string;
};

type Order = {
  id: string;
  tableNumber: string | null;
  status: "RECEIVED" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED";
  items?: OrderItem[];
};

const STATUS_COLORS: Record<string, string> = {
  RECEIVED: "#2563eb",
  PREPARING: "#f59e0b",
  READY: "#16a34a",
  COMPLETED: "#4b5563",
  CANCELLED: "#991b1b",
};

const POLL_INTERVAL = 3000;

export default function KitchenPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const lastDataRef = useRef<string>("");
  const soundRef = useRef<HTMLAudioElement | null>(null);

  // 🔁 Polling
  useEffect(() => {
    // Set up the beep sound once on mount
    soundRef.current = new Audio("/beep.mp3");
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders/live");
    
        if (!res.ok) {
          setOrders([]);
          return;
        }
    
        const data = await res.json();
    
        if (!Array.isArray(data)) {
          setOrders([]);
          return;
        }
    
        const serialized = JSON.stringify(data);
    
        if (serialized !== lastDataRef.current) {
          if (data.length > orders.length && soundRef.current) {
            soundRef.current.play().catch(() => {});
          }
          lastDataRef.current = serialized;
          setOrders(data);
        }
      } catch (err) {
        console.error("Failed to fetch live orders", err);
        setOrders([]);
      }
    };    

    fetchOrders();
    const id = setInterval(fetchOrders, POLL_INTERVAL);
    return () => clearInterval(id);
  }, []);

  const nextStatus = (status: Order["status"]) => {
    if (status === "RECEIVED") return "PREPARING";
    if (status === "PREPARING") return "READY";
    if (status === "READY") return "COMPLETED";
    return null;
  };  

  const updateStatus = async (orderId: string, status: Order["status"]) => {
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      console.error("Failed to update status", error);
      alert(error.error ?? "Failed to update status");
      return;
    }

    // Force refresh immediately
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };  

  return (
    <div style={{ padding: 24, minHeight: "100vh", backgroundColor: "#0a0a0a", color: "#fff" }}>
      <h1 style={{ fontSize: 28, marginBottom: 24, fontWeight: 600 }}>🍳 Kitchen Board</h1>

      {orders.length === 0 && (
        <p style={{ opacity: 0.6, fontSize: 16 }}>No live orders</p>
      )}

      <div style={{ display: "grid", gap: 32 }}>
      {["CANCELLED", "COMPLETED", "READY", "PREPARING", "RECEIVED"].map((status) => {
  const group = orders.filter((o) => o.status === status);
  if (group.length === 0) return null;

  return (
    <div key={status}>
      <h2 style={{ 
        color: STATUS_COLORS[status], 
        marginTop: 0,
        marginBottom: 16,
        fontSize: 20,
        fontWeight: 600,
      }}>
        {status} ({group.length})
      </h2>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
        {group.map((order) => {
          const next = nextStatus(order.status);

          return (
            <div
              key={order.id}
              style={{
                border: `2px solid ${STATUS_COLORS[order.status]}`,
                borderRadius: 12,
                padding: 20,
                backgroundColor: "#1a1a1a",
                transition: "all 0.2s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 4px 12px ${STATUS_COLORS[order.status]}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ marginBottom: 12 }}>
                <strong style={{ fontSize: 14, opacity: 0.9 }}>Table:</strong>{" "}
                <span style={{ fontSize: 16, fontWeight: 600 }}>{order.tableNumber ?? "—"}</span>
              </div>
              
              <div style={{ marginBottom: 16 }}>
                <strong style={{ fontSize: 14, opacity: 0.9 }}>Status:</strong>{" "}
                <span style={{ fontSize: 14 }}>{order.status}</span>
              </div>

              {order.items && order.items.length > 0 ? (
                <ul style={{ marginBottom: 16, paddingLeft: 20, listStyleType: "disc" }}>
                  {order.items.map((item, i) => (
                    <li key={i} style={{ marginBottom: 6, fontSize: 14 }}>
                      {item.menuItemName} × {item.quantity}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ opacity: 0.6 }}>No items</p>
              )}

              {next && (
                <button
                  onClick={() => updateStatus(order.id, next)}
                  style={{
                    marginTop: 8,
                    background: STATUS_COLORS[next],
                    color: "white",
                    padding: "10px 16px",
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 500,
                    transition: "opacity 0.2s ease",
                    width: "100%",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.9";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  Mark as {next}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
})}
</div>
</div>
    );
  }
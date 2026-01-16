"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import CallStaffButton from "@/app/components/CallStaffButton";

/* ---------------- TYPES ---------------- */

type MenuItem = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  isAvailable: boolean;
  category:
    | "SOUP"
    | "APPETIZER"
    | "SALADS"
    | "RAMEN_AND_NOODLES"
    | "BURGERS_AND_SANDWICHES"
    | "SUSHI"
    | "MINI_SUSHI"
    | "DESSERT"
    | "BEVERAGE"
    | "DONBURI"
    | "BENTO"
    | "SPECIAL_DISHES"
    | "FISH"
    | "KOREAN_DELIGHTS"
    | "COFFEE"
    | "MATCHA"
    | "COOKIES"
    | "BREADS"
    | "PAIRINGS"
    | null;
};

/* ---------------- TABLE CODE ---------------- */

function TableCodeHydrator({
  onTableCode,
}: {
  onTableCode: (code: string | null) => void;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    onTableCode(searchParams.get("table"));
  }, [searchParams, onTableCode]);

  return null;
}

/* ---------------- PAGE ---------------- */

export default function MenuPage() {
  const router = useRouter();
  const [tableCode, setTableCode] = useState<string | null>(null);
  const handleTableCode = useCallback((code: string | null) => {
    setTableCode(code);
  }, []);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState<
    | "ALL"
    | "SOUP"
    | "APPETIZER"
    | "SALADS"
    | "RAMEN_AND_NOODLES"
    | "BURGERS_AND_SANDWICHES"
    | "SUSHI"
    | "MINI_SUSHI"
    | "DESSERT"
    | "BEVERAGE"
    | "DONBURI"
    | "BENTO"
    | "SPECIAL_DISHES"
    | "FISH"
    | "KOREAN_DELIGHTS"
    | "COFFEE"
    | "MATCHA"
    | "COOKIES"
    | "BREADS"
    | "PAIRINGS"
  >("ALL");

  /* ---------------- LOAD CART (NEW) ---------------- */

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch {
        setCart({});
      }
    }
  }, []);

  useEffect(() => {
    if (tableCode) {
      localStorage.setItem("tableCode", tableCode);
    }
  }, [tableCode]);

  /* ---------------- SAVE CART (NEW) ---------------- */

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  /* ---------------- FETCH MENU ---------------- */

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch("/api/menu");
        const data = await res.json();

        if (Array.isArray(data)) {
          setMenuItems(data);
        } else {
          console.error("Menu API did not return an array:", data);
          setMenuItems([]);
        }
      } catch (error) {
        console.error("Failed to load menu", error);
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMenu();
  }, []);

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading menu…
      </main>
    );
  }

  /* ---------------- GROUP BY CATEGORY ---------------- */

  const groupedMenu = menuItems.reduce<Record<string, MenuItem[]>>(
    (acc, item) => {
      const key = item.category ?? "UNCATEGORIZED";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    },
    {}
  );

  const CATEGORY_LABELS: Record<string, string> = {
    SOUP: "Soup",
    APPETIZER: "Appetizer",
    SALADS: "Salads",
    RAMEN_AND_NOODLES: "Ramen & Noodles",
    BURGERS_AND_SANDWICHES: "Burgers & Sandwiches",
    SUSHI: "Sushi",
    MINI_SUSHI: "Mini Sushi",
    DESSERT: "Dessert",
    BEVERAGE: "Beverage",
    DONBURI: "Donburi",
    BENTO: "Bento",
    SPECIAL_DISHES: "Special Dishes",
    FISH: "Fish",
    KOREAN_DELIGHTS: "Korean Delights",
    COFFEE: "Coffee",
    MATCHA: "Matcha",
    COOKIES: "Cookies",
    BREADS: "Breads",
    PAIRINGS: "Pairings",
  };

  /* ---------------- CART LOGIC ---------------- */

  const addItem = (id: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeItem = (id: string) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (updated[id] > 1) updated[id]--;
      else delete updated[id];
      return updated;
    });
  };

  const cartItems = Object.entries(cart).map(([id, quantity]) => {
    const item = menuItems.find((i) => i.id === id)!;
    return { ...item, quantity };
  });

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  /* ---------------- UI ---------------- */

  return (
    <main className="min-h-screen bg-black text-white pb-40">
      <Suspense fallback={null}>
        <TableCodeHydrator onTableCode={handleTableCode} />
      </Suspense>
      {/* HEADER */}
      <header className="sticky top-0 z-20 bg-black/70 backdrop-blur-md px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => router.push("/")}
          className="text-sm text-white/60 hover:text-white"
        >
          ← Back
        </button>
        <h1 className="text-xl font-semibold">Menu</h1>
        <div className="ml-auto">
          <CallStaffButton />
        </div>
      </header>

      {/* CATEGORY FILTERS */}
      <div className="px-6 pt-6 flex gap-4 text-sm text-white/60 overflow-x-auto">
        {[
          { key: "ALL", label: "All" },
          { key: "SOUP", label: "Soup" },
          { key: "APPETIZER", label: "Appetizer" },
          { key: "SALADS", label: "Salads" },
          { key: "RAMEN_AND_NOODLES", label: "Ramen & Noodles" },
          { key: "BURGERS_AND_SANDWICHES", label: "Burgers & Sandwiches" },
          { key: "SUSHI", label: "Sushi" },
          { key: "MINI_SUSHI", label: "Mini Sushi" },
          { key: "DESSERT", label: "Dessert" },
          { key: "BEVERAGE", label: "Beverage" },
          { key: "DONBURI", label: "Donburi" },
          { key: "BENTO", label: "Bento" },
          { key: "SPECIAL_DISHES", label: "Special Dishes" },
          { key: "FISH", label: "Fish" },
          { key: "KOREAN_DELIGHTS", label: "Korean Delights" },
          { key: "COFFEE", label: "Coffee" },
          { key: "MATCHA", label: "Matcha" },
          { key: "COOKIES", label: "Cookies" },
          { key: "BREADS", label: "Breads" },
          { key: "PAIRINGS", label: "Pairings" },
        ].map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key as any)}
            className={`pb-1 whitespace-nowrap ${
              activeCategory === cat.key
                ? "text-white border-b border-red-500"
                : "hover:text-white"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* MENU SECTIONS */}
      <section className="px-6 py-8 max-w-6xl mx-auto space-y-12">
      {Object.entries(groupedMenu)
        .filter(([category]) =>
          activeCategory === "ALL" ? true : category === activeCategory
        )
        .map(([category, items]) => (
            <div key={category}>
              {CATEGORY_LABELS[category] && (
                <h2 className="mb-4 text-lg font-semibold tracking-wide">
                  {CATEGORY_LABELS[category]}
                </h2>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map((item) => {
                  const qty = cart[item.id] || 0;

                  return (
                    <div
                      key={item.id}
                      className="relative rounded-xl p-5 bg-gradient-to-br from-[#1a0b0f] to-black border border-white/5"
                    >
                      <h3 className="text-base font-medium">{item.name}</h3>

                      {item.description && (
                        <p className="text-sm text-white/50 mt-1">
                          {item.description}
                        </p>
                      )}

                      <p className="mt-3 text-sm font-semibold">
                        ₹{item.price}
                      </p>

                      <div className="absolute bottom-4 right-4 flex items-center gap-2">
                        {qty > 0 ? (
                          <>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="h-7 w-7 rounded-full bg-white/10 text-lg"
                            >
                              −
                            </button>
                            <span className="text-sm">{qty}</span>
                            <button
                              onClick={() => addItem(item.id)}
                              className="h-7 w-7 rounded-full bg-red-600 text-lg"
                            >
                              +
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => addItem(item.id)}
                            className="rounded-full bg-red-600 px-4 py-1.5 text-xs"
                          >
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
      </section>

      {/* FLOATING CART */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-6 right-6 w-72 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 p-4 z-30">
          <h4 className="text-sm font-medium mb-3">Your Order</h4>

          <div className="space-y-2 text-sm mb-3">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between text-white/80">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-sm font-semibold mb-3">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <button
            onClick={() => {
              if (tableCode) {
                localStorage.setItem("tableCode", tableCode);
              }
              const items = cartItems.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
              }));

              const subtotal = items.reduce(
                (sum, i) => sum + i.price * i.quantity,
                0
              );

              const orderDraft = {
                tableNumber: tableCode ?? localStorage.getItem("tableCode") ?? "TABLE_01",
                items,
                subtotal,
                tax: Math.round(subtotal * 0.08), // example 8%
                tipPercent: 0,
                tipAmount: 0,
                total: subtotal,
                paymentMethod: "card",
                customer: {
                  name: "",
                  phone: "",
                },
                note: "",
              };

              localStorage.setItem("orderDraft", JSON.stringify(orderDraft));
              router.push("/checkout");
            }}
            className="w-full rounded-full bg-red-600 py-2 text-sm"
          >
            Place Order
          </button>
        </div>
      )}
    </main>
  );
}

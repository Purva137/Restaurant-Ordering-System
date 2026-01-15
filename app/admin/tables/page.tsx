"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

type Table = {
  id: string;
  code: string;
  seats: number;
};

type TableWithQr = Table & { qr?: string };

export default function AdminTablesPage() {
  const [tables, setTables] = useState<TableWithQr[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTables = async () => {
      const res = await fetch("/api/tables");
      const data = res.ok ? await res.json() : [];
      setTables(data);
      setLoading(false);
    };
    loadTables();
  }, []);

  useEffect(() => {
    const generateQrs = async () => {
      const next = await Promise.all(
        tables.map(async (table) => {
          if (table.qr) return table;
          const url = `${window.location.origin}/scan?table=${encodeURIComponent(
            table.code
          )}`;
          const qr = await QRCode.toDataURL(url, { margin: 1, width: 220 });
          return { ...table, qr };
        })
      );
      setTables(next);
    };
    if (tables.length > 0) {
      generateQrs().catch(() => {});
    }
  }, [tables]);

  if (loading) {
    return <p className="p-6 text-white/60">Loading tables…</p>;
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-xl font-semibold mb-6">Table QR Codes</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tables.map((table) => (
          <div
            key={table.id}
            className="rounded-lg border border-white/10 bg-white/5 p-4"
          >
            <div className="text-sm font-semibold mb-2">{table.code}</div>
            {table.qr ? (
              <img
                src={table.qr}
                alt={`QR ${table.code}`}
                className="w-full rounded-md bg-white p-2"
              />
            ) : (
              <div className="h-52 rounded-md bg-white/10 animate-pulse" />
            )}
            <p className="text-xs text-white/60 mt-2">
              Seats: {table.seats}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}


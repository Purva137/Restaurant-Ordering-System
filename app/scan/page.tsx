"use client";

import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ScanPage() {
  const router = useRouter();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 220, height: 220 },
        aspectRatio: 1,
        videoConstraints: { facingMode: "environment" },
      },
      false
    );

    scanner.render(
      (decodedText) => {
        scanner.clear();
        try {
          const url = new URL(decodedText, window.location.origin);
          const table = url.searchParams.get("table");
          if (table) {
            window.location.href = `/menu?table=${encodeURIComponent(table)}`;
          } else {
            window.location.href = decodedText;
          }
        } catch {
          window.location.href = decodedText;
        }
      },
      (error) => {
        // ignore scan errors
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return (
    <main className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center"> 
    <button 
      onClick={() => router.back()}
      className="text-sm text-white/60 hover:text-white transition absolute top-8 left-6"
      >
        ← Back
    </button>
      <h1 className="text-xl font-semibold mb-4">Scan QR to Order</h1>
      <div
        id="reader"
        className="w-[320px] h-[320px] rounded-xl overflow-hidden border border-white/10 bg-black/40 shadow-lg [&>video]:w-full [&>video]:h-full [&>video]:object-cover [&>canvas]:w-full [&>canvas]:h-full"
      />
      <p className="mt-4 text-sm text-white/60 text-center">
        Point your camera at the QR code on your table
      </p>
    </main>
  );
}

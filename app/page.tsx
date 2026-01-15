"use client";

import { useRouter } from "next/navigation";
import Spline from "@splinetool/react-spline";
import CallStaffButton from "@/app/components/CallStaffButton";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#2b0f14] text-white">
      {/* NAVBAR */}
      <header className="fixed top-0 w-full z-30 flex items-center justify-between px-10 py-5 bg-gradient-to-b from-black/40 to-black/10 backdrop-blur-md">
        <h1 className="text-xl font-semibold tracking-[0.3em]">NOBORU</h1>

        <nav className="flex items-center gap-10 text-sm tracking-wide text-white/80">
          <button
            onClick={() => router.push("/menu")}
            className="hover:text-white transition"
          >
            Menu
          </button>
          <button
            onClick={() => router.push("/story")}
            className="hover:text-white transition"
          >
            Story
          </button>
          <button
            onClick={() => router.push("/scan")}
            className="hover:text-white transition"
          >
            Scan
          </button>
          <CallStaffButton label="Call Staff" className="text-sm text-white/80 hover:text-white transition" />
        </nav>
      </header>

      {/* HERO / SPLINE */}
      <section className="relative h-[90vh] w-full overflow-hidden pt-20">
      <Spline
        scene="https://prod.spline.design/df1oa40AxcruImFs/scene.splinecode"
        onMouseDown={(e) => {
          if (e.clientX > window.innerWidth * 0.55) {
            router.push("/scan");
          }
        }}
        onTouchStart={(e) => {
          const touch = e.touches[0];
          if (touch.clientX > window.innerWidth * 0.55) {
            router.push("/scan");
          }
        }}
      />

        {/* Instruction */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-xs text-center tracking-widest text-white/60 pointer-events-none">
          Tap on the Scan board to order from your table
        </div>
        {/* BELOW ANIMATION TEXT */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
          <button
            onClick={() => router.push("/reserve")}
            className="text-xs tracking-[0.25em] text-white/80 hover:text-white transition underline underline-offset-4"
          >
            BOOK A TABLE FOR LATER →
          </button>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="py-28 px-6 bg-gradient-to-b from-[#2b0f14] to-[#1b070b] text-center">
        <p className="text-[11px] tracking-[0.35em] text-red-400 mb-4">
          THE PHILOSOPHY
        </p>

        <h2 className="text-4xl font-light mb-6">Where Peaks Meet</h2>

        <p className="max-w-3xl mx-auto text-sm text-white/70 leading-7">
          Noboru represents the ascent—a culinary meeting point between the
          delicate precision of Japanese tradition and the bold, soulful depths
          of Korean heritage. We invite you to experience a menu crafted for the
          modern palate, designed to be ordered seamlessly from the comfort of
          your table.
        </p>
      </section>

      {/* SIGNATURE PLATES */}
      <section className="px-10 py-24 bg-[#1b070b]">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-xl mb-1">Signature Plates</h3>
            <p className="text-xs tracking-widest text-white/50">
              SELECTED FOR THE SEASON
            </p>
          </div>

          <button
            onClick={() => router.push("/menu")}
            className="text-xs tracking-widest text-red-400 hover:text-red-300 transition"
          >
            VIEW FULL MENU →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              id: "01",
              title: "Wagyu Ishiyaki",
              desc: "A5 Wagyu beef slices served with hot stone for table-side searing, accompanied by truffle ponzu.",
              price: "₹3,750",
            },
            {
              id: "02",
              title: "Kimchi Carbonara",
              desc: "Thick udon noodles in a creamy aged parmesan sauce, cut with spicy fermented kimchi.",
              price: "₹2,000",
            },
            {
              id: "03",
              title: "Yuzu Hamachi",
              desc: "Fresh yellowtail sashimi, yuzu-kosho dressing, serrano pepper, and micro cilantro.",
              price: "₹1,750",
            },
          ].map((item) => (
            <div
              key={item.id}
              className="bg-black/30 rounded-xl p-6 hover:bg-black/40 transition"
            >
              <p className="text-red-400 text-xs mb-2">{item.id}</p>
              <h4 className="mb-2">{item.title}</h4>
              <p className="text-sm text-white/60 mb-6">{item.desc}</p>
              <p className="text-sm">{item.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center text-xs text-white/40 bg-black">
        © NOBORU DINING. ALL RIGHTS RESERVED.
      </footer>
    </main>
  );
}

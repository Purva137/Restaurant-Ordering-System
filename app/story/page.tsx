"use client";

import { useRouter } from "next/navigation";

export default function StoryPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#2b0f14] text-white pt-8 md:pt-0">
      <button 
      onClick={() => router.back()}
      className="text-sm text-white/60 hover:text-white transition ml-6"
      >
        ← Back
      </button>
      {/* Hero */}
      <section className="relative px-6 py-8 max-w-4xl mx-auto text-center">

        <p className="text-xs tracking-[0.3em] text-red-400 mb-4">
          THE STORY
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold mb-6">
          Where Gujarat Meets Japan
        </h1>
        <p className="text-white/70 leading-relaxed text-lg">
          Noboru is more than a restaurant — it is a journey into Japanese
          tradition, culture, and craftsmanship.
        </p>
      </section>

      <img
        src="https://www.gujpreneur.com/wp-content/uploads/2025/03/ebd7b096-77cf-4d35-b5bf-8cecf1dc08a8-1536x864.jpeg"
        alt="Noboru Logo"
        className="mx-auto w-100 opacity-90"
        />

      {/* Content */}
      <section className="px-6 py-10 max-w-3xl mx-auto space-y-4 text-white/80 leading-relaxed">
        <div className="space-y-4">
          <p>
            Gujarat has witnessed exceptional growth over the last two decades,
            emerging as a thriving hub for new brands, businesses, and cultural
            experiences. With an open embrace for innovation and diversity, the
            state has steadily evolved into a destination that celebrates global
            cuisines and traditions.
          </p>
          <p>
            Japanese cuisine, admired worldwide for its precision, balance, and
            depth, has found a growing audience in Gujarat as well.
          </p>
          <p>
            With its first outlet in Ahmedabad, <span className="text-white">Noboru</span> was
            born to offer something rare — a truly authentic Japanese dining
            experience. Unlike many pan-Asian restaurants, Noboru remains firmly
            rooted in traditional Japanese flavours, craftsmanship, and
            philosophy.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl text-white font-semibold">
            A Vision Rooted in Japan
          </h2>
          <p>
            Founded by Amit Gupta, Noboru represents a long-held dream of bringing
            authentic Japanese culture to Gujarat. His fascination with Japan
            extends beyond food — deeply tied to literature, art, and everyday
            rituals.
          </p>
          <p>
            The restaurant draws inspiration from <em>The Wind-Up Bird Chronicle</em>,
            one of the founder’s favourite novels. Even the name and logo of
            Noboru are influenced by the story’s central cat character — a quiet
            nod to Japanese storytelling and symbolism.
          </p>
          <p>
            This passion for Japan flows through every aspect of the restaurant,
            with an unwavering commitment to authenticity in every dish served.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl text-white font-semibold">
            Authenticity Through Simplicity
          </h2>
          <p>
            While Gujarat is home to many pan-Asian restaurants, Noboru stands
            apart through its simplicity and discipline. The philosophy is
            clear: use the finest ingredients, respect tradition, and avoid
            unnecessary complexity.
          </p>
          <p>
            Many ingredients are sourced directly from Japan, and the chefs are
            extensively trained to prepare traditional Japanese dishes with
            exceptional care and precision.
          </p>
          <p>
            Dining at Noboru is meant to feel unhurried — a place where guests
            feel at home while experiencing something extraordinary.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl text-white font-semibold">
            A Menu Crafted for Everyone
          </h2>
          <p>
            Noboru’s menu is thoughtfully designed to cater to vegetarians and
            Jain diners while remaining true to Japanese culinary principles.
          </p>
          <p>
            Signature dishes appear in the <span className="text-white">Takumi – Crafted Selection</span>,
            showcasing the finest expressions of Japanese cuisine, prepared with
            meticulous attention to detail.
          </p>
          <p>
            Seasonal specialties reflect the changing rhythms of nature, while
            honoring tradition at every step.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl text-white font-semibold">
            Culture Beyond the Plate
          </h2>
          <p>
            Noboru extends the dining experience beyond food. Guests can expect
            elements of Japanese and Korean culture — manga, anime screenings,
            K-pop nights, and cosplay events — thoughtfully woven into the
            atmosphere.
          </p>
          <p>
            Growth at Noboru is driven not by aggressive marketing, but by word
            of mouth, genuine feedback, and meaningful guest relationships.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl text-white font-semibold">
            Focused Growth, Long-Term Vision
          </h2>
          <p>
            While growth continues, the founders remain committed to staying
            self-owned. Franchising is intentionally avoided to preserve quality,
            consistency, and creative control.
          </p>
          <p>
            The philosophy is simple: serve the food you believe in, protect the
            standards you set, and success will follow.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl text-white font-semibold">
            Conclusion
          </h2>
          <p>
            Noboru is more than a restaurant — it is a voyage into Japan. Every
            dish reflects respect for tradition, every detail honors
            craftsmanship, and every guest experience is shaped with care.
          </p>
          <p>
            By blending Japanese authenticity with modern hospitality, Noboru has
            carved a distinct place within Ahmedabad’s vibrant food landscape —
            proving that true passion creates lasting impact.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-xs text-white/40">
        © Noboru Dining. All rights reserved.
      </footer>
    </main>
  );
}

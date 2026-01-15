export default function AppHeader({ backTo = "/" }) {
    return (
      <header className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 bg-black/70 backdrop-blur-md">
        <button
          onClick={() => window.location.href = backTo}
          className="text-sm text-white/60 hover:text-white"
        >
          ← Back
        </button>
        <span className="font-semibold tracking-wide">NOBORU</span>
      </header>
    );
  }
  
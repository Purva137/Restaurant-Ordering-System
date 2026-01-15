export default function NoboruLogo() {
  return (
    <div className="flex items-center gap-3">
      <svg
        width="60"
        height="60"
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="rounded"
      >
        {/* Black background */}
        <rect width="60" height="60" fill="#000000" rx="4" />
        {/* Bowl shape (cat's head) */}
        <path
          d="M10 25 L10 35 Q10 40 15 40 L45 40 Q50 40 50 35 L50 25"
          stroke="#DC2626"
          strokeWidth="2"
          fill="none"
        />
        {/* Top line of bowl */}
        <line x1="10" y1="25" x2="50" y2="25" stroke="#DC2626" strokeWidth="2" />
        {/* Ears */}
        <path d="M10 25 L5 15 L10 20 Z" stroke="#DC2626" strokeWidth="2" fill="none" />
        <path d="M50 25 L55 15 L50 20 Z" stroke="#DC2626" strokeWidth="2" fill="none" />
        {/* Eyes */}
        <circle cx="20" cy="30" r="2" fill="#DC2626" />
        <circle cx="40" cy="30" r="2" fill="#DC2626" />
        {/* Nose */}
        <path d="M30 33 L28 36 L32 36 Z" stroke="#DC2626" strokeWidth="1.5" fill="none" />
        {/* Mouth */}
        <path d="M28 36 Q30 38 32 36" stroke="#DC2626" strokeWidth="1.5" fill="none" />
        {/* Whiskers */}
        <line x1="15" y1="32" x2="8" y2="32" stroke="#DC2626" strokeWidth="1.5" />
        <line x1="15" y1="35" x2="8" y2="36" stroke="#DC2626" strokeWidth="1.5" />
        <line x1="45" y1="32" x2="52" y2="32" stroke="#DC2626" strokeWidth="1.5" />
        <line x1="45" y1="35" x2="52" y2="36" stroke="#DC2626" strokeWidth="1.5" />
        {/* Chopsticks left */}
        <line x1="5" y1="28" x2="5" y2="38" stroke="#DC2626" strokeWidth="1.5" />
        <line x1="7" y1="28" x2="7" y2="38" stroke="#DC2626" strokeWidth="1.5" />
        {/* Chopsticks right */}
        <line x1="53" y1="28" x2="53" y2="38" stroke="#DC2626" strokeWidth="1.5" />
        <line x1="55" y1="28" x2="55" y2="38" stroke="#DC2626" strokeWidth="1.5" />
        {/* Base of bowl */}
        <line x1="20" y1="40" x2="40" y2="40" stroke="#DC2626" strokeWidth="1.5" />
      </svg>
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-white tracking-tight">NOBORU</h1>
        <p className="text-xs text-red-600 font-medium tracking-wide">JAPANESE AND KOREAN DINER</p>
      </div>
    </div>
  );
}


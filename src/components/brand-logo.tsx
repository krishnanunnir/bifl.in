import Link from "next/link";

export function BrandLogo() {
  return (
    <Link href="/" className="brand-logo" aria-label="bifl.in homepage">
      <svg
        className="brand-logo__mark"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Rich heritage background */}
        <rect width="40" height="40" rx="8" fill="#1c1917" />
        
        {/* Outer subtle gold accent ring */}
        <rect x="2" y="2" width="36" height="36" rx="6" stroke="#8a6325" strokeWidth="1" strokeOpacity="0.4" />
        
        {/* Interlocking Eternity Knot / Anvil Motif */}
        <path
          d="M12 20C12 16.6863 14.6863 14 18 14C20.5 14 22.5 15.5 24 17.5L26 20C27.5 22 29.5 23.5 32 23.5C34.2091 23.5 36 21.7091 36 19.5"
          stroke="#e6ca65"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M28 20C28 23.3137 25.3137 26 22 26C19.5 26 17.5 24.5 16 22.5L14 20C12.5 18 10.5 16.5 8 16.5C5.79086 16.5 4 18.2909 4 20.5"
          stroke="#e6ca65"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Central Core Pillar */}
        <circle cx="20" cy="20" r="2.5" fill="#f8f6f0" />
      </svg>
      <div className="brand-logo__wordmark">
        <span className="font-display text-lg tracking-tight text-[#1c1917] font-bold">bifl</span>
        <span className="brand-logo__domain text-sm font-semibold text-[#8a6325]">.in</span>
      </div>
    </Link>
  );
}

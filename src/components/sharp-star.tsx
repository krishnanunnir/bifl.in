import React from "react";

export function SharpStar({
  filled = true,
  size = 14,
  className = "",
}: {
  filled?: boolean;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`inline-block shrink-0 ${className}`}
      aria-hidden="true"
    >
      {/* Sharp, slightly cartoonish 5-point star with crisp outline */}
      <polygon
        points="12,1.5 15.2,7.8 22.2,8.9 17.1,13.9 18.3,21 12,17.7 5.7,21 6.9,13.9 1.8,8.9 8.8,7.8"
        fill={filled ? "#f59e0b" : "#f1f5f9"}
        stroke="#0f172a"
        strokeWidth="1.75"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SharpSparkle({
  size = 14,
  className = "",
  fill = "#f59e0b",
}: {
  size?: number;
  className?: string;
  fill?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`inline-block shrink-0 ${className}`}
      aria-hidden="true"
    >
      {/* 4-pointed sharp cartoonish Anthropic-style sparkle */}
      <path
        d="M12 2C12 7.52 7.52 12 2 12C7.52 12 12 16.48 12 22C12 16.48 16.48 12 22 12C16.48 12 12 7.52 12 2Z"
        fill={fill}
        stroke="#0f172a"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SharpStarRating({
  rating,
  max = 5,
  size = 13,
  showNumber = true,
}: {
  rating: number;
  max?: number;
  size?: number;
  showNumber?: boolean;
}) {
  const rounded = Math.round(rating);
  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, i) => (
          <SharpStar key={i} filled={i < rounded} size={size} />
        ))}
      </div>
      {showNumber && (
        <span className="font-mono text-[11px] font-bold text-slate-900 ml-0.5">
          {rating.toFixed(2)}
        </span>
      )}
    </div>
  );
}

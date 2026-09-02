// Durability score and lifespan color utilities.

/**
 * Maps a durability score (0.00 to 5.00) to a rich, warm, heritage hex color.
 */
export function durabilityColor(score: number): string {
  if (score >= 4.7) return "#1e6b45"; // Deep heritage forest emerald
  if (score >= 4.4) return "#2a7d53"; // Rich green
  if (score >= 4.0) return "#8a6325"; // Warm brass gold
  if (score >= 3.5) return "#a66826"; // Amber bronze
  if (score > 0) return "#964b32";    // Terracotta
  return "#c9d1d9";                   // Neutral missing
}

/**
 * Returns a human-friendly label for a durability score.
 */
export function durabilityTierLabel(score: number): string {
  if (score >= 4.8) return "Generational Heirloom (30+ Yrs / Lifetime)";
  if (score >= 4.5) return "Decade Workhorse (15–25 Yrs)";
  if (score >= 4.0) return "High Endurance (10–15 Yrs)";
  if (score >= 3.5) return "Durable & Serviceable (5–10 Yrs)";
  return "Standard Serviceable";
}

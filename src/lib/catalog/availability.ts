import type { PlatformName, RetailPlatform } from "./types";

export function normalizeRetailAvailability(
  availability: Array<{ name: string; href: string }> = [],
  amazonUrl?: string | null,
  officialStoreUrl?: string | null
): Array<{ name: string; href: string }> {
  const result: Array<{ name: string; href: string }> = [...availability];

  if (amazonUrl && !result.some((p) => p.name === "Amazon.in")) {
    result.unshift({ name: "Amazon.in", href: amazonUrl });
  }

  if (officialStoreUrl && !result.some((p) => p.name === "Official Store")) {
    result.push({ name: "Official Store", href: officialStoreUrl });
  }

  return result;
}

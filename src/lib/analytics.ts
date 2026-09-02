import posthog from "posthog-js";

export function initPostHog(): void {
  if (typeof window === "undefined") return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";

  if (!key) return;

  posthog.init(key, {
    api_host: host,
    person_profiles: "identified_only",
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: false,
  });
}

export function trackItemCardClick(properties: {
  item_slug: string;
  title: string;
  category: string;
  system: string;
  position: number;
}): void {
  if (typeof window === "undefined") return;
  try {
    posthog.capture("item_card_clicked", properties);
  } catch {
    // Analytics failure should never impact user UX
  }
}

export function trackExternalRetailClick(properties: {
  item_slug?: string;
  platform: string;
  href: string;
  location: string;
}): void {
  if (typeof window === "undefined") return;
  try {
    posthog.capture("retail_link_clicked", properties);
  } catch {
    // Silently continue
  }
}

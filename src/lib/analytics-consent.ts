export const CONSENT_STORAGE_KEY = "bifl_analytics_consent";

export type ConsentState = "granted" | "denied" | "pending";

export function getStoredConsent(): ConsentState {
  if (typeof window === "undefined") return "pending";
  try {
    const val = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (val === "granted" || val === "denied") return val;
  } catch {
    // LocalStorage might be restricted
  }
  return "pending";
}

export function setStoredConsent(state: "granted" | "denied"): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, state);
  } catch {
    // Ignore storage write errors
  }
}

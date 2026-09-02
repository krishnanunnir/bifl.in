"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStoredConsent, setStoredConsent } from "@/lib/analytics-consent";
import { initPostHog } from "@/lib/analytics";

export function AnalyticsConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = getStoredConsent();
    if (consent === "granted") {
      initPostHog();
    } else if (consent === "pending") {
      setShowBanner(true);
    }
  }, []);

  function handleAccept() {
    setStoredConsent("granted");
    setShowBanner(false);
    initPostHog();
  }

  function handleDecline() {
    setStoredConsent("denied");
    setShowBanner(false);
  }

  if (!showBanner) return null;

  return (
    <div
      className="consent-banner fixed bottom-4 right-4 z-50 max-w-sm rounded-lg border border-[#d6cebf] bg-[#ffffff] p-4 shadow-xl text-xs text-[#57534e]"
      role="region"
      aria-label="Privacy and Analytics Consent"
    >
      <p className="leading-relaxed">
        We use privacy-friendly, anonymized telemetry to understand which Indian heirloom products
        resonate most. See our{" "}
        <Link href="/privacy" className="underline font-semibold text-[#8c3b2b]">
          Privacy Policy
        </Link>
        .
      </p>
      <div className="consent-banner__actions mt-3 flex justify-end gap-2">
        <button
          onClick={handleDecline}
          className="rounded px-2.5 py-1 text-xs font-medium text-[#78716c] hover:bg-[#f5f0e8] transition-colors"
        >
          Decline
        </button>
        <button
          onClick={handleAccept}
          className="consent-banner__accept rounded bg-[#1c1917] px-3 py-1 text-xs font-semibold text-white hover:bg-[#2e2a27] transition-colors"
        >
          Accept
        </button>
      </div>
    </div>
  );
}

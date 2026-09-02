import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SITE_NAME, absoluteUrl } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "bifl.in privacy policy and data governance.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy",
    url: absoluteUrl("/privacy"),
    siteName: SITE_NAME,
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f6f0] text-[#1c1917]">
      <SiteHeader />
      <main id="main-content" className="site-main mx-auto w-full max-w-3xl px-4 py-8 sm:px-8 sm:py-12">
        <article className="prose-page">
          <h1 className="font-display text-4xl font-bold tracking-tight text-[#1c1917]">
            Privacy & Data Governance
          </h1>
          <p className="mt-3 text-sm text-[#78716c]">Last updated: September 2026</p>

          <section className="mt-6 space-y-6 text-sm leading-relaxed text-[#44403c]">
            <p>
              At <strong>bifl.in</strong>, we believe in digital longevity and respect for your
              privacy. We do not sell your data, we do not track you across other websites, and we
              do not run invasive third-party ad surveillance.
            </p>

            <h2 className="font-display text-xl font-bold text-[#1c1917]">Telemetry & Analytics</h2>
            <p>
              With your explicit consent, we capture anonymized page views and outbound retail link
              clicks via PostHog to understand which heirloom Indian products are most valued. No
              personally identifiable information (PII) is stored without your permission.
            </p>

            <h2 className="font-display text-xl font-bold text-[#1c1917]">External Retail Links</h2>
            <p>
              When you click on links to Amazon.in, Official Brand Webstores, or Artisan Guilds, you
              are redirected to external websites. We encourage you to review their respective
              privacy policies.
            </p>
          </section>

          <div className="mt-8 border-t border-[#e2dcd2] pt-6">
            <Link href="/" className="font-bold text-sm text-[#8c3b2b] hover:underline">
              ← Return to Catalog
            </Link>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SITE_NAME, absoluteUrl } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "The BIFL India Manifesto — Buy It For Life India",
  description:
    "Why bifl.in exists: The five laws of generational longevity, repairability, and material purity in an era of disposable consumption.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "The BIFL India Manifesto",
    description: "The five laws of generational longevity in India.",
    url: absoluteUrl("/about"),
    siteName: SITE_NAME,
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f6f0] text-[#1c1917]">
      <SiteHeader />
      <main id="main-content" className="site-main mx-auto w-full max-w-3xl px-4 py-8 sm:px-8 sm:py-12">
        <article className="prose-page">
          <p className="eyebrow text-xs uppercase font-mono tracking-widest text-[#8a6325] font-semibold mb-2">
            The Manifesto
          </p>
          <h1 className="font-display text-4xl font-bold tracking-tight text-[#1c1917] sm:text-5xl">
            The 5 Laws of Longevity in India
          </h1>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#57534e]">
            India possesses one of the world's richest traditions of multi-generational crafting,
            from centuries-old metallurgy in Tanjore and Jandiala Guru to heavy-duty industrial
            pioneers in Kanpur, Pondicherry, and Bangalore.
          </p>

          <section className="mt-8 border-t border-[#e2dcd2] pt-6 space-y-6 text-sm sm:text-base leading-relaxed text-[#44403c]">
            <div>
              <h2 className="font-display text-xl font-bold text-[#1c1917]">
                1. Material Authenticity Over Coatings
              </h2>
              <p className="mt-2 text-[#57534e]">
                If a product relies on a 2-micron chemical spray to function, it is inherently
                disposable. True BIFL items are solid throughout: pure ductile cast iron, full-grain
                vegetable-tanned leather, heavy 304 austenitic steel, pure bronze (kansa), and
                vulcanized ebonite rubber.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-[#1c1917]">
                2. Universal & Standardized Spare Parts
              </h2>
              <p className="mt-2 text-[#57534e]">
                A product is only as durable as its most vulnerable wearing part. We celebrate makers
                like Hawkins, Crompton, and Preethi whose gaskets, capacitors, and couplers can be
                bought for ₹50 at any local hardware store in any Indian pincode.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-[#1c1917]">
                3. Pure Mechanical Integrity
              </h2>
              <p className="mt-2 text-[#57534e]">
                Every added circuit board, Bluetooth chip, or digital touch screen introduces a point
                of planned failure. Pure mechanical mechanisms (such as HMT Parashock movements,
                piston fountain pens, and solid brass Godrej levers) run for 50+ years with simple
                periodic lubrication.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-[#1c1917]">
                4. The Patina Principle: Aging as Improvement
              </h2>
              <p className="mt-2 text-[#57534e]">
                Cheap products degrade with use; heirloom products improve. Cast iron builds a slicker
                glass-black seasoning; vegetable tanned leather softens into a rich honey patina;
                kansa cookware deepens into warm antique bronze.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-[#1c1917]">
                5. Zero-Clutter Discovery
              </h2>
              <p className="mt-2 text-[#57534e]">
                We refuse to turn this catalog into a messy e-commerce discount bazaar. No affiliate
                spam, no dropshipped plastic junk, and no bloated search forms. Just a curated,
                serene directory of items that will stand the test of time.
              </p>
            </div>
          </section>

          <div className="mt-10 border-t border-[#e2dcd2] pt-6 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-1 font-bold text-sm text-[#8c3b2b] hover:underline"
            >
              ← Back to Catalog
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 font-bold text-sm text-[#8c3b2b] hover:underline"
            >
              Read Care Guides →
            </Link>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}

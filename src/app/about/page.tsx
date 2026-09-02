import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SITE_NAME, absoluteUrl } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Manifesto — Buy It For Life India",
  description: "The five laws of generational longevity, repairability, and material purity in India.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Manifesto — Buy It For Life India",
    description: "The five laws of generational longevity in India.",
    url: absoluteUrl("/about"),
    siteName: SITE_NAME,
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <SiteHeader />
      <main id="main-content" className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12 space-y-10">
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            The BIFL India Manifesto
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            India has a rich tradition of multi-generational crafting and durable engineering.
            From centuries-old metallurgy to heavy-duty industrial workhorses in Kanpur, Pondicherry,
            and Bangalore, true BIFL products stand on five principles:
          </p>
        </div>

        <div className="space-y-8 border-t border-slate-100 pt-8 text-sm leading-relaxed text-slate-700">
          <div>
            <h2 className="font-bold text-base text-slate-900">1. Material Authenticity Over Coatings</h2>
            <p className="mt-1 text-slate-600">
              If a product relies on a thin synthetic spray to function, it is temporary. True BIFL items are solid throughout: pure cast iron, full-grain vegetable-tanned leather, heavy 304 stainless steel, and pure bronze (kansa).
            </p>
          </div>

          <div>
            <h2 className="font-bold text-base text-slate-900">2. Universal & Standardized Spare Parts</h2>
            <p className="mt-1 text-slate-600">
              A product is only as durable as its most vulnerable wearing part. We celebrate makers like Hawkins, Crompton, and Preethi whose gaskets, capacitors, and couplers cost under ₹100 at any local hardware store.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-base text-slate-900">3. Pure Mechanical Integrity</h2>
            <p className="mt-1 text-slate-600">
              Every added circuit board or electronic sensor introduces a point of failure. Pure mechanical mechanisms run for decades with basic periodic cleaning and lubrication.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-base text-slate-900">4. Aging as Improvement</h2>
            <p className="mt-1 text-slate-600">
              Cheap products degrade with use; heirloom products improve. Cast iron builds a slicker glass-black patina; vegetable-tanned leather softens into a rich honey shade.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-base text-slate-900">5. Curated & Zero Fluff</h2>
            <p className="mt-1 text-slate-600">
              No sponsored junk, no fast-fashion dropshipping, and no fake review manipulation. Only products proven through decades of real-world endurance.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <Link href="/" className="text-xs font-semibold text-slate-900 hover:underline">
            ← Back to Catalog
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

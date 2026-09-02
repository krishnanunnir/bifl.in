import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ItemCard } from "@/components/item-card";
import { CATEGORIES } from "@/lib/catalog/categories";
import { getCatalogPage } from "@/lib/db/queries/catalog";
import { SharpSparkle } from "@/components/sharp-star";
import {
  SITE_NAME,
  SITE_TITLE,
  SITE_DESCRIPTION,
  SITE_ALTERNATE_NAME,
  absoluteUrl,
  serializeJsonLd,
} from "@/lib/seo/site";

export const revalidate = 60;

export const metadata: Metadata = {
  title: `${SITE_TITLE}`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: absoluteUrl("/"),
    siteName: SITE_NAME,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: SITE_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image"],
  },
};

export default async function Home() {
  const { items: topPicks } = await getCatalogPage(1);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        url: absoluteUrl("/"),
        name: SITE_NAME,
        alternateName: SITE_ALTERNATE_NAME,
        description: SITE_DESCRIPTION,
      },
      {
        "@type": "ItemList",
        name: "Buy It For Life India — Top 10 Picks Today",
        numberOfItems: topPicks.length,
        itemListElement: topPicks.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.title,
          url: absoluteUrl(`/items/${item.slug}`),
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <SiteHeader />

      <main id="main-content" className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12 space-y-10">
        {/* Hero Header */}
        <section className="space-y-4 max-w-3xl">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
            <SharpSparkle size={13} fill="#f59e0b" />
            <span>The Indian Heirloom Catalog</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Buy It For Life (India)
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            A curated index of durable, repairable, and generational goods built to last in India.
            Zero planned obsolescence, zero synthetic coatings, and lifetime spare parts.
          </p>

          {/* Category Navigation Pills */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="cat-pill-sharp"
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Top 10 Picks Showcase */}
        <section aria-labelledby="top-picks-heading" className="space-y-6">
          <div className="flex items-end justify-between pb-3 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <SharpSparkle size={16} fill="#f59e0b" />
                <h2 id="top-picks-heading" className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                  Top 10 Picks for Today
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-1">
                Curated daily · Highest overall BIFL durability and nationwide serviceability
              </p>
            </div>
          </div>

          <div className={topPicks.length === 1 ? "max-w-2xl" : "grid grid-cols-1 md:grid-cols-2 gap-6"}>
            {topPicks.map((item, idx) => (
              <ItemCard key={item.slug} item={item} priority={idx < 2} position={idx + 1} />
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

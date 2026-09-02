import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ItemCard } from "@/components/item-card";
import { CATEGORIES } from "@/lib/catalog/categories";
import { items as allItems, getTopPicks, getItemsByCategory } from "@/data/items";
import {
  SITE_NAME,
  SITE_TITLE,
  SITE_DESCRIPTION,
  SITE_ALTERNATE_NAME,
  absoluteUrl,
  serializeJsonLd,
} from "@/lib/seo/site";

export const revalidate = 3600;

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

export default function Home() {
  const topPicks = getTopPicks();

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
        name: "Buy It For Life India Top Picks",
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

      <main id="main-content" className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 space-y-16">
        {/* Minimal Hero Header */}
        <section className="space-y-4 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Buy It For Life (India)
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            A curated index of durable, repairable, and generational goods built to last in India.
            Cast iron, pure bronze, full-grain leather, mechanical watches, and heavy tools with lifetime spares.
          </p>

          {/* Clean Category Navigation Pills */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="cat-pill"
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Top Picks Section */}
        <section aria-labelledby="top-picks-heading">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
            <div>
              <h2 id="top-picks-heading" className="text-xl font-bold text-slate-900">
                Top Picks
              </h2>
              <p className="text-xs text-slate-500">Highest rated generational essentials</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {topPicks.slice(0, 6).map((item, idx) => (
              <ItemCard key={item.slug} item={item} priority={idx < 3} position={idx + 1} />
            ))}
          </div>
        </section>

        {/* Category-by-Category Sections */}
        <section className="space-y-16" aria-labelledby="categories-heading">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 id="categories-heading" className="text-xl font-bold text-slate-900">
              Browse by Category
            </h2>
          </div>

          {CATEGORIES.map((category) => {
            const categoryItems = getItemsByCategory(category.slug);
            return (
              <div key={category.slug} className="space-y-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{category.icon}</span>
                      <h3 className="text-lg font-bold text-slate-900">{category.name}</h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{category.tagline}</p>
                  </div>

                  <Link
                    href={`/category/${category.slug}`}
                    className="text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    View all {categoryItems.length} items →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {categoryItems.slice(0, 3).map((item) => (
                    <ItemCard key={item.slug} item={item} />
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

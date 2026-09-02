import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TrackedExternalLink } from "@/components/tracked-external-link";
import { CATEGORIES } from "@/lib/catalog/categories";
import { items as allItems, getTopPicks, getItemsByCategory } from "@/data/items";
import { durabilityColor } from "@/lib/catalog/durability";
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
        name: "Top Buy It For Life India Picks",
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
    <div className="min-h-screen flex flex-col bg-[#f8f6f0] text-[#1c1917]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <SiteHeader />

      <main id="main-content" className="site-main mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-12 space-y-16">
        {/* Hero Section */}
        <section className="rounded-2xl border border-[#e2dcd2] bg-[#ffffff] p-6 sm:p-10 shadow-sm">
          <div className="max-w-3xl space-y-4">
            <p className="eyebrow text-xs uppercase font-mono tracking-widest text-[#8a6325] font-bold">
              The Indian Heirloom Directory
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#1c1917] leading-tight">
              Buy It For Life India.
            </h1>
            <p className="text-base sm:text-lg leading-relaxed text-[#57534e]">
              A curated catalog of generational, repairable, and time-tested products made or widely
              trusted in India. Zero planned obsolescence, zero synthetic throwaways.
            </p>

            {/* Category Quick Jump Pills */}
            <div className="pt-3 flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[#78716c] mr-1">
                Explore Categories:
              </span>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#d6cebf] bg-[#faf8f5] px-3.5 py-1.5 text-xs font-semibold text-[#44403c] hover:border-[#8c3b2b] hover:bg-[#ffffff] hover:text-[#8c3b2b] transition-all"
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Top Picks Showcase (Amazon / Wirecutter style top recommendations) */}
        <section aria-labelledby="top-picks-heading">
          <div className="directory-heading mb-6">
            <div>
              <p className="eyebrow text-xs uppercase font-mono tracking-widest text-[#8a6325] font-bold mb-1">
                Curated Standouts
              </p>
              <h2 id="top-picks-heading" className="font-display text-3xl font-bold text-[#1c1917]">
                Top Generational Picks
              </h2>
            </div>
            <p className="font-mono text-xs text-[#78716c] uppercase">
              Tested for Decades of Heavy Use
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {topPicks.slice(0, 6).map((item) => {
              const mainVariant = item.variants[0];
              const score = mainVariant?.durabilityScore ?? 4.8;
              return (
                <article
                  key={item.slug}
                  className="flex flex-col justify-between rounded-xl border border-[#e2dcd2] bg-[#ffffff] p-5 shadow-sm hover:border-[#8c3b2b]/40 hover:shadow-md transition-all"
                >
                  <div className="space-y-3">
                    <Link href={`/items/${item.slug}`} className="block overflow-hidden rounded-lg">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={300}
                        height={200}
                        className="h-44 w-full object-cover border border-[#e2dcd2] bg-[#f8f6f0] transition-transform duration-300 hover:scale-105"
                      />
                    </Link>

                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#f5f0e8] text-[#8c3b2b]">
                        {item.system}
                      </span>
                      <span
                        className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded text-white"
                        style={{ backgroundColor: durabilityColor(score) }}
                      >
                        {score.toFixed(2)} Score
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-bold text-[#1c1917] leading-snug hover:text-[#8c3b2b] transition-colors line-clamp-2">
                      <Link href={`/items/${item.slug}`}>{item.title}</Link>
                    </h3>

                    <p className="text-xs text-[#78716c] font-semibold uppercase tracking-wider">
                      By {item.maker} · {item.yearEstablished}
                    </p>

                    <p className="text-xs text-[#57534e] line-clamp-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-4 border-t border-[#ede7dc] pt-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[11px] text-[#78716c]">Est. Price:</span>
                      <strong className="font-mono text-[#1c1917] text-sm">
                        {item.priceEstimate ?? item.priceRange}
                      </strong>
                    </div>

                    {/* Retail Links Row */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {item.retailLinks.slice(0, 3).map((r) => {
                        const isAmazon = r.platform.includes("Amazon");
                        const isFlipkart = r.platform.includes("Flipkart");
                        const isCroma = r.platform.includes("Croma");

                        let colorStyle = "bg-[#faf8f5] text-[#44403c] border-[#d6cebf]";
                        if (isAmazon) colorStyle = "bg-[#ff9900]/15 text-[#854d0e] border-[#ff9900]/40 font-bold";
                        if (isFlipkart) colorStyle = "bg-[#2874f0]/10 text-[#1e40af] border-[#2874f0]/30 font-bold";
                        if (isCroma) colorStyle = "bg-[#00e9bf]/15 text-[#0f766e] border-[#00e9bf]/40 font-bold";

                        return (
                          <TrackedExternalLink
                            key={r.platform}
                            href={r.url}
                            platform={r.platform}
                            itemSlug={item.slug}
                            location="top_picks_card"
                            className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] border ${colorStyle} hover:opacity-80 transition-opacity`}
                          >
                            <span>{r.platform}</span>
                            {r.price && <span className="opacity-80">({r.price})</span>}
                          </TrackedExternalLink>
                        );
                      })}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Explore by Category Showcase */}
        <section className="space-y-14" aria-labelledby="all-categories-heading">
          <div className="border-b border-[#e2dcd2] pb-4">
            <h2 id="all-categories-heading" className="font-display text-3xl font-bold text-[#1c1917]">
              Browse by Category
            </h2>
            <p className="mt-1 text-sm text-[#57534e]">
              Explore verified Indian goods by craft discipline, metallurgy, and utility.
            </p>
          </div>

          {CATEGORIES.map((category) => {
            const categoryItems = getItemsByCategory(category.slug);
            return (
              <div key={category.slug} className="space-y-4">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" aria-hidden="true">
                      {category.icon}
                    </span>
                    <div>
                      <h3 className="font-display text-2xl font-bold text-[#1c1917]">
                        {category.name}
                      </h3>
                      <p className="text-xs text-[#78716c] font-medium">{category.tagline}</p>
                    </div>
                  </div>

                  <Link
                    href={`/category/${category.slug}`}
                    className="font-mono text-xs font-bold uppercase tracking-wider text-[#8c3b2b] hover:underline"
                  >
                    View All {categoryItems.length} Products with Filters →
                  </Link>
                </div>

                {/* 3-column category preview grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryItems.slice(0, 3).map((item) => (
                    <div
                      key={item.slug}
                      className="rounded-xl border border-[#e2dcd2] bg-[#ffffff] p-4 shadow-sm hover:border-[#8c3b2b]/40 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <Link href={`/items/${item.slug}`} className="block">
                          <Image
                            src={item.image}
                            alt={item.title}
                            width={240}
                            height={160}
                            className="h-32 w-full object-cover rounded border border-[#e2dcd2] bg-[#f8f6f0]"
                          />
                        </Link>
                        <h4 className="font-display text-base font-bold text-[#1c1917] hover:text-[#8c3b2b] line-clamp-1">
                          <Link href={`/items/${item.slug}`}>{item.title}</Link>
                        </h4>
                        <p className="text-xs text-[#78716c]">By {item.maker}</p>
                        <p className="text-xs text-[#57534e] line-clamp-2">{item.desc}</p>
                      </div>

                      <div className="mt-3 border-t border-[#ede7dc] pt-2 flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-[#1c1917]">
                          {item.priceEstimate ?? item.priceRange}
                        </span>
                        <Link
                          href={`/items/${item.slug}`}
                          className="font-mono text-[11px] font-bold uppercase text-[#8c3b2b] hover:underline"
                        >
                          Specs →
                        </Link>
                      </div>
                    </div>
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

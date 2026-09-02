import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getItemBySlug, getAllItemSlugs } from "@/lib/db/queries/items";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TrackedExternalLink } from "@/components/tracked-external-link";
import { durabilityColor, durabilityTierLabel } from "@/lib/catalog/durability";
import { SITE_NAME, absoluteUrl, serializeJsonLd } from "@/lib/seo/site";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllItemSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getItemBySlug(slug);
  if (!item) notFound();

  const title = `${item.title} — Buy It For Life India`;
  const description = item.desc;
  const canonicalPath = `/items/${item.slug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title,
      description,
      url: absoluteUrl(canonicalPath),
      siteName: SITE_NAME,
      images: [{ url: item.image, width: 600, height: 800, alt: item.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [item.image],
    },
  };
}

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getItemBySlug(slug);
  if (!item) notFound();

  const avgDurability =
    item.variants.length > 0
      ? item.variants.reduce((acc, v) => acc + v.durabilityScore, 0) / item.variants.length
      : 4.8;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.title,
    description: item.desc,
    image: item.image,
    brand: {
      "@type": "Brand",
      name: item.maker,
    },
    offers: {
      "@type": "AggregateOffer",
      offerCount: item.variants.length,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f6f0] text-[#1c1917]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <SiteHeader />
      <main id="main-content" className="site-main mx-auto w-full max-w-4xl px-4 py-6 sm:px-8 sm:py-10">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumbs" className="mb-6 font-mono text-xs text-[#78716c]">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:underline text-[#8c3b2b]">
                Home
              </Link>
            </li>
            <li>›</li>
            <li>
              <Link href={`/category/${item.category}`} className="hover:underline text-[#8c3b2b] capitalize">
                {item.category.replace("_", " ")}
              </Link>
            </li>
            <li>›</li>
            <li className="text-[#1c1917] font-semibold truncate max-w-xs">{item.title}</li>
          </ol>
        </nav>

        {/* Product Detail Card */}
        <article className="item-detail rounded-xl">
          <div className="item-detail__header">
            <Image
              className="item-detail__cover rounded-lg"
              src={item.image}
              alt={item.title}
              width={350}
              height={500}
              priority
            />

            <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="system-label">{item.system}</span>
                <span
                  className={`status-label ${item.status === "In Production" ? "status-label--complete" : ""}`}
                >
                  {item.status}
                </span>
                <span className="font-mono text-xs text-[#78716c]">
                  {item.yearEstablished}
                </span>
              </div>

              <h1 className="font-display mt-3 text-3xl font-bold tracking-tight text-[#1c1917] sm:text-4xl leading-tight">
                {item.title}
              </h1>
              {item.subtitle && (
                <p className="mt-1 text-sm font-medium text-[#78716c]">{item.subtitle}</p>
              )}

              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-[#8a6325]">
                Crafted by {item.maker}
              </p>

              <div className="mt-4 rounded-lg bg-[#f5f0e8] p-3.5 text-xs leading-relaxed text-[#57534e]">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#1c1917]">Durability Rating:</span>
                  <span
                    className="font-mono font-bold px-2 py-0.5 rounded text-white text-xs"
                    style={{ backgroundColor: durabilityColor(avgDurability) }}
                  >
                    {avgDurability.toFixed(2)} / 5.00
                  </span>
                </div>
                <p className="mt-1 text-[#78716c]">{durabilityTierLabel(avgDurability)}</p>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-[#44403c] sm:text-base">
                {item.desc}
              </p>

              {/* Retailer Direct Comparison Box (Amazon, Flipkart, Croma, Reliance Digital) */}
              <div className="mt-6 rounded-xl border border-[#e2dcd2] bg-[#faf8f5] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-wider font-bold text-[#1c1917]">
                    Where to Buy Online
                  </span>
                  <span className="font-mono text-xs font-bold text-[#8c3b2b]">
                    Est. {item.priceEstimate ?? item.priceRange}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {item.retailLinks.map((retailer) => {
                    const isAmazon = retailer.platform.includes("Amazon");
                    const isFlipkart = retailer.platform.includes("Flipkart");
                    const isCroma = retailer.platform.includes("Croma");
                    const isReliance = retailer.platform.includes("Reliance");

                    let btnClass = "bg-white text-[#1c1917] border-[#d6cebf]";
                    if (isAmazon) btnClass = "bg-[#ff9900]/15 text-[#854d0e] border-[#ff9900]/50 font-bold";
                    if (isFlipkart) btnClass = "bg-[#2874f0]/10 text-[#1e40af] border-[#2874f0]/40 font-bold";
                    if (isCroma) btnClass = "bg-[#00e9bf]/15 text-[#0f766e] border-[#00e9bf]/50 font-bold";
                    if (isReliance) btnClass = "bg-[#e11b22]/10 text-[#b91c1c] border-[#e11b22]/40 font-bold";

                    return (
                      <TrackedExternalLink
                        key={retailer.platform}
                        href={retailer.url}
                        platform={retailer.platform}
                        itemSlug={item.slug}
                        location="item_detail_retailer_grid"
                        className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs transition-all hover:opacity-85 ${btnClass}`}
                      >
                        <span className="font-semibold">{retailer.platform}</span>
                        <span className="font-mono">{retailer.price ?? "Check Price →"}</span>
                      </TrackedExternalLink>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Care & Maintenance Guide */}
          {item.careGuide && (
            <section className="mt-10 border-t border-[#ede7dc] pt-8">
              <h2 className="font-display text-2xl font-bold text-[#1c1917]">
                Longevity & Care Lifecycle
              </h2>
              <p className="mt-2 text-sm text-[#57534e] leading-relaxed">{item.careGuide}</p>

              {item.careGuideTimeline && (
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {item.careGuideTimeline.map((step, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-[#e2dcd2] bg-[#faf8f5] p-4 text-xs"
                    >
                      <span className="font-mono font-bold uppercase tracking-wider text-[#8c3b2b]">
                        Phase {idx + 1}
                      </span>
                      <h3 className="font-bold text-[#1c1917] mt-1">{step.stage}</h3>
                      <p className="mt-1.5 text-[#57534e] leading-relaxed">{step.action}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Models & Editions */}
          <section className="mt-10 border-t border-[#ede7dc] pt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl font-bold text-[#1c1917]">
                Models & Editions ({item.variants.length})
              </h2>
              <p className="font-mono text-xs text-[#78716c] uppercase">
                Verified BIFL Specifications
              </p>
            </div>

            <div className="child-book-grid rounded-xl">
              {item.variants.map((v) => (
                <div key={v.variantNumber} className="child-book rounded-lg">
                  <Image
                    className="child-book__cover rounded"
                    src={v.image}
                    alt={v.title}
                    width={120}
                    height={180}
                  />
                  <div className="flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px] font-bold uppercase text-[#8c3b2b]">
                          Model {v.variantNumber}
                        </span>
                        <span
                          className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded text-white"
                          style={{ backgroundColor: durabilityColor(v.durabilityScore) }}
                        >
                          {v.durabilityScore.toFixed(2)}
                        </span>
                      </div>
                      <h3 className="font-display text-base font-semibold text-[#1c1917] mt-1 leading-snug">
                        {v.title}
                      </h3>
                      <p className="text-xs text-[#78716c] mt-1">
                        Lifespan: <strong className="text-[#1c1917]">{v.expectedLifespan}</strong> ·{" "}
                        {v.warranty}
                      </p>
                      <p className="text-xs text-[#57534e] mt-1">{v.material}</p>
                    </div>

                    {v.amazonUrl && (
                      <div className="mt-3">
                        <TrackedExternalLink
                          href={v.amazonUrl}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#8c3b2b] hover:underline"
                          platform="Amazon.in"
                          itemSlug={item.slug}
                          location="variant_card"
                        >
                          View on Amazon.in ({v.price ?? "Check"}) →
                        </TrackedExternalLink>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}

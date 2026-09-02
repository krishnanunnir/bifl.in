import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getItemBySlug, getAllItemSlugs } from "@/lib/db/queries/items";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TrackedExternalLink } from "@/components/tracked-external-link";
import { SharpSparkle, SharpStarRating } from "@/components/sharp-star";
import { BiflBreakdown } from "@/components/bifl-breakdown";
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
  const description = item.biflSummary ?? item.desc;
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

  const defaultRatings = {
    overall: 4.9,
    longevity: 5.0,
    repairability: 4.9,
    service: 4.8,
    material: 4.9,
  };

  const ratings = item.biflRatings ?? defaultRatings;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.title,
    description: item.biflSummary ?? item.desc,
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
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <SiteHeader />

      <main id="main-content" className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10 space-y-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumbs" className="font-mono text-xs text-slate-500">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-black underline">
                Home
              </Link>
            </li>
            <li>›</li>
            <li>
              <Link href={`/category/${item.category}`} className="hover:text-black capitalize underline">
                {item.category.replace("_", " ")}
              </Link>
            </li>
            <li>›</li>
            <li className="text-slate-900 font-bold truncate max-w-xs">{item.title}</li>
          </ol>
        </nav>

        {/* Primary Hero Section: Image, Title, Maker, Price & Buy Buttons */}
        <div className="border border-slate-300 bg-white p-6 sm:p-8 shadow-[4px_4px_0_#cbd5e1] grid grid-cols-1 md:grid-cols-[16rem_minmax(0,1fr)] gap-8 items-start">
          {/* Product Image */}
          <div className="relative aspect-3/4 overflow-hidden border border-slate-300 bg-slate-50 shadow-[2px_2px_0_#e2e8f0]">
            <Image
              src={item.image}
              alt={item.title}
              fill
              priority
              unoptimized
              className="object-cover"
            />
          </div>

          {/* Product Info & Buy Grid */}
          <div className="space-y-5">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="system-label">{item.system}</span>
                <span
                  className={`status-label ${item.status === "In Production" ? "status-label--complete" : ""}`}
                >
                  {item.status}
                </span>
                <span className="font-mono text-[10px] text-slate-500">{item.yearEstablished}</span>
              </div>

              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
                {item.title}
              </h1>

              <div className="mt-2 flex items-center justify-between gap-4">
                <p className="font-semibold text-xs text-slate-600 uppercase tracking-wider">
                  Crafted by {item.maker}
                </p>
                <span className="font-mono text-lg font-bold text-slate-900">
                  {item.priceEstimate ?? item.priceRange}
                </span>
              </div>
            </div>

            {/* Quick Summary */}
            <p className="text-sm text-slate-700 leading-relaxed">
              {item.desc}
            </p>

            {/* Where to Buy Online Section */}
            <div className="space-y-2 pt-1">
              <h2 className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
                Where to Buy Online
              </h2>
              <div className="flex flex-wrap gap-2">
                {item.retailLinks.map((r) => (
                  <TrackedExternalLink
                    key={r.platform}
                    href={r.url}
                    platform={r.platform}
                    itemSlug={item.slug}
                    location="item_detail_buy"
                    className="platform-link"
                  >
                    <span>{r.platform}</span>
                    {r.price && <strong className="font-mono font-bold text-slate-900">({r.price})</strong>}
                    <span>→</span>
                  </TrackedExternalLink>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BIFL Star Rating System & Verdict (Primary Evaluation) */}
        <section aria-labelledby="bifl-score-heading">
          <BiflBreakdown ratings={ratings} summary={item.biflSummary} />
        </section>

        {/* Care & Maintenance Guide */}
        {item.careGuide && (
          <section className="border border-slate-300 bg-white p-6 sm:p-8 shadow-[4px_4px_0_#cbd5e1] space-y-3">
            <div className="flex items-center gap-2">
              <SharpSparkle size={16} fill="#f59e0b" />
              <h2 className="font-display text-xl font-bold text-slate-900">
                Longevity & Care Lifecycle
              </h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{item.careGuide}</p>
          </section>
        )}

        {/* Secondary Section: Technical Specifications & Editions */}
        <section className="space-y-6 pt-4 border-t border-slate-200">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900">
              Technical Specifications & Models
            </h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Material composition, warranties, and dimension specs
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 border border-slate-200 bg-slate-50 shadow-[2px_2px_0_#f1f5f9]">
              <span className="text-slate-500 font-mono block text-[10px] uppercase">System</span>
              <span className="font-bold text-slate-900">{item.system}</span>
            </div>
            <div className="p-3 border border-slate-200 bg-slate-50 shadow-[2px_2px_0_#f1f5f9]">
              <span className="text-slate-500 font-mono block text-[10px] uppercase">Status</span>
              <span className="font-bold text-slate-900">{item.status}</span>
            </div>
            <div className="p-3 border border-slate-200 bg-slate-50 shadow-[2px_2px_0_#f1f5f9]">
              <span className="text-slate-500 font-mono block text-[10px] uppercase">Expected Lifespan</span>
              <span className="font-bold text-slate-900">
                {item.variants[0]?.expectedLifespan ?? "25+ Years"}
              </span>
            </div>
            <div className="p-3 border border-slate-200 bg-slate-50 shadow-[2px_2px_0_#f1f5f9]">
              <span className="text-slate-500 font-mono block text-[10px] uppercase">Warranty</span>
              <span className="font-bold text-slate-900">
                {item.variants[0]?.warranty ?? "Lifetime Spares"}
              </span>
            </div>
          </div>

          {/* Individual Models / Editions */}
          {item.variants.length > 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {item.variants.map((v) => (
                <div
                  key={v.variantNumber}
                  className="border border-slate-300 bg-white p-4 space-y-2 text-xs shadow-[3px_3px_0_#e2e8f0]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{v.title}</span>
                    <SharpStarRating rating={v.durabilityScore} size={11} />
                  </div>
                  <p className="text-slate-600">{v.material}</p>
                  <p className="font-mono text-slate-500 text-[11px]">
                    Lifespan: <strong className="text-slate-900">{v.expectedLifespan}</strong> · {v.warranty}
                  </p>
                  {v.amazonUrl && (
                    <TrackedExternalLink
                      href={v.amazonUrl}
                      platform="Amazon.in"
                      itemSlug={item.slug}
                      location="variant_link"
                      className="inline-block font-mono font-bold text-slate-900 hover:underline pt-1"
                    >
                      View on Amazon.in ({v.price ?? "Check Price"}) →
                    </TrackedExternalLink>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

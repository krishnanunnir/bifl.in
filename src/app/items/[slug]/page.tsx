import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getItemBySlug, getAllItemSlugs } from "@/lib/db/queries/items";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TrackedExternalLink } from "@/components/tracked-external-link";
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
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <SiteHeader />

      <main id="main-content" className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10 space-y-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumbs" className="text-xs text-slate-400">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-slate-900">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href={`/category/${item.category}`} className="hover:text-slate-900 capitalize">
                {item.category.replace("_", " ")}
              </Link>
            </li>
            <li>/</li>
            <li className="text-slate-900 font-medium truncate max-w-xs">{item.title}</li>
          </ol>
        </nav>

        {/* Simple 2-Column Product Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Left: Product Image */}
          <div className="relative aspect-4/3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            <Image
              src={item.image}
              alt={item.title}
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* Right: Info & Buy Options */}
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {item.maker} · {item.yearEstablished}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
                {item.title}
              </h1>
              <p className="text-xl font-semibold text-slate-900 mt-2">
                {item.priceEstimate ?? item.priceRange}
              </p>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {item.desc}
            </p>

            {/* Where to Buy Online Section */}
            <div className="space-y-2.5 pt-2">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Available at
              </h2>
              <div className="flex flex-wrap gap-2">
                {item.retailLinks.map((r) => (
                  <TrackedExternalLink
                    key={r.platform}
                    href={r.url}
                    platform={r.platform}
                    itemSlug={item.slug}
                    location="item_detail_buy"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-400 text-xs font-medium text-slate-900 transition-all"
                  >
                    <span>{r.platform}</span>
                    {r.price && <strong className="font-semibold">{r.price}</strong>}
                    <span>→</span>
                  </TrackedExternalLink>
                ))}
              </div>
            </div>

            {/* Quick Specs Table */}
            <div className="border-t border-slate-100 pt-5 space-y-2 text-xs">
              <h2 className="font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Specifications
              </h2>
              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">System</span>
                  <span className="font-medium text-slate-900">{item.system}</span>
                </div>
                <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Status</span>
                  <span className="font-medium text-slate-900">{item.status}</span>
                </div>
                <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Lifespan</span>
                  <span className="font-medium text-slate-900">
                    {item.variants[0]?.expectedLifespan ?? "25+ Years"}
                  </span>
                </div>
                <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Warranty</span>
                  <span className="font-medium text-slate-900">
                    {item.variants[0]?.warranty ?? "Lifetime Spares"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Care & Maintenance */}
        {item.careGuide && (
          <section className="border-t border-slate-100 pt-8 space-y-3 max-w-3xl">
            <h2 className="text-lg font-bold text-slate-900">Care & Maintenance</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{item.careGuide}</p>
          </section>
        )}

        {/* Variants / Models List */}
        {item.variants.length > 1 && (
          <section className="border-t border-slate-100 pt-8 space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Models & Editions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {item.variants.map((v) => (
                <div key={v.variantNumber} className="simple-card p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{v.title}</span>
                    {v.price && <span className="font-semibold text-slate-900">{v.price}</span>}
                  </div>
                  <p className="text-slate-500">{v.material}</p>
                  <p className="text-slate-400 text-[11px]">Lifespan: {v.expectedLifespan}</p>
                  {v.amazonUrl && (
                    <TrackedExternalLink
                      href={v.amazonUrl}
                      platform="Amazon.in"
                      itemSlug={item.slug}
                      location="variant_link"
                      className="inline-block font-semibold text-slate-900 hover:underline pt-1"
                    >
                      View on Amazon.in →
                    </TrackedExternalLink>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

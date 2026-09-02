import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, getCategoryBySlug } from "@/lib/catalog/categories";
import { getItemsByCategory } from "@/data/items";
import { CategoryClient } from "./category-client";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SITE_NAME, absoluteUrl } from "@/lib/seo/site";

export const revalidate = 3600;

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const title = `${category.name} — Buy It For Life India`;
  const description = category.description;
  const canonicalPath = `/category/${category.slug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title,
      description,
      url: absoluteUrl(canonicalPath),
      siteName: SITE_NAME,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const items = getItemsByCategory(category.slug);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f6f0] text-[#1c1917]">
      <SiteHeader />
      <main id="main-content" className="site-main mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumbs" className="mb-6 font-mono text-xs text-[#78716c]">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:underline text-[#8c3b2b]">
                Home
              </Link>
            </li>
            <li>›</li>
            <li className="text-[#1c1917] font-semibold">{category.name}</li>
          </ol>
        </nav>

        {/* Category Hero Header */}
        <header className="rounded-2xl border border-[#e2dcd2] bg-[#ffffff] p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-3xl" aria-hidden="true">
              {category.icon}
            </span>
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-[#8a6325] font-bold">
                Category Directory
              </p>
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#1c1917]">
                {category.name}
              </h1>
            </div>
          </div>

          <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#57534e]">
            {category.description}
          </p>
        </header>

        {/* Filter & Product List Client Component */}
        <CategoryClient category={category} initialItems={items} />
      </main>
      <SiteFooter />
    </div>
  );
}

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
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <SiteHeader />
      <main id="main-content" className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumbs" className="mb-4 text-xs text-slate-400">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-slate-900">
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="text-slate-900 font-medium">{category.name}</li>
          </ol>
        </nav>

        {/* Minimal Category Header */}
        <header className="space-y-2 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{category.icon}</span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {category.name}
            </h1>
          </div>
          <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
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

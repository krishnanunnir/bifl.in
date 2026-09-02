import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getAllPublishedBlogPosts } from "@/lib/db/queries/blog";
import { MarkdownContent } from "@/components/markdown-content";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SITE_NAME, absoluteUrl } from "@/lib/seo/site";

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await getAllPublishedBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const title = `${post.title} — bifl.in`;
  const description = post.excerpt;
  const canonicalPath = `/blog/${post.slug}`;

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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <SiteHeader />
      <main id="main-content" className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12 space-y-8">
        <nav aria-label="Breadcrumbs" className="text-xs text-slate-400">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link href="/blog" className="hover:text-slate-900">
                Guides
              </Link>
            </li>
            <li>/</li>
            <li className="text-slate-900 font-medium truncate max-w-xs">{post.title}</li>
          </ol>
        </nav>

        <article className="space-y-6">
          <header className="space-y-3 pb-6 border-b border-slate-100">
            <p className="text-xs text-slate-400 font-mono">
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Editorial"}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
              {post.title}
            </h1>
            <p className="text-base text-slate-500 leading-relaxed italic">{post.excerpt}</p>
          </header>

          <div className="pt-2">
            <MarkdownContent content={post.bodyMarkdown} />
          </div>

          <footer className="mt-12 border-t border-slate-100 pt-6 flex items-center justify-between text-xs font-semibold">
            <Link href="/blog" className="text-slate-900 hover:underline">
              ← All Guides
            </Link>
            <Link href="/" className="text-slate-900 hover:underline">
              Browse Catalog →
            </Link>
          </footer>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}

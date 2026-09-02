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
    <div className="min-h-screen flex flex-col bg-[#f8f6f0] text-[#1c1917]">
      <SiteHeader />
      <main id="main-content" className="site-main mx-auto w-full max-w-3xl px-4 py-8 sm:px-8 sm:py-12">
        <nav aria-label="Breadcrumbs" className="mb-6 font-mono text-xs text-[#78716c]">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/blog" className="hover:underline text-[#8c3b2b]">
                Guides & Essays
              </Link>
            </li>
            <li>›</li>
            <li className="text-[#1c1917] font-semibold truncate max-w-xs">{post.title}</li>
          </ol>
        </nav>

        <article className="rounded-xl border border-[#e2dcd2] bg-[#ffffff] p-6 sm:p-10 shadow-sm">
          <header className="border-b border-[#ede7dc] pb-6">
            <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#8a6325]">
              Published{" "}
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Editorial"}
            </p>
            <h1 className="font-display mt-2 text-3xl font-bold tracking-tight text-[#1c1917] sm:text-4xl leading-tight">
              {post.title}
            </h1>
            <p className="mt-3 text-base text-[#57534e] leading-relaxed italic">{post.excerpt}</p>
          </header>

          <div className="mt-8">
            <MarkdownContent content={post.bodyMarkdown} />
          </div>

          <footer className="mt-10 border-t border-[#ede7dc] pt-6 flex items-center justify-between">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 font-bold text-xs font-mono uppercase text-[#8c3b2b] hover:underline"
            >
              ← Back to All Guides
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1 font-bold text-xs font-mono uppercase text-[#8c3b2b] hover:underline"
            >
              Browse Catalog →
            </Link>
          </footer>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}

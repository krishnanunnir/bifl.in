import type { Metadata } from "next";
import Link from "next/link";
import { getAllPublishedBlogPosts } from "@/lib/db/queries/blog";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SITE_NAME, absoluteUrl } from "@/lib/seo/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Care Guides & Engineering Essays — Buy It For Life India",
  description:
    "In-depth guides on seasoning Indian cast iron, maintaining mechanical watches, conditioning full-grain leather, and understanding generational metallurgy.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Care Guides & Engineering Essays — bifl.in",
    description: "In-depth guides on maintaining Indian heirloom goods.",
    url: absoluteUrl("/blog"),
    siteName: SITE_NAME,
  },
};

export default async function BlogIndexPage() {
  const posts = await getAllPublishedBlogPosts();

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f6f0] text-[#1c1917]">
      <SiteHeader />
      <main id="main-content" className="site-main mx-auto w-full max-w-4xl px-4 py-8 sm:px-8 sm:py-12">
        <div className="directory-heading mb-8">
          <div>
            <p className="eyebrow text-xs uppercase font-mono tracking-widest text-[#8a6325] font-semibold mb-1">
              Knowledge & Maintenance
            </p>
            <h1 className="font-display">Care Guides & Essays</h1>
          </div>
          <p>{posts.length} articles</p>
        </div>

        <div className="grid gap-6">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="rounded-xl border border-[#e2dcd2] bg-[#ffffff] p-6 shadow-sm transition-all hover:border-[#8c3b2b]/40 hover:shadow-md"
            >
              <div className="flex items-center justify-between text-xs font-mono text-[#78716c]">
                <span>
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "Curated Guide"}
                </span>
                <span className="text-[#8c3b2b] uppercase tracking-wider font-bold">Heirloom Guide</span>
              </div>

              <h2 className="font-display mt-2 text-2xl font-bold text-[#1c1917] hover:text-[#8c3b2b] transition-colors">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>

              <p className="mt-2.5 text-sm leading-relaxed text-[#57534e]">{post.excerpt}</p>

              <div className="mt-4">
                <Link
                  href={`/blog/${post.slug}`}
                  className="font-mono text-xs font-bold uppercase tracking-wider text-[#8c3b2b] hover:underline"
                >
                  Read Full Guide →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

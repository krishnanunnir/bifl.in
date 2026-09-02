import type { Metadata } from "next";
import Link from "next/link";
import { getAllPublishedBlogPosts } from "@/lib/db/queries/blog";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SITE_NAME, absoluteUrl } from "@/lib/seo/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Care Guides & Essays — Buy It For Life India",
  description: "In-depth guides on maintaining Indian cast iron, mechanical watches, and full-grain leather.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Care Guides & Essays — bifl.in",
    description: "In-depth guides on maintaining Indian heirloom goods.",
    url: absoluteUrl("/blog"),
    siteName: SITE_NAME,
  },
};

export default async function BlogIndexPage() {
  const posts = await getAllPublishedBlogPosts();

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <SiteHeader />
      <main id="main-content" className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12 space-y-8">
        <div className="space-y-2 pb-6 border-b border-slate-100">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Care Guides & Essays
          </h1>
          <p className="text-sm text-slate-500">
            Practical care, engineering teardowns, and maintenance tips for Indian goods.
          </p>
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="simple-card p-6 space-y-2 group"
            >
              <span className="text-xs text-slate-400">
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "Guide"}
              </span>

              <h2 className="text-lg font-bold text-slate-900 group-hover:text-slate-700">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>

              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {post.excerpt}
              </p>

              <div className="pt-2">
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-xs font-semibold text-slate-900 hover:underline"
                >
                  Read Guide →
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

import { cache } from "react";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://rpyjfiwqicynqtyrqhjy.supabase.co";
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJweWpmaXdxaWN5bnF0eXJxaGp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMzkzNzMsImV4cCI6MjEwMzkxNTM3M30.6mU29WHfw0AZfhKhJcRJjLaqtaP5_0LbvJWs8uV47yw";

const supabase = createClient(url, key, {
  auth: { persistSession: false },
});

export type BlogPostSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  authorEmail: string;
  publishedAt: Date | null;
};

export type BlogPostDetail = BlogPostSummary & {
  bodyMarkdown: string;
};

export const getAllPublishedBlogPosts = cache(async (): Promise<BlogPostSummary[]> => {
  try {
    const { data: rows, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, author_email, published_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    if (error || !rows) {
      console.error("[bifl.in] Failed to fetch blog posts from Supabase:", error);
      return [];
    }

    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      slug: r.slug,
      excerpt: r.excerpt,
      authorEmail: r.author_email,
      publishedAt: r.published_at ? new Date(r.published_at) : null,
    }));
  } catch (error) {
    console.error("[bifl.in] getAllPublishedBlogPosts unhandled error:", error);
    return [];
  }
});

export const getBlogPostBySlug = cache(async (slug: string): Promise<BlogPostDetail | null> => {
  try {
    const { data: row, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, body_markdown, author_email, published_at")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (error || !row) return null;

    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      bodyMarkdown: row.body_markdown,
      authorEmail: row.author_email,
      publishedAt: row.published_at ? new Date(row.published_at) : null,
    };
  } catch (error) {
    console.error("[bifl.in] getBlogPostBySlug unhandled error:", error);
    return null;
  }
});

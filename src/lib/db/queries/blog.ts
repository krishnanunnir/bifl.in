import { cache } from "react";
import { desc, eq } from "drizzle-orm";
import { db } from "../index";
import { blogPosts } from "../schema";

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

const STATIC_BLOG_POSTS: BlogPostDetail[] = [
  {
    id: "post-1",
    title: "The Art of Seasoning Indian Cast Iron: From Raw Grey Metal to Glassy Black Patina",
    slug: "art-of-seasoning-indian-cast-iron",
    excerpt: "Why modern synthetic non-stick coatings are a temporary illusion, and how traditional cold-pressed gingelly and mustard oils chemically polymerize into an indestructible heirloom cooking surface.",
    bodyMarkdown: `
# The Art of Seasoning Indian Cast Iron

In an era of disposable teflon pans that flake toxic fluoropolymers after two years, Indian cast iron (*Irumbu Vaanali* / *Loha Kadai*) stands as the ultimate testament to Buy It For Life philosophy.

## Why Cast Iron Outlasts Every Synthetic Coating

When you cook with cold-pressed gingelly (sesame) or mustard oil at high heat, the unsaturated fatty acids undergo **cross-linking polymerization**. The oil literally bonds to the porous microscopic crevices of the iron matrix, creating a glassy, slick, hydrophobic layer that:
1. **Never flakes or degrades**
2. **Naturally enriches your food with bio-available dietary iron**
3. **Improves with every single tadka, roast, and deep fry**

\`\`\`
Raw Grey Cast Iron ➔ High Heat Oil Polymerization ➔ Jet-Black Mirror Patina ➔ Generational Heirloom
\`\`\`

## The 3-Step Traditional Curing Method

### 1. The Rice-Water Scrub
Wash the raw iron thoroughly with warm water and coarse salt. Boil thick rice starch water (*kanji*) in the vessel for 30 minutes to open the iron pores and draw out foundry residues.

### 2. The Onion Roast
Heat 2 tablespoons of mustard or gingelly oil until smoking. Add finely sliced shallots or onions and roast them across the entire wall until charred dark brown. The natural sulfur in onions acts as a catalyst for cross-linking.

### 3. The Low-Oven Bake
Wipe away excess oil until the pan looks barely damp. Place upside-down in a 220°C oven for 60 minutes. Allow to cool completely inside the oven.

Repeat twice for an impenetrable non-stick finish that will easily outlive your grandchildren.
    `,
    authorEmail: "curator@bifl.in",
    publishedAt: new Date("2026-08-15"),
  },
  {
    id: "post-2",
    title: "Deconstructing the Hawkins Futura: Why It Outlives Modern Electronics by Decades",
    slug: "why-hawkins-futura-hard-anodized-lasts-30-years",
    excerpt: "An engineering breakdown of Hawkins' 6.34mm hard-anodized base, the unburstable inner lid safety geometry, and the brilliance of modular replaceable gaskets.",
    bodyMarkdown: `
# Deconstructing the Hawkins Futura

In 1959, H.D. Vasudeva established Hawkins in Thane, Maharashtra with a singular mechanical principle: **A pressure cooker should be impossible to blow open, and every single wearing part should be replaceable by the user.**

## 1. The Inner-Lid Physics
Most modern electric cookers rely on plastic interlocks and fragile micro-switches. Hawkins utilizes an oval inner-fitting lid larger than the cooker's mouth. 

> *The lid can only be inserted sideways and pulled upwards against the rim. As internal steam pressure builds, the steam itself locks the lid tighter against the gasket. It is physically impossible to pry open until all pressure has subsided.*

## 2. 6.34mm Hard Anodizing vs Teflon
Teflon (PTFE) softens and vaporizes at temperatures common to Indian high-heat tadkas. Hawkins Futura electro-chemically oxidizes high-purity virgin aluminium into aluminium oxide—a ceramic surface second only to diamond in hardness.
- Non-reactive to tamarind, kokum, and lemon
- Will not chip, peel, or blister
- 60% faster heat conduction than stainless steel

## 3. The 100% Spare Parts Ecosystem
Every town in India has a Hawkins authorized spare parts store. Whether you need an A-10-09 sealing ring, an A-10-04 safety valve, or phenolic bakelite handles, they cost under ₹100 and install with a basic screwdriver.
    `,
    authorEmail: "curator@bifl.in",
    publishedAt: new Date("2026-08-20"),
  },
  {
    id: "post-3",
    title: "Indian Fountain Pen Renaissance: Kanwrite, Click, and the Legacy of Ebonite",
    slug: "indian-fountain-pen-renaissance",
    excerpt: "Exploring the century-old craftsmanship of Kanpur nib masters and Mumbai ebonite turners who craft pens that write for generations without electronic planned obsolescence.",
    bodyMarkdown: `
# Indian Fountain Pen Renaissance

While the world drifted to disposable plastic ballpoints that end up in landfills by the billions, a quiet sanctum of hereditary penmakers in Kanpur and Mumbai kept the pure mechanical craft alive.

## The Magic of Vulcanized Ebonite
Natural rubber combined with sulfur and vulcanized into **ebonite** produces a dense, warm, hard substance impervious to acid and ink rot.

- **Thermal Stability:** Ebonite expands and contracts minimally with body heat, preventing annoying ink burping on flights or long writing sessions.
- **Ebonite Feeds:** Unlike molded plastic feeds, ebonite feeds are hand-cut and can be heat-set with warm water to conform perfectly to any gold or steel nib.

## Kanwrite: The Global Nib Secret
From their factory in Kanpur, Kanpur Writers (founded 1986 by Shri Ram Krishna Awasthi) manufactures millions of nibs with in-house tipping alloys. Their Ultra-Flex #6 nibs provide expressive calligraphy flourishes at a fraction of luxury European prices.
    `,
    authorEmail: "curator@bifl.in",
    publishedAt: new Date("2026-08-28"),
  },
];

export const getAllPublishedBlogPosts = cache(async (): Promise<BlogPostSummary[]> => {
  const connectionString = process.env.POSTGRES_URL ?? "";
  const placeholder =
    !connectionString ||
    connectionString.includes("[PROJECT-REF]") ||
    connectionString.includes("dummy");

  if (placeholder) {
    return STATIC_BLOG_POSTS.map(({ bodyMarkdown, ...summary }) => summary);
  }

  try {
    const rows = await db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        slug: blogPosts.slug,
        excerpt: blogPosts.excerpt,
        authorEmail: blogPosts.authorEmail,
        publishedAt: blogPosts.publishedAt,
      })
      .from(blogPosts)
      .where(eq(blogPosts.isPublished, true))
      .orderBy(desc(blogPosts.publishedAt));

    return rows.length > 0 ? rows : STATIC_BLOG_POSTS.map(({ bodyMarkdown, ...summary }) => summary);
  } catch {
    return STATIC_BLOG_POSTS.map(({ bodyMarkdown, ...summary }) => summary);
  }
});

export const getBlogPostBySlug = cache(async (slug: string): Promise<BlogPostDetail | null> => {
  const connectionString = process.env.POSTGRES_URL ?? "";
  const placeholder =
    !connectionString ||
    connectionString.includes("[PROJECT-REF]") ||
    connectionString.includes("dummy");

  if (placeholder) {
    return STATIC_BLOG_POSTS.find((p) => p.slug === slug) ?? null;
  }

  try {
    const row = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.slug, slug),
    });
    if (row && row.isPublished) return row;
    return STATIC_BLOG_POSTS.find((p) => p.slug === slug) ?? null;
  } catch {
    return STATIC_BLOG_POSTS.find((p) => p.slug === slug) ?? null;
  }
});

import { db, closeDb } from "./index";
import {
  makers,
  items,
  variants,
  tags,
  platforms,
  itemMakers,
  blogPosts,
} from "./schema";
import { items as canonicalItems } from "../../data/items";
import { CANONICAL_TAGS } from "../catalog/types";

async function seed() {
  console.log("🌱 Starting bifl.in database seeding...");

  // 1. Seed platforms
  console.log("  → Seeding platforms...");
  const platformData = [
    { slug: "amazon-in", displayName: "Amazon.in", iconPath: "/platforms/amazon.svg" },
    { slug: "flipkart", displayName: "Flipkart", iconPath: "/platforms/store.svg" },
    { slug: "croma", displayName: "Croma", iconPath: "/platforms/store.svg" },
    { slug: "reliance-digital", displayName: "Reliance Digital", iconPath: "/platforms/store.svg" },
    { slug: "official-store", displayName: "Official Store", iconPath: "/platforms/store.svg" },
    { slug: "tata-cliq", displayName: "Tata CLiQ", iconPath: "/platforms/store.svg" },
    { slug: "artisan-guild", displayName: "Artisan Guild", iconPath: "/platforms/store.svg" },
  ];

  for (const p of platformData) {
    await db.insert(platforms).values(p).onConflictDoNothing();
  }

  // 2. Seed tags
  console.log("  → Seeding tags...");
  for (const t of CANONICAL_TAGS) {
    await db.insert(tags).values(t).onConflictDoNothing();
  }

  // 3. Seed makers & items
  console.log("  → Seeding items and variants...");
  let order = 0;
  for (const item of canonicalItems) {
    order++;
    const makerSlug = item.maker.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    // Insert or find maker
    const [makerRow] = await db
      .insert(makers)
      .values({
        name: item.maker,
        slug: makerSlug,
        originLocation: item.yearEstablished,
      })
      .onConflictDoUpdate({
        target: makers.slug,
        set: { name: item.maker },
      })
      .returning();

    // Insert item
    const [itemRow] = await db
      .insert(items)
      .values({
        title: item.title,
        slug: item.slug,
        subtitle: item.subtitle,
        description: item.desc,
        careGuide: item.careGuide,
        systemLabel: item.system,
        displayCategory: item.category,
        imagePath: item.image,
        status: item.status,
        originLabel: item.yearEstablished,
        amazonUrl: item.amazonUrl,
        officialStoreUrl: item.officialStoreUrl,
        isPublished: true,
        catalogOrder: order,
        makerDisplay: item.maker,
        variantCount: item.variants.length,
        childRatings: item.variants.map((v) => v.durabilityScore),
        availabilityJson: item.retailLinks.map((r) => ({ name: r.platform, href: r.url })),
        tagsJson: item.tags ?? [],
      })
      .onConflictDoUpdate({
        target: items.slug,
        set: {
          title: item.title,
          description: item.desc,
          careGuide: item.careGuide,
          variantCount: item.variants.length,
          childRatings: item.variants.map((v) => v.durabilityScore),
          availabilityJson: item.retailLinks.map((r) => ({ name: r.platform, href: r.url })),
          tagsJson: item.tags ?? [],
        },
      })
      .returning();

    // Link item to maker
    await db
      .insert(itemMakers)
      .values({
        itemId: itemRow.id,
        makerId: makerRow.id,
        makerOrder: 0,
      })
      .onConflictDoNothing();

    // Insert variants
    for (const v of item.variants) {
      const vSlug = v.slug || `model-${v.variantNumber}`;
      await db
        .insert(variants)
        .values({
          itemId: itemRow.id,
          slug: vSlug,
          variantNumber: v.variantNumber,
          title: v.title,
          imagePath: v.image,
          asin: v.asin,
          amazonUrl: v.amazonUrl,
          material: v.material,
          warranty: v.warranty,
          expectedLifespan: v.expectedLifespan,
          specsJson: v.specs,
          durabilityScore: String(v.durabilityScore),
        })
        .onConflictDoUpdate({
          target: [variants.itemId, variants.slug],
          set: {
            title: v.title,
            durabilityScore: String(v.durabilityScore),
            expectedLifespan: v.expectedLifespan,
          },
        });
    }
  }

  // 4. Seed initial blog posts
  console.log("  → Seeding blog essays...");
  await db
    .insert(blogPosts)
    .values({
      title: "The Art of Seasoning Indian Cast Iron: From Raw Grey Metal to Glassy Black Patina",
      slug: "art-of-seasoning-indian-cast-iron",
      excerpt:
        "Why modern synthetic non-stick coatings are a temporary illusion, and how traditional cold-pressed oils create an indestructible cooking surface.",
      bodyMarkdown:
        "# The Art of Seasoning Indian Cast Iron\n\nIndian cast iron is the ultimate heirloom kitchen tool...",
      authorEmail: "curator@bifl.in",
      isPublished: true,
      publishedAt: new Date(),
    })
    .onConflictDoNothing();

  console.log("✅ bifl.in database seeded successfully!");
}

seed()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await closeDb();
  });

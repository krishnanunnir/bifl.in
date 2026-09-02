import { db, closeDb } from "./index";
import { sql } from "drizzle-orm";
import { items, makers, variants, tags, blogPosts } from "./schema";

async function verify() {
  console.log("🔍 Verifying bifl.in database state...");

  const [itemCount] = await db.select({ c: sql<number>`count(*)::int` }).from(items);
  const [makerCount] = await db.select({ c: sql<number>`count(*)::int` }).from(makers);
  const [variantCount] = await db.select({ c: sql<number>`count(*)::int` }).from(variants);
  const [tagCount] = await db.select({ c: sql<number>`count(*)::int` }).from(tags);
  const [postCount] = await db.select({ c: sql<number>`count(*)::int` }).from(blogPosts);

  console.log(`  • Items in DB:    ${itemCount?.c ?? 0}`);
  console.log(`  • Makers in DB:   ${makerCount?.c ?? 0}`);
  console.log(`  • Variants in DB: ${variantCount?.c ?? 0}`);
  console.log(`  • Tags in DB:     ${tagCount?.c ?? 0}`);
  console.log(`  • Blog Posts:     ${postCount?.c ?? 0}`);

  if ((itemCount?.c ?? 0) === 0) {
    console.warn("⚠️ Warning: No items found in database (seed might be required).");
  } else {
    console.log("✅ Database verification passed!");
  }
}

verify()
  .catch((e) => {
    console.error("❌ Verification failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await closeDb();
  });

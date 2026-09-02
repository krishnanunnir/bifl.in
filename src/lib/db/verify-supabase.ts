import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://rpyjfiwqicynqtyrqhjy.supabase.co";
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJweWpmaXdxaWN5bnF0eXJxaGp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMzkzNzMsImV4cCI6MjEwMzkxNTM3M30.6mU29WHfw0AZfhKhJcRJjLaqtaP5_0LbvJWs8uV47yw";

const supabase = createClient(url, key);

async function main() {
  console.log("🔍 Checking Supabase project tables...");

  const { data: items, error: itemsError } = await supabase
    .from("items")
    .select("id, title, slug, maker_display, status, availability_json, variants(*)");

  if (itemsError) {
    console.error("❌ Failed to query Supabase items:", itemsError);
    process.exit(1);
  }

  console.log(`✅ Supabase query succeeded! Found ${items.length} items:`);
  for (const item of items) {
    console.log(` - [${item.slug}] ${item.title} (Variants: ${(item.variants as any[]).length})`);
  }
}

main();

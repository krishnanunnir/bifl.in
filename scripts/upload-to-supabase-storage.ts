import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://rpyjfiwqicynqtyrqhjy.supabase.co";
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJweWpmaXdxaWN5bnF0eXJxaGp5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODMzOTM3MywiZXhwIjoyMTAzOTE1MzczfQ.Mi_I1GWIjQoaVIhCY7BWjn4drO8zzDoyAmHXZ8gKraY";

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

async function main() {
  console.log("🚀 Uploading iPhone 17 official photography to Supabase Storage bucket 'products'...");

  const filePath = path.join(process.cwd(), "public/images/products/iphone-17.jpg");
  const fileBuffer = fs.readFileSync(filePath);

  // 1. Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("products")
    .upload("iphone-17.jpg", fileBuffer, {
      contentType: "image/jpeg",
      upsert: true,
    });

  if (uploadError) {
    console.error("❌ Failed to upload to Supabase Storage:", uploadError);
    process.exit(1);
  }

  console.log("✅ File successfully uploaded to Supabase Storage:", uploadData);

  // 2. Get Public URL
  const { data: publicUrlData } = supabase.storage
    .from("products")
    .getPublicUrl("iphone-17.jpg");

  const publicUrl = publicUrlData.publicUrl;
  console.log("🌐 Supabase Public URL:", publicUrl);

  // 3. Update Database records in Supabase
  const { error: dbError } = await supabase
    .from("items")
    .update({ image_path: "iphone-17.jpg" })
    .eq("slug", "iphone-17");

  if (dbError) {
    console.error("❌ Failed to update items table:", dbError);
    process.exit(1);
  }

  const { error: vError } = await supabase
    .from("variants")
    .update({ image_path: "iphone-17.jpg" })
    .eq("item_id", "22222222-2222-2222-2222-222222222299");

  if (vError) {
    console.error("❌ Failed to update variants table:", vError);
    process.exit(1);
  }

  console.log("✅ Supabase Database updated with storage image path 'iphone-17.jpg'!");
}

main();

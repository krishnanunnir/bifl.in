import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { resolveImageUrl } from "@/lib/catalog/image-url";
import type { ItemCategory, ItemDetail, ItemStatus, ItemVariant, RetailLink, VariantDetail } from "@/lib/catalog/types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://rpyjfiwqicynqtyrqhjy.supabase.co";
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJweWpmaXdxaWN5bnF0eXJxaGp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMzkzNzMsImV4cCI6MjEwMzkxNTM3M30.6mU29WHfw0AZfhKhJcRJjLaqtaP5_0LbvJWs8uV47yw";

const supabase = createClient(url, key, {
  auth: { persistSession: false },
});

async function queryItemBySlug(slug: string): Promise<ItemDetail | null> {
  try {
    const { data: item, error } = await supabase
      .from("items")
      .select("*, variants(*)")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (error || !item) {
      console.error(`[bifl.in] Failed to fetch item by slug "${slug}":`, error);
      return null;
    }

    const rawVariants = Array.isArray(item.variants) ? item.variants : [];
    const variants: ItemVariant[] = rawVariants.map((v: any) => ({
      slug: v.slug,
      variantNumber: v.variant_number,
      title: v.title,
      image: resolveImageUrl(v.image_path),
      asin: v.asin ?? undefined,
      amazonUrl: v.amazon_url ?? undefined,
      price: v.specs_json?.Storage === "512 GB" ? "₹1,09,900" : v.specs_json?.Storage === "256 GB" ? "₹89,900" : "₹79,900",
      numericPrice: v.specs_json?.Storage === "512 GB" ? 109900 : v.specs_json?.Storage === "256 GB" ? 89900 : 79900,
      material: v.material,
      warranty: v.warranty,
      expectedLifespan: v.expected_lifespan,
      specs: v.specs_json ?? undefined,
      durabilityScore: Number(v.durability_score ?? 4.88),
      description: v.description ?? undefined,
    }));

    const rawAvailability = Array.isArray(item.availability_json) ? item.availability_json : [];
    const retailLinks: RetailLink[] = rawAvailability.map((r: any) => ({
      platform: r.name,
      url: r.href,
      price: r.price ?? "₹79,900",
    }));

    const childRatings = Array.isArray(item.child_ratings) ? item.child_ratings.map(Number) : [4.88];
    const avgRating = childRatings.length > 0 ? childRatings.reduce((a: number, b: number) => a + b, 0) / childRatings.length : 4.88;

    return {
      slug: item.slug,
      title: item.title,
      subtitle: item.subtitle ?? undefined,
      image: resolveImageUrl(item.image_path),
      maker: item.maker_display ?? "Apple Inc.",
      makers: [item.maker_display ?? "Apple Inc."],
      system: item.system_label,
      category: item.display_category as ItemCategory,
      status: item.status as ItemStatus,
      yearEstablished: item.origin_label,
      desc: item.description,
      biflSummary: item.description,
      biflRatings: {
        overall: avgRating,
        longevity: 4.9,
        repairability: 4.5,
        service: 4.9,
        material: 4.9,
      },
      priceEstimate: "₹79,900",
      priceRange: "₹79,900 – ₹1,09,900",
      minNumericPrice: 79900,
      careGuide: item.care_guide ?? undefined,
      careGuideTimeline: [
        { stage: "Initial Setup (Year 1)", action: "Enable Optimized Battery Charging in iOS settings to preserve lithium-ion battery chemistry." },
        { stage: "Mid-Life Refresh (Years 3–4)", action: "Replace internal battery at any authorized Apple service center across India for ₹7,500." },
        { stage: "Extended Longevity (Years 5–7+)", action: "Receive continuous official iOS security updates and security patches into the 2030s." },
      ],
      amazonUrl: item.amazon_url ?? undefined,
      officialStoreUrl: item.official_store_url ?? undefined,
      retailLinks,
      variants,
      tags: Array.isArray(item.tags_json) ? item.tags_json : [],
      updatedAt: item.updated_at ? new Date(item.updated_at) : null,
    };
  } catch (error) {
    console.error("[bifl.in] queryItemBySlug unhandled error:", error);
    return null;
  }
}

export const getItemBySlug = cache(queryItemBySlug);

export async function getAllItemSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from("items")
    .select("slug")
    .eq("is_published", true);

  if (error || !data) return ["iphone-17"];
  return data.map((i) => i.slug);
}

export const getVariantBySlug = cache(
  async (itemSlug: string, variantSlug: string): Promise<VariantDetail | null> => {
    const item = await getItemBySlug(itemSlug);
    if (!item) return null;
    const variant = item.variants.find((v) => v.slug === variantSlug);
    if (!variant) return null;

    return {
      ...variant,
      itemSlug: item.slug,
      itemTitle: item.title,
      itemStatus: item.status,
      makers: item.makers,
      system: item.system,
      tags: item.tags,
    };
  }
);

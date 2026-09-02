import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { resolveImageUrl } from "@/lib/catalog/image-url";
import type {
  ItemCategory,
  ItemStatus,
  ItemSummary,
  RetailLink,
} from "@/lib/catalog/types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://rpyjfiwqicynqtyrqhjy.supabase.co";
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJweWpmaXdxaWN5bnF0eXJxaGp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMzkzNzMsImV4cCI6MjEwMzkxNTM3M30.6mU29WHfw0AZfhKhJcRJjLaqtaP5_0LbvJWs8uV47yw";

const supabase = createClient(url, key, {
  auth: { persistSession: false },
});

export const PAGE_SIZE = 10;

export type CatalogFilters = {
  status?: ItemStatus;
};

export type CatalogPage = {
  items: ItemSummary[];
  total: number;
  page: number;
  pageCount: number;
};

const allowedStatuses: ReadonlySet<ItemStatus> = new Set(["In Production", "Heritage"]);

export function normalizeCatalogFilters(
  filters: { status?: string } = {}
): CatalogFilters {
  return {
    ...(filters.status && allowedStatuses.has(filters.status as ItemStatus)
      ? { status: filters.status as ItemStatus }
      : {}),
  };
}

async function queryCatalogPage(
  rawPage: number = 1,
  rawFilters: CatalogFilters = {}
): Promise<CatalogPage> {
  const filters = normalizeCatalogFilters(rawFilters);
  const page = Math.max(1, Math.floor(rawPage));
  const offset = (page - 1) * PAGE_SIZE;

  try {
    let query = supabase
      .from("items")
      .select("id, slug, title, subtitle, description, care_guide, system_label, display_category, image_path, status, origin_label, amazon_url, official_store_url, maker_display, variant_count, child_ratings, availability_json, tags_json", { count: "exact" })
      .eq("is_published", true)
      .order("catalog_order", { ascending: true })
      .range(offset, offset + PAGE_SIZE - 1);

    if (filters.status) {
      query = query.eq("status", filters.status);
    }

    const { data: rows, count, error } = await query;

    if (error || !rows) {
      console.error("[bifl.in] Supabase queryCatalogPage error:", error);
      return { items: [], total: 0, page: 1, pageCount: 1 };
    }

    const total = count ?? rows.length;
    const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

    const items: ItemSummary[] = rows.map((row) => {
      const childRatings = Array.isArray(row.child_ratings) ? row.child_ratings.map(Number) : [4.88];
      const avgRating = childRatings.length > 0 ? childRatings.reduce((a: number, b: number) => a + b, 0) / childRatings.length : 4.88;

      const rawAvailability = Array.isArray(row.availability_json) ? row.availability_json : [];
      const retailLinks: RetailLink[] = rawAvailability.map((r: any) => ({
        platform: r.name,
        url: r.href,
        price: r.price ?? "₹79,900",
      }));

      return {
        slug: row.slug,
        title: row.title,
        subtitle: row.subtitle ?? undefined,
        image: resolveImageUrl(row.image_path),
        maker: row.maker_display ?? "Apple Inc.",
        system: row.system_label,
        category: row.display_category as ItemCategory,
        status: row.status as ItemStatus,
        yearEstablished: row.origin_label,
        desc: row.description,
        biflSummary: row.description,
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
        careGuide: row.care_guide ?? undefined,
        amazonUrl: row.amazon_url ?? undefined,
        officialStoreUrl: row.official_store_url ?? undefined,
        retailLinks,
        variantCount: row.variant_count ?? 3,
        variantScores: childRatings,
        tags: Array.isArray(row.tags_json) ? row.tags_json : [],
      };
    });

    return {
      items,
      total,
      page,
      pageCount,
    };
  } catch (error) {
    console.error("[bifl.in] queryCatalogPage unhandled exception:", error);
    return { items: [], total: 0, page: 1, pageCount: 1 };
  }
}

export const getCatalogPage = cache(queryCatalogPage);

export const getAllPublishedItemSummaries = cache(async (): Promise<ItemSummary[]> => {
  const result = await getCatalogPage(1);
  return result.items;
});

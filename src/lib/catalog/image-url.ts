import type { Item } from "./types";

export function resolveImageUrl(imagePath?: string | null): string {
  if (!imagePath || imagePath.trim() === "") {
    return "https://rpyjfiwqicynqtyrqhjy.supabase.co/storage/v1/object/public/products/iphone-17.jpg";
  }

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  const baseSupabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://rpyjfiwqicynqtyrqhjy.supabase.co").replace(/\/+$/, "");
  const cleanPath = imagePath
    .replace(/^\/+/, "")
    .replace(/^images\/products\//, "")
    .replace(/^products\//, "")
    .replace(/^images\//, "");

  return `${baseSupabaseUrl}/storage/v1/object/public/products/${cleanPath}`;
}

export function normalizeItemImages(item: Item): Item {
  return {
    ...item,
    image: resolveImageUrl(item.image),
    variants: item.variants.map((variant) => ({
      ...variant,
      image: resolveImageUrl(variant.image),
    })),
  };
}

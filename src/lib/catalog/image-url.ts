import type { Item } from "./types";

export function resolveImageUrl(imagePath?: string | null): string {
  if (!imagePath) {
    return "/images/placeholder.svg";
  }

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://") || imagePath.startsWith("/")) {
    return imagePath;
  }

  const baseSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (baseSupabaseUrl) {
    return `${baseSupabaseUrl.replace(/\/+$/, "")}/storage/v1/object/public/images/${imagePath.replace(/^\/+/, "")}`;
  }

  return `/images/${imagePath.replace(/^\/+/, "")}`;
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

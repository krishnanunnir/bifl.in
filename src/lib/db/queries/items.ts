import { cache } from "react";
import { eq } from "drizzle-orm";
import { db } from "../index";
import { items as itemsTable, variants as variantsTable } from "../schema";
import { normalizeItemImages, resolveImageUrl } from "@/lib/catalog/image-url";
import { normalizeRetailAvailability } from "@/lib/catalog/availability";
import type { Item, ItemDetail, VariantDetail } from "@/lib/catalog/types";

function fallbackFindItem(slug: string): ItemDetail | null {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { items: staticItems } = require("@/data/items") as { items: Item[] };
  const found = staticItems.find((i) => i.slug === slug);
  if (!found) return null;
  const normalized = normalizeItemImages(found);

  const timeline = normalized.careGuide
    ? [
        { stage: "Initial Setup / First 30 Days", action: "Wash gently, perform initial inspection, cure or season if required." },
        { stage: "Routine Care (Years 1–5)", action: "Maintain regularly with proper cleaning and periodic conditioning." },
        { stage: "Generational Longevity (Decades)", action: "Replace standard wear parts (gaskets, springs) for indefinite service." },
      ]
    : null;

  return {
    ...normalized,
    makers: [normalized.maker],
    careGuideTimeline: timeline,
    updatedAt: new Date(),
  };
}

async function queryItemBySlug(slug: string): Promise<ItemDetail | null> {
  const connectionString = process.env.POSTGRES_URL ?? "";
  const placeholder =
    !connectionString ||
    connectionString.includes("[PROJECT-REF]") ||
    connectionString.includes("[PASSWORD]") ||
    connectionString.includes("dummy") ||
    connectionString.includes("postgres.example");

  if (placeholder) {
    return fallbackFindItem(slug);
  }

  try {
    const itemRow = await db.query.items.findFirst({
      where: eq(itemsTable.slug, slug),
      with: {
        variants: {
          orderBy: (v, { asc }) => [asc(v.variantNumber)],
        },
        makers: {
          with: {
            maker: true,
          },
          orderBy: (m, { asc }) => [asc(m.makerOrder)],
        },
        tags: {
          with: {
            tag: true,
          },
        },
        platforms: {
          orderBy: (p, { asc }) => [asc(p.sortOrder)],
        },
      },
    });

    if (!itemRow) return fallbackFindItem(slug);

    const makersList = itemRow.makers.map((m) => m.maker.name);
    const variantsList = itemRow.variants.map((v) => ({
      slug: v.slug,
      variantNumber: v.variantNumber,
      title: v.title,
      image: resolveImageUrl(v.imagePath),
      asin: v.asin ?? undefined,
      amazonUrl: v.amazonUrl ?? undefined,
      officialUrl: v.officialUrl ?? undefined,
      material: v.material,
      warranty: v.warranty,
      expectedLifespan: v.expectedLifespan,
      specs: v.specsJson ?? undefined,
      durabilityScore: Number(v.durabilityScore),
      description: v.description ?? undefined,
    }));

    return {
      slug: itemRow.slug,
      title: itemRow.title,
      subtitle: itemRow.subtitle ?? undefined,
      image: resolveImageUrl(itemRow.imagePath),
      maker: itemRow.makerDisplay ?? makersList.join(", "),
      makers: makersList,
      system: itemRow.systemLabel,
      category: itemRow.displayCategory,
      status: itemRow.status,
      yearEstablished: itemRow.originLabel,
      desc: itemRow.description,
      careGuide: itemRow.careGuide ?? undefined,
      careGuideTimeline: [
        { stage: "Initial Setup / First 30 Days", action: "Wash gently, perform initial inspection, cure or season if required." },
        { stage: "Routine Care (Years 1–5)", action: "Maintain regularly with proper cleaning and periodic conditioning." },
        { stage: "Generational Longevity (Decades)", action: "Replace standard wear parts (gaskets, springs) for indefinite service." },
      ],
      amazonUrl: itemRow.amazonUrl ?? undefined,
      officialStoreUrl: itemRow.officialStoreUrl ?? undefined,
      retailLinks: normalizeRetailAvailability(
        itemRow.platforms.map((p) => ({
          name: p.platformSlug as any,
          href: p.href,
        })),
        itemRow.amazonUrl,
        itemRow.officialStoreUrl
      ).map((a) => ({ platform: a.name, url: a.href })),
      variants: variantsList,
      tags: itemRow.tags.map((t) => ({
        slug: t.tag.slug,
        name: t.tag.name,
        category: t.tag.category as any,
        isPrimary: t.isPrimary,
      })),
      updatedAt: itemRow.updatedAt,
    };
  } catch (error) {
    console.error("[bifl.in] queryItemBySlug failed", error);
    return fallbackFindItem(slug);
  }
}

export const getItemBySlug = cache(queryItemBySlug);

export async function getAllItemSlugs(): Promise<string[]> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { items: staticItems } = require("@/data/items") as { items: Item[] };
  return staticItems.map((i) => i.slug);
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

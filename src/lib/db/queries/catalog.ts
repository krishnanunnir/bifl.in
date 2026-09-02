import { cache } from "react";
import { and, asc, eq, sql } from "drizzle-orm";

import { db } from "../index";
import { items as itemsTable } from "../schema";
import { normalizeItemImages, resolveImageUrl } from "@/lib/catalog/image-url";
import { normalizeRetailAvailability } from "@/lib/catalog/availability";
import type {
  Item,
  ItemCategory,
  ItemStatus,
  ItemSummary,
  PlatformName,
} from "@/lib/catalog/types";

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

const allowedCategories: ReadonlySet<ItemCategory> = new Set([
  "cookware",
  "appliances",
  "leather_edc",
  "timepieces",
  "stationery",
  "home_hardware",
]);

const allowedStatuses: ReadonlySet<ItemStatus> = new Set(["In Production", "Heritage"]);

function clampPage(input: number | undefined): number {
  if (!Number.isFinite(input) || !input) return 1;
  return Math.max(1, Math.floor(input));
}

export function normalizeCatalogFilters(
  filters: { status?: string } = {}
): CatalogFilters {
  return {
    ...(filters.status && allowedStatuses.has(filters.status as ItemStatus)
      ? { status: filters.status as ItemStatus }
      : {}),
  };
}

function fixtureSummary(item: Item): ItemSummary {
  const normalized = normalizeItemImages(item);
  const { variants, ...summary } = normalized;
  return {
    ...summary,
    variantCount: variants.length,
    variantScores: variants.map((v) => v.durabilityScore),
  };
}

function fallbackPage(rawPage: number | undefined, rawFilters: CatalogFilters): CatalogPage {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { items: staticItems } = require("@/data/items") as { items: Item[] };
  const filters = normalizeCatalogFilters(rawFilters);
  const filtered = staticItems.filter((item) => {
    if (filters.status && item.status !== filters.status) return false;
    return true;
  });
  const page = clampPage(rawPage);
  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const safeOffset = (safePage - 1) * PAGE_SIZE;
  return {
    items: filtered.slice(safeOffset, safeOffset + PAGE_SIZE).map(fixtureSummary),
    total,
    page: safePage,
    pageCount,
  };
}

function isLiveProduction(): boolean {
  return process.env.VERCEL_ENV === "production";
}

async function queryCatalogPage(
  rawPage: number | undefined,
  rawFilters: CatalogFilters = {}
): Promise<CatalogPage> {
  const filters = normalizeCatalogFilters(rawFilters);
  const connectionString = process.env.POSTGRES_URL ?? "";
  const placeholder =
    !connectionString ||
    connectionString.includes("[PROJECT-REF]") ||
    connectionString.includes("[PASSWORD]") ||
    connectionString.includes("[REDACTED") ||
    connectionString.includes("[SENSITIVE") ||
    connectionString.includes("dummy") ||
    connectionString.includes("postgres.example");

  if (placeholder) {
    return fallbackPage(rawPage, filters);
  }

  try {
    const page = clampPage(rawPage);
    const whereParts = [eq(itemsTable.isPublished, true)];
    if (filters.status) whereParts.push(eq(itemsTable.status, filters.status));
    const where = and(...whereParts);

    const totalRow = await db
      .select({ c: sql<number>`count(*)::int` })
      .from(itemsTable)
      .where(where);
    const total = Number(totalRow[0]?.c ?? 0);
    const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const safePage = Math.min(page, pageCount);
    const safeOffset = (safePage - 1) * PAGE_SIZE;
    if (total === 0) return { items: [], total, page: 1, pageCount: 1 };

    const rows = await db
      .select({
        id: itemsTable.id,
        slug: itemsTable.slug,
        title: itemsTable.title,
        subtitle: itemsTable.subtitle,
        description: itemsTable.description,
        careGuide: itemsTable.careGuide,
        systemLabel: itemsTable.systemLabel,
        displayCategory: itemsTable.displayCategory,
        imagePath: itemsTable.imagePath,
        status: itemsTable.status,
        originLabel: itemsTable.originLabel,
        amazonUrl: itemsTable.amazonUrl,
        officialStoreUrl: itemsTable.officialStoreUrl,
        makerDisplay: itemsTable.makerDisplay,
        variantCount: itemsTable.variantCount,
        childRatings: itemsTable.childRatings,
        availabilityJson: itemsTable.availabilityJson,
        tagsJson: itemsTable.tagsJson,
      })
      .from(itemsTable)
      .where(where)
      .orderBy(asc(itemsTable.catalogOrder), asc(itemsTable.title))
      .limit(PAGE_SIZE)
      .offset(safeOffset);

    const items = rows.map((row): ItemSummary => {
      const rawAvailability = (Array.isArray(row.availabilityJson)
        ? row.availabilityJson
        : []) as Array<{ name: PlatformName; href: string }>;

      return {
        slug: row.slug,
        title: row.title,
        subtitle: row.subtitle ?? undefined,
        image: resolveImageUrl(row.imagePath),
        maker: row.makerDisplay ?? "",
        system: row.systemLabel,
        category: allowedCategories.has(row.displayCategory as ItemCategory)
          ? (row.displayCategory as ItemCategory)
          : "cookware",
        status: allowedStatuses.has(row.status as ItemStatus)
          ? (row.status as ItemStatus)
          : "In Production",
        yearEstablished: row.originLabel,
        desc: row.description,
        careGuide: row.careGuide ?? undefined,
        amazonUrl: row.amazonUrl ?? undefined,
        officialStoreUrl: row.officialStoreUrl ?? undefined,
        retailLinks: normalizeRetailAvailability(
          rawAvailability,
          row.amazonUrl,
          row.officialStoreUrl
        ).map((a) => ({ platform: a.name, url: a.href })),
        variantCount: row.variantCount,
        variantScores: Array.isArray(row.childRatings) ? row.childRatings.map(Number) : [],
        tags: Array.isArray(row.tagsJson) ? row.tagsJson : [],
      };
    });

    return { items, total, page: safePage, pageCount };
  } catch (error) {
    console.error("[bifl.in catalog] query failed", error);
    if (isLiveProduction()) throw error;
    return fallbackPage(rawPage, filters);
  }
}

export const getCatalogPage = cache(queryCatalogPage);

export const getAllPublishedItemSummaries = cache(async (): Promise<ItemSummary[]> => {
  const first = await getCatalogPage(1);
  if (first.pageCount <= 1) return first.items;

  const remaining = await Promise.all(
    Array.from({ length: first.pageCount - 1 }, (_, index) => getCatalogPage(index + 2))
  );
  return [first, ...remaining].flatMap((page) => page.items);
});

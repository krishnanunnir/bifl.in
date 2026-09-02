import type { ItemStatus } from "@/lib/catalog/types";

export const SITE_NAME = "bifl.in";
export const SITE_DOMAIN = "bifl.in";
export const SITE_ALTERNATE_NAME = "Buy It For Life India";
export const SITE_TITLE = "bifl.in — Buy It For Life India | Curated Generational Goods";
export const SITE_DESCRIPTION =
  "A curated directory of generational, repairable, and heirloom-grade products made or trusted in India. Cookware, leather, appliances, timepieces, stationery, and hardware built to last decades.";

const DEFAULT_ORIGIN = "https://bifl.in";

export function siteOrigin(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && envUrl.startsWith("http")) {
    return envUrl.replace(/\/+$/, "");
  }
  return DEFAULT_ORIGIN;
}

export function absoluteUrl(path = "/"): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteOrigin()}${cleanPath}`;
}

export function catalogPath({
  page = 1,
  status,
}: {
  page?: number;
  status?: ItemStatus | string;
} = {}): string {
  const params = new URLSearchParams();
  if (status && status !== "All") params.set("status", status);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/?${query}` : "/";
}

export function catalogUrl(options: { page?: number; status?: ItemStatus | string } = {}): string {
  return absoluteUrl(catalogPath(options));
}

export function pageRobots(): { index: boolean; follow: boolean } {
  return {
    index: true,
    follow: true,
  };
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

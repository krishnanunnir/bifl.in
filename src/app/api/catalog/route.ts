import { NextResponse } from "next/server";
import { getCatalogPage, normalizeCatalogFilters } from "@/lib/db/queries/catalog";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageRaw = searchParams.get("page");
  const page = pageRaw ? Number.parseInt(pageRaw, 10) : 1;
  const status = searchParams.get("status") ?? undefined;

  const filters = normalizeCatalogFilters({ status });
  const result = await getCatalogPage(page, filters);

  return NextResponse.json(result);
}

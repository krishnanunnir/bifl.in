"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { ItemCard } from "@/components/item-card";
import type { CatalogFilters, CatalogPage } from "@/lib/db/queries/catalog";
import type { ItemSummary } from "@/lib/catalog/types";
import { catalogPath } from "@/lib/seo/site";

export function InfiniteItemFeed({
  initialItems,
  initialPage,
  total,
  pageCount,
  filters,
}: {
  initialItems: ItemSummary[];
  initialPage: number;
  total: number;
  pageCount: number;
  filters: CatalogFilters;
}) {
  const [items, setItems] = useState<ItemSummary[]>(initialItems);
  const [page, setPage] = useState(initialPage);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const hasMore = page < pageCount;

  useEffect(() => {
    setItems(initialItems);
    setPage(initialPage);
    setError(null);
  }, [initialItems, initialPage, filters.status]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore || isPending) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting && hasMore && !isPending) {
          loadNext();
        }
      },
      { rootMargin: "600px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, isPending, page, filters]);

  function loadNext() {
    if (!hasMore || isPending) return;
    const nextPage = page + 1;
    startTransition(async () => {
      try {
        setError(null);
        const params = new URLSearchParams();
        params.set("page", String(nextPage));
        if (filters.status) params.set("status", filters.status);

        const res = await fetch(`/api/catalog?${params.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: CatalogPage = await res.json();

        setItems((prev) => {
          const existing = new Set(prev.map((i) => i.slug));
          const additions = data.items.filter((i) => !existing.has(i.slug));
          return [...prev, ...additions];
        });
        setPage(data.page);
      } catch (err) {
        console.error("Failed to load catalog page", err);
        setError("Failed to load more items. Click to retry.");
      }
    });
  }

  const nextPageNum = page + 1;

  return (
    <div>
      <div className="grid gap-6">
        {items.map((item, index) => (
          <ItemCard
            key={item.slug}
            item={item}
            priority={index < 3 && initialPage === 1}
            position={index + 1}
          />
        ))}
      </div>

      {hasMore && (
        <div ref={sentinelRef} className="catalog-sentinel" aria-hidden="true" />
      )}

      <div className="catalog-status" aria-live="polite">
        {isPending && (
          <p className="catalog-status__text font-mono text-xs text-[#78716c]">
            Loading more generational items…
          </p>
        )}
        {error && (
          <p className="catalog-status__text catalog-status__text--error">
            <button
              onClick={loadNext}
              className="catalog-status__retry cursor-pointer underline text-[#8c3b2b]"
            >
              {error}
            </button>
          </p>
        )}
        {!hasMore && items.length > 0 && (
          <p className="catalog-status__text catalog-status__text--end font-mono text-xs text-[#78716c] pt-4">
            End of catalog · {total} curated BIFL products
          </p>
        )}
      </div>

      <noscript>
        {hasMore && (
          <div className="catalog-next pt-6 flex justify-center">
            <Link
              href={catalogPath({ page: nextPageNum, status: filters.status })}
              className="catalog-next__link inline-flex items-center px-4 py-2 border border-stone-300 rounded font-mono text-xs text-stone-800 hover:border-stone-600"
            >
              Next Page ({nextPageNum} of {pageCount}) →
            </Link>
          </div>
        )}
      </noscript>
    </div>
  );
}

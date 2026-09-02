"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CategoryMeta, Item } from "@/lib/catalog/types";
import { TrackedExternalLink } from "@/components/tracked-external-link";
import { SharpStarRating } from "@/components/sharp-star";

export function CategoryClient({
  category,
  initialItems,
}: {
  category: CategoryMeta;
  initialItems: Item[];
}) {
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [materialFilter, setMaterialFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("score");

  const availableMaterials = useMemo(() => {
    const set = new Set<string>();
    for (const item of initialItems) {
      for (const tag of item.tags ?? []) {
        if (tag.category === "material") {
          set.add(tag.name);
        }
      }
    }
    return Array.from(set);
  }, [initialItems]);

  const filteredItems = useMemo(() => {
    let list = [...initialItems];

    if (statusFilter !== "All") {
      list = list.filter((i) => i.status === statusFilter);
    }

    if (materialFilter !== "all") {
      list = list.filter((i) => i.tags?.some((t) => t.name === materialFilter));
    }

    if (priceFilter === "under-2000") {
      list = list.filter((i) => (i.minNumericPrice ?? 0) <= 2000);
    } else if (priceFilter === "2000-5000") {
      list = list.filter(
        (i) => (i.minNumericPrice ?? 0) > 2000 && (i.minNumericPrice ?? 0) <= 5000
      );
    } else if (priceFilter === "5000-15000") {
      list = list.filter(
        (i) => (i.minNumericPrice ?? 0) > 5000 && (i.minNumericPrice ?? 0) <= 15000
      );
    } else if (priceFilter === "above-15000") {
      list = list.filter((i) => (i.minNumericPrice ?? 0) > 15000);
    }

    if (sortBy === "score") {
      list.sort((a, b) => {
        const scoreA = a.variants[0]?.durabilityScore ?? 0;
        const scoreB = b.variants[0]?.durabilityScore ?? 0;
        return scoreB - scoreA;
      });
    } else if (sortBy === "price-asc") {
      list.sort((a, b) => (a.minNumericPrice ?? 0) - (b.minNumericPrice ?? 0));
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => (b.minNumericPrice ?? 0) - (a.minNumericPrice ?? 0));
    }

    return list;
  }, [initialItems, statusFilter, materialFilter, priceFilter, sortBy]);

  return (
    <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-[14rem_minmax(0,1fr)]">
      {/* Simple, Clean Sidebar Filters */}
      <aside className="space-y-6 h-fit sticky top-20 text-sm">
        <div>
          <h3 className="font-mono font-bold text-xs text-slate-500 uppercase tracking-wider mb-2.5">
            Status
          </h3>
          <div className="space-y-1.5 text-xs text-slate-700">
            {["All", "In Production", "Heritage"].map((s) => (
              <label key={s} className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                <input
                  type="radio"
                  name="status"
                  checked={statusFilter === s}
                  onChange={() => setStatusFilter(s)}
                  className="accent-slate-900"
                />
                <span>{s === "All" ? "All Items" : s}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-200 pt-5">
          <h3 className="font-mono font-bold text-xs text-slate-500 uppercase tracking-wider mb-2.5">
            Price
          </h3>
          <div className="space-y-1.5 text-xs text-slate-700">
            {[
              { id: "all", label: "All Prices" },
              { id: "under-2000", label: "Under ₹2,000" },
              { id: "2000-5000", label: "₹2,000 – ₹5,000" },
              { id: "5000-15000", label: "₹5,000 – ₹15,000" },
              { id: "above-15000", label: "Above ₹15,000" },
            ].map((p) => (
              <label key={p.id} className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                <input
                  type="radio"
                  name="price"
                  checked={priceFilter === p.id}
                  onChange={() => setPriceFilter(p.id)}
                  className="accent-slate-900"
                />
                <span>{p.label}</span>
              </label>
            ))}
          </div>
        </div>

        {availableMaterials.length > 0 && (
          <div className="border-t border-slate-200 pt-5">
            <h3 className="font-mono font-bold text-xs text-slate-500 uppercase tracking-wider mb-2.5">
              Material
            </h3>
            <div className="space-y-1.5 text-xs text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                <input
                  type="radio"
                  name="material"
                  checked={materialFilter === "all"}
                  onChange={() => setMaterialFilter("all")}
                  className="accent-slate-900"
                />
                <span>All Materials</span>
              </label>
              {availableMaterials.map((mat) => (
                <label key={mat} className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                  <input
                    type="radio"
                    name="material"
                    checked={materialFilter === mat}
                    onChange={() => setMaterialFilter(mat)}
                    className="accent-slate-900"
                  />
                  <span>{mat}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-slate-200 pt-4">
          <button
            onClick={() => {
              setStatusFilter("All");
              setPriceFilter("all");
              setMaterialFilter("all");
              setSortBy("score");
            }}
            className="text-xs font-mono font-bold text-slate-600 hover:text-slate-900 underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      </aside>

      {/* Product Grid Area */}
      <div className="space-y-4">
        {/* Results Count & Sort */}
        <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-200 text-xs text-slate-500">
          <span className="font-mono">{filteredItems.length} products found</span>
          <div className="flex items-center gap-2">
            <span className="font-mono">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-none border border-slate-300 bg-white px-2 py-1 text-xs text-slate-900 font-medium focus:outline-none"
            >
              <option value="score">Top Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="border border-slate-200 bg-white p-12 text-center shadow-[4px_4px_0_#e2e8f0]">
            <p className="text-sm font-bold text-slate-900">No products match this selection</p>
            <button
              onClick={() => {
                setStatusFilter("All");
                setPriceFilter("all");
                setMaterialFilter("all");
              }}
              className="mt-2 text-xs font-mono text-slate-600 underline cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {filteredItems.map((item) => {
              const avgRating =
                item.variants && item.variants.length > 0
                  ? item.variants.reduce((acc, v) => acc + (v.durabilityScore ?? 4.8), 0) /
                    item.variants.length
                  : 4.85;

              return (
                <article key={item.slug} className="series-card group">
                  <Link
                    href={`/items/${item.slug}`}
                    className="series-cover-link"
                    aria-label={`View ${item.title}`}
                  >
                    <Image
                      className="series-cover"
                      src={item.image}
                      alt={item.title}
                      width={240}
                      height={340}
                      sizes="(max-width: 640px) 104px, 136px"
                    />
                  </Link>

                  <div className="min-w-0 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="system-label">{item.system}</span>
                          <span
                            className={`status-label ${item.status === "In Production" ? "status-label--complete" : ""}`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <span className="shrink-0 font-mono text-[10px] tracking-wide text-slate-500">
                          {item.yearEstablished}
                        </span>
                      </div>

                      <h2 className="font-display mt-2 text-xl font-bold leading-snug tracking-tight text-slate-900 group-hover:text-slate-700 sm:text-2xl sm:leading-tight">
                        <Link href={`/items/${item.slug}`}>{item.title}</Link>
                      </h2>

                      <div className="mt-1 flex items-center justify-between gap-2 text-xs">
                        <span className="font-semibold text-slate-600">By {item.maker}</span>
                        <span className="font-mono font-bold text-slate-900">
                          {item.priceEstimate ?? item.priceRange}
                        </span>
                      </div>

                      <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-2 sm:text-sm">
                        {item.desc}
                      </p>
                    </div>

                    <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 mr-0.5">
                        Buy:
                      </span>
                      {item.retailLinks.slice(0, 3).map((r) => (
                        <TrackedExternalLink
                          key={r.platform}
                          href={r.url}
                          platform={r.platform}
                          itemSlug={item.slug}
                          location="category_card"
                          className="platform-link"
                        >
                          <span>{r.platform}</span>
                          {r.price && (
                            <span className="text-[10px] text-slate-400">({r.price})</span>
                          )}
                        </TrackedExternalLink>
                      ))}
                    </div>
                  </div>

                  <div className="series-books-link-wrap">
                    <SharpStarRating rating={avgRating} />
                    <Link className="series-books-link" href={`/items/${item.slug}`}>
                      View models & specs ({item.variants?.length ?? 1}) →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CategoryMeta, Item } from "@/lib/catalog/types";
import { TrackedExternalLink } from "@/components/tracked-external-link";

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
          <h3 className="font-semibold text-xs text-slate-400 uppercase tracking-wider mb-2.5">
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

        <div className="border-t border-slate-100 pt-5">
          <h3 className="font-semibold text-xs text-slate-400 uppercase tracking-wider mb-2.5">
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
          <div className="border-t border-slate-100 pt-5">
            <h3 className="font-semibold text-xs text-slate-400 uppercase tracking-wider mb-2.5">
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

        <div className="border-t border-slate-100 pt-4">
          <button
            onClick={() => {
              setStatusFilter("All");
              setPriceFilter("all");
              setMaterialFilter("all");
              setSortBy("score");
            }}
            className="text-xs text-slate-500 hover:text-slate-900 underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      </aside>

      {/* Product Grid Area */}
      <div className="space-y-4">
        {/* Results Count & Sort */}
        <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-100 text-xs text-slate-500">
          <span>{filteredItems.length} products found</span>
          <div className="flex items-center gap-2">
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-900 font-medium focus:outline-none"
            >
              <option value="score">Top Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <p className="text-sm font-medium text-slate-900">No products match this selection</p>
            <button
              onClick={() => {
                setStatusFilter("All");
                setPriceFilter("all");
                setMaterialFilter("all");
              }}
              className="mt-2 text-xs text-slate-600 underline cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <article
                key={item.slug}
                className="simple-card p-4 flex flex-col justify-between"
              >
                <div>
                  <Link href={`/items/${item.slug}`} className="block relative aspect-4/3 overflow-hidden rounded-lg bg-slate-50 border border-slate-100 mb-3">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </Link>

                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>{item.maker}</span>
                    <span className="font-semibold text-slate-900">{item.priceEstimate ?? item.priceRange}</span>
                  </div>

                  <h3 className="font-semibold text-slate-900 text-sm leading-snug">
                    <Link href={`/items/${item.slug}`}>{item.title}</Link>
                  </h3>

                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {item.retailLinks.slice(0, 3).map((r) => (
                      <TrackedExternalLink
                        key={r.platform}
                        href={r.url}
                        platform={r.platform}
                        itemSlug={item.slug}
                        location="category_card"
                        className="retailer-pill"
                      >
                        <span>{r.platform}</span>
                        {r.price && <span className="text-[10px] text-slate-400">· {r.price}</span>}
                      </TrackedExternalLink>
                    ))}
                  </div>

                  <Link
                    href={`/items/${item.slug}`}
                    className="text-xs font-semibold text-slate-700 hover:text-slate-900"
                  >
                    Specs →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

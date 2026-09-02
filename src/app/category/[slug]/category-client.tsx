"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CategoryMeta, Item } from "@/lib/catalog/types";
import { durabilityColor, durabilityTierLabel } from "@/lib/catalog/durability";
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

  // Extract available materials in this category
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

    // Status filter
    if (statusFilter !== "All") {
      list = list.filter((i) => i.status === statusFilter);
    }

    // Material filter
    if (materialFilter !== "all") {
      list = list.filter((i) => i.tags?.some((t) => t.name === materialFilter));
    }

    // Price filter
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

    // Sorting
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
    <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
      {/* Amazon-style Faceted Sidebar Filters */}
      <aside className="rounded-xl border border-[#e2dcd2] bg-[#ffffff] p-5 shadow-sm space-y-6 h-fit sticky top-20">
        <div>
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#78716c] mb-3">
            Production Status
          </h3>
          <div className="space-y-1.5 text-xs font-medium text-[#44403c]">
            {["All", "In Production", "Heritage"].map((s) => (
              <label key={s} className="flex items-center gap-2 cursor-pointer hover:text-[#1c1917]">
                <input
                  type="radio"
                  name="status"
                  checked={statusFilter === s}
                  onChange={() => setStatusFilter(s)}
                  className="accent-[#8c3b2b]"
                />
                <span>{s === "All" ? "All Items" : s}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-[#ede7dc] pt-5">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#78716c] mb-3">
            Price Range
          </h3>
          <div className="space-y-1.5 text-xs font-medium text-[#44403c]">
            {[
              { id: "all", label: "All Prices" },
              { id: "under-2000", label: "Under ₹2,000" },
              { id: "2000-5000", label: "₹2,000 – ₹5,000" },
              { id: "5000-15000", label: "₹5,000 – ₹15,000" },
              { id: "above-15000", label: "Above ₹15,000" },
            ].map((p) => (
              <label key={p.id} className="flex items-center gap-2 cursor-pointer hover:text-[#1c1917]">
                <input
                  type="radio"
                  name="price"
                  checked={priceFilter === p.id}
                  onChange={() => setPriceFilter(p.id)}
                  className="accent-[#8c3b2b]"
                />
                <span>{p.label}</span>
              </label>
            ))}
          </div>
        </div>

        {availableMaterials.length > 0 && (
          <div className="border-t border-[#ede7dc] pt-5">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#78716c] mb-3">
              Material & Core Alloy
            </h3>
            <div className="space-y-1.5 text-xs font-medium text-[#44403c]">
              <label className="flex items-center gap-2 cursor-pointer hover:text-[#1c1917]">
                <input
                  type="radio"
                  name="material"
                  checked={materialFilter === "all"}
                  onChange={() => setMaterialFilter("all")}
                  className="accent-[#8c3b2b]"
                />
                <span>All Materials</span>
              </label>
              {availableMaterials.map((mat) => (
                <label key={mat} className="flex items-center gap-2 cursor-pointer hover:text-[#1c1917]">
                  <input
                    type="radio"
                    name="material"
                    checked={materialFilter === mat}
                    onChange={() => setMaterialFilter(mat)}
                    className="accent-[#8c3b2b]"
                  />
                  <span>{mat}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-[#ede7dc] pt-5">
          <button
            onClick={() => {
              setStatusFilter("All");
              setPriceFilter("all");
              setMaterialFilter("all");
              setSortBy("score");
            }}
            className="w-full text-center text-xs font-semibold text-[#8c3b2b] hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      </aside>

      {/* Main Filtered Product Grid */}
      <div className="space-y-6">
        {/* Results Bar + Sort Control */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#e2dcd2] bg-[#ffffff] px-4 py-3 text-xs">
          <span className="font-mono text-[#78716c]">
            Showing <strong className="text-[#1c1917]">{filteredItems.length}</strong> verified BIFL items
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[#78716c] uppercase">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded border border-[#d6cebf] bg-[#faf8f5] px-2.5 py-1 text-xs font-semibold text-[#1c1917] focus:outline-none"
            >
              <option value="score">Highest Durability Score</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Cards */}
        {filteredItems.length === 0 ? (
          <div className="rounded-xl border border-[#e2dcd2] bg-[#ffffff] p-10 text-center">
            <h3 className="font-display text-lg font-bold text-[#1c1917]">No items match these filters</h3>
            <p className="mt-2 text-xs text-[#78716c]">Try widening your price or material selection.</p>
            <button
              onClick={() => {
                setStatusFilter("All");
                setPriceFilter("all");
                setMaterialFilter("all");
              }}
              className="mt-4 inline-block text-xs font-bold text-[#8c3b2b] underline cursor-pointer"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredItems.map((item) => {
              const mainVariant = item.variants[0];
              const avgScore = mainVariant?.durabilityScore ?? 4.8;
              return (
                <article
                  key={item.slug}
                  className="rounded-xl border border-[#e2dcd2] bg-[#ffffff] p-5 sm:p-6 shadow-sm hover:border-[#8c3b2b]/40 hover:shadow-md transition-all grid grid-cols-1 sm:grid-cols-[9rem_minmax(0,1fr)] gap-5 items-start"
                >
                  <Link href={`/items/${item.slug}`} className="block">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={200}
                      height={260}
                      className="w-full sm:w-36 h-48 rounded-lg object-cover border border-[#e2dcd2] bg-[#f8f6f0]"
                    />
                  </Link>

                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#f5f0e8] text-[#8c3b2b]">
                          {item.system}
                        </span>
                        {item.isTopPick && (
                          <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#1e6b45] text-white">
                            ★ Top Pick
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-xs font-bold text-[#1c1917] bg-[#faf8f5] px-2 py-1 rounded border border-[#e2dcd2]">
                        {item.priceEstimate ?? item.priceRange}
                      </span>
                    </div>

                    <div>
                      <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1c1917] hover:text-[#8c3b2b] transition-colors leading-tight">
                        <Link href={`/items/${item.slug}`}>{item.title}</Link>
                      </h2>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#78716c] mt-0.5">
                        By {item.maker} · {item.yearEstablished}
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-[#57534e] leading-relaxed line-clamp-2">
                      {item.desc}
                    </p>

                    {/* Durability & Lifespan Meter */}
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <span
                        className="font-mono font-bold px-2 py-0.5 rounded text-white text-[11px]"
                        style={{ backgroundColor: durabilityColor(avgScore) }}
                      >
                        {avgScore.toFixed(2)} / 5.00 Durability
                      </span>
                      <span className="text-[#78716c] text-[11px] font-medium">
                        Lifespan: <strong className="text-[#1c1917]">{mainVariant?.expectedLifespan ?? "25+ Years"}</strong>
                      </span>
                    </div>

                    {/* Multi-Retailer Action Bar (Amazon, Flipkart, Croma, Reliance Digital) */}
                    <div className="border-t border-[#ede7dc] pt-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[#78716c]">
                          Buy at:
                        </span>
                        {item.retailLinks.map((retailer) => {
                          const isAmazon = retailer.platform.includes("Amazon");
                          const isFlipkart = retailer.platform.includes("Flipkart");
                          const isCroma = retailer.platform.includes("Croma");
                          const isReliance = retailer.platform.includes("Reliance");

                          let btnStyle = "bg-[#f5f0e8] text-[#44403c] border-[#d6cebf]";
                          if (isAmazon) btnStyle = "bg-[#ff9900]/15 text-[#854d0e] border-[#ff9900]/40 font-bold";
                          if (isFlipkart) btnStyle = "bg-[#2874f0]/10 text-[#1e40af] border-[#2874f0]/30 font-bold";
                          if (isCroma) btnStyle = "bg-[#00e9bf]/15 text-[#0f766e] border-[#00e9bf]/40 font-bold";
                          if (isReliance) btnStyle = "bg-[#e11b22]/10 text-[#b91c1c] border-[#e11b22]/30 font-bold";

                          return (
                            <TrackedExternalLink
                              key={retailer.platform}
                              href={retailer.url}
                              platform={retailer.platform}
                              itemSlug={item.slug}
                              location="category_card_retailer"
                              className={`inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs border ${btnStyle} hover:opacity-80 transition-opacity`}
                            >
                              <span>{retailer.platform}</span>
                              {retailer.price && <span className="text-[10px] opacity-80">({retailer.price})</span>}
                            </TrackedExternalLink>
                          );
                        })}
                      </div>

                      <Link
                        href={`/items/${item.slug}`}
                        className="font-mono text-xs font-bold uppercase tracking-wider text-[#8c3b2b] hover:underline"
                      >
                        Specs & Guide →
                      </Link>
                    </div>
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

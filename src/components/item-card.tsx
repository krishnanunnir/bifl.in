"use client";

import Image from "next/image";
import Link from "next/link";
import type { Item, ItemSummary } from "@/lib/catalog/types";
import { TrackedExternalLink } from "@/components/tracked-external-link";
import { SharpStarRating } from "@/components/sharp-star";

export function ItemCard({
  item,
  priority,
}: {
  item: Item | ItemSummary;
  priority?: boolean;
  position?: number;
}) {
  let overallScore = 4.85;

  if ("biflRatings" in item && item.biflRatings?.overall) {
    overallScore = item.biflRatings.overall;
  } else if ("variants" in item && Array.isArray(item.variants) && item.variants.length > 0) {
    overallScore =
      item.variants.reduce((acc, v) => acc + (v.durabilityScore ?? 4.8), 0) / item.variants.length;
  } else if (
    "variantScores" in (item as any) &&
    Array.isArray((item as any).variantScores) &&
    (item as any).variantScores.length > 0
  ) {
    const scores = (item as any).variantScores as number[];
    overallScore = scores.reduce((acc, s) => acc + s, 0) / scores.length;
  }

  return (
    <article className="series-card group">
      <Link
        href={`/items/${item.slug}`}
        className="series-cover-link"
        aria-label={`View ${item.title} longevity guide`}
      >
        <Image
          className="series-cover"
          src={item.image}
          alt={item.title}
          width={240}
          height={340}
          sizes="(max-width: 640px) 104px, 136px"
          loading={priority ? "eager" : "lazy"}
          unoptimized
        />
      </Link>

      <div className="min-w-0 flex flex-col justify-between h-full">
        <div>
          {/* Top metadata tags */}
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

          {/* Title */}
          <h2 className="font-display mt-2 text-xl font-bold leading-snug tracking-tight text-slate-900 group-hover:text-slate-700 sm:text-2xl sm:leading-tight">
            <Link href={`/items/${item.slug}`}>{item.title}</Link>
          </h2>

          {/* Maker & Price */}
          <div className="mt-1 flex items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-slate-600">By {item.maker}</span>
            <span className="font-mono font-bold text-slate-900">
              {item.priceEstimate ?? item.priceRange}
            </span>
          </div>

          {/* Core BIFL Summary / Verdict */}
          <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-2 sm:text-sm">
            {item.biflSummary ?? item.desc}
          </p>
        </div>

        {/* Retail Links */}
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
              location="card_retail_link"
              className="platform-link"
            >
              <span>{r.platform}</span>
              {r.price && <span className="text-[10px] text-slate-400">({r.price})</span>}
            </TrackedExternalLink>
          ))}
        </div>
      </div>

      {/* Bottom bar with overall sharp cartoonish star score */}
      <div className="series-books-link-wrap">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[10px] uppercase font-bold text-slate-400">Overall:</span>
          <SharpStarRating rating={overallScore} size={13} />
        </div>
        <Link className="series-books-link" href={`/items/${item.slug}`}>
          View BIFL Breakdown & Guide →
        </Link>
      </div>
    </article>
  );
}

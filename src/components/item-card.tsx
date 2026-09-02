"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ItemCategory, ItemSummary } from "@/lib/catalog/types";
import { durabilityColor } from "@/lib/catalog/durability";
import { trackItemCardClick } from "@/lib/analytics";
import { TrackedExternalLink } from "@/components/tracked-external-link";

const categoryColors: Record<ItemCategory, string> = {
  cookware: "#8c3b2b",
  appliances: "#28536b",
  leather_edc: "#804a1e",
  timepieces: "#2a6041",
  stationery: "#5a3d75",
  home_hardware: "#705335",
};

function DurabilityStrip({ scores }: { scores: number[] }) {
  return (
    <ol className="rating-trajectory" aria-label="Durability ratings by variant">
      {scores.map((score, index) => {
        const label =
          score > 0
            ? `Model ${index + 1}: ${score.toFixed(2)} / 5.00 Durability Score`
            : `Model ${index + 1}: Unrated snapshot`;
        return (
          <li key={index}>
            <span
              className={`rating-trajectory__square ${score > 0 ? "" : "rating-trajectory__square--missing"}`}
              style={score > 0 ? ({ "--rating-color": durabilityColor(score) } as CSSProperties) : undefined}
              role="img"
              aria-label={label}
              title={label}
            />
          </li>
        );
      })}
    </ol>
  );
}

export function ItemCard({
  item,
  priority,
  position,
}: {
  item: ItemSummary;
  priority?: boolean;
  position?: number;
}) {
  return (
    <article
      className="series-card"
      style={{ "--card-accent": categoryColors[item.category] || "#8c3b2b" } as CSSProperties}
    >
      <Link
        href={`/items/${item.slug}`}
        className="series-cover-link"
        aria-label={`View ${item.title} longevity guide and models`}
        onClick={() =>
          trackItemCardClick({
            item_slug: item.slug,
            title: item.title,
            category: item.category,
            system: item.system,
            position: position ?? 0,
          })
        }
      >
        <Image
          className="series-cover"
          src={item.image}
          alt={`${item.title} product view`}
          width={333}
          height={500}
          sizes="(max-width: 380px) 84px, (max-width: 639px) 104px, 144px"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
        />
      </Link>

      <div className="min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="system-label">{item.system}</span>
            <span
              className={`status-label ${item.status === "In Production" ? "status-label--complete" : ""}`}
            >
              {item.status}
            </span>
          </div>
          <span className="shrink-0 font-mono text-[10px] tracking-wide text-[#78716c]">
            {item.yearEstablished}
          </span>
        </div>

        <h2 className="font-display mt-2.5 text-[1.3rem] font-semibold leading-[1.05] tracking-[-0.03em] text-[#1c1917] sm:mt-5 sm:text-3xl sm:leading-tight">
          <Link
            href={`/items/${item.slug}`}
            className="series-title-link"
            onClick={() =>
              trackItemCardClick({
                item_slug: item.slug,
                title: item.title,
                category: item.category,
                system: item.system,
                position: position ?? 0,
              })
            }
          >
            {item.title}
          </Link>
        </h2>

        <p className="mt-1 text-[12.5px] font-semibold tracking-wide text-[#78716c] uppercase sm:mt-1.5 sm:text-xs">
          By {item.maker}
        </p>

        <p className="series-desc mt-2.5 text-[13.5px] leading-[1.65] text-[#44403c] sm:mt-4 sm:text-sm sm:leading-6">
          {item.desc}
        </p>

        {item.tags && item.tags.length > 0 ? (
          <div className="mt-3 flex flex-wrap items-center gap-1.5 sm:mt-4">
            {item.tags
              .filter((t) => !t.isPrimary)
              .slice(0, 3)
              .map((tag) => (
                <span
                  key={tag.slug}
                  className="inline-flex items-center rounded-md bg-[#f5f0e8] px-2 py-0.5 text-[11px] font-medium text-[#57534e]"
                >
                  {tag.name}
                </span>
              ))}
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-1.5 sm:mt-5 sm:gap-2">
          <span className="mr-1 hidden font-mono text-[10px] uppercase tracking-[0.12em] text-[#78716c] sm:inline">
            Available at
          </span>
          {item.retailLinks.map((retailer) => {
            const isAmazon = retailer.platform.includes("Amazon");
            const isFlipkart = retailer.platform.includes("Flipkart");
            const isCroma = retailer.platform.includes("Croma");

            let styleClass = "bg-[#faf8f5] text-[#57534e] border-[#e2dcd2]";
            if (isAmazon) styleClass = "bg-[#ff9900]/10 text-[#854d0e] border-[#ff9900]/30 font-bold";
            if (isFlipkart) styleClass = "bg-[#2874f0]/10 text-[#1e40af] border-[#2874f0]/30 font-bold";
            if (isCroma) styleClass = "bg-[#00e9bf]/10 text-[#0f766e] border-[#00e9bf]/30 font-bold";

            return (
              <TrackedExternalLink
                key={retailer.platform}
                className={`platform-link ${styleClass}`}
                href={retailer.url}
                platform={retailer.platform}
                itemSlug={item.slug}
                location="card_availability"
              >
                <span>{retailer.platform}</span>
                {retailer.price && <span className="text-[10px] opacity-75">({retailer.price})</span>}
              </TrackedExternalLink>
            );
          })}
        </div>
      </div>

      <div className="series-books-link-wrap">
        {item.variantScores && item.variantScores.some((score) => score > 0) ? (
          <DurabilityStrip scores={item.variantScores} />
        ) : null}
        <Link className="series-books-link" href={`/items/${item.slug}`}>
          View models & care guide · {item.variantCount} {item.variantCount === 1 ? "edition" : "editions"}
          <span aria-hidden="true"> →</span>
        </Link>
      </div>
    </article>
  );
}

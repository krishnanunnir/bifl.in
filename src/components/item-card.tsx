"use client";

import Image from "next/image";
import Link from "next/link";
import type { Item, ItemSummary } from "@/lib/catalog/types";
import { TrackedExternalLink } from "@/components/tracked-external-link";

export function ItemCard({
  item,
  priority,
}: {
  item: Item | ItemSummary;
  priority?: boolean;
  position?: number;
}) {
  return (
    <article className="simple-card p-4 flex flex-col justify-between group">
      <div>
        <Link href={`/items/${item.slug}`} className="block relative aspect-4/3 overflow-hidden rounded-lg bg-slate-50 border border-slate-100">
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-102 transition-transform duration-200"
            loading={priority ? "eager" : "lazy"}
          />
        </Link>

        <div className="mt-3.5 space-y-1.5">
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="font-medium text-slate-500">{item.maker}</span>
            <span className="font-semibold text-slate-900">{item.priceEstimate ?? item.priceRange}</span>
          </div>

          <h3 className="font-semibold text-slate-900 text-sm leading-snug group-hover:text-slate-700">
            <Link href={`/items/${item.slug}`}>{item.title}</Link>
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {item.desc}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {item.retailLinks.slice(0, 3).map((r) => (
            <TrackedExternalLink
              key={r.platform}
              href={r.url}
              platform={r.platform}
              itemSlug={item.slug}
              location="card_retail_link"
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
  );
}

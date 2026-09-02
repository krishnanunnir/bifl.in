"use client";

import type { ReactNode } from "react";
import { trackExternalRetailClick } from "@/lib/analytics";

export function TrackedExternalLink({
  href,
  className,
  platform,
  itemSlug,
  location,
  children,
}: {
  href: string;
  className?: string;
  platform: string;
  itemSlug?: string;
  location: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        trackExternalRetailClick({
          item_slug: itemSlug,
          platform,
          href,
          location,
        });
      }}
    >
      {children}
    </a>
  );
}

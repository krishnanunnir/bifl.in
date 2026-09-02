# AGENTS.md — bifl.in

## Project

**bifl.in** — website for **Buy It For Life (BIFL) India products only**. Nothing else.
No fast fashion, no fragile planned obsolescence, no dropshipped disposable plastic. If the core promise isn't extreme durability, repairability, material honesty, and decades-long longevity, it doesn't belong.

## Operating Principles

1. **Longevity & Curation purity > breadth.** Better to curate 100 generational products than 10,000 throwaway items.
2. **Zero-ops first.** Owner does NOT want to manage servers, patches, backups, Postgres, monitoring. Choose boring managed services over clever self-hosting.
3. **Cheapest that is still optimal.** Free tier to start, pay-as-you-grow, no surprise bills. Avoid spread-too-thin (too many vendors/services).
4. **Ship browsing & discovery experience first.** Pure curated catalog + tactile, serene discovery > bloated search/filtering UI.

## Catalog Discovery & Filtering Policy (LOCKED)

**Decision locked: Minimalist Browsing & Vibe First.**
- **No Search Bar / Search Input**: Having a search box or search forms kills the discovery vibe and feeling of the website. Readers should smoothly explore the curated feed without query clutter.
- **Single Filter Only (Status)**: The ONLY filter allowed on the website is production status (`In Production` / `Heritage & Legacy` / `All`).
- **No Category / Tag / Material Filters**: Durability tiers, material types, and tags are presented as rich informational badges on cards and detail pages, but are NOT filter controls.
- **Do NOT propose or re-introduce search or multi-faceted filters.**

## Core Data Model

- **Items / Product Lines** (primary entity — durability and reputation are product-line long)
- **Makers / Brands** (Hawkins, Hidesign, Preethi, HMT, P-TAL, Godrej, Kanwrite, The Indus Valley, etc.)
- **Durability System** (Heirloom Cast Iron, Full-Grain Leather, Tri-Ply 304 Steel, Mechanical / Hand-Wound, Handcrafted Brass/Kansa, Modular & Serviceable)
- **Tags** (strict taxonomy: material, repairability, region/origin, use case)
- **Models / Variants** (specific editions, sizes, finishes with Amazon.in ASIN / retail links, specs, and longevity ratings)
- **Longevity & Maintenance Lifecycle** (step-by-step care timeline e.g. seasoning, leather conditioning, movement service)

Source of truth is DB with static fallback fixtures in `src/data/items.ts` for instant preview and zero-dependency local dev.

## Architecture Constraint: Minimal Management

Owner explicitly asks: *what is cheapest + most optimal without self-managing? Don't want to spread thin.*

### Recommended Stack — LOCKED: Vercel + Supabase (Bundled)

**Decision locked: Owner wants Auth + Storage + DB bundled, zero-ops, cheapest optimal. Supabase is the choice.**

**Parts:**
- **Hosting:** Vercel (free tier, Next.js) — `git push` deploys
- **DB:** **Supabase Postgres Free** (500MB DB, 1GB storage, 50k MAU, 5GB bandwidth) — grows to $25/mo Pro when needed
- **Auth:** Supabase Auth (email + OAuth, 50k MAU free)
- **Storage:** Supabase Storage (1GB free, for product photography) — single bucket `images`, Next.js Image optimization
- **Filtering:** Status-only filtering (In Production / Heritage / All) — no complex search engines or faceted forms
- **Cron/Ingestion:** Supabase pg_cron or Vercel Cron

**Cost:** $0/mo until ~50k users / 500MB. Then $25/mo Pro. Predictable.

### What NOT to do

- No self-hosted Postgres/MySQL on VPS
- No Kubernetes, no Docker Compose in prod to manage
- No search bars, search forms, or faceted category/tag filter inputs on the UI (status-only filter)
- No multi-cloud spread: pick 2 vendors max (Vercel + Supabase)

## Catalog Curation & Metadata Standards

- All products and variants must adhere strictly to BIFL India criteria (proven longevity, repairability, metal/leather/glass/wood authenticity, availability of spare parts in India).
- Per-variant retailer links prioritize clean Amazon.in ASIN URLs (`https://www.amazon.in/dp/<ASIN>`) and Official Maker Webstores.
- Image paths follow `/images/products/<slug>.webp` and `/images/variants/<slug>/<variant-slug>.webp` with local fallback SVGs.

## Notes

- Domain is `bifl.in` — keep slug structure `/items/[slug]`, `/variants/[slug]`
- Keep AGENTS.md as canonical guide; update stack decision here if it changes.

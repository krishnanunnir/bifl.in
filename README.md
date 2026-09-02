# bifl.in — Buy It For Life India

A curated catalog of generational, repairable, and heirloom-grade products built to last in India.

> **Zero fast fashion. Zero planned obsolescence. Zero dropshipped junk.**
> Only products engineered with material authenticity, repairability, and decades-long endurance.

---

## Operating Principles & Discovery Policy

1. **Longevity & Curation Purity > Breadth:** Every listed item must have proven multi-year or generational track record, easily accessible spare parts/repairs, and pure materials (cast iron, full-grain leather, tri-ply 304 steel, mechanical movements, pure brass/kansa, borosilicate).
2. **Minimalist Browsing & Vibe First:** No search box clutter or complex faceted query forms. A clean, tactile, editorial feed with single-status filtering (`All` / `In Production` / `Heritage & Legacy`).
3. **Zero-Ops Stack:** Next.js 15/16 + Tailwind CSS v4 + Drizzle ORM + Supabase Postgres & Storage + Vercel.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, Server Components, Partial Prerendering)
- **Styling:** Tailwind CSS v4 with bespoke editorial design tokens & tactile shadows
- **Database & ORM:** Supabase Postgres via Drizzle ORM (with in-memory fallback fixture for zero-config local development)
- **Storage:** Supabase Storage for product imagery
- **Analytics:** PostHog (privacy-conscious with cookie-less consent banner)

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run local development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the catalog.

### 3. Database operations (Supabase)

```bash
# Push Drizzle schema to database
npm run db:push

# Seed catalog with canonical Indian BIFL products
npm run db:seed

# Verify database integrity
npm run db:verify
```

---

## Data Taxonomy

- **Categories:**
  - `cookware` (Cast iron, brass, kansa, tri-ply stainless, hard anodized)
  - `leather_edc` (Full-grain leather briefcases, wallets, belts, heavy canvas)
  - `appliances` (Heavy-duty mixer grinders, commercial blenders, ceiling fans)
  - `timepieces` (Mechanical, hand-wound, automatic, shockproof horology)
  - `stationery` (Ebonite/acrylic fountain pens, piston fillers, permanent inks)
  - `home_hardware` (Brass padlocks, heavy iron tools, borosilicate glassware)

- **Durability Systems:**
  - `Heirloom Cast Metal`
  - `Full-Grain Vegetable Tanned Leather`
  - `Tri-Ply 304/316 Stainless Steel`
  - `Mechanical / Hand-Wound Movement`
  - `Handcrafted Brass & Kansa (Bronze)`
  - `Modular & User Serviceable`
  - `Heavy Borosilicate Glass`

---

## License

MIT

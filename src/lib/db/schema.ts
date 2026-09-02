import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import type { Tag as CatalogTag } from "@/lib/catalog/types";

// ---------------------------------------------------------------------------
// Enums — single canonical taxonomy per AGENTS.md "BIFL curation purity".
// ---------------------------------------------------------------------------

export const durabilitySystemEnum = pgEnum("durability_system", [
  "heirloom_cast_iron",
  "full_grain_leather",
  "tri_ply_steel",
  "mechanical_horology",
  "handcrafted_brass_kansa",
  "modular_serviceable",
  "borosilicate_glass",
  "other_durable",
]);

export const displayCategoryEnum = pgEnum("display_category", [
  "cookware",
  "leather_edc",
  "appliances",
  "timepieces",
  "stationery",
  "home_hardware",
]);

export const itemStatusEnum = pgEnum("item_status", [
  "In Production",
  "Heritage",
]);

// ---------------------------------------------------------------------------
// Makers / Brands — e.g. Hawkins, Hidesign, Preethi, HMT, P-TAL, Godrej
// ---------------------------------------------------------------------------

export const makers = pgTable(
  "makers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    originLocation: text("origin_location"),
    foundedYear: integer("founded_year"),
    bio: text("bio"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    slugUq: unique("makers_slug_uq").on(t.slug),
  })
);

// ---------------------------------------------------------------------------
// Items — primary entity. Product lines with generational durability.
// ---------------------------------------------------------------------------

export const items = pgTable(
  "items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    subtitle: text("subtitle"),
    description: text("description").notNull(), // curation rationale
    careGuide: text("care_guide"), // step-by-step care and maintenance breakdown

    systemLabel: text("system_label").notNull(), // "Heirloom Cast Iron", "Full-Grain Leather", etc.
    displayCategory: displayCategoryEnum("display_category").notNull(),

    imagePath: text("image_path").notNull(),

    status: itemStatusEnum("status").notNull().default("In Production"),
    originLabel: text("origin_label").notNull(), // e.g. "Est. 1959 · India"

    // Retail Links
    amazonUrl: text("amazon_url"),
    officialStoreUrl: text("official_store_url"),

    // Curation Gate
    isPublished: boolean("is_published").notNull().default(false),

    // Display order
    catalogOrder: integer("catalog_order").notNull().default(0),

    // Denormalized summary cache & aggregates
    makerDisplay: text("maker_display"),
    variantCount: integer("variant_count").notNull().default(0),
    childRatings: jsonb("child_ratings").$type<number[]>().notNull().default([]),
    availabilityJson: jsonb("availability_json")
      .$type<Array<{ name: string; href: string }>>()
      .notNull()
      .default([]),
    tagsJson: jsonb("tags_json")
      .$type<CatalogTag[]>()
      .notNull()
      .default([]),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    slugUq: unique("items_slug_uq").on(t.slug),
    orderIdx: index("items_catalog_order_idx").on(t.catalogOrder),
    publishedIdx: index("items_published_idx").on(t.isPublished),
    imageNonEmpty: check("items_image_nonempty", sql`length(${t.imagePath}) > 0`),
    titleNonEmpty: check("items_title_nonempty", sql`length(${t.title}) > 0`),
    originLabelNonEmpty: check(
      "items_origin_label_nonempty",
      sql`length(${t.originLabel}) > 0`
    ),
  })
);

// Makers Join
export const itemMakers = pgTable(
  "item_makers",
  {
    itemId: uuid("item_id")
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),
    makerId: uuid("maker_id")
      .notNull()
      .references(() => makers.id, { onDelete: "restrict" }),
    makerOrder: integer("maker_order").notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.itemId, t.makerId] }),
    orderIdx: index("item_makers_order_idx").on(t.itemId, t.makerOrder),
  })
);

// Durability Systems Join
export const itemSystems = pgTable(
  "item_systems",
  {
    itemId: uuid("item_id")
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),
    system: durabilitySystemEnum("system").notNull(),
    isPrimary: boolean("is_primary").notNull().default(false),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.itemId, t.system] }),
  })
);

// Retail Platforms
export const platforms = pgTable("platforms", {
  slug: text("slug").primaryKey(), // 'amazon-in', 'official-store', 'tata-cliq', 'flipkart'
  displayName: text("display_name").notNull(),
  iconPath: text("icon_path"),
});

export const itemPlatforms = pgTable(
  "item_platforms",
  {
    itemId: uuid("item_id")
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),
    platformSlug: text("platform_slug")
      .notNull()
      .references(() => platforms.slug, { onDelete: "restrict" }),
    href: text("href").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.itemId, t.platformSlug] }),
  })
);

// Tags
export const tags = pgTable(
  "tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    category: text("category").notNull(),
  },
  (t) => ({
    slugUq: unique("tags_slug_uq").on(t.slug),
    nameUq: unique("tags_name_uq").on(t.name),
  })
);

export const itemTags = pgTable(
  "item_tags",
  {
    itemId: uuid("item_id")
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
    isPrimary: boolean("is_primary").notNull().default(false),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.itemId, t.tagId] }),
  })
);

// ---------------------------------------------------------------------------
// Variants / Models — Specific sizes, editions, models inside a product line
// ---------------------------------------------------------------------------

export const variants = pgTable(
  "variants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    itemId: uuid("item_id")
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    variantNumber: integer("variant_number").notNull(),
    title: text("title").notNull(),
    imagePath: text("image_path").notNull(),

    asin: text("asin"),
    amazonUrl: text("amazon_url"),
    officialUrl: text("official_url"),

    material: text("material").notNull(),
    warranty: text("warranty").notNull(),
    expectedLifespan: text("expected_lifespan").notNull(), // e.g. "30+ Years", "Lifetime"
    specsJson: jsonb("specs_json").$type<Record<string, string>>(),
    durabilityScore: numeric("durability_score", { precision: 3, scale: 2 }).notNull().default("4.80"),
    description: text("description"),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    itemVariantNumberUq: unique("variants_item_variant_number_uq").on(t.itemId, t.variantNumber),
    itemSlugUq: unique("variants_item_slug_uq").on(t.itemId, t.slug),
    itemIdx: index("variants_item_idx").on(t.itemId, t.variantNumber),
  })
);

// ---------------------------------------------------------------------------
// Blog Posts — Curated essays, care guides, and brand spotlights
// ---------------------------------------------------------------------------

export const blogPosts = pgTable(
  "blog_posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    excerpt: text("excerpt").notNull(),
    bodyMarkdown: text("body_markdown").notNull(),
    authorEmail: text("author_email").notNull(),
    isPublished: boolean("is_published").notNull().default(false),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    slugUq: unique("blog_posts_slug_uq").on(t.slug),
    publishedIdx: index("blog_posts_published_idx").on(t.isPublished, t.publishedAt),
  })
);

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------

export const itemsRelations = relations(items, ({ many }) => ({
  makers: many(itemMakers),
  systems: many(itemSystems),
  platforms: many(itemPlatforms),
  variants: many(variants),
  tags: many(itemTags),
}));

export const makersRelations = relations(makers, ({ many }) => ({
  items: many(itemMakers),
}));

export const itemMakersRelations = relations(itemMakers, ({ one }) => ({
  item: one(items, {
    fields: [itemMakers.itemId],
    references: [items.id],
  }),
  maker: one(makers, {
    fields: [itemMakers.makerId],
    references: [makers.id],
  }),
}));

export const variantsRelations = relations(variants, ({ one }) => ({
  item: one(items, {
    fields: [variants.itemId],
    references: [items.id],
  }),
}));

export const itemPlatformsRelations = relations(itemPlatforms, ({ one }) => ({
  item: one(items, {
    fields: [itemPlatforms.itemId],
    references: [items.id],
  }),
  platform: one(platforms, {
    fields: [itemPlatforms.platformSlug],
    references: [platforms.slug],
  }),
}));

export const itemSystemsRelations = relations(itemSystems, ({ one }) => ({
  item: one(items, {
    fields: [itemSystems.itemId],
    references: [items.id],
  }),
}));

export const itemTagsRelations = relations(itemTags, ({ one }) => ({
  item: one(items, {
    fields: [itemTags.itemId],
    references: [items.id],
  }),
  tag: one(tags, {
    fields: [itemTags.tagId],
    references: [tags.id],
  }),
}));

// Convenience type exports
export type Maker = typeof makers.$inferSelect;
export type ItemRow = typeof items.$inferSelect;
export type VariantRow = typeof variants.$inferSelect;
export type PlatformRow = typeof platforms.$inferSelect;
export type TagRow = typeof tags.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;

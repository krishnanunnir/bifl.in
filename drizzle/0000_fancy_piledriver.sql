CREATE TYPE "public"."display_category" AS ENUM('cookware', 'leather_edc', 'appliances', 'timepieces', 'stationery', 'home_hardware');--> statement-breakpoint
CREATE TYPE "public"."durability_system" AS ENUM('heirloom_cast_iron', 'full_grain_leather', 'tri_ply_steel', 'mechanical_horology', 'handcrafted_brass_kansa', 'modular_serviceable', 'borosilicate_glass', 'other_durable');--> statement-breakpoint
CREATE TYPE "public"."item_status" AS ENUM('In Production', 'Heritage');--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"excerpt" text NOT NULL,
	"body_markdown" text NOT NULL,
	"author_email" text NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_slug_uq" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "item_makers" (
	"item_id" uuid NOT NULL,
	"maker_id" uuid NOT NULL,
	"maker_order" integer NOT NULL,
	CONSTRAINT "item_makers_item_id_maker_id_pk" PRIMARY KEY("item_id","maker_id")
);
--> statement-breakpoint
CREATE TABLE "item_platforms" (
	"item_id" uuid NOT NULL,
	"platform_slug" text NOT NULL,
	"href" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "item_platforms_item_id_platform_slug_pk" PRIMARY KEY("item_id","platform_slug")
);
--> statement-breakpoint
CREATE TABLE "item_systems" (
	"item_id" uuid NOT NULL,
	"system" "durability_system" NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	CONSTRAINT "item_systems_item_id_system_pk" PRIMARY KEY("item_id","system")
);
--> statement-breakpoint
CREATE TABLE "item_tags" (
	"item_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	CONSTRAINT "item_tags_item_id_tag_id_pk" PRIMARY KEY("item_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"subtitle" text,
	"description" text NOT NULL,
	"care_guide" text,
	"system_label" text NOT NULL,
	"display_category" "display_category" NOT NULL,
	"image_path" text NOT NULL,
	"status" "item_status" DEFAULT 'In Production' NOT NULL,
	"origin_label" text NOT NULL,
	"amazon_url" text,
	"official_store_url" text,
	"is_published" boolean DEFAULT false NOT NULL,
	"catalog_order" integer DEFAULT 0 NOT NULL,
	"maker_display" text,
	"variant_count" integer DEFAULT 0 NOT NULL,
	"child_ratings" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"availability_json" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"tags_json" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "items_slug_uq" UNIQUE("slug"),
	CONSTRAINT "items_image_nonempty" CHECK (length("items"."image_path") > 0),
	CONSTRAINT "items_title_nonempty" CHECK (length("items"."title") > 0),
	CONSTRAINT "items_origin_label_nonempty" CHECK (length("items"."origin_label") > 0)
);
--> statement-breakpoint
CREATE TABLE "makers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"origin_location" text,
	"founded_year" integer,
	"bio" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "makers_slug_uq" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "platforms" (
	"slug" text PRIMARY KEY NOT NULL,
	"display_name" text NOT NULL,
	"icon_path" text
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"category" text NOT NULL,
	CONSTRAINT "tags_slug_uq" UNIQUE("slug"),
	CONSTRAINT "tags_name_uq" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"variant_number" integer NOT NULL,
	"title" text NOT NULL,
	"image_path" text NOT NULL,
	"asin" text,
	"amazon_url" text,
	"official_url" text,
	"material" text NOT NULL,
	"warranty" text NOT NULL,
	"expected_lifespan" text NOT NULL,
	"specs_json" jsonb,
	"durability_score" numeric(3, 2) DEFAULT '4.80' NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "variants_item_variant_number_uq" UNIQUE("item_id","variant_number"),
	CONSTRAINT "variants_item_slug_uq" UNIQUE("item_id","slug")
);
--> statement-breakpoint
ALTER TABLE "item_makers" ADD CONSTRAINT "item_makers_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_makers" ADD CONSTRAINT "item_makers_maker_id_makers_id_fk" FOREIGN KEY ("maker_id") REFERENCES "public"."makers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_platforms" ADD CONSTRAINT "item_platforms_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_platforms" ADD CONSTRAINT "item_platforms_platform_slug_platforms_slug_fk" FOREIGN KEY ("platform_slug") REFERENCES "public"."platforms"("slug") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_systems" ADD CONSTRAINT "item_systems_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_tags" ADD CONSTRAINT "item_tags_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_tags" ADD CONSTRAINT "item_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variants" ADD CONSTRAINT "variants_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "blog_posts_published_idx" ON "blog_posts" USING btree ("is_published","published_at");--> statement-breakpoint
CREATE INDEX "item_makers_order_idx" ON "item_makers" USING btree ("item_id","maker_order");--> statement-breakpoint
CREATE INDEX "items_catalog_order_idx" ON "items" USING btree ("catalog_order");--> statement-breakpoint
CREATE INDEX "items_published_idx" ON "items" USING btree ("is_published");--> statement-breakpoint
CREATE INDEX "variants_item_idx" ON "variants" USING btree ("item_id","variant_number");
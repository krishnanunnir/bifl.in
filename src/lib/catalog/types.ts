// Presentation types shared across catalog, queries, and UI.

export type ItemCategory =
  | "cookware"
  | "appliances"
  | "leather_edc"
  | "timepieces"
  | "stationery"
  | "home_hardware";

export type ItemStatus = "In Production" | "Heritage";

export type RetailPlatform =
  | "Amazon.in"
  | "Flipkart"
  | "Croma"
  | "Reliance Digital"
  | "Tata CLiQ"
  | "Vijay Sales"
  | "Official Store"
  | "Artisan Guild"
  | string;

export type PlatformName = RetailPlatform;

export type RetailLink = {
  platform: RetailPlatform;
  url: string;
  price?: string; // e.g. "₹3,499"
  inStock?: boolean;
  badge?: string; // e.g. "Best Price", "Official", "Direct"
};

export type TagCategory = "material" | "repairability" | "origin" | "use_case";

export type Tag = {
  slug: string;
  name: string;
  category: TagCategory;
  isPrimary?: boolean;
};

export const CANONICAL_TAGS: Array<{ slug: string; name: string; category: TagCategory }> = [
  // Materials
  { slug: "cast-iron", name: "Pure Cast Iron", category: "material" },
  { slug: "full-grain-leather", name: "Full-Grain Leather", category: "material" },
  { slug: "tri-ply-steel", name: "Tri-Ply 304/316 Steel", category: "material" },
  { slug: "kansa-bronze", name: "Pure Kansa (Bronze)", category: "material" },
  { slug: "brass", name: "Solid Brass", category: "material" },
  { slug: "borosilicate", name: "100% Borosilicate Glass", category: "material" },
  { slug: "ebonite", name: "Hard Vulcanized Ebonite", category: "material" },
  { slug: "hard-anodized", name: "Heavy Hard Anodized", category: "material" },
  { slug: "handspun-cotton", name: "Handspun Khadi Cotton", category: "material" },
  { slug: "soapstone", name: "Natural Soapstone (Kalchatti)", category: "material" },

  // Repairability & Longevity
  { slug: "lifetime-warranty", name: "Lifetime Warranty", category: "repairability" },
  { slug: "readily-available-spares", name: "Readily Available Spares", category: "repairability" },
  { slug: "user-serviceable", name: "100% User Serviceable", category: "repairability" },
  { slug: "modular-parts", name: "Modular Parts", category: "repairability" },
  { slug: "no-electronics", name: "Zero Electronics / Pure Mechanical", category: "repairability" },
  { slug: "re-soleable", name: "Stitchdown / Resoleable", category: "repairability" },

  // Region / Origin
  { slug: "tamil-nadu", name: "Tamil Nadu", category: "origin" },
  { slug: "pondicherry", name: "Pondicherry", category: "origin" },
  { slug: "punjab", name: "Punjab (UNESCO Craft)", category: "origin" },
  { slug: "karnataka", name: "Karnataka", category: "origin" },
  { slug: "maharashtra", name: "Maharashtra", category: "origin" },
  { slug: "uttar-pradesh", name: "Uttar Pradesh", category: "origin" },
  { slug: "kashmir", name: "Kashmir", category: "origin" },
  { slug: "gujarat", name: "Gujarat", category: "origin" },

  // Use Case
  { slug: "daily-kitchen", name: "Daily Kitchen Workhorse", category: "use_case" },
  { slug: "heritage-travel", name: "Heritage Travel & Luggage", category: "use_case" },
  { slug: "everyday-carry", name: "Everyday Carry (EDC)", category: "use_case" },
  { slug: "heavy-duty-workshop", name: "Heavy Duty & Workshop", category: "use_case" },
  { slug: "heirloom-dining", name: "Heirloom Dining & Hospitality", category: "use_case" },
];

export type CategoryMeta = {
  slug: ItemCategory;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  accentColor: string;
  topPickSlugs: string[];
};

export type ItemVariant = {
  slug?: string;
  variantNumber: number;
  title: string;
  image: string;
  price?: string;
  numericPrice?: number;
  asin?: string;
  amazonUrl?: string;
  retailLinks?: RetailLink[];
  durabilityScore: number;
  expectedLifespan: string;
  warranty: string;
  material: string;
  origin?: string;
  specs?: Record<string, string>;
  description?: string;
};

export type Item = {
  slug: string;
  title: string;
  subtitle?: string;
  image: string;
  maker: string;
  system: string;
  category: ItemCategory;
  status: ItemStatus;
  yearEstablished: string;
  desc: string;
  isTopPick?: boolean;
  priceEstimate?: string;
  priceRange?: string;
  minNumericPrice?: number;
  careGuide?: string;
  amazonUrl?: string;
  officialStoreUrl?: string;
  availability?: Array<{ name: string; href: string }>;
  retailLinks: RetailLink[];
  variants: ItemVariant[];
  tags?: Tag[];
  extraAttributes?: Record<string, any>;
};

export type ItemSummary = Omit<Item, "variants"> & {
  variantCount: number;
  variantScores?: number[];
  tags?: Tag[];
};

export type ItemDetail = Item & {
  makers: string[];
  careGuideTimeline: Array<{ stage: string; action: string }> | null;
  updatedAt: Date | null;
};

export type VariantDetail = ItemVariant & {
  itemSlug: string;
  itemTitle: string;
  itemStatus: ItemStatus;
  makers: string[];
  system: string;
  tags?: Tag[];
};

export type CategoryFilters = {
  status?: ItemStatus | "All";
  priceRange?: "under-2000" | "2000-5000" | "5000-15000" | "above-15000" | "all";
  material?: string;
  sort?: "score" | "lifespan" | "price-asc" | "price-desc";
};

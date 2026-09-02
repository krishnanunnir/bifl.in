import type { CategoryMeta, ItemCategory } from "./types";

export const CATEGORIES: CategoryMeta[] = [
  {
    slug: "cookware",
    name: "Cookware & Kitchen",
    tagline: "Heavy cast iron, pure bronze (kansa), tri-ply steel & unburstable pressure cookers",
    description:
      "Traditional Indian cooking requires searing heat, acid-rich tamarinds, and heavy spices that destroy synthetic non-stick coatings in months. These generational cookware pieces use pure cast iron, hand-hammered kansa, and tri-ply stainless steel that get better with age.",
    icon: "🍳",
    accentColor: "#8c3b2b",
    topPickSlugs: [
      "hawkins-futura-pressure-cooker",
      "indus-valley-cast-iron-kadai",
      "ptal-handcrafted-brass-bronze-lagan",
      "vinod-platinum-tri-ply-kadai",
      "salem-traditional-kalchatti-pot",
    ],
  },
  {
    slug: "appliances",
    name: "Heavy-Duty Appliances",
    tagline: "High-torque pure copper motors and modular appliances with nationwide spare parts",
    description:
      "Built to withstand daily grinding of whole dried turmeric roots, thick dosa batter, and hot spices. Unlike disposable appliances with plastic gears and circuit boards that fail after power surges, these motors run for 20+ years and cost under ₹100 to service locally.",
    icon: "⚡",
    accentColor: "#28536b",
    topPickSlugs: [
      "preethi-zodiac-mixer-grinder",
      "crompton-high-breeze-fan",
      "butterfly-matchless-mixer",
    ],
  },
  {
    slug: "leather_edc",
    name: "Leather & Everyday Carry",
    tagline: "Full-grain vegetable-tanned hides and stitchdown boots that develop rich patina",
    description:
      "Crafted from 100% full-grain bovine leather tanned with traditional myrobalan seeds and wattle bark in Pondicherry and Kanpur. Sand-cast solid brass buckles, heavy nylon stitching, and zero bonded PU leather.",
    icon: "💼",
    accentColor: "#804a1e",
    topPickSlugs: [
      "hidesign-aiden-leather-briefcase",
      "woodland-oiled-leather-boots",
    ],
  },
  {
    slug: "timepieces",
    name: "Mechanical Horology",
    tagline: "Jeweled mechanical hand-wound movements that tick for decades without batteries",
    description:
      "In-house 17-jewel Parashock mechanical movements and robust stainless steel cases that kept time across modern Indian history. Pure mechanical craftsmanship that any traditional horologist can lubricate and service forever.",
    icon: "⏱️",
    accentColor: "#2a6041",
    topPickSlugs: ["hmt-janata-mechanical-watch"],
  },
  {
    slug: "stationery",
    name: "Stationery & Heritage Pens",
    tagline: "Machined ebonite hard-rubber pens, piston fillers & world-renowned nibs",
    description:
      "Kanpur and Mumbai remain world capitals for artisanal fountain pen crafting. Vulcanized natural hard rubber (ebonite) barrels and in-house ground flexible nibs that write smoothly for generations.",
    icon: "✒️",
    accentColor: "#5a3d75",
    topPickSlugs: [
      "click-aristocrat-fountain-pen",
      "kanwrite-heritage-piston-pen",
      "airmail-69t-ebonite-eyedropper",
    ],
  },
  {
    slug: "home_hardware",
    name: "Home, Tools & Hardware",
    tagline: "Solid brass security, lab-grade borosilicate glass, and precision ductile iron tools",
    description:
      "Heirloom hardware engineered with zero planned obsolescence. Unpickable 7-lever brass padlocks, thermal-shockproof glassware, and heavy workshop planes designed for multi-generational utility.",
    icon: "🔒",
    accentColor: "#705335",
    topPickSlugs: [
      "godrej-nav-tal-brass-padlock",
      "borosil-vision-borosilicate-glassware",
      "milton-thermosteel-flask",
      "safari-ray-polypropylene-luggage",
      "anant-cast-iron-hand-plane",
      "swadeshi-copper-water-matka",
    ],
  },
];

export function getCategoryBySlug(slug: string): CategoryMeta | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

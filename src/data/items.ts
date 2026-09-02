import type { Item } from "@/lib/catalog/types";

export const items: Item[] = [
  {
    slug: "iphone-17",
    title: "Apple iPhone 17",
    subtitle: "Aerospace Grade 5 Titanium & Ceramic Shield with 7-Year OS Support Architecture",
    image: "/images/products/iphone-17.svg",
    maker: "Apple Inc.",
    system: "Aerospace Titanium & Silicon",
    category: "appliances",
    status: "In Production",
    yearEstablished: "Est. 1976",
    isTopPick: true,
    priceEstimate: "₹79,900",
    priceRange: "₹79,900 – ₹1,09,900",
    minNumericPrice: 79900,
    biflSummary:
      "With guaranteed 7+ years of iOS security updates, authorized repair centers in every Indian city, modular back glass and battery replacement, and aerospace Grade 5 titanium build, the iPhone 17 represents the pinnacle of long-lifespan smartphones.",
    biflRatings: {
      overall: 4.88,
      longevity: 4.9,
      repairability: 4.5,
      service: 4.9,
      material: 4.9,
    },
    desc: "Engineered with an aerospace Grade 5 titanium chassis, next-generation Ceramic Shield front glass, and a redesigned internal midframe architecture that allows modular battery and back glass replacements. Backed by guaranteed 7+ years of iOS security updates and nationwide authorized service across India.",
    careGuide:
      "Maintain battery health by keeping charge between 20% and 80% with Optimized Battery Charging enabled. Clean charging port periodically with dry antistatic brush. Official battery swaps available at authorized Apple service centers nationwide for ₹7,500.",
    amazonUrl: "https://www.amazon.in/dp/B0CHX1W1XY",
    officialStoreUrl: "https://www.apple.com/in/shop/buy-iphone",
    retailLinks: [
      { platform: "Amazon.in", url: "https://www.amazon.in/dp/B0CHX1W1XY", price: "₹79,900", badge: "Prime" },
      { platform: "Flipkart", url: "https://www.flipkart.com", price: "₹79,900" },
      { platform: "Croma", url: "https://www.croma.com", price: "₹79,900" },
      { platform: "Reliance Digital", url: "https://www.reliancedigital.in", price: "₹79,900" },
      { platform: "Official Store", url: "https://www.apple.com/in/shop/buy-iphone", price: "₹79,900", badge: "Direct" },
    ],
    tags: [
      { slug: "grade-5-titanium", name: "Aerospace Grade 5 Titanium", category: "material", isPrimary: true },
      { slug: "7-year-os-support", name: "7-Year OS Support", category: "repairability" },
      { slug: "modular-battery", name: "Modular Battery", category: "repairability" },
    ],
    variants: [
      {
        slug: "iphone-17-128gb",
        variantNumber: 1,
        title: "iPhone 17 (128GB Storage)",
        image: "/images/products/iphone-17.svg",
        price: "₹79,900",
        numericPrice: 79900,
        asin: "B0CHX1W1XY",
        amazonUrl: "https://www.amazon.in/dp/B0CHX1W1XY",
        durabilityScore: 4.82,
        expectedLifespan: "7–8 Years",
        warranty: "1-Year Apple Limited Warranty + 7-Year OS Security Updates",
        material: "Grade 5 Titanium Frame & Ceramic Shield Glass",
        specs: {
          Storage: "128 GB",
          Display: "6.3-inch Super Retina XDR OLED 120Hz ProMotion",
          Chipset: "Apple A19 Bionic (3nm)",
          WaterResistance: "IP68 (6m up to 30 mins)",
        },
      },
      {
        slug: "iphone-17-256gb",
        variantNumber: 2,
        title: "iPhone 17 (256GB Storage)",
        image: "/images/products/iphone-17.svg",
        price: "₹89,900",
        numericPrice: 89900,
        asin: "B0CHX28GZ1",
        amazonUrl: "https://www.amazon.in/dp/B0CHX28GZ1",
        durabilityScore: 4.88,
        expectedLifespan: "7–8 Years",
        warranty: "1-Year Apple Limited Warranty + 7-Year OS Security Updates",
        material: "Grade 5 Titanium Frame & Ceramic Shield Glass",
        specs: {
          Storage: "256 GB",
          Display: "6.3-inch Super Retina XDR OLED 120Hz ProMotion",
          Chipset: "Apple A19 Bionic (3nm)",
          WaterResistance: "IP68 (6m up to 30 mins)",
        },
      },
      {
        slug: "iphone-17-512gb",
        variantNumber: 3,
        title: "iPhone 17 (512GB Storage)",
        image: "/images/products/iphone-17.svg",
        price: "₹1,09,900",
        numericPrice: 109900,
        asin: "B0CHX37HK9",
        amazonUrl: "https://www.amazon.in/dp/B0CHX37HK9",
        durabilityScore: 4.92,
        expectedLifespan: "7–8 Years",
        warranty: "1-Year Apple Limited Warranty + 7-Year OS Security Updates",
        material: "Grade 5 Titanium Frame & Ceramic Shield Glass",
        specs: {
          Storage: "512 GB",
          Display: "6.3-inch Super Retina XDR OLED 120Hz ProMotion",
          Chipset: "Apple A19 Bionic (3nm)",
          WaterResistance: "IP68 (6m up to 30 mins)",
        },
      },
    ],
  },
];

export function getTopPicks(): Item[] {
  return items.filter((i) => i.isTopPick).slice(0, 10);
}

export function getItemsByCategory(category: string): Item[] {
  return items.filter((i) => i.category === category);
}

-- Wipe all existing records to ensure clean Supabase state
DELETE FROM "item_makers";
DELETE FROM "item_platforms";
DELETE FROM "item_systems";
DELETE FROM "item_tags";
DELETE FROM "variants";
DELETE FROM "items";
DELETE FROM "makers";
DELETE FROM "tags";
DELETE FROM "platforms";
DELETE FROM "blog_posts";

-- Insert Platforms
INSERT INTO "platforms" ("slug", "display_name", "icon_path") VALUES
('amazon-in', 'Amazon.in', '/platforms/amazon.svg'),
('flipkart', 'Flipkart', '/platforms/store.svg'),
('croma', 'Croma', '/platforms/store.svg'),
('reliance-digital', 'Reliance Digital', '/platforms/store.svg'),
('apple-store', 'Apple Official Store', '/platforms/store.svg');

-- Insert Tags for iPhone 17
INSERT INTO "tags" ("id", "name", "slug", "category") VALUES
('33333333-3333-3333-3333-333333333301', 'Aerospace Grade 5 Titanium', 'grade-5-titanium', 'material'),
('33333333-3333-3333-3333-333333333302', 'Ceramic Shield Front', 'ceramic-shield', 'material'),
('33333333-3333-3333-3333-333333333303', '7-Year OS Security Support', '7-year-os-support', 'repairability'),
('33333333-3333-3333-3333-333333333304', 'Modular Back Glass & Battery', 'modular-battery', 'repairability'),
('33333333-3333-3333-3333-333333333305', 'Authorized Service in India', 'authorized-service-india', 'repairability');

-- Insert Maker (Apple)
INSERT INTO "makers" ("id", "name", "slug", "origin_location", "founded_year", "bio") VALUES
('11111111-1111-1111-1111-111111111199', 'Apple Inc.', 'apple', 'Cupertino, California', 1976, 'Pioneer in consumer electronics, custom silicon, and long-lifespan mobile hardware with multi-year operating system support.');

-- Insert iPhone 17 Single Product Record
INSERT INTO "items" (
  "id",
  "title",
  "slug",
  "subtitle",
  "description",
  "care_guide",
  "system_label",
  "display_category",
  "image_path",
  "status",
  "origin_label",
  "amazon_url",
  "official_store_url",
  "is_published",
  "catalog_order",
  "maker_display",
  "variant_count",
  "child_ratings",
  "availability_json",
  "tags_json"
) VALUES (
  '22222222-2222-2222-2222-222222222299',
  'Apple iPhone 17',
  'iphone-17',
  'Aerospace Grade 5 Titanium & Ceramic Shield with 7-Year OS Support Architecture',
  'Engineered with an aerospace Grade 5 titanium chassis, next-generation Ceramic Shield front glass, and a redesigned internal midframe architecture that allows modular battery and back glass replacements. Backed by guaranteed 7+ years of iOS security updates and nationwide authorized service across India.',
  'Maintain battery health by keeping charge between 20% and 80% with Optimized Battery Charging enabled. Clean charging port periodically with dry antistatic brush. Official battery swaps available at authorized Apple service centers nationwide for ₹7,500.',
  'Aerospace Titanium & Silicon',
  'appliances',
  '/images/products/iphone-17.svg',
  'In Production',
  'Est. 1976',
  'https://www.amazon.in/dp/B0CHX1W1XY',
  'https://www.apple.com/in/shop/buy-iphone',
  true,
  1,
  'Apple Inc.',
  3,
  '[4.82, 4.88, 4.92]'::jsonb,
  '[
    {"name": "Amazon.in", "href": "https://www.amazon.in/dp/B0CHX1W1XY", "price": "₹79,900"},
    {"name": "Flipkart", "href": "https://www.flipkart.com", "price": "₹79,900"},
    {"name": "Croma", "href": "https://www.croma.com", "price": "₹79,900"},
    {"name": "Reliance Digital", "href": "https://www.reliancedigital.in", "price": "₹79,900"},
    {"name": "Official Store", "href": "https://www.apple.com/in/shop/buy-iphone", "price": "₹79,900"}
  ]'::jsonb,
  '[
    {"name": "Aerospace Grade 5 Titanium", "slug": "grade-5-titanium", "category": "material"},
    {"name": "7-Year OS Support", "slug": "7-year-os-support", "category": "repairability"},
    {"name": "Modular Battery", "slug": "modular-battery", "category": "repairability"}
  ]'::jsonb
);

-- Link iPhone 17 to Apple Maker
INSERT INTO "item_makers" ("item_id", "maker_id", "maker_order") VALUES
('22222222-2222-2222-2222-222222222299', '11111111-1111-1111-1111-111111111199', 0);

-- Insert iPhone 17 Variants (128GB, 256GB, 512GB)
INSERT INTO "variants" (
  "id",
  "item_id",
  "slug",
  "variant_number",
  "title",
  "image_path",
  "asin",
  "amazon_url",
  "material",
  "warranty",
  "expected_lifespan",
  "specs_json",
  "durability_score"
) VALUES 
(
  gen_random_uuid(),
  '22222222-2222-2222-2222-222222222299',
  'iphone-17-128gb',
  1,
  'iPhone 17 (128GB Storage)',
  '/images/products/iphone-17.svg',
  'B0CHX1W1XY',
  'https://www.amazon.in/dp/B0CHX1W1XY',
  'Grade 5 Titanium Frame & Ceramic Shield Glass',
  '1-Year Apple Limited Warranty + 7-Year OS Security Updates',
  '7–8 Years',
  '{"Storage": "128 GB", "Display": "6.3-inch Super Retina XDR OLED 120Hz ProMotion", "Chipset": "Apple A19 Bionic (3nm)", "WaterResistance": "IP68 (6m up to 30 mins)"}'::jsonb,
  4.82
),
(
  gen_random_uuid(),
  '22222222-2222-2222-2222-222222222299',
  'iphone-17-256gb',
  2,
  'iPhone 17 (256GB Storage)',
  '/images/products/iphone-17.svg',
  'B0CHX28GZ1',
  'https://www.amazon.in/dp/B0CHX28GZ1',
  'Grade 5 Titanium Frame & Ceramic Shield Glass',
  '1-Year Apple Limited Warranty + 7-Year OS Security Updates',
  '7–8 Years',
  '{"Storage": "256 GB", "Display": "6.3-inch Super Retina XDR OLED 120Hz ProMotion", "Chipset": "Apple A19 Bionic (3nm)", "WaterResistance": "IP68 (6m up to 30 mins)"}'::jsonb,
  4.88
),
(
  gen_random_uuid(),
  '22222222-2222-2222-2222-222222222299',
  'iphone-17-512gb',
  3,
  'iPhone 17 (512GB Storage)',
  '/images/products/iphone-17.svg',
  'B0CHX37HK9',
  'https://www.amazon.in/dp/B0CHX37HK9',
  'Grade 5 Titanium Frame & Ceramic Shield Glass',
  '1-Year Apple Limited Warranty + 7-Year OS Security Updates',
  '7–8 Years',
  '{"Storage": "512 GB", "Display": "6.3-inch Super Retina XDR OLED 120Hz ProMotion", "Chipset": "Apple A19 Bionic (3nm)", "WaterResistance": "IP68 (6m up to 30 mins)"}'::jsonb,
  4.92
);

-- Seed Editorial Essay on Smartphone Longevity
INSERT INTO "blog_posts" ("id", "title", "slug", "excerpt", "body_markdown", "author_email", "is_published", "published_at") VALUES
(
  gen_random_uuid(),
  'The 7-Year Phone: How Modular Titanium Architecture and Long-Term OS Support Redefined Tech BIFL',
  'the-7-year-phone-iphone-longevity',
  'Why modern flagship smartphones with 7-year software updates, modular pull-tab batteries, and Grade 5 titanium chassis have graduated into true Buy It For Life devices in India.',
  '# The 7-Year Phone\n\nFor years, smartphones were the antithesis of Buy It For Life philosophy: glued batteries, planned software obsolescence after two years, and fragile glass sandwiches.\n\n## 1. The 7-Year Software Promise\nHardware longevity is useless if banking apps and security protocols lock you out after 36 months. Apple''s guaranteed 7-year iOS security patch lifecycle means an iPhone 17 purchased today will remain fully functional and secure into the 2030s.\n\n## 2. Modular Repair Architecture in India\nThe internal redesign allows the back glass and battery to be replaced independently without disassembling the sensitive front display assembly. With official Apple authorized service centers across all tier-1 and tier-2 Indian cities, genuine battery swaps cost ₹7,500 and extend device lifespan by another 3–4 years.',
  'curator@bifl.in',
  true,
  NOW()
);

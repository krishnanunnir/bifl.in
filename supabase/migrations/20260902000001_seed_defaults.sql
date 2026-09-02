-- Seed Canonical BIFL India Platforms
INSERT INTO "platforms" ("slug", "display_name", "icon_path") VALUES
('amazon-in', 'Amazon.in', '/platforms/amazon.svg'),
('flipkart', 'Flipkart', '/platforms/store.svg'),
('croma', 'Croma', '/platforms/store.svg'),
('reliance-digital', 'Reliance Digital', '/platforms/store.svg'),
('official-store', 'Official Store', '/platforms/store.svg'),
('tata-cliq', 'Tata CLiQ', '/platforms/store.svg'),
('artisan-guild', 'Artisan Guild', '/platforms/store.svg')
ON CONFLICT ("slug") DO NOTHING;

-- Seed Tags
INSERT INTO "tags" ("id", "name", "slug", "category") VALUES
(gen_random_uuid(), 'Pure Cast Iron', 'cast-iron', 'material'),
(gen_random_uuid(), 'Full-Grain Leather', 'full-grain-leather', 'material'),
(gen_random_uuid(), 'Tri-Ply 304/316 Steel', 'tri-ply-steel', 'material'),
(gen_random_uuid(), 'Pure Kansa (Bronze)', 'kansa-bronze', 'material'),
(gen_random_uuid(), 'Solid Brass', 'brass', 'material'),
(gen_random_uuid(), '100% Borosilicate Glass', 'borosilicate', 'material'),
(gen_random_uuid(), 'Hard Vulcanized Ebonite', 'ebonite', 'material'),
(gen_random_uuid(), 'Heavy Hard Anodized', 'hard-anodized', 'material'),
(gen_random_uuid(), 'Natural Soapstone (Kalchatti)', 'soapstone', 'material'),
(gen_random_uuid(), 'Lifetime Warranty', 'lifetime-warranty', 'repairability'),
(gen_random_uuid(), 'Readily Available Spares', 'readily-available-spares', 'repairability'),
(gen_random_uuid(), '100% User Serviceable', 'user-serviceable', 'repairability'),
(gen_random_uuid(), 'Zero Electronics', 'no-electronics', 'repairability')
ON CONFLICT ("slug") DO NOTHING;

-- Seed Makers
INSERT INTO "makers" ("id", "name", "slug", "origin_location", "founded_year") VALUES
('11111111-1111-1111-1111-111111111101', 'Hawkins Cookers Ltd', 'hawkins-cookers-ltd', 'Maharashtra', 1959),
('11111111-1111-1111-1111-111111111102', 'The Indus Valley', 'the-indus-valley', 'Tamil Nadu', 2016),
('11111111-1111-1111-1111-111111111103', 'Preethi Kitchen Appliances', 'preethi-kitchen-appliances', 'Tamil Nadu', 1978),
('11111111-1111-1111-1111-111111111104', 'Hidesign', 'hidesign', 'Pondicherry', 1978),
('11111111-1111-1111-1111-111111111105', 'HMT Watches Ltd', 'hmt-watches-ltd', 'Karnataka', 1961),
('11111111-1111-1111-1111-111111111106', 'Click Pens', 'click-pens', 'Uttar Pradesh', 1978),
('11111111-1111-1111-1111-111111111107', 'Godrej & Boyce', 'godrej-boyce', 'Maharashtra', 1897),
('11111111-1111-1111-1111-111111111108', 'P-TAL', 'p-tal', 'Punjab', 1900),
('11111111-1111-1111-1111-111111111109', 'Woodland', 'woodland', 'Delhi / NCR', 1992),
('11111111-1111-1111-1111-111111111110', 'Borosil Ltd', 'borosil-ltd', 'Gujarat', 1962),
('11111111-1111-1111-1111-111111111111', 'Milton', 'milton', 'Maharashtra', 1972),
('11111111-1111-1111-1111-111111111112', 'Crompton Greaves', 'crompton-greaves', 'Maharashtra', 1937),
('11111111-1111-1111-1111-111111111113', 'Vinod Cookware', 'vinod-cookware', 'Maharashtra', 1962),
('11111111-1111-1111-1111-111111111114', 'Kanwrite', 'kanwrite', 'Uttar Pradesh', 1986),
('11111111-1111-1111-1111-111111111115', 'Airmail Pen Company', 'airmail-pen-company', 'Maharashtra', 1951),
('11111111-1111-1111-1111-111111111116', 'Safari Industries India', 'safari-industries-india', 'Gujarat', 1974),
('11111111-1111-1111-1111-111111111117', 'Tamil Nadu Traditional Stoneware Artisans', 'tamil-nadu-traditional-stoneware-artisans', 'Tamil Nadu', 1800),
('11111111-1111-1111-1111-111111111118', 'Tambat Ali Artisan Guild', 'tambat-ali-artisan-guild', 'Maharashtra', 1680)
ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name";

-- Seed Items
INSERT INTO "items" ("id", "title", "slug", "subtitle", "description", "care_guide", "system_label", "display_category", "image_path", "status", "origin_label", "amazon_url", "official_store_url", "is_published", "catalog_order", "maker_display", "variant_count", "child_ratings") VALUES
(
  '22222222-2222-2222-2222-222222222201',
  'Hawkins Futura Hard Anodized Pressure Cooker',
  'hawkins-futura-pressure-cooker',
  'The gold standard of Indian pressure cooking with an unburstable safety lid',
  'Engineered with a 6.34mm extra-thick base that stays flat forever and an inner-fitting safety lid that cannot open until pressure drops to zero. Zero chemical non-stick degradation, non-reactive, and every single gasket, safety valve, and handle is replaceable nationwide.',
  'Wash with warm water and soft sponge. Never use harsh steel wool on hard-anodized surfaces. Replace rubber sealing ring every 2–3 years; safety valve is user-replaceable in 2 minutes.',
  'Heavy Hard Anodized',
  'cookware',
  '/images/products/hawkins-futura.webp',
  'In Production',
  'Est. 1959',
  'https://www.amazon.in/dp/B000GR77A6',
  'https://www.hawkinscookers.com',
  true,
  1,
  'Hawkins Cookers Ltd',
  2,
  '[4.88, 4.92]'::jsonb
),
(
  '22222222-2222-2222-2222-222222222202',
  'The Indus Valley Pre-Seasoned Pure Cast Iron Kadai',
  'indus-valley-cast-iron-kadai',
  'Heirloom generational cookware seasoned with 100% edible vegetable oils',
  'Single-piece heavy ductile cast iron with zero synthetic non-stick coatings, teflon, or heavy metals. Naturally enriches food with dietary iron, achieves glassy smooth natural seasoning over months of cooking, and lasts literally generations.',
  'Wash with warm water, wipe dry immediately, apply a drop of gingelly/mustard oil. Year 5: Dense mirror-like black patina forms. Decades: Inherited by children in pristine non-stick condition.',
  'Heirloom Cast Iron',
  'cookware',
  '/images/products/indus-valley-kadai.webp',
  'In Production',
  'Est. 2016',
  'https://www.amazon.in/dp/B085VLCZZ2',
  'https://www.theindusvalley.com',
  true,
  2,
  'The Indus Valley',
  1,
  '[4.95]'::jsonb
),
(
  '22222222-2222-2222-2222-222222222203',
  'Preethi Zodiac 750W Heavy-Duty Mixer Grinder',
  'preethi-zodiac-mixer-grinder',
  'High-torque copper wound motor with stainless steel heavy-gauge jars',
  'Powered by the legendary Vega W5 750W pure copper-wound motor tested for 215 hours of continuous grinding. Heavy 304 food-grade stainless steel jars with nylon couplers and machine-ground steel blades handle tough turmeric, batter, and spices without burning out.',
  'Wipe base unit with dry cloth; avoid overloading above line. Couplers and motor carbon brushes are standardized parts replaceable for under ₹100 anywhere in India.',
  'Modular & Serviceable',
  'appliances',
  '/images/products/preethi-zodiac.webp',
  'In Production',
  'Est. 1978',
  'https://www.amazon.in/dp/B00V34T1C4',
  'https://www.preethi.in',
  true,
  3,
  'Preethi Kitchen Appliances',
  1,
  '[4.82]'::jsonb
),
(
  '22222222-2222-2222-2222-222222222204',
  'Hidesign Aiden & Ambassador Full-Grain Leather Briefcases',
  'hidesign-aiden-leather-briefcase',
  'Pondicherry vegetable-tanned full grain leather with solid brass hardware',
  'Handcrafted in Pondicherry using traditional East India vegetable tanning with myrobalan seeds and wattle bark. Full-grain bovine hide develops a breathtaking honey patina over decades. Accented with custom forged sand-cast brass hardware that never rusts or peels.',
  'Condition with beeswax or leather balm twice a year. If wet, let dry naturally away from direct heat. Hidesign provides lifetime restoration and hardware repairs at company ateliers.',
  'Full-Grain Leather',
  'leather_edc',
  '/images/products/hidesign-aiden.webp',
  'In Production',
  'Est. 1978',
  'https://www.amazon.in/dp/B01F3OC62K',
  'https://www.hidesign.com',
  true,
  4,
  'Hidesign',
  1,
  '[4.86]'::jsonb
),
(
  '22222222-2222-2222-2222-222222222205',
  'HMT Janata & Pilot Hand-Wound Mechanical Watches',
  'hmt-janata-mechanical-watch',
  'The timepiece that kept the nation''s time with 17-Jewel Parashock movement',
  'Built under license from Citizen Watch Co. of Japan, the in-house HMT 0231 caliber 17-jewel mechanical hand-wound movement became an Indian legend. With shock-resistant Parashock jewels, hand-pressed stainless steel case, and zero battery dependence, it ticks flawlessly across decades with simple mechanical lubrication.',
  'Wind 20–25 turns every morning until gentle resistance is felt. Service movement with synthetic watch oil every 5–7 years at any traditional local horologist.',
  'Mechanical Horology',
  'timepieces',
  '/images/products/hmt-janata.webp',
  'Heritage',
  'Est. 1961',
  NULL,
  'https://www.hmtwatches.in',
  true,
  5,
  'HMT Watches Ltd',
  1,
  '[4.88]'::jsonb
),
(
  '22222222-2222-2222-2222-222222222206',
  'Click Aristocrat & Renaissance Acrylic Fountain Pens',
  'click-aristocrat-fountain-pen',
  'Precision Indian penmaking from Kanpur with modular nib units and ebonite feeds',
  'Manufactured in Kanpur since 1978, Click produces high-grade turned acrylic and ebonite fountain pens. Featuring an ingenious 3-in-1 filling system (cartridge, converter, or full eyedropper barrel with 4ml ink capacity) and standard #6 screw-in nib units, it is virtually indestructible and infinitely customizable.',
  'Flush with room temperature water when changing ink colors. Silicone grease on section threads allows eyedropper filling. Nib units screw out for easy cleaning.',
  'Stationery & Heritage Pens',
  'stationery',
  '/images/products/click-aristocrat.webp',
  'In Production',
  'Est. 1978',
  'https://www.amazon.in/dp/B08DFGZ76N',
  'https://www.clickpens.in',
  true,
  6,
  'Click Pens',
  1,
  '[4.84]'::jsonb
),
(
  '22222222-2222-2222-2222-222222222207',
  'Godrej Nav-Tal 7 & 8 Levers Solid Brass Padlock',
  'godrej-nav-tal-brass-padlock',
  'The unpickable steel-and-brass sentinel guarding Indian homes since 1897',
  'Forged in solid pressure-riveted brass casing with 7 or 8 precision brass levers and an electroplated hardened boron-steel shackle. Resistant to hacksaws, corrosion, and weather extremes, Nav-Tal padlocks routinely protect ancestral gates, vaults, and godowns for 40+ years.',
  'Lubricate keyhole once a year with a drop of machine oil or graphite powder. Avoid water immersion if non-sealed, although brass internals resist corrosion naturally.',
  'Solid Brass',
  'home_hardware',
  '/images/products/godrej-nav-tal.webp',
  'In Production',
  'Est. 1897',
  'https://www.amazon.in/dp/B00J4Y2RUK',
  'https://www.godrej.com',
  true,
  7,
  'Godrej & Boyce',
  1,
  '[4.96]'::jsonb
)
ON CONFLICT ("slug") DO UPDATE SET "title" = EXCLUDED."title";

-- Seed Variants
INSERT INTO "variants" ("id", "item_id", "slug", "variant_number", "title", "image_path", "asin", "amazon_url", "material", "warranty", "expected_lifespan", "durability_score") VALUES
(gen_random_uuid(), '22222222-2222-2222-2222-222222222201', 'futura-3-litre', 1, 'Hawkins Futura 3 Litre Hard Anodised', '/images/variants/hawkins-futura/3l.webp', 'B000GR77A6', 'https://www.amazon.in/dp/B000GR77A6', 'Hard Anodised Heavy Gauge Aluminium (6.34mm Base)', '5-Year Manufacturer + Lifetime Spare Parts', '25+ Years', 4.88),
(gen_random_uuid(), '22222222-2222-2222-2222-222222222201', 'futura-5-litre', 2, 'Hawkins Futura 5 Litre Hard Anodised', '/images/variants/hawkins-futura/5l.webp', 'B000GR914C', 'https://www.amazon.in/dp/B000GR914C', 'Hard Anodised Heavy Gauge Aluminium (6.34mm Base)', '5-Year Manufacturer + Lifetime Spare Parts', '25+ Years', 4.92),
(gen_random_uuid(), '22222222-2222-2222-2222-222222222202', 'kadai-2-5-litre', 1, 'Super-Smooth Cast Iron Kadai (2.5L / 26cm)', '/images/variants/indus-valley-kadai/26cm.webp', 'B085VLCZZ2', 'https://www.amazon.in/dp/B085VLCZZ2', '100% Pure Virgin Cast Iron', 'Lifetime Warranty against cracking', 'Lifetime (50+ Years)', 4.95),
(gen_random_uuid(), '22222222-2222-2222-2222-222222222203', 'zodiac-mg-218', 1, 'Preethi Zodiac MG-218 750-Watt with 5 Jars', '/images/variants/preethi-zodiac/mg218.webp', 'B00V34T1C4', 'https://www.amazon.in/dp/B00V34T1C4', '304 Food Grade Stainless Steel & High-Impact ABS', '5-Year Motor Warranty + Lifetime Free Service', '15–20 Years', 4.82),
(gen_random_uuid(), '22222222-2222-2222-2222-222222222204', 'aiden-02-messenger', 1, 'Aiden 02 Full Grain Leather Messenger / Work Bag', '/images/variants/hidesign-aiden/aiden-02.webp', 'B01F3OC62K', 'https://www.amazon.in/dp/B01F3OC62K', 'Vegetable Tanned Full Grain Ranch Leather', 'Lifetime Craftsmanship Repairs', '20–30 Years', 4.86),
(gen_random_uuid(), '22222222-2222-2222-2222-222222222205', 'janata-devanagari', 1, 'HMT Janata Devanagari Dial Mechanical (Hand-Wound)', '/images/variants/hmt/janata-dev.webp', NULL, NULL, 'Stainless Steel Case, Acrylic Crystal, 17-Jewel Movement', 'Heritage Mechanical', '40+ Years', 4.88),
(gen_random_uuid(), '22222222-2222-2222-2222-222222222206', 'aristocrat-3in1', 1, 'Click Aristocrat 3-in-1 Acrylic Fountain Pen', '/images/variants/click/aristocrat.webp', 'B08DFGZ76N', 'https://www.amazon.in/dp/B08DFGZ76N', 'Cast Resin Acrylic & Solid Steel Clip', '2-Year Guarantee', '25+ Years', 4.84),
(gen_random_uuid(), '22222222-2222-2222-2222-222222222207', 'nav-tal-7-levers', 1, 'Godrej Nav-Tal 7 Levers Solid Brass Padlock', '/images/variants/godrej/navtal-7.webp', 'B00J4Y2RUK', 'https://www.amazon.in/dp/B00J4Y2RUK', 'Solid Riveted Brass Body & Hardened Steel Shackle', '5-Year Guarantee', '40+ Years', 4.96)
ON CONFLICT ("item_id", "slug") DO NOTHING;

-- Seed Initial Blog Essays
INSERT INTO "blog_posts" ("id", "title", "slug", "excerpt", "body_markdown", "author_email", "is_published", "published_at") VALUES
(
  gen_random_uuid(),
  'The Art of Seasoning Indian Cast Iron: From Raw Grey Metal to Glassy Black Patina',
  'art-of-seasoning-indian-cast-iron',
  'Why modern synthetic non-stick coatings are a temporary illusion, and how traditional cold-pressed oils chemically polymerize into an indestructible heirloom cooking surface.',
  '# The Art of Seasoning Indian Cast Iron\n\nIn an era of disposable teflon pans...',
  'curator@bifl.in',
  true,
  NOW()
),
(
  gen_random_uuid(),
  'Deconstructing the Hawkins Futura: Why It Outlives Modern Electronics by Decades',
  'why-hawkins-futura-hard-anodized-lasts-30-years',
  'An engineering breakdown of Hawkins'' 6.34mm hard-anodized base, the unburstable inner lid safety geometry, and the brilliance of modular replaceable gaskets.',
  '# Deconstructing the Hawkins Futura\n\nIn 1959, H.D. Vasudeva established Hawkins...',
  'curator@bifl.in',
  true,
  NOW()
),
(
  gen_random_uuid(),
  'Indian Fountain Pen Renaissance: Kanwrite, Click, and the Legacy of Ebonite',
  'indian-fountain-pen-renaissance',
  'Exploring the century-old craftsmanship of Kanpur nib masters and Mumbai ebonite turners who craft pens that write for generations without electronic planned obsolescence.',
  '# Indian Fountain Pen Renaissance\n\nWhile the world drifted to disposable plastic...',
  'curator@bifl.in',
  true,
  NOW()
)
ON CONFLICT ("slug") DO NOTHING;

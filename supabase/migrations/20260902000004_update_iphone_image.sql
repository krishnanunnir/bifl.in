-- Update iPhone 17 image paths to official photography
UPDATE "items"
SET "image_path" = '/images/products/iphone-17.jpg'
WHERE "slug" = 'iphone-17';

UPDATE "variants"
SET "image_path" = '/images/products/iphone-17.jpg'
WHERE "item_id" = '22222222-2222-2222-2222-222222222299';

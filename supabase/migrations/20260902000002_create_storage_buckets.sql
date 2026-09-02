-- Create Storage Buckets for BIFL India products and covers

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('products', 'products', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
  ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Set up public read access policy for products bucket
DROP POLICY IF EXISTS "Public read access for products bucket" ON storage.objects;
CREATE POLICY "Public read access for products bucket"
ON storage.objects FOR SELECT
USING (bucket_id IN ('products', 'avatars'));

-- Allow service_role to insert/update/delete objects
DROP POLICY IF EXISTS "Service role full access on storage" ON storage.objects;
CREATE POLICY "Service role full access on storage"
ON storage.objects FOR ALL
USING (bucket_id IN ('products', 'avatars'))
WITH CHECK (bucket_id IN ('products', 'avatars'));

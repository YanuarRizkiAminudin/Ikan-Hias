-- Add video_url column to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS video_url text;

-- Allow video uploads in product-images bucket
CREATE POLICY IF NOT EXISTS "pi_video_write"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND is_admin());

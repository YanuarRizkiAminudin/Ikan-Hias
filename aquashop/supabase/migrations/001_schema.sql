-- ============================================================
-- AQUASHOP — Database Schema
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------
-- TABLES
-- ------------------------------------------------------------

CREATE TABLE categories (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  name        text        NOT NULL,
  slug        text        UNIQUE NOT NULL,
  description text,
  image_url   text,
  is_active   boolean     DEFAULT true,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE products (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id uuid        REFERENCES categories(id) ON DELETE CASCADE,
  name        text        NOT NULL,
  slug        text        UNIQUE NOT NULL,
  description text,
  price       numeric(12,2),
  stock       integer     DEFAULT 0,
  size        text,
  image_url   text,
  is_featured boolean     DEFAULT false,
  status      text        DEFAULT 'active'
              CHECK (status IN ('active', 'inactive', 'out_of_stock')),
  created_at  timestamptz DEFAULT now()
);

-- Form inquiry dari importir luar negeri
CREATE TABLE inquiries (
  id                uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name      text        NOT NULL,
  contact_name      text        NOT NULL,
  email             text        NOT NULL,
  phone             text,
  country           text        NOT NULL,
  fish_types        text        NOT NULL,
  quantity_estimate text,
  message           text,
  status            text        DEFAULT 'new'
                    CHECK (status IN ('new', 'read', 'replied')),
  created_at        timestamptz DEFAULT now()
);

-- Tabel info toko (1 baris saja, diedit admin)
CREATE TABLE store_info (
  id              integer     PRIMARY KEY DEFAULT 1,
  CONSTRAINT single_row CHECK (id = 1),
  store_name      text        DEFAULT 'AquaShop',
  tagline         text,
  address         text,
  phone_wa        text,
  email           text,
  maps_embed_url  text,
  instagram       text,
  facebook        text,
  open_hours      text,
  about_text      text,
  updated_at      timestamptz DEFAULT now()
);

INSERT INTO store_info (id) VALUES (1) ON CONFLICT DO NOTHING;

-- Profiles hanya untuk admin
CREATE TABLE profiles (
  id         uuid        REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name       text,
  role       text        DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);

-- ------------------------------------------------------------
-- TRIGGERS
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER store_info_updated_at
  BEFORE UPDATE ON store_info
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ------------------------------------------------------------
-- STORAGE
-- ------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ------------------------------------------------------------

ALTER TABLE categories  ENABLE ROW LEVEL SECURITY;
ALTER TABLE products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries   ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_info  ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles    ENABLE ROW LEVEL SECURITY;

-- Helper function: cek apakah user adalah admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Categories: publik baca, admin semua operasi
CREATE POLICY "cat_read"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "cat_admin"
  ON categories FOR ALL
  USING (is_admin());

-- Products: publik baca, admin semua operasi
CREATE POLICY "prod_read"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "prod_admin"
  ON products FOR ALL
  USING (is_admin());

-- Store info: publik baca, admin update
CREATE POLICY "info_read"
  ON store_info FOR SELECT
  USING (true);

CREATE POLICY "info_admin"
  ON store_info FOR UPDATE
  USING (is_admin());

-- Inquiries: siapa saja bisa kirim, hanya admin bisa baca + update
CREATE POLICY "inq_insert"
  ON inquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "inq_admin"
  ON inquiries FOR ALL
  USING (is_admin());

-- Profiles: hanya admin sendiri
CREATE POLICY "prof_admin"
  ON profiles FOR ALL
  USING (id = auth.uid());

-- Storage policies
CREATE POLICY "pi_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "pi_write"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND is_admin());

CREATE POLICY "pi_del"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND is_admin());

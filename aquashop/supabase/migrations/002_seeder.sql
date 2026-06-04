-- ============================================================
-- AQUASHOP — Seeder Data
-- ============================================================

-- ------------------------------------------------------------
-- CATEGORIES (8 kategori)
-- ------------------------------------------------------------

INSERT INTO categories (name, slug, description) VALUES
  ('Ikan Laut',          'ikan-laut',          'Ikan hias air laut'),
  ('Ikan Air Tawar',     'ikan-air-tawar',      'Ikan hias air tawar'),
  ('Ikan Koi',           'ikan-koi',            'Ikan koi untuk kolam'),
  ('Ikan Cupang',        'ikan-cupang',         'Ikan cupang hias'),
  ('Ikan Discus',        'ikan-discus',         'Ikan discus premium'),
  ('Ikan Louhan',        'ikan-louhan',         'Ikan louhan pilihan'),
  ('Ikan Guppy',         'ikan-guppy',          'Ikan guppy warna-warni'),
  ('Aksesori Akuarium',  'aksesori-akuarium',   'Perlengkapan akuarium')
ON CONFLICT (slug) DO NOTHING;

-- ------------------------------------------------------------
-- PRODUCTS (20 produk)
-- Menggunakan subquery slug agar tidak perlu hardcode UUID
-- ------------------------------------------------------------

INSERT INTO products (name, slug, price, stock, size, category_id, is_featured, status)
VALUES

  -- Ikan Laut
  ('Ikan Clownfish Nemo',
   'ikan-clownfish-nemo',    85000,   15, '3-4 cm',
   (SELECT id FROM categories WHERE slug = 'ikan-laut'),
   true, 'active'),

  ('Ikan Blue Tang',
   'ikan-blue-tang',         120000,   8, '5-6 cm',
   (SELECT id FROM categories WHERE slug = 'ikan-laut'),
   true, 'active'),

  ('Ikan Lionfish',
   'ikan-lionfish',          250000,   5, '8-10 cm',
   (SELECT id FROM categories WHERE slug = 'ikan-laut'),
   false, 'active'),

  -- Ikan Air Tawar
  ('Arwana Silver',
   'arwana-silver',         1500000,   3, '25-30 cm',
   (SELECT id FROM categories WHERE slug = 'ikan-air-tawar'),
   true, 'active'),

  ('Ikan Oscar Red',
   'ikan-oscar-red',          75000,  20, '8-10 cm',
   (SELECT id FROM categories WHERE slug = 'ikan-air-tawar'),
   false, 'active'),

  ('Ikan Manfish Altum',
   'ikan-manfish-altum',      95000,  10, '8-10 cm',
   (SELECT id FROM categories WHERE slug = 'ikan-air-tawar'),
   false, 'active'),

  -- Ikan Koi
  ('Ikan Koi Kohaku',
   'ikan-koi-kohaku',        200000,  12, '15-20 cm',
   (SELECT id FROM categories WHERE slug = 'ikan-koi'),
   true, 'active'),

  ('Ikan Koi Showa',
   'ikan-koi-showa',         350000,   6, '20-25 cm',
   (SELECT id FROM categories WHERE slug = 'ikan-koi'),
   false, 'active'),

  -- Ikan Cupang
  ('Ikan Cupang Halfmoon',
   'ikan-cupang-halfmoon',    45000,  30, '5-6 cm',
   (SELECT id FROM categories WHERE slug = 'ikan-cupang'),
   true, 'active'),

  ('Ikan Cupang Crown Tail',
   'ikan-cupang-crown-tail',  35000,  25, '5-6 cm',
   (SELECT id FROM categories WHERE slug = 'ikan-cupang'),
   false, 'active'),

  -- Ikan Discus
  ('Ikan Discus Blue Diamond',
   'ikan-discus-blue-diamond', 450000,  4, '10-12 cm',
   (SELECT id FROM categories WHERE slug = 'ikan-discus'),
   true, 'active'),

  ('Ikan Discus Red Marlboro',
   'ikan-discus-red-marlboro', 500000,  4, '10-12 cm',
   (SELECT id FROM categories WHERE slug = 'ikan-discus'),
   true, 'active'),

  -- Ikan Louhan
  ('Ikan Louhan Kamfa',
   'ikan-louhan-kamfa',       350000,   7, '12-15 cm',
   (SELECT id FROM categories WHERE slug = 'ikan-louhan'),
   false, 'active'),

  ('Ikan Louhan Super Red',
   'ikan-louhan-super-red',  5000000,   1, '20-25 cm',
   (SELECT id FROM categories WHERE slug = 'ikan-louhan'),
   true, 'active'),

  -- Ikan Guppy
  ('Ikan Guppy Moscow Blue',
   'ikan-guppy-moscow-blue',   15000,  50, '3-4 cm',
   (SELECT id FROM categories WHERE slug = 'ikan-guppy'),
   false, 'active'),

  ('Ikan Guppy Albino Full Red',
   'ikan-guppy-albino-full-red', 25000, 40, '3-4 cm',
   (SELECT id FROM categories WHERE slug = 'ikan-guppy'),
   true, 'active'),

  ('Ikan Guppy Cobra Green',
   'ikan-guppy-cobra-green',   20000,  35, '3-4 cm',
   (SELECT id FROM categories WHERE slug = 'ikan-guppy'),
   false, 'active'),

  -- Aksesori Akuarium
  ('Filter Canister Sunsun',
   'filter-canister-sunsun',  450000,  15, '-',
   (SELECT id FROM categories WHERE slug = 'aksesori-akuarium'),
   false, 'active'),

  ('Lampu LED Chihiros',
   'lampu-led-chihiros',      350000,  20, '60 cm',
   (SELECT id FROM categories WHERE slug = 'aksesori-akuarium'),
   false, 'active'),

  ('Pasir Silika Putih Premium',
   'pasir-silika-putih-premium', 45000, 30, '5 kg',
   (SELECT id FROM categories WHERE slug = 'aksesori-akuarium'),
   false, 'active')

ON CONFLICT (slug) DO NOTHING;

-- ------------------------------------------------------------
-- STORE INFO
-- ------------------------------------------------------------

UPDATE store_info SET
  store_name     = 'AquaShop',
  tagline        = 'Surga Ikan Hias Terlengkap',
  address        = 'Jl. Raya Ikan Hias No. 88, Kota Anda',
  phone_wa       = '6281234567890',
  email          = 'info@aquashop.id',
  maps_embed_url = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.0!2d106.8!3d-6.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTInMDAuMCJTIDEwNsKwNDgnMDAuMCJF!5e0!3m2!1sid!2sid!4v1000000000000',
  instagram      = 'aquashop.id',
  facebook       = 'AquaShopID',
  open_hours     = 'Senin–Sabtu: 08.00–18.00 | Minggu: 09.00–15.00',
  about_text     = 'AquaShop adalah toko ikan hias terpercaya yang telah berdiri sejak 2010. Kami menyediakan berbagai jenis ikan hias air laut, air tawar, dan aksesori akuarium berkualitas. Dengan pengalaman lebih dari 14 tahun, kami siap melayani pecinta ikan hias di seluruh Indonesia dan mancanegara.'
WHERE id = 1;

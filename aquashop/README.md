# 🐠 AquaShop — Toko Ikan Hias

Website profil toko ikan hias dengan katalog produk, form inquiry ekspor internasional, dan panel admin.

> **Bukan e-commerce penuh** — pengunjung lihat katalog lalu hubungi via WhatsApp untuk membeli.

---

## ✨ Fitur

### Halaman Publik
| Route | Deskripsi |
|---|---|
| `/` | Beranda: hero, kategori, produk unggulan, cara beli, CTA ekspor |
| `/catalog` | Katalog: grid produk, filter kategori, search, sort harga |
| `/product/:slug` | Detail produk: foto, stok, ukuran + tombol WA otomatis |
| `/export` | Form inquiry kerja sama ekspor importir + honeypot anti-spam |
| `/about` | Tentang toko: sejarah, keunggulan, statistik |
| `/contact` | Lokasi, embed Google Maps, jam buka, tombol WA besar |

### Panel Admin (login required)
| Route | Deskripsi |
|---|---|
| `/admin/login` | Form login admin |
| `/admin` | Dashboard: statistik, stok menipis ≤5, inquiry belum dibaca |
| `/admin/products` | CRUD produk + upload foto ke Supabase Storage |
| `/admin/categories` | CRUD kategori via modal |
| `/admin/inquiries` | List inquiry + ubah status (new/read/replied) |
| `/admin/store` | Edit info toko (nama, WA, alamat, maps, jam buka) |

---

## 🛠 Tech Stack

| | |
|---|---|
| **Frontend** | React 18.3 + TypeScript |
| **Build tool** | Vite 5.4 |
| **Styling** | TailwindCSS 3.4 |
| **Routing** | React Router DOM 6 |
| **Backend** | Supabase (PostgreSQL + Auth + Storage) |
| **Deploy** | Vercel |

---

## 🚀 Cara Menjalankan Lokal

### 1. Clone repo

```bash
git clone https://github.com/YanuarRizkiAminudin/Ikan-Hias.git
cd Ikan-Hias/aquashop
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment

```bash
cp .env.example .env.local
```

Edit `.env.local` dan isi:
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

> Ambil dari Supabase dashboard → **Settings → API**

### 4. Setup database

Jalankan SQL berikut di **Supabase SQL Editor** secara berurutan:

1. `supabase/migrations/001_schema.sql` — buat tabel, RLS, storage bucket
2. `supabase/migrations/002_seeder.sql` — isi data awal (8 kategori, 20 produk, info toko)

### 5. Buat akun admin

Di Supabase → **Authentication → Users → Add user**, buat user dengan email & password.

Lalu jalankan di SQL Editor (ganti UUID dengan ID user yang baru dibuat):

```sql
INSERT INTO profiles (id, name, role)
VALUES ('<uuid-dari-auth-users>', 'Admin', 'admin');
```

### 6. Jalankan dev server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## 📦 Deploy ke Vercel

1. Import repo di [vercel.com](https://vercel.com)
2. Set **Root Directory** → `aquashop`
3. **Framework Preset** → `Vite`
4. Tambahkan **Environment Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy ✅

File `vercel.json` sudah dikonfigurasi untuk SPA routing (semua path → `index.html`).

---

## 📁 Struktur Folder

```
aquashop/
├── public/
├── src/
│   ├── components/
│   │   ├── ui/          Button, Input, Badge, Modal, Spinner, Toast
│   │   ├── layout/      Navbar, Footer, BottomNav, AdminSidebar, AdminLayout
│   │   └── product/     ProductCard, ProductGrid
│   ├── context/         AdminContext (session + profil admin)
│   ├── hooks/           useProducts, useAdmin, useToast
│   ├── lib/             supabase.ts, utils.ts, constants.ts, types.ts
│   ├── pages/
│   │   ├── public/      Home, Catalog, ProductDetail, About, Contact, Export
│   │   └── admin/       AdminLogin, Dashboard, Products, ProductForm,
│   │                    Categories, Inquiries, StoreSettings
│   └── routes/          AppRouter, AdminRoute
├── supabase/
│   └── migrations/      001_schema.sql, 002_seeder.sql
├── .env.example
├── vercel.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 🔒 Keamanan

- Semua credential via `import.meta.env` — tidak ada hardcoded secret
- `.env.local` di-ignore oleh git
- Row Level Security (RLS) aktif di semua tabel Supabase
- Publik hanya bisa **baca** produk, kategori, info toko
- Hanya admin (terdaftar di tabel `profiles`) yang bisa write/delete
- Form inquiry ekspor dilindungi honeypot anti-spam

---

## 📋 Roadmap

- **v2** — Sistem order sederhana: form order + upload bukti transfer + admin konfirmasi
- **v3** — Integrasi kurir (RajaOngkir/Biteship): cek ongkir + nomor resi

---

## 📄 Lisensi

MIT © 2025 AquaShop

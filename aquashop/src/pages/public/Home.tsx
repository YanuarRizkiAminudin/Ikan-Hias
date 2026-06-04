import { Link } from 'react-router-dom'
import { ROUTES, APP_NAME } from '@/lib/constants'
import { useFeaturedProducts, useCategories, useStoreInfo } from '@/hooks/useProducts'
import { buildWaUrl } from '@/lib/utils'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import BottomNav from '@/components/layout/BottomNav'
import ProductGrid from '@/components/product/ProductGrid'
import Button from '@/components/ui/Button'

export default function Home() {
  const { products, loading, error } = useFeaturedProducts()
  const { categories }               = useCategories()
  const { storeInfo }                = useStoreInfo()

  const waUrl = storeInfo?.phone_wa
    ? buildWaUrl(storeInfo.phone_wa, `Halo ${APP_NAME}, saya ingin bertanya tentang ikan hias.`)
    : '#'

  return (
    <>
      <Navbar />

      <main>
        {/* ── HERO ── */}
        <section
          className="relative min-h-screen bg-gradient-to-b from-primary to-secondary overflow-hidden flex flex-col items-center justify-center text-center px-4"
          aria-label="Hero"
        >
          {/* Wave SVG layer 1 */}
          <div className="absolute bottom-0 left-0 w-[200%] pointer-events-none opacity-30" aria-hidden="true">
            <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg" className="wave-animate">
              <path fill="#ffffff" d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,48C840,43,960,53,1080,64C1200,75,1320,85,1380,90.7L1440,96L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"/>
              <path fill="#ffffff" d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,48C840,43,960,53,1080,64C1200,75,1320,85,1380,90.7L1440,96L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"/>
            </svg>
          </div>
          {/* Wave SVG layer 2 */}
          <div className="absolute bottom-0 left-0 w-[200%] pointer-events-none opacity-60" aria-hidden="true">
            <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" className="wave-animate-slow">
              <path fill="#ffffff" d="M0,32L80,37.3C160,43,320,53,480,53.3C640,53,800,43,960,37.3C1120,32,1280,32,1360,32L1440,32L1440,80L1360,80C1280,80,1120,80,960,80C800,80,640,80,480,80C320,80,160,80,80,80L0,80Z"/>
            </svg>
          </div>

          <div className="relative z-10 max-w-2xl">
            <p className="text-white/80 font-semibold text-sm uppercase tracking-widest mb-4">
              🐠 Selamat Datang di
            </p>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 drop-shadow-lg">
              {APP_NAME}
            </h1>
            <p className="text-white/90 text-xl md:text-2xl font-medium mb-8">
              {storeInfo?.tagline ?? 'Surga Ikan Hias Terlengkap'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={ROUTES.CATALOG}>
                <Button variant="primary" size="lg">
                  Lihat Katalog
                </Button>
              </Link>
              <a href={waUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="wa" size="lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Hubungi via WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* ── KATEGORI ── */}
        <section className="py-16 bg-bg-light" aria-labelledby="kategori-heading">
          <div className="max-w-7xl mx-auto px-4">
            <h2 id="kategori-heading" className="text-3xl font-extrabold text-text-dark text-center mb-2">
              Kategori Ikan
            </h2>
            <p className="text-gray-500 text-center mb-10">Temukan ikan hias favorit Anda</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  to={`${ROUTES.CATALOG}?category=${cat.slug}`}
                  className="card p-6 flex flex-col items-center gap-3 hover:border-primary border border-transparent transition-all duration-200 group"
                  aria-label={`Kategori ${cat.name}`}
                >
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-200" aria-hidden="true">
                    {getCategoryEmoji(cat.slug)}
                  </div>
                  <span className="font-bold text-sm text-text-dark text-center group-hover:text-primary transition-colors">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRODUK UNGGULAN ── */}
        <section className="py-16" aria-labelledby="unggulan-heading">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 id="unggulan-heading" className="text-3xl font-extrabold text-text-dark mb-1">
                  Produk Unggulan
                </h2>
                <p className="text-gray-500">Pilihan terbaik dari koleksi kami</p>
              </div>
              <Link to={ROUTES.CATALOG} className="text-primary font-semibold text-sm hover:underline hidden sm:block">
                Lihat Semua →
              </Link>
            </div>
            <ProductGrid products={products} loading={loading} error={error} />
            <div className="text-center mt-8 sm:hidden">
              <Link to={ROUTES.CATALOG}>
                <Button variant="ghost">Lihat Semua Produk</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── CARA BELI ── */}
        <section className="py-16 bg-bg-light" aria-labelledby="cara-beli-heading">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h2 id="cara-beli-heading" className="text-3xl font-extrabold text-text-dark mb-2">
              Cara Membeli
            </h2>
            <p className="text-gray-500 mb-12">Mudah dan terpercaya</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '1', icon: '🔍', title: 'Pilih Ikan', desc: 'Browse katalog dan pilih ikan hias yang Anda inginkan.' },
                { step: '2', icon: '💬', title: 'Hubungi via WhatsApp', desc: 'Tanya ketersediaan stok dan konfirmasi harga terkini via WA.' },
                { step: '3', icon: '🏪', title: 'Datang ke Toko', desc: 'Ambil ikan langsung di toko kami atau atur pengiriman.' },
              ].map(item => (
                <div key={item.step} className="card p-8 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-extrabold text-xl mb-4" aria-hidden="true">
                    {item.step}
                  </div>
                  <div className="text-4xl mb-3" aria-hidden="true">{item.icon}</div>
                  <h3 className="font-bold text-text-dark text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA EKSPOR ── */}
        <section className="py-16 bg-gradient-to-r from-primary to-primary-dark text-white text-center px-4" aria-labelledby="ekspor-heading">
          <div className="max-w-2xl mx-auto">
            <h2 id="ekspor-heading" className="text-3xl font-extrabold mb-3">Importir Ikan Hias?</h2>
            <p className="text-white/80 mb-8 text-lg">
              Kami melayani kerja sama ekspor ikan hias ke seluruh dunia. Hubungi kami untuk info lebih lanjut.
            </p>
            <Link to={ROUTES.EXPORT}>
              <Button variant="primary" size="lg">
                Pelajari Kerja Sama Ekspor
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
      <BottomNav />
    </>
  )
}

function getCategoryEmoji(slug: string): string {
  const map: Record<string, string> = {
    'ikan-laut':          '🐠',
    'ikan-air-tawar':     '🐟',
    'ikan-koi':           '🎏',
    'ikan-cupang':        '🐡',
    'ikan-discus':        '💧',
    'ikan-louhan':        '🐙',
    'ikan-guppy':         '✨',
    'aksesori-akuarium':  '🪸',
  }
  return map[slug] ?? '🐟'
}

import { useParams, Link, Navigate } from 'react-router-dom'
import { useProduct, useStoreInfo } from '@/hooks/useProducts'
import { formatRupiah, buildWaUrl } from '@/lib/utils'
import { ROUTES, LOW_STOCK_THRESHOLD } from '@/lib/constants'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import BottomNav from '@/components/layout/BottomNav'
import Badge from '@/components/ui/Badge'
import Spinner from '@/components/ui/Spinner'

export default function ProductDetail() {
  const { slug }              = useParams<{ slug: string }>()
  const { product, loading, error } = useProduct(slug ?? '')
  const { storeInfo }         = useStoreInfo()

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <Spinner size="lg" />
        </div>
        <BottomNav />
      </>
    )
  }

  if (error || !product) {
    return <Navigate to={ROUTES.CATALOG} replace />
  }

  const isLowStock   = product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD
  const isOutOfStock = product.stock === 0 || product.status === 'out_of_stock'

  const waMessage = `Halo, saya tertarik dengan ${product.name}${product.size && product.size !== '-' ? ` (${product.size})` : ''}. Apakah stok masih tersedia? Berapa harganya?`
  const waUrl     = storeInfo?.phone_wa
    ? buildWaUrl(storeInfo.phone_wa, waMessage)
    : '#'

  return (
    <>
      <Navbar />

      <main className="min-h-screen pb-20 md:pb-0">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 py-4">
          <ol className="flex items-center gap-2 text-sm text-gray-400" role="list">
            <li><Link to={ROUTES.HOME} className="hover:text-primary">Beranda</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link to={ROUTES.CATALOG} className="hover:text-primary">Katalog</Link></li>
            {product.categories && (
              <>
                <li aria-hidden="true">/</li>
                <li>
                  <Link
                    to={`${ROUTES.CATALOG}?category=${product.categories.slug}`}
                    className="hover:text-primary"
                  >
                    {product.categories.name}
                  </Link>
                </li>
              </>
            )}
            <li aria-hidden="true">/</li>
            <li className="text-text-dark font-medium truncate max-w-[160px]">{product.name}</li>
          </ol>
        </nav>

        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

            {/* Gambar & Video */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-bg-light rounded-2xl overflow-hidden">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-8xl" aria-hidden="true">
                    🐟
                  </div>
                )}
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="badge bg-gray-800 text-white text-sm font-bold px-4 py-2">
                      Stok Habis
                    </span>
                  </div>
                )}
              </div>

              {/* Video */}
              {product.video_url && (
                <div className="rounded-2xl overflow-hidden bg-black">
                  <video
                    src={product.video_url}
                    controls
                    className="w-full max-h-72 object-contain"
                    aria-label={`Video ${product.name}`}
                    preload="metadata"
                  />
                </div>
              )}
            </div>

            {/* Detail */}
            <div className="flex flex-col gap-4">
              {product.categories && (
                <Link
                  to={`${ROUTES.CATALOG}?category=${product.categories.slug}`}
                  className="text-secondary font-semibold text-sm uppercase tracking-wide hover:underline w-fit"
                >
                  {product.categories.name}
                </Link>
              )}

              <h1 className="text-3xl font-extrabold text-text-dark leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-3xl font-extrabold text-primary">
                  {formatRupiah(product.price)}
                </span>
                <span className="text-xs text-gray-400 font-normal">(harga referensi)</span>
              </div>

              {/* Badge stok */}
              <div className="flex gap-2 flex-wrap">
                {isOutOfStock  && <Badge variant="danger">Stok Habis</Badge>}
                {!isOutOfStock && isLowStock && <Badge variant="warning">Hampir Habis — sisa {product.stock}</Badge>}
                {!isOutOfStock && !isLowStock && <Badge variant="success">Tersedia — stok {product.stock}</Badge>}
                {product.is_featured && <Badge variant="primary">Produk Unggulan</Badge>}
              </div>

              {/* Info */}
              <dl className="grid grid-cols-2 gap-3 text-sm">
                {product.size && product.size !== '-' && (
                  <>
                    <dt className="text-gray-500 font-medium">Ukuran</dt>
                    <dd className="font-semibold text-text-dark">{product.size}</dd>
                  </>
                )}
              </dl>

              {/* Deskripsi */}
              {product.description && (
                <div>
                  <h2 className="font-bold text-text-dark mb-2">Deskripsi</h2>
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Tombol WA */}
              <div className="mt-auto pt-4 border-t border-gray-100">
                {!isOutOfStock ? (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-wa inline-flex w-full justify-center text-base"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Tanya via WhatsApp
                  </a>
                ) : (
                  <Link to={ROUTES.CATALOG} className="btn-secondary inline-flex w-full justify-center text-base">
                    Lihat Produk Lain
                  </Link>
                )}
                <p className="text-xs text-gray-400 text-center mt-2">
                  Konfirmasi harga & stok via WhatsApp sebelum datang ke toko
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </>
  )
}

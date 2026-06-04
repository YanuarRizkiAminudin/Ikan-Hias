import { Link } from 'react-router-dom'
import type { Product } from '@/lib/types'
import { formatRupiah } from '@/lib/utils'
import { LOW_STOCK_THRESHOLD } from '@/lib/constants'
import Badge from '@/components/ui/Badge'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const isLowStock    = product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD
  const isOutOfStock  = product.stock === 0 || product.status === 'out_of_stock'

  return (
    <article className="card group">
      <Link
        to={`/product/${product.slug}`}
        aria-label={`Lihat detail ${product.name}`}
        className="block"
      >
        {/* Gambar 1:1 */}
        <div className="relative aspect-square bg-bg-light overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl" aria-hidden="true">
              🐟
            </div>
          )}

          {/* Badge stok */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="badge bg-gray-800 text-white text-xs font-bold px-3 py-1">
                Stok Habis
              </span>
            </div>
          )}
          {!isOutOfStock && isLowStock && (
            <div className="absolute top-2 left-2">
              <Badge variant="warning">Hampir Habis</Badge>
            </div>
          )}
          {product.is_featured && !isOutOfStock && (
            <div className="absolute top-2 right-2">
              <Badge variant="primary">Unggulan</Badge>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          {product.categories && (
            <p className="text-xs text-secondary font-semibold uppercase tracking-wide mb-1">
              {product.categories.name}
            </p>
          )}
          <h3 className="font-bold text-text-dark text-sm leading-snug line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between gap-2">
            <p className="text-primary font-extrabold text-base">
              {formatRupiah(product.price)}
            </p>
            {product.size && product.size !== '-' && (
              <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                {product.size}
              </span>
            )}
          </div>
          {!isOutOfStock && (
            <p className="text-xs text-gray-400 mt-1">Stok: {product.stock}</p>
          )}
        </div>
      </Link>
    </article>
  )
}

export default ProductCard

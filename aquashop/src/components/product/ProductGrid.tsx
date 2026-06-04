import type { Product } from '@/lib/types'
import ProductCard from './ProductCard'
import Spinner from '@/components/ui/Spinner'

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  error?: string | null
  emptyMessage?: string
}

export function ProductGrid({
  products,
  loading = false,
  error = null,
  emptyMessage = 'Belum ada produk.',
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16 text-red-500" role="alert">
        <p className="text-4xl mb-3" aria-hidden="true">⚠️</p>
        <p className="font-semibold">{error}</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3" aria-hidden="true">🔍</p>
        <p className="font-semibold">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
      role="list"
      aria-label="Daftar produk"
    >
      {products.map(product => (
        <div key={product.id} role="listitem">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  )
}

export default ProductGrid

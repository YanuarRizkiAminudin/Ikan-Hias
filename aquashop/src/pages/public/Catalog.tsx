import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProducts, useCategories } from '@/hooks/useProducts'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import BottomNav from '@/components/layout/BottomNav'
import ProductGrid from '@/components/product/ProductGrid'
import Input from '@/components/ui/Input'

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch]             = useState(searchParams.get('q') ?? '')
  const [sort, setSort]                 = useState(searchParams.get('sort') ?? '')
  const [categorySlug, setCategorySlug] = useState(searchParams.get('category') ?? '')
  const [debouncedSearch, setDebouncedSearch] = useState(search)

  const { categories } = useCategories()
  const { products, loading, error } = useProducts({
    categorySlug: categorySlug || undefined,
    search: debouncedSearch || undefined,
    sort: sort || undefined,
  })

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(t)
  }, [search])

  // Sync URL params
  useEffect(() => {
    const params: Record<string, string> = {}
    if (debouncedSearch) params.q        = debouncedSearch
    if (sort)            params.sort     = sort
    if (categorySlug)    params.category = categorySlug
    setSearchParams(params, { replace: true })
  }, [debouncedSearch, sort, categorySlug, setSearchParams])

  const clearFilters = () => {
    setSearch('')
    setDebouncedSearch('')
    setSort('')
    setCategorySlug('')
  }

  const hasFilter = !!(search || sort || categorySlug)

  return (
    <>
      <Navbar />

      <main className="min-h-screen pb-20 md:pb-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary py-12 text-white text-center px-4">
          <h1 className="text-4xl font-extrabold mb-2">Katalog Ikan Hias</h1>
          <p className="text-white/80">Temukan ikan impian Anda dari koleksi kami</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Filter bar */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            {/* Search */}
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Cari nama ikan..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label="Cari produk"
              />
            </div>

            {/* Filter kategori */}
            <select
              value={categorySlug}
              onChange={e => setCategorySlug(e.target.value)}
              aria-label="Filter kategori"
              className="input-base md:w-48"
            >
              <option value="">Semua Kategori</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              aria-label="Urutkan produk"
              className="input-base md:w-48"
            >
              <option value="">Terbaru</option>
              <option value="price_asc">Harga: Termurah</option>
              <option value="price_desc">Harga: Termahal</option>
            </select>

            {hasFilter && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-red-500 font-medium whitespace-nowrap px-2"
              >
                Reset Filter
              </button>
            )}
          </div>

          {/* Result count */}
          {!loading && (
            <p className="text-sm text-gray-500 mb-4">
              {products.length} produk ditemukan
            </p>
          )}

          <ProductGrid
            products={products}
            loading={loading}
            error={error}
            emptyMessage="Tidak ada produk yang sesuai filter."
          />
        </div>
      </main>

      <Footer />
      <BottomNav />
    </>
  )
}

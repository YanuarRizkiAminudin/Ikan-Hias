import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Product, Category, StoreInfo } from '@/lib/types'

export function useProducts(filters?: { categorySlug?: string; search?: string; sort?: string }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        let query = supabase
          .from('products')
          .select('*, categories(id, name, slug)')
          .eq('status', 'active')

        if (filters?.categorySlug) {
          const { data: cat } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', filters.categorySlug)
            .single()
          if (cat) query = query.eq('category_id', cat.id)
        }

        if (filters?.search) {
          query = query.ilike('name', `%${filters.search}%`)
        }

        if (filters?.sort === 'price_asc')  query = query.order('price', { ascending: true })
        else if (filters?.sort === 'price_desc') query = query.order('price', { ascending: false })
        else query = query.order('created_at', { ascending: false })

        const { data, error: err } = await query
        if (err) throw err
        setProducts(data ?? [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal memuat produk')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [filters?.categorySlug, filters?.search, filters?.sort])

  return { products, loading, error }
}

export function useFeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const { data, error: err } = await supabase
          .from('products')
          .select('*, categories(id, name, slug)')
          .eq('is_featured', true)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(8)
        if (err) throw err
        setProducts(data ?? [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal memuat produk unggulan')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return { products, loading, error }
}

export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    const fetch = async () => {
      try {
        setLoading(true)
        const { data, error: err } = await supabase
          .from('products')
          .select('*, categories(id, name, slug)')
          .eq('slug', slug)
          .single()
        if (err) throw err
        setProduct(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Produk tidak ditemukan')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [slug])

  return { product, loading, error }
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState<string | null>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const { data, error: err } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('name')
        if (err) throw err
        setCategories(data ?? [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal memuat kategori')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return { categories, loading, error }
}

export function useStoreInfo() {
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<string | null>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const { data, error: err } = await supabase
          .from('store_info')
          .select('*')
          .eq('id', 1)
          .single()
        if (err) throw err
        setStoreInfo(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal memuat info toko')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return { storeInfo, loading, error }
}

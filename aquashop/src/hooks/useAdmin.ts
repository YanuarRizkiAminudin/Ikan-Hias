import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Product, Category, Inquiry, StoreInfo } from '@/lib/types'
import { LOW_STOCK_THRESHOLD } from '@/lib/constants'

// ── Dashboard stats ──────────────────────────────────────────

export interface DashboardStats {
  totalProducts:   number
  lowStockProducts: Product[]
  unreadInquiries: number
  totalCategories: number
}

export function useDashboardStats() {
  const [stats, setStats]   = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [prodRes, inqRes, catRes] = await Promise.all([
        supabase.from('products').select('*').eq('status', 'active'),
        supabase.from('inquiries').select('id', { count: 'exact' }).eq('status', 'new'),
        supabase.from('categories').select('id', { count: 'exact' }).eq('is_active', true),
      ])

      if (prodRes.error)  throw prodRes.error
      if (inqRes.error)   throw inqRes.error
      if (catRes.error)   throw catRes.error

      const products    = prodRes.data ?? []
      const lowStock    = products.filter(p => p.stock <= LOW_STOCK_THRESHOLD && p.stock > 0)

      setStats({
        totalProducts:    products.length,
        lowStockProducts: lowStock,
        unreadInquiries:  inqRes.count ?? 0,
        totalCategories:  catRes.count ?? 0,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat statistik')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])
  return { stats, loading, error, refetch: fetch }
}

// ── Admin products ───────────────────────────────────────────

export function useAdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { data, error: err } = await supabase
        .from('products')
        .select('*, categories(id, name, slug)')
        .order('created_at', { ascending: false })
      if (err) throw err
      setProducts(data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat produk')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])
  return { products, loading, error, refetch: fetch }
}

export function useAdminProduct(id: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    if (!id) { setLoading(false); return }
    const fetch = async () => {
      try {
        setLoading(true)
        const { data, error: err } = await supabase
          .from('products')
          .select('*, categories(id, name, slug)')
          .eq('id', id)
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
  }, [id])

  return { product, loading, error }
}

// ── Admin categories ─────────────────────────────────────────

export function useAdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState<string | null>(null)

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { data, error: err } = await supabase
        .from('categories')
        .select('*')
        .order('name')
      if (err) throw err
      setCategories(data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat kategori')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])
  return { categories, loading, error, refetch: fetch }
}

// ── Admin inquiries ──────────────────────────────────────────

export function useAdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<string | null>(null)

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { data, error: err } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false })
      if (err) throw err
      setInquiries(data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat inquiry')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])
  return { inquiries, loading, error, refetch: fetch }
}

// ── Admin store info ─────────────────────────────────────────

export function useAdminStoreInfo() {
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<string | null>(null)

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
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
  }, [])

  useEffect(() => { fetch() }, [fetch])
  return { storeInfo, loading, error, refetch: fetch }
}

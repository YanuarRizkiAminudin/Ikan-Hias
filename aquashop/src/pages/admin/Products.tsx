import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAdminProducts } from '@/hooks/useAdmin'
import { formatRupiah } from '@/lib/utils'
import { PRODUCT_STATUS_LABEL, LOW_STOCK_THRESHOLD } from '@/lib/constants'
import AdminLayout from '@/components/layout/AdminLayout'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Spinner from '@/components/ui/Spinner'
import Toast from '@/components/ui/Toast'
import { useToast } from '@/hooks/useToast'
import type { Product } from '@/lib/types'

export default function Products() {
  const { products, loading, error, refetch } = useAdminProducts()
  const { toasts, removeToast, success, error: toastError } = useToast()
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [deleting, setDeleting]         = useState(false)
  const [search, setSearch]             = useState('')

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      setDeleting(true)
      const { error: err } = await supabase
        .from('products')
        .delete()
        .eq('id', deleteTarget.id)
      if (err) throw err
      success(`"${deleteTarget.name}" berhasil dihapus`)
      setDeleteTarget(null)
      await refetch()
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Gagal menghapus produk')
    } finally {
      setDeleting(false)
    }
  }

  const statusBadge = (status: string) => {
    const map: Record<string, 'success' | 'gray' | 'danger'> = {
      active:       'success',
      inactive:     'gray',
      out_of_stock: 'danger',
    }
    return <Badge variant={map[status] ?? 'gray'}>{PRODUCT_STATUS_LABEL[status] ?? status}</Badge>
  }

  return (
    <AdminLayout title="Produk">
      <Toast toasts={toasts} onRemove={removeToast} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <input
          type="search"
          placeholder="Cari produk..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-base max-w-xs"
          aria-label="Cari produk"
        />
        <Link to="/admin/products/create">
          <Button variant="secondary">+ Tambah Produk</Button>
        </Link>
      </div>

      {loading && <div className="flex justify-center py-16"><Spinner size="lg" /></div>}
      {error   && <div className="bg-red-50 text-red-600 rounded-xl p-4 text-sm" role="alert">{error}</div>}

      {!loading && !error && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Daftar produk">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-5 py-3 font-semibold text-gray-500">Produk</th>
                  <th className="px-5 py-3 font-semibold text-gray-500 hidden md:table-cell">Kategori</th>
                  <th className="px-5 py-3 font-semibold text-gray-500">Harga</th>
                  <th className="px-5 py-3 font-semibold text-gray-500">Stok</th>
                  <th className="px-5 py-3 font-semibold text-gray-500">Status</th>
                  <th className="px-5 py-3 font-semibold text-gray-500">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-gray-400">
                      Tidak ada produk ditemukan
                    </td>
                  </tr>
                ) : (
                  filtered.map(p => {
                    const isLow = p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD
                    return (
                      <tr key={p.id} className="hover:bg-gray-50/50">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            {p.image_url ? (
                              <img
                                src={p.image_url}
                                alt={p.name}
                                className="w-10 h-10 rounded-lg object-cover bg-bg-light flex-shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-bg-light flex items-center justify-center text-xl flex-shrink-0" aria-hidden="true">
                                🐟
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-text-dark line-clamp-1">{p.name}</p>
                              {p.size && p.size !== '-' && (
                                <p className="text-xs text-gray-400">{p.size}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-gray-500 hidden md:table-cell">
                          {p.categories?.name ?? '-'}
                        </td>
                        <td className="px-5 py-3 font-semibold text-text-dark">
                          {formatRupiah(p.price)}
                        </td>
                        <td className="px-5 py-3">
                          {isLow ? (
                            <Badge variant="warning">{p.stock}</Badge>
                          ) : (
                            <span className="text-gray-700">{p.stock}</span>
                          )}
                        </td>
                        <td className="px-5 py-3">{statusBadge(p.status)}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <Link
                              to={`/admin/products/${p.id}/edit`}
                              className="text-primary hover:underline font-medium"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => setDeleteTarget(p)}
                              className="text-red-500 hover:underline font-medium"
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-gray-50 text-xs text-gray-400">
            {filtered.length} dari {products.length} produk
          </div>
        </div>
      )}

      {/* Confirm delete modal */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Hapus Produk"
      >
        <p className="text-gray-600 text-sm mb-6">
          Yakin ingin menghapus <strong className="text-text-dark">"{deleteTarget?.name}"</strong>?
          Tindakan ini tidak bisa dibatalkan.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
            Batal
          </Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete}>
            Hapus
          </Button>
        </div>
      </Modal>
    </AdminLayout>
  )
}

import { useState, type FormEvent, type ChangeEvent } from 'react'
import { supabase } from '@/lib/supabase'
import { useAdminCategories } from '@/hooks/useAdmin'
import { slugify } from '@/lib/utils'
import AdminLayout from '@/components/layout/AdminLayout'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import Badge from '@/components/ui/Badge'
import Spinner from '@/components/ui/Spinner'
import Toast from '@/components/ui/Toast'
import { useToast } from '@/hooks/useToast'
import type { Category } from '@/lib/types'

interface CatForm {
  name: string; slug: string; description: string; is_active: boolean
}
const EMPTY: CatForm = { name: '', slug: '', description: '', is_active: true }

export default function Categories() {
  const { categories, loading, error, refetch } = useAdminCategories()
  const { toasts, removeToast, success, error: toastError } = useToast()

  const [modalOpen, setModalOpen]   = useState(false)
  const [editTarget, setEditTarget] = useState<Category | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  const [form, setForm]             = useState<CatForm>(EMPTY)
  const [saving, setSaving]         = useState(false)
  const [deleting, setDeleting]     = useState(false)
  const [formError, setFormError]   = useState<string | null>(null)

  const openCreate = () => {
    setEditTarget(null)
    setForm(EMPTY)
    setFormError(null)
    setModalOpen(true)
  }

  const openEdit = (cat: Category) => {
    setEditTarget(cat)
    setForm({
      name:        cat.name,
      slug:        cat.slug,
      description: cat.description ?? '',
      is_active:   cat.is_active,
    })
    setFormError(null)
    setModalOpen(true)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (name === 'name' && !editTarget) {
      setForm(prev => ({ ...prev, slug: slugify(value) }))
    }
  }

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setFormError('Nama kategori wajib diisi'); return }
    if (!form.slug.trim()) { setFormError('Slug wajib diisi'); return }

    try {
      setSaving(true)
      setFormError(null)
      const payload = {
        name:        form.name.trim(),
        slug:        form.slug.trim(),
        description: form.description.trim() || null,
        is_active:   form.is_active,
      }

      if (editTarget) {
        const { error: err } = await supabase.from('categories').update(payload).eq('id', editTarget.id)
        if (err) throw err
        success('Kategori berhasil diperbarui')
      } else {
        const { error: err } = await supabase.from('categories').insert(payload)
        if (err) throw err
        success('Kategori berhasil ditambahkan')
      }

      setModalOpen(false)
      await refetch()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Gagal menyimpan kategori')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      setDeleting(true)
      const { error: err } = await supabase.from('categories').delete().eq('id', deleteTarget.id)
      if (err) throw err
      success(`"${deleteTarget.name}" berhasil dihapus`)
      setDeleteTarget(null)
      await refetch()
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Gagal menghapus kategori')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AdminLayout title="Kategori">
      <Toast toasts={toasts} onRemove={removeToast} />

      <div className="flex justify-end mb-6">
        <Button variant="secondary" onClick={openCreate}>+ Tambah Kategori</Button>
      </div>

      {loading && <div className="flex justify-center py-16"><Spinner size="lg" /></div>}
      {error   && <div className="bg-red-50 text-red-600 rounded-xl p-4 text-sm" role="alert">{error}</div>}

      {!loading && !error && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm" aria-label="Daftar kategori">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-5 py-3 font-semibold text-gray-500">Nama</th>
                <th className="px-5 py-3 font-semibold text-gray-500 hidden sm:table-cell">Slug</th>
                <th className="px-5 py-3 font-semibold text-gray-500">Status</th>
                <th className="px-5 py-3 font-semibold text-gray-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-gray-400">Belum ada kategori</td>
                </tr>
              ) : (
                categories.map(cat => (
                  <tr key={cat.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3 font-semibold text-text-dark">{cat.name}</td>
                    <td className="px-5 py-3 text-gray-400 font-mono text-xs hidden sm:table-cell">{cat.slug}</td>
                    <td className="px-5 py-3">
                      <Badge variant={cat.is_active ? 'success' : 'gray'}>
                        {cat.is_active ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-3">
                        <button onClick={() => openEdit(cat)} className="text-primary hover:underline font-medium">
                          Edit
                        </button>
                        <button onClick={() => setDeleteTarget(cat)} className="text-red-500 hover:underline font-medium">
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Form modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? 'Edit Kategori' : 'Tambah Kategori'}
      >
        <form onSubmit={handleSave} noValidate className="space-y-4">
          <Input
            label="Nama Kategori"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ikan Laut"
            required
          />
          <Input
            label="Slug"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            placeholder="ikan-laut"
            required
            hint="Huruf kecil, angka, tanda hubung"
          />
          <div>
            <label htmlFor="cat-desc" className="block text-sm font-semibold text-text-dark mb-1.5">
              Deskripsi
            </label>
            <textarea
              id="cat-desc"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={2}
              placeholder="Deskripsi singkat..."
              className="input-base resize-none"
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              className="w-4 h-4 rounded accent-primary"
            />
            <span className="text-sm font-semibold text-text-dark">Aktif</span>
          </label>
          {formError && <p className="text-sm text-red-500" role="alert">{formError}</p>}
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button type="submit" variant="secondary" loading={saving}>Simpan</Button>
          </div>
        </form>
      </Modal>

      {/* Confirm delete */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Hapus Kategori">
        <p className="text-gray-600 text-sm mb-6">
          Yakin hapus <strong>"{deleteTarget?.name}"</strong>?
          Produk yang terhubung juga akan terhapus.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Batal</Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete}>Hapus</Button>
        </div>
      </Modal>
    </AdminLayout>
  )
}

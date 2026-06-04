import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAdminProduct } from '@/hooks/useAdmin'
import { useAdminCategories } from '@/hooks/useAdmin'
import { slugify } from '@/lib/utils'
import { PRODUCT_STATUSES, PRODUCT_STATUS_LABEL } from '@/lib/constants'
import AdminLayout from '@/components/layout/AdminLayout'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Toast from '@/components/ui/Toast'
import Spinner from '@/components/ui/Spinner'
import { useToast } from '@/hooks/useToast'

interface ProductFormData {
  name:        string
  slug:        string
  category_id: string
  description: string
  price:       string
  stock:       string
  size:        string
  status:      string
  is_featured: boolean
}

const EMPTY_FORM: ProductFormData = {
  name: '', slug: '', category_id: '', description: '',
  price: '', stock: '', size: '', status: 'active', is_featured: false,
}

interface FormErrors {
  name?:        string
  slug?:        string
  category_id?: string
  price?:       string
  stock?:       string
}

function validate(form: ProductFormData): FormErrors {
  const e: FormErrors = {}
  if (!form.name.trim())        e.name        = 'Nama produk wajib diisi'
  if (!form.slug.trim())        e.slug        = 'Slug wajib diisi'
  if (!form.category_id)        e.category_id = 'Kategori wajib dipilih'
  if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0)
                                e.price       = 'Harga harus berupa angka positif'
  if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0)
                                e.stock       = 'Stok harus berupa angka ≥ 0'
  return e
}

export default function ProductForm() {
  const { id }          = useParams<{ id: string }>()
  const isEdit          = !!id
  const navigate        = useNavigate()
  const { toasts, removeToast, success, error: toastError } = useToast()

  const { product, loading: loadingProduct } = useAdminProduct(id)
  const { categories }                        = useAdminCategories()

  const [form, setForm]         = useState<ProductFormData>(EMPTY_FORM)
  const [errors, setErrors]     = useState<FormErrors>({})
  const [saving, setSaving]     = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [uploadingVideo, setUploadingVideo] = useState(false)

  // Pre-fill when editing
  useEffect(() => {
    if (isEdit && product) {
      setForm({
        name:        product.name,
        slug:        product.slug,
        category_id: product.category_id ?? '',
        description: product.description ?? '',
        price:       String(product.price),
        stock:       String(product.stock),
        size:        product.size ?? '',
        status:      product.status,
        is_featured: product.is_featured,
      })
      if (product.image_url) setImagePreview(product.image_url)
      if (product.video_url) setVideoPreview(product.video_url)
    }
  }, [isEdit, product])

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (name === 'name' && !isEdit) {
      setForm(prev => ({ ...prev, slug: slugify(value) }))
    }
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toastError('Ukuran file maksimal 5 MB')
      return
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 50 * 1024 * 1024) {
      toastError('Ukuran video maksimal 50 MB')
      return
    }
    setVideoFile(file)
    setVideoPreview(URL.createObjectURL(file))
  }

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null
    try {
      setUploadingImage(true)
      const ext      = imageFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, imageFile, { upsert: false })
      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)
      return data.publicUrl
    } catch (err) {
      throw err
    } finally {
      setUploadingImage(false)
    }
  }

  const uploadVideo = async (): Promise<string | null> => {
    if (!videoFile) return null
    try {
      setUploadingVideo(true)
      const ext      = videoFile.name.split('.').pop()
      const fileName = `videos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, videoFile, { upsert: false, contentType: videoFile.type })
      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)
      return data.publicUrl
    } catch (err) {
      throw err
    } finally {
      setUploadingVideo(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      setSaving(true)

      let imageUrl: string | null | undefined = undefined
      if (imageFile) {
        imageUrl = await uploadImage()
      }

      let videoUrl: string | null | undefined = undefined
      if (videoFile) {
        videoUrl = await uploadVideo()
      }

      const payload = {
        name:        form.name.trim(),
        slug:        form.slug.trim(),
        category_id: form.category_id,
        description: form.description.trim() || null,
        price:       Number(form.price),
        stock:       Number(form.stock),
        size:        form.size.trim() || null,
        status:      form.status,
        is_featured: form.is_featured,
        ...(imageUrl !== undefined ? { image_url: imageUrl } : {}),
        ...(videoUrl !== undefined ? { video_url: videoUrl } : {}),
      }

      if (isEdit) {
        const { error: err } = await supabase
          .from('products')
          .update(payload)
          .eq('id', id)
        if (err) throw err
        success('Produk berhasil diperbarui')
      } else {
        const { error: err } = await supabase
          .from('products')
          .insert(payload)
        if (err) throw err
        success('Produk berhasil ditambahkan')
      }

      navigate('/admin/products')
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Gagal menyimpan produk')
    } finally {
      setSaving(false)
    }
  }

  if (isEdit && loadingProduct) {
    return (
      <AdminLayout title="Edit Produk">
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title={isEdit ? 'Edit Produk' : 'Tambah Produk'}>
      <Toast toasts={toasts} onRemove={removeToast} />

      <form onSubmit={handleSubmit} noValidate className="max-w-2xl space-y-6">
        {/* Nama & Slug */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
          <h2 className="font-extrabold text-text-dark">Informasi Dasar</h2>
          <Input
            label="Nama Produk"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ikan Clownfish Nemo"
            required
            error={errors.name}
          />
          <Input
            label="Slug (URL)"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            placeholder="ikan-clownfish-nemo"
            required
            error={errors.slug}
            hint="Otomatis dari nama. Gunakan huruf kecil, angka, dan tanda hubung."
          />
          {/* Kategori */}
          <div>
            <label htmlFor="category_id" className="block text-sm font-semibold text-text-dark mb-1.5">
              Kategori <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <select
              id="category_id"
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              required
              className={`input-base ${errors.category_id ? 'border-red-400' : ''}`}
            >
              <option value="">-- Pilih Kategori --</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.category_id && (
              <p className="mt-1 text-xs text-red-500" role="alert">{errors.category_id}</p>
            )}
          </div>
          {/* Deskripsi */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-text-dark mb-1.5">
              Deskripsi
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Deskripsi produk..."
              className="input-base resize-none"
            />
          </div>
        </div>

        {/* Harga, stok, ukuran */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
          <h2 className="font-extrabold text-text-dark">Harga & Stok</h2>
          <div className="grid grid-cols-2 gap-5">
            <Input
              label="Harga (Rp)"
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="85000"
              required
              error={errors.price}
              min="0"
            />
            <Input
              label="Stok"
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              placeholder="10"
              required
              error={errors.stock}
              min="0"
            />
          </div>
          <Input
            label="Ukuran"
            name="size"
            value={form.size}
            onChange={handleChange}
            placeholder="3-4 cm"
            hint="Opsional"
          />
        </div>

        {/* Status & featured */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
          <h2 className="font-extrabold text-text-dark">Status</h2>
          <div>
            <label htmlFor="status" className="block text-sm font-semibold text-text-dark mb-1.5">
              Status Produk
            </label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="input-base"
            >
              {PRODUCT_STATUSES.map(s => (
                <option key={s} value={s}>{PRODUCT_STATUS_LABEL[s]}</option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_featured"
              checked={form.is_featured}
              onChange={handleChange}
              className="w-4 h-4 rounded accent-primary"
            />
            <span className="text-sm font-semibold text-text-dark">
              Tampilkan sebagai Produk Unggulan di Beranda
            </span>
          </label>
        </div>

        {/* Foto */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="font-extrabold text-text-dark">Foto Produk</h2>
          {imagePreview && (
            <div className="relative w-40 h-40 rounded-xl overflow-hidden bg-bg-light">
              <img
                src={imagePreview}
                alt="Preview foto produk"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => { setImageFile(null); setImagePreview(null) }}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                aria-label="Hapus foto"
              >
                ×
              </button>
            </div>
          )}
          <label
            className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${
              imagePreview ? 'border-primary bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-blue-50 hover:border-primary'
            }`}
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault()
              const file = e.dataTransfer.files?.[0]
              if (file) {
                if (!file.type.startsWith('image/')) { toastError('File harus berupa gambar'); return }
                if (file.size > 5 * 1024 * 1024) { toastError('Ukuran file maksimal 5 MB'); return }
                setImageFile(file)
                setImagePreview(URL.createObjectURL(file))
              }
            }}
          >
            <span className="text-3xl mb-2">🖼️</span>
            <span className="text-sm font-semibold text-gray-600">
              {imagePreview ? 'Ganti foto — klik atau drag & drop' : 'Klik atau drag & drop foto ke sini'}
            </span>
            <span className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — maks 5 MB</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Video */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="font-extrabold text-text-dark">Video Produk</h2>
          <p className="text-xs text-gray-400">Opsional — tampil di halaman detail produk.</p>
          {videoPreview && (
            <div className="relative rounded-xl overflow-hidden bg-black">
              <video
                src={videoPreview}
                controls
                className="w-full max-h-64 object-contain"
                aria-label="Preview video produk"
              />
              <button
                type="button"
                onClick={() => { setVideoFile(null); setVideoPreview(null) }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-red-600"
                aria-label="Hapus video"
              >
                ×
              </button>
            </div>
          )}
          <label
            className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${
              videoPreview ? 'border-primary bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-blue-50 hover:border-primary'
            }`}
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault()
              const file = e.dataTransfer.files?.[0]
              if (file) {
                if (!file.type.startsWith('video/')) { toastError('File harus berupa video'); return }
                if (file.size > 50 * 1024 * 1024) { toastError('Ukuran video maksimal 50 MB'); return }
                setVideoFile(file)
                setVideoPreview(URL.createObjectURL(file))
              }
            }}
          >
            <span className="text-3xl mb-2">🎬</span>
            <span className="text-sm font-semibold text-gray-600">
              {videoPreview ? 'Ganti video — klik atau drag & drop' : 'Klik atau drag & drop video ke sini'}
            </span>
            <span className="text-xs text-gray-400 mt-1">MP4, WebM, MOV — maks 50 MB</span>
            <input
              type="file"
              accept="video/mp4,video/webm,video/ogg,video/quicktime"
              onChange={handleVideoChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            type="submit"
            variant="secondary"
            loading={saving || uploadingImage || uploadingVideo}
          >
            {isEdit ? 'Simpan Perubahan' : 'Tambah Produk'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/admin/products')}
          >
            Batal
          </Button>
        </div>
      </form>
    </AdminLayout>
  )
}

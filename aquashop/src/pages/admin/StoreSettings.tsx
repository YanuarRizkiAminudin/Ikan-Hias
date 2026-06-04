import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react'
import { supabase } from '@/lib/supabase'
import { useAdminStoreInfo } from '@/hooks/useAdmin'
import AdminLayout from '@/components/layout/AdminLayout'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Toast from '@/components/ui/Toast'
import Spinner from '@/components/ui/Spinner'
import { useToast } from '@/hooks/useToast'

interface StoreForm {
  store_name:    string
  tagline:       string
  address:       string
  phone_wa:      string
  email:         string
  maps_embed_url: string
  instagram:     string
  facebook:      string
  open_hours:    string
  about_text:    string
}

const EMPTY: StoreForm = {
  store_name: '', tagline: '', address: '', phone_wa: '',
  email: '', maps_embed_url: '', instagram: '', facebook: '',
  open_hours: '', about_text: '',
}

export default function StoreSettings() {
  const { storeInfo, loading } = useAdminStoreInfo()
  const { toasts, removeToast, success, error: toastError } = useToast()
  const [form, setForm]   = useState<StoreForm>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (storeInfo) {
      setForm({
        store_name:    storeInfo.store_name ?? '',
        tagline:       storeInfo.tagline    ?? '',
        address:       storeInfo.address    ?? '',
        phone_wa:      storeInfo.phone_wa   ?? '',
        email:         storeInfo.email      ?? '',
        maps_embed_url: storeInfo.maps_embed_url ?? '',
        instagram:     storeInfo.instagram  ?? '',
        facebook:      storeInfo.facebook   ?? '',
        open_hours:    storeInfo.open_hours  ?? '',
        about_text:    storeInfo.about_text  ?? '',
      })
    }
  }, [storeInfo])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.store_name.trim()) {
      setFormError('Nama toko wajib diisi')
      return
    }

    try {
      setSaving(true)
      setFormError(null)
      const { error: err } = await supabase
        .from('store_info')
        .update({
          store_name:    form.store_name.trim(),
          tagline:       form.tagline.trim()    || null,
          address:       form.address.trim()    || null,
          phone_wa:      form.phone_wa.trim()   || null,
          email:         form.email.trim()      || null,
          maps_embed_url: form.maps_embed_url.trim() || null,
          instagram:     form.instagram.trim()  || null,
          facebook:      form.facebook.trim()   || null,
          open_hours:    form.open_hours.trim() || null,
          about_text:    form.about_text.trim() || null,
        })
        .eq('id', 1)
      if (err) throw err
      success('Info toko berhasil disimpan')
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Gagal menyimpan info toko')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Info Toko">
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Info Toko">
      <Toast toasts={toasts} onRemove={removeToast} />

      <form onSubmit={handleSubmit} noValidate className="max-w-2xl space-y-6">

        {/* Informasi dasar */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
          <h2 className="font-extrabold text-text-dark">Informasi Dasar</h2>
          <Input
            label="Nama Toko"
            name="store_name"
            value={form.store_name}
            onChange={handleChange}
            placeholder="AquaShop"
            required
          />
          <Input
            label="Tagline"
            name="tagline"
            value={form.tagline}
            onChange={handleChange}
            placeholder="Surga Ikan Hias Terlengkap"
          />
          <div>
            <label htmlFor="about_text" className="block text-sm font-semibold text-text-dark mb-1.5">
              Tentang Toko
            </label>
            <textarea
              id="about_text"
              name="about_text"
              value={form.about_text}
              onChange={handleChange}
              rows={4}
              placeholder="Cerita singkat tentang toko..."
              className="input-base resize-none"
            />
          </div>
        </div>

        {/* Kontak */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
          <h2 className="font-extrabold text-text-dark">Kontak</h2>
          <Input
            label="Nomor WhatsApp"
            name="phone_wa"
            value={form.phone_wa}
            onChange={handleChange}
            placeholder="6281234567890"
            hint="Format internasional tanpa + (contoh: 6281234567890)"
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="info@aquashop.id"
          />
        </div>

        {/* Alamat & Maps */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
          <h2 className="font-extrabold text-text-dark">Lokasi</h2>
          <div>
            <label htmlFor="address" className="block text-sm font-semibold text-text-dark mb-1.5">
              Alamat
            </label>
            <textarea
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={2}
              placeholder="Jl. Raya Ikan Hias No. 88..."
              className="input-base resize-none"
            />
          </div>
          <Input
            label="Google Maps Embed URL"
            name="maps_embed_url"
            value={form.maps_embed_url}
            onChange={handleChange}
            placeholder="https://www.google.com/maps/embed?pb=..."
            hint="Dari Google Maps → Share → Embed a map → salin URL src="
          />
          <div>
            <label htmlFor="open_hours" className="block text-sm font-semibold text-text-dark mb-1.5">
              Jam Buka
            </label>
            <textarea
              id="open_hours"
              name="open_hours"
              value={form.open_hours}
              onChange={handleChange}
              rows={2}
              placeholder="Senin–Sabtu: 08.00–18.00&#10;Minggu: 09.00–15.00"
              className="input-base resize-none"
            />
          </div>
        </div>

        {/* Media sosial */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
          <h2 className="font-extrabold text-text-dark">Media Sosial</h2>
          <Input
            label="Instagram"
            name="instagram"
            value={form.instagram}
            onChange={handleChange}
            placeholder="aquashop.id"
            hint="Username saja, tanpa @"
          />
          <Input
            label="Facebook"
            name="facebook"
            value={form.facebook}
            onChange={handleChange}
            placeholder="AquaShopID"
            hint="Username atau nama halaman"
          />
        </div>

        {formError && (
          <p className="text-sm text-red-500 font-medium" role="alert">{formError}</p>
        )}

        <Button type="submit" variant="secondary" size="lg" loading={saving}>
          Simpan Perubahan
        </Button>
      </form>
    </AdminLayout>
  )
}

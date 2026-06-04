import { useState, useRef, type FormEvent, type ChangeEvent } from 'react'
import { supabase } from '@/lib/supabase'
import { APP_NAME } from '@/lib/constants'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import BottomNav from '@/components/layout/BottomNav'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Toast from '@/components/ui/Toast'
import { useToast } from '@/hooks/useToast'

interface FormState {
  company_name:      string
  contact_name:      string
  email:             string
  phone:             string
  country:           string
  fish_types:        string
  quantity_estimate: string
  message:           string
  website:           string  // honeypot — harus kosong
}

interface FormErrors {
  company_name?:  string
  contact_name?:  string
  email?:         string
  country?:       string
  fish_types?:    string
}

const INITIAL_FORM: FormState = {
  company_name:      '',
  contact_name:      '',
  email:             '',
  phone:             '',
  country:           '',
  fish_types:        '',
  quantity_estimate: '',
  message:           '',
  website:           '',
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {}
  if (!form.company_name.trim())  errors.company_name = 'Nama perusahaan wajib diisi'
  if (!form.contact_name.trim())  errors.contact_name = 'Nama kontak wajib diisi'
  if (!form.email.trim())         errors.email        = 'Email wajib diisi'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                  errors.email        = 'Format email tidak valid'
  if (!form.country.trim())       errors.country      = 'Negara wajib diisi'
  if (!form.fish_types.trim())    errors.fish_types   = 'Jenis ikan wajib diisi'
  return errors
}

const benefits = [
  { icon: '📋', title: 'Dokumen Resmi',        desc: 'Health certificate, CITES, dan dokumen ekspor lengkap.' },
  { icon: '✈️', title: 'Pengiriman Internasional', desc: 'Dikemas khusus untuk penerbangan panjang internasional.' },
  { icon: '🔬', title: 'Karantina Terstandar', desc: 'Semua ikan melalui proses karantina sebelum ekspor.' },
  { icon: '🤝', title: 'Kerja Sama Jangka Panjang', desc: 'Kami prioritaskan hubungan bisnis yang berkelanjutan.' },
  { icon: '📦', title: 'MOQ Fleksibel',        desc: 'Minimum order quantity yang dapat disesuaikan kebutuhan.' },
  { icon: '💱', title: 'Harga Kompetitif',     desc: 'Harga ekspor khusus yang kompetitif di pasar internasional.' },
]

const fishCategories = [
  'Ikan Laut (Marine Fish)',
  'Ikan Air Tawar (Freshwater Fish)',
  'Ikan Koi',
  'Ikan Cupang (Betta Fish)',
  'Ikan Discus',
  'Ikan Louhan (Flowerhorn)',
  'Ikan Guppy',
  'Campuran (Mixed)',
]

export default function Export() {
  const [form, setForm]       = useState<FormState>(INITIAL_FORM)
  const [errors, setErrors]   = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { toasts, removeToast, success, error: toastError } = useToast()
  const formRef = useRef<HTMLFormElement>(null)

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // ── ANTI-SPAM: honeypot check ──────────────────────────────
    // Field "website" disembunyikan via CSS. Jika terisi = bot → diam saja
    if (form.website.trim() !== '') return

    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      const firstErrorKey = Object.keys(validationErrors)[0]
      const el = formRef.current?.querySelector(`[name="${firstErrorKey}"]`)
      if (el) (el as HTMLElement).focus()
      return
    }

    try {
      setLoading(true)

      const { error: insertError } = await supabase.from('inquiries').insert({
        company_name:      form.company_name.trim(),
        contact_name:      form.contact_name.trim(),
        email:             form.email.trim().toLowerCase(),
        phone:             form.phone.trim() || null,
        country:           form.country.trim(),
        fish_types:        form.fish_types.trim(),
        quantity_estimate: form.quantity_estimate.trim() || null,
        message:           form.message.trim() || null,
      })

      if (insertError) throw insertError

      setSubmitted(true)
      success('Inquiry berhasil dikirim! Kami akan menghubungi Anda segera.')
      setForm(INITIAL_FORM)
      setErrors({})
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Gagal mengirim inquiry. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <Toast toasts={toasts} onRemove={removeToast} />

      <main className="min-h-screen pb-20 md:pb-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-dark to-primary py-16 text-white text-center px-4">
          <p className="text-white/70 font-semibold text-sm uppercase tracking-widest mb-3">
            🌏 Kerja Sama Internasional
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Ekspor Ikan Hias
          </h1>
          <p className="text-white/80 max-w-xl mx-auto text-lg">
            {APP_NAME} melayani ekspor ikan hias ke seluruh dunia. Isi form inquiry di bawah untuk memulai kerja sama.
          </p>
        </div>

        {/* Benefits */}
        <section className="bg-bg-light py-14 px-4" aria-labelledby="benefit-heading">
          <div className="max-w-5xl mx-auto">
            <h2 id="benefit-heading" className="text-2xl font-extrabold text-text-dark text-center mb-8">
              Mengapa Bermitra dengan Kami?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {benefits.map(b => (
                <div key={b.title} className="card p-5 flex gap-4 items-start">
                  <span className="text-3xl flex-shrink-0" aria-hidden="true">{b.icon}</span>
                  <div>
                    <h3 className="font-bold text-text-dark text-sm mb-1">{b.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form inquiry */}
        <section className="py-14 px-4" aria-labelledby="form-heading">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 id="form-heading" className="text-3xl font-extrabold text-text-dark mb-2">
                Form Inquiry Ekspor
              </h2>
              <p className="text-gray-500">
                Isi form berikut dan tim kami akan menghubungi Anda dalam 1×24 jam
              </p>
            </div>

            {submitted ? (
              <div className="card p-10 text-center" role="status" aria-live="polite">
                <div className="text-6xl mb-4" aria-hidden="true">✅</div>
                <h3 className="text-2xl font-extrabold text-text-dark mb-3">
                  Inquiry Terkirim!
                </h3>
                <p className="text-gray-500 mb-6 leading-relaxed">
                  Terima kasih atas minat Anda. Tim ekspor kami akan meninjau inquiry Anda dan
                  menghubungi dalam 1×24 jam melalui email atau telepon yang Anda berikan.
                </p>
                <Button
                  variant="secondary"
                  onClick={() => setSubmitted(false)}
                >
                  Kirim Inquiry Lain
                </Button>
              </div>
            ) : (
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                noValidate
                className="card p-8 space-y-5"
                aria-label="Form inquiry kerja sama ekspor"
              >
                {/* ── HONEYPOT — disembunyikan via CSS, bukan display:none ── */}
                <div
                  style={{
                    position:      'absolute',
                    opacity:       0,
                    pointerEvents: 'none',
                    height:        0,
                    overflow:      'hidden',
                  }}
                  aria-hidden="true"
                >
                  <label htmlFor="website">Website</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>
                {/* ─────────────────────────────────────────────────────────── */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label="Nama Perusahaan"
                    name="company_name"
                    value={form.company_name}
                    onChange={handleChange}
                    placeholder="PT. Fish Import Co."
                    required
                    error={errors.company_name}
                    autoComplete="organization"
                  />
                  <Input
                    label="Nama Kontak"
                    name="contact_name"
                    value={form.contact_name}
                    onChange={handleChange}
                    placeholder="John Smith"
                    required
                    error={errors.contact_name}
                    autoComplete="name"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@fishimport.com"
                    required
                    error={errors.email}
                    autoComplete="email"
                  />
                  <Input
                    label="Nomor Telepon / WhatsApp"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+1 234 567 8900"
                    autoComplete="tel"
                  />
                </div>

                <Input
                  label="Negara"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="Japan, Germany, USA, ..."
                  required
                  error={errors.country}
                  autoComplete="country-name"
                />

                {/* Jenis ikan */}
                <div className="w-full">
                  <label
                    htmlFor="fish_types"
                    className="block text-sm font-semibold text-text-dark mb-1.5"
                  >
                    Jenis Ikan yang Diminati
                    <span className="text-red-500 ml-1" aria-hidden="true">*</span>
                  </label>
                  <select
                    id="fish_types"
                    name="fish_types"
                    value={form.fish_types}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.fish_types}
                    aria-describedby={errors.fish_types ? 'fish_types-error' : undefined}
                    className={`input-base ${errors.fish_types ? 'border-red-400 focus:ring-red-400' : ''}`}
                  >
                    <option value="">-- Pilih kategori ikan --</option>
                    {fishCategories.map(fc => (
                      <option key={fc} value={fc}>{fc}</option>
                    ))}
                  </select>
                  {errors.fish_types && (
                    <p id="fish_types-error" className="mt-1 text-xs text-red-500" role="alert">
                      {errors.fish_types}
                    </p>
                  )}
                </div>

                <Input
                  label="Estimasi Kuantitas"
                  name="quantity_estimate"
                  value={form.quantity_estimate}
                  onChange={handleChange}
                  placeholder="mis. 500 ekor / bulan"
                  hint="Opsional — membantu kami menyiapkan penawaran yang tepat"
                />

                {/* Pesan */}
                <div className="w-full">
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-text-dark mb-1.5"
                  >
                    Pesan Tambahan
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Ceritakan kebutuhan Anda lebih detail..."
                    className="input-base resize-none"
                    aria-label="Pesan tambahan"
                  />
                </div>

                {/* Disclaimer */}
                <p className="text-xs text-gray-400 leading-relaxed">
                  Dengan mengirim form ini, Anda menyetujui bahwa data yang diberikan akan digunakan
                  untuk keperluan komunikasi bisnis. Kami tidak akan membagikan data Anda kepada pihak ketiga.
                </p>

                <Button
                  type="submit"
                  variant="secondary"
                  size="lg"
                  loading={loading}
                  className="w-full"
                >
                  Kirim Inquiry Ekspor
                </Button>
              </form>
            )}
          </div>
        </section>

        {/* FAQ singkat */}
        <section className="bg-bg-light py-14 px-4" aria-labelledby="faq-heading">
          <div className="max-w-3xl mx-auto">
            <h2 id="faq-heading" className="text-2xl font-extrabold text-text-dark text-center mb-8">
              FAQ Ekspor
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Negara mana saja yang bisa menerima pengiriman?',
                  a: 'Kami telah mengekspor ke lebih dari 20 negara termasuk Jepang, Jerman, Amerika Serikat, Australia, Singapura, dan negara-negara Eropa lainnya.',
                },
                {
                  q: 'Berapa minimum order untuk ekspor?',
                  a: 'MOQ bervariasi tergantung jenis ikan dan tujuan negara. Diskusikan kebutuhan Anda melalui form inquiry dan kami akan memberikan penawaran terbaik.',
                },
                {
                  q: 'Dokumen apa saja yang disediakan?',
                  a: 'Kami menyediakan health certificate, sertifikat asal, dokumen CITES (untuk spesies yang dilindungi), dan packing list lengkap.',
                },
                {
                  q: 'Berapa lama proses dari inquiry hingga pengiriman?',
                  a: 'Setelah inquiry disetujui dan pembayaran terkonfirmasi, proses karantina dan persiapan pengiriman membutuhkan 7–14 hari kerja.',
                },
              ].map(item => (
                <details
                  key={item.q}
                  className="card p-5 cursor-pointer group"
                >
                  <summary className="font-semibold text-text-dark text-sm flex justify-between items-center list-none">
                    {item.q}
                    <span className="text-primary text-lg group-open:rotate-45 transition-transform duration-200 ml-2 flex-shrink-0" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-gray-500 text-sm leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BottomNav />
    </>
  )
}

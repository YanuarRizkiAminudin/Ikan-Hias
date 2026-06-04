import { useStoreInfo } from '@/hooks/useProducts'
import { APP_NAME } from '@/lib/constants'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import BottomNav from '@/components/layout/BottomNav'

const keunggulan = [
  { icon: '🏆', title: 'Pengalaman 14+ Tahun', desc: 'Berpengalaman sejak 2010 melayani pecinta ikan hias.' },
  { icon: '🐟', title: 'Koleksi Lengkap',      desc: 'Lebih dari 100 jenis ikan hias dari berbagai penjuru dunia.' },
  { icon: '✅', title: 'Ikan Berkualitas',      desc: 'Setiap ikan dipilih dan dirawat dengan standar tinggi.' },
  { icon: '🌏', title: 'Ekspor Internasional',  desc: 'Melayani ekspor ke berbagai negara dengan dokumen resmi.' },
  { icon: '💬', title: 'Konsultasi Gratis',     desc: 'Tim ahli siap membantu memilih ikan yang tepat untuk Anda.' },
  { icon: '📦', title: 'Pengiriman Aman',       desc: 'Dikemas khusus untuk menjaga ikan tetap sehat selama perjalanan.' },
]

export default function About() {
  const { storeInfo } = useStoreInfo()

  return (
    <>
      <Navbar />

      <main className="min-h-screen pb-20 md:pb-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary py-16 text-white text-center px-4">
          <h1 className="text-4xl font-extrabold mb-3">Tentang Kami</h1>
          <p className="text-white/80 max-w-xl mx-auto">
            Kenali lebih jauh tentang {APP_NAME} dan komitmen kami terhadap ikan hias berkualitas
          </p>
        </div>

        {/* Sejarah */}
        <section className="max-w-4xl mx-auto px-4 py-16" aria-labelledby="sejarah-heading">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 id="sejarah-heading" className="text-3xl font-extrabold text-text-dark mb-4">
                Cerita Kami
              </h2>
              <div className="text-gray-600 leading-relaxed space-y-4">
                <p>
                  {storeInfo?.about_text ?? (
                    `${APP_NAME} adalah toko ikan hias terpercaya yang telah berdiri sejak 2010. 
                    Kami menyediakan berbagai jenis ikan hias air laut, air tawar, dan aksesori akuarium berkualitas.
                    Dengan pengalaman lebih dari 14 tahun, kami siap melayani pecinta ikan hias 
                    di seluruh Indonesia dan mancanegara.`
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="bg-bg-light rounded-2xl p-10 text-center">
                <div className="text-7xl mb-4" aria-hidden="true">🐠</div>
                <p className="text-5xl font-extrabold text-primary">14+</p>
                <p className="text-gray-500 font-medium">Tahun Pengalaman</p>
              </div>
            </div>
          </div>
        </section>

        {/* Keunggulan */}
        <section className="bg-bg-light py-16 px-4" aria-labelledby="keunggulan-heading">
          <div className="max-w-5xl mx-auto">
            <h2 id="keunggulan-heading" className="text-3xl font-extrabold text-text-dark text-center mb-2">
              Keunggulan Kami
            </h2>
            <p className="text-gray-500 text-center mb-10">Mengapa memilih {APP_NAME}?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {keunggulan.map(item => (
                <div key={item.title} className="card p-6">
                  <div className="text-4xl mb-3" aria-hidden="true">{item.icon}</div>
                  <h3 className="font-bold text-text-dark mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 px-4" aria-label="Statistik toko">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '14+', label: 'Tahun Berdiri' },
              { value: '100+', label: 'Jenis Ikan' },
              { value: '1000+', label: 'Pelanggan Puas' },
              { value: '20+', label: 'Negara Ekspor' },
            ].map(stat => (
              <div key={stat.label}>
                <p className="text-4xl font-extrabold text-primary mb-1">{stat.value}</p>
                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <BottomNav />
    </>
  )
}

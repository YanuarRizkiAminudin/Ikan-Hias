import { useStoreInfo } from '@/hooks/useProducts'
import { buildWaUrl } from '@/lib/utils'
import { APP_NAME } from '@/lib/constants'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import BottomNav from '@/components/layout/BottomNav'
import Spinner from '@/components/ui/Spinner'

export default function Contact() {
  const { storeInfo, loading } = useStoreInfo()

  const waUrl = storeInfo?.phone_wa
    ? buildWaUrl(storeInfo.phone_wa, `Halo ${APP_NAME}, saya ingin bertanya tentang ikan hias.`)
    : '#'

  return (
    <>
      <Navbar />

      <main className="min-h-screen pb-20 md:pb-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary py-16 text-white text-center px-4">
          <h1 className="text-4xl font-extrabold mb-3">Kontak & Lokasi</h1>
          <p className="text-white/80">Kami siap membantu Anda</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">

            {/* Info kontak */}
            <div className="space-y-6">
              <h2 className="text-2xl font-extrabold text-text-dark">Informasi Toko</h2>

              <dl className="space-y-5">
                {storeInfo?.address && (
                  <div className="flex gap-4">
                    <dt className="text-2xl mt-0.5" aria-hidden="true">📍</dt>
                    <dd>
                      <p className="font-semibold text-text-dark mb-0.5">Alamat</p>
                      <p className="text-gray-600 text-sm">{storeInfo.address}</p>
                    </dd>
                  </div>
                )}

                {storeInfo?.phone_wa && (
                  <div className="flex gap-4">
                    <dt className="text-2xl mt-0.5" aria-hidden="true">📱</dt>
                    <dd>
                      <p className="font-semibold text-text-dark mb-0.5">WhatsApp</p>
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 font-medium hover:underline text-sm"
                      >
                        +{storeInfo.phone_wa}
                      </a>
                    </dd>
                  </div>
                )}

                {storeInfo?.email && (
                  <div className="flex gap-4">
                    <dt className="text-2xl mt-0.5" aria-hidden="true">✉️</dt>
                    <dd>
                      <p className="font-semibold text-text-dark mb-0.5">Email</p>
                      <a
                        href={`mailto:${storeInfo.email}`}
                        className="text-primary hover:underline text-sm"
                      >
                        {storeInfo.email}
                      </a>
                    </dd>
                  </div>
                )}

                {storeInfo?.open_hours && (
                  <div className="flex gap-4">
                    <dt className="text-2xl mt-0.5" aria-hidden="true">🕐</dt>
                    <dd>
                      <p className="font-semibold text-text-dark mb-0.5">Jam Buka</p>
                      <p className="text-gray-600 text-sm whitespace-pre-line">{storeInfo.open_hours}</p>
                    </dd>
                  </div>
                )}

                {(storeInfo?.instagram || storeInfo?.facebook) && (
                  <div className="flex gap-4">
                    <dt className="text-2xl mt-0.5" aria-hidden="true">📲</dt>
                    <dd>
                      <p className="font-semibold text-text-dark mb-1">Media Sosial</p>
                      <div className="flex gap-3">
                        {storeInfo?.instagram && (
                          <a
                            href={`https://instagram.com/${storeInfo.instagram}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            @{storeInfo.instagram}
                          </a>
                        )}
                        {storeInfo?.facebook && (
                          <a
                            href={`https://facebook.com/${storeInfo.facebook}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            {storeInfo.facebook}
                          </a>
                        )}
                      </div>
                    </dd>
                  </div>
                )}
              </dl>

              {/* Tombol WA besar */}
              {storeInfo?.phone_wa && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-wa inline-flex w-full justify-center text-base mt-4"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Chat WhatsApp Sekarang
                </a>
              )}
            </div>

            {/* Google Maps embed */}
            <div>
              <h2 className="text-2xl font-extrabold text-text-dark mb-4">Lokasi Toko</h2>
              {storeInfo?.maps_embed_url ? (
                <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm aspect-video">
                  <iframe
                    src={storeInfo.maps_embed_url}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lokasi AquaShop di Google Maps"
                  />
                </div>
              ) : (
                <div className="rounded-2xl bg-bg-light aspect-video flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="text-4xl mb-2" aria-hidden="true">🗺️</div>
                    <p className="text-sm">Peta belum tersedia</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
      <BottomNav />
    </>
  )
}

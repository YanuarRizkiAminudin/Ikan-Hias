import { Link } from 'react-router-dom'
import AdminLayout from '@/components/layout/AdminLayout'
import Spinner from '@/components/ui/Spinner'
import Badge from '@/components/ui/Badge'
import { useDashboardStats } from '@/hooks/useAdmin'
import { formatRupiah } from '@/lib/utils'

export default function Dashboard() {
  const { stats, loading, error } = useDashboardStats()

  return (
    <AdminLayout title="Dashboard">
      {loading && (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 rounded-xl p-4 text-sm" role="alert">
          {error}
        </div>
      )}

      {stats && (
        <div className="space-y-8">
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              label="Total Produk Aktif"
              value={stats.totalProducts}
              icon="📦"
              color="bg-blue-50 text-primary"
              href="/admin/products"
            />
            <StatCard
              label="Stok Menipis (≤ 5)"
              value={stats.lowStockProducts.length}
              icon="⚠️"
              color="bg-yellow-50 text-yellow-700"
              href="/admin/products"
              highlight={stats.lowStockProducts.length > 0}
            />
            <StatCard
              label="Inquiry Belum Dibaca"
              value={stats.unreadInquiries}
              icon="📬"
              color="bg-orange-50 text-accent"
              href="/admin/inquiries"
              highlight={stats.unreadInquiries > 0}
            />
            <StatCard
              label="Total Kategori"
              value={stats.totalCategories}
              icon="🏷️"
              color="bg-green-50 text-green-700"
              href="/admin/categories"
            />
          </div>

          {/* Low stock table */}
          {stats.lowStockProducts.length > 0 && (
            <section aria-labelledby="low-stock-heading">
              <div className="flex items-center justify-between mb-4">
                <h2 id="low-stock-heading" className="text-lg font-extrabold text-text-dark">
                  Produk Stok Menipis
                </h2>
                <Link to="/admin/products" className="text-sm text-primary hover:underline font-medium">
                  Kelola Produk →
                </Link>
              </div>
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-sm" aria-label="Daftar produk stok menipis">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-5 py-3 font-semibold text-gray-500">Nama Produk</th>
                      <th className="px-5 py-3 font-semibold text-gray-500">Harga</th>
                      <th className="px-5 py-3 font-semibold text-gray-500">Stok</th>
                      <th className="px-5 py-3 font-semibold text-gray-500">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {stats.lowStockProducts.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50/50">
                        <td className="px-5 py-3 font-medium text-text-dark">{p.name}</td>
                        <td className="px-5 py-3 text-gray-500">{formatRupiah(p.price)}</td>
                        <td className="px-5 py-3">
                          <Badge variant={p.stock <= 2 ? 'danger' : 'warning'}>
                            {p.stock} tersisa
                          </Badge>
                        </td>
                        <td className="px-5 py-3">
                          <Link
                            to={`/admin/products/${p.id}/edit`}
                            className="text-primary hover:underline font-medium"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Quick links */}
          <section aria-labelledby="quick-links-heading">
            <h2 id="quick-links-heading" className="text-lg font-extrabold text-text-dark mb-4">
              Aksi Cepat
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { to: '/admin/products/create', label: 'Tambah Produk',   icon: '➕' },
                { to: '/admin/inquiries',       label: 'Lihat Inquiry',   icon: '📬' },
                { to: '/admin/categories',      label: 'Kelola Kategori', icon: '🏷️' },
                { to: '/admin/store',           label: 'Edit Info Toko',  icon: '⚙️' },
              ].map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="bg-white rounded-2xl shadow-sm p-5 flex flex-col items-center gap-2 text-center hover:shadow-md hover:border-primary border border-transparent transition-all duration-200"
                >
                  <span className="text-3xl" aria-hidden="true">{item.icon}</span>
                  <span className="text-sm font-semibold text-text-dark">{item.label}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}
    </AdminLayout>
  )
}

function StatCard({
  label, value, icon, color, href, highlight = false,
}: {
  label: string; value: number; icon: string; color: string; href: string; highlight?: boolean
}) {
  return (
    <Link
      to={href}
      className={`bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow ${
        highlight ? 'ring-2 ring-yellow-300' : ''
      }`}
      aria-label={`${label}: ${value}`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`} aria-hidden="true">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-extrabold text-text-dark">{value}</p>
        <p className="text-xs text-gray-500 font-medium leading-tight">{label}</p>
      </div>
    </Link>
  )
}

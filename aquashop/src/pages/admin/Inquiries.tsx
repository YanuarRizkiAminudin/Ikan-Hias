import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAdminInquiries } from '@/hooks/useAdmin'
import { INQUIRY_STATUS_LABEL, INQUIRY_STATUSES } from '@/lib/constants'
import AdminLayout from '@/components/layout/AdminLayout'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import Toast from '@/components/ui/Toast'
import { useToast } from '@/hooks/useToast'
import type { Inquiry } from '@/lib/types'

const statusBadgeVariant = (s: string): 'danger' | 'warning' | 'success' => {
  if (s === 'new')     return 'danger'
  if (s === 'read')    return 'warning'
  return 'success'
}

export default function Inquiries() {
  const { inquiries, loading, error, refetch } = useAdminInquiries()
  const { toasts, removeToast, success, error: toastError } = useToast()
  const [selected, setSelected]   = useState<Inquiry | null>(null)
  const [updating, setUpdating]   = useState(false)
  const [filterStatus, setFilter] = useState<string>('all')

  const filtered = filterStatus === 'all'
    ? inquiries
    : inquiries.filter(i => i.status === filterStatus)

  const openDetail = async (inquiry: Inquiry) => {
    setSelected(inquiry)
    // Auto-mark as read if new
    if (inquiry.status === 'new') {
      try {
        await supabase.from('inquiries').update({ status: 'read' }).eq('id', inquiry.id)
        await refetch()
      } catch (_err) {
        // non-blocking
      }
    }
  }

  const updateStatus = async (status: string) => {
    if (!selected) return
    try {
      setUpdating(true)
      const { error: err } = await supabase
        .from('inquiries')
        .update({ status })
        .eq('id', selected.id)
      if (err) throw err
      success('Status inquiry diperbarui')
      setSelected(prev => prev ? { ...prev, status: status as Inquiry['status'] } : null)
      await refetch()
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Gagal memperbarui status')
    } finally {
      setUpdating(false)
    }
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })

  return (
    <AdminLayout title="Inquiry Ekspor">
      <Toast toasts={toasts} onRemove={removeToast} />

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap" role="group" aria-label="Filter status">
        {['all', ...INQUIRY_STATUSES].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              filterStatus === s
                ? 'bg-primary text-white'
                : 'bg-white text-gray-500 border border-gray-200 hover:border-primary hover:text-primary'
            }`}
            aria-pressed={filterStatus === s}
          >
            {s === 'all' ? 'Semua' : INQUIRY_STATUS_LABEL[s]}
            {s !== 'all' && (
              <span className="ml-1.5 text-xs opacity-70">
                ({inquiries.filter(i => i.status === s).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {loading && <div className="flex justify-center py-16"><Spinner size="lg" /></div>}
      {error   && <div className="bg-red-50 text-red-600 rounded-xl p-4 text-sm" role="alert">{error}</div>}

      {!loading && !error && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm" aria-label="Daftar inquiry">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-5 py-3 font-semibold text-gray-500">Perusahaan</th>
                <th className="px-5 py-3 font-semibold text-gray-500 hidden md:table-cell">Negara</th>
                <th className="px-5 py-3 font-semibold text-gray-500 hidden lg:table-cell">Jenis Ikan</th>
                <th className="px-5 py-3 font-semibold text-gray-500">Status</th>
                <th className="px-5 py-3 font-semibold text-gray-500 hidden sm:table-cell">Tanggal</th>
                <th className="px-5 py-3 font-semibold text-gray-500">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-gray-400">
                    Tidak ada inquiry
                  </td>
                </tr>
              ) : (
                filtered.map(inq => (
                  <tr
                    key={inq.id}
                    className={`hover:bg-gray-50/50 ${inq.status === 'new' ? 'bg-orange-50/30' : ''}`}
                  >
                    <td className="px-5 py-3">
                      <p className="font-semibold text-text-dark">{inq.company_name}</p>
                      <p className="text-xs text-gray-400">{inq.contact_name}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-500 hidden md:table-cell">{inq.country}</td>
                    <td className="px-5 py-3 text-gray-500 hidden lg:table-cell line-clamp-1 max-w-[160px]">
                      {inq.fish_types}
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={statusBadgeVariant(inq.status)}>
                        {INQUIRY_STATUS_LABEL[inq.status] ?? inq.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs hidden sm:table-cell">
                      {formatDate(inq.created_at)}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => openDetail(inq)}
                        className="text-primary hover:underline font-medium"
                      >
                        Lihat
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="px-5 py-3 border-t border-gray-50 text-xs text-gray-400">
            {filtered.length} dari {inquiries.length} inquiry
          </div>
        </div>
      )}

      {/* Detail modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Detail Inquiry"
      >
        {selected && (
          <div className="space-y-4 text-sm">
            <dl className="space-y-3">
              {[
                { label: 'Perusahaan',  value: selected.company_name },
                { label: 'Kontak',      value: selected.contact_name },
                { label: 'Email',       value: selected.email },
                { label: 'Telepon',     value: selected.phone ?? '-' },
                { label: 'Negara',      value: selected.country },
                { label: 'Jenis Ikan',  value: selected.fish_types },
                { label: 'Est. Kuantitas', value: selected.quantity_estimate ?? '-' },
                { label: 'Tanggal',     value: formatDate(selected.created_at) },
              ].map(item => (
                <div key={item.label} className="grid grid-cols-3 gap-2">
                  <dt className="text-gray-500 font-medium">{item.label}</dt>
                  <dd className="col-span-2 font-semibold text-text-dark break-words">{item.value}</dd>
                </div>
              ))}
            </dl>

            {selected.message && (
              <div>
                <p className="text-gray-500 font-medium mb-1">Pesan</p>
                <p className="bg-gray-50 rounded-xl p-3 text-gray-700 leading-relaxed whitespace-pre-line">
                  {selected.message}
                </p>
              </div>
            )}

            <div>
              <p className="text-gray-500 font-medium mb-2">Ubah Status</p>
              <div className="flex gap-2 flex-wrap">
                {INQUIRY_STATUSES.map(s => (
                  <Button
                    key={s}
                    variant={selected.status === s ? 'secondary' : 'ghost'}
                    size="sm"
                    loading={updating}
                    onClick={() => updateStatus(s)}
                    disabled={selected.status === s}
                  >
                    {INQUIRY_STATUS_LABEL[s]}
                  </Button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <a
                href={`mailto:${selected.email}?subject=Re: Inquiry Ekspor Ikan Hias dari ${selected.company_name}`}
                className="btn-secondary inline-flex text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Balas via Email
              </a>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  )
}

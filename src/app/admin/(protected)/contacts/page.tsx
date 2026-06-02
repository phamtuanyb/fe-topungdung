'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { adminGetContacts, adminDeleteContact, type ContactSubmissionItem } from '@/lib/api/admin'
import AdminPageHeader from '@/components/admin/AdminPageHeader'

const PAGE_SIZE = 20

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
}

function DetailModal({ item, onClose }: { item: ContactSubmissionItem; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">Chi tiết liên hệ</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <dl className="divide-y divide-slate-100 px-6 py-4 text-sm">
          {[
            { label: 'Họ và tên', value: item.name },
            { label: 'Điện thoại', value: item.phone },
            { label: 'Email', value: item.email || '—' },
            { label: 'Doanh nghiệp', value: item.company || '—' },
            { label: 'Nhu cầu', value: item.need },
            { label: 'Mô tả', value: item.description || '—' },
            { label: 'Thời gian', value: formatDate(item.createdAt) },
          ].map(({ label, value }) => (
            <div key={label} className="flex gap-4 py-2.5">
              <dt className="w-32 shrink-0 font-medium text-slate-500">{label}</dt>
              <dd className="text-slate-900 whitespace-pre-wrap">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}

export default function ContactsPage() {
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<ContactSubmissionItem | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)

  const { data, mutate, isLoading } = useSWR(
    ['admin-contacts', page],
    () => adminGetContacts({ page, limit: PAGE_SIZE }),
  )

  const contacts = data?.data ?? []
  const total = data?.total ?? 0
  const totalPages = data?.totalPages ?? 1

  async function handleDelete(id: number) {
    if (!confirm('Xóa yêu cầu liên hệ này?')) return
    setDeleting(id)
    try {
      await adminDeleteContact(id)
      mutate()
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <AdminPageHeader
        title="Yêu cầu liên hệ"
        description={`${total} yêu cầu tư vấn đã nhận`}
      />

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 text-sm">Đang tải...</div>
        ) : contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2">
            <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            <p className="text-sm">Chưa có yêu cầu liên hệ nào</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Họ tên</th>
                <th className="px-4 py-3">Điện thoại</th>
                <th className="px-4 py-3 hidden sm:table-cell">Email</th>
                <th className="px-4 py-3 hidden md:table-cell">Nhu cầu</th>
                <th className="px-4 py-3 hidden lg:table-cell">Thời gian</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contacts.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{c.name}</div>
                    {c.company && <div className="text-xs text-slate-400">{c.company}</div>}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{c.phone}</td>
                  <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">{c.email || '—'}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="inline-block max-w-[200px] truncate rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                      {c.need}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs hidden lg:table-cell whitespace-nowrap">
                    {formatDate(c.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelected(c)}
                        className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        Xem
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        disabled={deleting === c.id}
                        className="rounded-lg border border-red-100 px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
            <span className="text-xs text-slate-500">Trang {page} / {totalPages}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                Trước
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                Tiếp
              </button>
            </div>
          </div>
        )}
      </div>

      {selected && <DetailModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

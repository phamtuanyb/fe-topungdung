'use client'

import { useCallback, useEffect, useState } from 'react'
import { adminDeleteVote, adminGetVotes, type AdminVoteRow } from '@/lib/api/admin'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminSectionCard from '@/components/admin/AdminSectionCard'
import Toast from '@/components/ui/Toast'

export default function VotesModerationPage() {
  const [rows, setRows] = useState<AdminVoteRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const load = useCallback((p: number) => {
    setLoading(true)
    adminGetVotes({ page: p, limit: 50 })
      .then((res) => {
        setRows(res.data ?? [])
        setTotal(res.meta?.total ?? 0)
        setTotalPages(res.meta?.totalPages ?? 1)
      })
      .catch((e: Error) => setError(e.message || 'Không tải được danh sách bình chọn'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load(page)
  }, [load, page])

  async function remove(id: number) {
    try {
      await adminDeleteVote(id)
      setRows((r) => r.filter((x) => x.id !== id))
      setTotal((t) => Math.max(0, t - 1))
      setToast({ message: 'Đã xoá phiếu', type: 'success' })
    } catch (e) {
      setToast({ message: (e as Error).message || 'Xoá thất bại', type: 'error' })
    }
  }

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Bình chọn của người dùng"
        description="Phiếu chấm sao từ khách truy cập. Xoá phiếu bất thường để giữ bảng xếp hạng sạch."
      />

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-xs text-rose-700">
          {error}
        </div>
      )}

      <AdminSectionCard
        title={`Tổng ${total} phiếu`}
        description="Mã khách là 8 ký tự đầu của chuỗi băm IP + trình duyệt — đủ để nhận ra phiếu cùng nguồn, không truy ngược được danh tính."
        padding={false}
      >
        {loading ? (
          <div className="p-6 text-sm text-slate-500">Đang tải…</div>
        ) : rows.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">Chưa có phiếu bình chọn nào.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50/60 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3 text-left font-semibold">Ứng dụng</th>
                <th className="px-5 py-3 text-left font-semibold">Số sao</th>
                <th className="px-5 py-3 text-left font-semibold">Mã khách</th>
                <th className="px-5 py-3 text-left font-semibold">Thời điểm</th>
                <th className="px-5 py-3 text-right font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((v) => (
                <tr key={v.id} className="border-t border-slate-100">
                  <td className="px-5 py-3">
                    <a
                      href={`/app/${v.postSlug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-slate-900 hover:text-indigo-600"
                    >
                      {v.postTitle}
                    </a>
                    <div className="text-xs text-slate-400">/app/{v.postSlug}</div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-amber-500">{'★'.repeat(v.rating)}</span>
                    <span className="text-slate-300">{'★'.repeat(5 - v.rating)}</span>
                    <span className="ml-2 text-xs font-bold text-slate-600">{v.rating}/5</span>
                  </td>
                  <td className="px-5 py-3">
                    <code className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                      {v.voterKey}
                    </code>
                  </td>
                  <td className="px-5 py-3 text-slate-500">
                    {new Date(v.createdAt).toLocaleString('vi-VN')}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => remove(v.id)}
                      className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                    >
                      Xoá
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdminSectionCard>

      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 disabled:opacity-40"
          >
            ← Trước
          </button>
          <span className="text-xs text-slate-500">
            Trang {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 disabled:opacity-40"
          >
            Sau →
          </button>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  adminDeleteSuggestion,
  adminGetSuggestions,
  adminUpdateSuggestion,
  type AppSuggestion,
} from '@/lib/api/admin'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminSectionCard from '@/components/admin/AdminSectionCard'
import Toast from '@/components/ui/Toast'

const STATUS: { id: string; label: string; cls: string }[] = [
  { id: 'new', label: 'Mới', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'reviewing', label: 'Đang xem', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'accepted', label: 'Đã nhận', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'rejected', label: 'Từ chối', cls: 'bg-slate-100 text-slate-600 border-slate-200' },
]

const labelOf = (id: string) => STATUS.find((s) => s.id === id)?.label ?? id
const clsOf = (id: string) =>
  STATUS.find((s) => s.id === id)?.cls ?? 'bg-slate-100 text-slate-600 border-slate-200'

export default function SuggestionsPage() {
  const [rows, setRows] = useState<AppSuggestion[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState<number | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const load = useCallback((p: number, status: string) => {
    setLoading(true)
    setError('')
    adminGetSuggestions({ page: p, limit: 20, status: status || undefined })
      .then((res) => {
        setRows(res.data ?? [])
        setTotal(res.meta?.total ?? 0)
        setTotalPages(res.meta?.totalPages ?? 1)
      })
      .catch((e: Error) => setError(e.message || 'Không tải được danh sách đề xuất'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load(page, filter)
  }, [load, page, filter])

  async function setStatus(id: number, status: string) {
    setBusy(id)
    try {
      await adminUpdateSuggestion(id, { status })
      setRows((r) =>
        r.map((x) => (x.id === id ? { ...x, status: status as AppSuggestion['status'] } : x)),
      )
      setToast({ message: `Đã chuyển sang "${labelOf(status)}"`, type: 'success' })
    } catch (e) {
      setToast({ message: (e as Error).message || 'Cập nhật thất bại', type: 'error' })
    } finally {
      setBusy(null)
    }
  }

  async function saveNote(id: number, adminNote: string) {
    try {
      await adminUpdateSuggestion(id, { adminNote })
      setToast({ message: 'Đã lưu ghi chú', type: 'success' })
    } catch (e) {
      setToast({ message: (e as Error).message || 'Lưu ghi chú thất bại', type: 'error' })
    }
  }

  async function remove(id: number) {
    setBusy(id)
    try {
      await adminDeleteSuggestion(id)
      setRows((r) => r.filter((x) => x.id !== id))
      setTotal((t) => Math.max(0, t - 1))
      setToast({ message: 'Đã xoá đề xuất', type: 'success' })
    } catch (e) {
      setToast({ message: (e as Error).message || 'Xoá thất bại', type: 'error' })
    } finally {
      setBusy(null)
      setConfirmDelete(null)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <AdminPageHeader
        title="Đề xuất ứng dụng"
        description="Ứng dụng do khách gửi từ nút Đề xuất ứng dụng trên website."
      />

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => {
            setFilter('')
            setPage(1)
          }}
          className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${
            filter === ''
              ? 'border-slate-800 bg-slate-800 text-white'
              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Tất cả
        </button>
        {STATUS.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              setFilter(s.id)
              setPage(1)
            }}
            className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${
              filter === s.id
                ? 'border-slate-800 bg-slate-800 text-white'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <AdminSectionCard title={filter ? `Đề xuất — ${labelOf(filter)}` : 'Tất cả đề xuất'}>
        {loading ? (
          <p className="py-8 text-center text-sm text-slate-500">Đang tải…</p>
        ) : error ? (
          <p className="py-8 text-center text-sm text-rose-600">{error}</p>
        ) : rows.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">
            Chưa có đề xuất nào{filter ? ` ở trạng thái ${labelOf(filter)}` : ''}.
          </p>
        ) : (
          <div className="space-y-3">
            {rows.map((s) => (
              <div key={s.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <b className="text-base text-slate-900">{s.appName}</b>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${clsOf(s.status)}`}
                      >
                        {labelOf(s.status)}
                      </span>
                      {s.categorySlug && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                          {s.categorySlug}
                        </span>
                      )}
                    </div>
                    {s.website && (
                      <a
                        href={s.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 block truncate text-sm text-blue-600 hover:underline"
                      >
                        {s.website}
                      </a>
                    )}
                    {s.reason && (
                      <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{s.reason}</p>
                    )}
                    <p className="mt-2 text-xs text-slate-400">
                      {s.submitterName || 'Ẩn danh'}
                      {s.submitterEmail ? ` · ${s.submitterEmail}` : ''} ·{' '}
                      {new Date(s.createdAt).toLocaleString('vi-VN')}
                    </p>
                  </div>

                  <div className="flex flex-none items-center gap-2">
                    <select
                      value={s.status}
                      disabled={busy === s.id}
                      onChange={(e) => setStatus(s.id, e.target.value)}
                      className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                    >
                      {STATUS.map((x) => (
                        <option value={x.id} key={x.id}>
                          {x.label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => setConfirmDelete(s.id)}
                      disabled={busy === s.id}
                      className="rounded-lg border border-rose-200 px-3 py-1.5 text-sm text-rose-600 hover:bg-rose-50"
                    >
                      Xoá
                    </button>
                  </div>
                </div>

                <input
                  defaultValue={s.adminNote ?? ''}
                  placeholder="Ghi chú nội bộ…"
                  className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
                  onBlur={(e) => {
                    if (e.target.value !== (s.adminNote ?? '')) saveNote(s.id, e.target.value)
                  }}
                />

                {confirmDelete === s.id && (
                  <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-3">
                    <p className="text-sm text-rose-800">
                      Xoá vĩnh viễn đề xuất <b>{s.appName}</b>? Không khôi phục được.
                    </p>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => remove(s.id)}
                        className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-700"
                      >
                        Xoá
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm"
                      >
                        Huỷ
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-500">
              Trang {page}/{totalPages} · {total} đề xuất
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40"
              >
                Trước
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </AdminSectionCard>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { getCategories, getTudApps } from '@/lib/api/public'
import { adminUpdatePost } from '@/lib/api/admin'
import type { Category, Post } from '@/types'
import type { TudAppMeta } from '@/types/tud'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminSectionCard from '@/components/admin/AdminSectionCard'
import Toast from '@/components/ui/Toast'
import { collectCategoryIds } from '@/lib/category-tree'

function meta(p: Post): TudAppMeta {
  const cfg = p.productPageConfig as unknown as { app?: TudAppMeta } | null | undefined
  return cfg?.app ?? {}
}

/** Đếm số trường review đã điền — để biết bài nào còn sơ sài. */
function completeness(m: TudAppMeta) {
  const checks = [
    !!m.tagline,
    !!m.website,
    !!m.developer,
    !!m.platforms?.length,
    !!m.pricingSummary,
    !!m.shots?.length,
    !!m.scoreBreakdown?.length,
    !!m.pros?.length,
    !!m.cons?.length,
    !!m.plans?.length,
    !!m.faq?.length,
    !!m.verdict,
  ]
  return { done: checks.filter(Boolean).length, total: checks.length }
}

export default function AppListPage() {
  const [apps, setApps] = useState<Post[]>([])
  const [cats, setCats] = useState<Category[]>([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<number | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  /** Chuyển ứng dụng sang danh mục khác ngay tại danh sách. */
  async function moveCategory(post: Post, categoryId: number) {
    setSaving(post.id)
    try {
      await adminUpdatePost(post.id, { categoryId } as never)
      const cat = cats.find((c) => c.id === categoryId)
      setApps((list) =>
        list.map((a) => (a.id === post.id ? ({ ...a, categoryId, category: cat ?? a.category } as Post) : a)),
      )
      // Làm mới cache các trang bị ảnh hưởng
      for (const path of ['/', '/ungdung', '/ranking']) {
        await fetch(`/api/revalidate?path=${path}`, { method: 'POST' }).catch(() => null)
      }
      setToast({ message: `Đã chuyển ${post.title} sang ${cat?.name ?? 'danh mục mới'}`, type: 'success' })
    } catch (e) {
      setToast({ message: (e as Error).message || 'Chuyển danh mục thất bại', type: 'error' })
    } finally {
      setSaving(null)
    }
  }

  useEffect(() => {
    Promise.all([getTudApps(200), getCategories()])
      .then(([a, c]) => {
        setApps(a.data ?? [])
        const root = c.data.find((x) => x.slug === 'ung-dung')
        setCats(c.data.filter((x) => x.id !== root?.id && collectCategoryIds(c.data, 'ung-dung').has(x.id)))
      })
      .catch(() => null)
      .finally(() => setLoading(false))
  }, [])

  const rows = useMemo(() => {
    const list = filter ? apps.filter((a) => a.category?.slug === filter) : apps
    return [...list].sort((a, b) => (meta(b).score ?? 0) - (meta(a).score ?? 0))
  }, [apps, filter])

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Ứng dụng"
        description="Soạn bài review chi tiết cho từng ứng dụng — ảnh sản phẩm, điểm thành phần, ưu nhược, bảng giá, FAQ."
      />

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('')}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
            filter === '' ? 'bg-indigo-600 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Tất cả ({apps.length})
        </button>
        {cats.map((c) => {
          const n = apps.filter((a) => a.category?.slug === c.slug).length
          return (
            <button
              key={c.id}
              onClick={() => setFilter(c.slug)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                filter === c.slug
                  ? 'bg-indigo-600 text-white'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {c.name} ({n})
            </button>
          )
        })}
      </div>

      <AdminSectionCard padding={false}>
        {loading ? (
          <div className="p-6 text-sm text-slate-500">Đang tải…</div>
        ) : rows.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">
            Chưa có ứng dụng nào. Tạo bài viết mới trong <b>/admin/posts</b> và chọn một danh mục
            con của <b>Ứng dụng</b>.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50/60 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3 text-left font-semibold">Ứng dụng</th>
                <th className="px-5 py-3 text-left font-semibold">Nhóm</th>
                <th className="px-5 py-3 text-left font-semibold">Điểm</th>
                <th className="px-5 py-3 text-left font-semibold">Độ đầy đủ</th>
                <th className="px-5 py-3 text-right font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const m = meta(p)
                const { done, total } = completeness(m)
                const pct = Math.round((done / total) * 100)
                return (
                  <tr key={p.id} className="border-t border-slate-100">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600 overflow-hidden">
                          {p.logoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.logoUrl} alt={p.title} className="h-full w-full object-contain p-1" />
                          ) : (
                            m.logoText || p.title.slice(0, 2).toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900">{p.title}</div>
                          <div className="text-xs text-slate-400">/app/{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <select
                        className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
                        value={p.category?.id ?? p.categoryId ?? ''}
                        disabled={saving === p.id}
                        onChange={(e) => moveCategory(p, Number(e.target.value))}
                      >
                        {cats.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3 font-bold text-indigo-600">{m.score ?? '—'}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 rounded-full bg-slate-200">
                          <div
                            className={`h-full rounded-full ${pct >= 70 ? 'bg-emerald-500' : pct >= 35 ? 'bg-amber-400' : 'bg-rose-400'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">
                          {done}/{total}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/admin/ung-dung/${p.id}`}
                        className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                      >
                        Sửa review
                      </Link>
                      <a
                        href={`/app/${p.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        Xem
                      </a>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </AdminSectionCard>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

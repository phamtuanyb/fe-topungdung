'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import {
  adminGetCategories,
  adminGetPosts,
  adminDeletePost,
  adminPublishPost,
  adminDraftPost,
  adminUpdatePost,
} from '@/lib/api/admin'
import { getErrorMessage } from '@/lib/error'
import type { Post } from '@/types'
import Toast from '@/components/ui/Toast'
import Modal from '@/components/ui/Modal'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'
import AdminPageHeader from '@/components/admin/AdminPageHeader'

const LIMIT = 20
const SERVICES_SLUG = 'services'

const statusConfig = {
  published: { label: 'Đã đăng', cls: 'badge badge-green' },
  draft: { label: 'Nháp', cls: 'badge badge-yellow' },
  archived: { label: 'Lưu trữ', cls: 'badge badge-gray' },
}

type BadgeFilter = '' | 'has' | 'none' | 'Hot' | 'Mới' | 'Phổ biến'

export default function AdminServicesPage() {
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [badgeFilter, setBadgeFilter] = useState<BadgeFilter>('')
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [orderEdits, setOrderEdits] = useState<Record<number, string>>({})

  const { data: catsData } = useSWR('admin-categories', adminGetCategories, {
    revalidateOnFocus: false,
  })
  const svcCatId = catsData?.data?.find((c) => c.slug === SERVICES_SLUG)?.id

  const { data, isLoading, mutate } = useSWR(
    svcCatId ? ['admin-services', search, statusFilter, svcCatId] : null,
    () =>
      adminGetPosts({
        page: 1,
        limit: LIMIT,
        search: search || undefined,
        status: statusFilter || undefined,
        categoryId: svcCatId,
      }),
    { keepPreviousData: true }
  )

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    setToast({ message, type })
  }

  async function handleDelete(id: number) {
    setActionLoading(id)
    try {
      await adminDeletePost(id)
      showToast('Đã xóa dịch vụ')
      mutate()
    } catch (err) {
      showToast(getErrorMessage(err) || 'Xóa thất bại', 'error')
    } finally {
      setActionLoading(null)
      setConfirmDelete(null)
    }
  }

  async function togglePublish(post: Post) {
    setActionLoading(post.id)
    try {
      if (post.status === 'published') {
        await adminDraftPost(post.id)
        showToast('Đã chuyển về nháp')
      } else {
        if (!post.thumbnail) {
          showToast('Cần ảnh đại diện trước khi đăng', 'error')
          return
        }
        await adminPublishPost(post.id)
        showToast('Đã đăng dịch vụ')
      }
      mutate()
    } catch (err) {
      showToast(getErrorMessage(err) || 'Thao tác thất bại', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  async function saveOrder(post: Post) {
    const raw = orderEdits[post.id]
    if (raw === undefined) return
    const v = parseInt(raw, 10)
    if (Number.isNaN(v) || v === post.displayOrder) {
      setOrderEdits((prev) => {
        const next = { ...prev }
        delete next[post.id]
        return next
      })
      return
    }
    try {
      await adminUpdatePost(post.id, { displayOrder: v })
      showToast(`Đã đổi thứ tự "${post.title}" → ${v}`)
      mutate()
    } catch (err) {
      showToast(getErrorMessage(err) || 'Lưu thứ tự thất bại', 'error')
    } finally {
      setOrderEdits((prev) => {
        const next = { ...prev }
        delete next[post.id]
        return next
      })
    }
  }

  // Sort + badge filter client-side
  const products = (data?.data ?? [])
    .slice()
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .filter((p) => {
      if (!badgeFilter) return true
      if (badgeFilter === 'has') return !!p.badge
      if (badgeFilter === 'none') return !p.badge
      return p.badge === badgeFilter
    })

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <Modal
        open={confirmDelete !== null}
        title="Xóa dịch vụ?"
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
        confirmText="Xóa"
        confirmVariant="danger"
        loading={actionLoading !== null}
      >
        Bạn có chắc muốn xóa dịch vụ này? Hành động không thể hoàn tác.
      </Modal>

      <AdminPageHeader
        title="Dịch vụ"
        description={`${products.length} dịch vụ hiển thị tại /dich-vu. Đổi "Thứ tự" để sắp xếp lại trên trang public. Có Badge mới được lên trang chủ.`}
        showBack={false}
      >
        <Link
          href="/admin/services/create"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
        >
          + Tạo mới
        </Link>
      </AdminPageHeader>

      {!svcCatId && catsData ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Chưa có danh mục <strong>Phần mềm AI Agent</strong>. Chạy <code className="bg-amber-100 px-1 rounded">npm run seed</code> ở BE để tạo.
        </div>
      ) : null}

      {/* Toolbar */}
      <div className="admin-card p-4 flex flex-wrap items-center gap-3">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setSearch(searchInput)
          }}
          className="flex-1 min-w-[220px]"
        >
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="🔍 Tìm tên dịch vụ..."
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </form>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="published">Đã đăng</option>
          <option value="draft">Nháp</option>
        </select>
        <select
          value={badgeFilter}
          onChange={(e) => setBadgeFilter(e.target.value as BadgeFilter)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">Tất cả badge</option>
          <option value="has">Có badge (lên trang chủ)</option>
          <option value="none">Không badge</option>
          <option value="Hot">Hot</option>
          <option value="Mới">Mới</option>
          <option value="Phổ biến">Phổ biến</option>
        </select>
      </div>

      {/* Table */}
      <div className="admin-card overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex justify-center"><LoadingSpinner /></div>
        ) : products.length === 0 ? (
          <EmptyState
            title="Chưa có dịch vụ nào"
            description='Bấm "Tạo mới", chọn danh mục "Dịch vụ" và điền nội dung.'
          />
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left w-14">Logo</th>
                <th className="px-4 py-3 text-left">Tên dịch vụ</th>
                <th className="px-4 py-3 text-left w-28">Tên ngắn</th>
                <th className="px-4 py-3 text-left w-28">Badge</th>
                <th className="px-4 py-3 text-left w-28">Trạng thái</th>
                <th className="px-4 py-3 text-left w-24">Thứ tự</th>
                <th className="px-4 py-3 text-right w-44">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((post) => {
                const st = statusConfig[post.status as keyof typeof statusConfig]
                const editingOrder = orderEdits[post.id] !== undefined
                return (
                  <tr key={post.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center">
                        {post.logoUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={post.logoUrl} alt={post.title} className="w-full h-full object-contain" />
                        ) : post.thumbnail ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/services/${post.id}/edit`} className="text-slate-900 font-semibold hover:text-indigo-600">
                        {post.title}
                      </Link>
                      <div className="text-xs text-slate-400">/{post.slug}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{post.shortName || <span className="text-slate-300">—</span>}</td>
                    <td className="px-4 py-3">
                      {post.badge ? (
                        <span className="inline-flex items-center rounded-full bg-orange-100 text-orange-700 px-2.5 py-0.5 text-xs font-bold">
                          {post.badge}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => togglePublish(post)}
                        disabled={actionLoading === post.id}
                        className={`${st?.cls || 'badge'} cursor-pointer disabled:opacity-50`}
                        title="Click để chuyển trạng thái"
                      >
                        {st?.label || post.status}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={editingOrder ? orderEdits[post.id] : (post.displayOrder ?? 0)}
                        onChange={(e) => setOrderEdits((prev) => ({ ...prev, [post.id]: e.target.value }))}
                        onBlur={() => saveOrder(post)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
                        }}
                        className="w-16 rounded-md border border-slate-200 px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/admin/services/${post.id}/edit`}
                          className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                        >
                          Sửa
                        </Link>
                        <Link
                          href={`/dich-vu/${post.slug}`}
                          target="_blank"
                          className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                        >
                          Xem
                        </Link>
                        <button
                          type="button"
                          onClick={() => setConfirmDelete(post.id)}
                          disabled={actionLoading === post.id}
                          className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

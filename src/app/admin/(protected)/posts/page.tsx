'use client'

import { useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { adminGetCategories, adminGetPosts, adminDeletePost, adminPublishPost, adminDraftPost } from '@/lib/api/admin'
import { formatDate } from '@/lib/utils'
import { getErrorMessage } from '@/lib/error'
import type { Post } from '@/types'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Toast from '@/components/ui/Toast'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'

const LIMIT = 15

const statusConfig = {
  published: { label: 'Đã đăng', cls: 'badge badge-green' },
  draft: { label: 'Nháp', cls: 'badge badge-yellow' },
  archived: { label: 'Lưu trữ', cls: 'badge badge-gray' },
}

export default function AdminPostsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const { data: catsData } = useSWR('admin-categories', adminGetCategories, { revalidateOnFocus: false })
  const excludedCatIds = (catsData?.data ?? []).filter((c) => c.slug === 'ai-agent' || c.slug === 'services').map((c) => c.id)

  const { data, isLoading, mutate } = useSWR(
    ['admin-posts', page, search, statusFilter],
    () => adminGetPosts({ page, limit: LIMIT, search: search || undefined, status: statusFilter || undefined }),
    { keepPreviousData: true }
  )

  // Lọc bài AI Agent + Dịch vụ ra khỏi list (chúng được quản tại /admin/ai-agents và /admin/services)
  const posts: Post[] = (data?.data ?? []).filter((p) => !excludedCatIds.includes(p.categoryId ?? -1))
  const total = data?.total ?? 0
  const totalPages = data?.totalPages ?? 1

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    setToast({ message, type })
  }

  async function handleDelete(id: number) {
    setActionLoading(id)
    try {
      await adminDeletePost(id)
      showToast('Đã xóa bài viết')
      mutate()
    } catch (err) {
      showToast(getErrorMessage(err) || 'Xóa thất bại', 'error')
    } finally {
      setActionLoading(null)
      setConfirmDelete(null)
    }
  }

  async function handlePublish(post: Post) {
    const missing = [!post.categoryId && 'chọn danh mục', !post.thumbnail && 'tải ảnh đại diện'].filter(Boolean)

    if (missing.length > 0) {
      setToast({ message: `Vui lòng ${missing.join(' và ')} trước khi đăng bài`, type: 'error' })
      return
    }

    const id = post.id
    setActionLoading(id)
    try {
      await adminPublishPost(id)
      showToast('Đã đăng bài viết')
      mutate()
    } catch (err) {
      showToast(getErrorMessage(err) || 'Thao tác thất bại', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  async function handleDraft(id: number) {
    setActionLoading(id)
    try {
      await adminDraftPost(id)
      showToast('Đã chuyển về nháp')
      mutate()
    } catch (err) {
      showToast(getErrorMessage(err) || 'Thao tác thất bại', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  const filterTabs = [
    { value: '', label: 'Tất cả', count: total },
    { value: 'published', label: 'Đã đăng' },
    { value: 'draft', label: 'Nháp' },
  ]

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <Modal
        open={confirmDelete !== null}
        title="Xóa bài viết"
        description="Bạn có chắc muốn xóa bài viết này? Hành động này không thể hoàn tác."
        confirmText="Xóa bài viết"
        confirmVariant="danger"
        loading={actionLoading === confirmDelete}
        onConfirm={() => confirmDelete !== null && handleDelete(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Bài viết</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {total > 0 ? `${total} bài viết trong hệ thống` : 'Quản lý tất cả bài viết'}
          </p>
        </div>
        <Link href="/admin/posts/create">
          <Button size="sm">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Viết bài mới
          </Button>
        </Link>
      </div>

      {/* Filters bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 flex-wrap gap-3">
          {/* Status tabs */}
          <div className="flex items-center gap-1">
            {filterTabs.map(({ value, label, count }) => (
              <button
                key={value}
                onClick={() => { setStatusFilter(value); setPage(1) }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${statusFilter === value
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                  }`}
              >
                {label}
                {count !== undefined && value === '' && (
                  <span className={`ml-1.5 text-xs ${statusFilter === value ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Tìm bài viết..."
                className="pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 w-52 transition-all"
              />
            </div>
            <Button type="submit" variant="secondary" size="sm">Tìm</Button>
          </form>
        </div>

        {/* Table */}
        {isLoading ? (
          <LoadingSpinner className="py-20" text="Đang tải bài viết..." />
        ) : posts.length === 0 ? (
          <EmptyState
            title="Không có bài viết nào"
            description={search ? `Không tìm thấy kết quả cho "${search}"` : 'Hãy tạo bài viết đầu tiên của bạn'}
            action={
              !search ? (
                <Link href="/admin/posts/create">
                  <Button size="sm">Viết bài đầu tiên</Button>
                </Link>
              ) : undefined
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    {['Tiêu đề', 'Danh mục', 'Trạng thái', 'Ngày tạo', 'Ngày đăng', ''].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => {
                    const status = statusConfig[post.status as keyof typeof statusConfig] ?? statusConfig.draft
                    return (
                      <tr key={post.id}>
                        <td className="max-w-xs">
                          <p className="font-semibold text-slate-800 line-clamp-1">{post.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{post.slug}</p>
                        </td>
                        <td>
                          {post.category?.name ? (
                            <span className="badge badge-blue">{post.category.name}</span>
                          ) : (
                            <span className="text-slate-400 text-xs">—</span>
                          )}
                        </td>
                        <td>
                          <span className={status.cls}>{status.label}</span>
                        </td>
                        <td className="text-slate-500 whitespace-nowrap text-xs">{formatDate(post.createdAt)}</td>
                        <td className="text-slate-500 whitespace-nowrap text-xs">
                          {post.publishedAt ? formatDate(post.publishedAt) : '—'}
                        </td>
                        <td>
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/admin/posts/${post.id}/edit`}
                              className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                            >
                              Sửa
                            </Link>
                            {post.status === 'draft' ? (
                              <button
                                onClick={() => handlePublish(post)}
                                disabled={actionLoading === post.id}
                                className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50 disabled:opacity-40 transition-colors"
                              >
                                {actionLoading === post.id ? '…' : 'Đăng'}
                              </button>
                            ) : (
                              <button
                                onClick={() => handleDraft(post.id)}
                                disabled={actionLoading === post.id}
                                className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-amber-600 hover:bg-amber-50 disabled:opacity-40 transition-colors"
                              >
                                {actionLoading === post.id ? '…' : 'Nháp'}
                              </button>
                            )}
                            <button
                              onClick={() => setConfirmDelete(post.id)}
                              className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
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
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Trang {page} / {totalPages}
                </p>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`h-8 min-w-[2rem] rounded-lg border text-xs font-medium transition-all ${p === page
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

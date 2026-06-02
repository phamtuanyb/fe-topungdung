'use client'

import Link from 'next/link'
import useSWR from 'swr'
import { useState, useMemo } from 'react'
import { adminGetCategories, adminDeleteCategory } from '@/lib/api/admin'
import { getErrorMessage } from '@/lib/error'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Toast from '@/components/ui/Toast'
import EmptyState from '@/components/ui/EmptyState'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import CategoryRow from './_components/CategoryRow'
import { buildTree } from '@/lib/utils'
import { flattenTreeCategories } from './_config'
import { Category } from '@/types'

export default function AdminCategoriesPage() {
  const { data, isLoading, mutate } = useSWR('admin-categories', adminGetCategories)

  const [collapsedIds, setCollapsedIds] = useState<Set<number>>(new Set())
  const [allCollapsed, setAllCollapsed] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const tree = useMemo<Category[]>(() => {
    if (!data?.data) return []
    return buildTree<Category>(data.data)
  }, [data])

  const parentIds = useMemo(() => tree.filter(n => (n.children?.length ?? 0) > 0).map(n => n.id), [tree])

  const flatRows = useMemo(() => flattenTreeCategories(tree, collapsedIds), [tree, collapsedIds])

  function toggleNode(id: number) {
    setCollapsedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }

      return next
    })
  }

  function toggleAll() {
    if (allCollapsed) {
      setCollapsedIds(new Set())
    } else {
      setCollapsedIds(new Set(parentIds))
    }
    setAllCollapsed(prev => !prev)
  }

  async function handleDelete(id: number) {
    setDeleting(true)
    try {
      await adminDeleteCategory(id)
      setToast({ message: 'Đã xóa danh mục', type: 'success' })
      mutate()
    } catch (err) {
      const msg = getErrorMessage(err)
      const lower = msg.toLowerCase()
      if (lower.includes('post') || lower.includes('bài')) {
        setToast({ message: 'Không thể xóa: danh mục đang có bài viết', type: 'error' })
      } else if (lower.includes('server') || lower.includes('lỗi server')) {
        setToast({
          message: 'Không thể xóa danh mục này (có thể đã từng gắn bài viết). Thử ẩn danh mục thay vì xóa.',
          type: 'error',
        })
      } else {
        setToast({ message: msg || 'Xóa thất bại', type: 'error' })
      }
    } finally {
      setDeleting(false)
      setConfirmDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <Modal
        open={confirmDelete !== null}
        title="Xóa danh mục"
        description="Bạn có chắc muốn xóa danh mục này? Danh mục không thể xóa nếu đang chứa bài viết."
        confirmText="Xóa"
        confirmVariant="danger"
        loading={deleting}
        onConfirm={() => confirmDelete !== null && handleDelete(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Danh mục</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {flatRows.length > 0 ? `${data?.data?.length ?? 0} danh mục` : 'Quản lý phân loại nội dung'}
          </p>
        </div>
        <Link href="/admin/categories/create">
          <Button size="sm">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Thêm danh mục
          </Button>
        </Link>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <LoadingSpinner className="py-20" text="Đang tải..." />
        ) : flatRows.length === 0 ? (
          <EmptyState
            title="Chưa có danh mục nào"
            action={<Link href="/admin/categories/create"><Button size="sm">Tạo danh mục đầu tiên</Button></Link>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  <th className="py-3 px-4 font-semibold text-slate-700 text-sm">
                    <div className="flex items-center gap-2">
                      {parentIds.length > 0 && (
                        <button
                          type="button"
                          onClick={toggleAll}
                          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors font-normal bg-slate-200/50 px-2 py-0.5 rounded"
                        >
                          <svg
                            className={`h-3 w-3 transition-transform duration-200 ease-out ${allCollapsed ? '' : 'rotate-90'}`}
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                          {allCollapsed ? 'Mở tất cả' : 'Thu tất cả'}
                        </button>
                      )}
                      Tên danh mục
                    </div>
                  </th>
                  <th className="py-3 px-4 font-semibold text-slate-700 text-sm">Slug</th>
                  <th className="py-3 px-4 font-semibold text-slate-700 text-sm">Danh mục cha</th>
                  <th className="py-3 px-4 font-semibold text-slate-700 text-sm">Số bài viết</th>
                  <th className="py-3 px-4 font-semibold text-slate-700 text-sm text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {flatRows.map((row) => (
                  <CategoryRow
                    key={row.cat.id}
                    rowData={row}
                    isCollapsed={collapsedIds.has(row.cat.id)}
                    onToggle={toggleNode}
                    onDeleteClick={setConfirmDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
'use client'

import Link from 'next/link'
import useSWR from 'swr'
import { useState } from 'react'
import { adminGetMenus, adminDeleteMenu } from '@/lib/api/admin'
import { getErrorMessage } from '@/lib/error'
import type { Menu } from '@/types'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Toast from '@/components/ui/Toast'
import EmptyState from '@/components/ui/EmptyState'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function AdminMenusPage() {
  const { data, isLoading, mutate } = useSWR('admin-menus', adminGetMenus)
  const menus: Menu[] = data?.data ?? []

  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  async function handleDelete(id: number) {
    setDeleting(true)
    try {
      await adminDeleteMenu(id)
      setToast({ message: 'Đã xóa menu', type: 'success' })
      mutate()
    } catch (err) {
      setToast({ message: getErrorMessage(err) || 'Xóa thất bại', type: 'error' })
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
        title="Xóa menu"
        description="Xóa menu sẽ xóa toàn bộ mục bên trong. Hành động không thể hoàn tác."
        confirmText="Xóa menu"
        confirmVariant="danger"
        loading={deleting}
        onConfirm={() => confirmDelete !== null && handleDelete(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
      />

      <AdminPageHeader
        showBack={false}
        title="Menu"
        description={menus.length > 0 ? `${menus.length} menu điều hướng` : 'Quản lý menu header, footer...'}
      >
        <Link href="/admin/menus/create">
          <Button size="sm">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Thêm menu
          </Button>
        </Link>
      </AdminPageHeader>

      <div className="admin-card overflow-hidden">
        {isLoading ? (
          <LoadingSpinner className="py-20" text="Đang tải menu..." />
        ) : menus.length === 0 ? (
          <EmptyState
            title="Chưa có menu nào"
            description="Tạo menu header hoặc footer để gắn vào website."
            action={<Link href="/admin/menus/create"><Button size="sm">Tạo menu đầu tiên</Button></Link>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tên menu</th>
                  <th>Slug</th>
                  <th>Mô tả</th>
                  <th className="text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {menus.map((menu) => (
                  <tr key={menu.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 text-xs font-bold">
                          {menu.name.charAt(0).toUpperCase()}
                        </div>
                        <p className="font-semibold text-slate-800 text-sm">{menu.name}</p>
                      </div>
                    </td>
                    <td>
                      <code className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md">
                        {menu.slug}
                      </code>
                    </td>
                    <td>
                      <p className="text-sm text-slate-500 line-clamp-1 max-w-xs">
                        {menu.description || '—'}
                      </p>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/menus/${menu.id}/edit`}
                          className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          Quản lý
                        </Link>
                        <button
                          type="button"
                          onClick={() => setConfirmDelete(menu.id)}
                          className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

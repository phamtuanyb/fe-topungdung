'use client'

import { useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { adminGetUsers, adminDeleteUser, type AdminUserItem } from '@/lib/api/admin'
import { formatDate } from '@/lib/utils'
import { getErrorMessage } from '@/lib/error'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Toast from '@/components/ui/Toast'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'

export default function AdminUsersPage() {
  const { data, isLoading, mutate } = useSWR('admin-users', adminGetUsers)
  const users: AdminUserItem[] = data?.data ?? []

  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  async function handleDelete(id: number) {
    setDeleting(true)
    try {
      await adminDeleteUser(id)
      setToast({ message: 'Đã xóa người dùng', type: 'success' })
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
        title="Xóa người dùng"
        description="Bạn có chắc muốn xóa người dùng này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        confirmVariant="danger"
        loading={deleting}
        onConfirm={() => confirmDelete !== null && handleDelete(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Người dùng</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {users.length > 0 ? `${users.length} tài khoản` : 'Quản lý tài khoản hệ thống'}
          </p>
        </div>
        <Link href="/admin/users/create">
          <Button size="sm">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Thêm người dùng
          </Button>
        </Link>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <LoadingSpinner className="py-20" text="Đang tải..." />
        ) : users.length === 0 ? (
          <EmptyState
            title="Chưa có người dùng nào"
            action={<Link href="/admin/users/create"><Button size="sm">Tạo người dùng đầu tiên</Button></Link>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Người dùng</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th className="text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{user.fullName}</p>
                          <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${user.role === 'admin' ? 'badge-blue' : 'badge-gray'}`}>
                        {user.role === 'admin' ? '⚡ Admin' : 'User'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${user.status === 'active' ? 'badge-green' : 'badge-red'}`}>
                        {user.status === 'active' ? 'Hoạt động' : 'Vô hiệu'}
                      </span>
                    </td>
                    <td className="text-slate-500 text-xs whitespace-nowrap">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/users/${user.id}/edit`}
                          className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          Sửa
                        </Link>
                        <button
                          onClick={() => setConfirmDelete(user.id)}
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

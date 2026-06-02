'use client'

import useSWR from 'swr'
import { adminGetUser } from '@/lib/api/admin'
import UserEditor from '@/components/admin/UserEditor'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface Props {
  params: { id: string }
}

export default function AdminUserEditPage({ params }: Props) {
  const id = parseInt(params.id)
  const { data, isLoading, error } = useSWR(['admin-user', id], () => adminGetUser(id))

  if (isLoading) return <LoadingSpinner className="py-20" text="Đang tải..." />
  if (error || !data?.data) return <p className="text-red-500">Không tìm thấy người dùng.</p>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Sửa người dùng</h1>
      <div className="rounded-xl bg-white border border-gray-200 p-6 shadow-sm">
        <UserEditor user={data.data} />
      </div>
    </div>
  )
}

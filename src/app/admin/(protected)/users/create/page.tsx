import UserEditor from '@/components/admin/UserEditor'

export default function AdminUserCreatePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Thêm người dùng</h1>
      <div className="rounded-xl bg-white border border-gray-200 p-6 shadow-sm">
        <UserEditor />
      </div>
    </div>
  )
}

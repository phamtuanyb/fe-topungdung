'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import {
  adminCreateUser,
  adminUpdateUser,
  adminChangePassword,
  type AdminUserItem,
} from '@/lib/api/admin'
import { getErrorMessage } from '@/lib/error'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Toast from '@/components/ui/Toast'

const createSchema = z.object({
  fullName: z.string().min(1, 'Họ tên không được trống'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu ít nhất 8 ký tự'),
  role: z.enum(['admin', 'user']),
  status: z.enum(['active', 'inactive']),
})

const editSchema = z.object({
  fullName: z.string().min(1, 'Họ tên không được trống'),
  email: z.string().email('Email không hợp lệ'),
  newPassword: z.union([
    z.string().min(8, 'Mật khẩu ít nhất 8 ký tự'),
    z.literal(''),
  ]),
  role: z.enum(['admin', 'user']),
  status: z.enum(['active', 'inactive']),
})

type CreateFormData = z.infer<typeof createSchema>
type EditFormData = z.infer<typeof editSchema>

// ─── Props ───────────────────────────────────────────────────────────────────

interface UserEditorProps {
  user?: AdminUserItem
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function UserEditor({ user }: UserEditorProps) {
  const router = useRouter()
  const isEdit = !!user
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Create form
  const createForm = useForm<CreateFormData>({
    resolver: zodResolver(createSchema),
    defaultValues: { role: 'user', status: 'active' },
  })

  // Edit form
  const editForm = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      fullName: user?.fullName ?? '',
      email: user?.email ?? '',
      newPassword: '',
      role: user?.role ?? 'user',
      status: user?.status ?? 'active',
    },
  })

  // ─── Submit create ────────────────────────────────────────────────────────
  async function onCreateSubmit(data: CreateFormData) {
    try {
      await adminCreateUser(data)
      setToast({ message: 'Đã tạo người dùng', type: 'success' })
      setTimeout(() => router.push('/admin/users'), 1000)
    } catch (err) {
      setToast({ message: getErrorMessage(err) || 'Tạo thất bại', type: 'error' })
    }
  }

  // ─── Submit edit ──────────────────────────────────────────────────────────
  async function onEditSubmit(data: EditFormData) {
    if (!user) return
    try {
      // Cập nhật thông tin cơ bản
      await adminUpdateUser(user.id, {
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        status: data.status,
      })

      // Đổi mật khẩu nếu có nhập
      if (data.newPassword) {
        await adminChangePassword(user.id, data.newPassword)
      }

      setToast({ message: 'Đã cập nhật người dùng', type: 'success' })
      setTimeout(() => router.push('/admin/users'), 1000)
    } catch (err) {
      setToast({ message: getErrorMessage(err) || 'Cập nhật thất bại', type: 'error' })
    }
  }

  // ─── Render Create Form ───────────────────────────────────────────────────
  if (!isEdit) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = createForm
    return (
      <>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <form onSubmit={handleSubmit(onCreateSubmit)} className="max-w-lg flex flex-col gap-4">
          <Input
            label="Họ tên"
            placeholder="Nguyễn Văn A"
            error={errors.fullName?.message}
            {...register('fullName')}
          />
          <Input
            label="Email"
            type="email"
            placeholder="email@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Mật khẩu"
            type="password"
            placeholder="Tối thiểu 8 ký tự"
            error={errors.password?.message}
            {...register('password')}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
            <select
              {...register('role')}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <select
              {...register('status')}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="active">Hoạt động</option>
              <option value="inactive">Vô hiệu hóa</option>
            </select>
          </div>

          <div className="flex gap-3 mt-2">
            <Button type="submit" loading={isSubmitting}>Tạo người dùng</Button>
            <Button type="button" variant="secondary" onClick={() => router.push('/admin/users')}>Hủy</Button>
          </div>
        </form>
      </>
    )
  }

  // ─── Render Edit Form ─────────────────────────────────────────────────────
  const { register, handleSubmit, formState: { errors, isSubmitting } } = editForm
  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <form onSubmit={handleSubmit(onEditSubmit)} className="max-w-lg flex flex-col gap-4">
        <Input
          label="Họ tên"
          placeholder="Nguyễn Văn A"
          error={errors.fullName?.message}
          {...register('fullName')}
        />
        <Input
          label="Email"
          type="email"
          placeholder="email@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Mật khẩu mới (để trống nếu không đổi)"
          type="password"
          placeholder="Tối thiểu 8 ký tự"
          error={errors.newPassword?.message}
          {...register('newPassword')}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
          <select
            {...register('role')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          >
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
          <select
            {...register('status')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          >
            <option value="active">Hoạt động</option>
            <option value="inactive">Vô hiệu hóa</option>
          </select>
        </div>

        <div className="flex gap-3 mt-2">
          <Button type="submit" loading={isSubmitting}>Cập nhật</Button>
          <Button type="button" variant="secondary" onClick={() => router.push('/admin/users')}>Hủy</Button>
        </div>
      </form>
    </>
  )
}

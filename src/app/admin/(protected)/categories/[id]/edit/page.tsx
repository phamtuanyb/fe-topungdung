'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { adminUpdateCategory } from '@/lib/api/admin'
import { getErrorMessage } from '@/lib/error'
import { slugify } from '@/lib/utils'
import { optionalFormId } from '@/lib/validation'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import Toast from '@/components/ui/Toast'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useListCategorySelect } from '@/app/admin/(protected)/categories/_config'

const schema = z.object({
  name: z.string().min(1, 'Tên không được trống'),
  slug: z.string().min(1, 'Slug không được trống'),
  description: z.string().optional(),
  parentId: optionalFormId,
  status: z.enum(['active', 'inactive']),
})
type FormData = z.infer<typeof schema>

interface Props { params: { id: string } }

export default function AdminCategoryEditPage({ params }: Props) {
  const id = parseInt(params.id)
  const router = useRouter()
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [slugEdited, setSlugEdited] = useState(false)

  const { isLoading, current, selectOptions } = useListCategorySelect(id)

  const { register, handleSubmit, watch, setValue, setError, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (current) {
      reset({
        name: current.name,
        slug: current.slug,
        description: current.description ?? '',
        parentId: current.parentId ?? null,
        status: current.status ?? 'active',
      })
    }
  }, [current, reset])

  const name = watch('name')
  useEffect(() => {
    if (!slugEdited && name) setValue('slug', slugify(name))
  }, [name, slugEdited, setValue])

  async function onSubmit(data: FormData) {
    if (data.parentId === id) {
      setError('parentId', { message: 'Không thể chọn chính danh mục này làm cha' })
      return
    }
    try {
      await adminUpdateCategory(id, data)
      setToast({ message: 'Đã cập nhật danh mục', type: 'success' })
      setTimeout(() => router.push('/admin/categories'), 1000)
    } catch (err) {
      const msg = getErrorMessage(err)
      if (msg.toLowerCase().includes('slug')) {
        setError('slug', { message: 'Slug đã tồn tại' })
      } else {
        setToast({ message: msg || 'Cập nhật thất bại', type: 'error' })
      }
    }
  }

  if (isLoading) return <LoadingSpinner className="py-20" text="Đang tải..." />
  if (!current) return <p className="text-red-500">Không tìm thấy danh mục.</p>

  return (
    <div className="max-w-xl">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Sửa danh mục</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4">
        <Input label="Tên danh mục" error={errors.name?.message} {...register('name')} />
        <Input
          label="Slug"
          error={errors.slug?.message}
          hint="Sửa slug thủ công nếu cần"
          {...register('slug')}
          onChange={(e) => { setSlugEdited(true); setValue('slug', e.target.value) }}
        />
        <Textarea label="Mô tả" rows={3} {...register('description')} />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Danh mục cha</label>
          <select {...register('parentId')} className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option value="">-- Không có --</option>
            {selectOptions.map(({ cat, depth }) => (
              <option key={cat.id} value={cat.id}>
                {depth === 0 ? "" : '\u00A0\u00A0'.repeat(depth * 2) + '└─ '}{cat.name}
              </option>
            ))}
          </select>
          {errors.parentId && <p className="text-xs text-red-500">{errors.parentId.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Trạng thái</label>
          <select {...register('status')} className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option value="active">Hoạt động</option>
            <option value="inactive">Ẩn</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={isSubmitting}>Cập nhật</Button>
          <Button type="button" variant="secondary" onClick={() => router.back()}>Hủy</Button>
        </div>
      </form>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { adminCreateMenu } from '@/lib/api/admin'
import { getErrorMessage } from '@/lib/error'
import { slugify } from '@/lib/utils'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminSectionCard from '@/components/admin/AdminSectionCard'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import Toast from '@/components/ui/Toast'

const schema = z.object({
  name: z.string().min(1, 'Tên menu không được trống'),
  slug: z.string().optional(),
  description: z.string().optional(),
})
type FormData = z.infer<typeof schema>

export default function AdminMenuCreatePage() {
  const router = useRouter()
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [slugEdited, setSlugEdited] = useState(false)

  const { register, handleSubmit, watch, setValue, setError, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const name = watch('name')
  useEffect(() => {
    if (!slugEdited && name) setValue('slug', slugify(name))
  }, [name, slugEdited, setValue])

  async function onSubmit(data: FormData) {
    try {
      const res = await adminCreateMenu({
        name: data.name,
        slug: data.slug || undefined,
        description: data.description,
      })
      setToast({ message: 'Đã tạo menu', type: 'success' })
      setTimeout(() => router.push(`/admin/menus/${res.data.id}/edit`), 800)
    } catch (err) {
      const msg = getErrorMessage(err)
      if (msg.toLowerCase().includes('slug')) {
        setError('slug', { message: 'Slug đã tồn tại' })
      } else {
        setToast({ message: msg || 'Tạo thất bại', type: 'error' })
      }
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <AdminPageHeader
        backHref="/admin/menus"
        title="Tạo menu"
        description="Tạo menu mới rồi thêm các mục điều hướng"
      />

      <AdminSectionCard
        title="Thông tin menu"
        description="Slug dùng cho API public: GET /api/menus/{slug}"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input label="Tên menu" placeholder="Header Menu" error={errors.name?.message} {...register('name')} />
          <Input
            label="Slug"
            placeholder="header-menu"
            hint="Tự sinh từ tên, có thể sửa"
            error={errors.slug?.message}
            {...register('slug')}
            onChange={(e) => { setSlugEdited(true); setValue('slug', e.target.value) }}
          />
          <Textarea label="Mô tả" placeholder="Menu hiển thị ở header website..." rows={3} {...register('description')} />

          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <Button type="submit" loading={isSubmitting}>Tạo menu</Button>
            <Button type="button" variant="secondary" onClick={() => router.back()}>Hủy</Button>
          </div>
        </form>
      </AdminSectionCard>
    </div>
  )
}

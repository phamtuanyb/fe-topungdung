'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import useSWR from 'swr'
import { adminGetMenu, adminUpdateMenu } from '@/lib/api/admin'
import { getErrorMessage } from '@/lib/error'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminSectionCard from '@/components/admin/AdminSectionCard'
import MenuItemsEditor from '@/components/admin/MenuItemsEditor'
import { buildMenuTree, flattenMenuTree } from '@/lib/menuUtils'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import Toast from '@/components/ui/Toast'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const schema = z.object({
  name: z.string().min(1, 'Tên menu không được trống'),
  slug: z.string().min(1, 'Slug không được trống'),
  description: z.string().optional(),
})
type FormData = z.infer<typeof schema>

interface Props {
  params: { id: string }
}

export default function AdminMenuEditPage({ params }: Props) {
  const id = parseInt(params.id)
  const router = useRouter()
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const { data, isLoading, error, mutate } = useSWR(['admin-menu', id], () => adminGetMenu(id))
  const menu = data?.data
  const itemCount = menu?.items
    ? flattenMenuTree(buildMenuTree(menu.items)).length
    : 0

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (menu) {
      reset({
        name: menu.name,
        slug: menu.slug,
        description: menu.description ?? '',
      })
    }
  }, [menu, reset])

  async function onSubmit(data: FormData) {
    try {
      await adminUpdateMenu(id, data)
      setToast({ message: 'Đã cập nhật menu', type: 'success' })
      mutate()
    } catch (err) {
      setToast({ message: getErrorMessage(err) || 'Cập nhật thất bại', type: 'error' })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <AdminPageHeader backHref="/admin/menus" title="Quản lý menu" description="Đang tải..." />
        <AdminSectionCard bodyClassName="py-16">
          <LoadingSpinner text="Đang tải menu..." />
        </AdminSectionCard>
      </div>
    )
  }

  if (error || !menu) {
    return (
      <div className="space-y-6">
        <AdminPageHeader backHref="/admin/menus" title="Quản lý menu" />
        <AdminSectionCard>
          <div className="py-8 text-center space-y-4">
            <p className="text-red-600 font-medium">Không tìm thấy menu.</p>
            <Link href="/admin/menus">
              <Button variant="secondary" size="sm">Quay lại danh sách</Button>
            </Link>
          </div>
        </AdminSectionCard>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <AdminPageHeader
        backHref="/admin/menus"
        title="Quản lý menu"
        description={menu.name}
      >
        <code className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-mono">
          {menu.slug}
        </code>
      </AdminPageHeader>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <AdminSectionCard
          title="Thông tin menu"
          description="Tên, slug và mô tả"
          className="xl:col-span-1"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input label="Tên menu" error={errors.name?.message} {...register('name')} />
            <Input
              label="Slug"
              error={errors.slug?.message}
              hint={`Public: /api/menus/${menu.slug}`}
              {...register('slug')}
            />
            <Textarea label="Mô tả" rows={3} {...register('description')} />
            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-100">
              <Button type="submit" size="sm" loading={isSubmitting} className="sm:flex-1">
                Lưu thông tin
              </Button>
              <Button type="button" variant="secondary" size="sm" onClick={() => router.push('/admin/menus')}>
                Danh sách
              </Button>
            </div>
          </form>
        </AdminSectionCard>

        <AdminSectionCard
          title="Các mục menu"
          description={itemCount > 0 ? `${itemCount} mục (gồm cả cấp con)` : 'Chưa có mục nào'}
          className="xl:col-span-2"
          bodyClassName="p-0"
          padding={false}
        >
          <div className="p-5">
            <MenuItemsEditor
              menuId={id}
              items={menu.items ?? []}
              onUpdated={() => mutate()}
            />
          </div>
        </AdminSectionCard>
      </div>
    </div>
  )
}

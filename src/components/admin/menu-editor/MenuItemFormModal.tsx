'use client'

import { useEffect, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import useSWR from 'swr'
import { adminGetCategories, adminGetPosts } from '@/lib/api/admin'
import {
  menuItemFormSchema,
  type MenuItemFormValues,
  categoryMenuUrl,
  postMenuUrl,
  sitePageMenuUrl,
  SITE_PAGES,
} from '@/lib/menuItemForm'
import type { FlatNode } from './types'
import { TYPE_LABELS } from './types'
import type { MenuItemType } from './types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface MenuItemFormModalProps {
  editingId: number | null
  defaultValues: MenuItemFormValues
  saving: boolean
  parentOptions: FlatNode[]
  positionOptions: (parentId: string, excludeId?: number) => { value: string; label: string }[]
  onSave: (values: MenuItemFormValues) => void
  onClose: () => void
}

export function MenuItemFormModal({
  editingId,
  defaultValues,
  saving,
  parentOptions,
  positionOptions,
  onSave,
  onClose,
}: MenuItemFormModalProps) {
  const { data: catsData } = useSWR('admin-categories-menu', adminGetCategories)
  const { data: postsData } = useSWR(
    ['admin-posts-menu', 1],
    () => adminGetPosts({ page: 1, limit: 100 })
  )

const categories = useMemo(() => catsData?.data ?? [], [catsData?.data])
const posts = useMemo(() => postsData?.data ?? [], [postsData?.data])

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemFormSchema),
    defaultValues,
  })

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  const type = watch('type')
  const targetId = watch('targetId')
  const parentId = watch('parentId')

  // Tự cập nhật URL khi chọn danh mục / bài viết / trang
  useEffect(() => {
    if (type === 'category' && targetId != null) {
      const cat = categories.find((c) => c.id === targetId)
      if (cat) setValue('url', categoryMenuUrl(cat.slug), { shouldValidate: true })
    } else if (type === 'post' && targetId != null) {
      const post = posts.find((p) => p.id === targetId)
      if (post) setValue('url', postMenuUrl(post.slug), { shouldValidate: true })
    } else if (type === 'page' && targetId != null) {
      setValue('url', sitePageMenuUrl(targetId), { shouldValidate: true })
    }
  }, [type, targetId, categories, posts, setValue])

  const posOpts = positionOptions(parentId, editingId ?? undefined)

  function handleTypeChange(next: MenuItemType) {
    setValue('type', next)
    setValue('targetId', null)
    setValue('url', '')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 !m-0">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={() => !saving && onClose()}
      />

      <div className="relative z-10 w-full max-w-md admin-card overflow-hidden max-h-[90vh] flex flex-col">
        <div className="h-1 w-full bg-indigo-500 shrink-0" />

        <form
          onSubmit={handleSubmit(onSave)}
          className="p-6 space-y-4 overflow-y-auto"
        >
          <h3 className="text-base font-semibold text-slate-900">
            {editingId ? 'Sửa mục menu' : 'Thêm mục menu'}
          </h3>

          <Input
            label="Nhãn hiển thị"
            error={errors.label?.message}
            {...register('label')}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Loại liên kết</label>
            <select
              className="admin-select"
              value={type}
              onChange={(e) => handleTypeChange(e.target.value as MenuItemType)}
            >
              {(Object.keys(TYPE_LABELS) as MenuItemType[]).map((t) => (
                <option key={t} value={t}>{TYPE_LABELS[t]}</option>
              ))}
            </select>
          </div>

          {type === 'custom' && (
            <Input
              label="URL"
              placeholder="https://example.com"
              hint="URL đầy đủ: https://..."
              error={errors.url?.message}
              {...register('url')}
            />
          )}

          {type === 'category' && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">Danh mục</label>
              <Controller
                name="targetId"
                control={control}
                render={({ field }) => (
                  <select
                    className="admin-select"
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const v = e.target.value
                      field.onChange(v === '' ? null : Number(v))
                    }}
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                )}
              />
              {errors.targetId?.message && (
                <p className="text-xs text-red-500 font-medium">{errors.targetId.message}</p>
              )}
            </div>
          )}

          {type === 'post' && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">Bài viết</label>
              <Controller
                name="targetId"
                control={control}
                render={({ field }) => (
                  <select
                    className="admin-select"
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const v = e.target.value
                      field.onChange(v === '' ? null : Number(v))
                    }}
                  >
                    <option value="">-- Chọn bài viết --</option>
                    {posts.map((p) => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                )}
              />
              {errors.targetId?.message && (
                <p className="text-xs text-red-500 font-medium">{errors.targetId.message}</p>
              )}
            </div>
          )}

          {type === 'page' && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">Trang</label>
              <Controller
                name="targetId"
                control={control}
                render={({ field }) => (
                  <select
                    className="admin-select"
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const v = e.target.value
                      field.onChange(v === '' ? null : Number(v))
                    }}
                  >
                    <option value="">-- Chọn trang --</option>
                    {SITE_PAGES.map((p) => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>
                )}
              />
              <p className="text-xs text-slate-400">
                Trang tĩnh trên website (không phải bài viết hay danh mục)
              </p>
              {errors.targetId?.message && (
                <p className="text-xs text-red-500 font-medium">{errors.targetId.message}</p>
              )}
            </div>
          )}

          {type !== 'custom' && (
            <Input
              label="Slug"
              readOnly
              hint="URL được sinh từ slug hoặc đường dẫn trang đã chọn"
              className="bg-slate-50"
              {...register('url')}
            />
          )}

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Mục cha</label>
            <select
              className="admin-select"
              {...register('parentId', {
                onChange: () => setValue('position', 'last'),
              })}
            >
              <option value="">— Cấp gốc —</option>
              {parentOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {'—'.repeat(p.depth)} {p.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Vị trí</label>
            <select className="admin-select" {...register('position')}>
              {posOpts.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <p className="text-xs text-slate-400 mt-0.5">Thứ tự hiển thị trong cùng cấp menu</p>
          </div>

          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <Button type="submit" loading={saving}>
              {editingId ? 'Cập nhật' : 'Thêm'}
            </Button>
            <Button type="button" variant="secondary" disabled={saving} onClick={onClose}>
              Hủy
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

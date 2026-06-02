import { z } from 'zod'
import { optionalFormId } from '@/lib/validation'
import type { MenuItemType } from '@/types'

export const SITE_PAGES = [
  { id: 1, label: 'Trang chủ', path: '/' },
  { id: 2, label: 'Giới thiệu', path: '/introduction' },
  { id: 3, label: 'Liên hệ', path: '/contact' },
] as const

export type SitePageId = (typeof SITE_PAGES)[number]['id']

export function categoryMenuUrl(slug: string): string {
  return `/category/${slug}`
}

export function postMenuUrl(slug: string): string {
  return `/tin-tuc/${slug}`
}

export function sitePageMenuUrl(pageId: number): string {
  return SITE_PAGES.find((p) => p.id === pageId)?.path ?? ''
}

export function isCompleteUrl(value: string): boolean {
  const v = value.trim()
  if (!v) return false
  if (v.startsWith('/')) {
    return /^\/[^\s]*$/.test(v)
  }
  try {
    const u = new URL(v)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export const menuItemFormSchema = z
  .object({
    label: z.string().min(1, 'Nhãn không được trống'),
    type: z.enum(['custom', 'category', 'post', 'page']),
    url: z.string(),
    targetId: optionalFormId,
    parentId: z.string(),
    position: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'custom') {
      if (!isCompleteUrl(data.url)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['url'],
          message: 'Nhập URL đầy đủ (https://...)',
        })
      }
      return
    }
    if (data.targetId == null) {
      const labels: Record<Exclude<MenuItemType, 'custom'>, string> = {
        category: 'Chọn danh mục',
        post: 'Chọn bài viết',
        page: 'Chọn trang',
      }
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['targetId'],
        message: labels[data.type],
      })
    }
  })

export type MenuItemFormValues = z.infer<typeof menuItemFormSchema>

export const emptyMenuItemFormValues = (): MenuItemFormValues => ({
  label: '',
  type: 'custom',
  url: '',
  targetId: null,
  parentId: '',
  position: 'last',
})

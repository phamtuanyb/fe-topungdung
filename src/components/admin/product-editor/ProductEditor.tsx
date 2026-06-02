'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import {
  adminCreatePost,
  adminGetCategories,
  adminUpdatePost,
  adminPublishPost,
  adminDraftPost,
} from '@/lib/api/admin'
import { getErrorMessage } from '@/lib/error'
import { slugify } from '@/lib/utils'
import type { Post, PostStatus, ProductPageConfig } from '@/types'
import Toast from '@/components/ui/Toast'
import ProductBasicInfo from './ProductBasicInfo'
import ProductFeaturesPricing from './ProductFeaturesPricing'
import ProductDetailedContent from './ProductDetailedContent'
import ProductDisplay from './ProductDisplay'
import ProductSeo from './ProductSeo'

type Tab = 'basic' | 'features' | 'detail' | 'display' | 'seo'

const TABS: { key: Tab; label: string }[] = [
  { key: 'basic', label: 'Nội dung' },
  { key: 'features', label: 'Tính năng & Giá' },
  { key: 'detail', label: 'Nội dung chi tiết' },
  { key: 'display', label: 'Hiển thị' },
  { key: 'seo', label: 'SEO' },
]

interface FormValues {
  title: string
  slug: string
  shortName?: string | null
  excerpt?: string
  logoUrl?: string | null
  thumbnail?: string | null
  badge?: string | null
  displayOrder?: number | null
  menuGroupId?: number | null
  status: PostStatus
  categoryId?: number | null
  seoTitle?: string | null
  seoDescription?: string | null
  seoKeywords?: string | null
  focusKeyword?: string | null
  productPageConfig?: ProductPageConfig | null
}

const EMPTY: FormValues = {
  title: '',
  slug: '',
  shortName: '',
  excerpt: '',
  logoUrl: null,
  thumbnail: null,
  badge: null,
  displayOrder: 0,
  menuGroupId: null,
  status: 'draft',
  categoryId: null,
  seoTitle: null,
  seoDescription: null,
  seoKeywords: null,
  focusKeyword: null,
  productPageConfig: null,
}

function fromPost(p: Post): FormValues {
  return {
    title: p.title,
    slug: p.slug,
    shortName: p.shortName ?? '',
    excerpt: p.excerpt ?? '',
    logoUrl: p.logoUrl ?? null,
    thumbnail: p.thumbnail ?? null,
    badge: p.badge ?? null,
    displayOrder: p.displayOrder ?? 0,
    menuGroupId: p.menuGroupId ?? null,
    status: p.status,
    categoryId: p.categoryId ?? null,
    seoTitle: p.seoTitle ?? null,
    seoDescription: p.seoDescription ?? null,
    seoKeywords: p.seoKeywords ?? null,
    productPageConfig: p.productPageConfig ?? null,
  }
}

interface Props {
  post?: Post
  /** Category slug used to fill categoryId for new products. Defaults to 'ai-agent'. */
  categorySlug?: string
  /** Admin list page href to navigate back to. Defaults to /admin/ai-agents. */
  listHref?: string
  /** Public URL prefix (segment after /). Defaults to 'ai-agent'. */
  publicSlugPrefix?: string
}

export default function ProductEditor({
  post,
  categorySlug = 'ai-agent',
  listHref = '/admin/ai-agents',
  publicSlugPrefix = 'ai-agent',
}: Props) {
  const router = useRouter()
  const isEdit = !!post
  const [values, setValues] = useState<FormValues>(post ? fromPost(post) : EMPTY)
  const [tab, setTab] = useState<Tab>('basic')
  const [saving, setSaving] = useState<'draft' | 'published' | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const { data: catsData } = useSWR('admin-categories', adminGetCategories, { revalidateOnFocus: false })
  const defaultCatId = catsData?.data?.find((c) => c.slug === categorySlug)?.id

  useEffect(() => {
    if (!isEdit && defaultCatId && !values.categoryId) {
      setValues((v) => ({ ...v, categoryId: defaultCatId }))
    }
  }, [isEdit, defaultCatId, values.categoryId])

  function patch(p: Partial<FormValues>) {
    setValues((v) => ({ ...v, ...p }))
  }

  async function save(targetStatus: PostStatus) {
    if (!values.title.trim()) {
      setToast({ message: 'Vui lòng nhập Tên sản phẩm', type: 'error' })
      setTab('basic')
      return
    }
    // Tên ngắn không bắt buộc — nếu để trống, menu/sticky bar sẽ fallback dùng Tên sản phẩm (title).
    const slug = values.slug.trim() || slugify(values.title)

    setSaving(targetStatus)
    try {
      const payload = {
        title: values.title.trim(),
        slug,
        excerpt: values.excerpt?.trim() || undefined,
        content: ' ', // product pages don't use HTML content; satisfy validator
        status: targetStatus,
        categoryId: values.categoryId ?? defaultCatId ?? null,
        thumbnail: values.thumbnail,
        seoTitle: values.seoTitle ?? null,
        seoDescription: values.seoDescription ?? null,
        seoKeywords: values.seoKeywords ?? null,
        logoUrl: values.logoUrl,
        badge: values.badge,
        shortName: values.shortName?.trim() || null,
        displayOrder: values.displayOrder ?? 0,
        menuGroupId: values.menuGroupId ?? null,
        productPageConfig: values.productPageConfig,
      }

      if (isEdit && post) {
        await adminUpdatePost(post.id, payload)
        // also call publish/draft to set publishedAt
        if (targetStatus === 'published') await adminPublishPost(post.id)
        else await adminDraftPost(post.id)
        setToast({ message: targetStatus === 'published' ? 'Đã đăng sản phẩm' : 'Đã lưu nháp', type: 'success' })
      } else {
        const res = await adminCreatePost(payload)
        if (targetStatus === 'published') await adminPublishPost(res.data.id)
        setToast({ message: 'Đã tạo sản phẩm', type: 'success' })
        setTimeout(() => router.push(`${listHref}/${res.data.id}/edit`), 800)
      }
    } catch (err) {
      const msg = getErrorMessage(err)
      setToast({ message: msg?.toLowerCase().includes('slug') ? 'Slug đã tồn tại, đổi slug khác.' : msg || 'Lưu thất bại', type: 'error' })
    } finally {
      setSaving(null)
    }
  }

  const previewHref = post?.slug ? `/${publicSlugPrefix}/${post.slug}` : null

  return (
    <div className="space-y-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Sticky header */}
      <div className="sticky top-0 z-10 -mx-6 px-6 py-3 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link href={listHref} className="text-slate-500 hover:text-slate-800 text-sm">← Danh sách</Link>
            <span className="text-slate-300">/</span>
            <div className="text-sm font-semibold text-slate-800 truncate">
              {isEdit ? values.title || 'Sản phẩm' : 'Tạo sản phẩm mới'}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {previewHref && (
              <Link
                href={previewHref}
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
              >
                👁 Xem trên web
              </Link>
            )}
            <button
              type="button"
              onClick={() => save('draft')}
              disabled={saving !== null}
              className="rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              {saving === 'draft' ? 'Đang lưu...' : 'Lưu nháp'}
            </button>
            <button
              type="button"
              onClick={() => save('published')}
              disabled={saving !== null}
              className="rounded-lg bg-vs-orange px-4 py-2 text-xs font-bold text-white hover:bg-vs-orange-dark disabled:opacity-50"
            >
              {saving === 'published' ? 'Đang đăng...' : isEdit ? 'Cập nhật & đăng' : 'Đăng'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 -mx-1">
        <div className="flex gap-1 px-1 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                tab === t.key
                  ? 'text-vs-blue border-vs-blue'
                  : 'text-slate-500 border-transparent hover:text-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="pb-12">
        {tab === 'basic' && (
          <ProductBasicInfo
            values={values}
            onChange={patch}
            isCreate={!isEdit}
          />
        )}
        {tab === 'features' && (
          <ProductFeaturesPricing
            config={values.productPageConfig ?? {}}
            onChange={(cfg) => patch({ productPageConfig: cfg })}
          />
        )}
        {tab === 'detail' && (
          <ProductDetailedContent
            config={values.productPageConfig ?? {}}
            onChange={(cfg) => patch({ productPageConfig: cfg })}
          />
        )}
        {tab === 'display' && (
          <ProductDisplay values={values} onChange={patch} categorySlug={categorySlug} />
        )}
        {tab === 'seo' && (
          <ProductSeo values={values} onChange={patch} />
        )}
      </div>
    </div>
  )
}

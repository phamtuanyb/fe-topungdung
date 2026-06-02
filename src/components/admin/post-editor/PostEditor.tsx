'use client'

import { useState, useCallback } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import type { Post, PostStatus } from '@/types'
import { adminGetCategories, adminCreatePost, adminUpdatePost, adminUploadMedia, adminPublishPost } from '@/lib/api/admin'
import { getErrorMessage } from '@/lib/error'
import Toast from '@/components/ui/Toast'
import PostPreviewModal, { type PostPreviewData } from '@/components/admin/PostPreviewModal'
import { optionalFormId } from '@/lib/validation'

// Import subcomponents
import PostMainColumn from './PostMainColumn'
import PanelPublish from './PanelPublish'
import PanelCategories from './PanelCategories'
import PanelThumbnail from './PanelThumbnail'
import PanelTags from './PanelTags'
import PanelAiAgent from './PanelAiAgent'
import { SidePanel } from './SharedPanels'

const schema = z.object({
  title: z.string().min(1, 'Tiêu đề không được trống'),
  slug: z.string().min(1, 'Slug không được trống'),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'Nội dung không được trống'),
  categoryId: optionalFormId,
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  thumbnail: z.string().optional(),
  authorId: z.coerce.number().optional().nullable(),
  logoUrl: z.string().nullable().optional(),
  badge: z.string().nullable().optional(),
  shortName: z.string().nullable().optional(),
  displayOrder: z.coerce.number().nullable().optional(),
  productPageConfig: z.any().nullable().optional(),
})

export type FormData = z.infer<typeof schema>

interface PostEditorProps {
  post?: Post
}

export default function PostEditor({ post }: PostEditorProps) {
  const router = useRouter()
  const isEdit = !!post

  const [saving, setSaving] = useState<PostStatus | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const [tags, setTags] = useState<string[]>(post?.tags ?? [])
  const [previewPost, setPreviewPost] = useState<PostPreviewData | null>(null)

  const { data: catsData } = useSWR('admin-categories', adminGetCategories, {
    keepPreviousData: true,
    revalidateOnFocus: false,
    revalidateIfStale: false,
  })

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: post?.title ?? '',
      slug: post?.slug ?? '',
      excerpt: post?.excerpt ?? '',
      content: post?.content ?? '',
      categoryId: post?.categoryId ?? null,
      seoTitle: post?.seoTitle ?? '',
      seoDescription: post?.seoDescription ?? '',
      seoKeywords: post?.seoKeywords ?? '',
      authorId: post?.author?.id ?? null,
      logoUrl: post?.logoUrl ?? null,
      badge: post?.badge ?? null,
      shortName: post?.shortName ?? null,
      displayOrder: post?.displayOrder ?? 0,
      productPageConfig: post?.productPageConfig ?? null,
    },
  })

  const { handleSubmit, watch, setError, getValues } = methods

  const slug = watch('slug')

  const handleImageUpload = useCallback(async (file: File): Promise<string> => {
    const res = await adminUploadMedia(file)
    return res.data.url
  }, [])

  const handleToast = useCallback((msg: string, type: 'success' | 'error') => {
    setToast({ message: msg, type })
  }, [])

  async function submit(data: FormData, status: PostStatus) {
    setSaving(status)

    try {
      const payload = { ...data, status, tags }
      if (isEdit && post) {
        const res = await adminUpdatePost(post.id, payload)
        setToast({ message: 'Đã cập nhật bài viết', type: 'success' })
        return res
      } else {
        const res = await adminCreatePost({ ...payload, status })
        setToast({ message: 'Đã tạo bài viết', type: 'success' })
        setTimeout(() => router.push(`/admin/posts/${res.data.id}/edit`), 1000)
        return res
      }
    } catch (err) {
      const msg = getErrorMessage(err)
      if (msg.toLowerCase().includes('slug')) {
        setError('slug', { message: 'Slug đã tồn tại, vui lòng dùng slug khác' })
      } else {
        setToast({ message: msg || 'Lưu thất bại', type: 'error' })
      }
    } finally {
      setSaving(null)
    }
  }

  const onDraft = handleSubmit((data) => submit(data, 'draft'))
  const onPublish = handleSubmit(async (data) => {
    const missing = [!data.categoryId && 'chọn danh mục', !data.thumbnail && 'tải ảnh đại diện'].filter(Boolean)

    if (missing.length > 0) {
      setToast({ message: `Vui lòng ${missing.join(' và ')} trước khi đăng bài`, type: 'error' })
      return
    }

    const res = await submit(data, 'published')
    await adminPublishPost(res?.data?.id as number)
  })

  const handlePreview = () => {
    const { title, content, slug, excerpt, thumbnail, categoryId } = getValues()

    if (!title?.trim()) {
      setToast({ message: 'Nhập tiêu đề để xem trước', type: 'error' })
      return
    }

    const categoryName = catsData?.data?.find(c => c.id === categoryId)?.name

    setPreviewPost({
      title: title || '',
      slug: slug || '',
      excerpt: excerpt || '',
      content: content || '',
      thumbnail,
      categoryName,
      authorName: post?.author?.name,
      publishedAt: post?.publishedAt,
      createdAt: post?.createdAt,
    })
  }

  const publicPreviewUrl = isEdit && post?.status === 'published' && slug ? `/tin-tuc/${slug}` : null

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <FormProvider {...methods}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <PostPreviewModal
        open={previewPost != null}
        data={previewPost as PostPreviewData}
        publicUrl={publicPreviewUrl}
        onClose={() => setPreviewPost(null)}
      />

      <form className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6 items-start">
        {/* ════════════════ LEFT / MAIN COLUMN ════════════════ */}
        <PostMainColumn post={post} handleImageUpload={handleImageUpload} />

        {/* ════════════════ RIGHT SIDEBAR ════════════════ */}
        <div className="xl:sticky xl:top-[1px] xl:self-start w-full">
          <div className="admin-card flex flex-col overflow-hidden max-h-[calc(100vh-3.5rem-3rem)]">

            <PanelPublish
              post={post}
              saving={saving}
              onDraft={onDraft}
              onPublish={onPublish}
              handlePreview={handlePreview}
            />

            <SidePanel title="Content AI" defaultOpen={false}>
              <p className="text-[12px] text-slate-500 py-1">Chưa tích hợp Content AI.</p>
            </SidePanel>

            <PanelCategories />

            <PanelThumbnail onToast={handleToast} />

            <PanelAiAgent />

            <PanelTags tags={tags} setTags={setTags} />
          </div>
        </div>
      </form>
    </FormProvider>
  )
}

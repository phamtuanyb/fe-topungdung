import { useMemo, useState } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import dynamic from 'next/dynamic'
import { Panel } from './SharedPanels'
import type { Post } from '@/types'
import { FormData } from './PostEditor'
import Input from '@/components/ui/Input'
import { cn, slugify } from '@/lib/utils'
import PanelOverview from './TabOverview'
import PanelAdvanced from './TabAdvanced'
import PanelSocial from './TabSocial'
import { adminGetUsers } from '@/lib/api/admin'
import useSWR from 'swr'

const RichTextEditor = dynamic(() => import('../editor/RichTextEditor'), { ssr: false })

const TABS = [
  { key: 'overview', label: 'Tổng quan' },
  { key: 'advanced', label: 'Nâng cao' },
  { key: 'social', label: 'Mạng xã hội' },
] as { key: RankTab; label: string }[]

type RankTab = 'overview' | 'advanced' | 'social'

type Props = {
  post?: Post
  handleImageUpload: (file: File) => Promise<string>
}

const PostMainColumn = ({ post, handleImageUpload }: Props) => {
  const { data } = useSWR('admin-users', adminGetUsers, {
    keepPreviousData: true,
    revalidateOnFocus: false,
    revalidateIfStale: false,
  })

  const { control, watch, formState: { errors }, ...form } = useFormContext<FormData>()
  const [rankTab, setRankTab] = useState<RankTab>('overview')

  const title = watch('title')
  const content = watch('content')

  const wordCount = useMemo(() => {
    if (!content) return 0
    const text = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    return text ? text.split(' ').filter(Boolean).length : 0
  }, [content])

  return (
    <div className="flex flex-col min-w-0 admin-card overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/60 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
          </svg>
        </div>
        <span className="text-sm font-semibold text-slate-800">Nội dung bài viết</span>
      </div>

      {/* Title input */}
      <div className="px-6 pt-5 pb-4 border-b border-slate-200">
        <Controller
          name='title'
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <Input
                type="text"
                placeholder="Thêm tiêu đề bài viết..."
                className="w-full text-2xl font-semibold text-slate-900 placeholder:text-slate-300 border-0 border-b-2 border-slate-200 focus:border-indigo-500 focus:outline-none py-2 bg-transparent transition-colors"
                {...field}
                onBlur={() => {
                  if (!post) {
                    form.setValue('slug', slugify(title), { shouldValidate: true })
                  }
                  field.onBlur()
                }}
              />

              {error && (
                <p className="text-xs text-red-500 mt-1">{error.message as string}</p>
              )}
            </>
          )}
        />
      </div>

      {/* Rich-text editor */}
      <div className="px-6 py-5 border-b border-slate-200">
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
              onImageUpload={handleImageUpload}
            />
          )}
        />
        {errors.content && (
          <p className="mt-1 text-xs text-red-500">{errors.content.message as string}</p>
        )}
        <p className="text-xs text-slate-500 mt-2">Số từ: {wordCount.toLocaleString('vi-VN')}</p>
      </div>

      {/* ── Basic SEO ───────────────────────────────── */}
      <Panel title="Basic SEO">
        {/* Tabs */}
        <div className="flex gap-1 p-1 mb-4 rounded-xl bg-slate-100">
          {TABS.map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setRankTab(tab.key)}
              className={cn("flex-1 text-xs font-medium px-3 py-2 rounded-lg transition-all", {
                "bg-white text-indigo-600 shadow-sm": rankTab === tab.key,
                "text-slate-500 hover:text-slate-700": rankTab !== tab.key,
              })}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tổng quan tab */}
        {rankTab === 'overview' && <PanelOverview />}
        {rankTab === 'advanced' && <PanelAdvanced />}
        {rankTab === 'social' && <PanelSocial />}
      </Panel>

      {/* ── Tóm tắt ─────────────────────────────────────── */}
      <Panel title="Tóm tắt">
        <Controller
          name='excerpt'
          control={control}
          render={({ field }) => (
            <textarea
              rows={4}
              placeholder="Mô tả ngắn gọn, sẽ tự động tạo từ nội dung nếu bạn không nhập tay. Tuy nhiên, bạn có thể điều chỉnh để kiểm soát cách nó hiển thị trên trang tìm kiếm và khi được chia sẻ."
              className="w-full border border-slate-200 rounded-xl text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 resize-y bg-white mt-1"
              {...field}
            />
          )}
        />
      </Panel>

      {/* ── Đường dẫn ───────────────────────────────────── */}
      <Panel title="Đường dẫn">
        <div className="mt-1">
          <Controller
            name='slug'
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                className="w-full border border-slate-200 rounded-xl text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-white mt-1"
                {...field}
              />
            )}
          />

          {errors.slug && (
            <p className="text-xs text-red-500 mt-1">{errors.slug.message as string}</p>
          )}
        </div>
      </Panel>

      {/* ── Tác giả ─────────────────────────────────────── */}
      <Panel title="Tác giả">
        <Controller
          name='authorId'
          control={control}
          render={({ field }) => (
            <select className="admin-select mt-1" {...field} value={field.value ?? ''}>
              <option value="">-- Chọn tác giả --</option>
              {data?.data?.map((item) => (
                <option key={item.id} value={item.id}>{item.fullName}</option>
              ))}
            </select>
          )}
        />
      </Panel>
    </div>
  )
}

export default PostMainColumn
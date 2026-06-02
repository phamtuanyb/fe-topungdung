'use client'

import { useEffect } from 'react'
import { formatDate } from '@/lib/utils'
import Button from '@/components/ui/Button'

export interface PostPreviewData {
  title: string
  slug: string
  excerpt?: string
  content: string
  thumbnail?: string | null
  categoryName?: string
  authorName?: string
  publishedAt?: string | null
  createdAt?: string
}

interface PostPreviewModalProps {
  open: boolean
  data: PostPreviewData
  publicUrl?: string | null
  onClose: () => void
}

export default function PostPreviewModal({ open, data, publicUrl, onClose }: PostPreviewModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const displayDate = data.publishedAt || data.createdAt

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 overflow-y-auto h-screen !m-0">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} aria-hidden />

      <div className="relative z-10 w-full max-w-3xl my-auto animate-in zoom-in-95 fade-in duration-200">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-200 bg-slate-50">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Xem trước bài viết</h2>
              <p className="text-xs text-slate-500 mt-0.5">Hiển thị theo nội dung đang soạn</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {publicUrl && (
                <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                  <Button type="button" variant="outline" size="sm">
                    Mở trang công khai
                  </Button>
                </a>
              )}
              <Button type="button" variant="secondary" size="sm" onClick={onClose}>
                Đóng
              </Button>
            </div>
          </div>

          <div className="px-6 py-8 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <article>
              <header className="mb-8">
                {data.categoryName && (
                  <span className="inline-block mb-3 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                    {data.categoryName}
                  </span>
                )}
                <h1 className="text-2xl md:text-4xl font-bold text-slate-900 leading-snug mb-4">
                  {data.title || 'Chưa có tiêu đề'}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  {data.authorName && (
                    <span>
                      Tác giả: <span className="font-medium text-slate-700">{data.authorName}</span>
                    </span>
                  )}
                  {displayDate && <span>{formatDate(displayDate)}</span>}
                </div>
                {data.excerpt && (
                  <p className="mt-4 text-slate-600 leading-relaxed">{data.excerpt}</p>
                )}
              </header>

              {data.thumbnail && (
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-8 border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={data.thumbnail} alt={data.title} className="w-full h-full object-cover" />
                </div>
              )}

              {data.content ? (
                <div
                  className="prose prose-slate max-w-none"
                  dangerouslySetInnerHTML={{ __html: data.content }}
                />
              ) : (
                <p className="text-slate-400 italic">Chưa có nội dung.</p>
              )}
            </article>
          </div>
        </div>
      </div>
    </div>
  )
}

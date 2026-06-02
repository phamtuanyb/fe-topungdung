'use client'

import Link from 'next/link'
import useSWR from 'swr'
import { adminGetPost } from '@/lib/api/admin'
import PostEditor from '@/components/admin/post-editor/PostEditor'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminSectionCard from '@/components/admin/AdminSectionCard'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const statusConfig = {
  published: { label: 'Đã đăng', cls: 'badge badge-green' },
  draft: { label: 'Nháp', cls: 'badge badge-yellow' },
  archived: { label: 'Lưu trữ', cls: 'badge badge-gray' },
} as const

interface Props {
  params: { id: string }
}

export default function AdminPostEditPage({ params }: Props) {
  const id = parseInt(params.id)
  const { data, isLoading, error } = useSWR(['admin-post', id], () => adminGetPost(id), {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    keepPreviousData: true,
  })
  const post = data?.data
  const status = post?.status ? statusConfig[post.status] : null

  if (isLoading) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          backHref="/admin/posts"
          title="Sửa bài viết"
          description="Đang tải..."
        />
        <AdminSectionCard bodyClassName="py-16">
          <LoadingSpinner text="Đang tải bài viết..." />
        </AdminSectionCard>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="space-y-6">
        <AdminPageHeader backHref="/admin/posts" title="Sửa bài viết" />
        <AdminSectionCard>
          <div className="py-8 text-center space-y-4">
            <p className="text-red-600 font-medium">Không tìm thấy bài viết.</p>
            <Link href="/admin/posts">
              <Button variant="secondary" size="sm">Quay lại danh sách</Button>
            </Link>
          </div>
        </AdminSectionCard>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        backHref="/admin/posts"
        title="Sửa bài viết"
        description={post.title}
      >
        {status && <span className={status.cls}>{status.label}</span>}
        {post.status === 'published' && post.slug && (
          <Link href={`/tin-tuc/${post.slug}`} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              Xem trên site
            </Button>
          </Link>
        )}
      </AdminPageHeader>

      <PostEditor post={post} />
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import useSWR from 'swr'
import PostCard from '@/components/public/PostCard'
import Pagination from '@/components/ui/Pagination'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'
import { getCategoryPosts } from '@/lib/api/public'
import type { Post } from '@/types'

const LIMIT = 9

interface CategoryPostsListProps {
  slug: string
}

export default function CategoryPostsList({ slug }: CategoryPostsListProps) {
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [slug])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page])

  const { data: postsData, isLoading } = useSWR(
    ['category-posts', slug, page],
    () => getCategoryPosts(slug, { page, limit: LIMIT }),
    { keepPreviousData: true }
  )

  const posts: Post[] = postsData?.data ?? []
  const totalPages = postsData?.totalPages ?? 1

  if (isLoading) return <LoadingSpinner className="py-20" text="Đang tải bài viết..." />

  if (posts.length === 0) {
    return (
      <EmptyState
        title="Chưa có bài viết nào"
        description="Danh mục này chưa có bài viết nào được đăng."
      />
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  )
}

import Link from 'next/link'
import Image from 'next/image'
import type { Post } from '@/types'
import { formatDate, truncate } from '@/lib/utils'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="group flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/tin-tuc/${post.slug}`} className="block aspect-[16/9] bg-gray-100 relative overflow-hidden">
        {post.thumbnail ? (
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </Link>

      <div className="flex flex-col flex-1 p-4 gap-2">
        {post.category && (
          <Link
            href={`/category/${post.category.slug}`}
            className="text-xs font-semibold text-blue-600 uppercase tracking-wide hover:underline w-fit"
          >
            {post.category.name}
          </Link>
        )}

        <Link href={`/tin-tuc/${post.slug}`}>
          <h2 className="font-semibold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>

        {post.excerpt && (
          <p className="text-sm text-gray-500 line-clamp-2">{truncate(post.excerpt, 120)}</p>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-xs text-gray-400">
            {formatDate(post.publishedAt || post.createdAt)}
          </span>
          <Link
            href={`/tin-tuc/${post.slug}`}
            className="text-xs font-medium text-blue-600 hover:underline"
          >
            Đọc tiếp →
          </Link>
        </div>
      </div>
    </article>
  )
}

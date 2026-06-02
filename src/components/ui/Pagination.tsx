'use client'

import { getVisiblePages } from '@/lib/pagination';
import { cn } from '@/lib/utils';

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
  /** `news` matches the public tin tức page styling */
  variant?: 'default' | 'news'
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
  variant = 'default',
}: PaginationProps) {
  if (totalPages <= 1) return null

  const visiblePages = getVisiblePages(page, totalPages)
  const isNews = variant === 'news'

  const navBtn = cn(
    'flex items-center justify-center rounded-md border text-sm font-semibold transition-all duration-150 disabled:opacity-35 disabled:cursor-not-allowed',
    isNews
      ? 'w-9 h-9 border-gray-200 bg-white text-gray-500 hover:border-[#1E5BC6] hover:text-[#1E5BC6] disabled:text-gray-400'
      : 'px-3 py-1.5 disabled:opacity-40 hover:bg-gray-50'
  )

  const pageBtn = (active: boolean) =>
    cn(
      'flex items-center justify-center rounded-md border text-sm font-semibold transition-all duration-150',
      isNews
        ? cn(
            'w-9 h-9',
            active
              ? 'bg-[#1E5BC6] border-[#1E5BC6] text-white'
              : 'bg-white border-gray-200 text-gray-500 hover:border-[#1E5BC6] hover:text-[#1E5BC6]'
          )
        : cn(
            'px-3 py-1.5',
            active ? 'bg-blue-600 border-blue-600 text-white' : 'hover:bg-gray-50'
          )
    )

  return (
    <nav
      className={cn(
        'flex items-center justify-center gap-1.5',
        isNews ? 'mt-11' : 'gap-1',
        className
      )}
      aria-label="Phân trang"
    >
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className={navBtn}
        aria-label="Trang trước"
      >
        {isNews ? '‹' : '← Trước'}
      </button>

      {visiblePages.map((p, index) =>
        p === 'ellipsis' ? (
          <span
            key={`ellipsis-${index}`}
            className={cn('text-gray-400', isNews ? 'px-1' : 'px-2')}
            aria-hidden
          >
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={pageBtn(p === page)}
            aria-label={`Trang ${p}`}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className={navBtn}
        aria-label="Trang sau"
      >
        {isNews ? '›' : 'Tiếp →'}
      </button>
    </nav>
  )
}

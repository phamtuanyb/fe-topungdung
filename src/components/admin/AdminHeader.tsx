'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Map pathname → breadcrumb label
const labelMap: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/posts': 'Bài viết',
  '/admin/posts/create': 'Viết bài mới',
  '/admin/categories': 'Danh mục',
  '/admin/categories/create': 'Thêm danh mục',
  '/admin/media': 'Media',
  '/admin/menus': 'Menu',
  '/admin/menus/create': 'Tạo menu',
  '/admin/users': 'Người dùng',
  '/admin/users/create': 'Thêm người dùng',
}

export default function AdminHeader() {
  const pathname = usePathname()

  // Build breadcrumbs
  const segments = pathname.split('/').filter(Boolean)
  const crumbs: { label: string; href: string }[] = []
  let path = ''
  for (const seg of segments) {
    path += `/${seg}`
    const label = labelMap[path] ?? (
      seg === 'edit' ? 'Sửa'
      : !isNaN(Number(seg)) ? `#${seg}`
      : seg.charAt(0).toUpperCase() + seg.slice(1)
    )
    crumbs.push({ label, href: path })
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 gap-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm min-w-0">
        {crumbs.map((crumb, i) => (
          <span key={crumb.href} className="flex items-center gap-1 min-w-0">
            {i > 0 && (
              <svg className="h-3.5 w-3.5 shrink-0 text-slate-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
            )}
            {i === crumbs.length - 1 ? (
              <span className="font-semibold text-slate-800 truncate">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="text-slate-400 hover:text-slate-600 transition-colors truncate">
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-3 shrink-0">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
          Xem trang chủ
        </Link>

        {/* Avatar placeholder */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-bold shadow-sm">
          A
        </div>
      </div>
    </header>
  )
}

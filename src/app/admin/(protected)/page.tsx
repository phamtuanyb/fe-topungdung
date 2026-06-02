'use client'

import Link from 'next/link'
import useSWR from 'swr'
import { adminGetPosts, adminGetCategories, adminGetUsers, adminGetMedia, adminGetContacts } from '@/lib/api/admin'

export default function AdminDashboardPage() {
  const { data: postsData } = useSWR('admin-posts-count', () => adminGetPosts({ limit: 1 }))
  const { data: catsData } = useSWR('admin-cats', adminGetCategories)
  const { data: usersData } = useSWR('admin-users-count', adminGetUsers)
  const { data: mediaData } = useSWR(['admin-media'], () => adminGetMedia({ limit: 1 }))
  const { data: contactsData } = useSWR('admin-contacts-count', () => adminGetContacts({ limit: 1 }))
  const totalPosts = postsData?.total ?? null
  const totalCategories = catsData?.data?.length ?? null
  const totalUsers = usersData?.data?.length ?? null
  const totalMedia = mediaData?.total ?? null
  const totalContacts = contactsData?.total ?? null

  const stats = [
    {
      label: 'Tổng bài viết',
      value: totalPosts,
      href: '/admin/posts',
      gradient: 'from-indigo-500 to-indigo-600',
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
      // change: '+12% tháng này',
    },
    {
      label: 'Danh mục',
      value: totalCategories,
      href: '/admin/categories',
      gradient: 'from-violet-500 to-violet-600',
      bg: 'bg-violet-50',
      text: 'text-violet-600',
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
        </svg>
      ),
      change: 'Đang quản lý',
    },
    {
      label: 'Người dùng',
      value: totalUsers,
      href: '/admin/users',
      gradient: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
      change: 'Tài khoản hệ thống',
    },
    {
      label: 'Media',
      value: totalMedia,
      href: '/admin/media',
      gradient: 'from-amber-500 to-amber-600',
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      ),
      change: 'Thư viện ảnh',
    },
    {
      label: 'Liên hệ',
      value: totalContacts,
      href: '/admin/contacts',
      gradient: 'from-rose-500 to-rose-600',
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      icon: (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      ),
      change: 'Yêu cầu tư vấn',
    },
  ]

  const quickActions = [
    {
      label: 'Viết bài mới',
      href: '/admin/posts/create',
      gradient: 'bg-indigo-600 hover:bg-indigo-700',
      icon: '✏️',
    },
    {
      label: 'Thêm danh mục',
      href: '/admin/categories/create',
      gradient: 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700',
      icon: '🏷️',
    },
    {
      label: 'Thêm người dùng',
      href: '/admin/users/create',
      gradient: 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700',
      icon: '👤',
    },
    {
      label: 'Quản lý media',
      href: '/admin/media',
      gradient: 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700',
      icon: '🖼️',
    },
    {
      label: 'Quản lý menu',
      href: '/admin/menus',
      gradient: 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700',
      icon: '☰',
    },
  ]

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Chào mừng trở lại 👋</h1>
        <p className="mt-1 text-sm text-slate-500">Đây là tổng quan hệ thống của bạn hôm nay.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.bg} ${stat.text}`}>
                {stat.icon}
              </div>
              <svg className="h-4 w-4 text-slate-300 group-hover:text-slate-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-slate-900">
                {stat.value === null ? (
                  <span className="inline-block h-8 w-16 rounded-lg bg-slate-100 animate-pulse" />
                ) : (
                  stat.value
                )}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-600">{stat.label}</p>
              <p className="mt-1 text-xs text-slate-400">{stat.change}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Thao tác nhanh</h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-150 ${action.gradient} ${action.gradient.includes('indigo') ? 'text-white shadow-sm shadow-indigo-200' : ''}`}
            >
              <span>{action.icon}</span>
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
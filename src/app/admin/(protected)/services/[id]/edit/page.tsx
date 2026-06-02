'use client'

import useSWR from 'swr'
import { adminGetPost } from '@/lib/api/admin'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ProductEditor from '@/components/admin/product-editor/ProductEditor'

export default function AdminServiceEditPage({ params }: { params: { id: string } }) {
  const postId = parseInt(params.id, 10)
  const { data, isLoading, error } = useSWR(
    Number.isFinite(postId) ? ['admin-post', postId] : null,
    () => adminGetPost(postId)
  )

  if (isLoading) {
    return <div className="py-20 flex justify-center"><LoadingSpinner /></div>
  }

  if (error || !data?.data) {
    return <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">Không tìm thấy dịch vụ.</div>
  }

  return <ProductEditor post={data.data} categorySlug="services" listHref="/admin/services" publicSlugPrefix="dich-vu" />
}

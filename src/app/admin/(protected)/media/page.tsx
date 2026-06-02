'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { adminGetMedia, adminDeleteMedia } from '@/lib/api/admin'
import { getErrorMessage } from '@/lib/error'
import type { Media } from '@/types'
import Button from '@/components/ui/Button'
import Toast from '@/components/ui/Toast'
import Modal from '@/components/ui/Modal'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'
import Pagination from '@/components/ui/Pagination'
import MediaUploadModal from '@/components/admin/MediaUploadModal'
import Image from 'next/image'

const LIMIT = 20

export default function AdminMediaPage() {
  const [page, setPage] = useState(1)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const { data, isLoading, mutate } = useSWR(
    ['admin-media', page],
    () => adminGetMedia({ page, limit: LIMIT }),
    { keepPreviousData: true }
  )

  const media: Media[] = data?.data ?? []
  const totalPages = data?.totalPages ?? 1

  async function handleDelete(id: number) {
    setDeleting(true)
    try {
      await adminDeleteMedia(id)
      setToast({ message: 'Đã xóa ảnh', type: 'success' })
      mutate()
    } catch (err) {
      setToast({ message: getErrorMessage(err) || 'Xóa thất bại', type: 'error' })
    } finally {
      setDeleting(false)
      setConfirmDeleteId(null)
    }
  }

  async function copyUrl(url: string) {
    await navigator.clipboard.writeText(url)
    setToast({ message: 'Đã copy URL ảnh', type: 'success' })
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setPreview(null)}>
          <Image height={100} width={100} src={preview} alt="Preview" className="h-full w-full max-h-[80vh] max-w-[90vw] rounded-xl shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {showUploadModal && (
        <MediaUploadModal
          onSuccess={() => { mutate(); setToast({ message: 'Upload thành công', type: 'success' }) }}
          onClose={() => setShowUploadModal(false)}
        />
      )}

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Media</h1>
        <Button type="button" onClick={() => setShowUploadModal(true)}>
          + Upload ảnh
        </Button>
      </div>

      {isLoading ? (
        <LoadingSpinner className="py-20" text="Đang tải media..." />
      ) : media.length === 0 ? (
        <EmptyState title="Chưa có ảnh nào" description="Upload ảnh đầu tiên của bạn" />
      ) : (
        <>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 gap-4 mb-8">
            {media.map((item) => (
              <div key={item.id} className="group relative rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm aspect-square">
                <Image
                  height={100}
                  width={100}
                  src={item.url}
                  alt={item.filename}
                  className="h-full w-full object-cover cursor-pointer"
                  onClick={() => setPreview(item.url)}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-end">
                  <div className="w-full p-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                    <div className="flex gap-1">
                      <button
                        onClick={() => setPreview(item.url)}
                        className="flex-1 rounded bg-white/90 py-1 text-xs font-medium text-gray-800 hover:bg-white"
                      >
                        Xem
                      </button>
                      <button
                        onClick={() => copyUrl(item.url)}
                        className="flex-1 rounded bg-blue-600/90 py-1 text-xs font-medium text-white hover:bg-blue-600"
                      >
                        Copy URL
                      </button>
                    </div>
                    <button
                      onClick={() => setConfirmDeleteId(item.id)}
                      className="w-full rounded bg-red-500/90 py-1 text-xs font-medium text-white hover:bg-red-500"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
                {/* File info */}
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs bg-black/60 text-white px-1 rounded">
                    {item.mimeType?.split('/')[1]?.toUpperCase() ?? 'IMG'}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <Modal
        open={confirmDeleteId !== null}
        title="Xóa ảnh"
        description="Bạn có chắc muốn xóa ảnh này? File vật lý cũng sẽ bị xóa và không thể khôi phục."
        confirmText="Xóa"
        confirmVariant="danger"
        loading={deleting}
        onConfirm={() => confirmDeleteId !== null && handleDelete(confirmDeleteId)}
        onClose={() => setConfirmDeleteId(null)}
      />
    </div>
  )
}

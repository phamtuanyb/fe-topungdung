import { useState } from 'react'
import { SidePanel } from './SharedPanels'
import { adminUploadMedia } from '@/lib/api/admin'
import { getErrorMessage } from '@/lib/error'
import { useFormContext, useController } from 'react-hook-form'
import { FormData } from './PostEditor'
import Image from 'next/image'

type PanelThumbnailProps = {
  onToast: (msg: string, type: 'success' | 'error') => void
}

const PanelThumbnail = ({ onToast }: PanelThumbnailProps) => {
  const { control } = useFormContext<FormData>()
  const { field } = useController({ name: 'thumbnail', control })

  const thumbnail = field.value as string | null

  const [thumbnailUploading, setThumbnailUploading] = useState(false)

  async function handleThumbnailUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      onToast('Chỉ cho phép upload file ảnh', 'error')
      return
    }
    setThumbnailUploading(true)
    try {
      const res = await adminUploadMedia(file)
      field.onChange(res.data.url)
    } catch (err) {
      onToast(getErrorMessage(err), 'error')
    } finally {
      setThumbnailUploading(false)
    }
  }

  return (
    <SidePanel title="Ảnh đại diện">
      <div className="mt-1">
        {thumbnail && (
          <div className="relative mb-2">
            <Image
              width={100}
              height={100}
              src={thumbnail}
              alt="Thumbnail"
              className="w-full aspect-video object-cover rounded-xl border border-slate-200"
            />
            <button
              type="button"
              onClick={() => field.onChange(null)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        )}
        <label
          className={`block text-center text-[12px] text-indigo-600 hover:underline cursor-pointer ${thumbnailUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleThumbnailUpload}
            disabled={thumbnailUploading}
            value={''}
          />
          {thumbnailUploading ? 'Đang upload...' : thumbnail ? 'Đổi ảnh đại diện' : 'Đặt ảnh đại diện'}
        </label>
        {thumbnail && (
          <button
            type="button"
            onClick={() => field.onChange(null)}
            className="block w-full text-center text-[12px] text-red-500 hover:underline mt-1"
          >
            Xóa ảnh đại diện
          </button>
        )}
      </div>
    </SidePanel>
  )
}

export default PanelThumbnail
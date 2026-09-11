'use client'

import { useRef, useState } from 'react'
import { adminUploadMedia, adminImportMediaFromUrl } from '@/lib/api/admin'
import type { Media } from '@/types'

interface Props {
  onSuccess: (media: Media) => void
  onClose: () => void
}

type Mode = 'file' | 'url'

const inputCls = 'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400'

export default function MediaUploadModal({ onSuccess, onClose }: Props) {
  const [mode, setMode] = useState<Mode>('file')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)
  const [urlInput, setUrlInput] = useState('')
  const [altText, setAltText] = useState('')
  const [caption, setCaption] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const hasMedia = mode === 'file' ? !!selectedFile : !!urlInput.trim()
  const canSave = hasMedia && !!altText.trim() && !saving

  function handleFileSelect(file: File) {
    setSelectedFile(file)
    setPreviewSrc(URL.createObjectURL(file))
    setError('')
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file)
    } else {
      setError('Vui lòng kéo thả file ảnh (JPG, PNG, WebP, GIF...)')
    }
  }

  function handleUrlChange(v: string) {
    setUrlInput(v)
    if (v.startsWith('http')) setPreviewSrc(v)
    else setPreviewSrc(null)
    setError('')
  }

  async function handleSave() {
    if (!canSave) return
    setSaving(true)
    setError('')
    try {
      let res: { data?: Media } & Record<string, unknown>
      if (mode === 'file' && selectedFile) {
        res = await adminUploadMedia(selectedFile, { altText, caption }) as typeof res
      } else {
        res = await adminImportMediaFromUrl(urlInput.trim(), { altText, caption }) as typeof res
      }
      const media = (res.data ?? res) as Media
      onSuccess(media)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại, thử lại.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl bg-white shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <h2 className="text-sm font-semibold text-slate-900">Upload ảnh mới</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Mode toggle */}
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
            {(['file', 'url'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setPreviewSrc(null); setSelectedFile(null); setUrlInput(''); setError('') }}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
                  mode === m ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {m === 'file' ? '📁 Chọn file' : '🔗 Dán URL'}
              </button>
            ))}
          </div>

          {/* File mode */}
          {mode === 'file' && (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer transition-colors min-h-[160px]
                ${dragging ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}
                ${previewSrc ? 'border-indigo-300' : ''}`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); e.target.value = '' }}
              />
              {previewSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewSrc} alt="Preview" className="max-h-36 max-w-full object-contain rounded-lg" />
              ) : (
                <>
                  <svg className="h-10 w-10 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  <p className="text-sm text-slate-500">Kéo & thả ảnh vào đây</p>
                  <p className="text-xs text-slate-400">hoặc click để chọn file (JPG, PNG, WebP, GIF)</p>
                </>
              )}
              {previewSrc && (
                <p className="text-xs text-slate-400 mt-1">{selectedFile?.name}</p>
              )}
            </div>
          )}

          {/* URL mode */}
          {mode === 'url' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">URL ảnh</label>
                <input
                  value={urlInput}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className={inputCls}
                  placeholder="https://example.com/image.jpg"
                  autoFocus
                />
                <p className="text-xs text-slate-400 mt-1">Server sẽ tải ảnh về và chuyển sang WebP</p>
              </div>
              {previewSrc && (
                <div className="flex justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewSrc} alt="Preview" className="max-h-36 max-w-full object-contain rounded-lg border border-slate-200" onError={() => setPreviewSrc(null)} />
                </div>
              )}
            </div>
          )}

          {/* Metadata */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Alt text (mô tả ảnh)<span className="text-red-500 ml-0.5">*</span>
            </label>
            <input
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className={`${inputCls} ${hasMedia && !altText.trim() ? 'border-red-300 focus:ring-red-400' : ''}`}
              placeholder='VD: "Logo TopỨngDụng nền tối"'
            />
            <p className="text-xs text-slate-400 mt-1">Mô tả nội dung ảnh cho SEO và người khiếm thị. BẮT BUỘC điền.</p>
            {hasMedia && !altText.trim() && (
              <p className="text-xs text-red-500 mt-0.5">Vui lòng nhập alt text trước khi lưu</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Chú thích ảnh</label>
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className={inputCls}
              placeholder="Chú thích hiển thị bên dưới ảnh (tuỳ chọn)"
            />
            <p className="text-xs text-slate-400 mt-1">Khác với alt text — caption là giải thích bổ sung cho người đọc.</p>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-slate-100 shrink-0">
          <button onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            title={!altText.trim() ? 'Vui lòng nhập alt text' : ''}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40 transition-colors"
          >
            {saving ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </div>
    </div>
  )
}

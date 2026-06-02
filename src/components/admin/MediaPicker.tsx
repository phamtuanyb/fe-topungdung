'use client'

import { useRef, useState } from 'react'
import { adminImportMediaFromUrl, adminUploadMedia } from '@/lib/api/admin'

export interface MediaValue {
  src: string
  alt?: string
  caption?: string
}

interface MediaPickerProps {
  value: MediaValue
  onChange: (v: MediaValue) => void
  /** Hide alt/caption fields (use when caller only needs URL) */
  minimal?: boolean
}

const inputCls =
  'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400'

export default function MediaPicker({ value, onChange, minimal = false }: MediaPickerProps) {
  const [busy, setBusy] = useState<'upload' | 'import' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [urlInput, setUrlInput] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function set(patch: Partial<MediaValue>) {
    onChange({ ...value, ...patch })
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy('upload')
    setError(null)
    try {
      const res = await adminUploadMedia(file, { altText: value.alt, caption: value.caption })
      set({ src: res.data.url })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload thất bại')
    } finally {
      setBusy(null)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function handleImportUrl() {
    if (!urlInput.trim()) return
    setBusy('import')
    setError(null)
    try {
      const res = await adminImportMediaFromUrl(urlInput.trim(), {
        altText: value.alt,
        caption: value.caption,
      })
      set({ src: res.data.url })
      setUrlInput('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import thất bại')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="space-y-2 rounded-xl border border-slate-200 p-3 bg-slate-50/50">
      <div className="flex gap-3">
        <div className="w-28 h-20 rounded-lg overflow-hidden bg-white border border-slate-200 shrink-0">
          {value.src ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={value.src} alt={value.alt ?? ''} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
              Chưa có ảnh
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2 min-w-0">
          <input
            value={value.src}
            onChange={(e) => set({ src: e.target.value })}
            placeholder="URL ảnh hoặc paste link..."
            className={inputCls}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={busy !== null}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
            >
              📤 {busy === 'upload' ? 'Đang tải...' : 'Tải từ máy'}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex gap-1 flex-1 min-w-[180px]">
              <input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Lấy từ URL bên ngoài..."
                className={`${inputCls} flex-1`}
              />
              <button
                type="button"
                onClick={handleImportUrl}
                disabled={busy !== null || !urlInput.trim()}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {busy === 'import' ? '...' : '🔗 Lấy'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {!minimal && (
        <div className="grid grid-cols-2 gap-2">
          <input
            value={value.alt ?? ''}
            onChange={(e) => set({ alt: e.target.value })}
            placeholder="Alt text (mô tả SEO)"
            className={inputCls}
          />
          <input
            value={value.caption ?? ''}
            onChange={(e) => set({ caption: e.target.value })}
            placeholder="Caption / chú thích"
            className={inputCls}
          />
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}

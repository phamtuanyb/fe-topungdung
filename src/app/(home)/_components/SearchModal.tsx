'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getCategories, searchPosts } from '@/lib/api/public'
import type { Post } from '@/types'
import type { TudAppMeta } from '@/types/tud'
import { collectCategoryIds } from '@/lib/category-tree'
import ModalPortal from './ModalPortal'

function meta(p: Post): TudAppMeta {
  const cfg = p.productPageConfig as unknown as { app?: TudAppMeta } | null | undefined
  return cfg?.app ?? {}
}

/**
 * Ô tìm kiếm toàn site: gõ tới đâu ra kết quả tới đó, tách hai nhóm
 * "Ứng dụng" (đi /app/<slug>) và "Bài viết" (đi /tin-tuc/<slug>).
 */
export default function SearchModal({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState('')
  const [apps, setApps] = useState<Post[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Danh mục ứng dụng, để tách kết quả thành hai nhóm
  const [appCatIds, setAppCatIds] = useState<Set<number>>(new Set())
  useEffect(() => {
    getCategories()
      .then((r) => {
        const all = r.data ?? []
        setAppCatIds(collectCategoryIds(all, 'ung-dung'))
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    inputRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const run = useCallback(
    async (term: string) => {
      const t = term.trim()
      if (t.length < 2) {
        setApps([])
        setPosts([])
        setSearched(false)
        return
      }
      setLoading(true)
      try {
        const r = await searchPosts(t, 24)
        const all = r.data ?? []
        const isApp = (p: Post) => appCatIds.has(p.category?.id ?? p.categoryId ?? -1)
        setApps(all.filter(isApp))
        // Bài của Vsoftware cũ không còn trang công khai nên không đưa vào kết quả
        setPosts(all.filter((p) => !isApp(p) && !['services', 'ai-agent'].includes(p.category?.slug ?? '')))
        setSearched(true)
      } catch {
        setApps([])
        setPosts([])
        setSearched(true)
      } finally {
        setLoading(false)
      }
    },
    [appCatIds],
  )

  // Chờ 250ms sau khi ngừng gõ mới gọi API
  useEffect(() => {
    const id = setTimeout(() => run(q), 250)
    return () => clearTimeout(id)
  }, [q, run])

  const total = apps.length + posts.length

  return (
    <ModalPortal>
      <div className="tud-modal-bg" onClick={onClose}>
      <div className="tud-modal search-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && q.trim().length >= 2) {
                window.location.href = `/tim-kiem?q=${encodeURIComponent(q.trim())}`
              }
            }}
            placeholder="Tìm ứng dụng hoặc bài viết…"
            aria-label="Tìm kiếm"
          />
          <button className="tud-modal-x" onClick={onClose} aria-label="Đóng">
            ✕
          </button>
        </div>

        <div className="search-body">
          {q.trim().length < 2 ? (
            <p className="search-hint">Gõ ít nhất 2 ký tự để tìm. Nhấn Esc để đóng.</p>
          ) : loading ? (
            <p className="search-hint">Đang tìm…</p>
          ) : total === 0 && searched ? (
            <p className="search-hint">
              Không tìm thấy gì cho “{q.trim()}”. Thử từ khoá ngắn hơn, hoặc{' '}
              <a href="/ungdung">duyệt theo nhóm nhu cầu</a>.
            </p>
          ) : (
            <>
              {apps.length > 0 && (
                <div className="search-group">
                  <div className="search-group-title">Ứng dụng ({apps.length})</div>
                  {apps.map((p) => {
                    const m = meta(p)
                    return (
                      <a className="search-item" href={`/app/${p.slug}`} key={p.id}>
                        {p.logoUrl ? (
                          <div className="app-logo search-logo">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.logoUrl} alt={p.title}  width={68} height={68} loading="lazy" decoding="async"/>
                          </div>
                        ) : (
                          <div
                            className="app-logo search-logo"
                            style={m.logoBg ? { background: m.logoBg, color: '#07101F' } : undefined}
                          >
                            {m.logoText || p.title.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="search-text">
                          <b>{p.title}</b>
                          <span>{m.kind || p.category?.name}</span>
                        </div>
                        {m.score ? <span className="search-score">{m.score}</span> : null}
                      </a>
                    )
                  })}
                </div>
              )}

              {posts.length > 0 && (
                <div className="search-group">
                  <div className="search-group-title">Bài viết ({posts.length})</div>
                  {posts.map((p) => (
                    <a className="search-item" href={`/tin-tuc/${p.slug}`} key={p.id}>
                      <div className="app-logo search-logo search-logo-doc">📄</div>
                      <div className="search-text">
                        <b>{p.title}</b>
                        <span>{p.category?.name}</span>
                      </div>
                    </a>
                  ))}
                </div>
              )}

              {total > 0 && (
                <a className="search-all" href={`/tim-kiem?q=${encodeURIComponent(q.trim())}`}>
                  Xem trang kết quả đầy đủ →
                </a>
              )}
            </>
          )}
        </div>
      </div>
      </div>
    </ModalPortal>
  )
}
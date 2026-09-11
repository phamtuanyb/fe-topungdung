'use client'

import { useEffect, useState } from 'react'
import type { TocItem } from '../_lib/article'

/** Thanh tiến độ đọc chạy ngang trên đỉnh trang. */
export function ReadingProgress() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    function onScroll() {
      const el = document.documentElement
      const max = el.scrollHeight - el.clientHeight
      setPct(max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="read-progress" aria-hidden="true">
      <div className="read-progress-bar" style={{ width: `${pct}%` }} />
    </div>
  )
}

/** Mục lục dính bên phải, tự tô sáng mục đang đọc. */
export function TableOfContents({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string>(items[0]?.id ?? '')

  useEffect(() => {
    if (!items.length) return
    const headings = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => !!el)
    if (!headings.length) return

    function onScroll() {
      // Mục đang đọc = heading cuối cùng đã đi qua mốc 140px từ đỉnh
      let current = headings[0].id
      for (const h of headings) {
        if (h.getBoundingClientRect().top <= 140) current = h.id
        else break
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [items])

  if (items.length < 2) return null

  return (
    <nav className="toc" aria-label="Mục lục">
      <div className="toc-title">Nội dung bài viết</div>
      <ul>
        {items.map((it) => (
          <li key={it.id} className={`lv${it.level}${active === it.id ? ' on' : ''}`}>
            <a
              href={`#${it.id}`}
              onClick={(e) => {
                e.preventDefault()
                const el = document.getElementById(it.id)
                if (!el) return
                // Trừ chiều cao thanh điều hướng dính
                const y = el.getBoundingClientRect().top + window.scrollY - 96
                window.scrollTo({ top: y, behavior: 'smooth' })
                history.replaceState(null, '', `#${it.id}`)
              }}
            >
              {it.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/** Nút chia sẻ: Facebook, X, và sao chép liên kết. */
export function ShareBar({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)
  const [url, setUrl] = useState('')

  useEffect(() => setUrl(window.location.href), [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(url || window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  const enc = encodeURIComponent(url)
  const encT = encodeURIComponent(title)

  return (
    <div className="share">
      <span className="share-label">Chia sẻ</span>
      <a
        className="share-btn"
        href={`https://www.facebook.com/sharer/sharer.php?u=${enc}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chia sẻ lên Facebook"
      >
        Facebook
      </a>
      <a
        className="share-btn"
        href={`https://twitter.com/intent/tweet?url=${enc}&text=${encT}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chia sẻ lên X"
      >
        X
      </a>
      <button className="share-btn" onClick={copy} type="button">
        {copied ? '✓ Đã chép' : 'Chép liên kết'}
      </button>
    </div>
  )
}

/** Nút quay lên đầu trang, chỉ hiện khi đã cuộn sâu. */
export function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    function onScroll() {
      setShow(window.scrollY > 800)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!show) return null

  return (
    <button
      className="to-top"
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Lên đầu trang"
    >
      ↑
    </button>
  )
}

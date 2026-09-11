'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export interface RelatedItem {
  id: number
  href: string
  title: string
  excerpt: string
  /** Đường vẽ SVG của biểu tượng, tính sẵn ở phía máy chủ. */
  d: string[]
}

/**
 * Dải "Prompt khác cùng nhóm": các thẻ nằm ngang, cuộn bằng hai nút tròn.
 *
 * Cuộn thật bằng `overflow-x` chứ không dịch chuyển bằng biến đổi hình học, nên
 * khi không có JavaScript người dùng vẫn vuốt ngang xem được hết thẻ; hai nút
 * chỉ là lối tắt cho chuột. Trạng thái bật/tắt của nút bám theo vị trí cuộn
 * thật, kể cả khi người dùng tự vuốt.
 */
export default function PromptRelated({ items }: { items: RelatedItem[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [dau, setDau] = useState(true)
  const [cuoi, setCuoi] = useState(false)

  const doVien = useCallback(() => {
    const el = ref.current
    if (!el) return
    // Trừ hao 2px: bề rộng cuộn là số lẻ nên phép so bằng hay hụt một chút.
    setDau(el.scrollLeft <= 2)
    setCuoi(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2)
  }, [])

  useEffect(() => {
    doVien()
    window.addEventListener('resize', doVien)
    return () => window.removeEventListener('resize', doVien)
  }, [doVien])

  function truot(huong: number) {
    const el = ref.current
    if (!el) return
    el.scrollBy({ left: huong * el.clientWidth * 0.85, behavior: 'smooth' })
  }

  return (
    <>
      <div className="pr-rel-head">
        <h2 className="h2-blue">
          Prompt khác <span className="h2-accent-warm">cùng nhóm</span>
        </h2>
        <div className="pr-rel-nav">
          <button type="button" onClick={() => truot(-1)} disabled={dau} aria-label="Xem các prompt trước">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button type="button" onClick={() => truot(1)} disabled={cuoi} aria-label="Xem các prompt tiếp theo">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="pr-rel" ref={ref} onScroll={doVien}>
        {items.map((p) => (
          <a className="prompt-new-card ngang" href={p.href} key={p.id}>
            <span className="prompt-ico" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                {p.d.map((d, i) => (
                  <path d={d} key={i} />
                ))}
              </svg>
            </span>
            <span className="prompt-new-body">
              <b>{p.title}</b>
              <span className="prompt-new-desc">{p.excerpt}</span>
              <span className="prompt-new-go">
                Xem prompt
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h13" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </span>
            </span>
          </a>
        ))}
      </div>
    </>
  )
}

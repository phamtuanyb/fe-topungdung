'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export interface PromptRailItem {
  slug: string
  title: string
  excerpt: string
  /** Tên nhóm hiển thị trên thẻ */
  catName: string
  /** Đường dẫn đầy đủ tới trang prompt */
  href: string
  /** Đường vẽ SVG của nhóm, lấy từ PROMPT_STYLES */
  icon: string[]
  /** Số lượt xem thật của bài, KHÔNG phải số bịa */
  views: number
}

interface Props {
  items: PromptRailItem[]
  eyebrow: string
  heading: string
  headingAccent?: string
  description: string
}

/**
 * Dải prompt ở cuối trang chủ.
 *
 * Danh sách được chọn ngẫu nhiên ở phía máy chủ nên mỗi lần cache ISR hết hạn
 * là một nhóm prompt khác — người quay lại thấy nội dung mới mà không cần
 * random ở trình duyệt (làm vậy sẽ nhấp nháy khi trang vừa tải xong).
 *
 * Component tự dựng cả phần tiêu đề vì hai nút chuyển trang phải nằm cùng hàng
 * với dòng mô tả; tách ra thì HomeClient không với được tới ref của dải.
 */
export default function PromptRail({
  items,
  eyebrow,
  heading,
  headingAccent,
  description,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(0)
  // Khởi tạo theo bố cục 4 thẻ để HTML dựng ở máy chủ khớp với màn hình lớn;
  // sau khi gắn vào trang thì số đo thật sẽ ghi đè.
  const [pages, setPages] = useState(() => Math.max(1, Math.ceil(items.length / 4)))

  // Số thẻ mỗi trang do CSS quyết định (4 · 3 · 2 · 1 tuỳ bề rộng), nên phải đo
  // thay vì ghi cứng — ghi cứng thì đổi cỡ màn hình là bộ đếm báo sai số trang.
  const measure = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const n = Math.max(1, Math.round(el.scrollWidth / el.clientWidth))
    setPages(n)
    setPage((p) => Math.min(p, n - 1))
  }, [])

  useEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure, items.length])

  function go(dir: -1 | 1) {
    const el = trackRef.current
    if (!el) return
    // Quay vòng: ở trang cuối bấm tiếp thì về đầu, đỡ phải làm mờ nút.
    const next = (page + dir + pages) % pages
    setPage(next)
    el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' })
  }

  if (!items.length) return null

  return (
    <>
      <div className="section-title">
        <div>
          <div className="eyebrow eyebrow-flat">{eyebrow}</div>
          <h2 className="h2-blue" style={{ marginTop: 14 }}>
            {heading}
            {headingAccent && (
              <>
                {' '}
                <span className="h2-accent-warm">{headingAccent}</span>
              </>
            )}
          </h2>
        </div>
        <div className="title-aside prail-aside">
          <p>{description}</p>
          {pages > 1 && (
            <div className="prail-nav">
              <button type="button" onClick={() => go(-1)} aria-label="Xem các thẻ trước">
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H6" />
                  <path d="M12 5l-7 7 7 7" />
                </svg>
              </button>
              <span className="prail-count">
                <b>{String(page + 1).padStart(2, '0')}</b> / {String(pages).padStart(2, '0')}
              </span>
              <button
                type="button"
                className="on"
                onClick={() => go(1)}
                aria-label="Xem các thẻ tiếp theo"
              >
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h13" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="prail-track" ref={trackRef}>
        {items.map((it) => (
          <a className="prail-card" href={it.href} key={it.slug}>
            <span className="prail-top">
              <span className="prail-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  {it.icon.map((d, k) => (
                    <path d={d} key={k} />
                  ))}
                </svg>
              </span>
              <span className="prail-cat">{it.catName}</span>
            </span>
            <b>{it.title}</b>
            <p>{it.excerpt}</p>
            <span className="prail-foot">
              <span className="prail-views">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1.5 12S5 5.5 12 5.5 22.5 12 22.5 12 19 18.5 12 18.5 1.5 12 1.5 12z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {it.views.toLocaleString('vi-VN')} lượt xem
              </span>
              <span className="prail-go">
                Xem prompt
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
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

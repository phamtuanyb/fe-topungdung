'use client'

import { useState } from 'react'
import { PROMPT_FALLBACK, PROMPT_STYLES, shortSlug } from './prompt-meta'

export interface NewestItem {
  id: number
  slug: string
  title: string
  excerpt: string
  catName: string
  catSlug: string
}

/** Số thẻ mỗi trang: 3 cột × 3 hàng ở màn hình rộng. */
const MOI_TRANG = 9

/**
 * Lưới "Mới thêm gần đây" kèm phân trang.
 *
 * Mọi thẻ đều được dựng ra HTML, thẻ ngoài trang hiện tại chỉ bị ẩn bằng thuộc
 * tính `hidden`. Làm vậy để máy tìm kiếm vẫn đọc được toàn bộ liên kết prompt —
 * nếu chỉ dựng thẻ của trang đang xem thì các prompt ở trang 2, 3 sẽ không có
 * đường nào dẫn tới từ đây.
 */
export default function PromptNewest({ items }: { items: NewestItem[] }) {
  const [trang, setTrang] = useState(0)
  const soTrang = Math.max(1, Math.ceil(items.length / MOI_TRANG))

  return (
    <>
      <div className="prompt-new">
        {items.map((p, i) => {
          const st = PROMPT_STYLES[p.catSlug] ?? PROMPT_FALLBACK
          const trongTrang = Math.floor(i / MOI_TRANG) === trang
          return (
            <a
              className="prompt-new-card"
              href={`/prompt/${shortSlug(p.catSlug)}/${p.slug}`}
              key={p.id}
              hidden={!trongTrang}
            >
              <span className="prompt-chip">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {st.d.map((d, k) => (
                    <path d={d} key={k} />
                  ))}
                </svg>
                {p.catName}
              </span>
              <b>{p.title}</b>
              <span className="prompt-new-desc">{p.excerpt}</span>
              <span className="prompt-new-go">
                Xem prompt
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h13" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </span>
            </a>
          )
        })}
      </div>

      {soTrang > 1 && (
        <nav className="prompt-pager" aria-label="Phân trang prompt mới">
          <button
            type="button"
            className="pg-nav"
            onClick={() => setTrang((t) => Math.max(0, t - 1))}
            disabled={trang === 0}
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H6" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            Trước
          </button>
          {Array.from({ length: soTrang }, (_, i) => (
            <button
              type="button"
              className={`pg-so${i === trang ? ' on' : ''}`}
              key={i}
              onClick={() => setTrang(i)}
              aria-current={i === trang ? 'page' : undefined}
            >
              {i + 1}
            </button>
          ))}
          <button
            type="button"
            className="pg-nav"
            onClick={() => setTrang((t) => Math.min(soTrang - 1, t + 1))}
            disabled={trang === soTrang - 1}
          >
            Sau
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h13" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </button>
        </nav>
      )}
    </>
  )
}

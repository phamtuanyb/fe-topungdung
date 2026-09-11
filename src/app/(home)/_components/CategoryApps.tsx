'use client'

import { useMemo, useState } from 'react'

export interface CategoryAppItem {
  slug: string
  title: string
  kind: string
  score: number | null
  excerpt: string
  logoUrl: string | null
  logoText: string
  logoBg?: string
  /** Nhãn ngắn dưới phần mô tả: nền tảng hoặc tag do biên tập đặt */
  tags: string[]
}

type SortKey = 'score-desc' | 'score-asc' | 'name-asc'

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'score-desc', label: 'Điểm đánh giá: Cao → Thấp' },
  { key: 'score-asc', label: 'Điểm đánh giá: Thấp → Cao' },
  { key: 'name-asc', label: 'Tên: A → Z' },
]

/** Số thẻ hiện lúc đầu và số thẻ mở thêm mỗi lần bấm. */
const STEP = 12

/**
 * Lưới ứng dụng của một danh mục, kèm ô sắp xếp và nút xem thêm.
 *
 * Mọi thẻ đều được dựng vào HTML ngay từ đầu, phần dư chỉ bị ẩn bằng thuộc tính
 * `hidden`. Làm vậy để công cụ tìm kiếm vẫn đọc được đủ danh sách — cắt bớt ở
 * phía máy chủ thì trang danh mục mất hết liên kết tới các bài phía sau.
 */
export default function CategoryApps({
  items,
  heading,
  headingAccent,
  emptyHint,
}: {
  items: CategoryAppItem[]
  /** Tiêu đề mục; truyền vào thì ô sắp xếp nằm cùng hàng với nó */
  heading?: string
  headingAccent?: string
  emptyHint?: React.ReactNode
}) {
  const [sort, setSort] = useState<SortKey>('score-desc')
  const [shown, setShown] = useState(STEP)

  const rows = useMemo(() => {
    const list = [...items]
    if (sort === 'name-asc') return list.sort((a, b) => a.title.localeCompare(b.title, 'vi'))
    const dir = sort === 'score-asc' ? -1 : 1
    return list.sort((a, b) => ((b.score ?? 0) - (a.score ?? 0)) * dir)
  }, [items, sort])

  if (!items.length) return <div className="cat-empty">{emptyHint}</div>

  const con = rows.length - shown
  // Danh sách ngắn thì ô sắp xếp chỉ làm rối, ba bốn thẻ nhìn hết trong một lần.
  const tools =
    items.length >= 6 ? (
      <label className="cat-sort">
        <span className="sr-only">Sắp xếp danh sách</span>
        <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
          {SORTS.map((s) => (
            <option value={s.key} key={s.key}>
              {s.label}
            </option>
          ))}
        </select>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </label>
    ) : null

  return (
    <>
      {heading ? (
        <div className="section-title">
          <div>
            <h2 className="h2-blue" style={{ fontSize: 'clamp(26px,3vw,40px)' }}>
              {heading}
              {headingAccent && (
                <>
                  {' '}
                  <span className="h2-accent-warm">{headingAccent}</span>
                </>
              )}
            </h2>
          </div>
          {tools}
        </div>
      ) : (
        tools && <div className="cat-tools">{tools}</div>
      )}

      <div className="cat-grid">
        {rows.map((p, i) => (
          <a className="cat-card" href={`/app/${p.slug}`} key={p.slug} hidden={i >= shown}>
            <div className="cat-card-top">
              {p.logoUrl ? (
                <div className="app-logo has-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.logoUrl}
                    alt={p.title}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 6 }}
                    width={68}
                    height={68}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ) : (
                <div
                  className="app-logo"
                  style={p.logoBg ? { background: p.logoBg, color: '#07101F' } : undefined}
                >
                  {p.logoText}
                </div>
              )}
              <div className="cat-card-name">
                <h3>{p.title}</h3>
                {p.kind && <div className="cat-kind">{p.kind}</div>}
              </div>
              {p.score != null && (
                <span className="score-pill">
                  {p.score} <i>/10</i>
                </span>
              )}
            </div>
            <p>{p.excerpt}</p>
            <div className="cat-card-foot">
              <span className="cat-tags">
                {p.tags.slice(0, 3).map((t, k) => (
                  <span className="tag" key={k}>
                    {t}
                  </span>
                ))}
              </span>
              <span className="cat-go">
                Xem chi tiết
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h13" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </a>
        ))}
      </div>

      {con > 0 && (
        <div className="cat-more">
          <button type="button" onClick={() => setShown((n) => n + STEP)}>
            Xem thêm {Math.min(con, STEP)} công cụ
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14" />
              <path d="M5 12l7 7 7-7" />
            </svg>
          </button>
        </div>
      )}
    </>
  )
}

'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { getAllVoteSummaries, submitVote } from '@/lib/api/public'
import type { Category, Post } from '@/types'
import type { TudAppMeta } from '@/types/tud'

export interface VoteMap {
  [slug: string]: { average: number; count: number; mine?: number | null }
}

interface Props {
  apps: Post[]
  categories: Category[]
  /**
   * Slug danh mục bất kỳ → slug nhóm cấp 2 chứa nó.
   * Bài luôn gắn ở danh mục cấp 3 nên không so trực tiếp với slug nhóm được.
   */
  groupOf: Record<string, string>
  /** Slug danh mục → đường dẫn đầy đủ; thiếu map này thì link ra 404 */
  pathOf: Record<string, string>
  /** Số liệu lấy sẵn ở server để không chớp nội dung khi tải trang */
  initialVotes: VoteMap
  /** Giới hạn số dòng — trang chủ truyền vào, /ranking để trống là hiện hết */
  limit?: number
  /** Hiện 2 tab Biên tập / Người dùng */
  showTabs?: boolean
}

function meta(p: Post): TudAppMeta {
  const cfg = p.productPageConfig as unknown as { app?: TudAppMeta } | null | undefined
  return cfg?.app ?? {}
}

type Tab = 'editor' | 'users'

/**
 * Bảng xếp hạng dùng chung cho trang chủ và /ranking.
 * Số liệu bình chọn luôn được tải lại phía trình duyệt nên bầu xong thấy ngay,
 * và tự làm mới khi người dùng quay lại tab.
 */
export default function RankingTable({
  apps,
  categories,
  groupOf,
  pathOf,
  initialVotes,
  limit,
  showTabs = true,
}: Props) {
  const [tab, setTab] = useState<Tab>('editor')
  const [cat, setCat] = useState('')
  const [votes, setVotes] = useState<VoteMap>(initialVotes)
  const [refreshing, setRefreshing] = useState(false)

  const refresh = useCallback(async () => {
    setRefreshing(true)
    try {
      const r = await getAllVoteSummaries()
      setVotes(r.data ?? {})
    } catch {
      // giữ nguyên số liệu cũ nếu mạng lỗi
    } finally {
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    refresh()
    // Quay lại tab hoặc mở lại cửa sổ → lấy số liệu mới
    const onFocus = () => refresh()
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onFocus)
    return () => {
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onFocus)
    }
  }, [refresh])

  // Chấm sao ngay tại bảng — không phải mở trang chi tiết.
  const [voting, setVoting] = useState<string | null>(null)
  const [hover, setHover] = useState<{ slug: string; star: number } | null>(null)

  async function quickVote(slug: string, rating: number) {
    if (voting) return
    setVoting(slug)
    try {
      const r = await submitVote(slug, rating)
      setVotes((v) => ({
        ...v,
        [slug]: { average: r.data.average, count: r.data.count, mine: r.data.myRating },
      }))
    } catch {
      // Vượt giới hạn hoặc mất mạng — giữ nguyên số cũ
    } finally {
      setVoting(null)
      setHover(null)
    }
  }

  const rows = useMemo(() => {
    // So theo NHÓM cấp 2: bài gắn ở danh mục cấp 3 (vd `chatbot`) nên so thẳng
    // với slug nhóm (`ai`) thì không bao giờ khớp — trước đây lọc ra rỗng.
    const list = cat
      ? apps.filter((a) => groupOf[a.category?.slug ?? ''] === cat)
      : apps
    const sorted = [...list].sort((a, b) => {
      if (tab === 'editor') return (meta(b).score ?? 0) - (meta(a).score ?? 0)
      // Tab người dùng: app chưa có phiếu xuống cuối; cùng điểm thì nhiều phiếu hơn đứng trước
      const va = votes[a.slug]
      const vb = votes[b.slug]
      const sa = va?.count ? va.average : -1
      const sb = vb?.count ? vb.average : -1
      if (sb !== sa) return sb - sa
      return (vb?.count ?? 0) - (va?.count ?? 0)
    })
    return limit ? sorted.slice(0, limit) : sorted
    // `groupOf` phải nằm trong danh sách: thiếu nó thì đổi bảng ánh xạ
    // danh mục xong bộ lọc vẫn giữ kết quả cũ.
  }, [apps, cat, tab, votes, limit, groupOf])

  const chipStyle = (on: boolean) =>
    on
      ? {
          background: 'linear-gradient(135deg,#006FE6,#0057D9)',
          color: 'white',
          borderColor: '#006FE6',
        }
      : undefined

  return (
    <>
      {showTabs && (
        <div className="rank-tabs">
          <button
            className={`rank-tab${tab === 'editor' ? ' on' : ''}`}
            onClick={() => setTab('editor')}
          >
            Ban biên tập chấm
          </button>
          <button
            className={`rank-tab${tab === 'users' ? ' on' : ''}`}
            onClick={() => setTab('users')}
          >
            Người dùng bình chọn
          </button>
          <button className="rank-refresh" onClick={refresh} disabled={refreshing} type="button">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 11a8 8 0 10-2.3 6.3" />
              <path d="M20 5v6h-6" />
            </svg>
            {refreshing ? 'Đang tải…' : 'Làm mới'}
          </button>
        </div>
      )}

      <div className="chips chips-left" style={{ marginBottom: 16 }}>
        <button className="chip" onClick={() => setCat('')} style={chipStyle(cat === '')}>
          Tất cả ({apps.length})
        </button>
        {categories.map((c) => {
          const n = apps.filter((a) => groupOf[a.category?.slug ?? ''] === c.slug).length
          // Nhóm chưa có bài nào thì bỏ chip: bấm vào chỉ ra bảng rỗng
          if (!n) return null
          return (
            <button
              className="chip"
              key={c.id}
              onClick={() => setCat(c.slug)}
              style={chipStyle(cat === c.slug)}
            >
              {c.name} ({n})
            </button>
          )
        })}
      </div>

      <div className="rank-table">
        <div className="rank-head">
          <div>Hạng</div>
          <div>Ứng dụng</div>
          <div>Biên tập</div>
          <div>Người dùng</div>
          <div>Nhóm</div>
          <div />
        </div>

        {rows.length === 0 ? (
          <div style={{ padding: 28, color: 'var(--muted)', fontSize: 14 }}>
            Chưa có ứng dụng nào trong nhóm này.
          </div>
        ) : (
          rows.map((p, i) => {
            const m = meta(p)
            const v = votes[p.slug]
            return (
              <div className="rank-line" key={p.id}>
                <div className={`rank-pos${i < 3 ? ' top' : ''}`}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <a className="rank-name" href={`/app/${p.slug}`}>
                  {p.logoUrl ? (
                    <div className="app-logo has-img">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.logoUrl}
                        alt={p.title}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 5 }}
                       width={68} height={68} loading="lazy" decoding="async"/>
                    </div>
                  ) : (
                    <div
                      className="app-logo"
                      style={m.logoBg ? { background: m.logoBg, color: '#07101F' } : undefined}
                    >
                      {m.logoText || p.title.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div style={{ minWidth: 0 }}>
                    <b>{p.title}</b>
                    <span>{m.kind}</span>
                  </div>
                </a>
                <div className="rank-editor">{m.score ?? '—'}</div>
                <div className="rank-user">
                  {/* Một hàng sao duy nhất: hiện điểm trung bình, rê chuột thì
                      xem trước mức mình định chấm, bấm là gửi luôn. */}
                  <div
                    className="quick-vote"
                    onMouseLeave={() => setHover(null)}
                    title={v?.mine ? `Bạn đã chấm ${v.mine} sao — bấm để đổi` : 'Bấm để chấm sao'}
                  >
                    {[1, 2, 3, 4, 5].map((star) => {
                      const shown =
                        hover?.slug === p.slug ? hover.star : (v?.average ?? 0)
                      const fill = Math.max(0, Math.min(1, shown - (star - 1)))
                      return (
                        <button
                          type="button"
                          key={star}
                          className="qv-star"
                          disabled={voting === p.slug}
                          onMouseEnter={() => setHover({ slug: p.slug, star })}
                          onFocus={() => setHover({ slug: p.slug, star })}
                          onClick={() => quickVote(p.slug, star)}
                          aria-label={`Chấm ${star} sao cho ${p.title}`}
                        >
                          <span className="star-bg">★</span>
                          <span className="star-fg" style={{ width: `${fill * 100}%` }}>
                            ★
                          </span>
                        </button>
                      )
                    })}
                  </div>
                  <span className="n">
                    {v?.count ? `${v.average.toFixed(1)} · ${v.count} phiếu` : 'Chưa có phiếu'}
                    {v?.mine ? ` · bạn ${v.mine}★` : ''}
                  </span>
                </div>
                <div className="rank-cat-cell">
                  <a className="rank-cat" href={pathOf[p.category?.slug ?? ''] ?? '/ungdung'}>
                    {p.category?.name}
                  </a>
                </div>
                <a className="rank-go" href={`/app/${p.slug}`} aria-label={`Xem ${p.title}`}>
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h13" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            )
          })
        )}
      </div>
    </>
  )
}

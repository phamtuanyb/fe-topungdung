'use client'

import { useEffect, useState } from 'react'
import { getVoteSummary, removeVote, submitVote } from '@/lib/api/public'
import type { TudVoteSummary } from '@/types/tud'

/** Dãy sao chỉ để hiển thị, hỗ trợ nửa sao. */
export function Stars({ value, size = 18 }: { value: number; size?: number }) {
  return (
    <span className="stars" style={{ fontSize: size }} aria-label={`${value} trên 5 sao`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, value - (i - 1)))
        return (
          <span className="star" key={i}>
            <span className="star-bg">★</span>
            <span className="star-fg" style={{ width: `${fill * 100}%` }}>
              ★
            </span>
          </span>
        )
      })}
    </span>
  )
}

/**
 * Khối bình chọn trên trang chi tiết ứng dụng.
 * Bắt buộc chạy phía trình duyệt để backend nhận đúng IP/User-Agent của khách.
 */
export default function VoteWidget({ slug }: { slug: string }) {
  const [sum, setSum] = useState<TudVoteSummary | null>(null)
  const [hover, setHover] = useState(0)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    let alive = true
    getVoteSummary(slug)
      .then((r) => alive && setSum(r.data))
      .catch(() => alive && setSum(null))
    return () => {
      alive = false
    }
  }, [slug])

  async function pick(rating: number) {
    if (busy) return
    setBusy(true)
    setMsg('')
    try {
      const r = await submitVote(slug, rating)
      setSum(r.data)
      setMsg('Cảm ơn bạn đã bình chọn!')
    } catch (e) {
      const m = (e as Error).message || ''
      setMsg(m.includes('429') || /nhiều/i.test(m) ? 'Bạn thao tác hơi nhanh, thử lại sau ít phút.' : 'Không gửi được bình chọn.')
    } finally {
      setBusy(false)
    }
  }

  async function withdraw() {
    if (busy) return
    setBusy(true)
    try {
      const r = await removeVote(slug)
      setSum(r.data)
      setMsg('Đã rút lại phiếu.')
    } catch {
      setMsg('Không rút được phiếu.')
    } finally {
      setBusy(false)
    }
  }

  const avg = sum?.average ?? 0
  const count = sum?.count ?? 0
  const mine = sum?.myRating ?? 0
  const shown = hover || mine

  return (
    <div className="vote-box">
      <div className="vote-head">
        <div>
          <div className="vote-avg">{count ? avg.toFixed(1) : '—'}</div>
          <Stars value={avg} size={16} />
          <div className="vote-count">
            {count ? `${count} lượt bình chọn` : 'Chưa có bình chọn'}
          </div>
        </div>

        {count > 0 && sum && (
          <div className="vote-dist">
            {[5, 4, 3, 2, 1].map((star) => {
              const n = sum.distribution[star - 1] ?? 0
              const pct = count ? (n / count) * 100 : 0
              return (
                <div className="vote-dist-row" key={star}>
                  <span className="s">{star}★</span>
                  <span className="track">
                    <span className="fill" style={{ width: `${pct}%` }} />
                  </span>
                  <span className="n">{n}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="vote-action">
        <span className="vote-label">{mine ? 'Bạn đã chấm' : 'Bạn thấy sao?'}</span>
        <div className="vote-stars" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              type="button"
              key={i}
              className={`vote-star${i <= shown ? ' on' : ''}`}
              disabled={busy}
              onMouseEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              onClick={() => pick(i)}
              aria-label={`Chấm ${i} sao`}
            >
              ★
            </button>
          ))}
        </div>
        {mine > 0 && (
          <button type="button" className="vote-undo" onClick={withdraw} disabled={busy}>
            Rút phiếu
          </button>
        )}
      </div>

      {msg && <div className="vote-msg">{msg}</div>}
      <div className="vote-note">Không cần đăng nhập. Mỗi người một phiếu, đổi lại được.</div>
    </div>
  )
}

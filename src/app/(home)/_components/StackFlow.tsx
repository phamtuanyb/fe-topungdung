'use client'

import { useCallback, useEffect, useState } from 'react'
import { getTudApps, getTudHomeConfig } from '@/lib/api/public'
import type { Post } from '@/types'
import type { TudAppMeta, TudStackStep } from '@/types/tud'
import { categoryIcon } from './intent-icons'
import { stepIcon } from './step-icons'

interface Props {
  /** 'home' = khối gọn trên trang chủ, 'page' = danh sách đầy đủ ở /topapp */
  variant: 'home' | 'page'
  /** Dữ liệu render sẵn ở server để không chớp nội dung khi tải trang */
  initialSteps: TudStackStep[]
  initialApps: Post[]
  /** Tiêu đề trên đầu danh sách, chỉ dùng cho variant 'home' */
  flowTitle?: string
}

function meta(p?: Post | null): TudAppMeta {
  const cfg = p?.productPageConfig as unknown as { app?: TudAppMeta } | null | undefined
  return cfg?.app ?? {}
}

/**
 * Danh sách "bộ công cụ" dùng chung cho trang chủ và /topapp.
 * Một nguồn dữ liệu duy nhất (config.stack.steps trong site_settings) nên sửa
 * thứ tự hay đổi app trong admin là hai nơi đổi giống hệt nhau.
 *
 * Tự lấy lại dữ liệu lúc mở trang và mỗi khi người dùng quay lại tab, nên
 * chỉnh trong admin xong không phải chờ hết hạn cache mới thấy.
 */
export default function StackFlow({ variant, initialSteps, initialApps, flowTitle }: Props) {
  const [steps, setSteps] = useState<TudStackStep[]>(initialSteps)
  const [apps, setApps] = useState<Post[]>(initialApps)

  const refresh = useCallback(async () => {
    try {
      // Lấy đủ danh sách: danh mục ung-dung có hơn 400 bài, cắt ở 200 thì
      // ChatGPT, CapCut, Canva rơi ra ngoài và mọi bước hiện "Chưa chọn".
      const [cfg, appsRes] = await Promise.all([getTudHomeConfig(), getTudApps(1000)])
      const next = cfg.data?.stack?.steps
      if (Array.isArray(next)) setSteps(next)
      if (Array.isArray(appsRes.data)) setApps(appsRes.data)
    } catch {
      // Mất mạng hoặc backend bận — giữ nguyên dữ liệu đang hiển thị
    }
  }, [])

  useEffect(() => {
    refresh()
    const onFocus = () => refresh()
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onFocus)
    return () => {
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onFocus)
    }
  }, [refresh])

  const rows = steps.map((s) => ({
    step: s,
    post: s.slug ? (apps.find((a) => a.slug === s.slug) ?? null) : null,
  }))

  if (rows.length === 0) {
    return variant === 'page' ? (
      <div className="tapp-empty">Chưa có bước nào trong bộ công cụ. Thêm trong trang quản trị.</div>
    ) : null
  }

  // ── Trang chủ ─────────────────────────────────────────────────────────────
  if (variant === 'home') {
    return (
      <div className="stack-flow">
        <div className="stack-flow-head">
          <h3>{flowTitle || 'Quy trình xây kênh của bạn'}</h3>
          <span className="stack-count">{rows.length} bước</span>
        </div>

        <div className="stack-steps">
          {rows.map(({ step, post }, i) => {
            const m = meta(post)
            const name = post?.title ?? step.fallbackName ?? 'Chưa chọn'
            const logoText = m.logoText || step.fallbackLogo || name.slice(0, 2).toUpperCase()
            return (
              <div className="stack-row" key={i}>
                <span className="stack-step">{String(i + 1).padStart(2, '0')}</span>
                <a className="stack-card" href={post ? `/app/${post.slug}` : '/topapp'}>
                  <span className="stack-ico" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      {stepIcon(step.icon, i).map((d, k) => (
                        <path d={d} key={k} />
                      ))}
                    </svg>
                  </span>
                  <span className="stack-main">
                    <b>{step.note}</b>
                    {step.desc ? <span className="stack-desc">{step.desc}</span> : null}
                  </span>
                  <span className="stack-app">
                    {post?.logoUrl ? (
                      <span className="app-logo has-img">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.logoUrl}
                          alt={name}
                         width={68} height={68} loading="lazy" decoding="async"/>
                      </span>
                    ) : (
                      <span
                        className="app-logo"
                        style={m.logoBg ? { background: m.logoBg, color: '#07101F' } : undefined}
                      >
                        {logoText}
                      </span>
                    )}
                    <b>{name}</b>
                  </span>
                </a>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // ── /topapp ───────────────────────────────────────────────────────────────
  // Số thứ tự nằm ngoài thẻ, trên một đường kẻ dọc nối các bước: người đọc thấy
  // ngay đây là quy trình có trước có sau chứ không phải một bảng xếp hạng.
  return (
    <ol className="tapp-list">
      {rows.map(({ step, post }, i) => {
        const m = meta(post)
        const name = post?.title ?? step.fallbackName ?? 'Chưa chọn ứng dụng'
        const logoText = m.logoText || step.fallbackLogo || name.slice(0, 2).toUpperCase()
        const cat = post?.category

        const body = (
          <>
            {post?.logoUrl ? (
              <div className="app-logo tapp-logo tapp-logo-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.logoUrl} alt={name}  width={68} height={68} loading="lazy" decoding="async"/>
              </div>
            ) : (
              <div
                className="app-logo tapp-logo"
                style={m.logoBg ? { background: m.logoBg, color: '#07101F' } : undefined}
              >
                {logoText}
              </div>
            )}

            <div className="tapp-main">
              <b>{name}</b>
              <span className="tapp-note">{step.note}</span>
              {m.tagline ? <span className="tapp-tagline">{m.tagline}</span> : null}
            </div>

            <div className="tapp-side">
              {m.score ? (
                <span className="tapp-score">
                  <b>{m.score}</b>
                  <small>/10</small>
                </span>
              ) : null}
              {cat?.name ? (
                <span className="tapp-cat">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {categoryIcon(cat.slug ?? '').map((d, k) => (
                      <path d={d} key={k} />
                    ))}
                  </svg>
                  {cat.name}
                </span>
              ) : null}
              {post ? (
                <span className="tapp-go">
                  Xem review
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h13" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </span>
              ) : null}
            </div>
          </>
        )

        return (
          <li className="tapp-item" key={i}>
            <span className="tapp-no">{String(i + 1).padStart(2, '0')}</span>
            {post ? (
              <a className="tapp-row" href={`/app/${post.slug}`}>
                {body}
              </a>
            ) : (
              <div className="tapp-row tapp-row-plain">{body}</div>
            )}
          </li>
        )
      })}
    </ol>
  )
}

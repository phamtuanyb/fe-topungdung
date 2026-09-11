'use client'

import { useEffect, useRef, useState } from 'react'
import type { Category, Post } from '@/types'
import type { TudAppMeta, TudHomeConfig } from '@/types/tud'
import { TudHeader, TudFooter } from './_components/TudChrome'
import { blurbFrom } from './discover-data'
import StackFlow from './_components/StackFlow'
import RankingTable, { type VoteMap } from './_components/RankingTable'
import PromptRail, { type PromptRailItem } from './_components/PromptRail'
import { stepIcon } from './_components/step-icons'
import { INTENT_ICONS, INTENT_FALLBACK } from './_components/intent-icons'

interface Props {
  config: TudHomeConfig
  /** App (posts danh mục "ung-dung") đã sắp theo điểm giảm dần */
  apps: Post[]
  editFeatured: Post | null
  editList: Post[]
  /** Số ứng dụng theo slug danh mục, đã cộng dồn lên nhóm cha — dùng cho thẻ khám phá */
  counts: Record<string, number>
  /** Slug nhóm → tên các danh mục con, dùng cho dòng mô tả trên thẻ */
  groupSubs: Record<string, string[]>
  /** Slug nhóm → tên nhóm, dùng làm nhãn mặc định trên thẻ */
  groupNames: Record<string, string>
  /** Slug danh mục bất kỳ → slug nhóm cấp 2, dùng cho bộ lọc bảng xếp hạng */
  groupOf: Record<string, string>
  /** Slug danh mục → đường dẫn đầy đủ, dùng cho link danh mục trong bảng */
  pathOf: Record<string, string>
  /** Danh mục con của "ung-dung" — dùng làm bộ lọc bảng xếp hạng */
  appCategories: Category[]
  /** Số liệu bình chọn lấy sẵn ở server */
  votes: VoteMap
  /** Prompt chọn ngẫu nhiên cho dải cuối trang */
  promptRail: PromptRailItem[]
}

/**
 * Biểu tượng cho các chip gợi ý dưới ô tìm kiếm, dùng theo thứ tự khai trong
 * config. Dùng đường vẽ SVG thay vì emoji để nét đồng đều trên mọi máy.
 */
const CHIP_ICONS: string[][] = [
  ['M12 20h9', 'M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4 12.5-12.5z'], // viết
  ['M23 7l-7 5 7 5V7z', 'M14 5H3a2 2 0 00-2 2v10a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2z'], // video
  ['M12 3a9 9 0 000 18h1.5a2 2 0 001.4-3.4 2 2 0 011.4-3.4H18a3 3 0 003-3 9 9 0 00-9-8.2z', 'M7.5 11h.01', 'M12 8h.01'], // thiết kế
  ['M3 11l18-6-6 18-3-7-9-5z'], // marketing
  ['M9 11l3 3L22 4', 'M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11'], // công việc
  ['M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4-6.2-4.6-6.2 4.6 2.4-7.4L2 9.4h7.6z'], // dự phòng
]

/**
 * Bốn ô biểu tượng nổi quanh khối hero. Thuần trang trí — vị trí đặt trong CSS
 * để dễ chỉnh mà không phải sửa mã.
 */
const DECO_TILES = [
  // Biểu đồ cột
  { bg: '#E4EAFD', color: '#4F6BD8', d: ['M6 20V10', 'M12 20V4', 'M18 20v-7'] },
  // Ngôi sao bốn cánh
  { bg: '#FFFFFF', color: '#2C7BEA', d: ['M12 3c.6 4.2 2.2 5.8 6.4 6.4-4.2.6-5.8 2.2-6.4 6.4-.6-4.2-2.2-5.8-6.4-6.4C9.8 8.8 11.4 7.2 12 3z'] },
  // Tên lửa
  { bg: '#FFEBD8', color: '#F08A24', d: ['M12 3c3.4 2.2 5.2 5.6 5.2 9.4L12 17l-5.2-4.6C6.8 8.6 8.6 5.2 12 3z', 'M12 10.5h.01', 'M9 17l-2 4 4-2', 'M15 17l2 4-4-2'] },
  // Lưới bốn ô
  { bg: '#DCEBFB', color: '#2C7BEA', d: ['M4 4h6v6H4z', 'M14 4h6v6h-6z', 'M4 14h6v6H4z', 'M14 14h6v6h-6z'] },
]

/**
 * Bỏ mũi tên viết bằng ký tự ở cuối nhãn nút.
 * Nút giờ tự vẽ mũi tên bằng SVG, giữ nguyên chữ cấu hình sẽ ra hai mũi tên.
 */
function stripArrow(text: string): string {
  return text.replace(/\s*[→›>»]+\s*$/, '')
}

/** Đọc metadata app nhét trong productPageConfig.app */
function meta(post?: Post | null): TudAppMeta {
  if (!post) return {}
  const cfg = post.productPageConfig as unknown as { app?: TudAppMeta } | null | undefined
  return cfg?.app ?? {}
}

function bySlug(apps: Post[], slug?: string): Post | null {
  if (!slug) return null
  return apps.find((a) => a.slug === slug) ?? null
}

/** Ứng dụng đi theo /app/<slug>; bài viết biên tập vẫn ở /tin-tuc/<slug>. */
function appHref(post?: Post | null): string {
  return post ? `/app/${post.slug}` : '#'
}

function articleHref(post?: Post | null): string {
  return post ? `/tin-tuc/${post.slug}` : '#'
}

/** Ô logo app: ưu tiên ảnh thật, chưa có thì dùng chữ viết tắt. */
function AppLogo({
  post,
  fallbackText,
  style,
}: {
  post?: Post | null
  fallbackText?: string
  style?: React.CSSProperties
}) {
  const m = meta(post)
  const text = m.logoText || fallbackText || post?.shortName?.slice(0, 2).toUpperCase() || '?'

  if (post?.logoUrl) {
    return (
      <div className="app-logo has-img" style={style}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.logoUrl}
          alt={post.title}
          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 6 }}
         width={68} height={68} loading="lazy" decoding="async"/>
      </div>
    )
  }
  return (
    <div className="app-logo" style={{ ...(m.logoBg ? { background: m.logoBg, color: '#07101F' } : {}), ...style }}>
      {text}
    </div>
  )
}

/** Ảnh bài viết; chưa có thì để ô placeholder xám như thiết kế. */
function PostImage({ post, placeholder }: { post?: Post | null; placeholder: string }) {
  if (post?.thumbnail) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={post.thumbnail}
        alt={post.title}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
       width={68} height={68} loading="lazy" decoding="async"/>
    )
  }
  return <div className="img-slot">{placeholder}</div>
}

/** Một bên của khối App Battle. */
/**
 * Một bên của khối so sánh. Cả thẻ là một liên kết thay vì có nút riêng bên
 * trong: bỏ được một tầng hộp và khối gọn lại đáng kể.
 */
function Fighter({ post, ctaPrefix }: { post: Post; ctaPrefix: string }) {
  const m = meta(post)
  return (
    <a className="fighter" href={appHref(post)}>
      <AppLogo post={post} style={{ width: 40, height: 40, borderRadius: 12, fontSize: 18 }} />
      <h3>{post.title}</h3>
      <p>
        {m.kind}
        {m.score ? ` · ${m.score}` : ''}
      </p>
      <span className="fighter-cta">{ctaPrefix} {post.title} →</span>
    </a>
  )
}

export default function HomeClient({
  config: c,
  apps,
  editFeatured,
  editList,
  counts,
  groupSubs,
  groupNames,
  groupOf,
  pathOf,
  appCategories,
  votes,
  promptRail,
}: Props) {
  const [heroQuery, setHeroQuery] = useState('')
  const [aiQuery, setAiQuery] = useState('')
  const [aiResult, setAiResult] = useState<'idle' | 'empty' | 'done'>('idle')
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const targets = rootRef.current?.querySelectorAll('.reveal')
    if (!targets?.length) return
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('show')),
      { threshold: 0.08 },
    )
    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  function smartSearch() {
    const q = heroQuery.trim()
    // Ô tìm ở hero và nút Tìm kiếm trên header cùng đổ về một trang kết quả.
    if (q.length >= 2) window.location.href = `/tim-kiem?q=${encodeURIComponent(q)}`
  }

  const featured = bySlug(apps, c.picks.featuredSlug) ?? apps[0] ?? null
  const featuredMeta = meta(featured)
  const miniApps = c.picks.miniSlugs.map((s) => bySlug(apps, s)).filter(Boolean) as Post[]
  const left = bySlug(apps, c.battle.leftSlug)
  const right = bySlug(apps, c.battle.rightSlug)
  const trending = apps.slice(0, 5)

  return (
    <div ref={rootRef}>
      <TudHeader config={c.header} />

      <main>
        {/* ── HERO ──────────────────────────────────────────────── */}
        <section className="hero">
          {/* Hoạ tiết trang trí: chỉ để nhìn, không mang thông tin nên ẩn khỏi
              trình đọc màn hình. CSS tự ẩn chúng ở khổ hẹp để không che chữ. */}
          <div className="hero-deco" aria-hidden="true">
            {DECO_TILES.map((t, i) => (
              <span className={`deco deco-${i + 1}`} key={i} style={{ background: t.bg, color: t.color }}>
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {t.d.map((d, k) => (
                    <path d={d} key={k} />
                  ))}
                </svg>
              </span>
            ))}
          </div>
          <div className="wrap">
            <div className="eyebrow">
              <span className="pulse" /> {c.hero.eyebrow}
            </div>
            <h1>
              <span className="h1-line">
                <span className="w-orange">{c.hero.line1}</span>{' '}
                <span className="w-blue">{c.hero.line2}</span>
              </span>
              <span className="h1-line grad-word">{c.hero.line3}</span>
            </h1>
            <p className="hero-copy">{c.hero.description}</p>

            <div className="search-shell">
              <span className="search-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5" />
                </svg>
              </span>
              <input
                placeholder={c.hero.searchPlaceholder}
                value={heroQuery}
                onChange={(e) => setHeroQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && smartSearch()}
              />
              <button onClick={smartSearch}>{c.hero.searchButton}</button>
            </div>

            <div className="chips">
              {c.hero.chips.map((ch, i) => (
                <button
                  className="chip"
                  key={i}
                  type="button"
                  // Trước đây các chip này không làm gì cả khi bấm vào.
                  onClick={() => {
                    window.location.href = `/tim-kiem?q=${encodeURIComponent(ch)}`
                  }}
                >
                  <span className="chip-ico" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {CHIP_ICONS[i % CHIP_ICONS.length].map((d, k) => (
                        <path d={d} key={k} />
                      ))}
                    </svg>
                  </span>
                  {ch}
                </button>
              ))}
            </div>

            {!c.trending.hidden && trending.length > 0 && (
              <div className="trending">
                {/* Cùng nguồn với bảng xếp hạng: apps đã sắp theo điểm giảm dần */}
                <a className="trend-label" href="/ranking">
                  {c.trending.label}
                </a>
                <div className="trend-track">
                  {trending.map((p, i) => {
                    const m = meta(p)
                    return (
                      <a className="trend-item" href={`/app/${p.slug}`} key={p.id}>
                        <b>
                          #{String(i + 1).padStart(2, '0')} {p.title}
                        </b>
                        <span className="trend-score">{m.score}</span>
                        <span className={m.trendUp ? 'trend-up' : 'trend-flat'}>{m.trend}</span>
                      </a>
                    )
                  })}
                  <a className="trend-more" href="/ranking">
                    Xem bảng xếp hạng →
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── KHÁM PHÁ THEO NHU CẦU ─────────────────────────────── */}
        {!c.discover.hidden && (
          <section className="section reveal" id="discover">
            <div className="wrap">
              <div className="section-title">
                <div>
                  <div className="eyebrow eyebrow-flat">{c.discover.eyebrow}</div>
                  <h2 className="h2-blue" style={{ marginTop: 14 }}>
                    {c.discover.heading}
                    {c.discover.headingAccent && (
                      <>
                        {' '}
                        <span className="h2-accent-warm">{c.discover.headingAccent}</span>
                      </>
                    )}
                  </h2>
                </div>
                <p>{c.discover.description}</p>
              </div>
              <div className="intent-grid">
                {c.discover.cards.map((card, i) => {
                  // Link và số lượng tự suy ra từ danh mục, trừ khi admin ghi đè.
                  // Coi '' và '#' đều là "chưa đặt" để thẻ không bao giờ thành link chết.
                  const override = card.href?.trim()
                  const href =
                    override && override !== '#'
                      ? override
                      : card.categorySlug
                        ? `/ungdung/${card.categorySlug}`
                        : '#'
                  const slug = card.categorySlug
                  const n = slug ? counts[slug] ?? 0 : 0
                  // Nhóm mới mở chưa có bài: "0 ứng dụng" đọc như thẻ hỏng,
                  // nói thẳng là sắp có thì đúng hơn mà không hứa hão.
                  const soon = !card.countText?.trim() && n === 0
                  const countText = card.countText?.trim() || (n ? `${n} ứng dụng` : 'Sắp có')
                  // Nhãn ngắn: ưu tiên cấu hình, rồi tới tên danh mục thật.
                  // `card.title` kiểu "TÔI MUỐN LÀM VIDEO" quá dài cho thẻ gọn.
                  const label =
                    card.shortTitle?.trim() || (slug ? groupNames[slug] : '') || card.title
                  const blurb = card.blurb?.trim() || blurbFrom(slug ? groupSubs[slug] : [])
                  const ico = (slug && INTENT_ICONS[slug]) || INTENT_FALLBACK
                  return (
                    <a className="intent" href={href} key={i}>
                      <span className="intent-ico" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                          {ico.map((d, k) => (
                            <path d={d} key={k} />
                          ))}
                        </svg>
                      </span>
                      <div className="intent-body">
                        <div className="intent-top">
                          <h3>{label}</h3>
                          <span className={`intent-count${soon ? ' soon' : ''}`}>{countText}</span>
                        </div>
                        {blurb && <p className="intent-subs">{blurb}</p>}
                      </div>
                      <span className="intent-go" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h13" />
                          <path d="M12 5l7 7-7 7" />
                        </svg>
                      </span>
                    </a>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── TOP PICKS ─────────────────────────────────────────── */}
        {!c.picks.hidden && featured && (
          <section className="section reveal">
            <div className="wrap">
              <div className="section-title">
                <div>
                  <div className="eyebrow eyebrow-flat">{c.picks.eyebrow}</div>
                  <h2 className="h2-blue" style={{ marginTop: 14 }}>
                    {c.picks.heading}
                    {c.picks.headingAccent && (
                      <>
                        {' '}
                        <span className="h2-accent-warm">{c.picks.headingAccent}</span>
                      </>
                    )}
                  </h2>
                </div>
                <div className="title-aside">
                  <p>{c.picks.description}</p>
                  {c.picks.viewAllText && (
                    <a className="title-more" href={c.picks.viewAllHref || '/ranking'}>
                      {c.picks.viewAllText}
                    </a>
                  )}
                </div>
              </div>

              <div className="picks">
                <article className="featured">
                  <div className="featured-body">
                    <div className="featured-head">
                      <AppLogo post={featured} />
                      {featuredMeta.score != null && (
                        <span className="score-pill">{featuredMeta.score} / 10</span>
                      )}
                    </div>
                    <h3 className="featured-name">{featured.title}</h3>
                    {featuredMeta.tagline && (
                      <p className="featured-tagline">{featuredMeta.tagline}</p>
                    )}
                    <p className="featured-desc">{featured.excerpt}</p>
                    <div className="featured-tags">
                      {(featuredMeta.tags ?? []).map((t, i) => (
                        <span className="tag" key={i}>
                          {t}
                        </span>
                      ))}
                    </div>
                    <a className="btn dark btn-go" href={appHref(featured)}>
                      {stripArrow(c.picks.featuredCta)}
                      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h13" />
                        <path d="M12 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                  {/* Ưu tiên ảnh thật: ảnh riêng do admin chọn → ảnh bài viết →
                      ảnh chụp đầu tiên. Không có ảnh nào thì hiện logo + tên,
                      dễ nhìn hơn là phóng to một chữ. */}
                  {(() => {
                    const art =
                      featuredMeta.artImage ||
                      featured.thumbnail ||
                      featuredMeta.shots?.[0]?.url ||
                      ''
                    if (art) {
                      return (
                        <div className="feature-art has-img">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={art} alt={featured.title}  width={400} height={400} loading="lazy" decoding="async"/>
                        </div>
                      )
                    }
                    return (
                      <div className="feature-art">
                        <div className="art-fallback">
                          <AppLogo post={featured} style={{ width: 76, height: 76, fontSize: 30 }} />
                          <b>{featured.title}</b>
                          {featuredMeta.kind ? <span>{featuredMeta.kind}</span> : null}
                        </div>
                      </div>
                    )
                  })()}
                </article>

                <div className="side-list">
                  {miniApps.map((p) => {
                    const m = meta(p)
                    return (
                      <a className="mini-app" href={appHref(p)} key={p.id}>
                        <div>
                          <div className="mini-head">
                            <AppLogo post={p} />
                            {m.score != null && <span className="score-pill">{m.score} / 10</span>}
                          </div>
                          <h4>{p.title}</h4>
                          {m.kind && <p className="mini-kind">{m.kind}</p>}
                          {m.tagline && <p className="mini-desc">{m.tagline}</p>}
                        </div>
                        <div className="mini-foot">
                          <b>{c.picks.miniCta || 'Khám phá'}</b>
                          <span className="mini-go" aria-hidden="true">
                            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12h13" />
                              <path d="M12 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </a>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── CREATOR STACK ─────────────────────────────────────── */}
        {!c.stack.hidden && (
          <section className="section reveal" id="stack">
            <div className="wrap">
              <div className="stack">
                <div className="stack-intro">
                  <div className="eyebrow eyebrow-flat">{c.stack.eyebrow}</div>
                  <h2>
                    <a href="/topapp" className="stack-title-link">
                      <span className="h2-blue">{c.stack.heading1}</span>
                      <br />
                      <span className="h2-accent-warm">{c.stack.heading2}</span>
                    </a>
                  </h2>
                  <p>{c.stack.description}</p>
                  <a className="btn accent btn-go" href="/topapp">
                    {stripArrow(c.stack.ctaText)}
                    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h13" />
                      <path d="M12 5l7 7-7 7" />
                    </svg>
                  </a>
                  {/* Dải biểu tượng nhắc lại 5 bước bên phải — thuần trang trí,
                      ẩn với trình đọc màn hình vì nội dung đã có ở danh sách. */}
                  <div className="stack-chips" aria-hidden="true">
                    {c.stack.steps.slice(0, 5).map((s, i) => (
                      <span className="stack-chip" key={i}>
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                          {stepIcon(s.icon, i).map((d, k) => (
                            <path d={d} key={k} />
                          ))}
                        </svg>
                      </span>
                    ))}
                  </div>
                </div>
                <StackFlow
                  variant="home"
                  initialSteps={c.stack.steps}
                  initialApps={apps}
                  flowTitle={c.stack.flowTitle}
                />
              </div>
            </div>
          </section>
        )}

        {/* ── APP BATTLE ────────────────────────────────────────── */}
        {!c.battle.hidden && left && right && (
          <section className="section reveal" id="compare">
            <div className="wrap">
              <div className="section-title">
                <div>
                  <div className="eyebrow">{c.battle.eyebrow}</div>
                  <h2 style={{ marginTop: 14 }}>{c.battle.heading}</h2>
                </div>
                <p>{c.battle.description}</p>
              </div>
              <div className="battle">
                <Fighter post={left} ctaPrefix={c.battle.ctaPrefix} />
                <div className="vs">VS</div>
                <Fighter post={right} ctaPrefix={c.battle.ctaPrefix} />
              </div>
            </div>
          </section>
        )}

        {/* ── BẢNG XẾP HẠNG ─────────────────────────────────────── */}
        {/* Dùng chung component với /ranking: cùng danh mục thật, cùng số
            liệu bình chọn, tự làm mới khi quay lại tab. */}
        {!c.ranking.hidden && apps.length > 0 && (
          <section className="section reveal" id="ranking">
            <div className="wrap">
              <div className="section-title">
                <div>
                  <div className="eyebrow eyebrow-flat">{c.ranking.eyebrow}</div>
                  <h2 className="h2-blue" style={{ marginTop: 14 }}>
                    {c.ranking.heading}
                    {c.ranking.headingAccent && (
                      <>
                        {' '}
                        <span className="h2-accent-warm">{c.ranking.headingAccent}</span>
                      </>
                    )}
                  </h2>
                </div>
                <p>{c.ranking.description}</p>
              </div>

              <RankingTable
                apps={apps}
                categories={appCategories}
                groupOf={groupOf}
                pathOf={pathOf}
                initialVotes={votes}
                limit={c.ranking.limit || 5}
              />

              {/* Nút chốt khối căn giữa cho cân với bảng trải hết chiều ngang */}
              <div className="rank-foot">
                <a className="btn accent btn-go" href="/ranking">
                  {stripArrow(c.ranking.ctaText || 'Xem toàn bộ bảng xếp hạng')}
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h13" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </section>
        )}

        {/* ── THE EDIT ──────────────────────────────────────────── */}
        {!c.edit.hidden && (editFeatured || editList.length > 0) && (
          <section className="section reveal" id="review">
            <div className="wrap">
              <div className="section-title">
                <div>
                  <div className="eyebrow">{c.edit.eyebrow}</div>
                  <h2 style={{ marginTop: 14 }}>{c.edit.heading}</h2>
                </div>
                <p>{c.edit.description}</p>
              </div>

              <div className="editorial">
                {editFeatured && (
                  <article className="story">
                    <a href={articleHref(editFeatured)}>
                      <div className="story-image">
                        <PostImage post={editFeatured} placeholder="Ảnh bài viết" />
                      </div>
                      <div className="story-body">
                        <div className="meta">{c.edit.featuredMeta}</div>
                        <h3>{editFeatured.title}</h3>
                        <p style={{ color: 'var(--muted)' }}>{editFeatured.excerpt}</p>
                      </div>
                    </a>
                  </article>
                )}
                <div className="story-list">
                  {editList.map((p) => (
                    <a className="story-small" href={articleHref(p)} key={p.id}>
                      <div className="story-thumb">
                        <PostImage post={p} placeholder="Ảnh" />
                      </div>
                      <div>
                        <span>{p.category?.name?.toUpperCase() ?? 'BÀI VIẾT'}</span>
                        <h4>{p.title}</h4>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── PROMPT NỔI BẬT ────────────────────────────────────── */}
        {/* Đặt đúng chỗ khối TOP AI FINDER cũ: ngay trên chân trang. */}
        {!c.promptRail.hidden && promptRail.length > 0 && (
          <section className="section reveal">
            <div className="wrap">
              {/* Tiêu đề mục do PromptRail dựng: hai nút chuyển trang phải nằm
                  cùng hàng với dòng mô tả nên chúng phải chung một component. */}
              <PromptRail
                items={promptRail}
                eyebrow={c.promptRail.eyebrow}
                heading={c.promptRail.heading}
                headingAccent={c.promptRail.headingAccent}
                description={c.promptRail.description}
              />
              <div className="rank-foot">
                <a className="btn accent btn-go" href="/prompt">
                  {stripArrow(c.promptRail.ctaText || 'Xem toàn bộ thư viện prompt')}
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h13" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </section>
        )}

        {/* ── TOP AI FINDER ─────────────────────────────────────── */}
        {!c.aiFinder.hidden && (
          <section className="section reveal">
            <div className="wrap">
              <div className="ai-finder">
                <div
                  className="eyebrow"
                  style={{
                    background: 'rgba(0,111,230,.10)',
                    borderColor: 'rgba(0,111,230,.35)',
                    color: 'var(--blue-mkt)',
                  }}
                >
                  {c.aiFinder.eyebrow}
                </div>
                <h2>{c.aiFinder.heading}</h2>
                <p>{c.aiFinder.description}</p>
                <div className="ai-box">
                  <input
                    placeholder={c.aiFinder.placeholder}
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && setAiResult(aiQuery.trim() ? 'done' : 'empty')}
                  />
                  <button onClick={() => setAiResult(aiQuery.trim() ? 'done' : 'empty')}>
                    {c.aiFinder.buttonText}
                  </button>
                </div>
                <div style={{ marginTop: 18, color: 'var(--muted)', fontSize: 14 }}>
                  {aiResult === 'empty' && c.aiFinder.emptyText}
                  {aiResult === 'done' && (
                    <>
                      <b style={{ color: '#FF9700' }}>{c.aiFinder.resultLabel}</b>{' '}
                      {c.aiFinder.resultBody}{' '}
                      <span style={{ color: '#8A94A6' }}>{c.aiFinder.resultNote}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <TudFooter header={c.header} footer={c.footer} />
    </div>
  )
}

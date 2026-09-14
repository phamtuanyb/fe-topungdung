import { anhChiaSe } from '@/lib/anh-chia-se'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { Category, Post } from '@/types'
import type { TudAppMeta } from '@/types/tud'
import {
  getCategories,
  getCategoryPosts,
  getPost,
  getTudHomeConfig,
  getVoteSummary,
} from '@/lib/api/public'
import { mergeTudConfig } from '../../default-config'
import { TudFooter, TudHeader } from '../../_components/TudChrome'
import VoteWidget from '../../_components/VoteWidget'
import { collectCategoryIds, pathToCategory } from '@/lib/category-tree'

export const revalidate = 60

interface Props {
  params: { slug: string }
}

function meta(post?: Post | null): TudAppMeta {
  const cfg = post?.productPageConfig as unknown as { app?: TudAppMeta } | null | undefined
  return cfg?.app ?? {}
}

/** Chỉ các bài trong cây danh mục "ung-dung" mới được phục vụ ở /app/... */
async function loadApp(slug: string): Promise<{ post: Post; cats: Category[] } | null> {
  const [post, catsRes] = await Promise.all([
    getPost(slug)
      .then((r) => r.data)
      .catch(() => null),
    getCategories().catch(() => ({ data: [] as Category[] })),
  ])
  if (!post) return null

  const cats = catsRes.data
  // Nhận cả app nằm ở nhóm con sâu nhiều cấp (ung-dung › ai › tao-anh)
  const appIds = collectCategoryIds(cats, 'ung-dung')
  const catId = post.category?.id ?? post.categoryId
  const isApp = catId != null && appIds.has(catId)

  return isApp ? { post, cats } : null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await loadApp(params.slug)
  if (!found) return { title: { absolute: 'Không tìm thấy ứng dụng' } }

  const { post } = found
  const m = meta(post)
  return {
    title: {
      absolute: post.seoTitle || `${post.title} — đánh giá ${m.score ?? ''} | TopỨngDụng`.trim(),
    },
    description: post.seoDescription || m.tagline || post.excerpt || undefined,
    alternates: { canonical: `/app/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: anhChiaSe(post.thumbnail, m.shots?.[0]?.url),
      type: 'article',
    },
  }
}

/** Tiêu đề chung cho từng khối trong bài. */
function Head({ eyebrow, title, note }: { eyebrow: string; title: string; note?: string }) {
  return (
    <div className="section-title">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2 style={{ marginTop: 14, fontSize: 'clamp(26px,3vw,40px)' }}>{title}</h2>
      </div>
      {note && <p>{note}</p>}
    </div>
  )
}

export default async function AppDetailPage({ params }: Props) {
  const found = await loadApp(params.slug)
  if (!found) notFound()

  const { post, cats } = found
  const m = meta(post)

  // Chuỗi danh mục đầy đủ từ nhóm lớn tới nhóm con: [AI, AI lập trình].
  // Trang danh mục nằm ở /ungdung/<nhóm>/<nhóm con>; trước đây vụn đường dẫn
  // chỉ ghép slug của nhóm con nên "/ungdung/lap-trinh" trả 404.
  const chuoiDanhMuc = post.category
    ? pathToCategory(cats, cats.find((c) => c.id === post.category!.id) ?? post.category)
    : []
  const duongDanhMuc = (i: number) =>
    `/ungdung/${chuoiDanhMuc.slice(0, i + 1).map((c) => c.slug).join('/')}`

  const cfgRes = await getTudHomeConfig().catch(() => ({ data: null }))
  const config = mergeTudConfig(cfgRes.data)

  // Số phiếu thật của khách, dùng cho dữ liệu cấu trúc. Trước đây chỗ này lấy
  // lượt xem làm số lượt đánh giá — khai báo sai sự thật với công cụ tìm kiếm.
  const voteRes = await getVoteSummary(post.slug).catch(() => null)
  const userVotes = voteRes?.data ?? null

  const siblings = post.category?.slug
    ? await getCategoryPosts(post.category.slug, { limit: 50 })
        .then((r) => r.data ?? [])
        .catch(() => [] as Post[])
    : []

  const ranked = [...siblings].sort((a, b) => (meta(b).score ?? 0) - (meta(a).score ?? 0))
  const rankInCat = ranked.findIndex((p) => p.slug === post.slug) + 1
  const related = ranked.filter((p) => p.slug !== post.slug).slice(0, 3)

  const facts = [
    { k: 'Nhà phát triển', v: m.developer },
    { k: 'Nền tảng', v: m.platforms?.length ? m.platforms.join(' · ') : undefined },
    { k: 'Giá', v: m.pricingSummary },
    { k: 'Ngôn ngữ', v: m.languages },
  ].filter((f) => f.v)

  // Structured data: SoftwareApplication + đánh giá, và FAQPage nếu có hỏi đáp.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://topungdung.net'
  const jsonLd: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: post.title,
      description: m.tagline || post.excerpt || undefined,
      applicationCategory: m.kind,
      operatingSystem: m.platforms?.join(', '),
      url: `${siteUrl}/app/${post.slug}`,
      image: post.logoUrl || post.thumbnail || undefined,
      author: m.developer ? { '@type': 'Organization', name: m.developer } : undefined,
      // Chỉ khai báo khi có phiếu thật của người dùng. Điểm biên tập là ý kiến
      // của một người, không phải "tổng hợp đánh giá" nên không khai ở đây.
      ...(userVotes && userVotes.count > 0
        ? {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: userVotes.average,
              bestRating: 5,
              worstRating: 1,
              ratingCount: userVotes.count,
            },
          }
        : {}),
      ...(m.score
        ? {
            review: {
              '@type': 'Review',
              reviewRating: { '@type': 'Rating', ratingValue: m.score, bestRating: 10, worstRating: 0 },
              author: { '@type': 'Organization', name: 'TopỨngDụng' },
              datePublished: post.publishedAt || post.createdAt || undefined,
              reviewBody: m.verdict || post.excerpt || undefined,
            },
          }
        : {}),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Ứng dụng', item: `${siteUrl}/ungdung` },
        ...chuoiDanhMuc.map((c, i) => ({
          '@type': 'ListItem',
          position: 3 + i,
          name: c.name,
          item: `${siteUrl}${duongDanhMuc(i)}`,
        })),
        {
          '@type': 'ListItem',
          position: 3 + chuoiDanhMuc.length,
          name: post.title,
          item: `${siteUrl}/app/${post.slug}`,
        },
      ],
    },
  ]
  if (m.faq && m.faq.length > 0) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: m.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    })
  }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TudHeader config={config.header} />

      <main>
        {/* ── BREADCRUMB ────────────────────────────────────────── */}
        <section className="cat-hero" style={{ paddingBottom: 0 }}>
          <div className="wrap">
            <div className="crumb">
              <a href="/">Trang chủ</a> <span>/</span> <a href="/ungdung">Ứng dụng</a>
              {chuoiDanhMuc.map((c, i) => (
                <span key={c.id}>
                  {' '}
                  <span>/</span> <a href={duongDanhMuc(i)}>{c.name}</a>
                </span>
              ))}{' '}
              <span>/</span> <span>{post.title}</span>
            </div>
          </div>
        </section>

        {/* ── HERO ──────────────────────────────────────────────── */}
        <section className="section" style={{ paddingTop: 18 }}>
          <div className="wrap">
            <div className="app-hero">
              <div>
                <div className="app-head">
                  {post.logoUrl ? (
                    <div className="app-logo" style={{ background: '#EEF3FA', padding: 0, overflow: 'hidden' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.logoUrl}
                        alt={post.title}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 8 }}
                       width={68} height={68} loading="lazy" decoding="async"/>
                    </div>
                  ) : (
                    <div
                      className="app-logo"
                      style={m.logoBg ? { background: m.logoBg, color: '#07101F' } : undefined}
                    >
                      {m.logoText || post.title.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="cat-kind">{m.kind}</div>
                    <h1>{post.title}</h1>
                  </div>
                </div>

                {m.tagline && <p className="app-tagline">{m.tagline}</p>}
                <p>{post.excerpt}</p>

                <div>
                  {(m.tags ?? []).map((t, i) => (
                    <span className="tag" key={i}>
                      {t}
                    </span>
                  ))}
                </div>

                <div className="app-actions">
                  {m.website && (
                    <a
                      className="btn accent"
                      href={m.website}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                    >
                      {m.ctaText || 'Truy cập trang chủ'} ↗
                    </a>
                  )}
                  {chuoiDanhMuc.length > 0 && (
                    <a className="btn dark" href={duongDanhMuc(chuoiDanhMuc.length - 1)}>
                      Xem nhóm {chuoiDanhMuc[chuoiDanhMuc.length - 1].name} →
                    </a>
                  )}
                </div>
              </div>

              <div className="app-score-box">
                <div className="big">{m.score ?? '—'}</div>
                <div className="lbl">ĐIỂM TOPỨNGDỤNG</div>
                {rankInCat > 0 && post.category && (
                  <div className="rank">
                    Hạng <b>#{rankInCat}</b> trong nhóm {post.category.name}
                    {m.trend ? ` · ${m.trend}` : ''}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── THÔNG SỐ NHANH ────────────────────────────────────── */}
        {facts.length > 0 && (
          <section className="section" style={{ paddingTop: 0 }}>
            <div className="wrap">
              <div className="facts">
                {facts.map((f, i) => (
                  <div className="fact" key={i}>
                    <div className="k">{f.k}</div>
                    <div className="v">{f.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── BÌNH CHỌN CỦA NGƯỜI DÙNG ──────────────────────────── */}
        <section className="section" style={{ paddingTop: 34 }}>
          <div className="wrap">
            <Head
              eyebrow="NGƯỜI DÙNG CHẤM"
              title={`Bạn đánh giá ${post.title} thế nào?`}
              note="Điểm này độc lập với điểm của ban biên tập và quyết định thứ hạng ở tab “Người dùng bình chọn”."
            />
            <VoteWidget slug={post.slug} />
          </div>
        </section>

        {/* ── ĐIỂM THÀNH PHẦN ───────────────────────────────────── */}
        {m.scoreBreakdown && m.scoreBreakdown.length > 0 && (
          <section className="section">
            <div className="wrap">
              <Head
                eyebrow="CHẤM ĐIỂM"
                title="Điểm từng tiêu chí"
                note="Điểm tổng là trung bình có trọng số của các tiêu chí bên dưới."
              />
              <div className="app-body">
                <div className="bars">
                  {m.scoreBreakdown.map((b, i) => (
                    <div className="bar-row" key={i}>
                      <div className="lbl">{b.label}</div>
                      <div className="bar-track">
                        <div
                          className="bar-fill"
                          style={{ width: `${Math.max(0, Math.min(100, (b.value / 10) * 100))}%` }}
                        />
                      </div>
                      <div className="num">{b.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── ẢNH SẢN PHẨM ──────────────────────────────────────── */}
        {m.shots && m.shots.length > 0 && (
          <section className="section">
            <div className="wrap">
              <Head eyebrow="HÌNH ẢNH" title="Giao diện sản phẩm" />
              <div className="shots">
                {m.shots.map((s, i) => (
                  <figure className="shot" key={i}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="shot-img" src={s.url} alt={s.caption || `${post.title} ${i + 1}`}  width={640} height={400} loading="lazy" decoding="async"/>
                    {s.caption && <figcaption>{s.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── BÀI REVIEW ────────────────────────────────────────── */}
        {post.content && (
          <section className="section">
            <div className="wrap">
              <Head eyebrow="REVIEW" title={`Đánh giá chi tiết ${post.title}`} />
              <article className="app-body" dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          </section>
        )}

        {/* ── ƯU / NHƯỢC ────────────────────────────────────────── */}
        {((m.pros && m.pros.length > 0) || (m.cons && m.cons.length > 0)) && (
          <section className="section">
            <div className="wrap">
              <Head eyebrow="ĐÁNH GIÁ" title="Điểm mạnh & điểm yếu" />
              <div className="proscons">
                {m.pros && m.pros.length > 0 && (
                  <div className="pc-box good">
                    <h3>Điểm mạnh</h3>
                    <ul>
                      {m.pros.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {m.cons && m.cons.length > 0 && (
                  <div className="pc-box bad">
                    <h3>Điểm yếu</h3>
                    <ul>
                      {m.cons.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {m.bestFor && m.bestFor.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <div className="cat-kind" style={{ marginBottom: 10 }}>
                    Phù hợp nhất với
                  </div>
                  <div className="bestfor">
                    {m.bestFor.map((b, i) => (
                      <span key={i}>{b}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── BẢNG GIÁ ──────────────────────────────────────────── */}
        {m.plans && m.plans.length > 0 && (
          <section className="section">
            <div className="wrap">
              <Head
                eyebrow="CHI PHÍ"
                title={`Các gói của ${post.title}`}
                note="Giá tham khảo tại thời điểm cập nhật bài viết."
              />
              <div className="plans">
                {m.plans.map((pl, i) => (
                  <div className={`plan${pl.featured ? ' featured' : ''}`} key={i}>
                    <h3>{pl.name}</h3>
                    <div>
                      <div className="price">{pl.price}</div>
                      {pl.period && <div className="period">{pl.period}</div>}
                    </div>
                    <ul>
                      {pl.features.map((f, j) => (
                        <li key={j}>{f}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── FAQ ───────────────────────────────────────────────── */}
        {m.faq && m.faq.length > 0 && (
          <section className="section">
            <div className="wrap">
              <Head eyebrow="HỎI ĐÁP" title="Câu hỏi thường gặp" />
              <div className="faq-list">
                {m.faq.map((f, i) => (
                  <div className="faq-item" key={i}>
                    <h3>{f.q}</h3>
                    <p>{f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── KẾT LUẬN ──────────────────────────────────────────── */}
        {m.verdict && (
          <section className="section">
            <div className="wrap">
              <div className="verdict">
                <div className="lbl">KẾT LUẬN</div>
                <p>{m.verdict}</p>
              </div>
            </div>
          </section>
        )}

        {/* ── CÙNG NHÓM ─────────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="section">
            <div className="wrap">
              <Head
                eyebrow="CÙNG NHÓM"
                title="Công cụ tương tự"
                note={`Các lựa chọn khác trong nhóm ${post.category?.name}.`}
              />
              <div className="cat-grid">
                {related.map((p) => {
                  const rm = meta(p)
                  return (
                    <a className="cat-card" href={`/app/${p.slug}`} key={p.id}>
                      <div className="cat-card-top">
                        {p.logoUrl ? (
                          <div
                            className="app-logo"
                            style={{ background: '#EEF3FA', padding: 0, overflow: 'hidden' }}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={p.logoUrl}
                              alt={p.title}
                              style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 6 }}
                             width={68} height={68} loading="lazy" decoding="async"/>
                          </div>
                        ) : (
                          <div
                            className="app-logo"
                            style={rm.logoBg ? { background: rm.logoBg, color: '#07101F' } : undefined}
                          >
                            {rm.logoText || p.title.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="score">{rm.score}</div>
                      </div>
                      <div className="cat-kind">{rm.kind}</div>
                      <h3>{p.title}</h3>
                      <p>{p.excerpt}</p>
                    </a>
                  )
                })}
              </div>
            </div>
          </section>
        )}
      </main>

      <TudFooter header={config.header} footer={config.footer} />
    </div>
  )
}

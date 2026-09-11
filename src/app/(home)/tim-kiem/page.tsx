import type { Metadata } from 'next'
import type { Category, Post } from '@/types'
import { getCategories, getTudHomeConfig, searchPosts } from '@/lib/api/public'
import type { TudAppMeta } from '@/types/tud'
import { mergeTudConfig } from '../default-config'
import { TudFooter, TudHeader } from '../_components/TudChrome'
import { collectCategoryIds } from '@/lib/category-tree'

export const metadata: Metadata = {
  title: { absolute: 'Tìm kiếm | TopỨngDụng' },
  description: 'Tìm ứng dụng, phần mềm, công cụ AI và bài viết trên TopỨngDụng.',
  robots: { index: false, follow: true },
}

function meta(p: Post): TudAppMeta {
  const cfg = p.productPageConfig as unknown as { app?: TudAppMeta } | null | undefined
  return cfg?.app ?? {}
}

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = (searchParams.q ?? '').trim()

  const [cfgRes, catsRes, resultRes] = await Promise.all([
    getTudHomeConfig().catch(() => ({ data: null })),
    getCategories().catch(() => ({ data: [] as Category[] })),
    q.length >= 2
      ? searchPosts(q, 60).catch(() => ({ data: [] as Post[] }))
      : Promise.resolve({ data: [] as Post[] }),
  ])

  const config = mergeTudConfig(cfgRes.data)
  const cats = catsRes.data ?? []
  const appCatIds = collectCategoryIds(cats, 'ung-dung')

  const all = resultRes.data ?? []
  const isApp = (p: Post) => appCatIds.has(p.category?.id ?? p.categoryId ?? -1)
  const apps = all.filter(isApp)
  // Bài của Vsoftware cũ không còn trang công khai nên bỏ khỏi kết quả
  const posts = all.filter(
    (p) => !isApp(p) && !['services', 'ai-agent'].includes(p.category?.slug ?? ''),
  )
  const total = apps.length + posts.length

  return (
    <div>
      <TudHeader config={config.header} />

      <main>
        <section className="cat-hero">
          <div className="wrap">
            <div className="crumb">
              <a href="/">Trang chủ</a> <span>/</span> <span>Tìm kiếm</span>
            </div>
            <div className="eyebrow">KẾT QUẢ TÌM KIẾM</div>
            <h1>{q ? `“${q}”` : 'Tìm kiếm'}</h1>
            <p>
              {q.length < 2
                ? 'Nhập từ khoá ít nhất 2 ký tự để tìm ứng dụng và bài viết.'
                : total === 0
                  ? 'Không tìm thấy kết quả nào.'
                  : `Tìm thấy ${total} kết quả — ${apps.length} ứng dụng, ${posts.length} bài viết.`}
            </p>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            {total === 0 ? (
              <div className="cat-empty">
                {q.length < 2 ? (
                  <>
                    Bấm nút <b>Tìm kiếm</b> trên thanh menu, hoặc{' '}
                    <a href="/ungdung">duyệt theo nhóm nhu cầu</a>.
                  </>
                ) : (
                  <>
                    Không có gì khớp với “{q}”. Thử từ khoá ngắn hơn, xem{' '}
                    <a href="/ranking">bảng xếp hạng</a> hoặc{' '}
                    <a href="/ungdung">duyệt theo nhóm nhu cầu</a>.
                  </>
                )}
              </div>
            ) : (
              <>
                {apps.length > 0 && (
                  <>
                    <div className="section-title" style={{ marginBottom: 18 }}>
                      <div>
                        <h2 style={{ fontSize: 28 }}>Ứng dụng ({apps.length})</h2>
                      </div>
                    </div>
                    <ol className="tapp-list" style={{ marginBottom: 40 }}>
                      {apps.map((p, i) => {
                        const m = meta(p)
                        return (
                          <li key={p.id}>
                            <a className="tapp-row co-so" href={`/app/${p.slug}`}>
                              <span className="tapp-step">{String(i + 1).padStart(2, '0')}</span>
                              {p.logoUrl ? (
                                <div className="app-logo tapp-logo tapp-logo-img">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={p.logoUrl} alt={p.title}  width={68} height={68} loading="lazy" decoding="async"/>
                                </div>
                              ) : (
                                <div
                                  className="app-logo tapp-logo"
                                  style={m.logoBg ? { background: m.logoBg, color: '#07101F' } : undefined}
                                >
                                  {m.logoText || p.title.slice(0, 2).toUpperCase()}
                                </div>
                              )}
                              <div className="tapp-main">
                                <b>{p.title}</b>
                                <span className="tapp-note">{m.kind || p.category?.name}</span>
                                {p.excerpt ? <span className="tapp-tagline">{p.excerpt}</span> : null}
                              </div>
                              <div className="tapp-side">
                                {m.score ? (
                                  <span className="tapp-score">
                                    <b>{m.score}</b>
                                    <small>/10</small>
                                  </span>
                                ) : null}
                                <span className="tapp-go">
                                  Xem review
                                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M5 12h13" />
                                    <path d="M12 5l7 7-7 7" />
                                  </svg>
                                </span>
                              </div>
                            </a>
                          </li>
                        )
                      })}
                    </ol>
                  </>
                )}

                {posts.length > 0 && (
                  <>
                    <div className="section-title" style={{ marginBottom: 18 }}>
                      <div>
                        <h2 style={{ fontSize: 28 }}>Bài viết ({posts.length})</h2>
                      </div>
                    </div>
                    <div className="news-grid">
                      {posts.map((p) => (
                        <a className="news-card" href={`/tin-tuc/${p.slug}`} key={p.id}>
                          {p.thumbnail ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img className="news-thumb" src={p.thumbnail} alt={p.title}  width={640} height={360} loading="lazy" decoding="async"/>
                          ) : (
                            <div className="news-thumb img-slot">Ảnh</div>
                          )}
                          <div className="news-body">
                            <div className="meta">{p.category?.name?.toUpperCase() ?? 'BÀI VIẾT'}</div>
                            <h3>{p.title}</h3>
                            <p>{p.excerpt}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <TudFooter header={config.header} footer={config.footer} />
    </div>
  )
}

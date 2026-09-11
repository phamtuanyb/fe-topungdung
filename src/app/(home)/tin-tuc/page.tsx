import type { Metadata } from 'next'
import type { Category, Post } from '@/types'
import { getCategories, getCategoryPosts, getTudHomeConfig } from '@/lib/api/public'
import { mergeTudConfig } from '../default-config'
import { TudFooter, TudHeader } from '../_components/TudChrome'

export const revalidate = 60

export const metadata: Metadata = {
  title: { absolute: 'Tin tức & Review công cụ | TopỨngDụng' },
  description: 'Review, so sánh, hướng dẫn và tổng hợp về ứng dụng, phần mềm và công cụ AI.',
  alternates: { canonical: '/tin-tuc' },
}

export default async function NewsIndexPage() {
  const [cfgRes, postsRes, catsRes] = await Promise.all([
    getTudHomeConfig().catch(() => ({ data: null })),
    getCategoryPosts('tin-tuc', { limit: 60 }).catch(() => ({ data: [] as Post[] })),
    getCategories().catch(() => ({ data: [] as Category[] })),
  ])

  const config = mergeTudConfig(cfgRes.data)
  const posts = postsRes.data ?? []

  // Chuyên mục con của "tin-tuc" để hiện thành các chip lọc
  const root = catsRes.data.find((c) => c.slug === 'tin-tuc')
  const subs = root ? catsRes.data.filter((c) => c.parentId === root.id) : []

  const [featured, ...rest] = posts

  return (
    <div>
      <TudHeader config={config.header} />

      <main>
        <section className="cat-hero">
          <div className="wrap">
            <div className="crumb">
              <a href="/">Trang chủ</a> <span>/</span> <span>Tin tức</span>
            </div>
            <div className="eyebrow">{config.edit.eyebrow}</div>
            <h1>{config.edit.heading}</h1>
            <p>{config.edit.description}</p>
          </div>
        </section>

        {subs.length > 0 && (
          <section className="section" style={{ paddingTop: 20, paddingBottom: 0 }}>
            <div className="wrap">
              <div className="chips">
                {subs.map((c) => (
                  <a className="chip" href={`/chuyen-muc/${c.slug}`} key={c.id}>
                    {c.name}
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="section">
          <div className="wrap">
            {posts.length === 0 ? (
              // Đây là trang công khai: hướng dẫn quản trị không thuộc về đây.
              <div className="cat-empty">
                Chuyên mục này chưa có bài viết. Mời bạn xem{' '}
                <a href="/ungdung">kho ứng dụng</a> hoặc{' '}
                <a href="/topapp">bảng xếp hạng TopỨngDụng 100</a>.
              </div>
            ) : (
              <>
                {featured && (
                  <div className="editorial" style={{ marginBottom: 16 }}>
                    <article className="story">
                      <a href={`/tin-tuc/${featured.slug}`}>
                        <div className={`story-image${featured.thumbnail ? ' co-anh' : ''}`}>
                          {featured.thumbnail ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={featured.thumbnail}
                              alt={featured.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                             width={400} height={400} loading="lazy" decoding="async"/>
                          ) : (
                            <div className="img-slot">Ảnh bài viết</div>
                          )}
                        </div>
                        <div className="story-body">
                          <div className="meta">
                            {featured.category?.name?.toUpperCase() ?? 'BÀI VIẾT'}
                          </div>
                          <h3>{featured.title}</h3>
                          <p style={{ color: 'var(--muted)' }}>{featured.excerpt}</p>
                        </div>
                      </a>
                    </article>
                    <div className="story-list">
                      {rest.slice(0, 3).map((p) => (
                        <a className="story-small" href={`/tin-tuc/${p.slug}`} key={p.id}>
                          <div className="story-thumb">
                            {p.thumbnail ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={p.thumbnail}
                                alt={p.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                               width={400} height={400} loading="lazy" decoding="async"/>
                            ) : (
                              <div className="img-slot">Ảnh</div>
                            )}
                          </div>
                          <div>
                            <span>{p.category?.name?.toUpperCase() ?? 'BÀI VIẾT'}</span>
                            <h4>{p.title}</h4>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {rest.length > 3 && (
                  <div className="news-grid">
                    {rest.slice(3).map((p) => (
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

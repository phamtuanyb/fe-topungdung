import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import type { Category, Post } from '@/types'
import { getCategories, getCategoryPosts, getTudHomeConfig } from '@/lib/api/public'
import { mergeTudConfig } from '../../default-config'
import { TudFooter, TudHeader } from '../../_components/TudChrome'
import { collectCategoryIds, pathToCategory } from '@/lib/category-tree'

export const revalidate = 60

interface Props {
  params: { slug: string }
}

async function findCategory(slug: string) {
  const res = await getCategories().catch(() => ({ data: [] as Category[] }))
  const all = res.data ?? []
  return { all, cat: all.find((c) => c.slug === slug) ?? null }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cat } = await findCategory(params.slug)
  if (!cat) return { title: { absolute: 'Không tìm thấy chuyên mục | TopỨngDụng' } }
  return {
    title: { absolute: `${cat.name} | TopỨngDụng` },
    description: cat.description || `Bài viết trong chuyên mục ${cat.name}.`,
    alternates: { canonical: `/chuyen-muc/${params.slug}` },
  }
}

export default async function ChuyenMucPage({ params }: Props) {
  const [cfgRes, { all, cat }] = await Promise.all([
    getTudHomeConfig().catch(() => ({ data: null })),
    findCategory(params.slug),
  ])

  if (!cat) notFound()

  // Danh mục ứng dụng đã có đường riêng /ungdung/<slug>. Chuyển hướng sang đó
  // để một nội dung không nằm ở hai URL khác nhau.
  const appIds = collectCategoryIds(all, 'ung-dung')
  if (appIds.has(cat.id)) {
    redirect(`/ungdung/${pathToCategory(all, cat).map((c) => c.slug).join('/')}`)
  }

  const config = mergeTudConfig(cfgRes.data)
  const posts = (await getCategoryPosts(cat.slug, { limit: 60 }).catch(() => ({
    data: [] as Post[],
  }))).data ?? []

  // Các chuyên mục cùng cấp để chuyển qua lại nhanh
  const siblings = all.filter((c) => c.parentId === cat.parentId && c.id !== cat.id)
  const parent = all.find((c) => c.id === cat.parentId) ?? null

  const [featured, ...rest] = posts

  return (
    <div>
      <TudHeader config={config.header} />

      <main>
        <section className="cat-hero">
          <div className="wrap">
            <div className="crumb">
              <a href="/">Trang chủ</a> <span>/</span>
              {parent ? (
                <>
                  <a href={parent.slug === 'tin-tuc' ? '/tin-tuc' : `/chuyen-muc/${parent.slug}`}>
                    {parent.name}
                  </a>{' '}
                  <span>/</span>
                </>
              ) : null}{' '}
              <span>{cat.name}</span>
            </div>
            <div className="eyebrow">CHUYÊN MỤC</div>
            <h1>{cat.name}</h1>
            <p>{cat.description || `Tất cả bài viết thuộc chuyên mục ${cat.name}.`}</p>
            <div className="art-meta">
              <span>{posts.length} bài viết</span>
            </div>
          </div>
        </section>

        {siblings.length > 0 && (
          <section className="section" style={{ paddingTop: 20, paddingBottom: 0 }}>
            <div className="wrap">
              <div className="chips">
                <a className="chip" href="/tin-tuc">
                  Tất cả
                </a>
                {siblings.map((c) => (
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
              <div className="cat-empty">
                Chuyên mục <b>{cat.name}</b> chưa có bài viết nào.{' '}
                <a href="/tin-tuc">Xem tất cả tin tức →</a>
              </div>
            ) : (
              <>
                {featured && (
                  <div className="editorial" style={{ marginBottom: 16 }}>
                    <article className="story">
                      <a href={`/tin-tuc/${featured.slug}`}>
                        <div className="story-image">
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
                          <div className="meta">{cat.name.toUpperCase()}</div>
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
                            <span>{p.category?.name?.toUpperCase() ?? cat.name.toUpperCase()}</span>
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
                          <div className="meta">
                            {p.category?.name?.toUpperCase() ?? cat.name.toUpperCase()}
                          </div>
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

import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import type { Category, Post } from '@/types'
import type { TudAppMeta, TudRelatedConfig } from '@/types/tud'
import {
  getCategories,
  getCategoryPosts,
  getPost,
  getTudHomeConfig,
  getTudRelated,
} from '@/lib/api/public'
import { mergeTudConfig } from '../../default-config'
import { TudFooter, TudHeader } from '../../_components/TudChrome'
import { collectCategoryIds, pathToCategory } from '@/lib/category-tree'
import { categoryIcon } from '../../_components/intent-icons'
import CategoryApps, { type CategoryAppItem } from '../../_components/CategoryApps'

export const revalidate = 60

interface Props {
  params: { slug: string[] }
}

function meta(post: Post): TudAppMeta {
  const cfg = post.productPageConfig as unknown as { app?: TudAppMeta } | null | undefined
  return cfg?.app ?? {}
}

/**
 * Đọc đường dẫn nhiều cấp: /ungdung/ai/tao-anh → tổ tiên [Ứng dụng, AI] + danh mục "AI tạo ảnh".
 * Trả về null nếu đoạn cuối không tồn tại, hoặc chuỗi cha–con không khớp thực tế.
 */
async function resolvePath(segments: string[]) {
  const res = await getCategories().catch(() => ({ data: [] as Category[] }))
  const all = res.data ?? []
  const root = all.find((c) => c.slug === 'ung-dung') ?? null

  const chain: Category[] = []
  let parentId = root?.id ?? null

  for (const seg of segments) {
    const found = all.find((c) => c.slug === seg && c.parentId === parentId)
    if (!found) return null
    chain.push(found)
    parentId = found.id
  }

  const cat = chain[chain.length - 1]
  const children = all.filter((c) => c.parentId === cat.id)
  return { all, chain, cat, children }
}

const hrefOf = (chain: Category[], i: number) =>
  `/ungdung/${chain.slice(0, i + 1).map((c) => c.slug).join('/')}`

/**
 * Đường dẫn thiếu tầng → đường đầy đủ, hoặc null.
 *
 * Slug danh mục là duy nhất toàn hệ thống, nên "/ungdung/lap-trinh" chỉ có
 * thể là "/ungdung/ai/lap-trinh". Nhiều chỗ từng dựng liên kết bằng đúng một
 * slug (vụn đường dẫn trang app, thẻ trang chủ do admin nhập), và liên kết
 * cũ ngoài site cũng vậy — thay vì 404, chuyển hướng 301 về đường đúng để
 * người đọc lẫn Google cùng đi tới một nơi.
 */
async function duongDayDu(segments: string[]): Promise<string | null> {
  const res = await getCategories().catch(() => ({ data: [] as Category[] }))
  const all = res.data ?? []
  const cuoi = all.find((c) => c.slug === segments[segments.length - 1])
  if (!cuoi || !collectCategoryIds(all, 'ung-dung').has(cuoi.id)) return null
  const day = pathToCategory(all, cuoi).map((c) => c.slug).join('/')
  return day === segments.join('/') ? null : `/ungdung/${day}`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await resolvePath(params.slug)
  if (!found) return { title: { absolute: 'Không tìm thấy danh mục' } }
  const { cat, chain } = found
  const path = chain.map((c) => c.slug).join('/')
  return {
    title: { absolute: `${cat.name} — công cụ tốt nhất | TopỨngDụng` },
    description: cat.description || `Danh sách ứng dụng ${cat.name} được xếp hạng trên TopỨngDụng.`,
    alternates: { canonical: `/ungdung/${path}` },
  }
}

export default async function CategoryPage({ params }: Props) {
  // Không nhận đường dẫn quá 3 cấp — tránh sinh URL trùng nội dung vô hạn
  if (params.slug.length > 3) notFound()

  const found = await resolvePath(params.slug)
  if (!found) {
    const day = await duongDayDu(params.slug)
    if (day) permanentRedirect(day)
    notFound()
  }

  const { chain, cat, children } = found

  const [cfgRes, postsRes, relRes] = await Promise.all([
    getTudHomeConfig().catch(() => ({ data: null })),
    // Backend tự gom cả app của các nhóm con nên trang tổng vẫn đủ số liệu
    getCategoryPosts(cat.slug, { limit: 200 }).catch(() => ({ data: [] as Post[] })),
    getTudRelated().catch(() => ({ data: {} as TudRelatedConfig })),
  ])

  const config = mergeTudConfig(cfgRes.data)
  const apps = [...(postsRes.data ?? [])].sort(
    (a, b) => (meta(b).score ?? 0) - (meta(a).score ?? 0),
  )

  // Khối "công cụ liên quan": app thuộc danh mục khác nhưng phục vụ nhóm này.
  // Bỏ qua slug không tồn tại hoặc đã nằm sẵn trong danh sách bên trên.
  const related = (relRes.data ?? {})[cat.slug] ?? null
  const coSan = new Set(apps.map((p) => p.slug))
  const relatedPosts: Post[] = related
    ? (
        await Promise.all(
          related.slugs
            .filter((s) => !coSan.has(s))
            .map((s) => getPost(s).then((r) => r.data).catch(() => null)),
        )
      ).filter((p): p is Post => Boolean(p))
    : []

  // Đếm số app mỗi nhóm con để hiện trên thẻ
  const countOf = (slug: string) => apps.filter((p) => p.category?.slug === slug).length

  const card = config.discover.cards.find((c) => c.categorySlug === cat.slug)
  // Nhóm cấp 2 quyết định biểu tượng; danh mục cấp 3 mượn biểu tượng của nhóm
  // cha khi slug của nó không khớp từ khoá nào.
  const groupSlug = chain[0]?.slug ?? cat.slug
  const heroIcon = categoryIcon(cat.slug, groupSlug)

  const toItem = (p: Post): CategoryAppItem => {
    const m = meta(p)
    return {
      slug: p.slug,
      title: p.title,
      kind: m.kind ?? '',
      score: m.score ?? null,
      excerpt: p.excerpt ?? '',
      logoUrl: p.logoUrl ?? null,
      logoText: m.logoText || p.title.slice(0, 2).toUpperCase(),
      logoBg: m.logoBg,
      // Ưu tiên tag do biên tập đặt, chưa có thì lấy nền tảng hỗ trợ
      tags: (m.tags?.length ? m.tags : (m.platforms ?? [])).map((t) => t.replace(/^✓\s*/, '')),
    }
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://topungdung.net'

  // Breadcrumb đủ cấp: Trang chủ › Ứng dụng › AI › AI tạo ảnh
  const crumbs = [
    { name: 'Trang chủ', item: siteUrl },
    { name: 'Ứng dụng', item: `${siteUrl}/ungdung` },
    ...chain.map((c, i) => ({ name: c.name, item: `${siteUrl}${hrefOf(chain, i)}` })),
  ]
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.item,
    })),
  }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TudHeader config={config.header} />

      <main>
        <section className="cat-hero">
          <div className="wrap">
            <div className="crumb">
              <a href="/">Trang chủ</a> <span>/</span> <a href="/ungdung">Ứng dụng</a>
              {chain.slice(0, -1).map((c, i) => (
                <span key={c.id}>
                  {' '}
                  <span>/</span> <a href={hrefOf(chain, i)}>{c.name}</a>
                </span>
              ))}{' '}
              <span>/</span> <span>{cat.name}</span>
            </div>
            <div className="cat-hero-row">
              <div className="cat-hero-main">
                <div className="eyebrow eyebrow-flat">
                  <span className="dot" /> {card?.num ?? cat.name.toUpperCase()}
                </div>
                <h1 className="h2-blue">
                  {card?.title ?? cat.name}
                  {card?.titleAccent && (
                    <>
                      {' '}
                      <span className="h2-accent-warm">{card.titleAccent}</span>
                    </>
                  )}
                </h1>
                <p>
                  {cat.description ||
                    `Danh sách công cụ ${cat.name} được xếp hạng theo điểm đánh giá.`}
                </p>
                <div className="cat-stats">
                  <span>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h6v6H4z" />
                      <path d="M14 4h6v6h-6z" />
                      <path d="M4 14h6v6H4z" />
                      <path d="M14 14h6v6h-6z" />
                    </svg>
                    {apps.length} công cụ
                  </span>
                  {children.length > 0 && (
                    <span>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 3l9 5-9 5-9-5 9-5z" />
                        <path d="M3 13l9 5 9-5" />
                      </svg>
                      {children.length} nhóm nhỏ
                    </span>
                  )}
                </div>
              </div>

              {/* Ô biểu tượng trang trí, ẩn với trình đọc màn hình */}
              <div className="cat-hero-art" aria-hidden="true">
                <span className="cat-hero-ico">
                  <svg viewBox="0 0 24 24" width="86" height="86" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                    {heroIcon.map((d, i) => (
                      <path d={d} key={i} />
                    ))}
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Nhóm con — chỉ hiện khi danh mục này có nhánh bên dưới */}
        {children.length > 0 && (
          <section className="section" style={{ paddingBottom: 0 }}>
            <div className="wrap">
              <div className="section-title">
                <div>
                  <h2 style={{ fontSize: 'clamp(24px,2.6vw,34px)' }}>Chọn theo việc bạn cần làm</h2>
                </div>
                <p>Mỗi nhóm nhỏ tập hợp các công cụ giải quyết cùng một loại công việc.</p>
              </div>
              <div className="subcat-grid">
                {children.map((c) => (
                  <a className="subcat" href={`${hrefOf(chain, chain.length - 1)}/${c.slug}`} key={c.id}>
                    <span className="subcat-head">
                      <span className="subcat-ico" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                          {categoryIcon(c.slug, groupSlug).map((d, i) => (
                            <path d={d} key={i} />
                          ))}
                        </svg>
                      </span>
                      <span className="subcat-text">
                        <b>{c.name}</b>
                        <span>{c.description}</span>
                      </span>
                    </span>
                    <span className="subcat-foot">
                      <span className="subcat-count">{countOf(c.slug)} công cụ</span>
                      <span className="subcat-go">
                        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h13" />
                          <path d="M12 5l7 7-7 7" />
                        </svg>
                      </span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="section">
          <div className="wrap">
            <CategoryApps
              items={apps.map(toItem)}
              heading={children.length > 0 ? 'Tất cả' : 'Trong nhóm này'}
              headingAccent={`${apps.length} công cụ`}
              emptyHint={
                <>
                  Nhóm <b>{cat.name}</b> đang được xây dựng, chưa có bài đánh giá nào.{' '}
                  <a href="/ungdung">Xem các nhóm khác</a> hoặc{' '}
                  <a href="/lien-he">đề xuất ứng dụng</a> bạn muốn chúng tôi viết.
                </>
              }
            />
          </div>
        </section>

        {/* Công cụ ở danh mục khác nhưng liên quan tới nhóm này. Xem getTudRelated(). */}
        {related && relatedPosts.length > 0 && (
          <section className="section" style={{ paddingTop: 0 }}>
            <div className="wrap">
              <div className="section-title">
                <div>
                  <h2 style={{ fontSize: 'clamp(22px,2.4vw,32px)' }}>{related.title}</h2>
                </div>
                {related.note && <p>{related.note}</p>}
              </div>
              <CategoryApps items={relatedPosts.map(toItem)} />
            </div>
          </section>
        )}
      </main>

      <TudFooter header={config.header} footer={config.footer} />
    </div>
  )
}

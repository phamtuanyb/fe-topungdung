import { ANH_CHIA_SE_MAC_DINH } from '@/lib/anh-chia-se'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { Category, Post } from '@/types'
import { getCategories, getCategoryPosts, getPost, getTudHomeConfig } from '@/lib/api/public'
import { mergeTudConfig } from '../../default-config'
import { TudFooter, TudHeader } from '../../_components/TudChrome'
import { PROMPT_FALLBACK, PROMPT_STYLES, fullSlug, shortSlug } from '../prompt-meta'
import { promptItemIcon } from '../prompt-item-icons'
import PromptCopyBlock from '../PromptCopyBlock'
import PromptRelated, { type RelatedItem } from '../PromptRelated'
import { splitPromptContent } from '../split-content'
import { timUngDung } from '../tool-link'

export const revalidate = 60

/** Fallback dùng tên miền thật, đồng bộ với mọi trang khác và với sitemap.ts. */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://topungdung.net'

/** Bóc thẻ HTML để lấy phần chữ, dùng cho articleBody trong dữ liệu có cấu trúc. */
function plain(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Cắt tiêu đề làm hai vế để H1 tô hai màu, giống các tiêu đề khác của site.
 *
 * Cắt ở ranh giới từ gần giữa câu nhất chứ không cắt ở khoảng trắng đầu tiên:
 * tiêu đề prompt thường dài, cắt sớm thì vế xanh lẻ loi một hai chữ. Tiêu đề
 * quá ngắn thì để nguyên một màu, chia đôi chỉ làm câu gãy vô nghĩa.
 */
function chiaTieuDe(title: string): [string, string] {
  const t = title.trim()
  const tu = t.split(/\s+/)
  if (tu.length < 4) return [t, '']
  let cong = 0
  let giua = 0
  for (let i = 0; i < tu.length; i++) {
    cong += tu[i].length + 1
    if (cong >= t.length * 0.52) {
      giua = i + 1
      break
    }
  }
  if (giua <= 0 || giua >= tu.length) giua = Math.ceil(tu.length / 2)
  return [tu.slice(0, giua).join(' '), tu.slice(giua).join(' ')]
}

interface Props {
  params: { slug: string[] }
}

/**
 * Một route lo hai mức, giống cách `/ungdung/[...slug]` đang làm:
 *   /prompt/<nhóm>            → danh sách prompt của nhóm
 *   /prompt/<nhóm>/<prompt>   → chi tiết một prompt
 */
async function load(slug: string[]) {
  const [catSlug, postSlug] = slug
  const cats = await getCategories()
    .then((r) => r.data)
    .catch(() => [] as Category[])

  const cat = cats.find((c) => c.slug === fullSlug(catSlug ?? ''))
  return { cats, cat, postSlug }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cat, postSlug } = await load(params.slug)
  if (!cat) return {}

  if (postSlug) {
    const post = await getPost(postSlug)
      .then((r) => r.data)
      .catch(() => null)
    if (!post) return {}
    const url = `/prompt/${shortSlug(cat.slug)}/${post.slug}`
    return {
      title: { absolute: post.seoTitle || `${post.title} | Prompt ${cat.name}` },
      description: post.seoDescription || post.excerpt || undefined,
      keywords: post.seoKeywords || undefined,
      alternates: { canonical: url },
      openGraph: {
        // Khai openGraph ở đây thì Next thay hẳn khối của layout gốc, kéo theo
        // mất luôn ảnh chia sẻ mặc định, chia sẻ ra Facebook/Zalo
        // chỉ còn thẻ chữ. Trỏ lại đúng ảnh đó.
        images: [ANH_CHIA_SE_MAC_DINH],
        title: post.title,
        description: post.excerpt || undefined,
        type: 'article',
        url,
      },
    }
  }

  const url = `/prompt/${shortSlug(cat.slug)}`
  return {
    title: { absolute: `Prompt ${cat.name} | TopỨngDụng` },
    description: cat.description || `Tổng hợp prompt cho ${cat.name.toLowerCase()}.`,
    alternates: { canonical: url },
    openGraph: {
      // Khai openGraph ở đây thì Next thay hẳn khối của layout gốc, kéo theo
      // mất luôn ảnh chia sẻ mặc định, chia sẻ ra Facebook/Zalo
      // chỉ còn thẻ chữ. Trỏ lại đúng ảnh đó.
      images: [ANH_CHIA_SE_MAC_DINH],
      title: `Prompt ${cat.name}`,
      description: cat.description || undefined,
      type: 'website',
      url,
    },
  }
}

export default async function PromptCatPage({ params }: Props) {
  if (params.slug.length > 2) notFound()

  const [cfgRes, loaded] = await Promise.all([
    getTudHomeConfig().catch(() => ({ data: null })),
    load(params.slug),
  ])
  const { cat, postSlug } = loaded
  if (!cat) notFound()

  const config = mergeTudConfig(cfgRes.data)
  const st = PROMPT_STYLES[cat.slug] ?? PROMPT_FALLBACK

  // ── Chi tiết một prompt ──────────────────────────────────────────────────
  if (postSlug) {
    const post = await getPost(postSlug)
      .then((r) => r.data)
      .catch(() => null)
    if (!post || post.category?.slug !== cat.slug) notFound()

    const parts = splitPromptContent(post.content ?? '')
    // Bài gom theo nhóm có nhiều đoạn prompt: nhãn khối chuyển sang dạng gọn.
    const nhieu = parts.sections.filter((x) => x.kind === 'prompt').length > 1
    const phanGiaiThich = parts.sections
      .map((x) => (x.kind === 'html' ? x.html : ''))
      .join(' ')

    // Lấy rộng hơn ba thẻ nhìn thấy để dải ngang có cái mà cuộn.
    const related: RelatedItem[] = await getCategoryPosts(cat.slug, { limit: 10 })
      .then((r) =>
        (r.data ?? [])
          .filter((p) => p.slug !== post.slug)
          .slice(0, 9)
          .map((p) => ({
            id: p.id,
            href: `/prompt/${shortSlug(cat.slug)}/${p.slug}`,
            title: p.title,
            excerpt: p.excerpt ?? '',
            d: promptItemIcon(p.title, cat.slug),
          })),
      )
      .catch(() => [] as RelatedItem[])

    const [tdDau, tdSau] = chiaTieuDe(post.title)

    // Mỗi tên công cụ tra về bài ứng dụng tương ứng để viên chữ thành lối đi
    // tiếp trong site. Tra song song, và tên nào không có bài thì để chữ thường.
    const congCu = await Promise.all(
      parts.hopVoi.map(async (ten) => ({ ten, slug: await timUngDung(ten) })),
    )

    const url = `${SITE_URL}/prompt/${shortSlug(cat.slug)}/${post.slug}`

    // Dữ liệu có cấu trúc: giúp công cụ tìm kiếm hiểu trang, và giúp các máy
    // trả lời bằng AI trích đúng đoạn prompt thay vì đoán từ HTML.
    const jsonLd = [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt || post.seoDescription || parts.dungDe || undefined,
        articleBody: [parts.promptText, plain(phanGiaiThich)].filter(Boolean).join('\n\n'),
        keywords: post.seoKeywords || undefined,
        inLanguage: 'vi-VN',
        isAccessibleForFree: true,
        datePublished: post.publishedAt || post.createdAt,
        dateModified: post.updatedAt || post.publishedAt || post.createdAt,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        articleSection: `Prompt ${cat.name}`,
        publisher: {
          '@type': 'Organization',
          name: 'TopỨngDụng',
          '@id': `${SITE_URL}/#organization`,
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Prompt', item: `${SITE_URL}/prompt` },
          {
            '@type': 'ListItem',
            position: 3,
            name: cat.name,
            item: `${SITE_URL}/prompt/${shortSlug(cat.slug)}`,
          },
          { '@type': 'ListItem', position: 4, name: post.title, item: url },
        ],
      },
    ]

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
                <a href="/">Trang chủ</a> <span>/</span>
                <a href="/prompt">Prompt</a> <span>/</span>
                <a href={`/prompt/${shortSlug(cat.slug)}`}>{cat.name}</a>
              </div>
              <div className="cat-hero-row">
                <div className="cat-hero-main">
                  {/* Viên nhóm cũng là lối quay lại danh sách nhóm, đỡ phải
                      với lên vụn đường dẫn ở trên cùng. */}
                  <a className="eyebrow pr-eyebrow" href={`/prompt/${shortSlug(cat.slug)}`}>
                    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {st.d.map((d, i) => (
                        <path d={d} key={i} />
                      ))}
                    </svg>
                    {cat.name.toUpperCase()}
                  </a>
                  <h1 className="h2-blue pr-title">
                    {tdDau}
                    {tdSau && (
                      <>
                        {/* Ngắt dòng cố định giữa hai vế màu: để trình duyệt tự
                            ngắt thì chỗ gãy rơi vào giữa vế, hai màu lẫn vào
                            nhau trên cùng một dòng. */}
                        <br />
                        <span className="h2-accent-warm">{tdSau}</span>
                      </>
                    )}
                  </h1>
                  {post.excerpt && <p>{post.excerpt}</p>}
                </div>
                <div className="cat-hero-art pr-hero-art" aria-hidden="true">
                  <span className="pr-hero-note">
                    Prompt phù hợp
                    <i>Làm việc hiệu quả hơn</i>
                  </span>
                  <span className="cat-hero-ico">
                    <svg viewBox="0 0 30 26" width="92" height="80" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M13 3H5a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
                      <path d="M13 3v6h6" />
                      <path d="M7 13h6" />
                      <path d="M7 17h8" />
                      <path d="M24 2.5l.9 2.4 2.4.9-2.4.9-.9 2.4-.9-2.4-2.4-.9 2.4-.9z" />
                      <path d="M27.5 11l.5 1.4 1.4.5-1.4.5-.5 1.4-.5-1.4-1.4-.5 1.4-.5z" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="wrap">
              <div className="pr-wrap">
                <div className="pr-main">
                  {/* Dải mở đầu: một câu trả lời thẳng cho "prompt này làm gì" */}
                  {parts.dungDe && (
                    <div className="pr-use">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="9" />
                        <circle cx="12" cy="12" r="4.5" />
                        <circle cx="12" cy="12" r="1" fill="currentColor" />
                      </svg>
                      <p>
                        <b>{parts.dungDeNhan || 'Dùng để:'}</b> {parts.dungDe}
                      </p>
                    </div>
                  )}

                  {/* Phần giải thích và các đoạn prompt xen kẽ nhau, mỗi đoạn
                      prompt có nút chép riêng. */}
                  {parts.sections.map((x, i) =>
                    x.kind === 'prompt' ? (
                      <PromptCopyBlock key={i} text={x.text} compact={nhieu} />
                    ) : (
                      <article
                        className="post-body pr-doc"
                        key={i}
                        dangerouslySetInnerHTML={{ __html: x.html }}
                      />
                    ),
                  )}

                  {parts.meo && (
                    <div className="pr-tip">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M9 18h6" />
                        <path d="M10 22h4" />
                        <path d="M12 2a7 7 0 00-4 12.7V16h8v-1.3A7 7 0 0012 2z" />
                      </svg>
                      <div>
                        <b>Mẹo tinh chỉnh</b>
                        <div dangerouslySetInnerHTML={{ __html: parts.meo }} />
                      </div>
                    </div>
                  )}
                </div>

                <aside className="pr-side">
                  {parts.buoc.length > 0 && (
                    <div className="pr-side-sec">
                      <h2>Cách sử dụng</h2>
                      <ol className="pr-steps">
                        {parts.buoc.map((b, i) => (
                          <li key={i}>
                            <span className="pr-step-no">{i + 1}</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Bài gom nhóm không có mục "Cách dùng" nhưng có mười mốc,
                      nên cột phải đổi thành mục lục nhảy nhanh. */}
                  {parts.buoc.length === 0 && parts.muc.length > 1 && (
                    <div className="pr-side-sec">
                      <h2>Trong nhóm này</h2>
                      <ol className="pr-toc">
                        {parts.muc.map((m) => (
                          <li key={m.id}>
                            <a href={`#${m.id}`}>{m.ten}</a>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {parts.hopVoi.length > 0 && (
                    <div className="pr-side-sec">
                      <h2>
                        <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M14.7 6.3a4 4 0 005.3 5.3l-8.4 8.4a2.8 2.8 0 01-4-4z" />
                          <path d="M3 3l5 5" />
                          <path d="M8 3L3 8" />
                        </svg>
                        Công cụ tham khảo
                      </h2>
                      <div className="pr-tools">
                        {congCu.map(({ ten, slug }) => {
                          const ruot = (
                            <>
                              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M12 3l2.1 5.4L20 10l-5.9 1.6L12 17l-2.1-5.4L4 10l5.9-1.6z" />
                              </svg>
                              {ten}
                            </>
                          )
                          return slug ? (
                            <a className="pr-tool co-link" href={`/app/${slug}`} key={ten}>
                              {ruot}
                            </a>
                          ) : (
                            <span className="pr-tool" key={ten}>
                              {ruot}
                            </span>
                          )
                        })}
                      </div>
                      <small>
                        {congCu.some((x) => x.slug)
                          ? 'Bấm tên công cụ để xem bài giới thiệu. Điều chỉnh cú pháp theo công cụ sử dụng.'
                          : 'Điều chỉnh cú pháp theo công cụ sử dụng.'}
                      </small>
                    </div>
                  )}
                </aside>
              </div>

              {related.length > 0 && <PromptRelated items={related} />}
            </div>
          </section>
        </main>
        <TudFooter header={config.header} footer={config.footer} />
      </div>
    )
  }

  // ── Danh sách prompt của một nhóm ────────────────────────────────────────
  const posts = await getCategoryPosts(cat.slug, { limit: 100 })
    .then((r) => r.data ?? [])
    .catch(() => [] as Post[])

  const catUrl = `${SITE_URL}/prompt/${shortSlug(cat.slug)}`
  const catJsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `Prompt ${cat.name}`,
      description: cat.description || undefined,
      inLanguage: 'vi-VN',
      url: catUrl,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: posts.length,
        itemListElement: posts.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: p.title,
          url: `${catUrl}/${p.slug}`,
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Prompt', item: `${SITE_URL}/prompt` },
        { '@type': 'ListItem', position: 3, name: cat.name, item: catUrl },
      ],
    },
  ]

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(catJsonLd) }}
      />
      <TudHeader config={config.header} />
      <main>
        <section className="cat-hero">
          <div className="wrap">
            <div className="crumb">
              <a href="/">Trang chủ</a> <span>/</span>
              <a href="/prompt">Prompt</a> <span>/</span> <span>{cat.name}</span>
            </div>
            <div className="prompt-cat-head">
              <span className="prompt-ico" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {st.d.map((d, i) => (
                    <path d={d} key={i} />
                  ))}
                </svg>
              </span>
              <h1 className="h2-blue">
                Prompt <span className="h2-accent-warm">{cat.name}</span>
              </h1>
            </div>
            {cat.description && <p>{cat.description}</p>}
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            {posts.length === 0 ? (
              <div className="cat-empty">
                Nhóm <b>{cat.name}</b> chưa có prompt nào. Mời bạn xem{' '}
                <a href="/prompt">toàn bộ thư viện prompt</a>.
              </div>
            ) : (
              <div className="prompt-new">
                {posts.map((p) => (
                  <a
                    className="prompt-new-card ngang"
                    href={`/prompt/${shortSlug(cat.slug)}/${p.slug}`}
                    key={p.id}
                  >
                    <span className="prompt-ico" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        {promptItemIcon(p.title, cat.slug).map((d, i) => (
                          <path d={d} key={i} />
                        ))}
                      </svg>
                    </span>
                    <span className="prompt-new-body">
                      <b>{p.title}</b>
                      <span className="prompt-new-desc">{p.excerpt}</span>
                      <span className="prompt-new-go">
                        Xem prompt
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M5 12h13" />
                          <path d="M12 5l7 7-7 7" />
                        </svg>
                      </span>
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <TudFooter header={config.header} footer={config.footer} />
    </div>
  )
}

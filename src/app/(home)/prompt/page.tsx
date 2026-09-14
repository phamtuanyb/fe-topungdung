import { ANH_CHIA_SE_MAC_DINH } from '@/lib/anh-chia-se'
import type { Metadata } from 'next'
import type { Category, Post } from '@/types'
import { getCategories, getCategoryPosts, getTudHomeConfig } from '@/lib/api/public'
import { mergeTudConfig } from '../default-config'
import { TudFooter, TudHeader } from '../_components/TudChrome'
import { PROMPT_FALLBACK, PROMPT_STYLES, shortSlug } from './prompt-meta'
import PromptNewest, { type NewestItem } from './PromptNewest'
import PromptSubmitForm from './PromptSubmitForm'

export const revalidate = 60

/** Dùng tên miền thật làm giá trị lùi, giống robots.ts và sitemap.ts. */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://topungdung.net'

export const metadata: Metadata = {
  title: { absolute: 'Thư viện Prompt | TopỨngDụng' },
  description:
    'Kho prompt tiếng Việt chia theo mục đích công việc: viết lách, tạo hình ảnh, làm video, lập trình, SEO, marketing và nhiều nhóm khác.',
  alternates: { canonical: '/prompt' },
  openGraph: {
    // Khai openGraph ở đây thì Next thay hẳn khối của layout gốc, kéo theo
    // mất luôn ảnh chia sẻ mặc định, chia sẻ ra Facebook/Zalo
    // chỉ còn thẻ chữ. Trỏ lại đúng ảnh đó.
    images: [ANH_CHIA_SE_MAC_DINH],
    title: 'Thư viện Prompt',
    description: 'Kho prompt tiếng Việt chia theo mục đích công việc.',
    type: 'website',
    url: '/prompt',
  },
}

export default async function PromptIndexPage() {
  const [cfgRes, catsRes, postsRes] = await Promise.all([
    getTudHomeConfig().catch(() => ({ data: null })),
    getCategories().catch(() => ({ data: [] as Category[] })),
    // Endpoint danh mục trả về cả cây con, nên một lần gọi là đủ cho 12 nhóm.
    getCategoryPosts('prompt', { limit: 500 }).catch(() => ({ data: [] as Post[] })),
  ])

  const config = mergeTudConfig(cfgRes.data)
  const prompts = postsRes.data ?? []

  const root = catsRes.data.find((c) => c.slug === 'prompt')
  // API trả danh mục theo bảng chữ cái; sắp lại theo thứ tự đã thiết kế trong
  // PROMPT_STYLES để nhóm hay dùng (viết lách, hình ảnh, video) đứng trước.
  const order = Object.keys(PROMPT_STYLES)
  const groups = (root ? catsRes.data.filter((c) => c.parentId === root.id) : []).sort(
    (a, b) => order.indexOf(a.slug) - order.indexOf(b.slug),
  )

  const counts: Record<string, number> = {}
  for (const p of prompts) {
    const s = p.category?.slug
    if (s) counts[s] = (counts[s] ?? 0) + 1
  }

  // Lấy rộng hơn một trang để khối 'Mới thêm' có phân trang thật; mọi thẻ
  // vẫn được dựng ra HTML nên liên kết của trang 2, 3 không bị mất.
  const newest: NewestItem[] = prompts.slice(0, 27).map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt ?? '',
    catName: p.category?.name ?? '',
    catSlug: p.category?.slug ?? '',
  }))

  // Khai báo bộ sưu tập để máy tìm kiếm và các máy trả lời bằng AI nắm được
  // đây là trang tổng hợp gồm những nhóm nào, mỗi nhóm có bao nhiêu prompt.
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Thư viện Prompt',
      description:
        'Kho prompt tiếng Việt chia theo mục đích công việc: viết lách, tạo hình ảnh, làm video, lập trình, SEO, marketing và nhiều nhóm khác.',
      inLanguage: 'vi-VN',
      isAccessibleForFree: true,
      url: `${SITE_URL}/prompt`,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: groups.length,
        itemListElement: groups.map((g, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: g.name,
          url: `${SITE_URL}/prompt/${shortSlug(g.slug)}`,
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Prompt', item: `${SITE_URL}/prompt` },
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
              <a href="/">Trang chủ</a> <span>/</span> <span>Prompt</span>
            </div>
            <div className="cat-hero-row">
              <div className="cat-hero-main">
                <div className="eyebrow">THƯ VIỆN PROMPT</div>
                {/* Ngắt dòng cố định: vế đầu xanh, vế sau cam. Để trình duyệt tự
                    ngắt thì câu gãy ở chỗ vô nghĩa tuỳ bề ngang màn hình. */}
                <h1 className="h2-blue">
                  Prompt hay,
                  <br />
                  <span className="h2-accent-warm">chia theo việc bạn cần làm.</span>
                </h1>
                <p className="hero-1dong">
                  Chép về dùng ngay. Mỗi prompt đều ghi rõ dùng cho việc gì và hợp với công cụ nào.
                </p>
              </div>
              <div className="cat-hero-art" aria-hidden="true">
                <span className="cat-hero-ico">
                  {/* Tờ tài liệu kèm hai tia lấp lánh: gợi ý "prompt viết sẵn"
                      mà không cần dùng tới chữ. Khung rộng hơn 24 để chừa chỗ
                      cho hai tia nằm chếch trên phải. */}
                  <svg viewBox="0 0 30 26" width="96" height="84" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
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
            <div className="prompt-head">
              <h2>Khám phá theo mục đích</h2>
              <p>Tìm prompt phù hợp với công việc của bạn</p>
            </div>

            <div className="prompt-grid">
              {groups.map((g) => {
                const st = PROMPT_STYLES[g.slug] ?? PROMPT_FALLBACK
                const n = counts[g.slug] ?? 0
                return (
                  <a className="prompt-cat" href={`/prompt/${shortSlug(g.slug)}`} key={g.id}>
                    {/* Ô biểu tượng dùng chung một tông xanh cho cả 12 nhóm, và
                        số lượng là viên cam — cùng luật với thẻ nhóm ở /ungdung,
                        thay cho 12 màu riêng khiến lưới trông rời rạc. */}
                    <span className="prompt-ico">
                      <svg
                        viewBox="0 0 24 24"
                        width="22"
                        height="22"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        {st.d.map((d, i) => (
                          <path d={d} key={i} />
                        ))}
                      </svg>
                    </span>
                    <b>{g.name}</b>
                    <small>{n} prompt</small>
                  </a>
                )
              })}
            </div>

            {newest.length > 0 && (
              <>
                <div className="prompt-head" style={{ marginTop: 38 }}>
                  <h2 className="h2-blue">
                    Mới thêm <span className="h2-accent-warm">gần đây</span>
                  </h2>
                  <p>Những prompt vừa được đăng</p>
                </div>
                <PromptNewest items={newest} />
              </>
            )}

            <PromptSubmitForm groups={groups} />

            {prompts.length === 0 && (
              <div className="cat-empty" style={{ marginTop: 24 }}>
                Thư viện prompt đang được xây dựng. Mời bạn quay lại sau, hoặc xem{' '}
                <a href="/ungdung">kho ứng dụng</a> trong lúc chờ.
              </div>
            )}
          </div>
        </section>
      </main>

      <TudFooter header={config.header} footer={config.footer} />
    </div>
  )
}

import type { Category, Post } from '@/types'
import {
  getAllVoteSummaries,
  getCategories,
  getCategoryPosts,
  getTudApps,
  getTudHomeConfig,
} from '@/lib/api/public'
import { mergeTudConfig } from './default-config'
import { buildDiscoverData } from './discover-data'
import { PROMPT_FALLBACK, PROMPT_STYLES, shortSlug } from './prompt/prompt-meta'
import type { PromptRailItem } from './_components/PromptRail'
import HomeClient from './HomeClient'

// ISR: cache 60s. Sửa trong admin xong thì trang chủ đổi trong vòng 1 phút,
// hoặc F5 cứng ở môi trường dev.
export const revalidate = 60

function score(p: Post): number {
  const cfg = p.productPageConfig as unknown as { app?: { score?: number } } | null | undefined
  return cfg?.app?.score ?? 0
}

export default async function HomePage() {
  const [cfgRes, appsRes, catsRes, votesRes] = await Promise.all([
    getTudHomeConfig().catch(() => ({ data: null })),
    // Phải lấy đủ toàn bộ ứng dụng: trang chủ tự sắp theo điểm và tự tra slug
    // cho khối "Đặt lên bàn cân". Trước đây giới hạn 200/270 nên capcut và canva
    // rơi sang trang 2, khiến khối so sánh không bao giờ hiện và mục menu
    // "So sánh" bấm vào không tới đâu. Nới rộng để còn chỗ khi thêm bài mới.
    getTudApps(1000).catch(() => ({ data: [] as Post[] })),
    getCategories().catch(() => ({ data: [] as Category[] })),
    getAllVoteSummaries().catch(() => ({ data: {} })),
  ])

  // ── Dải prompt cuối trang ───────────────────────────────────────────────────
  // Lấy cả cây prompt trong một lần gọi rồi chọn ngẫu nhiên. Random ở máy chủ
  // nên mỗi lần cache ISR hết hạn là một nhóm khác, không nhấp nháy ở trình duyệt.
  const promptPool = await getCategoryPosts('prompt', { limit: 200 })
    .then((r) => r.data ?? [])
    .catch(() => [] as Post[])

  const config = mergeTudConfig(cfgRes.data)

  // Sắp app theo điểm giảm dần — dùng chung cho trending, top picks và bảng xếp hạng.
  const apps = [...(appsRes.data ?? [])].sort((a, b) => score(b) - score(a))

  // Danh mục con của "ung-dung" — dùng chung cho 6 thẻ và bảng xếp hạng.
  const appRoot = catsRes.data.find((c) => c.slug === 'ung-dung')
  const appCategories = appRoot ? catsRes.data.filter((c) => c.parentId === appRoot.id) : []

  // Số ứng dụng cho các thẻ "Bạn muốn làm gì". Phải cộng dồn từ danh mục con lên
  // nhóm cha, vì bài gắn ở cấp 3 còn thẻ trỏ tới cấp 2 (xem discover-data.ts).
  const {
    counts,
    subs: groupSubs,
    names: groupNames,
    groupOf,
    pathOf,
  } = buildDiscoverData(catsRes.data, apps)

  // ── Bài viết cho khối "THE EDIT" ────────────────────────────────────────────
  // Ưu tiên slug admin chỉ định; thiếu thì lấy bài mới nhất của danh mục.
  const editPool = config.edit.categorySlug
    ? await getCategoryPosts(config.edit.categorySlug, { limit: 12 })
        .then((r) => r.data ?? [])
        .catch(() => [] as Post[])
    : []

  const pick = (slug: string) => editPool.find((p) => p.slug === slug) ?? null
  const used = new Set<number>()

  let editFeatured = config.edit.featuredSlug ? pick(config.edit.featuredSlug) : null
  if (!editFeatured) editFeatured = editPool[0] ?? null
  if (editFeatured) used.add(editFeatured.id)

  const editList: Post[] = []
  for (const slug of config.edit.listSlugs ?? []) {
    const p = pick(slug)
    if (p && !used.has(p.id)) {
      editList.push(p)
      used.add(p.id)
    }
  }
  for (const p of editPool) {
    if (editList.length >= 3) break
    if (!used.has(p.id)) {
      editList.push(p)
      used.add(p.id)
    }
  }

  const promptRail: PromptRailItem[] = [...promptPool]
    .sort(() => Math.random() - 0.5)
    .slice(0, config.promptRail.limit || 10)
    .map((p) => {
      const catSlug = p.category?.slug ?? ''
      const st = PROMPT_STYLES[catSlug] ?? PROMPT_FALLBACK
      return {
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt ?? '',
        catName: p.category?.name ?? 'Prompt',
        href: `/prompt/${shortSlug(catSlug)}/${p.slug}`,
        icon: st.d,
        views: p.viewCount ?? 0,
      }
    })

  // ── JSON-LD cho trang chủ ───────────────────────────────────────────────────
  // Organization + WebSite giúp công cụ tìm kiếm nhận diện thực thể của site và
  // hiển thị ô tìm kiếm phụ trong kết quả.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://topungdung.net'
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'TopỨngDụng'
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: siteName,
      url: siteUrl,
      logo: { '@type': 'ImageObject', url: `${siteUrl}/icon` },
      description:
        'Chuyên trang đánh giá và so sánh ứng dụng, phần mềm và công cụ AI cho người dùng Việt Nam.',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      name: siteName,
      url: siteUrl,
      inLanguage: 'vi-VN',
      publisher: { '@id': `${siteUrl}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${siteUrl}/tim-kiem?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient
        config={config}
        apps={apps}
        counts={counts}
        groupSubs={groupSubs}
        groupNames={groupNames}
        groupOf={groupOf}
        pathOf={pathOf}
        appCategories={appCategories}
        votes={votesRes.data ?? {}}
        editFeatured={editFeatured}
        editList={editList}
        promptRail={promptRail}
      />
    </>
  )
}

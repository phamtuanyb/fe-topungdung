import { MetadataRoute } from 'next'
import { getCategories, getPosts } from '@/lib/api/public'
import { collectCategoryIds, pathToCategory } from '@/lib/category-tree'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://topungdung.net'
  
  // 1. Trang cố định.
  //
  // Trước đây mọi trang ở đây khai lastmod = "lúc sinh sitemap", tức là ngày
  // nào cũng "vừa sửa" — Google nhận ra lastmod không đáng tin và bỏ qua nó
  // cho cả site. Giờ: trang tổng hợp (chủ, ứng dụng, xếp hạng, prompt, tin)
  // lấy ngày của bài mới nhất vì nội dung chúng là tập hợp bài; trang thông
  // tin (giới thiệu, liên hệ, pháp lý) không khai lastmod — không biết thì
  // để trống còn hơn nói bừa.
  const TRANG_TONG_HOP = ['', '/ungdung', '/ranking', '/topapp', '/prompt', '/tin-tuc']
  const TRANG_THONG_TIN = ['/introduction', '/lien-he', '/chinh-sach-bao-mat', '/dieu-khoan-su-dung']
  const staticRoutes = (moiNhat?: Date): MetadataRoute.Sitemap => [
    ...TRANG_TONG_HOP.map((route) => ({
      url: `${siteUrl}${route}`,
      ...(moiNhat ? { lastModified: moiNhat } : {}),
      changeFrequency: 'daily' as const,
      priority: route === '' ? 1.0 : 0.8,
    })),
    ...TRANG_THONG_TIN.map((route) => ({
      url: `${siteUrl}${route}`,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  ]

  try {
    const [categoriesRes, postsRes] = await Promise.all([
      getCategories().catch(() => ({ data: [] })),
      getPosts({ limit: 1000 }).catch(() => ({ data: [] })),
    ])

    const categories = categoriesRes?.data ?? []
    const posts = postsRes?.data ?? []

    // Thống kê theo danh mục — dùng cho cả ba nhóm trang danh sách bên dưới,
    // nên phải tính trước khi nhóm đầu tiên dùng tới.
    const postsPerCat = new Map<number, number>()
    // Ngày bài mới nhất trong từng danh mục: đây mới là "lần sửa cuối" thật của
    // một trang danh sách — dòng categories.updatedAt chỉ đổi khi ai đó sửa tên
    // hay mô tả danh mục, không liên quan tới việc có bài mới.
    const moiNhatCat = new Map<number, Date>()
    let moiNhatToanSite: Date | undefined
    for (const post of posts) {
      const id = post.category?.id ?? post.categoryId
      if (id != null) postsPerCat.set(id, (postsPerCat.get(id) ?? 0) + 1)
      const d = new Date(post.updatedAt || post.createdAt)
      if (Number.isNaN(d.getTime())) continue
      if (id != null && (!moiNhatCat.has(id) || d > moiNhatCat.get(id)!)) moiNhatCat.set(id, d)
      if (!moiNhatToanSite || d > moiNhatToanSite) moiNhatToanSite = d
    }
    const moiNhatTrong = (slug: string): Date | undefined => {
      let m: Date | undefined
      // forEach thay cho for...of: duyệt Set trực tiếp đòi downlevelIteration.
      collectCategoryIds(categories, slug).forEach((id) => {
        const d = moiNhatCat.get(id)
        if (d && (!m || d > m)) m = d
      })
      return m
    }
    const lastModCua = (c: { slug: string }) => {
      const d = moiNhatTrong(c.slug)
      return d ? { lastModified: d } : {}
    }

    // 2. Chuyên mục tin tức — /chuyen-muc/<slug>.
    // Chỉ lấy con của "tin-tuc": nhóm ứng dụng đã có /ungdung/<slug> ở dưới,
    // còn /category/<slug> là đường cũ nên không đưa vào sitemap nữa.
    const newsRoot = categories.find((c) => c.slug === 'tin-tuc')
    const categoryRoutes = newsRoot
      ? categories
          .filter((c) => c.parentId === newsRoot.id)
          .map((cat) => ({
            url: `${siteUrl}/chuyen-muc/${cat.slug}`,
            ...lastModCua(cat),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
          }))
      : []

    // 2b. Nhóm ứng dụng — /ungdung/<slug> (các danh mục con của "ung-dung")
    // Mọi nhóm trong nhánh ứng dụng, kể cả nhóm con nhiều cấp
    // Nhóm chưa có bài nào thì không khai vào sitemap: trang rỗng bị công cụ
    // tìm kiếm xếp là nội dung mỏng, khai lên chỉ hại phần còn lại của site.
    const hasPosts = (c: { slug: string }) =>
      Array.from(collectCategoryIds(categories, c.slug)).some((id) => postsPerCat.get(id))

    const appRoot = categories.find((c) => c.slug === 'ung-dung')
    const appGroupRoutes = appRoot
      ? categories
          .filter((c) => c.id !== appRoot.id && collectCategoryIds(categories, 'ung-dung').has(c.id))
          .filter(hasPosts)
          .map((c) => ({
            url: `${siteUrl}/ungdung/${pathToCategory(categories, c).map((x) => x.slug).join('/')}`,
            ...lastModCua(c),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
          }))
      : []

    // 2c. Nhóm prompt — /prompt/<slug không tiền tố>
    const promptRoot = categories.find((c) => c.slug === 'prompt')
    const promptGroups = promptRoot
      ? categories.filter((c) => c.parentId === promptRoot.id)
      : []
    const promptGroupRoutes = promptGroups.map((c) => ({
      url: `${siteUrl}/prompt/${c.slug.replace(/^prompt-/, '')}`,
      ...lastModCua(c),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // 3. Bài viết — ứng dụng đi /app/<slug>, prompt đi /prompt/<nhóm>/<slug>,
    //    còn lại /tin-tuc/<slug>
    const appCategoryIds = collectCategoryIds(categories, 'ung-dung')
    const promptCatSlug = new Map(promptGroups.map((c) => [c.id, c.slug.replace(/^prompt-/, '')]))

    // Bài của Vsoftware cũ không còn trang công khai nào phục vụ
    const legacyCatIds = new Set(
      categories.filter((c) => c.slug === 'services' || c.slug === 'ai-agent').map((c) => c.id),
    )

    const postRoutes = posts
      .filter((post) => !legacyCatIds.has(post.category?.id ?? post.categoryId ?? -1))
      .map((post) => {
      const catId = post.category?.id ?? post.categoryId
      const isApp = catId != null && appCategoryIds.has(catId)
      const promptCat = catId != null ? promptCatSlug.get(catId) : undefined

      const path = isApp
        ? `/app/${post.slug}`
        : promptCat
          ? `/prompt/${promptCat}/${post.slug}`
          : `/tin-tuc/${post.slug}`

      return {
        url: `${siteUrl}${path}`,
        lastModified: new Date(post.updatedAt || post.createdAt),
        changeFrequency: 'weekly' as const,
        priority: isApp ? 0.8 : 0.7,
      }
    })

    return [
      ...staticRoutes(moiNhatToanSite),
      ...appGroupRoutes,
      ...categoryRoutes,
      ...promptGroupRoutes,
      ...postRoutes,
    ]
  } catch (error) {
    console.error('Failed to generate sitemap:', error)
    return staticRoutes()
  }
}

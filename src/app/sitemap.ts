import { MetadataRoute } from 'next'
import { getCategories, getPosts } from '@/lib/api/public'
import { collectCategoryIds, pathToCategory } from '@/lib/category-tree'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://topungdung.net'
  
  // 1. Static routes
  const staticRoutes = [
    '',
    '/ungdung',
    '/ranking',
    '/topapp',
    '/prompt',
    '/introduction',
    '/lien-he',
    '/tin-tuc',
    '/chinh-sach-bao-mat',
    '/dieu-khoan-su-dung',
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  try {
    const [categoriesRes, postsRes] = await Promise.all([
      getCategories().catch(() => ({ data: [] })),
      getPosts({ limit: 1000 }).catch(() => ({ data: [] })),
    ])

    const categories = categoriesRes?.data ?? []
    const posts = postsRes?.data ?? []

    // 2. Chuyên mục tin tức — /chuyen-muc/<slug>.
    // Chỉ lấy con của "tin-tuc": nhóm ứng dụng đã có /ungdung/<slug> ở dưới,
    // còn /category/<slug> là đường cũ nên không đưa vào sitemap nữa.
    const newsRoot = categories.find((c) => c.slug === 'tin-tuc')
    const categoryRoutes = newsRoot
      ? categories
          .filter((c) => c.parentId === newsRoot.id)
          .map((cat) => ({
            url: `${siteUrl}/chuyen-muc/${cat.slug}`,
            lastModified: new Date(cat.updatedAt || new Date().toISOString()),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
          }))
      : []

    // 2b. Nhóm ứng dụng — /ungdung/<slug> (các danh mục con của "ung-dung")
    // Mọi nhóm trong nhánh ứng dụng, kể cả nhóm con nhiều cấp
    // Nhóm chưa có bài nào thì không khai vào sitemap: trang rỗng bị công cụ
    // tìm kiếm xếp là nội dung mỏng, khai lên chỉ hại phần còn lại của site.
    const postsPerCat = new Map<number, number>()
    for (const post of posts) {
      const id = post.category?.id ?? post.categoryId
      if (id != null) postsPerCat.set(id, (postsPerCat.get(id) ?? 0) + 1)
    }
    const hasPosts = (c: { slug: string }) =>
      Array.from(collectCategoryIds(categories, c.slug)).some((id) => postsPerCat.get(id))

    const appRoot = categories.find((c) => c.slug === 'ung-dung')
    const appGroupRoutes = appRoot
      ? categories
          .filter((c) => c.id !== appRoot.id && collectCategoryIds(categories, 'ung-dung').has(c.id))
          .filter(hasPosts)
          .map((c) => ({
            url: `${siteUrl}/ungdung/${pathToCategory(categories, c).map((x) => x.slug).join('/')}`,
            lastModified: new Date(c.updatedAt || new Date().toISOString()),
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
      lastModified: new Date(c.updatedAt || new Date().toISOString()),
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
      ...staticRoutes,
      ...appGroupRoutes,
      ...categoryRoutes,
      ...promptGroupRoutes,
      ...postRoutes,
    ]
  } catch (error) {
    console.error('Failed to generate sitemap:', error)
    return staticRoutes
  }
}

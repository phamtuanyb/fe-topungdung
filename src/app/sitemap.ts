import { MetadataRoute } from 'next'
import { getCategories, getPosts } from '@/lib/api/public'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vsoftware.vn'
  
  // 1. Static routes
  const staticRoutes = [
    '',
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
      getPosts().catch(() => ({ data: [] })),
    ])

    const categories = categoriesRes?.data ?? []
    const posts = postsRes?.data ?? []

    // 2. Category routes
    const categoryRoutes = categories.map((cat) => ({
      url: `${siteUrl}/category/${cat.slug}`,
      lastModified: new Date(cat.updatedAt || new Date().toISOString()),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    // 3. Dynamic Post routes based on category hierarchy
    const postRoutes = posts.map((post) => {
      return {
        url: `${siteUrl}/tin-tuc/${post.slug}`,
        lastModified: new Date(post.updatedAt || post.createdAt),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }
    })

    return [
      ...staticRoutes,
      ...categoryRoutes,
      ...postRoutes,
    ]
  } catch (error) {
    console.error('Failed to generate sitemap:', error)
    return staticRoutes
  }
}

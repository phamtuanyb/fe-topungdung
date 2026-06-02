import { Suspense } from "react"
import NewsPageContent from "./NewsPageContent"
import { getCategories, getPosts, getCategoryPosts, getCategoryBySlug } from "@/lib/api/public"
import { getPostsForCategoryTree } from "@/lib/public-content"
import { Post } from "@/types"
import type { Metadata } from "next"
import { SERVICES_SLUGS } from "@/constants/app.constants"

const PAGE_SIZE = 9

function NewsPageFallback() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center bg-[#F5F7FA] text-vs-gray-600 text-sm">
      Đang tải tin tức...
    </div>
  )
}

type Props = {
  params: { slug: string }
  searchParams: { page?: string; category?: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug).then(res => res.data).catch(() => null)
  if (!category) return { title: 'Danh mục không tồn tại' }
  return {
    title: `Danh mục: ${category.name}`,
    description: category.description || `Các bài viết, dịch vụ thuộc danh mục ${category.name} tại Vsoftware.`,
    alternates: {
      canonical: `/category/${params.slug}`
    },
  }
}

export default async function NewsPage({ params, searchParams }: Props) {
  const { slug } = params
  const page = Math.max(1, parseInt(searchParams.page || "1", 10))
  const categoryParam = searchParams.category || "all"
  const selectedSlug = categoryParam === "all" ? slug : categoryParam

  const [categoriesRes, countsRes, postsRes, allPostsRes] = await Promise.all([
    getCategories().catch(() => ({ data: [] })),
    getCategoryPosts(slug, { limit: 100 }).catch(() => ({ data: [], total: 0 })),
    getCategoryPosts(selectedSlug, { page, limit: PAGE_SIZE }).catch(() => ({
      data: [],
      total: 0,
      totalPages: 1,
    })),
    getPosts({ limit: 100 }).catch(() => ({ data: [] })),
  ])

  const categories = categoriesRes?.data ?? []
  const allPosts = allPostsRes?.data ?? []

  let featuredServices: Post[] = []
  try {
    const servicesPosts = getPostsForCategoryTree(SERVICES_SLUGS, categories, allPosts)
    featuredServices = [...servicesPosts]
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 4)
  } catch (err) {
    console.error("Failed to fetch featured services:", err)
  }

  return (
    <Suspense fallback={<NewsPageFallback />}>
      <NewsPageContent
        slug={slug}
        featuredServices={featuredServices}
        initialCategories={categories}
        initialCounts={countsRes}
        initialPosts={postsRes}
        initialPage={page}
        initialCategory={categoryParam}
      />
    </Suspense>
  )
}
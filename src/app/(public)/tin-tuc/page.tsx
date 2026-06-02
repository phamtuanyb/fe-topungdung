import { Suspense } from "react"
import type { Metadata } from "next"
import NewsPageContent from "./NewsPageContent"
import { getCategories, getPosts } from "@/lib/api/public"
import { getPostsForCategoryTree } from "@/lib/public-content"
import { Post } from "@/types"
import { SERVICES_SLUGS } from "@/constants/app.constants"

export const metadata: Metadata = {
  title: 'Tin tức & Kiến thức chuyển đổi số',
  description: 'Cập nhật tin tức công nghệ mới nhất, kiến thức quản lý doanh nghiệp, CRM, Automation và các giải pháp AI Agent từ các chuyên gia Vsoftware.',
}

function NewsPageFallback() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center bg-[#F5F7FA] text-vs-gray-600 text-sm">
      Đang tải tin tức...
    </div>
  )
}

export default async function NewsPage() {
  let featuredServices: Post[] = []
  try {
    const [categoriesRes, postsRes] = await Promise.all([
      getCategories().catch(() => ({ data: [] })),
      getPosts({ limit: 100 }).catch(() => ({ data: [] }))
    ])
    const categories = categoriesRes?.data ?? []
    const posts = postsRes?.data ?? []
    const servicesPosts = getPostsForCategoryTree(SERVICES_SLUGS, categories, posts)

    featuredServices = [...servicesPosts]
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 4)
  } catch (err) {
    console.error("Failed to fetch featured services for news sidebar:", err)
  }

  return (
    <Suspense fallback={<NewsPageFallback />}>
      <NewsPageContent featuredServices={featuredServices} />
    </Suspense>
  )
}

"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import SidebarCategories from "./_components/SidebarCategories"
import SidebarServices from "./_components/SidebarServices"
import SidebarNewsletter from "./_components/SidebarNewsletter"
import ArticleCard from "./_components/ArticleCard"
import Pagination from "@/components/ui/Pagination"
import { NewsArticle, NewsCategoryKey } from "./_config"
import NewsToolbar from "./_components/NewsToolbar"
import PageHero from "@/components/common/PageHero"
import { getCategoryPosts, getCategories } from "@/lib/api/public"
import useSWR from "swr"
import { Post } from "@/types"
import { NewsCategory } from "./_config"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import EmptyState from "@/components/ui/EmptyState"
import { NEWS_SLUGS } from "@/constants/app.constants"
import { estimateReadingTimeFromExcerpt } from "@/lib/reading-time"

const PAGE_SIZE = 9

function mapPostToArticle(p: Post, allCategories: { id: number; slug: string }[]): NewsArticle {
  let postCatSlug = "all"
  if (p.category?.slug) {
    postCatSlug = p.category.slug
  } else if (p.categoryId) {
    const found = allCategories.find((c) => c.id === p.categoryId)
    if (found) postCatSlug = found.slug
  }

  const excerpt = p.excerpt || p.seoDescription || ""
  return {
    id: p.id,
    title: p.title,
    excerpt,
    img: p.thumbnail || "/placeholder.png",
    date: new Date(p.publishedAt ?? p.createdAt).toLocaleDateString("vi-VN"),
    cat: postCatSlug,
    slug: p.slug,
    tag: p.category?.name || "Tin tức",
    tagVariant: "blue",
    imgAlt: p.title,
    readingTime: estimateReadingTimeFromExcerpt(excerpt),
  }
}

interface Props {
  featuredServices?: Post[]
  /** Slug danh mục đang xem. Bỏ trống = tất cả tin tức (parent). Đặt slug = chỉ sub đó. */
  activeCategorySlug?: string
  /** Tên hiển thị cho hero/heading. Bỏ trống = "Tin Tức & Kiến Thức". */
  heroTitle?: string
}

export default function NewsPageContent({
  featuredServices = [],
  activeCategorySlug,
  heroTitle,
}: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [isListView, setIsListView] = useState(false)

  const isAllNews = !activeCategorySlug || activeCategorySlug === NEWS_SLUGS
  const fetchSlug = isAllNews ? NEWS_SLUGS : activeCategorySlug

  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1)

  const handlePageChange = useCallback((nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (nextPage <= 1) params.delete("page")
    else params.set("page", String(nextPage))
    const qs = params.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }, [pathname, router, searchParams])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [page, activeCategorySlug])

  const { data: categoriesRes } = useSWR("public-categories", getCategories)
  const { data: countsRes } = useSWR("public-news-counts", () =>
    getCategoryPosts(NEWS_SLUGS, { limit: 200 })
  )
  const { data: postsRes, isLoading } = useSWR(
    ["public-news-posts", fetchSlug, page],
    () => getCategoryPosts(fetchSlug, { page, limit: PAGE_SIZE }),
    { keepPreviousData: true }
  )

  const allCategories = categoriesRes?.data || []
  const allNewsForCounts: Post[] = countsRes?.data || []
  const posts: Post[] = postsRes?.data || []
  const totalPages = Math.max(1, postsRes?.totalPages ?? 1)
  const totalCount = postsRes?.total ?? posts.length

  const newsCategory = allCategories.find((c) => c.slug === NEWS_SLUGS)
  const newsChildren =
    newsCategory?.children && newsCategory.children.length > 0
      ? newsCategory.children
      : allCategories.filter((c) => c.parentId === newsCategory?.id)

  const dynamicCategories: NewsCategory[] = [
    { key: NEWS_SLUGS, label: "Tất cả", count: countsRes?.total ?? allNewsForCounts.length },
    ...newsChildren.map((c) => ({
      key: c.slug,
      label: c.name,
      count: allNewsForCounts.filter((p) => p.category?.id === c.id || p.categoryId === c.id).length,
    })),
  ]

  const activeKey: NewsCategoryKey = isAllNews ? NEWS_SLUGS : (activeCategorySlug || NEWS_SLUGS)
  const articles = posts.map((p) => mapPostToArticle(p, allCategories))

  const handleFilter = (key: NewsCategoryKey) => {
    if (key === NEWS_SLUGS) router.push("/tin-tuc")
    else router.push(`/chuyen-muc/${key}`)
  }

  const currentTitle = heroTitle || (isAllNews ? "Tin Tức & Kiến Thức" : (newsChildren.find((c) => c.slug === activeCategorySlug)?.name ?? "Tin Tức"))
  const breadcrumbs = isAllNews
    ? [{ label: "Trang chủ", href: "/" }, { label: "Tin tức" }]
    : [{ label: "Trang chủ", href: "/" }, { label: "Tin tức", href: "/tin-tuc" }, { label: currentTitle }]

  return (
    <>
      <PageHero title={currentTitle} breadcrumbs={breadcrumbs} />

      <div className="bg-[#F5F7FA] py-8 pb-18 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[268px_1fr] gap-7 items-start">
          {/* Sidebar trái: Chuyên mục */}
          <div className="hidden lg:block">
            <aside className="flex flex-col gap-4 lg:sticky lg:top-[100px]">
              <SidebarCategories
                activeCat={activeKey}
                onFilter={handleFilter}
                categories={dynamicCategories}
              />
              <SidebarServices featuredServices={featuredServices} />
              <SidebarNewsletter />
            </aside>
          </div>

          {/* Khu chính: cards */}
          <div>
            <NewsToolbar count={totalCount} isListView={isListView} onViewChange={setIsListView} />

            {isLoading && posts.length === 0 ? (
              <LoadingSpinner className="py-20" text="Đang tải bài viết..." />
            ) : articles.length === 0 ? (
              <EmptyState
                title="Chưa có bài viết"
                description={isAllNews ? "Chưa có bài viết nào được đăng." : "Chuyên mục này chưa có bài viết nào."}
              />
            ) : (
              <>
                {!isListView && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {articles.map((article) => (
                      <ArticleCard key={article.id} article={article} isListView={false} />
                    ))}
                  </div>
                )}

                {isListView && (
                  <div className="flex flex-col gap-4">
                    {articles.map((article) => (
                      <ArticleCard key={article.id} article={article} isListView={true} />
                    ))}
                  </div>
                )}

                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  variant="news"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

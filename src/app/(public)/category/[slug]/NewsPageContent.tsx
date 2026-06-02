"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Post, Category } from "@/types"
import { NewsArticle, NewsCategoryKey, NewsCategory } from "../_config"
import SidebarCategories from "../_components/SidebarCategories"
import SidebarServices from "../_components/SidebarServices"
import SidebarNewsletter from "../_components/SidebarNewsletter"
import ArticleCard from "../_components/ArticleCard"
import Pagination from "@/components/ui/Pagination"
import NewsToolbar from "../_components/NewsToolbar"
import CategoryNav from "../_components/CategoryNav"
import PageHero from "@/components/common/PageHero"
import EmptyState from "@/components/ui/EmptyState"

function mapPostToArticle(p: Post, allCategories: { id: number; slug: string }[]): NewsArticle {
  let postCatSlug = "all"
  if (p.category?.slug) {
    postCatSlug = p.category.slug
  } else if (p.categoryId) {
    const found = allCategories.find((c) => c.id === p.categoryId)
    if (found) postCatSlug = found.slug
  }
  return {
    id: p.id,
    title: p.title,
    excerpt: p.excerpt || p.seoDescription || "",
    img: p.thumbnail || "https://vsoftware.vn/_next/image?url=%2Flogo-ngang.png&w=256&q=75",
    date: new Date(p.createdAt).toLocaleDateString("vi-VN"),
    cat: postCatSlug,
    slug: p.slug,
    tag: p.category?.name || "",
    tagVariant: "blue",
    imgAlt: p.title,
  }
}

type Props = {
  slug: string
  featuredServices?: Post[]
  initialCategories: Category[]
  initialCounts: { data: Post[]; total: number }
  initialPosts: { data: Post[]; total: number; totalPages: number }
  initialPage: number
  initialCategory: string
}

export default function NewsPageContent({
  slug,
  featuredServices = [],
  initialCategories,
  initialCounts,
  initialPosts,
  initialPage,
  initialCategory,
}: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [activeCat, setActiveCat] = useState<NewsCategoryKey>(initialCategory)
  const [isListView, setIsListView] = useState(false)

  const page = Math.max(1, parseInt(searchParams.get("page") || String(initialPage), 10))

  useEffect(() => {
    setActiveCat(searchParams.get("category") || "all")
  }, [searchParams])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [page, activeCat])

  const updateQuery = useCallback(
    (updates: { page?: number; category?: NewsCategoryKey }) => {
      const params = new URLSearchParams(searchParams.toString())
      if (updates.category !== undefined) {
        if (updates.category === "all") params.delete("category")
        else params.set("category", updates.category)
        params.delete("page")
      }
      if (updates.page !== undefined) {
        if (updates.page <= 1) params.delete("page")
        else params.set("page", String(updates.page))
      }
      const qs = params.toString()
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  const allCategories = initialCategories
  const allNewsForCounts = initialCounts.data
  const posts = initialPosts.data
  const totalPages = Math.max(1, initialPosts.totalPages)
  const totalCount = initialPosts.total

  const newsCategory = allCategories.find((c) => c.slug === slug)
  const categoryChildren = newsCategory?.children ?? []
  const newsChildren =
    categoryChildren.length > 0
      ? categoryChildren
      : allCategories.filter((c) => c.parentId === newsCategory?.id)

  const dynamicCategories: NewsCategory[] = [
    { key: "all", label: "Tất cả", count: initialCounts.total },
    ...newsChildren.map((c) => ({
      key: c.slug,
      label: c.name,
      count: allNewsForCounts.filter(
        (p) => p.category?.id === c.id || p.categoryId === c.id
      ).length,
    })),
  ]

  const articles = posts.map((p) => mapPostToArticle(p, allCategories))

  return (
    <>
      <PageHero
        title="Tin Tức & Kiến Thức"
        breadcrumbs={[
          { label: "Trang chủ", href: "/" },
          { label: newsCategory?.name || "" },
        ]}
      />
      <CategoryNav
        activeCat={activeCat}
        onFilter={(key) => { setActiveCat(key); updateQuery({ category: key }) }}
        categories={dynamicCategories}
      />
      <div className="bg-[#F5F7FA] py-4 pb-18 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1fr_268px] gap-7 items-start">
          <div>
            <NewsToolbar count={totalCount} isListView={isListView} onViewChange={setIsListView} />
            {articles.length === 0 ? (
              <EmptyState
                title="Chưa có bài viết"
                description="Danh mục này chưa có bài viết nào được đăng."
              />
            ) : (
              <>
                <div className={
                  isListView
                    ? "flex flex-col gap-4"
                    : "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                }>
                  {articles.map((article) => (
                    <ArticleCard key={article.id} slug={slug} article={article} isListView={isListView} />
                  ))}
                </div>
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={(nextPage) => updateQuery({ page: nextPage })}
                  variant="news"
                />
              </>
            )}
          </div>
          <div className="hidden lg:block h-full">
            <aside className="flex flex-col gap-4 lg:sticky lg:top-[139px]">
              <SidebarCategories
                activeCat={activeCat}
                onFilter={(key) => { setActiveCat(key); updateQuery({ category: key }) }}
                categories={dynamicCategories}
              />
              <SidebarServices featuredServices={featuredServices} />
              <SidebarNewsletter />
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
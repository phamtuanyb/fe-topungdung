

import PageHero from "@/components/common/PageHero";
import { getCategories, getCategoryPosts, getPost, getPosts } from "@/lib/api/public";
import { notFound } from 'next/navigation';
import SidebarNewsletter from "../_components/SidebarNewsletter";
import AuthorCard from "./_components/AuthorCard";
import RelatedCard from "./_components/RelatedCard";
import SidebarCategories from "./_components/SidebarCategories";
import SidebarServices from "./_components/SidebarServices";
import { decodeHtmlContent } from "@/lib/utils";
import type { Metadata } from "next";
import { SERVICES_SLUGS, NEWS_SLUGS } from "@/constants/app.constants";

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug).then(res => res.data).catch(() => null);
  if (!post) return { title: 'Bài viết không tồn tại' };
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt || '';
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: post.thumbnail ? [post.thumbnail] : [],
    },
    alternates: {
      canonical: `/tin-tuc/${params.slug}`
    }
  };
}

const ArticleLayout = async ({ params }: Props) => {
  const news = await getPost(params.slug).then(res => res.data).catch(() => null);
  const relatedResponse = await getPosts({ limit: 3 }).catch(() => null);
  const relatedArticles = relatedResponse?.data || [];

  const categoriesResponse = await getCategories().catch(() => null);
  const allCategories = categoriesResponse?.data || [];
  const postsRes = await getCategoryPosts(NEWS_SLUGS, { limit: 100 }).catch(() => null);
  const allNews = postsRes?.data || [];

  const servicesPosts = await getCategoryPosts(SERVICES_SLUGS, { limit: 100 }).then(res => res.data).catch(() => []);

  const featuredServices = [...servicesPosts]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 4);

  const parentCat = allCategories.find(c => c.slug === NEWS_SLUGS);
  const newsChildren = parentCat?.children && parentCat.children.length > 0
    ? parentCat.children
    : allCategories.filter(c => c.parentId === parentCat?.id);

  const sidebarCategoriesData = newsChildren.map(c => ({
    name: c.name,
    slug: c.slug,
    count: allNews.filter(p => p.category?.id === c.id || p.categoryId === c.id).length
  }));

  if (!news) {
    notFound()
  }

  return (
    <>
      <PageHero
        title="Tin Tức & Kiến Thức"
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Tin tức' },
          { label: 'CRM & Phần mềm' },
        ]}
        titleTag="div"
      />
      <div className="bg-[#F5F7FA] py-4 pb-18 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1fr_268px] gap-7 items-start">

          {/* ── LEFT: Article ── */}
          <div>
            <a
              href="/tin-tuc"
              className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#1E5BC6] mb-2 hover:gap-0.5 hover:text-[#1749A8] transition-all duration-150"
            >
              ← Quay lại danh sách bài viết
            </a>

            <article className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Article header + body */}
              <div className="px-8 pt-9 pb-10 md:px-10">

                {/* Title */}
                <h1 className="text-[clamp(22px,2.8vw,30px)] font-extrabold leading-tight text-[#1A1A1A] mb-4">
                  {news.title}
                </h1>

                <div
                  className="prose prose-lg max-w-none
                    prose-headings:text-[#0D2757] prose-headings:font-extrabold prose-headings:tracking-tight
                    prose-h2:text-[clamp(22px,2.4vw,28px)] prose-h2:mt-10 prose-h2:mb-4 prose-h2:leading-snug prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-100
                    prose-h3:text-[clamp(17px,1.6vw,20px)] prose-h3:mt-7 prose-h3:mb-3 prose-h3:leading-snug prose-h3:text-[#1E5BC6]
                    prose-h4:text-[16px] prose-h4:mt-5 prose-h4:mb-2
                    prose-p:text-[15.5px] prose-p:text-gray-700 prose-p:leading-[1.85] prose-p:my-4
                    prose-strong:text-[#1A1A1A] prose-strong:font-extrabold
                    prose-a:text-[#1E5BC6] prose-a:no-underline prose-a:font-semibold hover:prose-a:underline
                    prose-ul:my-4 prose-ul:pl-1 prose-ol:my-4
                    prose-li:my-1.5 prose-li:text-gray-700 prose-li:leading-[1.75] prose-li:marker:text-[#F47920]
                    prose-blockquote:border-l-4 prose-blockquote:border-[#F47920] prose-blockquote:bg-orange-50 prose-blockquote:py-2 prose-blockquote:px-5 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-gray-700
                    prose-img:rounded-xl prose-img:my-6 prose-img:shadow-md
                    prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[14px] prose-code:before:content-none prose-code:after:content-none"
                  dangerouslySetInnerHTML={{ __html: decodeHtmlContent(news.content) }}
                />

                {/* Tags */}
                {/* <ArticleTags tags={ARTICLE_TAGS} /> */}

                {/* Author */}
                <AuthorCard author={news.author || undefined} />
              </div>

              {/* Related Articles */}
              <div className="px-8 pt-8 pb-10 md:px-10 border-t border-gray-200">
                <div className="text-[13px] font-extrabold uppercase tracking-widest text-[#1A1A1A] mb-5 pb-2.5 border-b-2 border-[#1E5BC6] inline-block">
                  Bài viết liên quan
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedArticles.map((article) => {
                    // Map Post API type to RelatedArticle type expected by RelatedCard
                    const mappedArticle = {
                      id: article.id,
                      title: article.title,
                      date: new Date(article.createdAt).toLocaleDateString('vi-VN'),
                      img: article.thumbnail || 'https://vsoftware.vn/_next/image?url=%2Flogo-ngang.png&w=256&q=75',
                      imgAlt: article.title,
                      href: "/tin-tuc/" + article.slug,
                      cat: article.category?.name || "Tin tức"
                    };
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    return <RelatedCard key={mappedArticle.id} article={mappedArticle as any} />;
                  })}
                </div>
              </div>

            </article>
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <aside className="hidden lg:flex flex-col gap-5 sticky top-[86px]">
            {/* <div className="text-red-500 text-xs">Debug cats: {sidebarCategoriesData.length}</div> */}
            <SidebarCategories categories={sidebarCategoriesData} activeSlug={news.category?.slug} />
            <SidebarServices featuredServices={featuredServices} />
            <SidebarNewsletter />
          </aside>

        </div>
      </div>
    </>
  );
}

export default ArticleLayout;
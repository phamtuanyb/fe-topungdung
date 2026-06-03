import { getCategoryPosts } from '@/lib/api/public'
import Link from 'next/link'
import Image from 'next/image'
import type { HomepageBlogConfig, Post } from '@/types'
import { NEWS_SLUGS } from '@/constants/app.constants'

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&h=340&q=80'

type BlogCard = {
  href: string
  title: string
  img: string
  imgAlt: string
  dateLabel: string
}

function formatDate(iso?: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}/${mm}/${d.getFullYear()}`
}

function postToCard(p: Post): BlogCard {
  return {
    href: '/tin-tuc/' + p.slug,
    title: p.title,
    img: p.thumbnail || FALLBACK_IMG,
    imgAlt: p.title,
    dateLabel: formatDate(p.publishedAt ?? p.createdAt ?? p.updatedAt),
  }
}

async function BlogSection({ config }: { config?: HomepageBlogConfig }) {
  const heading = config?.heading ?? 'Tin tức &'
  const headingEm = config?.headingEm ?? 'Kiến thức công nghệ'
  const ctaText = config?.ctaText ?? 'Xem tất cả bài viết →'
  const ctaHref = config?.ctaHref ?? '/tin-tuc'

  // Lấy 5 bài mới nhất của Tin tức (recursive bao gồm sub-categories)
  const postsRes = await getCategoryPosts(NEWS_SLUGS, { limit: 5 }).catch(() => null)
  const posts = postsRes?.data || []

  if (posts.length === 0) return null

  const featured = postToCard(posts[0])
  const side = posts.slice(1, 5).map(postToCard)

  return (
    <section className="py-12 pb-14 bg-[#F5F7FA]">
      <div className="max-w-8xl mx-auto px-6">
        <h2 className="text-center text-2xl sm:text-[clamp(22px,2.8vw,32px)] font-extrabold text-[#1A1A1A] mb-12">
          {heading} <em className="not-italic text-[#1E5BC6]">{headingEm}</em>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-stretch">
          {/* Featured — chiều cao tự khớp với cột phải (items-stretch) */}
          <Link
            href={featured.href}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm text-[#1A1A1A] no-underline flex flex-col h-full transition-shadow duration-200 hover:shadow-xl"
          >
            <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
              <Image
                src={featured.img}
                alt={featured.imgAlt}
                fill
                unoptimized
                sizes="(min-width: 1024px) 800px, 100vw"
                className="object-cover transition-transform duration-[350ms] group-hover:scale-[1.04]"
              />
            </div>
            <div className="px-6 py-5 flex-shrink-0">
              <h3 className="text-[clamp(16px,1.8vw,20px)] font-extrabold text-[#1A1A1A] mb-2 leading-snug line-clamp-2">
                {featured.title}
              </h3>
              {featured.dateLabel && (
                <div className="text-[12px] text-gray-500 mb-3">
                  Ngày đăng: <strong className="text-gray-700">{featured.dateLabel}</strong>
                </div>
              )}
              <span className="inline-flex items-center gap-1 text-[13px] font-extrabold text-[#1E5BC6] transition-[gap] duration-150 group-hover:gap-2">
                Đọc thêm »
              </span>
            </div>
          </Link>

          {/* Side stack — quyết định chiều cao toàn khung */}
          <div className="flex flex-col gap-3">
            {side.map((a, i) => (
              <Link
                key={i}
                href={a.href}
                className="group bg-white rounded-xl overflow-hidden shadow-sm flex items-stretch no-underline flex-1 transition-shadow duration-200 hover:shadow-md"
              >
                <div className="w-[180px] shrink-0 aspect-video self-center overflow-hidden relative bg-gray-100 rounded-lg m-2">
                  <Image
                    src={a.img}
                    alt={a.imgAlt}
                    fill
                    unoptimized
                    sizes="180px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-center flex-1 pr-4 py-3 min-w-0">
                  <div className="text-[14px] font-extrabold text-[#1A1A1A] mb-1.5 leading-snug line-clamp-2 group-hover:text-[#1E5BC6] transition-colors">
                    {a.title}
                  </div>
                  {a.dateLabel && (
                    <div className="text-[11.5px] text-gray-500">
                      Ngày đăng: <strong className="text-gray-700">{a.dateLabel}</strong>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

export default BlogSection

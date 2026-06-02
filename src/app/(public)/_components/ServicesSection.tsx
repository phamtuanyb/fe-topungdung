import Link from 'next/link'
import Image from 'next/image'
import { getEmojiForPost, getPostsForCategoryTree } from '@/lib/public-content'
import type { ServiceCard } from '../_configs/types'
import { Category, HomepageServicesSectionConfig, Post } from '@/types'
import { SERVICES_SLUGS } from '@/constants/app.constants'

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&h=450&q=80'

type ServicesSectionProps = {
  categories: Category[]
  posts: Post[]
  config?: HomepageServicesSectionConfig
}

async function ServicesSection({ categories, posts, config }: ServicesSectionProps) {

  const label = config?.label ?? 'DỊCH VỤ'
  const heading = config?.heading ?? 'Vsoftware làm'
  const headingEm = config?.headingEm ?? 'được gì'
  const headingSuffix = config?.headingSuffix ?? 'cho bạn?'
  const description = config?.description ?? '6 nhóm giải pháp, mỗi cái đều xuất phát từ bài toán thực tế của SME Việt — không phải từ wishlist công nghệ.'

  const servicePosts = getPostsForCategoryTree(SERVICES_SLUGS, categories, posts)

  const cards: ServiceCard[] =
    servicePosts.slice(0, 6).map((post, i) => ({
      icon: getEmojiForPost(post.slug, post.title),
      color: i % 2 === 0 ? 'blue' : 'orange',
      title: post.title,
      desc: post.excerpt || post.seoDescription || 'Dịch vụ chất lượng cao',
      tags: [post.category?.name || 'Dịch vụ'],
      href: `/dich-vu/${post.slug}`,
      badge: post.badge ?? undefined,
      imageSrc: post.thumbnail ?? undefined,
    }))


  return (
    <section className="py-20 bg-white" id="services">
      <div className="max-w-8xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-[clamp(24px,3vw,36px)] font-extrabold text-vs-dark leading-[1.25]">
            {heading} <span className="text-vs-blue">{headingEm}</span> {headingSuffix}
          </h2>
          <p className="text-[16px] text-vs-gray-600 mt-3 max-w-xl mx-auto leading-[1.65] whitespace-pre-line">
            {description}
          </p>
        </div>
        {cards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((svc, i) => (
              <Link
                key={svc.href + i}
                href={svc.href}
                className="group relative bg-white border border-vs-gray-200 rounded-2xl p-7 hover:border-vs-blue hover:bg-[linear-gradient(135deg,_#0D2757_0%,_#1E5BC6_100%)] hover:text-white hover:shadow-vs-lg hover:-translate-y-1 no-underline"
              >
                {svc.badge && (
                  <span className="absolute top-4 right-4 z-10 text-[10px] font-extrabold bg-vs-orange text-white px-2.5 py-1 rounded-full uppercase tracking-[0.08em] shadow-md">
                    {svc.badge}
                  </span>
                )}
                <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-5 bg-vs-gray-100">
                  <Image
                    src={svc.imageSrc || FALLBACK_IMG}
                    alt={svc.title}
                    fill
                    unoptimized
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-[17px] font-extrabold text-vs-dark mb-2 group-hover:text-white">
                  {svc.title}
                </h3>
                <p className="text-[14px] text-vs-gray-600 leading-[1.65] mb-4 group-hover:text-[rgba(255,255,255,.75)] whitespace-pre-line">
                  {svc.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {svc.tags.map((tag, ti) => (
                    <span
                      key={ti}
                      className="text-[11px] font-bold px-2.5 py-1 bg-vs-bg rounded-full text-vs-gray-600 group-hover:bg-vs-blue group-hover:text-[rgba(255,255,255,.75)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>))}
          </div>
        ) : (
          <div className="text-center py-10 text-vs-gray-600">
            📭 Chưa có bài viết nào thuộc danh mục Dịch vụ.
          </div>)}
      </div>
    </section>
  )
}

export default ServicesSection

import Link from 'next/link'
import Image from 'next/image'
import { getEmojiForPost } from '@/lib/public-content'
import { HomepageAiAgentSectionConfig, Post } from '@/types'
import { AI_AGENT_SLUGS } from '@/constants/app.constants'

type AiAgentSectionProps = {
  aiPosts: Post[]
  config?: HomepageAiAgentSectionConfig
}

const MAX_CARDS = 4

async function AiAgentSection({ aiPosts, config }: AiAgentSectionProps) {

  const label = config?.label ?? 'AI AGENT'
  const heading = config?.heading ?? 'AI Agent theo'
  const headingEm = config?.headingEm ?? 'từng phòng ban'
  const description = config?.description ?? 'Không phải chatbot trả lời câu hỏi. Đây là nhân viên AI làm việc 24/7 — tích hợp sâu với phần mềm doanh nghiệp.'

  // Chỉ hiện sản phẩm có badge — tối đa 4, sort theo displayOrder ASC.
  const cards = aiPosts
    .filter((p) => !!p.badge)
    .slice()
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .slice(0, MAX_CARDS)

  return (
    <section className="py-20 bg-vs-bg" id="ai-agent">
      <div className="max-w-8xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-[clamp(24px,3vw,36px)] font-extrabold text-vs-dark leading-[1.25]">
            {heading} <em className="not-italic text-vs-blue">{headingEm}</em>
          </h2>
          <p className="text-[16px] text-vs-gray-600 mt-3 max-w-xl mx-auto leading-[1.65] whitespace-pre-line">
            {description}
          </p>
        </div>
        {cards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {cards.map((post, i) => {
              const href = `/${AI_AGENT_SLUGS}/${post.slug}`
              // Lấy 4 features đầu làm bullets (giống ViAI)
              const features = post.productPageConfig?.features?.items ?? []
              const bullets = features.slice(0, 4).map((f) => f.title).filter(Boolean)
              return (
                <Link
                  key={post.id}
                  href={href}
                  className="group relative rounded-2xl p-6 no-underline transition-all flex flex-col bg-white shadow-vs hover:shadow-vs-lg hover:-translate-y-1 hover:bg-vs-dark-gradient"
                >
                  {post.badge && (
                    <span className="absolute top-4 right-4 z-10 text-[10px] font-extrabold bg-vs-orange text-white px-2.5 py-1 rounded-full uppercase tracking-[0.08em] shadow-md">
                      {post.badge}
                    </span>
                  )}
                  {/* Box ảnh sản phẩm — aspect 4:5 (chuẩn box ViAI 348×435), object-contain giữ ratio gốc */}
                  <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden mb-4 bg-transparent flex items-center justify-center">
                    {post.logoUrl ? (
                      <Image
                        src={post.logoUrl}
                        alt={post.title}
                        fill
                        unoptimized
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-contain p-2"
                      />
                    ) : (
                      <span className="text-5xl">{getEmojiForPost(post.slug, post.title)}</span>
                    )}
                  </div>
                  <h3 className="text-[16px] font-extrabold mb-3 leading-snug text-vs-dark group-hover:text-white line-clamp-2">
                    {post.title}
                  </h3>
                  {bullets.length > 0 ? (
                    <ul className="flex flex-col gap-1.5 mb-4 flex-1">
                      {bullets.map((b, bi) => (
                        <li key={bi} className="flex items-start gap-2 text-[13px] leading-snug text-vs-gray-700 group-hover:text-white/85">
                          <span className="text-vs-orange shrink-0 mt-0.5 font-bold">✓</span>
                          <span className="line-clamp-2">{b}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[13.5px] leading-[1.65] mb-4 flex-1 text-vs-gray-600 group-hover:text-white/75 whitespace-pre-line">
                      {post.excerpt || post.seoDescription || 'Giải pháp AI Agent thông minh'}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-1 text-[13px] font-extrabold transition-[gap] group-hover:gap-2 text-vs-blue group-hover:text-vs-orange">
                    Tìm hiểu thêm →
                  </span>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-10 text-vs-gray-600">
            📭 Chưa có sản phẩm AI Agent nào được gắn badge. Vào admin → sửa bài viết AI Agent → gắn Badge để hiện ở đây.
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            href={`/${AI_AGENT_SLUGS}`}
            className="inline-flex items-center gap-2 text-[14px] font-bold text-vs-blue border-2 border-vs-blue px-7 py-2.5 rounded-md hover:bg-vs-blue hover:text-white transition-all"
          >
            Tất cả sản phẩm AI Agent →
          </Link>
        </div>
      </div>
    </section>
  )
}

export default AiAgentSection

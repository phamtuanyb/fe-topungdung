import type { Metadata } from 'next'
import Link from 'next/link'
import { getCategoryPosts } from '@/lib/api/public'
import { getEmojiForPost } from '@/lib/public-content'
import { AI_AGENT_SLUGS } from '@/constants/app.constants'

export const metadata: Metadata = {
  title: 'Phần mềm AI Agent — Vsoftware',
  description:
    'Toàn bộ sản phẩm AI Agent của Vsoftware: AI Sales, Marketing, CSKH, Kế toán, Nhân sự, Báo cáo CEO. Tích hợp sâu vào phần mềm doanh nghiệp.',
}

export default async function AiAgentIndexPage() {
  const res = await getCategoryPosts(AI_AGENT_SLUGS, { limit: 100 }).catch(() => ({ data: [] }))
  const products = (res.data || []).slice().sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))

  return (
    <div className="bg-vs-bg min-h-screen">
      <section className="bg-vs-hero py-16">
        <div className="max-w-8xl mx-auto px-6 text-center">
          <h1 className="text-[clamp(28px,4vw,44px)] font-extrabold text-vs-dark leading-[1.2] mb-4">
            Toàn bộ sản phẩm <span className="text-vs-blue">AI Agent</span> của Vsoftware
          </h1>
          <p className="text-[16px] text-vs-gray-700 max-w-2xl mx-auto leading-[1.7]">
            Mỗi sản phẩm là 1 nhân viên AI làm việc 24/7 — tích hợp sâu vào phần mềm doanh nghiệp,
            tự động hoá quy trình thực tế.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-8xl mx-auto px-6">
          {products.length === 0 ? (
            <div className="text-center py-16 text-vs-gray-600">
              📭 Chưa có sản phẩm AI Agent nào. Đăng bài mới trong danh mục <strong>Phần mềm AI Agent</strong> để hiện ở đây.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((post) => {
                const href = `/${AI_AGENT_SLUGS}/${post.slug}`
                return (
                  <Link
                    key={post.id}
                    href={href}
                    className="group relative bg-white rounded-2xl p-6 shadow-vs hover:shadow-vs-md hover:-translate-y-1 transition-all flex flex-col no-underline"
                  >
                    {post.badge && (
                      <span className="absolute top-4 right-4 text-[10px] font-extrabold bg-vs-orange text-white px-2.5 py-1 rounded-full uppercase tracking-[0.08em]">
                        {post.badge}
                      </span>
                    )}
                    <div className="w-[60px] h-[60px] p-2 rounded-xl flex items-center justify-center text-2xl mb-4 overflow-hidden bg-vs-blue-light">
                      {post.logoUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={post.logoUrl} alt={post.title} className="w-full h-full object-contain" />
                      ) : (
                        getEmojiForPost(post.slug, post.title)
                      )}
                    </div>
                    <h3 className="text-[17px] font-extrabold text-vs-dark mb-2 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-[13.5px] text-vs-gray-600 leading-[1.65] mb-4 flex-1 whitespace-pre-line">
                      {post.excerpt || post.seoDescription || 'Giải pháp AI Agent thông minh.'}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[13px] font-extrabold text-vs-blue transition-[gap] group-hover:gap-2">
                      Xem chi tiết →
                    </span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { getCategoryPosts } from '@/lib/api/public'
import { getEmojiForPost } from '@/lib/public-content'
import { SERVICES_SLUGS, SERVICES_URL } from '@/constants/app.constants'

export const metadata: Metadata = {
  title: 'Dịch vụ — Vsoftware',
  description:
    'Toàn bộ dịch vụ Vsoftware: Phần mềm vận hành, theo ngành nghề, thiết kế web & nền tảng. Triển khai theo yêu cầu cho SMEs.',
}

export default async function ServicesIndexPage() {
  const res = await getCategoryPosts(SERVICES_SLUGS, { limit: 100 }).catch(() => ({ data: [] }))
  const products = (res.data || []).slice().sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))

  return (
    <div className="bg-vs-bg min-h-screen">
      <section className="bg-vs-hero py-16">
        <div className="max-w-8xl mx-auto px-6 text-center">
          <h1 className="text-[clamp(28px,4vw,44px)] font-extrabold text-vs-dark leading-[1.2] mb-4">
            Toàn bộ <span className="text-vs-blue">dịch vụ</span> của Vsoftware
          </h1>
          <p className="text-[16px] text-vs-gray-700 max-w-2xl mx-auto leading-[1.7]">
            Phần mềm vận hành, giải pháp theo ngành nghề, thiết kế web & app — triển khai theo yêu cầu cho doanh nghiệp Việt.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-8xl mx-auto px-6">
          {products.length === 0 ? (
            <div className="text-center py-16 text-vs-gray-600">
              📭 Chưa có dịch vụ nào. Đăng bài mới trong danh mục <strong>Dịch vụ</strong> để hiện ở đây.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((post) => {
                const href = `/${SERVICES_URL}/${post.slug}`
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
                      {post.excerpt || post.seoDescription || 'Giải pháp phần mềm theo yêu cầu.'}
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

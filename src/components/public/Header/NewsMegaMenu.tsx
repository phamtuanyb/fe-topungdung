import { HEIGHT_HEADER_PUBLIC } from "@/constants/app.constants"
import { cn } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import MegaMenuFooter from "./MegaMenuFooter"
import type { Category, Post } from "@/types"

type Props = {
  isOpen: boolean
  subCategories: Category[]
  posts: Post[]
}

const SUB_ICONS: Record<string, string> = {
  'case-study': '🏆',
  'tin-tong-hop': '📡',
  'huong-dan-su-dung': '📖',
  'kien-thuc-marketing': '📈',
}

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=200&h=200&q=80'

function formatDate(iso?: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}/${mm}/${d.getFullYear()}`
}

const NewsMegaMenu = ({ isOpen, subCategories, posts }: Props) => {
  // Sort posts by publishedAt desc, take 4
  const latestPosts = [...posts]
    .sort((a, b) => {
      const da = new Date(a.publishedAt ?? a.createdAt).getTime()
      const db = new Date(b.publishedAt ?? b.createdAt).getTime()
      return db - da
    })
    .slice(0, 4)

  return (
    <div
      className={cn(
        `fixed left-0 right-0 bg-white border-t-2 border-b border-vs-blue-200 shadow-[0_16px_48px_rgba(0,0,0,0.12)] z-[200] transition-all duration-[180ms]`,
        {
          'opacity-100 visible translate-y-0 pointer-events-auto': isOpen,
          'opacity-0 invisible -translate-y-1.5 pointer-events-none': !isOpen,
        }
      )}
      style={{ top: HEIGHT_HEADER_PUBLIC }}
    >
      <div className="max-w-8xl mx-auto px-6 pt-5 pb-2 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {/* CỘT TRÁI: Chuyên mục */}
        <div>
          <div className="text-[11px] font-extrabold uppercase tracking-[.12em] text-vs-blue mb-3 pb-2 border-b border-vs-gray-100">
            Chuyên mục
          </div>
          {subCategories.length === 0 ? (
            <div className="text-[12px] text-vs-gray-500 italic py-2">
              Chưa có chuyên mục. Tạo tại /admin/categories.
            </div>
          ) : (
            <nav className="flex flex-col gap-1">
              {subCategories.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/chuyen-muc/${sub.slug}`}
                  className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-semibold text-vs-gray-700 hover:bg-vs-blue-light hover:text-vs-blue transition-all no-underline"
                >
                  <span className="text-[18px] w-8 h-8 flex items-center justify-center rounded-full bg-vs-bg group-hover:bg-white shrink-0">
                    {SUB_ICONS[sub.slug] ?? '📰'}
                  </span>
                  <span className="flex-1 min-w-0 truncate">{sub.name}</span>
                </Link>
              ))}
            </nav>
          )}
        </div>

        {/* CỘT PHẢI: Bài viết mới nhất (grid 2x2) */}
        <div>
          <div className="text-[11px] font-extrabold uppercase tracking-[.12em] text-vs-orange mb-3 pb-2 border-b border-vs-gray-100">
            Bài viết mới nhất
          </div>
          {latestPosts.length === 0 ? (
            <div className="text-[13px] text-vs-gray-500 italic py-4 text-center">
              Chưa có bài viết.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {latestPosts.map((p) => {
                const date = formatDate(p.publishedAt ?? p.createdAt)
                return (
                  <Link
                    key={p.id}
                    href={`/tin-tuc/${p.slug}`}
                    className="group flex gap-3 no-underline items-start"
                  >
                    <div className="relative w-[72px] h-[72px] shrink-0 overflow-hidden rounded-lg bg-vs-bg">
                      <Image
                        src={p.thumbnail || FALLBACK_IMG}
                        alt={p.title}
                        fill
                        unoptimized
                        sizes="72px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex-1 min-w-0 py-0.5">
                      <h4 className="text-[13px] font-bold text-vs-dark leading-snug line-clamp-2 mb-1 group-hover:text-vs-blue transition-colors">
                        {p.title}
                      </h4>
                      {date && (
                        <div className="text-[11px] text-vs-gray-500">{date}</div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <MegaMenuFooter
        heading="Cập nhật tin tức công nghệ mỗi tuần"
        sub={`${posts.length}+ bài viết về Case Study, Marketing, Hướng dẫn và Tin ngành.`}
        cta="Xem tất cả tin tức →"
        ctaHref="/tin-tuc"
      />
    </div>
  )
}

export default NewsMegaMenu

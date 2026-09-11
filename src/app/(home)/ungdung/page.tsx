import type { Metadata } from 'next'
import type { Post } from '@/types'
import { getCategories, getTudApps, getTudHomeConfig } from '@/lib/api/public'
import { mergeTudConfig } from '../default-config'
import { blurbFrom, buildDiscoverData } from '../discover-data'
import { INTENT_ICONS, INTENT_FALLBACK } from '../_components/intent-icons'
import { TudFooter, TudHeader } from '../_components/TudChrome'

export const revalidate = 60

export const metadata: Metadata = {
  title: { absolute: 'Tất cả nhóm ứng dụng | TopỨngDụng' },
  description: 'Duyệt ứng dụng, phần mềm và công cụ AI theo từng nhu cầu công việc.',
  alternates: { canonical: '/ungdung' },
}

export default async function UngDungIndexPage() {
  const [cfgRes, catsRes, appsRes] = await Promise.all([
    getTudHomeConfig().catch(() => ({ data: null })),
    getCategories().catch(() => ({ data: [] })),
    // Phải lấy đủ toàn bộ ứng dụng, nếu không số đếm trên thẻ sẽ thiếu.
    getTudApps(1000).catch(() => ({ data: [] as Post[] })),
  ])

  const config = mergeTudConfig(cfgRes.data)
  const apps = appsRes.data ?? []

  // Cộng dồn số bài từ danh mục cấp 3 lên nhóm cấp 2 (xem discover-data.ts).
  const { counts, subs: groupSubs, names: groupNames } = buildDiscoverData(catsRes.data, apps)

  // Danh mục con của "ung-dung"
  const root = catsRes.data.find((c) => c.slug === 'ung-dung')
  const groups = root ? catsRes.data.filter((c) => c.parentId === root.id) : []

  // Giữ đúng thứ tự các thẻ đã cấu hình ở trang chủ
  const ordered = config.discover.cards
    .map((card) => ({ card, cat: groups.find((g) => g.slug === card.categorySlug) }))
    .filter((x) => x.cat)

  const rest = groups.filter((g) => !ordered.some((o) => o.cat?.id === g.id))

  // Thẻ nhu cầu dựng đúng khối như khối "Bạn đang muốn làm gì?" ở trang chủ:
  // ô biểu tượng · nội dung · nút mũi tên. CSS `.intent` là lưới ba cột nên
  // thiếu bất kỳ phần nào là bố cục vỡ, tiêu đề và mô tả nằm ngang cạnh nhau.
  const card = (slug: string, label: string, blurb: string, key: string | number) => {
    const n = counts[slug] ?? 0
    const ico = INTENT_ICONS[slug] || INTENT_FALLBACK
    return (
      <a className="intent" href={`/ungdung/${slug}`} key={key}>
        <span className="intent-ico" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            {ico.map((d, k) => (
              <path d={d} key={k} />
            ))}
          </svg>
        </span>
        <div className="intent-body">
          <div className="intent-top">
            <h3>{label}</h3>
            {/* Nhóm chưa có bài: "0 ứng dụng" đọc như thẻ hỏng, nói "Sắp có" đúng hơn. */}
            <span className={`intent-count${n ? '' : ' soon'}`}>
              {n ? `${n} ứng dụng` : 'Sắp có'}
            </span>
          </div>
          {blurb && <p className="intent-subs">{blurb}</p>}
        </div>
        <span className="intent-go" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h13" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </span>
      </a>
    )
  }

  return (
    <div>
      <TudHeader config={config.header} />

      <main>
        <section className="cat-hero">
          <div className="wrap">
            <div className="crumb">
              <a href="/">Trang chủ</a> <span>/</span> <span>Ứng dụng</span>
            </div>
            <div className="eyebrow">{config.discover.eyebrow}</div>
            {/* Tiêu đề hai tông như khối cùng tên ở trang chủ: phần đầu xanh,
                phần nhấn cam. Thiếu `headingAccent` thì mất luôn nửa câu hỏi. */}
            <div className="ud-hero-row">
              <h1 className="h2-blue">
                {config.discover.heading}
                {config.discover.headingAccent && (
                  <>
                    {' '}
                    <span className="h2-accent-warm">{config.discover.headingAccent}</span>
                  </>
                )}
              </h1>
              <p>{config.discover.description}</p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div className="intent-grid">
              {ordered.map(({ card: cfg, cat }) =>
                card(
                  cat!.slug,
                  cfg.shortTitle?.trim() || groupNames[cat!.slug] || cat!.name,
                  cfg.blurb?.trim() || blurbFrom(groupSubs[cat!.slug]),
                  cat!.id,
                ),
              )}
              {rest.map((cat) =>
                card(cat.slug, cat.name, blurbFrom(groupSubs[cat.slug]), cat.id),
              )}
            </div>
          </div>
        </section>
      </main>

      <TudFooter header={config.header} footer={config.footer} />
    </div>
  )
}

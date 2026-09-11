import type { Metadata } from 'next'
import type { Category, Post } from '@/types'
import { getAllVoteSummaries, getCategories, getTudApps, getTudHomeConfig } from '@/lib/api/public'
import { mergeTudConfig } from '../default-config'
import { TudFooter, TudHeader } from '../_components/TudChrome'
import RankingTable, { type VoteMap } from '../_components/RankingTable'
import { buildDiscoverData } from '../discover-data'

// Số liệu bình chọn được tải lại phía trình duyệt nên HTML chỉ cần cache ngắn.
export const revalidate = 30

export const metadata: Metadata = {
  title: { absolute: 'Bảng xếp hạng ứng dụng | TopỨngDụng' },
  description:
    'Xếp hạng ứng dụng, phần mềm và công cụ AI theo điểm của ban biên tập và theo bình chọn của người dùng.',
  alternates: { canonical: '/ranking' },
}

export default async function RankingPage() {
  const [cfgRes, appsRes, catsRes, votesRes] = await Promise.all([
    getTudHomeConfig().catch(() => ({ data: null })),
    // Phải lấy đủ toàn bộ ứng dụng, nếu không bảng xếp hạng và bộ đếm sẽ thiếu.
    getTudApps(1000).catch(() => ({ data: [] as Post[] })),
    getCategories().catch(() => ({ data: [] as Category[] })),
    getAllVoteSummaries().catch(() => ({ data: {} as VoteMap })),
  ])

  const config = mergeTudConfig(cfgRes.data)
  const apps = appsRes.data ?? []
  const votes = (votesRes.data ?? {}) as VoteMap

  const root = catsRes.data.find((c) => c.slug === 'ung-dung')
  const subs = root ? catsRes.data.filter((c) => c.parentId === root.id) : []

  // Ánh xạ danh mục cấp 3 → nhóm cấp 2, dùng cho bộ lọc, bộ đếm và link danh mục.
  const { groupOf, pathOf } = buildDiscoverData(catsRes.data, apps)

  const totalVotes = Object.values(votes).reduce((s, v) => s + (v.count ?? 0), 0)

  // "Bảng xếp hạng" → "Bảng" (xanh) + "xếp hạng" (cam).
  const tieuDe = config.ranking.heading.trim()
  const ngat = tieuDe.indexOf(' ')
  const tuDau = ngat > 0 ? tieuDe.slice(0, ngat) : tieuDe
  const phanConLai = ngat > 0 ? tieuDe.slice(ngat + 1) : ''

  return (
    <div>
      <TudHeader config={config.header} />

      <main>
        <section className="cat-hero">
          <div className="wrap">
            <div className="crumb">
              <a href="/">Trang chủ</a> <span>/</span> <span>Bảng xếp hạng</span>
            </div>
            <div className="eyebrow">{config.ranking.eyebrow}</div>
            {/* Tiêu đề hai tông như các khối khác của trang: từ đầu xanh, phần
                còn lại cam. Tách ở dấu cách đầu tiên nên tiêu đề một từ vẫn
                hiện bình thường, chỉ là không có phần nhấn. */}
            <h1 className="h2-blue">
              {tuDau}
              {phanConLai && (
                <>
                  {' '}
                  <span className="h2-accent-warm">{phanConLai}</span>
                </>
              )}
            </h1>
            <p>{config.ranking.description}</p>
            <div className="cat-stats">
              <span>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h6v6H4z" />
                  <path d="M14 4h6v6h-6z" />
                  <path d="M4 14h6v6H4z" />
                  <path d="M14 14h6v6h-6z" />
                </svg>
                {apps.length} ứng dụng
              </span>
              <span>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87" />
                  <path d="M16 3.13a4 4 0 010 7.75" />
                </svg>
                {subs.length} nhóm
              </span>
              <span>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 20V11" />
                  <path d="M12 20V4" />
                  <path d="M18 20v-6" />
                </svg>
                {totalVotes} lượt bình chọn
              </span>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <RankingTable
              apps={apps}
              categories={subs}
              groupOf={groupOf}
              pathOf={pathOf}
              initialVotes={votes}
            />
          </div>
        </section>
      </main>

      <TudFooter header={config.header} footer={config.footer} />
    </div>
  )
}

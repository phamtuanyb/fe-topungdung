import type { Metadata } from 'next'
import type { Post } from '@/types'
import { getTudApps, getTudHomeConfig } from '@/lib/api/public'
import { mergeTudConfig } from '../default-config'
import { TudFooter, TudHeader } from '../_components/TudChrome'
import StackFlow from '../_components/StackFlow'

export const revalidate = 60

export const metadata: Metadata = {
  title: { absolute: 'Bộ công cụ nên dùng | TopỨngDụng' },
  description:
    'Bộ ứng dụng được chọn lọc và sắp theo đúng thứ tự công việc: từ ý tưởng, sản xuất cho tới lúc xuất bản.',
  alternates: { canonical: '/topapp' },
}

export default async function TopAppPage() {
  const [cfgRes, appsRes] = await Promise.all([
    getTudHomeConfig().catch(() => ({ data: null })),
    getTudApps(1000).catch(() => ({ data: [] as Post[] })),
  ])

  const config = mergeTudConfig(cfgRes.data)
  const apps = appsRes.data ?? []
  const stack = config.stack

  // Thứ tự các bước do admin sắp trong /admin/trang-chu → tab Creator Stack.
  // Chỉ dùng để đếm ở phần đầu trang; phần danh sách do StackFlow lo, dùng
  // chung với khối Creator Stack trên trang chủ nên hai nơi luôn khớp nhau.
  const steps = (stack.steps ?? []).map((s) => ({
    ...s,
    post: s.slug ? (apps.find((a) => a.slug === s.slug) ?? null) : null,
  }))

  return (
    <div>
      <TudHeader config={config.header} />

      <main>
        <section className="cat-hero">
          <div className="wrap">
            <div className="crumb">
              <a href="/">Trang chủ</a> <span>/</span> <span>Bộ công cụ</span>
            </div>
            <div className="eyebrow">{stack.eyebrow}</div>
            {/* Hai vế tiêu đề đã tách sẵn trong cấu hình nên tô màu được ngay:
                vế đầu xanh, vế sau cam, cùng luật với các trang khác. */}
            <h1 className="h2-blue">
              {stack.heading1} <span className="h2-accent-warm">{stack.heading2}</span>
            </h1>
            <p>{stack.description}</p>
            <div className="tapp-stats">
              <span className="tapp-stat">
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 2.5L22 7l-10 4.5L2 7z" />
                  <path d="M2 12l10 4.5L22 12" />
                  <path d="M2 17l10 4.5L22 17" />
                </svg>
                {steps.length} bước
              </span>
              <span className="tapp-stat">
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2-5.5-2.9-5.5 2.9 1-6.2L3 9.6l6.2-.9z" />
                </svg>
                {steps.filter((s) => s.post).length} ứng dụng có bài review
              </span>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <StackFlow variant="page" initialSteps={stack.steps ?? []} initialApps={apps} />

            <div className="tapp-foot">
              <a className="btn accent" href="/ranking">
                Xem toàn bộ bảng xếp hạng →
              </a>
              <a className="btn" href="/ungdung">
                Duyệt theo nhóm nhu cầu
              </a>
            </div>
          </div>
        </section>
      </main>

      <TudFooter header={config.header} footer={config.footer} />
    </div>
  )
}

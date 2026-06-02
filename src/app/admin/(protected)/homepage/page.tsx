'use client'

import { useEffect, useState } from 'react'
import { adminGetHomepageConfig, adminUpdateHomepageConfig } from '@/lib/api/admin'
import type {
  HomepageConfig,
  HomepageHeroConfig,
  HomepagePainPointsConfig,
  HomepageHowItWorksConfig,
  HomepageWhyConfig,
  HomepagePricingConfig,
  HomepageCtaConfig,
  HomepagePricingPlan,
  HomepageServicesSectionConfig,
  HomepageAiAgentSectionConfig,
  HomepageShowcaseConfig,
  HomepageShowcaseTab,
  HomepageHighlightsConfig,
  HomepageBlogConfig,
} from '@/types'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import MediaPicker from '@/components/admin/MediaPicker'
import IconPicker from '@/components/admin/IconPicker'
import SectionVisibilityToggle from '@/components/admin/SectionVisibilityToggle'

// ─── Default config (dùng khi chưa có data trong DB) ─────────────────────────

const DEFAULT_CONFIG: HomepageConfig = {
  hero: {
    badge: '✨ Phần mềm vừa vặn cho SME Việt',
    headline: 'Phần mềm vừa vặn cho',
    headlineHighlight: 'doanh nghiệp Việt',
    description:
      'Không dùng chung giải pháp đại trà. Vsoftware xây cho bạn đúng bài toán — CRM, App Mobile, Automation, Workflow — đúng chi phí, đúng tiến độ.',
    ctaPrimaryText: 'Tư vấn miễn phí 30 phút',
    ctaPrimaryHref: '/lien-he',
    ctaSecondaryText: 'Xem dịch vụ →',
    badges: [
      '✅ Không cần đặt cọc lớn',
      '✅ Demo trước khi ký hợp đồng',
      '✅ Bảo hành 12 tháng',
    ],
  },
  painPoints: {
    heading: 'Bạn đang gặp phải',
    headingEm: 'vấn đề này?',
    description:
      'Phần lớn SME Việt đang vận hành bằng Excel, Zalo và giấy tờ — và đang trả giá bằng thời gian, sai sót, và cơ hội bị bỏ lỡ.',
    items: [
      { title: 'Quản lý bằng Excel, Zalo, giấy tờ', description: 'Dữ liệu phân tán, sai sót, mất thời gian tổng hợp. Sếp muốn báo cáo — nhân viên loay hoay cả ngày.' },
      { title: 'Phần mềm mua rồi không dùng được', description: 'Mua giải pháp có sẵn nhưng không vừa quy trình. Tiền mất, nhân viên vẫn làm tay, không ai hài lòng.' },
      { title: 'Quy trình vận hành bằng người, không bằng hệ thống', description: 'Nhân viên chủ chốt nghỉ việc — quy trình đứng lại. Kiến thức nằm trong đầu người chứ không trong phần mềm.' },
      { title: 'Không có dữ liệu để ra quyết định', description: 'Không biết khách nào sinh lời, kênh nào hiệu quả, nhân viên nào bán tốt. Quyết định bằng cảm tính = rủi ro.' },
    ],
  },
  howItWorks: {
    heading: 'Quy trình',
    headingEm: '4 bước đơn giản',
    description: 'Từ lúc gặp nhau đến lúc bạn có phần mềm chạy thật — minh bạch từng bước.',
    steps: [
      { title: 'Tư vấn & Phân tích', description: 'Nghe bài toán, phân tích quy trình hiện tại, đề xuất giải pháp phù hợp nhất. Miễn phí 30 phút.' },
      { title: 'Thiết kế & Demo', description: 'Wireframe, UI mockup đúng nghiệp vụ của bạn. Anh xem trước khi ký — không ưng thì nói thẳng.' },
      { title: 'Phát triển & Test', description: 'Code, test kỹ, demo từng module. Cập nhật tiến độ hàng tuần. Không biến mất giữa dự án.' },
      { title: 'Bàn giao & Hỗ trợ', description: 'Training nhân viên, tài liệu sử dụng, hỗ trợ 24/7 tháng đầu. Bảo hành 12 tháng.' },
    ],
  },
  why: {
    label: 'TẠI SAO VSOFTWARE',
    heading: 'Không phải vì chúng tôi nói hay — mà vì chúng tôi làm được',
    description:
      'Vsoftware thuộc hệ sinh thái ViTechGroup. Đội ngũ đã xây dựng và vận hành nhiều sản phẩm phần mềm thực tế — không phải team học việc.',
    items: [
      { iconName: 'Target', title: 'Đúng bài toán — không bán tính năng thừa', description: 'Chúng tôi phân tích quy trình thực tế của bạn, chỉ build những gì bạn thực sự cần.' },
      { iconName: 'Zap', title: 'Triển khai nhanh 4–8 tuần', description: 'Methodology chia nhỏ module, bàn giao cuốn chiếu. Bạn dùng được phần đầu trong khi phần sau đang build.' },
      { iconName: 'Building2', title: 'Thuộc ViTechGroup — có pháp nhân, có địa chỉ', description: 'Không phải freelancer "biến mất sau khi nhận tiền". Hợp đồng rõ ràng, có văn phòng, có đội ngũ chuyên trách.' },
      { iconName: 'Wallet', title: 'Chi phí minh bạch từ đầu', description: 'Báo giá chi tiết theo module. Không tăng giá giữa dự án. Dự án nhỏ từ 30 triệu, thanh toán theo milestone.' },
    ],
    stats: [
      { value: '8+', label: 'Năm kinh nghiệm team công nghệ' },
      { value: '4–8\ntuần', label: 'Thời gian triển khai trung bình' },
      { value: '100%', label: 'Dự án có demo trước khi ký' },
      { value: '12\ntháng', label: 'Bảo hành & hỗ trợ sau bàn giao' },
    ],
    quote: 'Vsoftware không chỉ viết code. Chúng tôi đồng hành cùng bạn xây dựng hệ thống — từ bài toán thực tế đến phần mềm vận hành thực sự.',
    quoteAuthor: '— Lê Đức Nam, Founder & CEO ViTechGroup',
  },
  pricing: {
    heading: 'Bảng giá minh bạch',
    description: 'Không phí ẩn, không bất ngờ. Chọn gói phù hợp hoặc liên hệ để tư vấn riêng.',
    disclaimer: '* Giá trên là định hướng. Báo giá chính xác sau khảo sát miễn phí.',
    plans: [
      {
        name: 'Starter',
        subtitle: 'Hộ KD, Startup, Shop nhỏ',
        price: '15',
        period: '/ dự án trọn gói',
        features: ['1 phần mềm vertical chuẩn hoá', '1 AI Agent cơ bản (Sales hoặc CSKH)', 'Triển khai 2–4 tuần', 'Đào tạo 1 buổi', 'Bảo hành 6 tháng'],
        ctaText: 'Nhận tư vấn',
        ctaHref: 'https://zalo.me/vsoftware',
      },
      {
        name: 'Growth',
        subtitle: 'SME 10–50 nhân sự',
        price: '80',
        period: '/ dự án trọn gói',
        badge: 'PHỔ BIẾN NHẤT',
        featured: true,
        features: ['Phần mềm theo yêu cầu (custom)', '2–3 module mở rộng theo nghiệp vụ', '2 AI Agent (Sales + CSKH/Marketing)', 'App Mobile hỗ trợ (nếu cần)', 'Bảo hành 12 tháng + đào tạo nội bộ'],
        ctaText: 'Đặt lịch khảo sát',
        ctaHref: 'https://zalo.me/vsoftware',
      },
      {
        name: 'Enterprise',
        subtitle: 'SME 50+ / Chuyển đổi số tổng thể',
        price: '300',
        period: '/ dự án trọn gói',
        features: ['Full custom theo nghiệp vụ riêng', 'AI Agent toàn phòng ban', 'App Mobile iOS + Android', 'Tích hợp ERP, CRM, kế toán có sẵn', 'Bảo hành 18 tháng + SLA cam kết'],
        ctaText: 'Gặp chuyên gia',
        ctaHref: 'tel:+84123456789',
      },
    ],
  },
  cta: {
    heading: 'Sẵn sàng xây phần mềm vừa vặn?',
    description: 'Tư vấn miễn phí 30 phút — không cần đặt cọc, không áp lực ký hợp đồng.',
    ctaPrimaryText: 'Đặt lịch tư vấn ngay',
    ctaPrimaryHref: '/lien-he',
    ctaSecondaryText: 'Xem case study',
    ctaSecondaryHref: '/tin-tuc',
    note: '🔒 Thông tin của bạn được bảo mật tuyệt đối',
  },
  services: {
    label: 'DỊCH VỤ',
    heading: 'Vsoftware làm',
    headingEm: 'được gì',
    headingSuffix: 'cho bạn?',
    description: '6 nhóm giải pháp, mỗi cái đều xuất phát từ bài toán thực tế của SME Việt — không phải từ wishlist công nghệ.',
  },
  aiAgent: {
    label: 'AI AGENT',
    heading: 'AI Agent theo',
    headingEm: 'từng phòng ban',
    description: 'Không phải chatbot trả lời câu hỏi. Đây là nhân viên AI làm việc 24/7 — tích hợp sâu với phần mềm doanh nghiệp.',
  },
  showcase: {
    heading: 'Xem',
    headingEm: 'chúng tôi có thể build',
    headingSuffix: 'gì cho bạn',
    description: 'Không phải ảnh Photoshop đẹp trên mạng. Đây là UI style chúng tôi build — clean, chuyên nghiệp, dễ dùng.',
    tabs: [
      {
        label: '📊 CRM & Sales',
        imageSrc: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&h=720&q=80',
        imageAlt: 'CRM Dashboard',
        title: 'CRM Vsoftware — Quản lý khách hàng & doanh số',
        description: 'Pipeline rõ ràng, theo dõi cơ hội từ lead đến chốt đơn. Báo cáo realtime, không bỏ sót khách hàng.',
        ctaText: 'Liên hệ tư vấn',
        ctaHref: '/contact',
      },
      {
        label: '📦 Quản lý kho',
        imageSrc: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&h=720&q=80',
        imageAlt: 'WMS Dashboard',
        title: 'WMS — Xuất nhập tồn chính xác',
        description: 'Quản lý SKU, cảnh báo hàng sắp hết, theo dõi xuất nhập theo ngày.',
        ctaText: 'Liên hệ tư vấn',
        ctaHref: '/contact',
      },
      {
        label: '📱 App Mobile',
        imageSrc: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&h=720&q=80',
        imageAlt: 'App Mobile',
        title: 'App Mobile — Quản lý mọi nơi',
        description: 'Bán hàng, theo dõi đơn, dashboard doanh thu trên điện thoại. iOS + Android.',
        ctaText: 'Liên hệ tư vấn',
        ctaHref: '/contact',
      },
      {
        label: '📈 Báo cáo Analytics',
        imageSrc: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&h=720&q=80',
        imageAlt: 'Analytics Dashboard',
        title: 'Analytics — Báo cáo kinh doanh realtime',
        description: 'Doanh thu, đơn hàng, top nhân viên, top sản phẩm — cập nhật từng phút.',
        ctaText: 'Liên hệ tư vấn',
        ctaHref: '/contact',
      },
    ],
  },
  blog: {
    heading: 'Tin tức &',
    headingEm: 'Kiến thức công nghệ',
    ctaText: 'Xem tất cả bài viết →',
    ctaHref: '/tin-tuc',
  },
  highlights: {
    heading: 'Vsoftware',
    headingEm: 'và những dấu ấn nổi bật',
    images: [
      { src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&h=675&q=80', alt: 'Analytics dashboard' },
      { src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&h=675&q=80', alt: 'Team collaboration' },
      { src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&h=675&q=80', alt: 'Business data' },
      { src: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&h=675&q=80', alt: 'Tech meeting' },
      { src: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&h=675&q=80', alt: 'Data charts' },
      { src: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&h=675&q=80', alt: 'Business presentation' },
      { src: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&h=675&q=80', alt: 'Business meeting' },
      { src: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&h=675&q=80', alt: 'Startup team' },
      { src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&h=675&q=80', alt: 'Tech professional' },
      { src: 'https://images.unsplash.com/photo-1488229297570-58520851e868?auto=format&fit=crop&w=1200&h=675&q=80', alt: 'Code screen' },
      { src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&h=675&q=80', alt: 'Office environment' },
      { src: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&h=675&q=80', alt: 'Team meeting' },
    ],
  },
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

const inputCls =
  'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400'

function SectionCard({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {title && (
        <div className="border-b border-slate-100 px-5 py-3.5">
          <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
        </div>
      )}
      <div className="p-5 space-y-4">{children}</div>
    </div>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  )
}

function ListItemCard({
  index,
  onRemove,
  children,
}: {
  index: number
  onRemove: () => void
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-slate-400">#{index + 1}</span>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-lg border border-red-100 px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors flex items-center gap-1"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Xóa
        </button>
      </div>
      {children}
    </div>
  )
}

// ─── Tab: Hero ────────────────────────────────────────────────────────────────

function HeroTab({
  config,
  onChange,
}: {
  config: HomepageConfig
  onChange: (c: HomepageConfig) => void
}) {
  const { hero } = config
  function set(patch: Partial<HomepageHeroConfig>) {
    onChange({ ...config, hero: { ...hero, ...patch } })
  }

  return (
    <div className="space-y-4">
      <SectionVisibilityToggle hidden={hero.hidden ?? false} onChange={(h) => set({ hidden: h })} sectionLabel="Hero" />
      <SectionCard title="Tiêu đề">
        <Field label="Badge (nhãn nhỏ trên heading)">
          <input value={hero.badge} onChange={(e) => set({ badge: e.target.value })} className={inputCls} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Headline (phần thường)">
            <input value={hero.headline} onChange={(e) => set({ headline: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Headline highlight (màu xanh)">
            <input
              value={hero.headlineHighlight}
              onChange={(e) => set({ headlineHighlight: e.target.value })}
              className={inputCls}
            />
          </Field>
        </div>
        <Field label="Mô tả">
          <textarea
            value={hero.description}
            onChange={(e) => set({ description: e.target.value })}
            rows={3}
            className={inputCls}
          />
        </Field>
      </SectionCard>

      <SectionCard title="Ảnh hero (bên phải, thay mockup dashboard mặc định)">
        <Field
          label="Ảnh hero"
          hint="Để trống = hiện mockup CSS Dashboard mặc định. Upload ảnh để thay. Khuyến nghị tỉ lệ 16:9, vd 1280×720px."
        >
          <MediaPicker
            value={{ src: hero.heroImageSrc ?? '', alt: hero.heroImageAlt ?? '' }}
            onChange={(v) => set({ heroImageSrc: v.src || null, heroImageAlt: v.alt || null })}
          />
        </Field>
      </SectionCard>

      <SectionCard title="Nút CTA">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Nút chính — Text">
            <input
              value={hero.ctaPrimaryText}
              onChange={(e) => set({ ctaPrimaryText: e.target.value })}
              className={inputCls}
            />
          </Field>
          <Field label="Nút chính — URL">
            <input
              value={hero.ctaPrimaryHref}
              onChange={(e) => set({ ctaPrimaryHref: e.target.value })}
              className={inputCls}
            />
          </Field>
          <Field label="Nút phụ — Text">
            <input
              value={hero.ctaSecondaryText}
              onChange={(e) => set({ ctaSecondaryText: e.target.value })}
              className={inputCls}
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Badges (điểm trust nhỏ phía dưới CTA)">
        <button
          type="button"
          onClick={() => set({ badges: ['✅ ', ...hero.badges] })}
          className="mb-2 flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <span className="text-base leading-none">+</span> Thêm badge (lên đầu)
        </button>
        <div className="space-y-2">
          {hero.badges.map((badge, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={badge}
                onChange={(e) => {
                  const badges = hero.badges.map((b, j) => (j === i ? e.target.value : b))
                  set({ badges })
                }}
                className={`${inputCls} flex-1`}
                placeholder="Ví dụ: ✅ Không cần đặt cọc lớn"
              />
              <button
                type="button"
                onClick={() => set({ badges: hero.badges.filter((_, j) => j !== i) })}
                className="shrink-0 rounded-lg border border-red-100 p-2 text-red-400 hover:bg-red-50 transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

// ─── Tab: Pain Points ─────────────────────────────────────────────────────────

function PainPointsTab({
  config,
  onChange,
}: {
  config: HomepageConfig
  onChange: (c: HomepageConfig) => void
}) {
  const { painPoints } = config
  function set(patch: Partial<HomepagePainPointsConfig>) {
    onChange({ ...config, painPoints: { ...painPoints, ...patch } })
  }

  return (
    <div className="space-y-4">
      <SectionVisibilityToggle hidden={painPoints.hidden ?? false} onChange={(h) => set({ hidden: h })} sectionLabel="Pain Points" />
      <SectionCard title="Tiêu đề section">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Heading (phần thường)">
            <input value={painPoints.heading} onChange={(e) => set({ heading: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Heading highlight (màu xanh)">
            <input
              value={painPoints.headingEm}
              onChange={(e) => set({ headingEm: e.target.value })}
              className={inputCls}
            />
          </Field>
        </div>
        <Field label="Mô tả">
          <textarea
            value={painPoints.description}
            onChange={(e) => set({ description: e.target.value })}
            rows={2}
            className={inputCls}
          />
        </Field>
      </SectionCard>

      <button
        type="button"
        onClick={() => set({ items: [{ title: '', description: '' }, ...painPoints.items] })}
        className="w-full rounded-2xl border-2 border-dashed border-slate-200 py-4 text-sm font-medium text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors"
      >
        + Thêm pain point (lên đầu)
      </button>

      <div className="space-y-3">
        {painPoints.items.map((item, i) => (
          <ListItemCard
            key={i}
            index={i}
            onRemove={() => set({ items: painPoints.items.filter((_, j) => j !== i) })}
          >
            <Field label="Tiêu đề">
              <input
                value={item.title}
                onChange={(e) => {
                  const items = painPoints.items.map((it, j) =>
                    j === i ? { ...it, title: e.target.value } : it
                  )
                  set({ items })
                }}
                className={inputCls}
              />
            </Field>
            <Field label="Mô tả">
              <textarea
                value={item.description}
                onChange={(e) => {
                  const items = painPoints.items.map((it, j) =>
                    j === i ? { ...it, description: e.target.value } : it
                  )
                  set({ items })
                }}
                rows={2}
                className={inputCls}
              />
            </Field>
          </ListItemCard>
        ))}
      </div>
    </div>
  )
}

// ─── Tab: How It Works ────────────────────────────────────────────────────────

function HowItWorksTab({
  config,
  onChange,
}: {
  config: HomepageConfig
  onChange: (c: HomepageConfig) => void
}) {
  const { howItWorks } = config
  function set(patch: Partial<HomepageHowItWorksConfig>) {
    onChange({ ...config, howItWorks: { ...howItWorks, ...patch } })
  }

  return (
    <div className="space-y-4">
      <SectionVisibilityToggle hidden={howItWorks.hidden ?? false} onChange={(h) => set({ hidden: h })} sectionLabel="How It Works" />
      <SectionCard title="Tiêu đề section">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Heading (phần thường)">
            <input
              value={howItWorks.heading}
              onChange={(e) => set({ heading: e.target.value })}
              className={inputCls}
            />
          </Field>
          <Field label="Heading highlight">
            <input
              value={howItWorks.headingEm}
              onChange={(e) => set({ headingEm: e.target.value })}
              className={inputCls}
            />
          </Field>
        </div>
        <Field label="Mô tả">
          <textarea
            value={howItWorks.description}
            onChange={(e) => set({ description: e.target.value })}
            rows={2}
            className={inputCls}
          />
        </Field>
      </SectionCard>

      <button
        type="button"
        onClick={() => set({ steps: [{ title: '', description: '' }, ...howItWorks.steps] })}
        className="w-full rounded-2xl border-2 border-dashed border-slate-200 py-4 text-sm font-medium text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors"
      >
        + Thêm bước (lên đầu)
      </button>

      <div className="space-y-3">
        {howItWorks.steps.map((step, i) => (
          <ListItemCard
            key={i}
            index={i}
            onRemove={() => set({ steps: howItWorks.steps.filter((_, j) => j !== i) })}
          >
            <Field label="Tiêu đề bước">
              <input
                value={step.title}
                onChange={(e) => {
                  const steps = howItWorks.steps.map((s, j) =>
                    j === i ? { ...s, title: e.target.value } : s
                  )
                  set({ steps })
                }}
                className={inputCls}
              />
            </Field>
            <Field label="Mô tả bước">
              <textarea
                value={step.description}
                onChange={(e) => {
                  const steps = howItWorks.steps.map((s, j) =>
                    j === i ? { ...s, description: e.target.value } : s
                  )
                  set({ steps })
                }}
                rows={2}
                className={inputCls}
              />
            </Field>
          </ListItemCard>
        ))}
      </div>
    </div>
  )
}

// ─── Tab: Why Vsoftware ───────────────────────────────────────────────────────

function WhyTab({
  config,
  onChange,
}: {
  config: HomepageConfig
  onChange: (c: HomepageConfig) => void
}) {
  const { why } = config
  function set(patch: Partial<HomepageWhyConfig>) {
    onChange({ ...config, why: { ...why, ...patch } })
  }

  return (
    <div className="space-y-4">
      <SectionVisibilityToggle hidden={why.hidden ?? false} onChange={(h) => set({ hidden: h })} sectionLabel="Why Vsoftware" />
      <SectionCard title="Tiêu đề section">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Label (nhãn nhỏ màu cam)">
            <input value={why.label} onChange={(e) => set({ label: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Heading">
            <input value={why.heading} onChange={(e) => set({ heading: e.target.value })} className={inputCls} />
          </Field>
        </div>
        <Field label="Mô tả">
          <textarea
            value={why.description}
            onChange={(e) => set({ description: e.target.value })}
            rows={2}
            className={inputCls}
          />
        </Field>
      </SectionCard>

      <SectionCard title="Lý do (items)">
        <button
          type="button"
          onClick={() => set({ items: [{ iconName: 'Star', title: '', description: '' }, ...why.items] })}
          className="mb-2 flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <span className="text-base leading-none">+</span> Thêm lý do (lên đầu)
        </button>
        <div className="space-y-3">
          {why.items.map((item, i) => (
            <ListItemCard
              key={i}
              index={i}
              onRemove={() => set({ items: why.items.filter((_, j) => j !== i) })}
            >
              <div className="grid grid-cols-4 gap-3">
                <Field label="Icon">
                  <IconPicker
                    value={item.iconName ?? ''}
                    onChange={(name) => {
                      const items = why.items.map((it, j) =>
                        j === i ? { ...it, iconName: name } : it
                      )
                      set({ items })
                    }}
                  />
                </Field>
                <div className="col-span-3">
                  <Field label="Tiêu đề">
                    <input
                      value={item.title}
                      onChange={(e) => {
                        const items = why.items.map((it, j) =>
                          j === i ? { ...it, title: e.target.value } : it
                        )
                        set({ items })
                      }}
                      className={inputCls}
                    />
                  </Field>
                </div>
              </div>
              <Field label="Mô tả">
                <textarea
                  value={item.description}
                  onChange={(e) => {
                    const items = why.items.map((it, j) =>
                      j === i ? { ...it, description: e.target.value } : it
                    )
                    set({ items })
                  }}
                  rows={2}
                  className={inputCls}
                />
              </Field>
            </ListItemCard>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Thống kê (stats)">
        <button
          type="button"
          onClick={() => set({ stats: [{ value: '', label: '' }, ...why.stats] })}
          className="mb-2 flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <span className="text-base leading-none">+</span> Thêm thống kê (lên đầu)
        </button>
        <div className="space-y-3">
          {why.stats.map((stat, i) => (
            <ListItemCard
              key={i}
              index={i}
              onRemove={() => set({ stats: why.stats.filter((_, j) => j !== i) })}
            >
              <div className="grid grid-cols-2 gap-3">
                <Field label="Giá trị (vd: 8+)">
                  <input
                    value={stat.value}
                    onChange={(e) => {
                      const stats = why.stats.map((s, j) =>
                        j === i ? { ...s, value: e.target.value } : s
                      )
                      set({ stats })
                    }}
                    className={inputCls}
                  />
                </Field>
                <Field label="Nhãn">
                  <input
                    value={stat.label}
                    onChange={(e) => {
                      const stats = why.stats.map((s, j) =>
                        j === i ? { ...s, label: e.target.value } : s
                      )
                      set({ stats })
                    }}
                    className={inputCls}
                  />
                </Field>
              </div>
            </ListItemCard>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Trích dẫn (quote)">
        <Field label="Nội dung quote">
          <textarea value={why.quote} onChange={(e) => set({ quote: e.target.value })} rows={3} className={inputCls} />
        </Field>
        <Field label="Tác giả">
          <input value={why.quoteAuthor} onChange={(e) => set({ quoteAuthor: e.target.value })} className={inputCls} />
        </Field>
      </SectionCard>
    </div>
  )
}

// ─── Tab: Pricing ─────────────────────────────────────────────────────────────

function PricingTab({
  config,
  onChange,
}: {
  config: HomepageConfig
  onChange: (c: HomepageConfig) => void
}) {
  const { pricing } = config
  function set(patch: Partial<HomepagePricingConfig>) {
    onChange({ ...config, pricing: { ...pricing, ...patch } })
  }

  function setPlan(idx: number, patch: Partial<HomepagePricingPlan>) {
    set({ plans: pricing.plans.map((p, i) => (i === idx ? { ...p, ...patch } : p)) })
  }

  return (
    <div className="space-y-4">
      <SectionVisibilityToggle hidden={pricing.hidden ?? false} onChange={(h) => set({ hidden: h })} sectionLabel="Pricing" />
      <SectionCard title="Tiêu đề section">
        <Field label="Heading">
          <input value={pricing.heading} onChange={(e) => set({ heading: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Mô tả">
          <textarea
            value={pricing.description}
            onChange={(e) => set({ description: e.target.value })}
            rows={2}
            className={inputCls}
          />
        </Field>
        <Field label="Chú thích (disclaimer)">
          <input
            value={pricing.disclaimer}
            onChange={(e) => set({ disclaimer: e.target.value })}
            className={inputCls}
          />
        </Field>
      </SectionCard>

      <button
        type="button"
        onClick={() =>
          set({
            plans: [
              {
                name: 'Gói mới',
                subtitle: '',
                price: '0',
                period: '/ dự án',
                features: [],
                ctaText: 'Liên hệ',
                ctaHref: '/lien-he',
              },
              ...pricing.plans,
            ],
          })
        }
        className="w-full rounded-2xl border-2 border-dashed border-slate-200 py-4 text-sm font-medium text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors"
      >
        + Thêm gói giá (lên đầu)
      </button>

      {pricing.plans.map((plan, i) => (
        <SectionCard key={i} title={`Gói ${plan.name || `#${i + 1}`}`}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tên gói">
              <input value={plan.name} onChange={(e) => setPlan(i, { name: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Phụ đề">
              <input
                value={plan.subtitle}
                onChange={(e) => setPlan(i, { subtitle: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Giá (triệu)">
              <input value={plan.price} onChange={(e) => setPlan(i, { price: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Thời gian / ghi chú giá">
              <input
                value={plan.period}
                onChange={(e) => setPlan(i, { period: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Badge (tuỳ chọn)">
              <input
                value={plan.badge ?? ''}
                onChange={(e) => setPlan(i, { badge: e.target.value || undefined })}
                className={inputCls}
                placeholder="PHỔ BIẾN NHẤT"
              />
            </Field>
            <Field label="Nổi bật">
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id={`featured-${i}`}
                  checked={plan.featured ?? false}
                  onChange={(e) => setPlan(i, { featured: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-400"
                />
                <label htmlFor={`featured-${i}`} className="text-sm text-slate-600">
                  Hiển thị nổi bật
                </label>
              </div>
            </Field>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2">Tính năng (features)</label>
            <button
              type="button"
              onClick={() => setPlan(i, { features: ['', ...plan.features] })}
              className="mb-2 flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <span className="text-base leading-none">+</span> Thêm tính năng (lên đầu)
            </button>
            <div className="space-y-2">
              {plan.features.map((feat, fi) => (
                <div key={fi} className="flex items-center gap-2">
                  <input
                    value={feat}
                    onChange={(e) => {
                      const features = plan.features.map((f, fj) => (fj === fi ? e.target.value : f))
                      setPlan(i, { features })
                    }}
                    className={`${inputCls} flex-1`}
                    placeholder="Tính năng..."
                  />
                  <button
                    type="button"
                    onClick={() => setPlan(i, { features: plan.features.filter((_, fj) => fj !== fi) })}
                    className="shrink-0 rounded-lg border border-red-100 p-2 text-red-400 hover:bg-red-50 transition-colors"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Nút CTA — Text">
              <input
                value={plan.ctaText}
                onChange={(e) => setPlan(i, { ctaText: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Nút CTA — URL">
              <input
                value={plan.ctaHref}
                onChange={(e) => setPlan(i, { ctaHref: e.target.value })}
                className={inputCls}
              />
            </Field>
          </div>
        </SectionCard>
      ))}

    </div>
  )
}

// ─── Tab: CTA ─────────────────────────────────────────────────────────────────

function CtaTab({
  config,
  onChange,
}: {
  config: HomepageConfig
  onChange: (c: HomepageConfig) => void
}) {
  const { cta } = config
  function set(patch: Partial<HomepageCtaConfig>) {
    onChange({ ...config, cta: { ...cta, ...patch } })
  }

  return (
    <div className="space-y-4">
      <SectionVisibilityToggle hidden={cta.hidden ?? false} onChange={(h) => set({ hidden: h })} sectionLabel="CTA" />
      <SectionCard title="Nội dung CTA">
        <Field label="Heading">
          <input value={cta.heading} onChange={(e) => set({ heading: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Mô tả">
          <textarea
            value={cta.description}
            onChange={(e) => set({ description: e.target.value })}
            rows={2}
            className={inputCls}
          />
        </Field>
        <Field label="Ghi chú (note)">
          <input value={cta.note} onChange={(e) => set({ note: e.target.value })} className={inputCls} />
        </Field>
      </SectionCard>

      <SectionCard title="Nút hành động">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Nút chính — Text">
            <input
              value={cta.ctaPrimaryText}
              onChange={(e) => set({ ctaPrimaryText: e.target.value })}
              className={inputCls}
            />
          </Field>
          <Field label="Nút chính — URL">
            <input
              value={cta.ctaPrimaryHref}
              onChange={(e) => set({ ctaPrimaryHref: e.target.value })}
              className={inputCls}
            />
          </Field>
          <Field label="Nút phụ — Text">
            <input
              value={cta.ctaSecondaryText}
              onChange={(e) => set({ ctaSecondaryText: e.target.value })}
              className={inputCls}
            />
          </Field>
          <Field label="Nút phụ — URL">
            <input
              value={cta.ctaSecondaryHref}
              onChange={(e) => set({ ctaSecondaryHref: e.target.value })}
              className={inputCls}
            />
          </Field>
        </div>
      </SectionCard>
    </div>
  )
}

// ─── Tab: Services section heading ────────────────────────────────────────────

function ServicesTab({
  config,
  onChange,
}: {
  config: HomepageConfig
  onChange: (c: HomepageConfig) => void
}) {
  const { services } = config
  function set(patch: Partial<HomepageServicesSectionConfig>) {
    onChange({ ...config, services: { ...services, ...patch } })
  }
  return (
    <div className="space-y-4">
      <SectionVisibilityToggle hidden={services.hidden ?? false} onChange={(h) => set({ hidden: h })} sectionLabel="Services Section" />
      <SectionCard title="Tiêu đề section Dịch vụ">
        <p className="text-xs text-slate-400 -mt-1">
          Các thẻ dịch vụ trên trang chủ tự động lấy 6 bài viết mới nhất trong danh mục Dịch vụ.
          Phần này chỉ chỉnh tiêu đề + mô tả của section.
        </p>
        <Field label="Label (nhãn nhỏ màu cam, vd: DỊCH VỤ)">
          <input value={services.label} onChange={(e) => set({ label: e.target.value })} className={inputCls} />
        </Field>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Heading (phần đầu)">
            <input value={services.heading} onChange={(e) => set({ heading: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Heading highlight (màu xanh)">
            <input value={services.headingEm} onChange={(e) => set({ headingEm: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Heading (phần cuối)">
            <input value={services.headingSuffix} onChange={(e) => set({ headingSuffix: e.target.value })} className={inputCls} />
          </Field>
        </div>
        <Field label="Mô tả">
          <textarea
            value={services.description}
            onChange={(e) => set({ description: e.target.value })}
            rows={3}
            className={inputCls}
          />
        </Field>
      </SectionCard>
    </div>
  )
}

// ─── Tab: AI Agent section heading ────────────────────────────────────────────

function AiAgentTab({
  config,
  onChange,
}: {
  config: HomepageConfig
  onChange: (c: HomepageConfig) => void
}) {
  const { aiAgent } = config
  function set(patch: Partial<HomepageAiAgentSectionConfig>) {
    onChange({ ...config, aiAgent: { ...aiAgent, ...patch } })
  }
  return (
    <div className="space-y-4">
      <SectionVisibilityToggle hidden={aiAgent.hidden ?? false} onChange={(h) => set({ hidden: h })} sectionLabel="AI Agent Section" />
      <SectionCard title="Tiêu đề section AI Agent">
        <p className="text-xs text-slate-400 -mt-1">
          Các thẻ AI Agent tự động lấy bài viết mới nhất trong danh mục AI Agent.
          Phần này chỉ chỉnh tiêu đề + mô tả của section.
        </p>
        <Field label="Label (nhãn nhỏ, vd: AI AGENT)">
          <input value={aiAgent.label} onChange={(e) => set({ label: e.target.value })} className={inputCls} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Heading (phần đầu)">
            <input value={aiAgent.heading} onChange={(e) => set({ heading: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Heading highlight (in nghiêng, màu xanh)">
            <input value={aiAgent.headingEm} onChange={(e) => set({ headingEm: e.target.value })} className={inputCls} />
          </Field>
        </div>
        <Field label="Mô tả">
          <textarea
            value={aiAgent.description}
            onChange={(e) => set({ description: e.target.value })}
            rows={3}
            className={inputCls}
          />
        </Field>
      </SectionCard>
    </div>
  )
}

// ─── Tab: Showcase tabs ───────────────────────────────────────────────────────

function ShowcaseTab({
  config,
  onChange,
}: {
  config: HomepageConfig
  onChange: (c: HomepageConfig) => void
}) {
  const { showcase } = config
  function set(patch: Partial<HomepageShowcaseConfig>) {
    onChange({ ...config, showcase: { ...showcase, ...patch } })
  }
  function updateTab(idx: number, patch: Partial<HomepageShowcaseTab>) {
    const tabs = showcase.tabs.map((t, j) => (j === idx ? { ...t, ...patch } : t))
    set({ tabs })
  }

  function move(idx: number, dir: -1 | 1) {
    const next = [...showcase.tabs]
    const target = idx + dir
    if (target < 0 || target >= next.length) return
    ;[next[idx], next[target]] = [next[target], next[idx]]
    set({ tabs: next })
  }

  return (
    <div className="space-y-4">
      <SectionVisibilityToggle hidden={showcase.hidden ?? false} onChange={(h) => set({ hidden: h })} sectionLabel="Showcase" />
      <SectionCard title="Tiêu đề section">
        <div className="grid grid-cols-3 gap-3">
          <Field label="Heading (phần đầu)">
            <input value={showcase.heading} onChange={(e) => set({ heading: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Heading highlight (màu xanh)">
            <input value={showcase.headingEm} onChange={(e) => set({ headingEm: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Heading (phần cuối)">
            <input value={showcase.headingSuffix} onChange={(e) => set({ headingSuffix: e.target.value })} className={inputCls} />
          </Field>
        </div>
        <Field label="Mô tả">
          <textarea
            value={showcase.description}
            onChange={(e) => set({ description: e.target.value })}
            rows={2}
            className={inputCls}
          />
        </Field>
      </SectionCard>

      <SectionCard title="Danh sách tab">
        <p className="text-xs text-slate-400 -mt-1">
          Mỗi tab gồm: nhãn, 1 ảnh screenshot, tiêu đề, mô tả, và 1 nút CTA (bỏ trống nếu không hiện).
        </p>
        <button
          type="button"
          onClick={() => set({ tabs: [{ label: 'Tab mới', ctaText: 'Liên hệ ngay', ctaHref: '/contact' }, ...showcase.tabs] })}
          className="w-full rounded-2xl border-2 border-dashed border-slate-200 py-4 text-sm font-medium text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors"
        >
          + Thêm tab (lên đầu)
        </button>
        <div className="space-y-3">
          {showcase.tabs.map((tab, i) => (
            <ListItemCard
              key={i}
              index={i}
              onRemove={() => set({ tabs: showcase.tabs.filter((_, j) => j !== i) })}
            >
              <Field label="Nhãn tab (vd: 📊 CRM & Sales)">
                <input
                  value={tab.label}
                  onChange={(e) => updateTab(i, { label: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="Ảnh screenshot">
                <MediaPicker
                  value={{ src: tab.imageSrc ?? '', alt: tab.imageAlt, caption: tab.imageCaption }}
                  onChange={(v) => updateTab(i, { imageSrc: v.src, imageAlt: v.alt, imageCaption: v.caption })}
                />
              </Field>
              <Field label="Tiêu đề (trong tab)">
                <input
                  value={tab.title ?? ''}
                  onChange={(e) => updateTab(i, { title: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="Mô tả">
                <textarea
                  value={tab.description ?? ''}
                  onChange={(e) => updateTab(i, { description: e.target.value })}
                  rows={2}
                  className={inputCls}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Nút — Text (vd: Liên hệ ngay)">
                  <input
                    value={tab.ctaText ?? ''}
                    onChange={(e) => updateTab(i, { ctaText: e.target.value })}
                    className={inputCls}
                    placeholder="Bỏ trống = ẩn nút"
                  />
                </Field>
                <Field label="Nút — URL">
                  <input
                    value={tab.ctaHref ?? ''}
                    onChange={(e) => updateTab(i, { ctaHref: e.target.value })}
                    className={inputCls}
                    placeholder="/contact"
                  />
                </Field>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  ↑ Lên
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === showcase.tabs.length - 1}
                  className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  ↓ Xuống
                </button>
              </div>
            </ListItemCard>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

// ─── Tab: Highlights carousel ─────────────────────────────────────────────────

function HighlightsTab({
  config,
  onChange,
}: {
  config: HomepageConfig
  onChange: (c: HomepageConfig) => void
}) {
  const { highlights } = config
  function set(patch: Partial<HomepageHighlightsConfig>) {
    onChange({ ...config, highlights: { ...highlights, ...patch } })
  }

  return (
    <div className="space-y-4">
      <SectionVisibilityToggle hidden={highlights.hidden ?? false} onChange={(h) => set({ hidden: h })} sectionLabel="Highlights" />
      <SectionCard title="Tiêu đề section">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Heading (màu xanh)">
            <input value={highlights.heading} onChange={(e) => set({ heading: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Heading suffix (màu cam)">
            <input value={highlights.headingEm} onChange={(e) => set({ headingEm: e.target.value })} className={inputCls} />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Ảnh slideshow">
        <p className="text-xs text-slate-400 -mt-1 leading-relaxed">
          Slideshow tự chạy 2 giây/lần (lặp vô hạn), chia 3 ảnh/trang. Có ≥ 4 ảnh là slide bắt đầu chạy.
          <br />
          <strong className="text-slate-600">Khuyến nghị ảnh:</strong> tỉ lệ <strong>16:9</strong> (vd 1200×675px),
          tối đa ~200KB sau nén. Nên dùng ảnh thật của doanh nghiệp / sản phẩm.
        </p>
        <button
          type="button"
          onClick={() => set({ images: [{ src: '', alt: '' }, ...highlights.images] })}
          className="w-full rounded-2xl border-2 border-dashed border-slate-200 py-4 text-sm font-medium text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors"
        >
          + Thêm ảnh (lên đầu)
        </button>
        <div className="space-y-3">
          {highlights.images.map((img, i) => (
            <ListItemCard
              key={i}
              index={i}
              onRemove={() => set({ images: highlights.images.filter((_, j) => j !== i) })}
            >
              <MediaPicker
                value={{ src: img.src, alt: img.alt }}
                onChange={(v) => {
                  const images = highlights.images.map((m, j) =>
                    j === i ? { src: v.src, alt: v.alt ?? '' } : m
                  )
                  set({ images })
                }}
              />
            </ListItemCard>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

// ─── Tab: Blog (Tin tức trên trang chủ) ──────────────────────────────────────

function BlogTab({
  config,
  onChange,
}: {
  config: HomepageConfig
  onChange: (c: HomepageConfig) => void
}) {
  const { blog } = config
  function set(patch: Partial<HomepageBlogConfig>) {
    onChange({ ...config, blog: { ...blog, ...patch } })
  }
  return (
    <div className="space-y-4">
      <SectionVisibilityToggle hidden={blog.hidden ?? false} onChange={(h) => set({ hidden: h })} sectionLabel="Blog / Tin tức" />
      <SectionCard title="Tiêu đề section">
        <p className="text-xs text-slate-400 -mt-1">
          Bài viết tự động lấy 5 bài mới nhất (1 nổi bật + 4 bài bên cạnh). Đăng bài mới trong mục Bài viết là tự lên trang chủ.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Heading (phần đầu)">
            <input value={blog.heading} onChange={(e) => set({ heading: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Heading highlight (in nghiêng, màu xanh)">
            <input value={blog.headingEm} onChange={(e) => set({ headingEm: e.target.value })} className={inputCls} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Nút CTA — Text">
            <input value={blog.ctaText} onChange={(e) => set({ ctaText: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Nút CTA — URL">
            <input value={blog.ctaHref} onChange={(e) => set({ ctaHref: e.target.value })} className={inputCls} />
          </Field>
        </div>
      </SectionCard>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

type Tab = 'hero' | 'painPoints' | 'services' | 'aiAgent' | 'howItWorks' | 'why' | 'showcase' | 'pricing' | 'highlights' | 'blog' | 'cta'

export default function HomepageEditorPage() {
  const [config, setConfig] = useState<HomepageConfig | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('hero')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    adminGetHomepageConfig()
      .then((res) => setConfig(res.data))
      .catch((err: Error) => {
        // Key chưa tồn tại trong DB → dùng config mặc định, cho phép lưu để tạo mới
        if (err.message?.includes('không tồn tại') || err.message?.includes('404') || err.message?.includes('Not Found')) {
          setConfig(DEFAULT_CONFIG)
        } else {
          setError('Không tải được cấu hình trang chủ')
        }
      })
  }, [])

  async function handleSave() {
    if (!config || saving) return
    setSaving(true)
    setSaved(false)
    setError('')
    try {
      await adminUpdateHomepageConfig(config)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Lưu thất bại, thử lại.')
    } finally {
      setSaving(false)
    }
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'hero', label: 'Hero' },
    { key: 'painPoints', label: 'Pain Points' },
    { key: 'services', label: 'Dịch vụ' },
    { key: 'aiAgent', label: 'AI Agent' },
    { key: 'howItWorks', label: 'Quy trình' },
    { key: 'why', label: 'Tại sao' },
    { key: 'showcase', label: 'Showcase' },
    { key: 'pricing', label: 'Bảng giá' },
    { key: 'highlights', label: 'Ảnh nổi bật' },
    { key: 'blog', label: 'Blog' },
    { key: 'cta', label: 'CTA' },
  ]

  return (
    <div className="space-y-6 max-w-4xl">
      <AdminPageHeader
        title="Trang chủ"
        description="Chỉnh sửa nội dung hiển thị trên trang chủ"
        showBack={false}
      >
        <button
          onClick={handleSave}
          disabled={saving || !config}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Đang lưu...' : saved ? '✓ Đã lưu' : 'Lưu thay đổi'}
        </button>
      </AdminPageHeader>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {!config && !error ? (
        <div className="flex items-center justify-center py-20 text-slate-400 text-sm">Đang tải...</div>
      ) : config ? (
        <>
          <div className="flex gap-1 rounded-xl bg-slate-100 p-1 w-fit flex-wrap">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === t.key
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {activeTab === 'hero' && <HeroTab config={config} onChange={setConfig} />}
          {activeTab === 'painPoints' && <PainPointsTab config={config} onChange={setConfig} />}
          {activeTab === 'services' && <ServicesTab config={config} onChange={setConfig} />}
          {activeTab === 'aiAgent' && <AiAgentTab config={config} onChange={setConfig} />}
          {activeTab === 'howItWorks' && <HowItWorksTab config={config} onChange={setConfig} />}
          {activeTab === 'why' && <WhyTab config={config} onChange={setConfig} />}
          {activeTab === 'showcase' && <ShowcaseTab config={config} onChange={setConfig} />}
          {activeTab === 'pricing' && <PricingTab config={config} onChange={setConfig} />}
          {activeTab === 'highlights' && <HighlightsTab config={config} onChange={setConfig} />}
          {activeTab === 'blog' && <BlogTab config={config} onChange={setConfig} />}
          {activeTab === 'cta' && <CtaTab config={config} onChange={setConfig} />}
        </>
      ) : null}
    </div>
  )
}

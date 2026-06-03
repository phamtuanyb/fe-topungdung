'use client'

import MediaPicker from '@/components/admin/MediaPicker'
import SectionVisibilityToggle from '@/components/admin/SectionVisibilityToggle'
import type {
  PpcDemo,
  PpcFaq,
  PpcFaqItem,
  PpcTestimonial,
  PpcTestimonials,
  PpcTrustStrip,
  ProductPageConfig,
} from '@/types'

const inputCls =
  'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400'

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="text-[14px] font-bold text-slate-800 mb-1">{title}</h3>
      {hint && <p className="text-[12px] text-slate-500 mb-3 leading-snug">{hint}</p>}
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function ItemCard({ index, onRemove, children }: { index: number; onRemove: () => void; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3 bg-slate-50/50 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-400">#{index + 1}</span>
        <button type="button" onClick={onRemove} className="rounded-md border border-red-100 px-2 py-0.5 text-[11px] text-red-500 hover:bg-red-50">Xóa</button>
      </div>
      {children}
    </div>
  )
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} className="w-full rounded-xl border-2 border-dashed border-slate-200 py-2.5 text-[12px] font-medium text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors">
      + {label}
    </button>
  )
}

interface Props {
  config: ProductPageConfig
  onChange: (cfg: ProductPageConfig) => void
}

export default function ProductDetailedContent({ config, onChange }: Props) {
  const demo = config.demo ?? {}
  const test = config.testimonials ?? { items: [] }
  const faq = config.faq ?? { items: [] }
  const trust = config.trustStrip ?? {}

  function setDemo(p: Partial<PpcDemo>) { onChange({ ...config, demo: { ...demo, ...p } }) }
  function setTest(p: Partial<PpcTestimonials>) { onChange({ ...config, testimonials: { ...test, ...p } }) }
  function setFaq(p: Partial<PpcFaq>) { onChange({ ...config, faq: { ...faq, ...p } }) }
  function setTrust(p: Partial<PpcTrustStrip>) { onChange({ ...config, trustStrip: { ...trust, ...p } }) }

  return (
    <div className="space-y-4">
      {/* TRUST STRIP */}
      <Section title="Trust strip (dòng tin tưởng dưới hero)" hint='Dòng chữ xanh hiển thị dưới banner hero. VD: "Đã có 134 shop online + spa tin dùng".'>
        <SectionVisibilityToggle hidden={trust.hidden ?? false} onChange={(h) => setTrust({ hidden: h })} sectionLabel="Trust strip" />
        <input value={trust.text ?? ''} onChange={(e) => setTrust({ text: e.target.value })} className={inputCls} placeholder='VD: Đã có 134 shop online + spa tin dùng' />
      </Section>

      {/* DEMO */}
      <Section title="Demo media (video hoặc ảnh)" hint="YouTube URL HOẶC ảnh demo. Để trống cả 2 = không hiện block.">
        <SectionVisibilityToggle hidden={demo.hidden ?? false} onChange={(h) => setDemo({ hidden: h })} sectionLabel="Demo" />
        <input value={demo.videoUrl ?? ''} onChange={(e) => setDemo({ videoUrl: e.target.value })} className={inputCls} placeholder="Video URL (YouTube) — VD: https://www.youtube.com/watch?v=..." />
        <p className="text-[11px] text-slate-400">Hoặc ảnh demo (dùng khi không có video):</p>
        <MediaPicker
          value={{ src: demo.imageSrc ?? '', alt: demo.imageAlt, caption: demo.caption }}
          onChange={(v) => setDemo({ imageSrc: v.src, imageAlt: v.alt, caption: v.caption })}
        />
      </Section>

      {/* COMMITMENTS NOTICE */}
      <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4 text-[13px] text-indigo-700">
        💡 <strong>Cam kết</strong> giờ dùng chung cho toàn website — sửa tại menu <strong>Giao diện → Cam kết</strong> trong sidebar admin.
      </div>

      {/* TESTIMONIALS */}
      <Section title="Testimonials (quote khách hàng — auto carousel)" hint="Nhập ít nhất 2-3 quote. Trên web sẽ tự chạy carousel ngang loop vô hạn.">
        <SectionVisibilityToggle hidden={test.hidden ?? false} onChange={(h) => setTest({ hidden: h })} sectionLabel="Testimonials" />
        <input value={test.heading ?? ''} onChange={(e) => setTest({ heading: e.target.value })} className={inputCls} placeholder="Heading" />
        <AddButton onClick={() => setTest({ items: [{ quote: '', name: '', role: '' } as PpcTestimonial, ...test.items] })} label="Thêm testimonial (lên đầu)" />
        {test.items.map((it, i) => (
          <ItemCard key={i} index={i} onRemove={() => setTest({ items: test.items.filter((_, j) => j !== i) })}>
            <textarea value={it.quote} onChange={(e) => setTest({ items: test.items.map((x, j) => j === i ? { ...x, quote: e.target.value } : x) })} rows={3} className={inputCls} placeholder="Quote nguyên văn của khách hàng" />
            <div className="grid grid-cols-2 gap-2">
              <input value={it.name} onChange={(e) => setTest({ items: test.items.map((x, j) => j === i ? { ...x, name: e.target.value } : x) })} className={inputCls} placeholder="Tên (VD: Anh Vũ Hoàng Nam)" />
              <input value={it.role ?? ''} onChange={(e) => setTest({ items: test.items.map((x, j) => j === i ? { ...x, role: e.target.value } : x) })} className={inputCls} placeholder="Chức vụ / công ty" />
            </div>
            <MediaPicker
              value={{ src: it.avatarSrc ?? '' }}
              onChange={(v) => setTest({ items: test.items.map((x, j) => j === i ? { ...x, avatarSrc: v.src } : x) })}
              minimal
            />
          </ItemCard>
        ))}
      </Section>

      {/* FAQ */}
      <Section title="FAQ (câu hỏi thường gặp)" hint="Liệt kê 5-7 Q&A. Trên web sẽ render dạng accordion.">
        <SectionVisibilityToggle hidden={faq.hidden ?? false} onChange={(h) => setFaq({ hidden: h })} sectionLabel="FAQ" />
        <input value={faq.heading ?? ''} onChange={(e) => setFaq({ heading: e.target.value })} className={inputCls} placeholder="Heading (VD: Câu hỏi thường gặp)" />
        <AddButton onClick={() => setFaq({ items: [{ q: '', a: '' } as PpcFaqItem, ...faq.items] })} label="Thêm Q&A (lên đầu)" />
        {faq.items.map((it, i) => (
          <ItemCard key={i} index={i} onRemove={() => setFaq({ items: faq.items.filter((_, j) => j !== i) })}>
            <input value={it.q} onChange={(e) => setFaq({ items: faq.items.map((x, j) => j === i ? { ...x, q: e.target.value } : x) })} className={inputCls} placeholder="Câu hỏi (Q)" />
            <textarea value={it.a} onChange={(e) => setFaq({ items: faq.items.map((x, j) => j === i ? { ...x, a: e.target.value } : x) })} rows={3} className={inputCls} placeholder="Câu trả lời (A)" />
          </ItemCard>
        ))}
      </Section>

      {/* FINAL CTA NOTICE */}
      <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4 text-[13px] text-indigo-700">
        💡 <strong>Final CTA</strong> (banner cuối trang) giờ dùng chung với trang chủ — sửa tại <strong>Giao diện → Trang chủ → tab CTA</strong>.
      </div>
    </div>
  )
}

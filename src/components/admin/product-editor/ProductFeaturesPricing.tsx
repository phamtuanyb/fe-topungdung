'use client'

import IconPicker from '@/components/admin/IconPicker'
import MediaPicker from '@/components/admin/MediaPicker'
import SectionVisibilityToggle from '@/components/admin/SectionVisibilityToggle'
import type {
  PpcFeatureItem,
  PpcFeatures,
  PpcIconItem,
  PpcPainPoints,
  PpcPricing,
  PpcPricingPlan,
  PpcSolutionItem,
  PpcSolutions,
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

export default function ProductFeaturesPricing({ config, onChange }: Props) {
  const pain = config.painPoints ?? { items: [] }
  const sol = config.solutions ?? { items: [] }
  const feat = config.features ?? { items: [] }
  const price = config.pricing ?? { plans: [] }

  function setPain(p: Partial<PpcPainPoints>) { onChange({ ...config, painPoints: { ...pain, ...p } }) }
  function setSol(p: Partial<PpcSolutions>) { onChange({ ...config, solutions: { ...sol, ...p } }) }
  function setFeat(p: Partial<PpcFeatures>) { onChange({ ...config, features: { ...feat, ...p } }) }
  function setPrice(p: Partial<PpcPricing>) { onChange({ ...config, pricing: { ...price, ...p } }) }

  return (
    <div className="space-y-4">
      {/* PAIN POINTS */}
      <Section title="Pain Points (vấn đề khách gặp)" hint="Liệt kê các vấn đề mà sản phẩm của bạn giải quyết. Nên 4-6 mục, mỗi cái 1 dòng tiêu đề + mô tả ngắn.">
        <SectionVisibilityToggle hidden={pain.hidden ?? false} onChange={(h) => setPain({ hidden: h })} sectionLabel="Pain Points" />
        <input value={pain.heading ?? ''} onChange={(e) => setPain({ heading: e.target.value })} className={inputCls} placeholder="Heading: VD &ldquo;Doanh nghiệp bạn có đang gặp những vấn đề này?&rdquo;" />
        <AddButton onClick={() => setPain({ items: [{ title: '', description: '', iconName: 'AlertCircle' } as PpcIconItem, ...pain.items] })} label="Thêm vấn đề (lên đầu)" />
        {pain.items.map((it, i) => (
          <ItemCard key={i} index={i} onRemove={() => setPain({ items: pain.items.filter((_, j) => j !== i) })}>
            <div className="grid grid-cols-4 gap-2">
              <IconPicker value={it.iconName ?? ''} onChange={(name) => setPain({ items: pain.items.map((x, j) => j === i ? { ...x, iconName: name } : x) })} />
              <input value={it.title} onChange={(e) => setPain({ items: pain.items.map((x, j) => j === i ? { ...x, title: e.target.value } : x) })} className={`${inputCls} col-span-3`} placeholder="Tiêu đề vấn đề" />
            </div>
            <textarea value={it.description ?? ''} onChange={(e) => setPain({ items: pain.items.map((x, j) => j === i ? { ...x, description: e.target.value } : x) })} rows={2} className={inputCls} placeholder="Mô tả ngắn" />
          </ItemCard>
        ))}
      </Section>

      {/* SOLUTIONS */}
      <Section title="Solutions summary (sản phẩm giải quyết)" hint="Tóm tắt cách sản phẩm giải quyết các pain points. Nên 6 dòng + 2 nút CTA.">
        <SectionVisibilityToggle hidden={sol.hidden ?? false} onChange={(h) => setSol({ hidden: h })} sectionLabel="Solutions" />
        <input value={sol.heading ?? ''} onChange={(e) => setSol({ heading: e.target.value })} className={inputCls} placeholder="Heading" />
        <AddButton onClick={() => setSol({ items: [{ text: '', iconName: 'CheckCircle2' } as PpcSolutionItem, ...sol.items] })} label="Thêm dòng (lên đầu)" />
        {sol.items.map((it, i) => (
          <ItemCard key={i} index={i} onRemove={() => setSol({ items: sol.items.filter((_, j) => j !== i) })}>
            <div className="grid grid-cols-4 gap-2">
              <IconPicker value={it.iconName ?? ''} onChange={(name) => setSol({ items: sol.items.map((x, j) => j === i ? { ...x, iconName: name } : x) })} />
              <input value={it.text} onChange={(e) => setSol({ items: sol.items.map((x, j) => j === i ? { ...x, text: e.target.value } : x) })} className={`${inputCls} col-span-3`} placeholder="Text giải pháp" />
            </div>
          </ItemCard>
        ))}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          <input value={sol.ctaPrimary?.text ?? ''} onChange={(e) => setSol({ ctaPrimary: { ...(sol.ctaPrimary ?? { href: '' }), text: e.target.value } })} className={inputCls} placeholder="Nút chính — Text (VD: Dùng thử miễn phí)" />
          <input value={sol.ctaPrimary?.href ?? ''} onChange={(e) => setSol({ ctaPrimary: { ...(sol.ctaPrimary ?? { text: '' }), href: e.target.value } })} className={inputCls} placeholder="Nút chính — URL (VD: /contact)" />
          <input value={sol.ctaSecondary?.text ?? ''} onChange={(e) => setSol({ ctaSecondary: { ...(sol.ctaSecondary ?? { href: '' }), text: e.target.value } })} className={inputCls} placeholder="Nút phụ — Text" />
          <input value={sol.ctaSecondary?.href ?? ''} onChange={(e) => setSol({ ctaSecondary: { ...(sol.ctaSecondary ?? { text: '' }), href: e.target.value } })} className={inputCls} placeholder="Nút phụ — URL" />
        </div>
      </Section>

      {/* FEATURES */}
      <Section title="Features chi tiết" hint='Mỗi feature: tiêu đề + bullets + 1 ảnh ngang (16:9, ~1200×675px). Trên web sẽ hiển thị zigzag — ảnh xen kẽ trái/phải. Nếu không có ảnh → chỉ text full width.'>
        <SectionVisibilityToggle hidden={feat.hidden ?? false} onChange={(h) => setFeat({ hidden: h })} sectionLabel="Features" />
        <input value={feat.heading ?? ''} onChange={(e) => setFeat({ heading: e.target.value })} className={inputCls} placeholder="Heading" />
        <AddButton onClick={() => setFeat({ items: [{ title: '', bullets: [''] } as PpcFeatureItem, ...feat.items] })} label="Thêm feature (lên đầu)" />
        {feat.items.map((it, i) => (
          <ItemCard key={i} index={i} onRemove={() => setFeat({ items: feat.items.filter((_, j) => j !== i) })}>
            <input value={it.title} onChange={(e) => setFeat({ items: feat.items.map((x, j) => j === i ? { ...x, title: e.target.value } : x) })} className={inputCls} placeholder="Tiêu đề feature" />
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Bullets</label>
              <button type="button" onClick={() => setFeat({ items: feat.items.map((x, j) => j === i ? { ...x, bullets: ['', ...x.bullets] } : x) })} className="text-[11px] text-indigo-600 hover:text-indigo-800 mb-1">+ Thêm bullet (lên đầu)</button>
              {it.bullets.map((b, bi) => (
                <div key={bi} className="flex gap-1 mb-1">
                  <input value={b} onChange={(e) => setFeat({ items: feat.items.map((x, j) => j === i ? { ...x, bullets: x.bullets.map((y, k) => k === bi ? e.target.value : y) } : x) })} className={`${inputCls} flex-1`} placeholder="Bullet content..." />
                  <button type="button" onClick={() => setFeat({ items: feat.items.map((x, j) => j === i ? { ...x, bullets: x.bullets.filter((_, k) => k !== bi) } : x) })} className="rounded-md border border-red-100 px-2 text-[11px] text-red-500 hover:bg-red-50">×</button>
                </div>
              ))}
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Ảnh minh hoạ (ngang 16:9 — VD: 1200×675px)</label>
              <MediaPicker
                value={{ src: it.imageSrc ?? '', alt: it.imageAlt }}
                onChange={(v) => setFeat({ items: feat.items.map((x, j) => j === i ? { ...x, imageSrc: v.src, imageAlt: v.alt } : x) })}
              />
            </div>
          </ItemCard>
        ))}
      </Section>

      {/* PRICING */}
      <Section title="Bảng giá" hint='Mỗi sản phẩm thường có 3 plans (Starter / Pro / Enterprise). Nhập "Giá gốc" + "Giá KM" để web tự tính % giảm giá.'>
        <SectionVisibilityToggle hidden={price.hidden ?? false} onChange={(h) => setPrice({ hidden: h })} sectionLabel="Bảng giá" />
        <input value={price.heading ?? ''} onChange={(e) => setPrice({ heading: e.target.value })} className={inputCls} placeholder="Heading" />
        <textarea value={price.description ?? ''} onChange={(e) => setPrice({ description: e.target.value })} rows={2} className={inputCls} placeholder="Mô tả ngắn dưới heading" />
        <AddButton onClick={() => setPrice({ plans: [{ name: 'Gói mới', price: '0', features: [], ctaText: 'Mua ngay', ctaHref: '/contact' } as PpcPricingPlan, ...price.plans] })} label="Thêm gói giá (lên đầu)" />
        {price.plans.map((plan, i) => {
          const setPlan = (p: Partial<PpcPricingPlan>) => setPrice({ plans: price.plans.map((pl, j) => j === i ? { ...pl, ...p } : pl) })
          return (
            <ItemCard key={i} index={i} onRemove={() => setPrice({ plans: price.plans.filter((_, j) => j !== i) })}>
              <div className="grid grid-cols-2 gap-2">
                <input value={plan.name} onChange={(e) => setPlan({ name: e.target.value })} className={inputCls} placeholder="Tên gói (VD: Starter)" />
                <input value={plan.subtitle ?? ''} onChange={(e) => setPlan({ subtitle: e.target.value })} className={inputCls} placeholder="Phụ đề (VD: Shop nhỏ <50 đơn/ngày)" />
                <input value={plan.originalPrice ?? ''} onChange={(e) => setPlan({ originalPrice: e.target.value })} className={inputCls} placeholder="Giá gốc (VD: 790.000đ)" />
                <input value={plan.price} onChange={(e) => setPlan({ price: e.target.value })} className={inputCls} placeholder="Giá KM (VD: 490.000đ)" />
                <input value={plan.period ?? ''} onChange={(e) => setPlan({ period: e.target.value })} className={inputCls} placeholder="Period (VD: / tháng)" />
                <input value={plan.badge ?? ''} onChange={(e) => setPlan({ badge: e.target.value || undefined })} className={inputCls} placeholder="Badge (VD: Phổ biến)" />
              </div>
              <label className="flex items-center gap-2 text-[12px] text-slate-600">
                <input type="checkbox" checked={plan.featured ?? false} onChange={(e) => setPlan({ featured: e.target.checked })} className="h-4 w-4" />
                Nổi bật (highlight gói này, dùng cho sticky bar)
              </label>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Tính năng</label>
                <button type="button" onClick={() => setPlan({ features: ['', ...plan.features] })} className="mb-1 text-[11px] text-indigo-600">+ Thêm (lên đầu)</button>
                {plan.features.map((f, fi) => (
                  <div key={fi} className="flex gap-1 mb-1">
                    <input value={f} onChange={(e) => setPlan({ features: plan.features.map((x, k) => k === fi ? e.target.value : x) })} className={`${inputCls} flex-1`} />
                    <button type="button" onClick={() => setPlan({ features: plan.features.filter((_, k) => k !== fi) })} className="rounded-md border border-red-100 px-2 text-[11px] text-red-500">×</button>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input value={plan.ctaText} onChange={(e) => setPlan({ ctaText: e.target.value })} className={inputCls} placeholder="Nút — Text" />
                <input value={plan.ctaHref} onChange={(e) => setPlan({ ctaHref: e.target.value })} className={inputCls} placeholder="Nút — URL" />
              </div>
            </ItemCard>
          )
        })}
      </Section>
    </div>
  )
}

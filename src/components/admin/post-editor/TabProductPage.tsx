'use client'

import { useState } from 'react'
import { useFormContext, useController } from 'react-hook-form'
import type { FormData } from './PostEditor'
import type {
  ProductPageConfig,
  PpcHero,
  PpcDemo,
  PpcPainPoints,
  PpcSolutions,
  PpcFeatures,
  PpcPricing,
  PpcPricingPlan,
  PpcCommitments,
  PpcTestimonials,
  PpcFaq,
  PpcFinalCta,
  PpcIconItem,
  PpcTestimonial,
  PpcFaqItem,
} from '@/types'
import MediaPicker from '@/components/admin/MediaPicker'
import IconPicker from '@/components/admin/IconPicker'

// ─── Shared ───────────────────────────────────────────────────────────────────

const inputCls =
  'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400'

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  )
}

function Collapse({
  title,
  badge,
  children,
  defaultOpen = false,
}: {
  title: string
  badge?: string | number
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          {title}
          {badge !== undefined && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold">
              {badge}
            </span>
          )}
        </span>
        <span className={`text-slate-400 text-xs transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {open && (
        <div className="border-t border-slate-100 p-4 space-y-3 bg-slate-50/40">
          {children}
        </div>
      )}
    </div>
  )
}

function ItemCard({ index, onRemove, children }: { index: number; onRemove: () => void; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3 bg-white space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400">#{index + 1}</span>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-md border border-red-100 px-2 py-0.5 text-xs text-red-500 hover:bg-red-50"
        >
          Xóa
        </button>
      </div>
      {children}
    </div>
  )
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl border-2 border-dashed border-slate-200 py-2.5 text-xs font-medium text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors"
    >
      + {label}
    </button>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const EMPTY_CFG: ProductPageConfig = {
  hero: {},
  demo: {},
  painPoints: { items: [] },
  solutions: { items: [] },
  features: { items: [] },
  pricing: { plans: [] },
  commitments: { items: [] },
  testimonials: { items: [] },
  faq: { items: [] },
  finalCta: {},
}

export default function TabProductPage() {
  const { control } = useFormContext<FormData>()
  const { field } = useController({ name: 'productPageConfig', control })
  const cfg: ProductPageConfig = (field.value as ProductPageConfig | null) ?? EMPTY_CFG

  function patch(p: Partial<ProductPageConfig>) {
    field.onChange({ ...cfg, ...p })
  }

  // === 1. Hero & Demo ===
  const hero = cfg.hero ?? {}
  const demo = cfg.demo ?? {}
  function setHero(p: Partial<PpcHero>) { patch({ hero: { ...hero, ...p } }) }
  function setDemo(p: Partial<PpcDemo>) { patch({ demo: { ...demo, ...p } }) }

  // === 2. Pain Points ===
  const pain = cfg.painPoints ?? { items: [] }
  function setPain(p: Partial<PpcPainPoints>) { patch({ painPoints: { ...pain, ...p } }) }

  // === 3. Solutions ===
  const sol = cfg.solutions ?? { items: [] }
  function setSol(p: Partial<PpcSolutions>) { patch({ solutions: { ...sol, ...p } }) }

  // === 4. Features ===
  const feat = cfg.features ?? { items: [] }
  function setFeat(p: Partial<PpcFeatures>) { patch({ features: { ...feat, ...p } }) }

  // === 5. Pricing ===
  const price = cfg.pricing ?? { plans: [] }
  function setPrice(p: Partial<PpcPricing>) { patch({ pricing: { ...price, ...p } }) }

  // === 6. Commitments ===
  const com = cfg.commitments ?? { items: [] }
  function setCom(p: Partial<PpcCommitments>) { patch({ commitments: { ...com, ...p } }) }

  // === 7. Testimonials ===
  const test = cfg.testimonials ?? { items: [] }
  function setTest(p: Partial<PpcTestimonials>) { patch({ testimonials: { ...test, ...p } }) }

  // === 8. FAQ ===
  const faq = cfg.faq ?? { items: [] }
  function setFaq(p: Partial<PpcFaq>) { patch({ faq: { ...faq, ...p } }) }

  // === 9. Final CTA ===
  const final = cfg.finalCta ?? {}
  function setFinal(p: Partial<PpcFinalCta>) { patch({ finalCta: { ...final, ...p } }) }

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500 -mb-1 leading-relaxed bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
        💡 Trang chi tiết sản phẩm AI Agent gồm 9 section. Bỏ trống section nào → trên web tự ẩn (không hiện rỗng).
        Hero lấy <strong>Logo + Tên</strong> từ panel &ldquo;Sản phẩm AI Agent&rdquo; + <strong>Tóm tắt</strong> + ảnh hero ở dưới.
      </p>

      {/* ── 1. Hero & Demo ── */}
      <Collapse title="1. Hero & Demo media" defaultOpen>
        <Field label="Tagline (mô tả phụ dưới tên sản phẩm)">
          <input value={hero.tagline ?? ''} onChange={(e) => setHero({ tagline: e.target.value })} className={inputCls} placeholder="VD: Trợ lý ảo bán hàng Việt — không bao giờ ngủ" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Stat lớn (vd: <30s)">
            <input value={hero.statBig ?? ''} onChange={(e) => setHero({ statBig: e.target.value })} className={inputCls} placeholder="<30s" />
          </Field>
          <Field label="Stat phụ (mô tả)">
            <input value={hero.statSub ?? ''} onChange={(e) => setHero({ statSub: e.target.value })} className={inputCls} placeholder="response time trung bình" />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Nút chính — Text">
            <input value={hero.ctaPrimary?.text ?? ''} onChange={(e) => setHero({ ctaPrimary: { ...(hero.ctaPrimary ?? { href: '' }), text: e.target.value } })} className={inputCls} placeholder="Dùng thử miễn phí" />
          </Field>
          <Field label="Nút chính — URL">
            <input value={hero.ctaPrimary?.href ?? ''} onChange={(e) => setHero({ ctaPrimary: { ...(hero.ctaPrimary ?? { text: '' }), href: e.target.value } })} className={inputCls} placeholder="/lien-he" />
          </Field>
          <Field label="Nút phụ — Text">
            <input value={hero.ctaSecondary?.text ?? ''} onChange={(e) => setHero({ ctaSecondary: { ...(hero.ctaSecondary ?? { href: '' }), text: e.target.value } })} className={inputCls} placeholder="Xem bảng giá" />
          </Field>
          <Field label="Nút phụ — URL">
            <input value={hero.ctaSecondary?.href ?? ''} onChange={(e) => setHero({ ctaSecondary: { ...(hero.ctaSecondary ?? { text: '' }), href: e.target.value } })} className={inputCls} placeholder="#pricing" />
          </Field>
        </div>
        <Field label="Ảnh Hero (bên phải)">
          <MediaPicker
            value={{ src: hero.heroImageSrc ?? '', alt: hero.heroImageAlt }}
            onChange={(v) => setHero({ heroImageSrc: v.src, heroImageAlt: v.alt })}
          />
        </Field>
        <hr className="border-slate-200" />
        <p className="text-xs font-semibold text-slate-600">Demo media (hiển thị block riêng dưới Hero)</p>
        <Field label="Video URL (YouTube embed link)" hint="VD: https://www.youtube.com/embed/xxx">
          <input value={demo.videoUrl ?? ''} onChange={(e) => setDemo({ videoUrl: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Hoặc ảnh demo (dùng khi không có video)">
          <MediaPicker
            value={{ src: demo.imageSrc ?? '', alt: demo.imageAlt, caption: demo.caption }}
            onChange={(v) => setDemo({ imageSrc: v.src, imageAlt: v.alt, caption: v.caption })}
          />
        </Field>
      </Collapse>

      {/* ── 2. Pain Points ── */}
      <Collapse title="2. Pain Points (vấn đề khách gặp)" badge={pain.items.length}>
        <Field label="Heading section">
          <input value={pain.heading ?? ''} onChange={(e) => setPain({ heading: e.target.value })} className={inputCls} placeholder="Doanh nghiệp bạn có đang gặp những vấn đề này?" />
        </Field>
        <AddButton onClick={() => setPain({ items: [{ title: '', description: '', iconName: 'AlertCircle' }, ...pain.items] })} label="Thêm pain point (lên đầu)" />
        <div className="space-y-2">
          {pain.items.map((item, i) => (
            <ItemCard key={i} index={i} onRemove={() => setPain({ items: pain.items.filter((_, j) => j !== i) })}>
              <div className="grid grid-cols-4 gap-2">
                <Field label="Icon">
                  <IconPicker value={item.iconName ?? ''} onChange={(name) => setPain({ items: pain.items.map((it, j) => j === i ? { ...it, iconName: name } : it) })} />
                </Field>
                <div className="col-span-3">
                  <Field label="Title">
                    <input value={item.title} onChange={(e) => setPain({ items: pain.items.map((it, j) => j === i ? { ...it, title: e.target.value } : it) })} className={inputCls} />
                  </Field>
                </div>
              </div>
              <Field label="Mô tả">
                <textarea value={item.description ?? ''} onChange={(e) => setPain({ items: pain.items.map((it, j) => j === i ? { ...it, description: e.target.value } : it) })} rows={2} className={inputCls} />
              </Field>
            </ItemCard>
          ))}
        </div>
      </Collapse>

      {/* ── 3. Solutions ── */}
      <Collapse title="3. Solution summary" badge={sol.items.length}>
        <Field label="Heading section">
          <input value={sol.heading ?? ''} onChange={(e) => setSol({ heading: e.target.value })} className={inputCls} placeholder="Giải pháp giải quyết tất cả" />
        </Field>
        <AddButton onClick={() => setSol({ items: [{ text: '', iconName: 'CheckCircle2' }, ...sol.items] })} label="Thêm dòng (lên đầu)" />
        <div className="space-y-2">
          {sol.items.map((item, i) => (
            <ItemCard key={i} index={i} onRemove={() => setSol({ items: sol.items.filter((_, j) => j !== i) })}>
              <div className="grid grid-cols-4 gap-2">
                <Field label="Icon">
                  <IconPicker value={item.iconName ?? ''} onChange={(name) => setSol({ items: sol.items.map((it, j) => j === i ? { ...it, iconName: name } : it) })} />
                </Field>
                <div className="col-span-3">
                  <Field label="Text">
                    <input value={item.text} onChange={(e) => setSol({ items: sol.items.map((it, j) => j === i ? { ...it, text: e.target.value } : it) })} className={inputCls} />
                  </Field>
                </div>
              </div>
            </ItemCard>
          ))}
        </div>
        <hr className="border-slate-200" />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Nút chính — Text">
            <input value={sol.ctaPrimary?.text ?? ''} onChange={(e) => setSol({ ctaPrimary: { ...(sol.ctaPrimary ?? { href: '' }), text: e.target.value } })} className={inputCls} placeholder="Dùng thử miễn phí" />
          </Field>
          <Field label="Nút chính — URL">
            <input value={sol.ctaPrimary?.href ?? ''} onChange={(e) => setSol({ ctaPrimary: { ...(sol.ctaPrimary ?? { text: '' }), href: e.target.value } })} className={inputCls} />
          </Field>
          <Field label="Nút phụ — Text">
            <input value={sol.ctaSecondary?.text ?? ''} onChange={(e) => setSol({ ctaSecondary: { ...(sol.ctaSecondary ?? { href: '' }), text: e.target.value } })} className={inputCls} />
          </Field>
          <Field label="Nút phụ — URL">
            <input value={sol.ctaSecondary?.href ?? ''} onChange={(e) => setSol({ ctaSecondary: { ...(sol.ctaSecondary ?? { text: '' }), href: e.target.value } })} className={inputCls} />
          </Field>
        </div>
      </Collapse>

      {/* ── 4. Features chi tiết ── */}
      <Collapse title="4. Features chi tiết" badge={feat.items.length}>
        <Field label="Heading section">
          <input value={feat.heading ?? ''} onChange={(e) => setFeat({ heading: e.target.value })} className={inputCls} placeholder="Cách hoạt động" />
        </Field>
        <AddButton onClick={() => setFeat({ items: [{ title: '', bullets: [''] }, ...feat.items] })} label="Thêm feature (lên đầu)" />
        <div className="space-y-2">
          {feat.items.map((item, i) => (
            <ItemCard key={i} index={i} onRemove={() => setFeat({ items: feat.items.filter((_, j) => j !== i) })}>
              <Field label="Tiêu đề feature">
                <input value={item.title} onChange={(e) => setFeat({ items: feat.items.map((it, j) => j === i ? { ...it, title: e.target.value } : it) })} className={inputCls} />
              </Field>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Bullets</label>
                <button
                  type="button"
                  onClick={() => setFeat({ items: feat.items.map((it, j) => j === i ? { ...it, bullets: ['', ...it.bullets] } : it) })}
                  className="mb-1 text-xs text-indigo-600 hover:text-indigo-800"
                >+ Thêm bullet (lên đầu)</button>
                <div className="space-y-1">
                  {item.bullets.map((b, bi) => (
                    <div key={bi} className="flex gap-1">
                      <input
                        value={b}
                        onChange={(e) => setFeat({ items: feat.items.map((it, j) => j === i ? { ...it, bullets: it.bullets.map((x, k) => k === bi ? e.target.value : x) } : it) })}
                        className={`${inputCls} flex-1`}
                        placeholder="Bullet content..."
                      />
                      <button
                        type="button"
                        onClick={() => setFeat({ items: feat.items.map((it, j) => j === i ? { ...it, bullets: it.bullets.filter((_, k) => k !== bi) } : it) })}
                        className="rounded-md border border-red-100 px-2 text-xs text-red-500 hover:bg-red-50"
                      >×</button>
                    </div>
                  ))}
                </div>
              </div>
            </ItemCard>
          ))}
        </div>
      </Collapse>

      {/* ── 5. Pricing ── */}
      <Collapse title="5. Bảng giá" badge={price.plans.length}>
        <Field label="Heading section">
          <input value={price.heading ?? ''} onChange={(e) => setPrice({ heading: e.target.value })} className={inputCls} placeholder="Bảng giá" />
        </Field>
        <Field label="Mô tả">
          <textarea value={price.description ?? ''} onChange={(e) => setPrice({ description: e.target.value })} rows={2} className={inputCls} />
        </Field>
        <AddButton
          onClick={() => setPrice({ plans: [{ name: 'Gói mới', price: '0', features: [], ctaText: 'Mua ngay', ctaHref: '/lien-he' } as PpcPricingPlan, ...price.plans] })}
          label="Thêm gói giá (lên đầu)"
        />
        <div className="space-y-2">
          {price.plans.map((plan, i) => {
            const setPlan = (p: Partial<PpcPricingPlan>) => setPrice({ plans: price.plans.map((pl, j) => j === i ? { ...pl, ...p } : pl) })
            return (
              <ItemCard key={i} index={i} onRemove={() => setPrice({ plans: price.plans.filter((_, j) => j !== i) })}>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Tên gói"><input value={plan.name} onChange={(e) => setPlan({ name: e.target.value })} className={inputCls} /></Field>
                  <Field label="Phụ đề"><input value={plan.subtitle ?? ''} onChange={(e) => setPlan({ subtitle: e.target.value })} className={inputCls} /></Field>
                  <Field label="Giá gốc (gạch ngang)"><input value={plan.originalPrice ?? ''} onChange={(e) => setPlan({ originalPrice: e.target.value })} className={inputCls} placeholder="790.000" /></Field>
                  <Field label="Giá khuyến mãi"><input value={plan.price} onChange={(e) => setPlan({ price: e.target.value })} className={inputCls} placeholder="490.000" /></Field>
                  <Field label="Period (vd: /tháng)"><input value={plan.period ?? ''} onChange={(e) => setPlan({ period: e.target.value })} className={inputCls} /></Field>
                  <Field label="Badge (vd: Phổ biến)"><input value={plan.badge ?? ''} onChange={(e) => setPlan({ badge: e.target.value || undefined })} className={inputCls} /></Field>
                </div>
                <label className="flex items-center gap-2 text-xs text-slate-600">
                  <input type="checkbox" checked={plan.featured ?? false} onChange={(e) => setPlan({ featured: e.target.checked })} className="h-4 w-4" />
                  Nổi bật (highlight gói này)
                </label>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Tính năng</label>
                  <button type="button" onClick={() => setPlan({ features: ['', ...plan.features] })} className="mb-1 text-xs text-indigo-600">+ Thêm (lên đầu)</button>
                  {plan.features.map((f, fi) => (
                    <div key={fi} className="flex gap-1 mb-1">
                      <input
                        value={f}
                        onChange={(e) => setPlan({ features: plan.features.map((x, k) => k === fi ? e.target.value : x) })}
                        className={`${inputCls} flex-1`}
                      />
                      <button type="button" onClick={() => setPlan({ features: plan.features.filter((_, k) => k !== fi) })} className="rounded-md border border-red-100 px-2 text-xs text-red-500">×</button>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Nút — Text"><input value={plan.ctaText} onChange={(e) => setPlan({ ctaText: e.target.value })} className={inputCls} /></Field>
                  <Field label="Nút — URL"><input value={plan.ctaHref} onChange={(e) => setPlan({ ctaHref: e.target.value })} className={inputCls} /></Field>
                </div>
              </ItemCard>
            )
          })}
        </div>
      </Collapse>

      {/* ── 6. Commitments ── */}
      <Collapse title="6. Cam kết" badge={com.items.length}>
        <Field label="Heading section">
          <input value={com.heading ?? ''} onChange={(e) => setCom({ heading: e.target.value })} className={inputCls} placeholder="Cam kết của chúng tôi" />
        </Field>
        <AddButton onClick={() => setCom({ items: [{ title: '', description: '', iconName: 'ShieldCheck' } as PpcIconItem, ...com.items] })} label="Thêm cam kết (lên đầu)" />
        <div className="space-y-2">
          {com.items.map((item, i) => (
            <ItemCard key={i} index={i} onRemove={() => setCom({ items: com.items.filter((_, j) => j !== i) })}>
              <div className="grid grid-cols-4 gap-2">
                <Field label="Icon">
                  <IconPicker value={item.iconName ?? ''} onChange={(name) => setCom({ items: com.items.map((it, j) => j === i ? { ...it, iconName: name } : it) })} />
                </Field>
                <div className="col-span-3">
                  <Field label="Title">
                    <input value={item.title} onChange={(e) => setCom({ items: com.items.map((it, j) => j === i ? { ...it, title: e.target.value } : it) })} className={inputCls} />
                  </Field>
                </div>
              </div>
              <Field label="Mô tả">
                <textarea value={item.description ?? ''} onChange={(e) => setCom({ items: com.items.map((it, j) => j === i ? { ...it, description: e.target.value } : it) })} rows={2} className={inputCls} />
              </Field>
            </ItemCard>
          ))}
        </div>
      </Collapse>

      {/* ── 7. Testimonials ── */}
      <Collapse title="7. Testimonials" badge={test.items.length}>
        <Field label="Heading section">
          <input value={test.heading ?? ''} onChange={(e) => setTest({ heading: e.target.value })} className={inputCls} placeholder="Khách hàng nói gì về sản phẩm" />
        </Field>
        <AddButton onClick={() => setTest({ items: [{ quote: '', name: '', role: '' } as PpcTestimonial, ...test.items] })} label="Thêm testimonial (lên đầu)" />
        <div className="space-y-2">
          {test.items.map((item, i) => (
            <ItemCard key={i} index={i} onRemove={() => setTest({ items: test.items.filter((_, j) => j !== i) })}>
              <Field label="Quote">
                <textarea value={item.quote} onChange={(e) => setTest({ items: test.items.map((it, j) => j === i ? { ...it, quote: e.target.value } : it) })} rows={3} className={inputCls} />
              </Field>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Tên người">
                  <input value={item.name} onChange={(e) => setTest({ items: test.items.map((it, j) => j === i ? { ...it, name: e.target.value } : it) })} className={inputCls} />
                </Field>
                <Field label="Chức vụ / công ty">
                  <input value={item.role ?? ''} onChange={(e) => setTest({ items: test.items.map((it, j) => j === i ? { ...it, role: e.target.value } : it) })} className={inputCls} />
                </Field>
              </div>
              <Field label="Avatar (tùy chọn)">
                <MediaPicker
                  value={{ src: item.avatarSrc ?? '' }}
                  onChange={(v) => setTest({ items: test.items.map((it, j) => j === i ? { ...it, avatarSrc: v.src } : it) })}
                  minimal
                />
              </Field>
            </ItemCard>
          ))}
        </div>
      </Collapse>

      {/* ── 8. FAQ ── */}
      <Collapse title="8. FAQ" badge={faq.items.length}>
        <Field label="Heading section">
          <input value={faq.heading ?? ''} onChange={(e) => setFaq({ heading: e.target.value })} className={inputCls} placeholder="Câu hỏi thường gặp" />
        </Field>
        <AddButton onClick={() => setFaq({ items: [{ q: '', a: '' } as PpcFaqItem, ...faq.items] })} label="Thêm câu hỏi (lên đầu)" />
        <div className="space-y-2">
          {faq.items.map((item, i) => (
            <ItemCard key={i} index={i} onRemove={() => setFaq({ items: faq.items.filter((_, j) => j !== i) })}>
              <Field label="Câu hỏi (Q)">
                <input value={item.q} onChange={(e) => setFaq({ items: faq.items.map((it, j) => j === i ? { ...it, q: e.target.value } : it) })} className={inputCls} />
              </Field>
              <Field label="Câu trả lời (A)">
                <textarea value={item.a} onChange={(e) => setFaq({ items: faq.items.map((it, j) => j === i ? { ...it, a: e.target.value } : it) })} rows={3} className={inputCls} />
              </Field>
            </ItemCard>
          ))}
        </div>
      </Collapse>

      {/* ── 9. Final CTA ── */}
      <Collapse title="9. Final CTA (banner cuối trang)">
        <Field label="Heading">
          <input value={final.heading ?? ''} onChange={(e) => setFinal({ heading: e.target.value })} className={inputCls} placeholder="Sẵn sàng dùng AI Agent cho doanh nghiệp của bạn?" />
        </Field>
        <Field label="Mô tả">
          <textarea value={final.description ?? ''} onChange={(e) => setFinal({ description: e.target.value })} rows={2} className={inputCls} />
        </Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Nút — Text">
            <input value={final.ctaText ?? ''} onChange={(e) => setFinal({ ctaText: e.target.value })} className={inputCls} placeholder="Dùng thử ngay" />
          </Field>
          <Field label="Nút — URL">
            <input value={final.ctaHref ?? ''} onChange={(e) => setFinal({ ctaHref: e.target.value })} className={inputCls} placeholder="/lien-he" />
          </Field>
        </div>
      </Collapse>
    </div>
  )
}

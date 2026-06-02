'use client'

import MediaPicker from '@/components/admin/MediaPicker'
import type { Post, ProductPageConfig } from '@/types'
import { slugify } from '@/lib/utils'

const inputCls =
  'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400'

function Field({ label, required, hint, children, helper }: { label: string; required?: boolean; hint?: string; helper?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-[12px] text-slate-500 mt-1 leading-snug">{hint}</p>}
      {helper}
    </div>
  )
}

function CharCounter({ value, idealMin, idealMax }: { value: string; idealMin: number; idealMax: number }) {
  const len = value?.length ?? 0
  const inRange = len >= idealMin && len <= idealMax
  const tooLong = len > idealMax * 1.3
  const status = len === 0 ? 'empty' : tooLong ? 'bad' : inRange ? 'ok' : 'warn'
  const color = status === 'ok' ? 'text-green-600' : status === 'warn' ? 'text-orange-500' : status === 'bad' ? 'text-red-500' : 'text-slate-400'
  const icon = status === 'ok' ? '●' : status === 'warn' ? '●' : status === 'bad' ? '●' : '○'
  const msg =
    status === 'empty' ? 'chưa nhập' :
    status === 'ok' ? `${len}/${idealMin}-${idealMax} ký tự — chuẩn SEO ✓` :
    status === 'bad' ? `${len}/${idealMin}-${idealMax} ký tự — quá dài` :
    `${len}/${idealMin}-${idealMax} ký tự — hơi ${len < idealMin ? 'ngắn' : 'dài'}`
  return <div className={`text-[11px] font-semibold mt-1 ${color}`}>{icon} {msg}</div>
}

interface Props {
  values: {
    title: string
    shortName?: string | null
    slug: string
    excerpt?: string
    logoUrl?: string | null
    thumbnail?: string | null
    productPageConfig?: ProductPageConfig | null
  }
  onChange: (patch: Partial<Props['values']>) => void
  isCreate: boolean
}

export default function ProductBasicInfo({ values, onChange, isCreate }: Props) {
  const cfg = values.productPageConfig ?? {}
  const hero = cfg.hero ?? {}

  function patchHero(p: Partial<typeof hero>) {
    onChange({ productPageConfig: { ...cfg, hero: { ...hero, ...p } } })
  }

  return (
    <div className="space-y-5">
      <p className="text-[12px] text-slate-500 -mb-1">Tên sản phẩm, tagline, mô tả, ảnh.</p>

      <Field
        label="Tên sản phẩm"
        required
        hint="Tên đầy đủ — VD &ldquo;AI Agent CSKH — Chatbot đa kênh tự động&rdquo;. Hiển thị làm tiêu đề trang chi tiết, breadcrumb."
      >
        <input
          value={values.title}
          onChange={(e) => {
            onChange({
              title: e.target.value,
              ...(isCreate ? { slug: slugify(e.target.value) } : {}),
            })
          }}
          className={inputCls}
          placeholder="VD: AI Agent CSKH — Chatbot đa kênh tự động"
        />
      </Field>

      <Field
        label="Tên ngắn (không bắt buộc)"
        hint="Tên viết tắt — VD &ldquo;CSKH&rdquo;, &ldquo;Sales&rdquo;. Dùng trong nav menu mega + sticky bar. Để trống → tự dùng Tên sản phẩm."
      >
        <input
          value={values.shortName ?? ''}
          onChange={(e) => onChange({ shortName: e.target.value })}
          className={inputCls}
          placeholder="VD: CSKH"
        />
      </Field>

      <Field
        label="Đường dẫn (slug)"
        required
        hint='Phần URL sau /ai-agent/ — VD "ai-agent-cskh". Tự sinh từ tên nếu để trống. Không dấu tiếng Việt.'
      >
        <input
          value={values.slug}
          onChange={(e) => onChange({ slug: e.target.value })}
          className={inputCls}
          placeholder="ai-agent-cskh"
        />
      </Field>

      <Field
        label="Tagline (1 dòng)"
        hint="Slogan ngắn hiển thị dưới tên sản phẩm trên trang chi tiết. VD: &ldquo;Trợ lý ảo bán hàng — không bao giờ ngủ&rdquo;."
        helper={<CharCounter value={hero.tagline ?? ''} idealMin={30} idealMax={90} />}
      >
        <input
          value={hero.tagline ?? ''}
          onChange={(e) => patchHero({ tagline: e.target.value })}
          className={inputCls}
          placeholder="VD: Trợ lý ảo bán hàng — không bao giờ ngủ"
        />
      </Field>

      <Field
        label="Mô tả ngắn"
        hint="Mô tả cho card sản phẩm trang chủ + làm SEO Description (nếu ô SEO Description trống)."
        helper={<CharCounter value={values.excerpt ?? ''} idealMin={100} idealMax={160} />}
      >
        <textarea
          value={values.excerpt ?? ''}
          onChange={(e) => onChange({ excerpt: e.target.value })}
          rows={3}
          className={inputCls}
          placeholder="VD: Học theo tài liệu doanh nghiệp, trả lời tức thì 24/7 trên Facebook, Zalo, Website..."
        />
      </Field>

      <Field
        label="Logo (icon nhỏ)"
        hint="Logo dùng trong nav menu + card trang chủ + sticky bar. Vuông 1:1, ~200×200px, PNG nền trong suốt là đẹp nhất."
      >
        <MediaPicker
          value={{ src: values.logoUrl ?? '' }}
          onChange={(v) => onChange({ logoUrl: v.src || null })}
          minimal
        />
      </Field>

      <Field
        label="Ảnh Mascot / Card (vuông)"
        hint="Ảnh hiển thị trong CARD sản phẩm ở trang chủ + trang /ai-agent. Vuông 1:1, ~800×800px (tối thiểu 480×480), chủ thể ở giữa."
      >
        <MediaPicker
          value={{ src: values.thumbnail ?? '' }}
          onChange={(v) => onChange({ thumbnail: v.src || null })}
        />
      </Field>

      <Field
        label="Ảnh Hero (banner full-bleed)"
        hint="Ảnh nền FULL khung đầu trang chi tiết, text + overlay trắng đè lên nửa trái. Kích thước 1920×560px (ngang ~3.4:1, tối thiểu 1600px rộng). Đặt chủ thể ở NỬA PHẢI để khỏi bị overlay che. WebP/JPG < 300KB."
      >
        <MediaPicker
          value={{
            src: hero.heroImageSrc ?? '',
            alt: hero.heroImageAlt,
          }}
          onChange={(v) => patchHero({ heroImageSrc: v.src, heroImageAlt: v.alt })}
        />
      </Field>
    </div>
  )
}

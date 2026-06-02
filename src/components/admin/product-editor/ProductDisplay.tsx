'use client'

import useSWR from 'swr'
import type { PostStatus, PpcStickyBottom, ProductPageConfig } from '@/types'
import type { MenuItem } from '@/types/menu'
import { getNavMenu } from '@/lib/api/public'

const inputCls =
  'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400'

const BADGE_SUGGESTIONS = ['Hot', 'Mới', 'Phổ biến', 'Bán chạy', 'Khuyến mãi', 'Sắp ra mắt']

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-[12px] text-slate-500 mt-1 leading-snug">{hint}</p>}
    </div>
  )
}

interface Props {
  values: {
    status: PostStatus
    displayOrder?: number | null
    badge?: string | null
    menuGroupId?: number | null
    productPageConfig?: ProductPageConfig | null
  }
  onChange: (patch: Partial<Props['values']>) => void
  /** Slug danh mục lớn của sản phẩm (vd 'ai-agent' hoặc 'services') — dùng để load nhóm cha trên menu */
  categorySlug?: string
}

const PARENT_URL_BY_CATEGORY: Record<string, string> = {
  'ai-agent': '/ai-agent',
  'services': '/dich-vu',
}

export default function ProductDisplay({ values, onChange, categorySlug = 'ai-agent' }: Props) {
  const cfg = values.productPageConfig ?? {}
  const sticky = cfg.stickyBottom ?? {}

  const { data: menuData } = useSWR('nav-menu', getNavMenu, { revalidateOnFocus: false })
  const parentUrl = PARENT_URL_BY_CATEGORY[categorySlug] ?? `/${categorySlug}`
  const parentMenu = menuData?.data?.items?.find((m: MenuItem) => m.url === parentUrl)
  const groupOptions = (parentMenu?.children ?? []) as MenuItem[]

  function patchSticky(p: Partial<PpcStickyBottom>) {
    onChange({ productPageConfig: { ...cfg, stickyBottom: { ...sticky, ...p } } })
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <Field label="Trạng thái" hint="Nháp = chỉ bạn thấy. Đã đăng = công khai trên web.">
        <div className="flex gap-2">
          {(['draft', 'published'] as PostStatus[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChange({ status: s })}
              className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                values.status === s
                  ? s === 'published' ? 'border-green-500 bg-green-50 text-green-700' : 'border-yellow-500 bg-yellow-50 text-yellow-700'
                  : 'border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              {s === 'published' ? '✓ Đã đăng' : '✎ Nháp'}
            </button>
          ))}
        </div>
      </Field>

      <Field
        label="Thuộc nhóm (cột trên mega menu)"
        hint={
          groupOptions.length === 0
            ? 'Chưa có nhóm nào trong menu cha. Vào Admin → Menu → thêm nhóm con trước.'
            : `Chọn cột hiển thị trên mega menu khi hover "${parentMenu?.label ?? ''}". Bỏ trống = không lên menu.`
        }
      >
        <select
          value={values.menuGroupId ?? ''}
          onChange={(e) => onChange({ menuGroupId: e.target.value ? parseInt(e.target.value, 10) : null })}
          className={inputCls}
          disabled={groupOptions.length === 0}
        >
          <option value="">— Chưa phân nhóm (không lên menu) —</option>
          {groupOptions.map((g) => (
            <option key={g.id} value={g.id}>{g.label}</option>
          ))}
        </select>
      </Field>

      <Field label="Thứ tự hiển thị" hint="Số càng nhỏ càng hiện trước trong cột mega menu (cùng nhóm).">
        <input
          type="number"
          value={values.displayOrder ?? 0}
          onChange={(e) => onChange({ displayOrder: parseInt(e.target.value, 10) || 0 })}
          className={`${inputCls} max-w-[120px]`}
        />
      </Field>

      <Field label="Badge nổi bật" hint="Có badge → sản phẩm lên section AI Agent trang chủ (max 4). Bỏ trống → chỉ hiện trên nav menu + /ai-agent.">
        <input
          list="badge-suggestions"
          value={values.badge ?? ''}
          onChange={(e) => onChange({ badge: e.target.value || null })}
          placeholder="VD: Hot, Mới, Phổ biến..."
          className={inputCls}
        />
        <datalist id="badge-suggestions">
          {BADGE_SUGGESTIONS.map((b) => (
            <option key={b} value={b} />
          ))}
        </datalist>
        <div className="flex flex-wrap gap-1 mt-2">
          {BADGE_SUGGESTIONS.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => onChange({ badge: b })}
              className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                values.badge === b
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </Field>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="text-[14px] font-bold text-slate-800 mb-1">Sticky bottom bar</h3>
        <p className="text-[12px] text-slate-500 mb-3 leading-snug">
          Thanh bám đáy màn hình khi scroll trang chi tiết. Hiển thị tên + giá + nút Mua. Bật khi muốn promote mạnh.
        </p>
        <label className="flex items-center gap-2 text-[13px] text-slate-700 mb-3">
          <input
            type="checkbox"
            checked={sticky.enabled ?? false}
            onChange={(e) => patchSticky({ enabled: e.target.checked })}
            className="h-4 w-4"
          />
          Bật sticky bottom bar
        </label>
        {sticky.enabled && (
          <div className="space-y-2">
            <Field label="Giá hiển thị (tùy chọn)" hint="Để trống = tự lấy giá của gói nổi bật trong Pricing.">
              <input value={sticky.priceLabel ?? ''} onChange={(e) => patchSticky({ priceLabel: e.target.value })} className={inputCls} placeholder="VD: từ 490.000đ/tháng" />
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <input value={sticky.ctaPrimaryText ?? ''} onChange={(e) => patchSticky({ ctaPrimaryText: e.target.value })} className={inputCls} placeholder="Nút chính — Text (VD: Mua ngay)" />
              <input value={sticky.ctaPrimaryHref ?? ''} onChange={(e) => patchSticky({ ctaPrimaryHref: e.target.value })} className={inputCls} placeholder="Nút chính — URL" />
              <input value={sticky.ctaSecondaryText ?? ''} onChange={(e) => patchSticky({ ctaSecondaryText: e.target.value })} className={inputCls} placeholder="Nút phụ — Text (VD: Dùng thử)" />
              <input value={sticky.ctaSecondaryHref ?? ''} onChange={(e) => patchSticky({ ctaSecondaryHref: e.target.value })} className={inputCls} placeholder="Nút phụ — URL" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

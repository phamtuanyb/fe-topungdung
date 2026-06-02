'use client'

import { useFormContext, useController } from 'react-hook-form'
import { SidePanel } from './SharedPanels'
import MediaPicker from '@/components/admin/MediaPicker'
import { FormData } from './PostEditor'

const BADGE_SUGGESTIONS = ['Hot', 'Mới', 'Phổ biến', 'Bán chạy', 'Khuyến mãi', 'Sắp ra mắt']

export default function PanelAiAgent() {
  const { control } = useFormContext<FormData>()
  const { field: logoField } = useController({ name: 'logoUrl', control })
  const { field: badgeField } = useController({ name: 'badge', control })

  return (
    <SidePanel title="Sản phẩm AI Agent" defaultOpen={false}>
      <p className="text-[11px] text-slate-400 mb-2 leading-snug">
        Chỉ áp dụng nếu bài viết thuộc danh mục <strong>Phần mềm AI Agent</strong>.
        Logo + Badge sẽ xuất hiện trên nav menu và section AI Agent trang chủ.
        Có badge → bài viết được chọn lên trang chủ.
      </p>
      <div className="space-y-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1 uppercase tracking-wide">
            Logo sản phẩm
          </label>
          <MediaPicker
            value={{ src: logoField.value ?? '' }}
            onChange={(v) => logoField.onChange(v.src || null)}
            minimal
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1 uppercase tracking-wide">
            Badge (bỏ trống = không hiện trên trang chủ)
          </label>
          <input
            list="badge-suggestions"
            value={badgeField.value ?? ''}
            onChange={(e) => badgeField.onChange(e.target.value || null)}
            placeholder="Hot, Mới, Phổ biến..."
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <datalist id="badge-suggestions">
            {BADGE_SUGGESTIONS.map((b) => (
              <option key={b} value={b} />
            ))}
          </datalist>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {BADGE_SUGGESTIONS.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => badgeField.onChange(b)}
                className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                  badgeField.value === b
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>
    </SidePanel>
  )
}

'use client'

const inputCls =
  'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400'

function CharCounter({ value, idealMin, idealMax }: { value: string; idealMin: number; idealMax: number }) {
  const len = value?.length ?? 0
  const inRange = len >= idealMin && len <= idealMax
  const tooLong = len > idealMax * 1.3
  const status = len === 0 ? 'empty' : tooLong ? 'bad' : inRange ? 'ok' : 'warn'
  const color = status === 'ok' ? 'text-green-600' : status === 'warn' ? 'text-orange-500' : status === 'bad' ? 'text-red-500' : 'text-slate-400'
  const msg =
    status === 'empty' ? 'chưa nhập' :
    status === 'ok' ? `${len}/${idealMin}-${idealMax} ký tự — chuẩn SEO ✓` :
    status === 'bad' ? `${len}/${idealMin}-${idealMax} ký tự — quá dài` :
    `${len}/${idealMin}-${idealMax} ký tự — hơi ${len < idealMin ? 'ngắn' : 'dài'}`
  return <div className={`text-[11px] font-semibold mt-1 ${color}`}>● {msg}</div>
}

function Field({ label, hint, helper, children }: { label: string; hint?: string; helper?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-[12px] text-slate-500 mt-1 leading-snug">{hint}</p>}
      {helper}
    </div>
  )
}

interface Props {
  values: {
    slug: string
    seoTitle?: string | null
    seoDescription?: string | null
    seoKeywords?: string | null
    focusKeyword?: string | null
  }
  onChange: (patch: Partial<Props['values']>) => void
}

export default function ProductSeo({ values, onChange }: Props) {
  return (
    <div className="space-y-5 max-w-3xl">
      <p className="text-[12px] text-slate-500">Cấu hình SEO — hiển thị trên Google search + Facebook share.</p>

      <Field
        label="SEO Title"
        hint="Tiêu đề hiển thị trên Google search. Tự dùng Tên sản phẩm nếu trống."
        helper={<CharCounter value={values.seoTitle ?? ''} idealMin={50} idealMax={60} />}
      >
        <input value={values.seoTitle ?? ''} onChange={(e) => onChange({ seoTitle: e.target.value })} className={inputCls} placeholder="VD: AI Agent CSKH — Chatbot AI chăm sóc khách hàng 24/7 | Vsoftware" />
      </Field>

      <Field
        label="SEO Description"
        hint="Đoạn mô tả dưới tiêu đề trên Google. Nên 150-160 ký tự."
        helper={<CharCounter value={values.seoDescription ?? ''} idealMin={150} idealMax={160} />}
      >
        <textarea value={values.seoDescription ?? ''} onChange={(e) => onChange({ seoDescription: e.target.value })} rows={3} className={inputCls} placeholder="Mô tả ngắn về sản phẩm, có chứa từ khóa chính + USP." />
      </Field>

      <Field
        label="Keywords (từ khóa, phân cách bằng dấu phẩy)"
        hint='VD: "ai agent, chatbot, cskh, chăm sóc khách hàng tự động". Không phải Google ranking factor nữa nhưng vẫn nên có.'
      >
        <input value={values.seoKeywords ?? ''} onChange={(e) => onChange({ seoKeywords: e.target.value })} className={inputCls} />
      </Field>

      <Field
        label="Focus keyword (1 từ khóa chính)"
        hint='Từ khóa SEO chính — dùng để chấm điểm SEO. VD: "ai agent cskh".'
      >
        <input value={values.focusKeyword ?? ''} onChange={(e) => onChange({ focusKeyword: e.target.value })} className={inputCls} />
      </Field>

      <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
        <div className="text-[11px] font-semibold text-slate-500 uppercase mb-2">URL preview</div>
        <div className="text-[13px] text-slate-700 break-all">
          https://vsoftware.vn/ai-agent/<span className="text-vs-blue font-semibold">{values.slug || 'slug-cua-san-pham'}</span>
        </div>
      </div>
    </div>
  )
}

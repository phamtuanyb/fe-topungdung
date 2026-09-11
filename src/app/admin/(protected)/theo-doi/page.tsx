'use client'

import { useEffect, useState } from 'react'
import { adminGetTrackingConfig, adminRevalidate, adminUpdateTrackingConfig } from '@/lib/api/admin'
import type { TudTrackingConfig } from '@/types/tud'
import AdminPageHeader from '@/components/admin/AdminPageHeader'

/**
 * Mã theo dõi và xác minh của Google.
 *
 * Ba ô, dán mã vào là chạy — không cần build lại như khi để trong biến môi
 * trường. Biểu thức kiểm ở đây chỉ để báo sớm cho người nhập; phía hiển thị
 * (TrackingScripts) kiểm lại lần nữa trước khi chèn vào thẻ script.
 */
const O = [
  {
    key: 'gaId' as const,
    ten: 'Google Analytics 4 — Mã đo lường',
    mau: /^G-[A-Z0-9]{4,20}$/,
    dang: 'G-XXXXXXXXXX',
    huongDan:
      'Analytics → Quản trị → Luồng dữ liệu → chọn luồng web → "Mã đo lường". Bắt đầu bằng G-, không phải UA- hay GT-.',
  },
  {
    key: 'gtmId' as const,
    ten: 'Google Tag Manager — Mã vùng chứa',
    mau: /^GTM-[A-Z0-9]{4,12}$/,
    dang: 'GTM-XXXXXXX',
    huongDan:
      'Chỉ cần khi anh quản lý thẻ qua Tag Manager. Nếu đã dán GA4 ở trên thì đừng thêm GA4 lần nữa trong GTM, kẻo đếm gấp đôi.',
  },
  {
    key: 'googleSiteVerification' as const,
    ten: 'Search Console — Mã xác minh',
    mau: /^[A-Za-z0-9_-]{10,120}$/,
    dang: 'chuỗi 40–50 ký tự',
    huongDan:
      'Search Console → Thêm tài sản → Tiền tố URL → phương thức "Thẻ HTML". Chỉ dán phần trong content="...", không dán cả thẻ meta.',
  },
]

const input =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'

export default function TheoDoiPage() {
  const [cfg, setCfg] = useState<TudTrackingConfig>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    adminGetTrackingConfig()
      .then((r) => setCfg(r.data ?? {}))
      .catch(() => setCfg({}))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(t)
  }, [toast])

  /** Ô nào có chữ mà sai dạng thì báo; ô trống là hợp lệ (tắt tính năng đó). */
  function loiCua(key: (typeof O)[number]['key']): string {
    const v = (cfg[key] ?? '').trim()
    if (!v) return ''
    const o = O.find((x) => x.key === key)!
    return o.mau.test(v) ? '' : `Không đúng dạng ${o.dang}`
  }
  const coLoi = O.some((o) => loiCua(o.key))

  async function save() {
    if (coLoi) return
    setSaving(true)
    try {
      const sach: TudTrackingConfig = {
        gaId: (cfg.gaId ?? '').trim(),
        gtmId: (cfg.gtmId ?? '').trim(),
        googleSiteVerification: (cfg.googleSiteVerification ?? '').trim(),
      }
      await adminUpdateTrackingConfig(sach)
      setCfg(sach)
      // Mã nằm trong layout nên mọi trang đều bị ảnh hưởng. Xoá cache các
      // trang đầu mối; trang chi tiết tự làm mới theo vòng 60 giây.
      const ok = await adminRevalidate(['/', '/ungdung', '/ranking', '/topapp', '/prompt', '/tin-tuc', '/lien-he'])
      setToast({
        message: ok
          ? 'Đã lưu. Mở trang chủ, xem nguồn trang và tìm chữ "gtag" hoặc "google-site-verification" để kiểm.'
          : 'Đã lưu. Trang sẽ nhận mã mới trong vòng 1 phút.',
        type: 'success',
      })
    } catch (e) {
      setToast({ message: (e as Error).message || 'Lưu thất bại', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Theo dõi & đo lường"
        description="Mã Google Analytics, Tag Manager và xác minh Search Console. Dán mã vào là chạy, không cần build lại."
      />

      {toast && (
        <div
          className={`mb-4 rounded-lg px-4 py-3 text-sm ${
            toast.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {toast.message}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Đang tải…</p>
      ) : (
        <div className="max-w-2xl space-y-6">
          {O.map((o) => {
            const loi = loiCua(o.key)
            return (
              <div key={o.key} className="rounded-xl border border-slate-200 bg-white p-5">
                <label className="block text-sm font-semibold text-slate-800">{o.ten}</label>
                <p className="mt-1 text-xs text-slate-500">{o.huongDan}</p>
                <input
                  className={`${input} mt-3 ${loi ? 'border-red-400' : ''}`}
                  value={cfg[o.key] ?? ''}
                  placeholder={o.dang}
                  spellCheck={false}
                  autoComplete="off"
                  onChange={(e) => setCfg((c) => ({ ...c, [o.key]: e.target.value }))}
                />
                {loi && <p className="mt-1 text-xs text-red-600">{loi}</p>}
              </div>
            )
          })}

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
            <b>Ba điều nên biết.</b> Mã chỉ được nhúng ở các trang công khai, trang quản trị này không
            bị đếm. Trang đang có Content-Security-Policy chỉ cho phép tải script từ Google — thẻ bên thứ ba
            khác thêm qua Tag Manager (Facebook Pixel, TikTok…) sẽ bị chặn cho tới khi khai thêm tên miền
            trong <code>next.config.mjs</code>. Và xác minh Search Console chỉ cần làm một lần; sau khi Google
            báo đã xác minh, giữ mã ở đây để không mất quyền.
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={save}
              disabled={saving || coLoi}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Đang lưu…' : 'Lưu'}
            </button>
            {coLoi && <span className="text-xs text-red-600">Sửa ô báo đỏ trước khi lưu.</span>}
          </div>
        </div>
      )}
    </div>
  )
}

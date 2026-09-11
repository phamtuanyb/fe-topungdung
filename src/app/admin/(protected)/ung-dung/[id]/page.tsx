'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { adminGetPost, adminUpdatePost, adminRevalidate } from '@/lib/api/admin'
import type { Post } from '@/types'
import type { TudAppFaq, TudAppMeta, TudAppPlan, TudAppScoreItem, TudAppShot } from '@/types/tud'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminSectionCard from '@/components/admin/AdminSectionCard'
import MediaPicker from '@/components/admin/MediaPicker'
import Toast from '@/components/ui/Toast'

const input =
  'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400'

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
    </div>
  )
}

/** Danh sách chuỗi có thêm/xoá — dùng cho tags, pros, cons, platforms… */
function StringList({
  items,
  onChange,
  placeholder,
  addLabel,
}: {
  items: string[]
  onChange: (n: string[]) => void
  placeholder?: string
  addLabel: string
}) {
  return (
    <div className="space-y-2">
      {items.map((v, i) => (
        <div key={i} className="flex gap-2">
          <input
            className={input}
            placeholder={placeholder}
            value={v}
            onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))}
          />
          <button
            type="button"
            className="shrink-0 rounded-lg border border-rose-200 px-3 text-sm text-rose-600 hover:bg-rose-50"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
          >
            Xoá
          </button>
        </div>
      ))}
      <button
        type="button"
        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
        onClick={() => onChange([...items, ''])}
      >
        + {addLabel}
      </button>
    </div>
  )
}

export default function AppReviewEditorPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = Number(params.id)

  const [post, setPost] = useState<Post | null>(null)
  const [m, setM] = useState<TudAppMeta>({})
  // logoUrl là cột riêng của post, không nằm trong productPageConfig
  const [logoUrl, setLogoUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    if (!id) return
    adminGetPost(id)
      .then((res) => {
        setPost(res.data)
        setLogoUrl(res.data.logoUrl ?? '')
        const cfg = res.data.productPageConfig as unknown as { app?: TudAppMeta } | null
        setM(cfg?.app ?? {})
      })
      .catch((e: Error) => setError(e.message || 'Không tải được ứng dụng'))
  }, [id])

  function patch(p: Partial<TudAppMeta>) {
    setM((old) => ({ ...old, ...p }))
  }

  async function save() {
    if (!post) return
    setSaving(true)
    try {
      const existing = (post.productPageConfig as unknown as Record<string, unknown>) ?? {}
      await adminUpdatePost(post.id, {
        logoUrl: logoUrl || null,
        productPageConfig: { ...existing, app: m },
      } as never)
      await adminRevalidate([`/app/${post.slug}`, '/'])
      setToast({ message: 'Đã lưu. Mở /app/' + post.slug + ' để xem.', type: 'success' })
    } catch (e) {
      setToast({ message: (e as Error).message || 'Lưu thất bại', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  if (error) return <div className="p-6 text-sm text-rose-600">{error}</div>
  if (!post) return <div className="p-6 text-sm text-slate-500">Đang tải…</div>

  const shots = m.shots ?? []
  const bars = m.scoreBreakdown ?? []
  const plans = m.plans ?? []
  const faq = m.faq ?? []

  return (
    <div className="space-y-5">
      <AdminPageHeader
        backHref="/admin/ung-dung"
        title={`Review: ${post.title}`}
        description={`Nội dung bài viết (phần chữ dài) sửa ở /admin/posts. Trang này sửa các khối review của /app/${post.slug}.`}
      >
        <button
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? 'Đang lưu…' : 'Lưu thay đổi'}
        </button>
      </AdminPageHeader>

      {/* ── CƠ BẢN ────────────────────────────────────────────── */}
      <AdminSectionCard title="Thông tin cơ bản" description="Hiện ở trang chủ, trang danh mục và đầu bài review.">
        <div className="grid grid-cols-3 gap-4">
          <Field label="Điểm tổng" hint="0 – 10, quyết định thứ hạng">
            <input
              type="number"
              step="0.1"
              min={0}
              max={10}
              className={input}
              value={m.score ?? ''}
              onChange={(e) => patch({ score: e.target.value === '' ? undefined : Number(e.target.value) })}
            />
          </Field>
          <Field label="Loại" hint='"AI Assistant", "Video Editor"…'>
            <input className={input} value={m.kind ?? ''} onChange={(e) => patch({ kind: e.target.value })} />
          </Field>
          <Field
            label="Ảnh logo"
            hint="Hiện ở bảng xếp hạng, thẻ Top Picks và trang review. Bỏ trống thì dùng chữ viết tắt bên dưới."
          >
            <MediaPicker
              minimal
              value={{ src: logoUrl }}
              onChange={(v) => setLogoUrl(v.src)}
            />
            {logoUrl ? (
              <div className="mt-2 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="h-12 w-12 rounded-xl border border-slate-200 bg-white object-contain p-1"
                />
                <button
                  type="button"
                  onClick={() => setLogoUrl('')}
                  className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-50"
                >
                  Gỡ logo
                </button>
              </div>
            ) : null}
          </Field>
          <Field label="Chữ trong ô logo" hint="Dùng khi chưa có ảnh logo">
            <input className={input} value={m.logoText ?? ''} onChange={(e) => patch({ logoText: e.target.value })} />
          </Field>
          <Field label="Nền ô logo" hint="CSS gradient, để trống dùng màu xanh mặc định">
            <input className={input} value={m.logoBg ?? ''} onChange={(e) => patch({ logoBg: e.target.value })} />
          </Field>
          <Field
            label="Ảnh khung lớn (Top Picks)"
            hint="Khung lớn cạnh app nổi bật ở trang chủ. Bỏ trống thì tự lấy ảnh bài viết, rồi ảnh chụp đầu tiên."
          >
            <MediaPicker
              minimal
              value={{ src: m.artImage ?? '' }}
              onChange={(v) => patch({ artImage: v.src })}
            />
            {m.artImage ? (
              <div className="mt-2 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.artImage}
                  alt="Ảnh khung lớn"
                  className="h-20 w-32 rounded-xl border border-slate-200 bg-white object-cover"
                />
                <button
                  type="button"
                  onClick={() => patch({ artImage: '' })}
                  className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-50"
                >
                  Gỡ ảnh
                </button>
              </div>
            ) : null}
          </Field>
          <Field label="Biến động hạng" hint='"↑ 2", "→", "↓ 1"'>
            <input className={input} value={m.trend ?? ''} onChange={(e) => patch({ trend: e.target.value })} />
          </Field>
          <Field label="Tô cam cho biến động">
            <label className="flex items-center gap-2 text-sm text-slate-700 mt-2">
              <input
                type="checkbox"
                checked={!!m.trendUp}
                onChange={(e) => patch({ trendUp: e.target.checked })}
              />
              Đang tăng hạng
            </label>
          </Field>
        </div>

        <div className="mt-4 space-y-4">
          <Field label="Câu chốt ngắn" hint="Dòng đậm ngay dưới tên app">
            <input className={input} value={m.tagline ?? ''} onChange={(e) => patch({ tagline: e.target.value })} />
          </Field>
          <Field label="Nhãn tính năng" hint='Ví dụ "✓ Free", "✓ Windows"'>
            <StringList items={m.tags ?? []} onChange={(tags) => patch({ tags })} addLabel="Thêm nhãn" />
          </Field>
        </div>
      </AdminSectionCard>

      {/* ── THÔNG SỐ + CTA ────────────────────────────────────── */}
      <AdminSectionCard title="Thông số & nút hành động">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nhà phát triển">
            <input className={input} value={m.developer ?? ''} onChange={(e) => patch({ developer: e.target.value })} />
          </Field>
          <Field label="Ngôn ngữ hỗ trợ">
            <input className={input} value={m.languages ?? ''} onChange={(e) => patch({ languages: e.target.value })} />
          </Field>
          <Field label="Tóm tắt giá" hint='"Miễn phí · Pro từ 490k/tháng"'>
            <input
              className={input}
              value={m.pricingSummary ?? ''}
              onChange={(e) => patch({ pricingSummary: e.target.value })}
            />
          </Field>
          <Field label="Link trang chủ sản phẩm">
            <input className={input} value={m.website ?? ''} onChange={(e) => patch({ website: e.target.value })} />
          </Field>
          <Field label="Chữ trên nút chính" hint='Mặc định "Truy cập trang chủ"'>
            <input className={input} value={m.ctaText ?? ''} onChange={(e) => patch({ ctaText: e.target.value })} />
          </Field>
          <Field label="Nền tảng">
            <StringList
              items={m.platforms ?? []}
              onChange={(platforms) => patch({ platforms })}
              placeholder="Web / Windows / iOS…"
              addLabel="Thêm nền tảng"
            />
          </Field>
        </div>
      </AdminSectionCard>

      {/* ── ẢNH SẢN PHẨM ──────────────────────────────────────── */}
      <AdminSectionCard
        title="Ảnh sản phẩm"
        description="Ảnh đầu tiên hiển thị to gấp đôi. Upload từ máy hoặc dán URL."
      >
        <div className="space-y-4">
          {shots.map((s, i) => (
            <div key={i} className="rounded-xl border border-slate-200 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">
                  Ảnh {i + 1} {i === 0 && '(ảnh lớn)'}
                </span>
                <div className="flex gap-2">
                  {i > 0 && (
                    <button
                      type="button"
                      className="text-xs text-slate-500 hover:underline"
                      onClick={() => {
                        const n = [...shots]
                        ;[n[i - 1], n[i]] = [n[i], n[i - 1]]
                        patch({ shots: n })
                      }}
                    >
                      ↑ Lên
                    </button>
                  )}
                  <button
                    type="button"
                    className="text-xs text-rose-600 hover:underline"
                    onClick={() => patch({ shots: shots.filter((_, j) => j !== i) })}
                  >
                    Xoá
                  </button>
                </div>
              </div>
              <MediaPicker
                value={{ src: s.url, caption: s.caption }}
                onChange={(v) =>
                  patch({
                    shots: shots.map((x, j) =>
                      j === i ? { url: v.src, caption: v.caption } : x,
                    ) as TudAppShot[],
                  })
                }
              />
            </div>
          ))}
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            onClick={() => patch({ shots: [...shots, { url: '' }] })}
          >
            + Thêm ảnh
          </button>
        </div>
      </AdminSectionCard>

      {/* ── ĐIỂM THÀNH PHẦN ───────────────────────────────────── */}
      <AdminSectionCard title="Điểm từng tiêu chí" description="Vẽ thành thanh ngang trong bài.">
        <div className="space-y-2">
          {bars.map((b, i) => (
            <div key={i} className="flex gap-2">
              <input
                className={input}
                placeholder="Tiêu chí — ví dụ: Dễ dùng"
                value={b.label}
                onChange={(e) =>
                  patch({
                    scoreBreakdown: bars.map((x, j) =>
                      j === i ? { ...x, label: e.target.value } : x,
                    ) as TudAppScoreItem[],
                  })
                }
              />
              <input
                type="number"
                step="0.1"
                min={0}
                max={10}
                className={`${input} w-28 shrink-0`}
                value={b.value}
                onChange={(e) =>
                  patch({
                    scoreBreakdown: bars.map((x, j) =>
                      j === i ? { ...x, value: Number(e.target.value) } : x,
                    ) as TudAppScoreItem[],
                  })
                }
              />
              <button
                type="button"
                className="shrink-0 rounded-lg border border-rose-200 px-3 text-sm text-rose-600 hover:bg-rose-50"
                onClick={() => patch({ scoreBreakdown: bars.filter((_, j) => j !== i) })}
              >
                Xoá
              </button>
            </div>
          ))}
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            onClick={() => patch({ scoreBreakdown: [...bars, { label: '', value: 9 }] })}
          >
            + Thêm tiêu chí
          </button>
        </div>
      </AdminSectionCard>

      {/* ── ƯU / NHƯỢC ────────────────────────────────────────── */}
      <AdminSectionCard title="Điểm mạnh, điểm yếu & đối tượng phù hợp">
        <div className="grid grid-cols-2 gap-6">
          <Field label="Điểm mạnh">
            <StringList items={m.pros ?? []} onChange={(pros) => patch({ pros })} addLabel="Thêm điểm mạnh" />
          </Field>
          <Field label="Điểm yếu">
            <StringList items={m.cons ?? []} onChange={(cons) => patch({ cons })} addLabel="Thêm điểm yếu" />
          </Field>
        </div>
        <div className="mt-5">
          <Field label="Phù hợp nhất với" hint="Hiện dạng các viên bo tròn">
            <StringList items={m.bestFor ?? []} onChange={(bestFor) => patch({ bestFor })} addLabel="Thêm đối tượng" />
          </Field>
        </div>
      </AdminSectionCard>

      {/* ── BẢNG GIÁ ──────────────────────────────────────────── */}
      <AdminSectionCard title="Bảng giá">
        <div className="space-y-4">
          {plans.map((pl, i) => (
            <div key={i} className="rounded-xl border border-slate-200 p-4">
              <div className="grid grid-cols-4 gap-3">
                <Field label="Tên gói">
                  <input
                    className={input}
                    value={pl.name}
                    onChange={(e) =>
                      patch({ plans: plans.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)) as TudAppPlan[] })
                    }
                  />
                </Field>
                <Field label="Giá">
                  <input
                    className={input}
                    value={pl.price}
                    onChange={(e) =>
                      patch({ plans: plans.map((x, j) => (j === i ? { ...x, price: e.target.value } : x)) as TudAppPlan[] })
                    }
                  />
                </Field>
                <Field label="Đơn vị">
                  <input
                    className={input}
                    placeholder="/ tháng"
                    value={pl.period ?? ''}
                    onChange={(e) =>
                      patch({ plans: plans.map((x, j) => (j === i ? { ...x, period: e.target.value } : x)) as TudAppPlan[] })
                    }
                  />
                </Field>
                <Field label="Nổi bật">
                  <label className="flex items-center gap-2 text-sm text-slate-700 mt-2">
                    <input
                      type="checkbox"
                      checked={!!pl.featured}
                      onChange={(e) =>
                        patch({
                          plans: plans.map((x, j) => (j === i ? { ...x, featured: e.target.checked } : x)) as TudAppPlan[],
                        })
                      }
                    />
                    Tô nền xanh
                  </label>
                </Field>
              </div>
              <div className="mt-3">
                <Field label="Tính năng trong gói">
                  <StringList
                    items={pl.features}
                    onChange={(features) =>
                      patch({ plans: plans.map((x, j) => (j === i ? { ...x, features } : x)) as TudAppPlan[] })
                    }
                    addLabel="Thêm dòng"
                  />
                </Field>
              </div>
              <button
                type="button"
                className="mt-3 text-xs text-rose-600 hover:underline"
                onClick={() => patch({ plans: plans.filter((_, j) => j !== i) })}
              >
                Xoá gói này
              </button>
            </div>
          ))}
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            onClick={() => patch({ plans: [...plans, { name: '', price: '', features: [] }] })}
          >
            + Thêm gói
          </button>
        </div>
      </AdminSectionCard>

      {/* ── FAQ + KẾT LUẬN ────────────────────────────────────── */}
      <AdminSectionCard title="Hỏi đáp & kết luận" description="FAQ được gắn schema FAQPage cho Google.">
        <div className="space-y-3">
          {faq.map((f, i) => (
            <div key={i} className="rounded-xl border border-slate-200 p-4 space-y-2">
              <input
                className={input}
                placeholder="Câu hỏi"
                value={f.q}
                onChange={(e) => patch({ faq: faq.map((x, j) => (j === i ? { ...x, q: e.target.value } : x)) as TudAppFaq[] })}
              />
              <textarea
                rows={3}
                className={input}
                placeholder="Trả lời"
                value={f.a}
                onChange={(e) => patch({ faq: faq.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)) as TudAppFaq[] })}
              />
              <button
                type="button"
                className="text-xs text-rose-600 hover:underline"
                onClick={() => patch({ faq: faq.filter((_, j) => j !== i) })}
              >
                Xoá câu hỏi
              </button>
            </div>
          ))}
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            onClick={() => patch({ faq: [...faq, { q: '', a: '' }] })}
          >
            + Thêm câu hỏi
          </button>
        </div>

        <div className="mt-5">
          <Field label="Kết luận" hint="Khối xanh đậm cuối bài">
            <textarea
              rows={4}
              className={input}
              value={m.verdict ?? ''}
              onChange={(e) => patch({ verdict: e.target.value })}
            />
          </Field>
        </div>
      </AdminSectionCard>

      <div className="flex gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? 'Đang lưu…' : 'Lưu thay đổi'}
        </button>
        <a
          href={`/app/${post.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          Xem trang /app/{post.slug} ↗
        </a>
        <button
          onClick={() => router.push('/admin/ung-dung')}
          className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          Quay lại danh sách
        </button>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

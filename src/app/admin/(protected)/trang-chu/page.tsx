'use client'

import { useEffect, useState } from 'react'
import { adminGetTudHomeConfig, adminUpdateTudHomeConfig } from '@/lib/api/admin'
import { getCategories, getTudApps } from '@/lib/api/public'
import { DEFAULT_TUD_HOME, mergeTudConfig } from '@/app/(home)/default-config'
import type { Category, Post } from '@/types'
import type { TudHomeConfig, TudLink } from '@/types/tud'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminSectionCard from '@/components/admin/AdminSectionCard'
import SectionVisibilityToggle from '@/components/admin/SectionVisibilityToggle'
import Toast from '@/components/ui/Toast'
import { collectCategoryIds } from '@/lib/category-tree'

const input =
  'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400'

/**
 * Đổi chỗ một mục sang vị trí khác trong danh sách.
 * Vị trí ngoài khoảng hợp lệ thì trả nguyên danh sách cũ — tránh việc gõ dở số
 * trong ô thứ tự làm mất mục.
 */
function moveStep<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length || from === to) return list
  const next = [...list]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

const TABS = [
  { id: 'header', label: 'Header & Hero' },
  { id: 'discover', label: 'Khám phá' },
  { id: 'picks', label: 'Top Picks' },
  { id: 'stack', label: 'Creator Stack' },
  { id: 'battle', label: 'App Battle' },
  { id: 'ranking', label: 'Xếp hạng' },
  { id: 'edit', label: 'The Edit' },
  { id: 'ai', label: 'AI Finder' },
  { id: 'footer', label: 'Footer' },
] as const

type TabId = (typeof TABS)[number]['id']

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
    </div>
  )
}

/** Editor cho một mảng chuỗi đơn giản (chips, filters). */
function StringList({
  items,
  onChange,
  addLabel,
}: {
  items: string[]
  onChange: (next: string[]) => void
  addLabel: string
}) {
  return (
    <div className="space-y-2">
      {items.map((v, i) => (
        <div key={i} className="flex gap-2">
          <input
            className={input}
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

/** Editor cho mảng {label, href}. */
function LinkList({ items, onChange }: { items: TudLink[]; onChange: (next: TudLink[]) => void }) {
  return (
    <div className="space-y-2">
      {items.map((l, i) => (
        <div key={i} className="flex gap-2">
          <input
            className={input}
            placeholder="Nhãn"
            value={l.label}
            onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
          />
          <input
            className={input}
            placeholder="Đường dẫn"
            value={l.href}
            onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, href: e.target.value } : x)))}
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
        onClick={() => onChange([...items, { label: '', href: '#' }])}
      >
        + Thêm liên kết
      </button>
    </div>
  )
}

export default function TudHomeEditorPage() {
  const [config, setConfig] = useState<TudHomeConfig | null>(null)
  const [apps, setApps] = useState<Post[]>([])
  const [subCategories, setSubCategories] = useState<Category[]>([])
  const [tab, setTab] = useState<TabId>('header')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    adminGetTudHomeConfig()
      .then((res) => setConfig(mergeTudConfig(res.data)))
      .catch(() => setConfig(DEFAULT_TUD_HOME))
    getTudApps(200)
      .then((res) => setApps(res.data ?? []))
      .catch(() => setError('Không tải được danh sách ứng dụng (danh mục "ung-dung")'))
    // Danh mục con của "ung-dung" — dùng cho dropdown 6 thẻ Khám phá.
    getCategories()
      .then((res) => {
        const root = res.data.find((x) => x.slug === 'ung-dung')
        setSubCategories(res.data.filter((x) => x.id !== root?.id && collectCategoryIds(res.data, 'ung-dung').has(x.id)))
      })
      .catch(() => null)
  }, [])

  function patch<K extends keyof TudHomeConfig>(key: K, value: Partial<TudHomeConfig[K]>) {
    setConfig((c) => (c ? { ...c, [key]: { ...c[key], ...value } } : c))
  }

  async function save() {
    if (!config) return
    setSaving(true)
    try {
      await adminUpdateTudHomeConfig(config)
      // Xoá cache ISR để trang chủ đổi ngay, không phải chờ hết 60 giây.
      // Cấu hình này điều khiển nhiều trang, không riêng trang chủ.
      await fetch('/api/revalidate?path=/,/topapp,/ranking,/tin-tuc,/ungdung', {
        method: 'POST',
      }).catch(() => null)
      setToast({ message: 'Đã lưu. Mở lại trang chủ để xem thay đổi.', type: 'success' })
    } catch (e) {
      setToast({ message: (e as Error).message || 'Lưu thất bại', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  /** Dropdown chọn app từ danh mục "Ứng dụng". */
  function AppSelect({
    value,
    onChange,
    allowEmpty,
  }: {
    value: string
    onChange: (slug: string) => void
    allowEmpty?: boolean
  }) {
    return (
      <select className={input} value={value} onChange={(e) => onChange(e.target.value)}>
        {allowEmpty && <option value="">— Không chọn —</option>}
        {apps.map((a) => (
          <option key={a.id} value={a.slug}>
            {a.title}
          </option>
        ))}
      </select>
    )
  }

  if (error && !config) return <div className="p-6 text-sm text-rose-600">{error}</div>
  if (!config) return <div className="p-6 text-sm text-slate-500">Đang tải…</div>

  const c = config

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Trang chủ TopỨngDụng"
        description="Sửa toàn bộ chữ và cấu hình trang chủ. Danh sách ứng dụng lấy từ danh mục Ứng dụng, bài viết lấy từ danh mục tin."
      >
        <button
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? 'Đang lưu…' : 'Lưu thay đổi'}
        </button>
      </AdminPageHeader>

      {error && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              tab === t.id
                ? 'bg-indigo-600 text-white'
                : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── HEADER & HERO ─────────────────────────────────────── */}
      {tab === 'header' && (
        <>
          <AdminSectionCard title="Thanh điều hướng">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Field label="Chữ trong ô xanh">
                <input className={input} value={c.header.brandTop} onChange={(e) => patch('header', { brandTop: e.target.value })} />
              </Field>
              <Field label="Chữ còn lại">
                <input className={input} value={c.header.brandRest} onChange={(e) => patch('header', { brandRest: e.target.value })} />
              </Field>
              <Field label="Đuôi tên miền" hint='Chữ cam sau dấu chấm, ví dụ "net". Để trống thì chỉ hiện dấu chấm.'>
                <input className={input} value={c.header.brandSuffix ?? ''} onChange={(e) => patch('header', { brandSuffix: e.target.value })} />
              </Field>
              <Field label="Nút trái">
                <input className={input} value={c.header.searchText} onChange={(e) => patch('header', { searchText: e.target.value })} />
              </Field>
              <Field label="Nút phải">
                <input className={input} value={c.header.suggestText} onChange={(e) => patch('header', { suggestText: e.target.value })} />
              </Field>
            </div>
            <Field label="Menu">
              <LinkList items={c.header.links} onChange={(links) => patch('header', { links })} />
            </Field>
          </AdminSectionCard>

          <AdminSectionCard title="Hero">
            <div className="space-y-4">
              <Field label="Nhãn nhỏ phía trên">
                <input className={input} value={c.hero.eyebrow} onChange={(e) => patch('hero', { eyebrow: e.target.value })} />
              </Field>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Dòng 1">
                  <input className={input} value={c.hero.line1} onChange={(e) => patch('hero', { line1: e.target.value })} />
                </Field>
                <Field label="Dòng 2 (nền cam)">
                  <input className={input} value={c.hero.line2} onChange={(e) => patch('hero', { line2: e.target.value })} />
                </Field>
                <Field label="Dòng 3 (gradient)">
                  <input className={input} value={c.hero.line3} onChange={(e) => patch('hero', { line3: e.target.value })} />
                </Field>
              </div>
              <Field label="Mô tả">
                <textarea rows={3} className={input} value={c.hero.description} onChange={(e) => patch('hero', { description: e.target.value })} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Placeholder ô tìm kiếm">
                  <input className={input} value={c.hero.searchPlaceholder} onChange={(e) => patch('hero', { searchPlaceholder: e.target.value })} />
                </Field>
                <Field label="Chữ trên nút tìm">
                  <input className={input} value={c.hero.searchButton} onChange={(e) => patch('hero', { searchButton: e.target.value })} />
                </Field>
              </div>
              <Field label="Các chip gợi ý">
                <StringList items={c.hero.chips} onChange={(chips) => patch('hero', { chips })} addLabel="Thêm chip" />
              </Field>
            </div>
          </AdminSectionCard>

          <AdminSectionCard title="Thanh Trending" description="Danh sách tự lấy 5 ứng dụng điểm cao nhất.">
            <SectionVisibilityToggle
              hidden={!!c.trending.hidden}
              sectionLabel="Trending"
              onChange={(hidden) => patch('trending', { hidden })}
            />
            <Field label="Nhãn">
              <input className={input} value={c.trending.label} onChange={(e) => patch('trending', { label: e.target.value })} />
            </Field>
          </AdminSectionCard>
        </>
      )}

      {/* ── KHÁM PHÁ ──────────────────────────────────────────── */}
      {tab === 'discover' && (
        <AdminSectionCard title="Khám phá theo nhu cầu">
          <SectionVisibilityToggle
            hidden={!!c.discover.hidden}
            sectionLabel="Khám phá"
            onChange={(hidden) => patch('discover', { hidden })}
          />
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Nhãn nhỏ">
                <input className={input} value={c.discover.eyebrow} onChange={(e) => patch('discover', { eyebrow: e.target.value })} />
              </Field>
              <Field label="Tiêu đề">
                <input className={input} value={c.discover.heading} onChange={(e) => patch('discover', { heading: e.target.value })} />
              </Field>
            </div>
            <Field label="Mô tả">
              <textarea rows={2} className={input} value={c.discover.description} onChange={(e) => patch('discover', { description: e.target.value })} />
            </Field>

            <div className="space-y-3">
              {c.discover.cards.map((card, i) => (
                <div key={i} className="rounded-xl border border-slate-200 p-4">
                  <div className="grid grid-cols-4 gap-3">
                    <Field label="Số / nhóm">
                      <input className={input} value={card.num} onChange={(e) => patch('discover', { cards: c.discover.cards.map((x, j) => (j === i ? { ...x, num: e.target.value } : x)) })} />
                    </Field>
                    <Field label="Icon">
                      <input className={input} value={card.icon} onChange={(e) => patch('discover', { cards: c.discover.cards.map((x, j) => (j === i ? { ...x, icon: e.target.value } : x)) })} />
                    </Field>
                    <Field label="Tiêu đề">
                      <input className={input} value={card.title} onChange={(e) => patch('discover', { cards: c.discover.cards.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)) })} />
                    </Field>
                    <Field label="Danh mục" hint="Quyết định link /ungdung/… và số công cụ">
                      <select
                        className={input}
                        value={card.categorySlug ?? ''}
                        onChange={(e) => patch('discover', { cards: c.discover.cards.map((x, j) => (j === i ? { ...x, categorySlug: e.target.value } : x)) })}
                      >
                        <option value="">— Không gắn —</option>
                        {subCategories.map((s) => (
                          <option key={s.id} value={s.slug}>
                            {s.name} (/ungdung/{s.slug})
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <Field label="Ghi đè dòng đếm" hint="Để trống = tự đếm số ứng dụng">
                      <input className={input} value={card.countText ?? ''} onChange={(e) => patch('discover', { cards: c.discover.cards.map((x, j) => (j === i ? { ...x, countText: e.target.value } : x)) })} />
                    </Field>
                    <Field label="Ghi đè đường dẫn" hint="Để trống = /ungdung/<danh mục>">
                      <input className={input} value={card.href ?? ''} onChange={(e) => patch('discover', { cards: c.discover.cards.map((x, j) => (j === i ? { ...x, href: e.target.value } : x)) })} />
                    </Field>
                  </div>
                  <button
                    type="button"
                    className="mt-3 text-xs text-rose-600 hover:underline"
                    onClick={() => patch('discover', { cards: c.discover.cards.filter((_, j) => j !== i) })}
                  >
                    Xoá thẻ này
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                onClick={() => patch('discover', { cards: [...c.discover.cards, { num: '', icon: '✦', title: '', countText: '', href: '#' }] })}
              >
                + Thêm thẻ
              </button>
            </div>
          </div>
        </AdminSectionCard>
      )}

      {/* ── TOP PICKS ─────────────────────────────────────────── */}
      {tab === 'picks' && (
        <AdminSectionCard
          title="Top Picks"
          description="Chọn ứng dụng từ danh mục Ứng dụng. Tên, mô tả, logo, điểm lấy từ chính bài viết ứng dụng."
        >
          <SectionVisibilityToggle hidden={!!c.picks.hidden} sectionLabel="Top Picks" onChange={(hidden) => patch('picks', { hidden })} />
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Nhãn nhỏ">
                <input className={input} value={c.picks.eyebrow} onChange={(e) => patch('picks', { eyebrow: e.target.value })} />
              </Field>
              <Field label="Tiêu đề">
                <input className={input} value={c.picks.heading} onChange={(e) => patch('picks', { heading: e.target.value })} />
              </Field>
            </div>
            <Field label="Mô tả">
              <textarea rows={2} className={input} value={c.picks.description} onChange={(e) => patch('picks', { description: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Ứng dụng nổi bật (ô lớn)">
                <AppSelect value={c.picks.featuredSlug} onChange={(featuredSlug) => patch('picks', { featuredSlug })} />
              </Field>
              <Field label="Chữ trên nút">
                <input className={input} value={c.picks.featuredCta} onChange={(e) => patch('picks', { featuredCta: e.target.value })} />
              </Field>
            </div>
            <Field label="4 ứng dụng nhỏ bên phải">
              <div className="grid grid-cols-2 gap-3">
                {[0, 1, 2, 3].map((i) => (
                  <AppSelect
                    key={i}
                    allowEmpty
                    value={c.picks.miniSlugs[i] ?? ''}
                    onChange={(slug) => {
                      const next = [...c.picks.miniSlugs]
                      next[i] = slug
                      patch('picks', { miniSlugs: next.filter(Boolean) })
                    }}
                  />
                ))}
              </div>
            </Field>
          </div>
        </AdminSectionCard>
      )}

      {/* ── CREATOR STACK ─────────────────────────────────────── */}
      {tab === 'stack' && (
        <AdminSectionCard title="Creator Stack">
          <SectionVisibilityToggle hidden={!!c.stack.hidden} sectionLabel="Creator Stack" onChange={(hidden) => patch('stack', { hidden })} />
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Nhãn nhỏ">
                <input className={input} value={c.stack.eyebrow} onChange={(e) => patch('stack', { eyebrow: e.target.value })} />
              </Field>
              <Field label="Chữ trên nút">
                <input className={input} value={c.stack.ctaText} onChange={(e) => patch('stack', { ctaText: e.target.value })} />
              </Field>
              <Field label="Tiêu đề dòng 1">
                <input className={input} value={c.stack.heading1} onChange={(e) => patch('stack', { heading1: e.target.value })} />
              </Field>
              <Field label="Tiêu đề dòng 2">
                <input className={input} value={c.stack.heading2} onChange={(e) => patch('stack', { heading2: e.target.value })} />
              </Field>
            </div>
            <Field label="Mô tả">
              <textarea rows={2} className={input} value={c.stack.description} onChange={(e) => patch('stack', { description: e.target.value })} />
            </Field>
            <Field
              label="Các bước"
              hint="Thứ tự ở đây chính là thứ tự hiển thị trên trang chủ và trang /topapp. Dùng ▲ ▼ hoặc gõ thẳng số thứ tự để sắp lại."
            >
              <div className="space-y-3">
                {c.stack.steps.map((s, i) => (
                  <div key={i} className="grid grid-cols-[auto_1fr] gap-3 rounded-xl border border-slate-200 p-3">
                    {/* Cột sắp thứ tự */}
                    <div className="flex flex-col items-center gap-1">
                      <button
                        type="button"
                        title="Lên một bậc"
                        disabled={i === 0}
                        className="rounded-md border border-slate-200 px-2 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                        onClick={() => patch('stack', { steps: moveStep(c.stack.steps, i, i - 1) })}
                      >
                        ▲
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={c.stack.steps.length}
                        value={i + 1}
                        title="Số thứ tự"
                        className="w-12 rounded-md border border-slate-200 px-1 py-1 text-center text-xs font-semibold text-slate-700"
                        onChange={(e) => {
                          const to = Number(e.target.value) - 1
                          if (Number.isInteger(to)) {
                            patch('stack', { steps: moveStep(c.stack.steps, i, to) })
                          }
                        }}
                      />
                      <button
                        type="button"
                        title="Xuống một bậc"
                        disabled={i === c.stack.steps.length - 1}
                        className="rounded-md border border-slate-200 px-2 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                        onClick={() => patch('stack', { steps: moveStep(c.stack.steps, i, i + 1) })}
                      >
                        ▼
                      </button>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                    <AppSelect
                      allowEmpty
                      value={s.slug}
                      onChange={(slug) => patch('stack', { steps: c.stack.steps.map((x, j) => (j === i ? { ...x, slug } : x)) })}
                    />
                    <input
                      className={input}
                      placeholder="Ghi chú"
                      value={s.note}
                      onChange={(e) => patch('stack', { steps: c.stack.steps.map((x, j) => (j === i ? { ...x, note: e.target.value } : x)) })}
                    />
                    <input
                      className={input}
                      placeholder="Tên dự phòng"
                      value={s.fallbackName ?? ''}
                      onChange={(e) => patch('stack', { steps: c.stack.steps.map((x, j) => (j === i ? { ...x, fallbackName: e.target.value } : x)) })}
                    />
                    <div className="flex gap-2">
                      <input
                        className={input}
                        placeholder="Logo chữ"
                        value={s.fallbackLogo ?? ''}
                        onChange={(e) => patch('stack', { steps: c.stack.steps.map((x, j) => (j === i ? { ...x, fallbackLogo: e.target.value } : x)) })}
                      />
                      <button
                        type="button"
                        className="shrink-0 rounded-lg border border-rose-200 px-3 text-sm text-rose-600 hover:bg-rose-50"
                        onClick={() => patch('stack', { steps: c.stack.steps.filter((_, j) => j !== i) })}
                      >
                        Xoá
                      </button>
                    </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  onClick={() => patch('stack', { steps: [...c.stack.steps, { slug: '', note: '' }] })}
                >
                  + Thêm bước
                </button>
              </div>
            </Field>
          </div>
        </AdminSectionCard>
      )}

      {/* ── APP BATTLE ────────────────────────────────────────── */}
      {tab === 'battle' && (
        <AdminSectionCard title="App Battle">
          <SectionVisibilityToggle hidden={!!c.battle.hidden} sectionLabel="App Battle" onChange={(hidden) => patch('battle', { hidden })} />
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Nhãn nhỏ">
                <input className={input} value={c.battle.eyebrow} onChange={(e) => patch('battle', { eyebrow: e.target.value })} />
              </Field>
              <Field label="Tiêu đề">
                <input className={input} value={c.battle.heading} onChange={(e) => patch('battle', { heading: e.target.value })} />
              </Field>
            </div>
            <Field label="Mô tả">
              <textarea rows={2} className={input} value={c.battle.description} onChange={(e) => patch('battle', { description: e.target.value })} />
            </Field>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Ứng dụng bên trái">
                <AppSelect value={c.battle.leftSlug} onChange={(leftSlug) => patch('battle', { leftSlug })} />
              </Field>
              <Field label="Ứng dụng bên phải">
                <AppSelect value={c.battle.rightSlug} onChange={(rightSlug) => patch('battle', { rightSlug })} />
              </Field>
              <Field label="Tiền tố nút" hint='Ví dụ "Chọn" → "Chọn CapCut"'>
                <input className={input} value={c.battle.ctaPrefix} onChange={(e) => patch('battle', { ctaPrefix: e.target.value })} />
              </Field>
            </div>
          </div>
        </AdminSectionCard>
      )}

      {/* ── XẾP HẠNG ──────────────────────────────────────────── */}
      {tab === 'ranking' && (
        <AdminSectionCard
          title="Bảng xếp hạng"
          description="Bảng tự sắp theo điểm của từng ứng dụng. Muốn đổi thứ hạng thì sửa điểm trong bài viết ứng dụng."
        >
          <SectionVisibilityToggle hidden={!!c.ranking.hidden} sectionLabel="Bảng xếp hạng" onChange={(hidden) => patch('ranking', { hidden })} />
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Field label="Nhãn nhỏ">
                <input className={input} value={c.ranking.eyebrow} onChange={(e) => patch('ranking', { eyebrow: e.target.value })} />
              </Field>
              <Field label="Tiêu đề">
                <input className={input} value={c.ranking.heading} onChange={(e) => patch('ranking', { heading: e.target.value })} />
              </Field>
              <Field label="Số dòng hiển thị">
                <input
                  type="number"
                  min={1}
                  max={50}
                  className={input}
                  value={c.ranking.limit}
                  onChange={(e) => patch('ranking', { limit: Number(e.target.value) || 5 })}
                />
              </Field>
            </div>
            <Field label="Mô tả">
              <textarea rows={2} className={input} value={c.ranking.description} onChange={(e) => patch('ranking', { description: e.target.value })} />
            </Field>
            <Field label="Các nút lọc">
              <StringList items={c.ranking.filters} onChange={(filters) => patch('ranking', { filters })} addLabel="Thêm nút lọc" />
            </Field>
          </div>
        </AdminSectionCard>
      )}

      {/* ── THE EDIT ──────────────────────────────────────────── */}
      {tab === 'edit' && (
        <AdminSectionCard
          title="The Edit"
          description="Bài viết lấy từ danh mục bên dưới. Để trống ô slug thì tự lấy bài mới nhất."
        >
          <SectionVisibilityToggle hidden={!!c.edit.hidden} sectionLabel="The Edit" onChange={(hidden) => patch('edit', { hidden })} />
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Nhãn nhỏ">
                <input className={input} value={c.edit.eyebrow} onChange={(e) => patch('edit', { eyebrow: e.target.value })} />
              </Field>
              <Field label="Tiêu đề">
                <input className={input} value={c.edit.heading} onChange={(e) => patch('edit', { heading: e.target.value })} />
              </Field>
            </div>
            <Field label="Mô tả">
              <textarea rows={2} className={input} value={c.edit.description} onChange={(e) => patch('edit', { description: e.target.value })} />
            </Field>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Slug danh mục bài viết" hint="Ví dụ: tin-tuc">
                <input className={input} value={c.edit.categorySlug} onChange={(e) => patch('edit', { categorySlug: e.target.value })} />
              </Field>
              <Field label="Slug bài nổi bật" hint="Để trống = bài mới nhất">
                <input className={input} value={c.edit.featuredSlug} onChange={(e) => patch('edit', { featuredSlug: e.target.value })} />
              </Field>
              <Field label="Dòng meta bài nổi bật">
                <input className={input} value={c.edit.featuredMeta} onChange={(e) => patch('edit', { featuredMeta: e.target.value })} />
              </Field>
            </div>
            <Field label="Slug 3 bài nhỏ" hint="Để trống = tự lấy 3 bài tiếp theo">
              <StringList items={c.edit.listSlugs} onChange={(listSlugs) => patch('edit', { listSlugs })} addLabel="Thêm slug" />
            </Field>
          </div>
        </AdminSectionCard>
      )}

      {/* ── AI FINDER ─────────────────────────────────────────── */}
      {tab === 'ai' && (
        <AdminSectionCard title="Top AI Finder">
          <SectionVisibilityToggle hidden={!!c.aiFinder.hidden} sectionLabel="AI Finder" onChange={(hidden) => patch('aiFinder', { hidden })} />
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Nhãn nhỏ">
                <input className={input} value={c.aiFinder.eyebrow} onChange={(e) => patch('aiFinder', { eyebrow: e.target.value })} />
              </Field>
              <Field label="Tiêu đề">
                <input className={input} value={c.aiFinder.heading} onChange={(e) => patch('aiFinder', { heading: e.target.value })} />
              </Field>
            </div>
            <Field label="Mô tả">
              <textarea rows={2} className={input} value={c.aiFinder.description} onChange={(e) => patch('aiFinder', { description: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Placeholder">
                <input className={input} value={c.aiFinder.placeholder} onChange={(e) => patch('aiFinder', { placeholder: e.target.value })} />
              </Field>
              <Field label="Chữ trên nút">
                <input className={input} value={c.aiFinder.buttonText} onChange={(e) => patch('aiFinder', { buttonText: e.target.value })} />
              </Field>
              <Field label="Thông báo khi bỏ trống">
                <input className={input} value={c.aiFinder.emptyText} onChange={(e) => patch('aiFinder', { emptyText: e.target.value })} />
              </Field>
              <Field label="Nhãn kết quả">
                <input className={input} value={c.aiFinder.resultLabel} onChange={(e) => patch('aiFinder', { resultLabel: e.target.value })} />
              </Field>
            </div>
            <Field label="Nội dung kết quả">
              <input className={input} value={c.aiFinder.resultBody} onChange={(e) => patch('aiFinder', { resultBody: e.target.value })} />
            </Field>
            <Field label="Ghi chú kết quả">
              <textarea rows={2} className={input} value={c.aiFinder.resultNote} onChange={(e) => patch('aiFinder', { resultNote: e.target.value })} />
            </Field>
          </div>
        </AdminSectionCard>
      )}

      {/* ── FOOTER ────────────────────────────────────────────── */}
      {tab === 'footer' && (
        <AdminSectionCard title="Chân trang">
          <div className="space-y-4">
            <Field label="Câu mô tả dưới logo">
              <input className={input} value={c.footer.tagline} onChange={(e) => patch('footer', { tagline: e.target.value })} />
            </Field>
            {c.footer.columns.map((col, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-4 space-y-3">
                <div className="flex gap-2">
                  <input
                    className={input}
                    placeholder="Tiêu đề cột"
                    value={col.title}
                    onChange={(e) => patch('footer', { columns: c.footer.columns.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)) })}
                  />
                  <button
                    type="button"
                    className="shrink-0 rounded-lg border border-rose-200 px-3 text-sm text-rose-600 hover:bg-rose-50"
                    onClick={() => patch('footer', { columns: c.footer.columns.filter((_, j) => j !== i) })}
                  >
                    Xoá cột
                  </button>
                </div>
                <LinkList
                  items={col.links}
                  onChange={(links) => patch('footer', { columns: c.footer.columns.map((x, j) => (j === i ? { ...x, links } : x)) })}
                />
              </div>
            ))}
            <button
              type="button"
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              onClick={() => patch('footer', { columns: [...c.footer.columns, { title: '', links: [] }] })}
            >
              + Thêm cột
            </button>
          </div>
        </AdminSectionCard>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

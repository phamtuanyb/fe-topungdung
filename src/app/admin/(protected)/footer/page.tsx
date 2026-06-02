'use client'

import { useEffect, useRef, useState } from 'react'
import {
  adminGetFooterConfig,
  adminUpdateFooterConfig,
} from '@/lib/api/admin'
import type { FooterConfig, FooterSection, FooterSocial } from '@/types'
import AdminPageHeader from '@/components/admin/AdminPageHeader'

// ─── Social platforms ─────────────────────────────────────────────────────────

const SOCIAL_PLATFORMS: { type: string; label: string; path: string }[] = [
  { type: 'facebook',  label: 'Facebook',
    path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
  { type: 'youtube',   label: 'YouTube',
    path: 'M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.6C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z' },
  { type: 'zalo',      label: 'Zalo',
    path: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
  { type: 'instagram', label: 'Instagram',
    path: 'M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm4.5 5a5 5 0 1 0 0 10A5 5 0 0 0 12 7zm6.5-1.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z' },
  { type: 'tiktok',    label: 'TikTok',
    path: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.69a8.16 8.16 0 0 0 4.84 1.55V6.78a4.85 4.85 0 0 1-1.08-.09z' },
  { type: 'linkedin',  label: 'LinkedIn',
    path: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' },
  { type: 'twitter',   label: 'Twitter / X',
    path: 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z' },
  { type: 'telegram',  label: 'Telegram',
    path: 'M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z' },
  { type: 'pinterest', label: 'Pinterest',
    path: 'M12 2C6.5 2 2 6.5 2 12c0 4.2 2.6 7.8 6.4 9.3-.1-.7-.1-1.8 0-2.5.2-.7 1.2-5.2 1.2-5.2s-.3-.6-.3-1.6c0-1.5.9-2.6 1.9-2.6.9 0 1.3.7 1.3 1.5 0 .9-.6 2.3-.9 3.5-.2 1 .5 1.9 1.6 1.9 1.9 0 3.2-2 3.2-4.8 0-2.5-1.8-4.3-4.4-4.3-3 0-4.7 2.2-4.7 4.5 0 .9.3 1.9.8 2.4.1.1.1.2.1.3-.1.3-.3 1-.3 1.2-.1.2-.2.2-.4.1-1.5-.7-2.4-2.9-2.4-4.6 0-3.4 2.5-6.5 7.1-6.5 3.7 0 6.6 2.6 6.6 6.2 0 3.7-2.3 6.6-5.5 6.6-1.1 0-2.1-.6-2.4-1.2l-.7 2.5c-.2.9-.9 2.1-1.3 2.8 1 .3 2 .5 3.2.5C17.5 22 22 17.5 22 12S17.5 2 12 2z' },
  { type: 'threads',   label: 'Threads',
    path: 'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-5h2v2h-2zm0-8h2v6h-2z' },
]

const SOCIAL_PATH_MAP = Object.fromEntries(SOCIAL_PLATFORMS.map((p) => [p.type, p.path]))

// ─── Emoji picker ─────────────────────────────────────────────────────────────

const EMOJI_LIST = [
  '⚙️','👥','📱','🤖','🌐','🎨','🏢','🔄','📝','💼',
  '✉️','🌍','📘','💬','🛒','💳','📊','🎯','🚀','💡',
  '🔑','📦','🏆','⭐','💻','🖥️','📷','🎥','🔔','🛡️',
  '✅','❤️','🌟','💎','🔥','🎁','📈','🔗','🏅','🏪',
]

// ─── Shared UI ────────────────────────────────────────────────────────────────

const inputCls = 'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400'

function SectionCard({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {title && (
        <div className="border-b border-slate-100 px-5 py-3.5">
          <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
        </div>
      )}
      <div className="p-5 space-y-4">{children}</div>
    </div>
  )
}

function Field({
  label, required, hint, children,
}: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  )
}

function EmojiPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)}
        className="w-11 h-9 rounded-lg border border-slate-200 text-lg flex items-center justify-center hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        {value || '🔗'}
      </button>
      {open && (
        <div className="absolute z-20 top-10 left-0 bg-white rounded-xl border border-slate-200 shadow-xl p-2 w-56">
          <div className="grid grid-cols-8 gap-0.5 mb-2">
            {EMOJI_LIST.map((e) => (
              <button key={e} type="button" onClick={() => { onChange(e); setOpen(false) }}
                className={`text-base p-1 rounded hover:bg-slate-100 transition-colors ${value === e ? 'bg-indigo-100' : ''}`}
              >{e}</button>
            ))}
          </div>
          <input value={value} onChange={(ev) => onChange(ev.target.value)}
            placeholder="Hoặc nhập emoji..."
            className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      )}
    </div>
  )
}

// ─── Tab: Thương hiệu ─────────────────────────────────────────────────────────

function BrandTab({ config, onChange }: { config: FooterConfig; onChange: (c: FooterConfig) => void }) {
  const { brand } = config

  function setBrand(patch: Partial<typeof brand>) {
    onChange({ ...config, brand: { ...brand, ...patch } })
  }

  function setSocial(idx: number, patch: Partial<FooterSocial>) {
    setBrand({ socials: brand.socials.map((s, i) => (i === idx ? { ...s, ...patch } : s)) })
  }

  return (
    <div className="space-y-4">
      {/* Tiêu đề cột Brand */}
      <SectionCard title="Tiêu đề cột Brand">
        <Field label="Tiêu đề" hint="Hiển thị trên đầu cột Brand trong footer (giống các cột Dịch vụ / Công ty / Liên hệ).">
          <input
            value={brand.title ?? ''}
            onChange={(e) => setBrand({ title: e.target.value })}
            className={inputCls}
            placeholder="VD: Vsoftware"
          />
        </Field>
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-[12.5px] text-blue-800 leading-relaxed">
          <strong>Hotline / Gmail / Địa chỉ</strong> tự động lấy từ <a href="/admin/contact-info" className="underline font-bold">/admin/contact-info</a> — sửa ở đó để đồng bộ. Footer hiển thị item đầu tiên của mỗi mục.
        </div>
      </SectionCard>

      {/* Socials */}
      <SectionCard title="Mạng xã hội">
        <div className="space-y-2">
          {brand.socials.map((s, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="shrink-0 w-8 h-9 flex items-center justify-center text-slate-500">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d={SOCIAL_PATH_MAP[s.type] ?? SOCIAL_PATH_MAP.facebook} />
                </svg>
              </div>
              <select value={s.type} onChange={(e) => setSocial(idx, { type: e.target.value })}
                className="w-36 rounded-lg border border-slate-200 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {SOCIAL_PLATFORMS.map((p) => <option key={p.type} value={p.type}>{p.label}</option>)}
              </select>
              <input value={s.href} onChange={(e) => setSocial(idx, { href: e.target.value })}
                className={`${inputCls} flex-1`} placeholder="https://..." />
              <button type="button" onClick={() => setBrand({ socials: brand.socials.filter((_, i) => i !== idx) })}
                className="shrink-0 rounded-lg border border-red-100 p-2 text-red-400 hover:bg-red-50 transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <button type="button"
          onClick={() => setBrand({ socials: [...brand.socials, { type: 'facebook', href: '' }] })}
          className="mt-2 flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <span className="text-base leading-none">+</span> Thêm mạng xã hội
        </button>
      </SectionCard>

    </div>
  )
}

// ─── Tab: Danh mục footer ─────────────────────────────────────────────────────

function SectionsTab({ config, onChange }: { config: FooterConfig; onChange: (c: FooterConfig) => void }) {
  function setSection(idx: number, sec: FooterSection) {
    onChange({ ...config, sections: config.sections.map((s, i) => (i === idx ? sec : s)) })
  }

  function addSection() {
    onChange({ ...config, sections: [...config.sections, { type: 'links' as const, title: 'Danh mục mới', links: [] }] })
  }

  function removeSection(idx: number) {
    if (!confirm('Xóa mục này?')) return
    onChange({ ...config, sections: config.sections.filter((_, i) => i !== idx) })
  }

  function setLink(sIdx: number, lIdx: number, patch: Partial<{ icon: string; label: string; href: string }>) {
    const sec = config.sections[sIdx]
    const links = (sec.links ?? []).map((l, i) => (i === lIdx ? { ...l, ...patch } : l))
    setSection(sIdx, { ...sec, links })
  }

  function addLink(sIdx: number) {
    const sec = config.sections[sIdx]
    setSection(sIdx, { ...sec, links: [...(sec.links ?? []), { icon: '🔗', label: '', href: '' }] })
  }

  function removeLink(sIdx: number, lIdx: number) {
    const sec = config.sections[sIdx]
    setSection(sIdx, { ...sec, links: (sec.links ?? []).filter((_, i) => i !== lIdx) })
  }

  return (
    <div className="space-y-4">
      {config.sections.map((sec, sIdx) => (
        <SectionCard key={sIdx}>
          {/* Section header */}
          <div className="flex items-start gap-3 -mt-1">
            <div className="flex-1">
              <Field label="Tiêu đề danh mục">
                <input value={sec.title} onChange={(e) => setSection(sIdx, { ...sec, title: e.target.value })} className={inputCls} />
              </Field>
            </div>
            <button type="button" onClick={() => removeSection(sIdx)}
              className="mt-5 shrink-0 rounded-lg border border-red-100 px-2.5 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors flex items-center gap-1"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Xóa mục
            </button>
          </div>

          {/* Links */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2">Danh sách link</label>
              <div className="space-y-2">
                {(sec.links ?? []).map((link, lIdx) => (
                  <div key={lIdx} className="flex items-center gap-2">
                    <EmojiPicker value={link.icon} onChange={(v) => setLink(sIdx, lIdx, { icon: v })} />
                    <input value={link.label} onChange={(e) => setLink(sIdx, lIdx, { label: e.target.value })} className={`${inputCls} flex-1`} placeholder="Nhãn" />
                    <input value={link.href}  onChange={(e) => setLink(sIdx, lIdx, { href: e.target.value })} className={`${inputCls} flex-1`} placeholder="URL" />
                    <button type="button" onClick={() => removeLink(sIdx, lIdx)}
                      className="shrink-0 rounded-lg border border-red-100 p-2 text-red-400 hover:bg-red-50 transition-colors"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => addLink(sIdx)}
                className="mt-3 flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <span className="text-base leading-none">+</span> Thêm link
              </button>
            </div>
        </SectionCard>
      ))}

      <button type="button" onClick={addSection}
        className="w-full rounded-2xl border-2 border-dashed border-slate-200 py-4 text-sm font-medium text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors"
      >
        + Thêm mục
      </button>
    </div>
  )
}

// ─── Tab: Bottom bar ──────────────────────────────────────────────────────────

function BottomTab({ config, onChange }: { config: FooterConfig; onChange: (c: FooterConfig) => void }) {
  return (
    <div className="space-y-4">
      <SectionCard title="Copyright">
        <Field label="Nội dung" hint="Dùng {year} để tự động điền năm hiện tại">
          <input value={config.copyright} onChange={(e) => onChange({ ...config, copyright: e.target.value })} className={inputCls} />
        </Field>
        <p className="text-xs text-slate-400">
          Preview: {config.copyright.replace('{year}', String(new Date().getFullYear()))}
        </p>
      </SectionCard>
      <SectionCard title="Link pháp lý">
        {config.legalLinks.map((link, i) => (
          <div key={i} className="grid grid-cols-2 gap-3">
            <Field label="Nhãn">
              <input value={link.label} onChange={(e) => {
                const legalLinks = config.legalLinks.map((l, j) => j === i ? { ...l, label: e.target.value } : l)
                onChange({ ...config, legalLinks })
              }} className={inputCls} />
            </Field>
            <Field label="URL">
              <input value={link.href} onChange={(e) => {
                const legalLinks = config.legalLinks.map((l, j) => j === i ? { ...l, href: e.target.value } : l)
                onChange({ ...config, legalLinks })
              }} className={inputCls} />
            </Field>
          </div>
        ))}
      </SectionCard>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

type Tab = 'brand' | 'sections' | 'bottom'

export default function FooterEditorPage() {
  const [config, setConfig] = useState<FooterConfig | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('brand')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    adminGetFooterConfig()
      .then((res) => {
        const raw = res.data as FooterConfig & { columns?: { title: string; links: { icon: string; label: string; href: string }[] }[] }
        if (!raw.sections && raw.columns) {
          setConfig({ ...raw, sections: raw.columns.map((c) => ({ type: 'links' as const, ...c })) })
        } else {
          setConfig(raw)
        }
      })
      .catch(() => setError('Không tải được cấu hình footer'))
  }, [])

  async function handleSave() {
    if (!config || saving) return
    setSaving(true)
    setSaved(false)
    setError('')
    try {
      await adminUpdateFooterConfig(config)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Lưu thất bại, thử lại.')
    } finally {
      setSaving(false)
    }
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'brand',    label: 'Thương hiệu' },
    { key: 'sections', label: 'Danh mục footer' },
    { key: 'bottom',   label: 'Bottom bar' },
  ]

  return (
    <div className="space-y-6 max-w-4xl">
      <AdminPageHeader title="Chân trang (Footer)" description="Chỉnh sửa nội dung hiển thị ở cuối trang" showBack={false}>
        <button onClick={handleSave} disabled={saving || !config}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Đang lưu...' : saved ? '✓ Đã lưu' : 'Lưu thay đổi'}
        </button>
      </AdminPageHeader>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {!config && !error ? (
        <div className="flex items-center justify-center py-20 text-slate-400 text-sm">Đang tải...</div>
      ) : config ? (
        <>
          <div className="flex gap-1 rounded-xl bg-slate-100 p-1 w-fit">
            {tabs.map((t) => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === t.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {activeTab === 'brand'    && <BrandTab    config={config} onChange={setConfig} />}
          {activeTab === 'sections' && <SectionsTab config={config} onChange={setConfig} />}
          {activeTab === 'bottom'   && <BottomTab   config={config} onChange={setConfig} />}
        </>
      ) : null}
    </div>
  )
}

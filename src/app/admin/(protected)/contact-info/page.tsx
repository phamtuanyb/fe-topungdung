'use client'

import { useEffect, useState } from 'react'
import { adminGetContactConfig, adminUpdateContactConfig } from '@/lib/api/admin'
import type {
  ContactConfig,
  ContactOffice,
  WorkingHourSlot,
} from '@/types'
import AdminPageHeader from '@/components/admin/AdminPageHeader'

// ─── Default config (dùng khi DB chưa có) ────────────────────────────────────

const DEFAULT_CONFIG: ContactConfig = {
  form: {
    heading: 'Nói chuyện 30 phút — biết ngay có làm được không',
    description:
      'Không ràng buộc. Không phí tư vấn. Vsoftware sẽ phân tích bài toán và đề xuất giải pháp phù hợp nhất — dù bạn có chọn chúng tôi hay không.',
    needs: [
      'Phần mềm quản lý theo ngành (spa, nhà hàng, phòng khám...)',
      'CRM & Quản lý bán hàng',
      'App bán hàng đa kênh / Mobile App',
      'AI Agent & Automation',
      'Website & Landing Page',
      'Tích hợp hệ thống (MISA, Zalo, ngân hàng...)',
      'Tư vấn chuyển đổi số toàn diện',
      'Khác',
    ],
    submitText: 'Gửi yêu cầu tư vấn',
    noteText:
      'Vsoftware phản hồi trong vòng 2 giờ làm việc. Thông tin của bạn được bảo mật tuyệt đối.',
    successHeading: 'Đã nhận yêu cầu!',
    successText: 'Đội Vsoftware sẽ liên hệ với bạn trong vòng 2 giờ làm việc.',
  },
  quickContact: {
    heading: 'Liên hệ ngay — không cần chờ',
    description: 'Cần trao đổi nhanh? Nhắn tin hoặc gọi trực tiếp đội tư vấn Vsoftware.',
    zaloText: 'Chat Zalo OA ngay',
    zaloHref: 'https://zalo.me/0914888678',
    phoneText: 'Gọi: 0914 888 678',
    phoneHref: 'tel:+84914888678',
  },
  info: {
    sectionTitle: 'Thông tin liên hệ',
    offices: [
      { name: 'Văn phòng Hà Nội', address: '35 Lê Văn Thiêm, Thanh Xuân, Hà Nội' },
    ],
    hotlines: ['0912 345 678', '0987 654 321'],
    emails: ['hello@vsoftware.vn', 'support@vsoftware.vn'],
  },
  workingHours: {
    sectionTitle: 'Giờ làm việc',
    slots: [
      { day: 'Thứ 2 – 6', time: '8:00 – 18:00' },
      { day: 'Thứ 7', time: '8:00 – 12:00' },
      { day: 'Chủ nhật', time: 'Nghỉ' },
      { day: 'Zalo / Email', time: '24/7 auto' },
    ],
    note: 'Ngoài giờ hành chính: nhắn Zalo, đội tư vấn phản hồi trong vòng 30 phút (7:00–22:00 tất cả các ngày).',
  },
}

// ─── Shared UI ───────────────────────────────────────────────────────────────

const inputCls =
  'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400'

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

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  )
}

function StringListEditor({
  items,
  onChange,
  placeholder,
  addLabel,
}: {
  items: string[]
  onChange: (next: string[]) => void
  placeholder?: string
  addLabel: string
}) {
  return (
    <div>
      <button
        type="button"
        onClick={() => onChange(['', ...items])}
        className="mb-2 flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
      >
        <span className="text-base leading-none">+</span> {addLabel}
      </button>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={it}
              onChange={(e) => {
                const next = items.map((v, j) => (j === i ? e.target.value : v))
                onChange(next)
              }}
              placeholder={placeholder}
              className={`${inputCls} flex-1`}
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="shrink-0 rounded-lg border border-red-100 p-2 text-red-400 hover:bg-red-50 transition-colors"
              aria-label="Xóa"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Tab: Form ───────────────────────────────────────────────────────────────

function FormTab({ config, onChange }: { config: ContactConfig; onChange: (c: ContactConfig) => void }) {
  const { form } = config
  function set(patch: Partial<ContactConfig['form']>) {
    onChange({ ...config, form: { ...form, ...patch } })
  }
  return (
    <div className="space-y-4">
      <SectionCard title="Tiêu đề & mô tả form">
        <Field label="Heading">
          <input value={form.heading} onChange={(e) => set({ heading: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Mô tả ngắn dưới heading">
          <textarea
            value={form.description}
            onChange={(e) => set({ description: e.target.value })}
            rows={3}
            className={inputCls}
          />
        </Field>
      </SectionCard>

      <SectionCard title='Danh sách option của dropdown "Bạn đang cần"'>
        <p className="text-xs text-slate-400 -mt-1">
          Mỗi dòng là 1 option trong dropdown. Thêm lên đầu = hiện ở trên cùng list.
        </p>
        <StringListEditor
          items={form.needs}
          onChange={(needs) => set({ needs })}
          placeholder="VD: CRM & Quản lý bán hàng"
          addLabel="Thêm option (lên đầu)"
        />
      </SectionCard>

      <SectionCard title="Nút submit & ghi chú">
        <Field label="Text nút submit">
          <input value={form.submitText} onChange={(e) => set({ submitText: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Ghi chú dưới nút submit">
          <textarea
            value={form.noteText}
            onChange={(e) => set({ noteText: e.target.value })}
            rows={2}
            className={inputCls}
          />
        </Field>
      </SectionCard>

      <SectionCard title="Thông báo sau khi gửi thành công">
        <Field label="Heading thành công">
          <input value={form.successHeading} onChange={(e) => set({ successHeading: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Nội dung thông báo">
          <textarea
            value={form.successText}
            onChange={(e) => set({ successText: e.target.value })}
            rows={2}
            className={inputCls}
          />
        </Field>
      </SectionCard>
    </div>
  )
}

// ─── Tab: Quick contact (Zalo / Phone) ───────────────────────────────────────

function QuickContactTab({ config, onChange }: { config: ContactConfig; onChange: (c: ContactConfig) => void }) {
  const { quickContact } = config
  function set(patch: Partial<ContactConfig['quickContact']>) {
    onChange({ ...config, quickContact: { ...quickContact, ...patch } })
  }
  return (
    <div className="space-y-4">
      <SectionCard title='Card "Liên hệ ngay — không cần chờ"'>
        <Field label="Heading">
          <input value={quickContact.heading} onChange={(e) => set({ heading: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Mô tả">
          <textarea
            value={quickContact.description}
            onChange={(e) => set({ description: e.target.value })}
            rows={2}
            className={inputCls}
          />
        </Field>
      </SectionCard>

      <SectionCard title="Nút Zalo">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Text nút">
            <input value={quickContact.zaloText} onChange={(e) => set({ zaloText: e.target.value })} className={inputCls} />
          </Field>
          <Field label="URL Zalo" hint="VD: https://zalo.me/0914888678">
            <input value={quickContact.zaloHref} onChange={(e) => set({ zaloHref: e.target.value })} className={inputCls} />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Nút gọi điện">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Text nút" hint="VD: Gọi: 0914 888 678">
            <input value={quickContact.phoneText} onChange={(e) => set({ phoneText: e.target.value })} className={inputCls} />
          </Field>
          <Field label="URL tel:" hint="VD: tel:+84914888678">
            <input value={quickContact.phoneHref} onChange={(e) => set({ phoneHref: e.target.value })} className={inputCls} />
          </Field>
        </div>
      </SectionCard>
    </div>
  )
}

// ─── Tab: Info (offices / hotlines / emails) ─────────────────────────────────

function InfoTab({ config, onChange }: { config: ContactConfig; onChange: (c: ContactConfig) => void }) {
  const { info } = config
  function set(patch: Partial<ContactConfig['info']>) {
    onChange({ ...config, info: { ...info, ...patch } })
  }
  return (
    <div className="space-y-4">
      <SectionCard title="Tiêu đề card">
        <Field label="Tiêu đề (mặc định: Thông tin liên hệ)">
          <input value={info.sectionTitle} onChange={(e) => set({ sectionTitle: e.target.value })} className={inputCls} />
        </Field>
      </SectionCard>

      <SectionCard title="Văn phòng">
        <button
          type="button"
          onClick={() => set({ offices: [{ name: '', address: '' }, ...info.offices] })}
          className="mb-2 flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <span className="text-base leading-none">+</span> Thêm văn phòng (lên đầu)
        </button>
        <div className="space-y-3">
          {info.offices.map((office, i) => (
            <div key={i} className="rounded-xl border border-slate-200 p-4 space-y-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-400">#{i + 1}</span>
                <button
                  type="button"
                  onClick={() => set({ offices: info.offices.filter((_, j) => j !== i) })}
                  className="rounded-lg border border-red-100 px-2.5 py-1 text-xs font-medium text-red-500 hover:bg-red-50"
                >
                  Xóa
                </button>
              </div>
              <Field label="Tên văn phòng">
                <input
                  value={office.name}
                  onChange={(e) => {
                    const offices: ContactOffice[] = info.offices.map((o, j) =>
                      j === i ? { ...o, name: e.target.value } : o
                    )
                    set({ offices })
                  }}
                  className={inputCls}
                  placeholder="VD: Văn phòng Hà Nội"
                />
              </Field>
              <Field label="Địa chỉ">
                <input
                  value={office.address}
                  onChange={(e) => {
                    const offices: ContactOffice[] = info.offices.map((o, j) =>
                      j === i ? { ...o, address: e.target.value } : o
                    )
                    set({ offices })
                  }}
                  className={inputCls}
                  placeholder="VD: 35 Lê Văn Thiêm, Thanh Xuân, Hà Nội"
                />
              </Field>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Số hotline">
        <StringListEditor
          items={info.hotlines}
          onChange={(hotlines) => set({ hotlines })}
          placeholder="VD: 0912 345 678"
          addLabel="Thêm hotline (lên đầu)"
        />
      </SectionCard>

      <SectionCard title="Email">
        <StringListEditor
          items={info.emails}
          onChange={(emails) => set({ emails })}
          placeholder="VD: hello@vsoftware.vn"
          addLabel="Thêm email (lên đầu)"
        />
      </SectionCard>
    </div>
  )
}

// ─── Tab: Working hours ──────────────────────────────────────────────────────

function WorkingHoursTab({ config, onChange }: { config: ContactConfig; onChange: (c: ContactConfig) => void }) {
  const { workingHours } = config
  function set(patch: Partial<ContactConfig['workingHours']>) {
    onChange({ ...config, workingHours: { ...workingHours, ...patch } })
  }
  return (
    <div className="space-y-4">
      <SectionCard title="Tiêu đề card">
        <Field label="Tiêu đề (mặc định: Giờ làm việc)">
          <input value={workingHours.sectionTitle} onChange={(e) => set({ sectionTitle: e.target.value })} className={inputCls} />
        </Field>
      </SectionCard>

      <SectionCard title="Các khung giờ">
        <button
          type="button"
          onClick={() => set({ slots: [{ day: '', time: '' }, ...workingHours.slots] })}
          className="mb-2 flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <span className="text-base leading-none">+</span> Thêm khung giờ (lên đầu)
        </button>
        <div className="space-y-3">
          {workingHours.slots.map((slot, i) => (
            <div key={i} className="rounded-xl border border-slate-200 p-4 space-y-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-400">#{i + 1}</span>
                <button
                  type="button"
                  onClick={() => set({ slots: workingHours.slots.filter((_, j) => j !== i) })}
                  className="rounded-lg border border-red-100 px-2.5 py-1 text-xs font-medium text-red-500 hover:bg-red-50"
                >
                  Xóa
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Ngày (nhãn)">
                  <input
                    value={slot.day}
                    onChange={(e) => {
                      const slots: WorkingHourSlot[] = workingHours.slots.map((s, j) =>
                        j === i ? { ...s, day: e.target.value } : s
                      )
                      set({ slots })
                    }}
                    className={inputCls}
                    placeholder="VD: Thứ 2 – 6"
                  />
                </Field>
                <Field label="Giờ" hint='Gõ "Nghỉ" để hiển thị mờ'>
                  <input
                    value={slot.time}
                    onChange={(e) => {
                      const slots: WorkingHourSlot[] = workingHours.slots.map((s, j) =>
                        j === i ? { ...s, time: e.target.value } : s
                      )
                      set({ slots })
                    }}
                    className={inputCls}
                    placeholder="VD: 8:00 – 18:00"
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Ghi chú dưới card">
        <Field label="Ghi chú">
          <textarea
            value={workingHours.note}
            onChange={(e) => set({ note: e.target.value })}
            rows={3}
            className={inputCls}
          />
        </Field>
      </SectionCard>
    </div>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────

type Tab = 'form' | 'quick' | 'info' | 'hours'

export default function ContactInfoEditorPage() {
  const [config, setConfig] = useState<ContactConfig | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('form')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    adminGetContactConfig()
      .then((res) => setConfig(res.data))
      .catch((err: Error) => {
        if (err.message?.includes('không tồn tại') || err.message?.includes('404') || err.message?.includes('Not Found')) {
          setConfig(DEFAULT_CONFIG)
        } else {
          setError('Không tải được cấu hình liên hệ')
        }
      })
  }, [])

  async function handleSave() {
    if (!config || saving) return
    setSaving(true)
    setSaved(false)
    setError('')
    try {
      await adminUpdateContactConfig(config)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Lưu thất bại, thử lại.')
    } finally {
      setSaving(false)
    }
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'form', label: 'Form liên hệ' },
    { key: 'quick', label: 'Liên hệ nhanh (Zalo/Phone)' },
    { key: 'info', label: 'Văn phòng / Hotline / Email' },
    { key: 'hours', label: 'Giờ làm việc' },
  ]

  return (
    <div className="space-y-6 max-w-4xl">
      <AdminPageHeader
        title="Thông tin liên hệ"
        description="Chỉnh sửa nội dung hiển thị trên trang /lien-he"
        showBack={false}
      >
        <button
          onClick={handleSave}
          disabled={saving || !config}
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
          <div className="flex gap-1 rounded-xl bg-slate-100 p-1 w-fit flex-wrap">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === t.key
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {activeTab === 'form' && <FormTab config={config} onChange={setConfig} />}
          {activeTab === 'quick' && <QuickContactTab config={config} onChange={setConfig} />}
          {activeTab === 'info' && <InfoTab config={config} onChange={setConfig} />}
          {activeTab === 'hours' && <WorkingHoursTab config={config} onChange={setConfig} />}
        </>
      ) : null}
    </div>
  )
}

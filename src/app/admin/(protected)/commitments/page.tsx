'use client'

import { useEffect, useState } from 'react'
import { adminGetCommitmentsConfig, adminUpdateCommitmentsConfig } from '@/lib/api/admin'
import type { CommitmentsConfig, CommitmentItem } from '@/types'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import IconPicker from '@/components/admin/IconPicker'
import Toast from '@/components/ui/Toast'

const inputCls =
  'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400'

const DEFAULT_CONFIG: CommitmentsConfig = {
  heading: 'Vsoftware cam kết',
  items: [
    { iconName: 'Zap', title: 'Triển khai 4-8 tuần', description: 'Methodology chia nhỏ module, bàn giao cuốn chiếu. Có demo từng sprint.' },
    { iconName: 'HeartHandshake', title: 'Hỗ trợ 1-1', description: 'Hỗ trợ 1-1 trong suốt quá trình sử dụng phần mềm.' },
    { iconName: 'Wallet', title: 'Hoàn tiền 7 ngày', description: 'Hoàn tiền 100% trong 7 ngày đầu nếu sản phẩm không như mô tả, không hỏi lý do.' },
    { iconName: 'ShieldCheck', title: 'Bảo hành & update miễn phí', description: 'Bảo hành và update miễn phí trọn đời cho gói đã mua.' },
    { iconName: 'GraduationCap', title: 'Cầm tay chỉ việc', description: 'Đào tạo, cầm tay chỉ việc đến khi nhân viên của bạn thành thạo.' },
  ],
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      {children}
    </div>
  )
}

export default function CommitmentsEditorPage() {
  const [config, setConfig] = useState<CommitmentsConfig | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    adminGetCommitmentsConfig()
      .then((res) => setConfig(res.data))
      .catch((err: Error) => {
        if (err.message?.includes('không tồn tại') || err.message?.includes('404') || err.message?.includes('Not Found')) {
          setConfig(DEFAULT_CONFIG)
        } else {
          setError('Không tải được cấu hình cam kết')
        }
      })
  }, [])

  function patch(p: Partial<CommitmentsConfig>) {
    if (!config) return
    setConfig({ ...config, ...p })
  }

  function setItem(idx: number, p: Partial<CommitmentItem>) {
    if (!config) return
    setConfig({ ...config, items: config.items.map((it, i) => (i === idx ? { ...it, ...p } : it)) })
  }

  function addItem() {
    if (!config) return
    if (config.items.length >= 5) {
      setToast({ message: 'Tối đa 5 cam kết', type: 'error' })
      return
    }
    setConfig({ ...config, items: [{ title: '', description: '', iconName: 'Star' }, ...config.items] })
  }

  function removeItem(idx: number) {
    if (!config) return
    setConfig({ ...config, items: config.items.filter((_, i) => i !== idx) })
  }

  async function handleSave() {
    if (!config || saving) return
    setSaving(true)
    setSaved(false)
    setError('')
    try {
      await adminUpdateCommitmentsConfig(config)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Lưu thất bại, thử lại.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <AdminPageHeader
        title="Cam kết (dùng chung toàn website)"
        description="5 cam kết hiển thị ở section &ldquo;Vsoftware cam kết&rdquo; trên các trang sản phẩm. Sửa 1 lần — áp dụng mọi nơi."
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
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 space-y-3">
            <Field label="Heading section (hiển thị trên web)">
              <input value={config.heading} onChange={(e) => patch({ heading: e.target.value })} className={inputCls} placeholder="VD: Vsoftware cam kết" />
            </Field>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-700">Danh sách cam kết</h3>
                <p className="text-xs text-slate-500 mt-0.5">Đúng 5 cam kết — hiển thị thành hàng ngang 5 ô trên desktop. Bạn đang có <strong>{config.items.length}/5</strong>.</p>
              </div>
              <button
                type="button"
                onClick={addItem}
                disabled={config.items.length >= 5}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-40"
              >
                + Thêm cam kết (lên đầu)
              </button>
            </div>
            <div className="space-y-3">
              {config.items.map((item, i) => (
                <div key={i} className="rounded-xl border border-slate-200 p-4 space-y-3 bg-slate-50/40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">#{i + 1}</span>
                    <button type="button" onClick={() => removeItem(i)} className="rounded-md border border-red-100 px-2 py-0.5 text-xs text-red-500 hover:bg-red-50">Xóa</button>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    <Field label="Icon">
                      <IconPicker value={item.iconName ?? ''} onChange={(name) => setItem(i, { iconName: name })} />
                    </Field>
                    <div className="col-span-3">
                      <Field label="Tiêu đề cam kết">
                        <input value={item.title} onChange={(e) => setItem(i, { title: e.target.value })} className={inputCls} placeholder="VD: Hoàn tiền 7 ngày" />
                      </Field>
                    </div>
                  </div>
                  <Field label="Mô tả">
                    <textarea value={item.description ?? ''} onChange={(e) => setItem(i, { description: e.target.value })} rows={2} className={inputCls} placeholder="Mô tả ngắn cho cam kết" />
                  </Field>
                </div>
              ))}
              {config.items.length === 0 && (
                <div className="text-center text-sm text-slate-400 py-8">Chưa có cam kết nào. Bấm nút trên để thêm.</div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

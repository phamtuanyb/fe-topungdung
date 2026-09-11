'use client'

import { useEffect, useState } from 'react'
import { getCategories, submitAppSuggestion } from '@/lib/api/public'
import type { Category } from '@/types'
import ModalPortal from './ModalPortal'

/** Form "+ Đề xuất ứng dụng" — gửi thẳng vào /admin/de-xuat. */
export default function SuggestModal({ onClose }: { onClose: () => void }) {
  const [cats, setCats] = useState<Category[]>([])
  const [form, setForm] = useState({
    appName: '',
    website: '',
    categorySlug: '',
    reason: '',
    submitterName: '',
    submitterEmail: '',
  })
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getCategories()
      .then((r) => {
        const all = r.data ?? []
        const root = all.find((c: Category) => c.slug === 'ung-dung')
        setCats(root ? all.filter((c) => c.parentId === root.id) : [])
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function send(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.appName.trim()) {
      setError('Hãy nhập tên ứng dụng.')
      return
    }
    if (form.submitterEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.submitterEmail)) {
      setError('Email chưa đúng định dạng.')
      return
    }

    setSending(true)
    try {
      await submitAppSuggestion({
        appName: form.appName.trim(),
        website: form.website.trim() || undefined,
        categorySlug: form.categorySlug || undefined,
        reason: form.reason.trim() || undefined,
        submitterName: form.submitterName.trim() || undefined,
        submitterEmail: form.submitterEmail.trim() || undefined,
      })
      setDone(true)
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      // Backend chặn spam bằng giới hạn số lần gửi
      setError(
        msg.includes('429') || msg.toLowerCase().includes('many')
          ? 'Bạn gửi hơi nhanh. Chờ một lát rồi thử lại nhé.'
          : 'Gửi không thành công. Kiểm tra kết nối rồi thử lại.',
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <ModalPortal>
      <div className="tud-modal-bg" onClick={onClose}>
      <div className="tud-modal suggest-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="tud-modal-head">
          <h3>{done ? 'Đã nhận đề xuất' : 'Đề xuất ứng dụng'}</h3>
          <button className="tud-modal-x" onClick={onClose} aria-label="Đóng">
            ✕
          </button>
        </div>

        {done ? (
          <div className="suggest-done">
            <div className="suggest-done-icon">✓</div>
            <p>
              Cảm ơn bạn. Đề xuất <b>{form.appName}</b> đã được gửi tới ban biên tập. Nếu phù hợp,
              ứng dụng sẽ được đưa vào đánh giá và lên bảng xếp hạng.
            </p>
            <button className="btn dark" onClick={onClose}>
              Đóng
            </button>
          </div>
        ) : (
          <form className="suggest-form" onSubmit={send}>
            <p className="suggest-intro">
              Bạn biết ứng dụng nào hay mà chưa có ở đây? Gửi cho chúng tôi. Chỉ tên ứng dụng là bắt buộc.
            </p>

            <label>
              <span>
                Tên ứng dụng <i>*</i>
              </span>
              <input value={form.appName} onChange={set('appName')} placeholder="Ví dụ: Notion" maxLength={255} required />
            </label>

            <label>
              <span>Website</span>
              <input value={form.website} onChange={set('website')} placeholder="https://…" maxLength={500} />
            </label>

            <label>
              <span>Thuộc nhóm nào</span>
              <select value={form.categorySlug} onChange={set('categorySlug')}>
                <option value="">— Chưa rõ —</option>
                {cats.map((c) => (
                  <option value={c.slug} key={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Vì sao nên đưa vào?</span>
              <textarea
                rows={3}
                value={form.reason}
                onChange={set('reason')}
                placeholder="Ứng dụng này giải quyết việc gì, tốt ở điểm nào…"
                maxLength={2000}
              />
            </label>

            <div className="suggest-row">
              <label>
                <span>Tên bạn</span>
                <input value={form.submitterName} onChange={set('submitterName')} maxLength={255} />
              </label>
              <label>
                <span>Email</span>
                <input
                  type="email"
                  value={form.submitterEmail}
                  onChange={set('submitterEmail')}
                  placeholder="Để nhận phản hồi"
                  maxLength={255}
                />
              </label>
            </div>

            {error && <div className="suggest-error">{error}</div>}

            <div className="suggest-actions">
              <button type="button" className="btn" onClick={onClose}>
                Huỷ
              </button>
              <button type="submit" className="btn dark" disabled={sending}>
                {sending ? 'Đang gửi…' : 'Gửi đề xuất'}
              </button>
            </div>
          </form>
        )}
      </div>
      </div>
    </ModalPortal>
  )
}
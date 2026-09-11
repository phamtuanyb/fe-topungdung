'use client'

import { useState } from 'react'
import type { Category } from '@/types'
import { submitAppSuggestion } from '@/lib/api/public'

/**
 * Form gửi prompt cho thư viện.
 *
 * Site chưa có tài khoản cho khách (chỉ 2 tài khoản admin), nên đây là gửi ẩn
 * danh rồi admin duyệt — dùng chung hàng đợi với "Đề xuất ứng dụng", phân biệt
 * bằng trường `kind`. Backend tự băm IP + user-agent để chặn spam mà không lưu
 * IP thô.
 */
export default function PromptSubmitForm({ groups }: { groups: Category[] }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [cat, setCat] = useState('')
  const [text, setText] = useState('')
  const [name, setName] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  const ready = title.trim().length >= 4 && text.trim().length >= 20

  async function send() {
    if (!ready || state === 'sending') return
    setState('sending')
    try {
      const res = await submitAppSuggestion({
        kind: 'prompt',
        appName: title.trim(),
        categorySlug: cat || undefined,
        reason: text.trim(),
        submitterName: name.trim() || undefined,
      })
      setMsg(res.data.message)
      setState('done')
      setTitle('')
      setText('')
      setName('')
    } catch {
      setState('error')
      setMsg('Gửi không thành công. Bạn thử lại sau ít phút giúp mình nhé.')
    }
  }

  if (!open) {
    return (
      <div className="prompt-share">
        <span className="prompt-share-ico" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 3H6a2 2 0 00-2 2v14a2 2 0 002 2h7" />
            <path d="M13 3v6h6" />
            <path d="M18 14v6" />
            <path d="M15 17h6" />
          </svg>
        </span>
        <div>
          <b>Bạn có prompt hay?</b>
          <span>Gửi cho bọn mình, prompt phù hợp sẽ được đăng lên thư viện.</span>
        </div>
        <button className="btn accent" type="button" onClick={() => setOpen(true)}>
          + Gửi prompt
        </button>
      </div>
    )
  }

  return (
    <div className="prompt-share open">
      {state === 'done' ? (
        <div className="prompt-share-done">
          <b>{msg}</b>
          <button className="btn" type="button" onClick={() => setState('idle')}>
            Gửi thêm prompt khác
          </button>
        </div>
      ) : (
        <>
          <div className="prompt-share-head">
            <b>Gửi prompt của bạn</b>
            <button className="prompt-share-close" type="button" onClick={() => setOpen(false)}>
              Đóng
            </button>
          </div>

          <label>
            <span>Prompt này dùng để làm gì?</span>
            <input
              value={title}
              maxLength={255}
              placeholder="Ví dụ: Viết mô tả sản phẩm ngắn cho sàn thương mại điện tử"
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <label>
            <span>Thuộc nhóm nào</span>
            <select value={cat} onChange={(e) => setCat(e.target.value)}>
              <option value="">Chưa rõ, để bọn mình xếp giúp</option>
              {groups.map((g) => (
                <option key={g.id} value={g.slug}>
                  {g.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Nội dung prompt</span>
            <textarea
              value={text}
              rows={7}
              maxLength={8000}
              placeholder="Dán nguyên đoạn prompt vào đây. Nếu có chỗ cần thay, ghi trong ngoặc vuông như [TÊN SẢN PHẨM]."
              onChange={(e) => setText(e.target.value)}
            />
          </label>

          <label>
            <span>Tên bạn (không bắt buộc)</span>
            <input
              value={name}
              maxLength={255}
              placeholder="Để bọn mình ghi nguồn khi đăng"
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          {state === 'error' && <p className="prompt-share-err">{msg}</p>}

          <div className="prompt-share-actions">
            <button className="btn dark" type="button" disabled={!ready || state === 'sending'} onClick={send}>
              {state === 'sending' ? 'Đang gửi...' : 'Gửi prompt'}
            </button>
            <small>
              {ready
                ? 'Prompt sẽ được xem lại trước khi đăng.'
                : 'Cần tiêu đề từ 4 ký tự và nội dung prompt từ 20 ký tự.'}
            </small>
          </div>
        </>
      )}
    </div>
  )
}

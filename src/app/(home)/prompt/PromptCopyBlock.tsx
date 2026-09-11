'use client'

import { Fragment, useState } from 'react'

/** Chỗ cần người dùng thay, viết trong ngoặc vuông: `[TÊN SẢN PHẨM]`. */
const CHO_TRONG = /\[[^\]\n]{1,60}\]/g

/**
 * Tô sáng các ô `[...]` ngay trong đoạn prompt.
 *
 * Làm ở phía trình duyệt bằng mảng phần tử chứ không chèn thẻ vào chuỗi: chuỗi
 * gốc phải giữ nguyên để nút chép trả về đúng prompt, không lẫn thẻ HTML.
 */
function toCho(text: string) {
  const ra: React.ReactNode[] = []
  let cuoi = 0
  CHO_TRONG.lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = CHO_TRONG.exec(text)) !== null) {
    if (m.index > cuoi) ra.push(<Fragment key={cuoi}>{text.slice(cuoi, m.index)}</Fragment>)
    ra.push(
      <mark className="pr-cho" key={`o${m.index}`}>
        {m[0]}
      </mark>,
    )
    cuoi = m.index + m[0].length
  }
  if (cuoi < text.length) ra.push(<Fragment key="het">{text.slice(cuoi)}</Fragment>)
  return ra
}

/**
 * Đoạn prompt kèm nút chép nhanh — khối chính của trang chi tiết.
 *
 * Phải là component chạy phía trình duyệt vì cần clipboard. Có đường lui bằng
 * vùng chọn văn bản cho trình duyệt cũ hoặc khi trang không chạy trên HTTPS —
 * `navigator.clipboard` không tồn tại trong hai trường hợp đó.
 */
export default function PromptCopyBlock({
  text,
  compact = false,
}: {
  text: string
  /** Bài gom nhiều prompt: nhãn là chữ thường, không phải <h2>, để không phá bậc heading. */
  compact?: boolean
}) {
  const [copied, setCopied] = useState(false)
  const coCho = CHO_TRONG.test(text)
  CHO_TRONG.lastIndex = 0

  async function copy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        const ta = document.createElement('textarea')
        ta.value = text
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Chép hỏng thì người dùng vẫn bôi đen chép tay được, không cần báo lỗi.
    }
  }

  const nhan = (
    <>
      <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M8 13h8" />
        <path d="M8 17h5" />
      </svg>
      Nội dung prompt
    </>
  )

  return (
    <section className="pr-code">
      <div className="pr-code-head">
        {compact ? (
          <span className="pr-code-label">{nhan}</span>
        ) : (
          <h2 className="pr-code-label">{nhan}</h2>
        )}
        <button
          className={`pr-copy${copied ? ' ok' : ''}`}
          type="button"
          onClick={copy}
          aria-live="polite"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {copied ? (
              <path d="M20 6L9 17l-5-5" />
            ) : (
              <>
                <path d="M9 9h10a2 2 0 012 2v10a2 2 0 01-2 2H9a2 2 0 01-2-2V11a2 2 0 012-2z" />
                <path d="M5 15H4a2 2 0 01-2-2V3a2 2 0 012-2h10a2 2 0 012 2v1" />
              </>
            )}
          </svg>
          {copied ? 'Đã chép' : 'Sao chép prompt'}
        </button>
      </div>

      <pre className="prompt-box">{toCho(text)}</pre>

      {coCho && (
        <p className="pr-code-note">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          Thay nội dung trong dấu [ ] trước khi sử dụng.
        </p>
      )}
    </section>
  )
}

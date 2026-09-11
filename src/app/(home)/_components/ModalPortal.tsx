'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * Đưa hộp thoại ra khỏi thanh menu.
 *
 * Bắt buộc phải làm vậy: `.topbar` dùng `backdrop-filter`, mà thuộc tính này
 * biến header thành khung tham chiếu cho mọi phần tử `position: fixed` bên
 * trong. Để modal nằm trong header thì `inset: 0` tính theo khung header chứ
 * không phải màn hình, khiến hộp thoại bị dính vào thanh menu.
 *
 * Đích đến là thẻ `.tud` ngoài cùng chứ không phải thẳng <body>: toàn bộ CSS
 * của giao diện nằm dưới `.tud`, ra ngoài nó là mất sạch style lẫn font.
 */
export default function ModalPortal({ children }: { children: React.ReactNode }) {
  const [host, setHost] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setHost((document.querySelector('.tud') as HTMLElement) ?? document.body)

    // Khoá cuộn nền, chừa chỗ thanh cuộn để trang không giật ngang khi mở
    const barWidth = window.innerWidth - document.documentElement.clientWidth
    const prevOverflow = document.body.style.overflow
    const prevPadding = document.body.style.paddingRight
    document.body.style.overflow = 'hidden'
    if (barWidth > 0) document.body.style.paddingRight = `${barWidth}px`

    return () => {
      document.body.style.overflow = prevOverflow
      document.body.style.paddingRight = prevPadding
    }
  }, [])

  if (!host) return null
  return createPortal(children, host)
}

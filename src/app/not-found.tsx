import { Inter } from 'next/font/google'
import KhongTimThayTrang from './(home)/not-found'
import './(home)/home.css'

const inter = Inter({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  display: 'swap',
  variable: '--font-inter',
})

export { metadata } from './(home)/not-found'

/**
 * 404 cho đường dẫn không khớp route nào (ví dụ /abc-xyz).
 *
 * Next chỉ dùng not-found.tsx của layout gần nhất; đường dẫn không thuộc nhóm
 * route nào rơi về layout gốc, nên phải có tệp này — nếu không người đọc thấy
 * trang trắng mặc định của Next. Bọc đúng lớp `tud` và phông như layout (home)
 * để trông y hệt trang 404 bên trong site.
 */
export default function NotFoundRoot() {
  return (
    <div className={`tud ${inter.className}`}>
      <KhongTimThayTrang />
    </div>
  )
}

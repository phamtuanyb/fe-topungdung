import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './home.css'

// Inter variable — thiết kế dùng các nấc 650 / 750 / 850 / 950 nên phải
// nạp bản variable (không khai báo `weight`) thay vì các weight rời rạc.
const inter = Inter({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  // `absolute` để bỏ qua template "%s | <site name>" của root layout,
  // giữ đúng title gốc của thiết kế.
  title: { absolute: 'TopỨngDụng — Tìm đúng ứng dụng. Làm việc tốt hơn.' },
  description:
    'Khám phá, so sánh và lựa chọn những ứng dụng, phần mềm và công cụ AI phù hợp nhất với công việc của bạn.',
  alternates: { canonical: '/' },
}

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <div className={`tud ${inter.className}`}>{children}</div>
}

import { ANH_CHIA_SE_MAC_DINH } from '@/lib/anh-chia-se'
import type { Metadata, Viewport } from 'next'
import { Manrope } from 'next/font/google'
import { layMaXacMinhGoogle } from './(home)/_components/TrackingScripts'
import './globals.css'

// Script Google Analytics / Tag Manager không còn ở đây: chúng nằm trong
// TrackingScripts, gắn ở layout của (home) và (public) để trang quản trị không
// bị đếm lượt xem. Mã đọc từ admin (/admin/theo-doi), không phải biến build.

const manrope = Manrope({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
})

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'TopỨngDụng'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://topungdung.net'

const metadataGoc: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'TopỨngDụng — Tìm đúng ứng dụng. Làm việc tốt hơn.',
    template: `%s | ${siteName}`,
  },
  description:
    'Đánh giá và so sánh ứng dụng, phần mềm và công cụ AI theo từng nhu cầu công việc — ' +
    'kèm điểm mạnh, điểm yếu và mức giá thực tế cho người dùng Việt Nam.',
  openGraph: {
    siteName,
    type: 'website',
    locale: 'vi_VN',
    // Ảnh chia sẻ mặc định cho mọi trang không có ảnh riêng (trang chủ, danh mục...).
    images: [ANH_CHIA_SE_MAC_DINH],
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

/**
 * Thẻ meta google-site-verification phải nằm trong <head> của MỌI trang, kể
 * cả trang chủ, nên phải sinh ở layout gốc. Mã lấy từ admin; chưa dán thì
 * không in thẻ.
 */
export async function generateMetadata(): Promise<Metadata> {
  const google = await layMaXacMinhGoogle()
  return google ? { ...metadataGoc, verification: { google } } : metadataGoc
}

/** Màu thanh trình duyệt trên điện thoại — khớp theme_color trong manifest. */
export const viewport: Viewport = {
  themeColor: '#006FE6',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={manrope.variable}>
      <body className={`${manrope.className} bg-white text-vs-dark antialiased overflow-x-hidden`}>
        {children}
      </body>
    </html>
  )
}

import type { Metadata, Viewport } from 'next'
import { Manrope } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

// Không đặt mã mặc định: chưa khai NEXT_PUBLIC_GA_ID thì không nhúng script theo dõi.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || ''

const manrope = Manrope({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
})

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'TopỨngDụng'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://topungdung.net'

export const metadata: Metadata = {
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
    // Không khai images ở đây: Next tự lấy từ src/app/opengraph-image.tsx.
    // Trước đây trỏ /logo-ngang.png — file đó là logo Vsoftware, nên mọi link
    // chia sẻ ra Facebook/Zalo đều hiện thương hiệu của công ty khác.
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
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
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}

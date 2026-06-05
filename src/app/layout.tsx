import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-NQRC98T7KK'

const manrope = Manrope({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
})

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Vsoftware'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'Vsoftware — Phần mềm theo yêu cầu cho SMEs', template: `%s | ${siteName}` },
  description: 'Vsoftware xây dựng phần mềm quản lý theo yêu cầu cho doanh nghiệp vừa và nhỏ: spa, nhà hàng, phòng khám, bán lẻ, logistics. AI Agent tự động hóa vận hành.',
  openGraph: {
    siteName,
    type: 'website',
    images: ['/logo-ngang.png'],
  },
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

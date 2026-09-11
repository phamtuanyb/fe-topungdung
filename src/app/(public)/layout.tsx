import { Inter } from 'next/font/google'
import { getTudHomeConfig } from '@/lib/api/public'
import { mergeTudConfig } from '@/app/(home)/default-config'
import { TudFooter, TudHeader } from '@/app/(home)/_components/TudChrome'
import '@/app/(home)/home.css'

const inter = Inter({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  display: 'swap',
  variable: '--font-inter',
})

/**
 * Khung cho các trang thông tin còn giữ lại (/lien-he, /introduction,
 * /chinh-sach-bao-mat, /dieu-khoan-su-dung).
 *
 * Trước đây dùng header mega menu của trang cũ, nhưng menu đó trỏ tới
 * /dich-vu, /ai-agent, /category — đều đã gỡ — nên toàn link chết. Giờ dùng
 * chung header/footer với phần còn lại của site; phần thân trang giữ nguyên.
 */
export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const cfgRes = await getTudHomeConfig().catch(() => ({ data: null }))
  const config = mergeTudConfig(cfgRes.data)

  return (
    <div className={`tud ${inter.className} flex min-h-screen flex-col`}>
      <TudHeader config={config.header} />
      <main className="flex-1">{children}</main>
      <TudFooter header={config.header} footer={config.footer} />
    </div>
  )
}

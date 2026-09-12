import type { Metadata } from 'next'
import { getTudHomeConfig } from '@/lib/api/public'
import { mergeTudConfig } from './default-config'
import { TudFooter, TudHeader } from './_components/TudChrome'
import KhongTimThay from './_components/KhongTimThay'

export const metadata: Metadata = {
  title: { absolute: 'Trang không khả dụng | TopỨngDụng' },
  robots: { index: false, follow: false },
}

/**
 * Trang 404 cho toàn bộ phần công khai.
 *
 * Nằm trong (home) nên nhận đủ header, footer và bộ CSS `.tud`; mọi lời gọi
 * notFound() ở các trang con đều rơi về đây. Phần đếm ngược là client
 * component vì cần đọc đường dẫn hiện tại trong trình duyệt.
 */
export default async function NotFound() {
  const cfgRes = await getTudHomeConfig().catch(() => ({ data: null }))
  const config = mergeTudConfig(cfgRes.data)
  return (
    <div>
      <TudHeader config={config.header} />
      <main>
        <section className="section">
          <div className="wrap">
            <KhongTimThay />
          </div>
        </section>
      </main>
      <TudFooter header={config.header} footer={config.footer} />
    </div>
  )
}

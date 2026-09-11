import Script from 'next/script'
import { getTrackingConfig } from '@/lib/api/public'

/**
 * Nhúng Google Analytics 4 và Google Tag Manager theo mã lưu trong admin.
 *
 * Đặt ở layout của (home) và (public), KHÔNG đặt ở layout gốc — để trang
 * quản trị không bị đếm vào lượt xem và không tải script của bên thứ ba.
 *
 * Mã được kiểm bằng biểu thức chính quy chặt trước khi chèn vào thẻ script:
 * chuỗi từ CSDL đi thẳng vào mã chạy ở trình duyệt, nên một mã "GTM-XXXX'
 * </script><script>..." dán nhầm (hay cố ý) phải bị chặn ở đây chứ không
 * chỉ ở biểu mẫu admin.
 */
const MA_GA = /^G-[A-Z0-9]{4,20}$/
const MA_GTM = /^GTM-[A-Z0-9]{4,12}$/

function sach(gia: string | undefined, mau: RegExp): string {
  const v = (gia ?? '').trim()
  return mau.test(v) ? v : ''
}

export default async function TrackingScripts() {
  const cfg = await getTrackingConfig()
    .then((r) => r.data)
    .catch(() => null)

  // Mã trong CSDL đi trước; biến môi trường chỉ là đường lui cho bản dựng cũ.
  const gaId = sach(cfg?.gaId || process.env.NEXT_PUBLIC_GA_ID, MA_GA)
  const gtmId = sach(cfg?.gtmId, MA_GTM)

  if (!gaId && !gtmId) return null

  return (
    <>
      {gtmId && (
        <>
          <Script id="gtm-init" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
              title="Google Tag Manager"
            />
          </noscript>
        </>
      )}

      {gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
          </Script>
        </>
      )}
    </>
  )
}

/** Dùng chung cho generateMetadata ở layout gốc. */
export async function layMaXacMinhGoogle(): Promise<string | undefined> {
  const cfg = await getTrackingConfig()
    .then((r) => r.data)
    .catch(() => null)
  const v = (cfg?.googleSiteVerification ?? '').trim()
  // Search Console cấp chuỗi base64url, không bao giờ có dấu nháy hay ngoặc.
  return /^[A-Za-z0-9_-]{10,120}$/.test(v) ? v : undefined
}

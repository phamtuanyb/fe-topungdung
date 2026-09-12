'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'

/** Sau chừng này giây thì tự đưa người đọc lên thư mục cha. */
const DEM_NGUOC = 30

/**
 * Thân trang 404.
 *
 * Người rơi vào đây thường vì một liên kết cũ hoặc gõ thiếu một tầng đường
 * dẫn. Thư mục cha của đường dẫn hiện tại gần như luôn tồn tại và là chỗ họ
 * muốn tới nhất — nên đếm ngược rồi tự chuyển lên đó, kèm nút để đi ngay hoặc
 * về trang chủ. Đếm ngược dừng khi người đọc rê chuột/chạm vào khung, vì họ
 * đang đọc thì đừng kéo họ đi.
 */
export default function KhongTimThay() {
  const pathname = usePathname() || '/'
  const [conLai, setConLai] = useState(DEM_NGUOC)
  const [dung, setDung] = useState(false)

  // /ungdung/lap-trinh → /ungdung ; /ungdung → / ; đường một tầng → /
  const cha = useMemo(() => {
    const phan = pathname.split('/').filter(Boolean)
    const goc = phan.length > 1 ? '/' + phan.slice(0, -1).join('/') : '/'
    // Vài tiền tố không có trang riêng: /app/<slug> là trang ứng dụng nhưng
    // /app trần thì 404, chuyển lên đó là rơi vào 404 lần nữa. Trỏ về trang
    // danh sách tương ứng thay vì thư mục cha theo nghĩa đen.
    const THAY: Record<string, string> = { '/app': '/ungdung', '/chuyen-muc': '/tin-tuc' }
    return THAY[goc] ?? goc
  }, [pathname])
  const tenCha = cha === '/' ? 'trang chủ' : cha

  useEffect(() => {
    if (dung) return
    if (conLai <= 0) {
      window.location.replace(cha)
      return
    }
    const t = setTimeout(() => setConLai((x) => x - 1), 1000)
    return () => clearTimeout(t)
  }, [conLai, dung, cha])

  return (
    <div
      className="ktt-box"
      onMouseEnter={() => setDung(true)}
      onTouchStart={() => setDung(true)}
    >
      <div className="ktt-ma" aria-hidden="true">404</div>
      <h1 className="ktt-tieu-de">Trang này không khả dụng</h1>
      <p className="ktt-mo-ta">
        Đường dẫn <code>{pathname}</code> không tồn tại, đã đổi địa chỉ, hoặc bài đã được gỡ.
      </p>

      <div className="ktt-nut">
        <a className="btn accent" href={cha}>
          Về {tenCha} →
        </a>
        {cha !== '/' && (
          <a className="btn" href="/">
            Về trang chủ
          </a>
        )}
        <a className="btn" href="/tim-kiem">
          Tìm kiếm
        </a>
      </div>

      <p className="ktt-dem" aria-live="polite">
        {dung ? (
          <>Đã dừng tự chuyển trang — bạn chọn lối đi ở trên.</>
        ) : (
          <>
            Tự chuyển về <b>{tenCha}</b> sau <b>{conLai}</b> giây. Rê chuột vào đây để dừng.
          </>
        )}
      </p>
    </div>
  )
}

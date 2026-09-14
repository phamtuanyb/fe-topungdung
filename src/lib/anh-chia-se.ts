/**
 * Ảnh xem trước mặc định khi chia sẻ link (og:image) cho mọi trang không có
 * ảnh bìa riêng: trang chủ, danh mục, prompt, giới thiệu, và bài app / tin
 * chưa có thumbnail. Tệp đặt ở public/images/og-mac-dinh.jpg (1200×630 JPG, ~150 KB).
 */
export const ANH_CHIA_SE_MAC_DINH = '/images/og-mac-dinh.jpg'

/** Ảnh chia sẻ cho một bài: ảnh bìa riêng nếu có, không thì ảnh mặc định. */
export function anhChiaSe(...ungVien: Array<string | null | undefined>): string[] {
  const co = ungVien.find((u) => typeof u === 'string' && u.trim())
  return [co ? co.trim() : ANH_CHIA_SE_MAC_DINH]
}

import type { Post } from '@/types'
import { searchPosts } from '@/lib/api/public'

/**
 * Tra tên công cụ ở dòng "Hợp với" về đúng bài ứng dụng trên site.
 *
 * Không lưu sẵn bảng ánh xạ tên → slug: kho ứng dụng còn đang lớn dần, bảng
 * chép tay sẽ lệch ngay lần thêm bài sau. Thay vào đó hỏi thẳng ô tìm kiếm rồi
 * lọc lại theo tên đã chuẩn hoá — có bài thì viên công cụ thành liên kết, không
 * có thì vẫn là viên chữ thường, chứ không dẫn người đọc vào trang trống.
 *
 * Tìm kiếm của backend khớp cả phần mô tả nên "Canva" trả về mọi bài có nhắc
 * tới Canva; vì vậy chỉ nhận bài mà TIÊU ĐỀ khớp, không nhận theo thứ tự trả về.
 */

/** Bỏ dấu, bỏ ký tự lạ: "DALL·E" và "Leonardo AI" cùng về dạng so được. */
function chuan(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
}

/** Bài prompt cũng nằm trong kết quả tìm kiếm — không tự dẫn về thư viện prompt. */
function laUngDung(p: Post): boolean {
  return !(p.category?.slug ?? '').startsWith('prompt')
}

/**
 * Trả về slug bài ứng dụng khớp tên, hoặc null.
 *
 * Ưu tiên khớp đúng cả tên; khớp theo tiền tố chỉ dùng khi không có bài nào
 * trùng khít, để "Leonardo" tìm ra "Leonardo AI" mà "Copilot" không vớ nhầm
 * một bài Copilot khác tên.
 */
export async function timUngDung(ten: string): Promise<string | null> {
  const khoa = chuan(ten)
  if (khoa.length < 2) return null

  const ds = await searchPosts(ten, 8)
    .then((r) => (r.data ?? []).filter(laUngDung))
    .catch(() => [] as Post[])

  const khop = ds.find((p) => chuan(p.title) === khoa)
  if (khop) return khop.slug

  const gan = ds.find((p) => chuan(p.title).startsWith(khoa))
  return gan ? gan.slug : null
}

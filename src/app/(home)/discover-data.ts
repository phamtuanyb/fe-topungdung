import type { Category, Post } from '@/types'

export interface DiscoverData {
  /**
   * Số ứng dụng theo slug danh mục.
   * Có cả slug cấp 3 (đếm trực tiếp) lẫn slug cấp 2 (đã cộng dồn từ các con).
   */
  counts: Record<string, number>
  /** Slug nhóm cấp 2 → tên các danh mục con, dùng cho dòng mô tả trên thẻ */
  subs: Record<string, string[]>
  /** Slug nhóm cấp 2 → tên nhóm lấy từ API, dùng làm nhãn mặc định trên thẻ */
  names: Record<string, string>
  /**
   * Slug danh mục bất kỳ → slug nhóm cấp 2 chứa nó (nhóm tự trỏ về chính nó).
   * Dùng để lọc và đếm theo nhóm, vì bài luôn gắn ở cấp 3.
   */
  groupOf: Record<string, string>
  /**
   * Slug danh mục → đường dẫn đầy đủ. Danh mục cấp 3 phải là
   * `/ungdung/<nhóm>/<con>`; dạng `/ungdung/<con>` trả về 404.
   */
  pathOf: Record<string, string>
}

/**
 * Bài viết luôn gắn vào danh mục CẤP 3 (vd `ai/chatbot`), trong khi thẻ khám phá
 * lại trỏ tới nhóm CẤP 2 (vd `ai`). Nếu chỉ đếm theo slug trực tiếp thì mọi thẻ
 * đều ra 0 — đó chính là lỗi khiến khối này trông như chưa có dữ liệu.
 * Hàm này cộng dồn số bài của các danh mục con lên nhóm cha.
 */
export function buildDiscoverData(categories: Category[], apps: Post[]): DiscoverData {
  const counts: Record<string, number> = {}
  const subs: Record<string, string[]> = {}
  const names: Record<string, string> = {}
  const groupOf: Record<string, string> = {}
  const pathOf: Record<string, string> = {}

  // Đếm trực tiếp theo danh mục mà bài đang gắn vào.
  for (const p of apps) {
    const slug = p.category?.slug
    if (slug) counts[slug] = (counts[slug] ?? 0) + 1
  }

  const root = categories.find((c) => c.slug === 'ung-dung')
  if (!root) return { counts, subs, names, groupOf, pathOf }

  for (const group of categories.filter((c) => c.parentId === root.id)) {
    const children = categories.filter((c) => c.parentId === group.id)

    // Cộng dồn: số gắn thẳng vào nhóm (thường là 0) + số của mọi danh mục con.
    counts[group.slug] =
      (counts[group.slug] ?? 0) + children.reduce((sum, ch) => sum + (counts[ch.slug] ?? 0), 0)

    subs[group.slug] = children.map((ch) => ch.name)
    names[group.slug] = group.name

    groupOf[group.slug] = group.slug
    pathOf[group.slug] = `/ungdung/${group.slug}`

    for (const ch of children) {
      groupOf[ch.slug] = group.slug
      pathOf[ch.slug] = `/ungdung/${group.slug}/${ch.slug}`
    }
  }

  return { counts, subs, names, groupOf, pathOf }
}

/**
 * Dòng mô tả gọn cho thẻ: ghép tên vài danh mục con đầu tiên.
 * Viết thường từ thứ hai trở đi để câu đọc liền mạch như một danh sách.
 */
export function blurbFrom(subNames: string[] | undefined, max = 5): string {
  if (!subNames?.length) return ''
  return subNames
    .slice(0, max)
    .map((s, i) => (i === 0 ? s : s.charAt(0).toLowerCase() + s.slice(1)))
    .join(', ')
}

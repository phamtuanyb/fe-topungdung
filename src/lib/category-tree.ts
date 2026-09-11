import type { Category } from '@/types'

/**
 * Gom id của một danh mục và TOÀN BỘ nhánh bên dưới, không giới hạn số cấp.
 *
 * Cần thiết vì cây danh mục đã sâu 3 cấp: ung-dung › ai › tao-anh.
 * Nếu chỉ so `parentId === root.id` thì app nằm ở cấp 3 sẽ không được nhận ra
 * là ứng dụng — trang /app/<slug> trả 404 và sitemap sinh URL sai.
 */
export function collectCategoryIds(categories: Category[], rootSlug: string): Set<number> {
  const root = categories.find((c) => c.slug === rootSlug)
  if (!root) return new Set()

  const ids = new Set<number>([root.id])
  const queue = [root.id]
  while (queue.length) {
    const current = queue.shift() as number
    for (const c of categories) {
      if (c.parentId === current && !ids.has(c.id)) {
        ids.add(c.id)
        queue.push(c.id)
      }
    }
  }
  return ids
}

/** Danh mục này có nằm trong nhánh `rootSlug` không (kể cả chính nó). */
export function isInTree(
  categories: Category[],
  categoryId: number | null | undefined,
  rootSlug: string,
): boolean {
  if (categoryId == null) return false
  return collectCategoryIds(categories, rootSlug).has(categoryId)
}

/** Đường dẫn từ gốc `ung-dung` xuống danh mục, dùng dựng URL nhiều cấp. */
export function pathToCategory(categories: Category[], cat: Category): Category[] {
  const chain: Category[] = []
  let cur: Category | undefined = cat
  const guard = new Set<number>()
  while (cur && cur.slug !== 'ung-dung' && !guard.has(cur.id)) {
    guard.add(cur.id)
    chain.unshift(cur)
    cur = categories.find((c) => c.id === cur?.parentId)
  }
  return chain
}

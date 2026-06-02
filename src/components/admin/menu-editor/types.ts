import type { MenuItem, MenuItemType } from '@/types'

// ── Re-export types used widely across menu-editor ────────────────────────
export type { MenuItem, MenuItemType }

/** MenuItem kèm depth (dùng khi render danh sách phẳng) */
export type FlatNode = MenuItem & { depth: number }

export const TYPE_LABELS: Record<MenuItemType, string> = {
  custom: 'Liên kết tùy chỉnh',
  category: 'Danh mục',
  post: 'Bài viết',
  page: 'Trang',
}

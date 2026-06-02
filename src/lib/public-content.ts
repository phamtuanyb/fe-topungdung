import type { Category, Post } from '@/types'

export function getEmojiForPost(slug: string, title: string): string {
  const s = (slug + ' ' + title).toLowerCase()
  if (s.includes('pos') || s.includes('ban-hang') || s.includes('bán hàng')) return '🛒'
  if (s.includes('crm') || s.includes('sme') || s.includes('khach-hang') || s.includes('khách hàng')) return '👥'
  if (s.includes('kho') || s.includes('wms') || s.includes('quan-ly-kho')) return '📦'
  if (s.includes('app') || s.includes('mobile') || s.includes('zalo')) return '📱'
  if (s.includes('ai') || s.includes('automation') || s.includes('tu-dong')) return '🤖'
  if (s.includes('spa') || s.includes('tham-my') || s.includes('làm đẹp')) return '💆'
  if (s.includes('nha-khoa') || s.includes('clin') || s.includes('phong-kham')) return '🦷'
  if (s.includes('nha-hang') || s.includes('fb') || s.includes('am-thuc')) return '🍜'
  if (s.includes('gym') || s.includes('fitness') || s.includes('yoga')) return '💪'
  if (s.includes('dao-tao') || s.includes('hoc') || s.includes('trung-tam')) return '🎓'
  if (s.includes('thiet-ke') || s.includes('design') || s.includes('figma')) return '🎨'
  if (s.includes('web') || s.includes('landing') || s.includes('internet')) return '🌐'
  if (s.includes('xe') || s.includes('goi-xe') || s.includes('taxi')) return '🚗'
  if (s.includes('dat-lich') || s.includes('booking') || s.includes('lich-hen')) return '📅'
  if (s.includes('tich-hop') || s.includes('system') || s.includes('lien-ket')) return '🔗'
  if (s.includes('marketing') || s.includes('quang-cao')) return '📣'
  if (s.includes('sales') || s.includes('ban-hang')) return '🤝'
  if (s.includes('cskh') || s.includes('support')) return '💬'
  if (s.includes('ke-toan') || s.includes('cash') || s.includes('dong-tien')) return '💳'
  if (s.includes('nhan-su') || s.includes('hr') || s.includes('kpi')) return '👥'
  if (s.includes('bao-cao') || s.includes('ceo') || s.includes('dashboard')) return '📊'
  return '📄'
}

export function getPostsForCategoryTree(
  rootSlug: string,
  categories: Category[],
  posts: Post[]
): Post[] {
  const root = categories.find((c) => c.slug === rootSlug)
  if (!root) return []

  const childIds = categories.filter((c) => c.parentId === root.id).map((c) => c.id)
  const validCategoryIds = new Set([root.id, ...childIds])

  return posts.filter((post) => {
    const categoryId = post.category?.id ?? post.categoryId
    return categoryId != null && validCategoryIds.has(categoryId)
  })
}

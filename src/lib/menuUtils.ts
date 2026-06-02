import type { MenuItem } from '@/types'

/** Gom danh sách phẳng hoặc cây thành cây theo parentId */
export function buildMenuTree(items: MenuItem[]): MenuItem[] {
  if (!items.length) return []
  const hasNested = items.some((i) => i.children && i.children.length > 0)
  if (hasNested) {
    return sortMenuNodes([...items])
  }

  const map = new Map<number, MenuItem>()
  const roots: MenuItem[] = []

  for (const item of items) {
    map.set(item.id, { ...item, children: [] })
  }

  for (const item of items) {
    const node = map.get(item.id)!
    if (item.parentId != null && map.has(item.parentId)) {
      map.get(item.parentId)!.children!.push(node)
    } else {
      roots.push(node)
    }
  }

  return sortMenuNodes(roots)
}

function sortMenuNodes(nodes: MenuItem[]): MenuItem[] {
  nodes.sort((a, b) => a.order - b.order)
  for (const node of nodes) {
    if (node.children?.length) sortMenuNodes(node.children)
  }
  return nodes
}

/** Duyệt cây thành danh sách phẳng kèm độ sâu (hiển thị UI) */
export function flattenMenuTree(items: MenuItem[], depth = 0): Array<MenuItem> {
  const result: Array<MenuItem> = []
  const sorted = [...items].sort((a, b) => a.order - b.order)

  for (const item of sorted) {
    result.push({ ...item, depth })
    if (item.children?.length) {
      result.push(...flattenMenuTree(item.children, depth + 1))
    }
  }

  return result
}

/** Thu thập mọi item (phẳng) để gửi reorder */
export function collectMenuItemsFlat(items: MenuItem[]): MenuItem[] {
  return flattenMenuTree(buildMenuTree(items)).map((item) => item)
}

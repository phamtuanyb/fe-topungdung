import type { Category } from '@/types'

export type FlatRowData = {
  cat: Category
  depth: number
  hasChildren: boolean
  isHidden: boolean
}

export function flattenTreeCategories(nodes: Category[], collapsedIds: Set<number>, depth = 0, isParentCollapsed = false): FlatRowData[] {
  return nodes.flatMap(node => {
    const hasChildren = (node.children?.length ?? 0) > 0
    const isCollapsed = collapsedIds.has(node.id)
    const currentHidden = isParentCollapsed

    return [
      { cat: node, depth, hasChildren, isHidden: currentHidden },
      ...(hasChildren
        ? flattenTreeCategories(node.children ?? [], collapsedIds, depth + 1, isParentCollapsed || isCollapsed)
        : []),
    ]
  })
}

export function flattenForSelect(items: Category[], excludeIds: Set<number> = new Set()): { cat: Category; depth: number }[] {
  const map = new Map<number | null, Category[]>()

  for (const item of items) {
    const key = item.parentId ?? null
    const group = map.get(key) ?? []
    group.push(item)
    map.set(key, group)
  }

  const result: { cat: Category; depth: number }[] = []

  function walk(parentId: number | null, depth: number) {
    for (const node of map.get(parentId) ?? []) {
      if (excludeIds.has(node.id)) continue
      result.push({ cat: node, depth })
      walk(node.id, depth + 1)
    }
  }

  walk(null, 0)
  return result
}
export function getAllDescendantIds(node: Category | undefined): number[] {
  if (!node || !node.children) return []
  return node.children.flatMap(child => [
    child.id,
    ...getAllDescendantIds(child),
  ])
}
'use client'

import { useMemo, useState } from 'react'
import { buildMenuTree, flattenMenuTree } from '@/lib/menuUtils'
import type { MenuItem } from '@/types'
import type { FlatNode } from '../types'

/**
 * Quản lý cấu trúc cây menu:
 * - flat: danh sách phẳng với depth (dùng cho logic)
 * - visibleRows: danh sách phẳng tôn trọng collapsed state (dùng cho render)
 * - childrenIds: set các id có children
 * - collapsedIds / toggleCollapse / collapseAll / expandAll
 */
export function useMenuTree(items: MenuItem[]) {
  const [collapsedIds, setCollapsedIds] = useState<Set<number>>(new Set())

  /** Toàn bộ nodes phẳng (có depth), kể cả collapsed */
  const flat = useMemo<FlatNode[]>(() => {
    return flattenMenuTree(buildMenuTree(items))
  }, [items])

  /** Set id của nodes có ít nhất 1 child */
  const childrenIds = useMemo<Set<number>>(() => {
    const s = new Set<number>()
    for (const i of flat) {
      if (i.parentId != null) s.add(i.parentId)
    }
    return s
  }, [flat])

  /** Danh sách rows hiển thị (ẩn nhánh con của collapsed nodes) */
  const visibleRows = useMemo<FlatNode[]>(() => {
    const tree = buildMenuTree(items)
    const result: FlatNode[] = []

    function walk(nodes: MenuItem[], depth: number) {
      for (const node of nodes) {
        result.push({ ...node, depth })
        if (collapsedIds.has(node.id)) continue
        if (node.children?.length) walk(node.children, depth + 1)
      }
    }

    walk(tree, 0)
    return result
  }, [items, collapsedIds])

  function hasChildren(id: number) { return childrenIds.has(id) }

  function toggleCollapse(id: number) {
    setCollapsedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
  }

  function collapseAll() {
    setCollapsedIds(new Set(Array.from(childrenIds)))
  }

  function expandAll() { setCollapsedIds(new Set()) }

  return {
    flat,
    visibleRows,
    childrenIds,
    hasChildren,
    collapsedIds,
    toggleCollapse,
    collapseAll,
    expandAll,
    anyCollapsed: collapsedIds.size > 0,
    anyExpandable: childrenIds.size > 0,
  }
}

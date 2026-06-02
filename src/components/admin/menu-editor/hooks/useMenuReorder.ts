'use client'

import { useState } from 'react'
import { adminReorderMenuItems } from '@/lib/api/admin'
import { getErrorMessage } from '@/lib/error'
import { collectMenuItemsFlat } from '@/lib/menuUtils'
import type { MenuItem } from '@/types'
import type { FlatNode } from '../types'

interface UseMenuReorderOptions {
  menuId: number
  items: MenuItem[]
  flat: FlatNode[]
  onUpdated: () => void
  onToast: (msg: string, type: 'success' | 'error') => void
}

/**
 * Hook xử lý sắp xếp thứ tự bằng nút lên / xuống.
 * Chỉ cho phép đổi chỗ trong cùng cấp (cùng parentId).
 */
export function useMenuReorder({
  menuId, items, flat, onUpdated, onToast,
}: UseMenuReorderOptions) {
  const [reordering, setReordering] = useState(false)

  async function moveItem(item: FlatNode, direction: 'up' | 'down') {
    const siblings = flat
      .filter((i) => (i.parentId ?? null) === (item.parentId ?? null))
      .sort((a, b) => a.order - b.order)

    const idx = siblings.findIndex((s) => s.id === item.id)
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= siblings.length) return

    const reordered = [...siblings]
    const [moved] = reordered.splice(idx, 1)
    reordered.splice(swapIdx, 0, moved)

    const orderMap = new Map(reordered.map((s, i) => [s.id, i]))
    const allFlat = collectMenuItemsFlat(items)
    const payload = allFlat.map((i) => ({
      id: i.id,
      parentId: i.parentId ?? null,
      order: orderMap.has(i.id) ? orderMap.get(i.id)! : i.order,
    }))

    setReordering(true)
    try {
      await adminReorderMenuItems(menuId, payload)
      onUpdated()
    } catch (err) {
      onToast(getErrorMessage(err) || 'Sắp xếp thất bại', 'error')
    } finally {
      setReordering(false)
    }
  }

  /**
   * Tính toán và gọi API reorder để đưa `targetItemId` vào vị trí cụ thể.
   * - Nếu targetIndex = null, không làm gì.
   * - Giả định items hiện tại đã bao gồm item này (ở vị trí tuỳ ý).
   */
  async function reorderToTarget(targetItemId: number, targetIndex: number | null, parentId: string | null) {
    if (targetIndex === null) return

    const pid = parentId === '' ? null : Number(parentId)
    const allFlat = collectMenuItemsFlat(items)

    // Nếu item chưa có trong items (ví dụ vừa create), ta thêm stub vào cuối danh sách
    let isNew = false
    if (!allFlat.some(i => i.id === targetItemId)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      allFlat.push({ id: targetItemId, parentId: pid, order: 9999 } as any)
      isNew = true
    }

    const siblings = allFlat
      .filter((i) => (i.parentId ?? null) === pid)
      .sort((a, b) => a.order - b.order)

    // Xoá item khỏi vị trí cũ trong siblings
    const withoutTarget = siblings.filter((s) => s.id !== targetItemId)

    // Chèn item vào vị trí mới
    const clampedIdx = Math.min(targetIndex, withoutTarget.length)
    const targetItem = siblings.find(s => s.id === targetItemId)!
    withoutTarget.splice(clampedIdx, 0, { ...targetItem, parentId: pid })

    const orderMap = new Map(withoutTarget.map((s, i) => [s.id, i]))

    const payload = allFlat.map((i) => ({
      id: i.id,
      parentId: i.id === targetItemId ? pid : (i.parentId ?? null),
      order: orderMap.has(i.id) ? orderMap.get(i.id)! : i.order,
    }))

    setReordering(true)
    try {
      await adminReorderMenuItems(menuId, payload)
      if (!isNew) onUpdated() // Nếu isNew, caller (useMenuItemCrud) sẽ gọi onUpdated
    } catch (err) {
      onToast(getErrorMessage(err) || 'Cập nhật thứ tự thất bại', 'error')
    } finally {
      setReordering(false)
    }
  }

  return { moveItem, reorderToTarget, reordering }
}

'use client'

import { useState } from 'react'
import {
  adminAddMenuItem,
  adminUpdateMenuItem,
} from '@/lib/api/admin'
import { getErrorMessage } from '@/lib/error'
import {
  emptyMenuItemFormValues,
  type MenuItemFormValues,
} from '@/lib/menuItemForm'
import type { MenuItem, CreateMenuItemPayload } from '@/types'
import type { FlatNode } from '../types'

interface UseCrudOptions {
  menuId: number
  flat: FlatNode[]
  onUpdated: () => void
  onToast: (msg: string, type: 'success' | 'error') => void
  reorderToTarget: (targetItemId: number, targetIndex: number | null, parentId: string | null) => Promise<void>
}

const itemToFormValues = (item: MenuItem, parentId: string, position: string): MenuItemFormValues => ({
  label: item.label,
  type: item.type,
  url: item.url || '',
  targetId: item.targetId ?? null,
  parentId,
  position,
})

export function useMenuItemCrud({ menuId, flat, onUpdated, onToast, reorderToTarget }: UseCrudOptions) {
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingOriginalItem, setEditingOriginalItem] = useState<MenuItem | null>(null)
  const [formDefaults, setFormDefaults] = useState<MenuItemFormValues>(emptyMenuItemFormValues)
  const [saving, setSaving] = useState(false)

  function positionOptions(parentId: string, excludeId?: number) {
    const pid = parentId === '' ? null : Number(parentId)
    const siblings = flat.filter((i) => (i.parentId ?? null) === pid && i.id !== excludeId)
    return [
      { value: 'first', label: '— Đầu tiên' },
      ...siblings.map((s) => ({ value: `after:${s.id}`, label: `Sau: ${s.label}` })),
      { value: 'last', label: '— Cuối cùng' },
    ]
  }

  function resolveTargetIndex(position: string, parentId: string, excludeId?: number): number | null {
    const pid = parentId === '' ? null : Number(parentId)
    const siblings = flat
      .filter((i) => (i.parentId ?? null) === pid && i.id !== excludeId)
      .sort((a, b) => a.order - b.order)

    if (position === 'last') return null
    if (position === 'first') return 0
    if (position.startsWith('after:')) {
      const afterId = Number(position.slice(6))
      const idx = siblings.findIndex((s) => s.id === afterId)
      return idx >= 0 ? idx + 1 : null
    }
    return null
  }

  function openCreate(parentId?: number) {
    setEditingId(null)
    setEditingOriginalItem(null)
    setFormDefaults({
      ...emptyMenuItemFormValues(),
      parentId: parentId != null ? String(parentId) : '',
      position: 'last',
    })
    setFormOpen(true)
  }

  function openEdit(item: MenuItem) {
    setEditingId(item.id)
    setEditingOriginalItem(item)
    const pid = item.parentId != null ? String(item.parentId) : ''
    const siblings = flat
      .filter((i) => (i.parentId ?? null) === (item.parentId ?? null) && i.id !== item.id)
      .sort((a, b) => a.order - b.order)
    const prevSibling = siblings.filter((s) => s.order < item.order).at(-1)
    const position = prevSibling ? `after:${prevSibling.id}` : 'first'
    setFormDefaults(itemToFormValues(item, pid, position))
    setFormOpen(true)
  }

  function buildPayload(values: MenuItemFormValues, order?: number): CreateMenuItemPayload {
    const parentId = values.parentId ? Number(values.parentId) : null
    const url = values.url.trim()
    const base = {
      label: values.label.trim(),
      type: values.type,
      parentId,
      ...(order !== undefined ? { order } : {}),
      url: url || undefined,
    }
    if (values.type === 'custom') return { ...base, url: url || '/' }
    return { ...base, targetId: values.targetId ?? null }
  }

  function hasDataChanged(values: MenuItemFormValues, original: MenuItem): boolean {
    const parentId = values.parentId ? Number(values.parentId) : null

    return values.label.trim() !== original.label
      || values.type !== original.type
      || values.parentId !== (original.parentId ? String(original.parentId) : '')
      || parentId !== (original.parentId ?? null)
      || (values.type === 'custom' && (values.url.trim() || '/') !== (original.url || '/'))
      || values.targetId !== (original.targetId ?? null)
  }

  async function handleSaveItem(values: MenuItemFormValues) {
    setSaving(true)
    try {
      if (editingId) {
        let didUpdateData = false
        // Nếu đã load original data, kiểm tra xem có thay đổi không
        if (!editingOriginalItem || hasDataChanged(values, editingOriginalItem)) {
          const payload = buildPayload(values)
          await adminUpdateMenuItem(menuId, editingId, payload)
          didUpdateData = true
        }

        // Tính xem cần gọi reorder không (nếu position đổi)
        // Lưu ý resolveTargetIndex tính dựa trên flat hiện tại
        const targetIdx = resolveTargetIndex(values.position, values.parentId, editingId)

        let didReorder = false
        if (targetIdx !== editingOriginalItem?.order) {
          // Luôn gọi reorderToTarget, hook kia sẽ lo việc tạo payload
          await reorderToTarget(editingId, targetIdx !== null ? targetIdx : 9999, values.parentId)
          didReorder = true
        }

        if (didUpdateData || didReorder) {
          onToast('Đã cập nhật mục menu', 'success')
          onUpdated()
        }
      } else {
        // ── CREATE ──
        const pid = values.parentId === '' ? null : Number(values.parentId)
        const siblingsCount = flat.filter((i) => (i.parentId ?? null) === pid).length

        const payload = buildPayload(values, siblingsCount)
        const res = await adminAddMenuItem(menuId, payload)
        const savedItemId = res.data.id

        // Gọi reorder nếu vị trí mong muốn không phải cuối cùng
        const targetIdx = resolveTargetIndex(values.position, values.parentId)
        if (targetIdx !== null) {
          await reorderToTarget(savedItemId, targetIdx, values.parentId)
        }

        onToast('Đã thêm mục menu', 'success')
        onUpdated()
      }

      setFormOpen(false)
    } catch (err) {
      onToast(getErrorMessage(err) || 'Lưu thất bại', 'error')
    } finally {
      setSaving(false)
    }
  }

  return {
    formOpen,
    setFormOpen,
    editingId,
    formDefaults,
    saving,
    openCreate,
    openEdit,
    handleSaveItem,
    positionOptions,
  }
}

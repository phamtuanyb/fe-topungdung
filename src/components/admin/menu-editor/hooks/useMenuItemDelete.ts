'use client'

import { useState } from 'react'
import { adminDeleteMenuItem } from '@/lib/api/admin'
import { getErrorMessage } from '@/lib/error'

interface UseMenuItemDeleteOptions {
  menuId: number
  onUpdated: () => void
  onToast: (msg: string, type: 'success' | 'error') => void
}

export function useMenuItemDelete({ menuId, onUpdated, onToast }: UseMenuItemDeleteOptions) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete(id: number) {
    setDeleting(true)
    try {
      await adminDeleteMenuItem(menuId, id)
      onToast('Đã xóa mục menu', 'success')
      onUpdated()
    } catch (err) {
      onToast(getErrorMessage(err) || 'Xóa thất bại', 'error')
    } finally {
      setDeleting(false)
      setConfirmDeleteId(null)
    }
  }

  return {
    confirmDeleteId,
    setConfirmDeleteId,
    deleting,
    handleDelete,
  }
}

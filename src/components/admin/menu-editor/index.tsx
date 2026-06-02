'use client'

import { useState } from 'react'
import type { MenuItem } from '@/types'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Toast from '@/components/ui/Toast'
import EmptyState from '@/components/ui/EmptyState'

import { useMenuTree } from './hooks/useMenuTree'
import { useMenuItemCrud } from './hooks/useMenuItemCrud'
import { useMenuReorder } from './hooks/useMenuReorder'
import { useMenuItemDelete } from './hooks/useMenuItemDelete'
import { MenuItemRow } from './MenuItemRow'
import { MenuItemFormModal } from './MenuItemFormModal'

interface MenuItemsEditorProps {
  menuId: number
  items: MenuItem[]
  onUpdated: () => void
}

export default function MenuItemsEditor({ menuId, items, onUpdated }: MenuItemsEditorProps) {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  function showToast(msg: string, type: 'success' | 'error') { setToast({ message: msg, type }) }

  // ── Tree / collapse ────────────────────────────────────────────────
  const {
    flat, visibleRows, hasChildren, collapsedIds,
    toggleCollapse, collapseAll, expandAll,
    anyCollapsed, anyExpandable,
  } = useMenuTree(items)

  // ── Reorder ────────────────────────────────────────────────────────
  const { moveItem, reorderToTarget, reordering } = useMenuReorder({ menuId, items, flat, onUpdated, onToast: showToast })

  // ── CRUD ──────────────────────────────────────────────────────────
  const crud = useMenuItemCrud({ menuId, flat, onUpdated, onToast: showToast, reorderToTarget })

  // ── Delete ─────────────────────────────────────────────────────────
  const { confirmDeleteId, setConfirmDeleteId, deleting, handleDelete } = useMenuItemDelete({ menuId, onUpdated, onToast: showToast })

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Delete confirm modal */}
      <Modal
        open={confirmDeleteId !== null}
        title="Xóa mục menu"
        description="Xóa mục này sẽ xóa cả các mục con bên trong. Tiếp tục?"
        confirmText="Xóa"
        confirmVariant="danger"
        loading={deleting}
        onConfirm={() => confirmDeleteId !== null && handleDelete(confirmDeleteId)}
        onClose={() => setConfirmDeleteId(null)}
      />

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <div className="flex items-center gap-3">
          <p className="text-sm text-slate-500">
            {flat.length > 0 ? `${flat.length} mục trong menu` : 'Chưa có mục nào'}
          </p>
          {anyExpandable && (
            <button
              type="button"
              onClick={anyCollapsed ? expandAll : collapseAll}
              className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                {anyCollapsed
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" />
                }
              </svg>
              {anyCollapsed ? 'Mở rộng tất cả' : 'Thu gọn tất cả'}
            </button>
          )}
        </div>
        <Button type="button" size="sm" onClick={() => crud.openCreate()}>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Thêm mục
        </Button>
      </div>

      {/* ── Empty state ─────────────────────────────────────────────── */}
      {flat.length === 0 ? (
        <EmptyState
          title="Chưa có mục menu"
          description="Thêm liên kết tùy chỉnh, danh mục hoặc bài viết vào menu này."
          action={<Button size="sm" onClick={() => crud.openCreate()}>Thêm mục đầu tiên</Button>}
          className="py-12"
        />
      ) : (
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <ul>
            {visibleRows.map((item, idx) => {
              // Siblings cùng cấp trong visibleRows (để tính index lên/xuống)
              const siblings = visibleRows.filter(
                (r) => (r.parentId ?? null) === (item.parentId ?? null)
              )
              const siblingIndex = siblings.findIndex((s) => s.id === item.id)
              const siblingsCount = siblings.length

              return (
                <MenuItemRow
                  key={item.id}
                  item={item}
                  siblingIndex={siblingIndex}
                  siblingsCount={siblingsCount}
                  hasChildren={hasChildren(item.id)}
                  isCollapsed={collapsedIds.has(item.id)}
                  reordering={reordering}
                  isLast={idx === visibleRows.length - 1}
                  onToggleCollapse={toggleCollapse}
                  onMoveUp={() => moveItem(item, 'up')}
                  onMoveDown={() => moveItem(item, 'down')}
                  onAddChild={crud.openCreate}
                  onEdit={crud.openEdit}
                  onDelete={setConfirmDeleteId}
                />
              )
            })}
          </ul>
        </div>
      )}

      {/* ── Form Modal ──────────────────────────────────────────────── */}
      {crud.formOpen && (
        <MenuItemFormModal
          key={crud.editingId ?? 'new'}
          editingId={crud.editingId}
          defaultValues={crud.formDefaults}
          saving={crud.saving}
          parentOptions={flat.filter((i) => crud.editingId == null || i.id !== crud.editingId)}
          positionOptions={crud.positionOptions}
          onSave={crud.handleSaveItem}
          onClose={() => crud.setFormOpen(false)}
        />
      )}
    </div>
  )
}

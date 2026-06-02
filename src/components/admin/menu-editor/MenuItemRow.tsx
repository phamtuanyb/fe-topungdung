'use client'

import { sitePageMenuUrl, SITE_PAGES } from '@/lib/menuItemForm'
import type { FlatNode } from './types'
import { TYPE_LABELS } from './types'

interface MenuItemRowProps {
  item: FlatNode
  /** Vị trí trong danh sách siblings (để biết có thể lên/xuống không) */
  siblingIndex: number
  siblingsCount: number
  hasChildren: boolean
  isCollapsed: boolean
  reordering: boolean
  isLast: boolean
  onToggleCollapse: (id: number) => void
  onMoveUp: () => void
  onMoveDown: () => void
  onAddChild: (id: number) => void
  onEdit: (item: FlatNode) => void
  onDelete: (id: number) => void
}

export function MenuItemRow({
  item,
  siblingIndex,
  siblingsCount,
  hasChildren,
  isCollapsed,
  reordering,
  isLast,
  onToggleCollapse,
  onMoveUp,
  onMoveDown,
  onAddChild,
  onEdit,
  onDelete,
}: MenuItemRowProps) {
  function itemMeta() {
    if (item.url) return item.url
    if (item.type === 'page' && item.targetId != null) {
      const page = SITE_PAGES.find((p) => p.id === item.targetId)
      return page ? page.path : sitePageMenuUrl(item.targetId) || '—'
    }
    if (item.targetId != null) return `${TYPE_LABELS[item.type]} #${item.targetId}`
    return TYPE_LABELS[item.type]
  }

  const canMoveUp   = siblingIndex > 0
  const canMoveDown = siblingIndex < siblingsCount - 1

  return (
    <li
      className={[
        'flex items-center gap-2 py-3 pr-3',
        'transition-colors duration-100',
        isLast ? '' : 'border-b border-slate-100',
        'hover:bg-slate-50',
      ].filter(Boolean).join(' ')}
      style={{ paddingLeft: `${4 + item.depth * 24}px` }}
    >
      {/* ── Indent connector ────────────────────────────────────────── */}
      {item.depth > 0 && (
        <span className="text-slate-300 shrink-0 text-xs" aria-hidden>└</span>
      )}

      {/* ── Collapse toggle ─────────────────────────────────────────── */}
      {hasChildren ? (
        <button
          type="button"
          onClick={() => onToggleCollapse(item.id)}
          className="shrink-0 w-5 h-5 flex items-center justify-center rounded hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors"
          title={isCollapsed ? 'Mở rộng' : 'Thu gọn'}
        >
          <svg
            className={`h-3 w-3 transition-transform duration-200 ${isCollapsed ? '-rotate-90' : ''}`}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      ) : (
        <span className="w-5 shrink-0" />
      )}

      {/* ── Label & meta ────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-slate-800 truncate flex items-center gap-1.5">
          {item.label}
          {hasChildren && isCollapsed && (
            <span className="text-[10px] font-medium bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded shrink-0">
              đã thu gọn
            </span>
          )}
        </p>
        <p className="text-xs text-slate-500 truncate mt-0.5 flex items-center gap-1.5 flex-wrap">
          <span className="badge badge-gray">{TYPE_LABELS[item.type]}</span>
          <span>{itemMeta()}</span>
        </p>
      </div>

      {/* ── Move up / down ──────────────────────────────────────────── */}
      <div className="flex flex-col gap-0.5 shrink-0">
        <button
          type="button"
          disabled={reordering || !canMoveUp}
          onClick={onMoveUp}
          className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-25 disabled:pointer-events-none transition-colors"
          title="Lên"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
        </button>
        <button
          type="button"
          disabled={reordering || !canMoveDown}
          onClick={onMoveDown}
          className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-25 disabled:pointer-events-none transition-colors"
          title="Xuống"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      </div>

      {/* ── Actions ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-0.5 shrink-0">
        <button
          type="button"
          onClick={() => onAddChild(item.id)}
          className="rounded-lg px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          title="Thêm mục con"
        >
          + Con
        </button>
        <button
          type="button"
          onClick={() => onEdit(item)}
          className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
        >
          Sửa
        </button>
        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          Xóa
        </button>
      </div>
    </li>
  )
}

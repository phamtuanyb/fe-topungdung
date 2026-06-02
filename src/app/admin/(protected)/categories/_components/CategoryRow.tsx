'use client'

import Link from 'next/link'
import { FlatRowData } from '../_config'

interface CategoryRowProps {
  rowData: FlatRowData
  isCollapsed: boolean
  onToggle: (id: number) => void
  onDeleteClick: (id: number) => void
}

export default function CategoryRow({
  rowData,
  isCollapsed,
  onToggle,
  onDeleteClick,
}: CategoryRowProps) {
  const { cat, depth, hasChildren, isHidden } = rowData

  return (
    <tr
      className={`
        border-b border-slate-100 last:border-0 transition-all duration-200
        ${isHidden 
          ? 'hidden opacity-0 h-0 pointer-events-none overflow-hidden' 
          : 'table-row opacity-100 h-auto bg-white hover:bg-slate-50/60 animate-row-fade-in'}
      `}
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-1">
          {/* Đường dẫn phân cấp */}
          {depth > 0 && (
            <div style={{ width: depth * 24 }} className="shrink-0 flex justify-end ml-2 pr-2">
              <span className="text-slate-300 text-xs font-light select-none">└─</span>
            </div>
          )}

          {/* Nút Đóng / Mở */}
          {hasChildren ? (
            <button
              type="button"
              onClick={() => onToggle(cat.id)}
              className="shrink-0 flex items-center justify-center w-5 h-5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
            >
              <svg
                className={`h-3 w-3 transition-transform duration-200 ease-out ${isCollapsed ? '' : 'rotate-90'}`}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          ) : (
            <div className="w-5 shrink-0" />
          )}

          {/* Avatar chữ cái đầu & Tên danh mục */}
          <div className="flex items-center gap-3 ml-1">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-transform shadow-sm"
              style={{
                background: depth === 0 ? '#ede9fe' : depth === 1 ? '#e0f2fe' : '#fef9c3',
                color: depth === 0 ? '#6d28d9' : depth === 1 ? '#0369a1' : '#a16207',
              }}
            >
              {cat.name.trim().charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">{cat.name}</p>
              {cat.description && (
                <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{cat.description}</p>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* Các cột thông tin khác */}
      <td className="py-3 px-4">
        <code className="text-xs bg-slate-100 font-mono text-slate-600 px-1.5 py-0.5 rounded-md border border-slate-200/50">
          {cat.slug}
        </code>
      </td>
      <td className="py-3 px-4">
        {cat.parent?.name ? (
          <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
            {cat.parent.name}
          </span>
        ) : (
          <span className="text-slate-400 text-xs">—</span>
        )}
      </td>
      <td className="py-3 px-4">
        <span className="text-sm font-semibold text-slate-700">{cat.postCount ?? 0}</span>
        <span className="text-xs text-slate-400 ml-1">bài</span>
      </td>
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/admin/categories/${cat.id}/edit`}
            className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            Sửa
          </Link>
          <button
            onClick={() => onDeleteClick(cat.id)}
            className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            Xóa
          </button>
        </div>
      </td>
    </tr>
  )
}
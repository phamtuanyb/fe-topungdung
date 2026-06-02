import { useState, useMemo } from 'react'
import { SidePanel } from './SharedPanels'
import useSWR from 'swr'
import { adminGetCategories } from '@/lib/api/admin'
import { useController, useFormContext } from 'react-hook-form'
import { FormData } from './PostEditor'

type CategorySortMode = 'all' | 'mostUsed'

const PanelCategories = () => {
  const { control } = useFormContext<FormData>()
  const { field } = useController({ name: 'categoryId', control })

  const [categorySort, setCategorySort] = useState<CategorySortMode>('all')

  const { data: catsData } = useSWR('admin-categories', adminGetCategories, {
    keepPreviousData: true,
    revalidateOnFocus: false,
    revalidateIfStale: false,
  })

  const displayedCategories = useMemo(() => {
    const categories = catsData?.data ?? []

    if (categorySort === 'mostUsed') {
      return [...categories].sort((a, b) => (b.postCount ?? 0) - (a.postCount ?? 0))
        .map((cat) => ({ cat, depth: 0 }))
    }

    // Mode 'all': sort theo cây cha → con. Cha đứng trước, con thụt vào.
    const byId = new Map(categories.map((c) => [c.id, c]))
    const roots = categories.filter((c) => !c.parentId || !byId.has(c.parentId))
    const sortedRoots = [...roots].sort((a, b) => a.name.localeCompare(b.name, 'vi'))
    const out: { cat: typeof categories[number]; depth: number }[] = []
    const visit = (node: typeof categories[number], depth: number) => {
      out.push({ cat: node, depth })
      const children = categories
        .filter((c) => c.parentId === node.id)
        .sort((a, b) => a.name.localeCompare(b.name, 'vi'))
      children.forEach((c) => visit(c, depth + 1))
    }
    sortedRoots.forEach((r) => visit(r, 0))
    return out
  }, [catsData?.data, categorySort])

  const toggleCat = (id: number) => {
    field.onChange(field?.value === id ? null : id)
  }

  return (
    <SidePanel title="Danh mục">
      <div className="mt-1">
        <div className="flex items-center gap-1 mb-2">
          <button
            type="button"
            onClick={() => setCategorySort('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${categorySort === 'all'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
              }`}
          >
            Tất cả danh mục
          </button>
          <button
            type="button"
            onClick={() => setCategorySort('mostUsed')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${categorySort === 'mostUsed'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
              }`}
          >
            Thêm nhiều nhất
          </button>
        </div>
        <div className="max-h-44 overflow-y-auto space-y-1 border border-slate-200 rounded-xl bg-slate-50/50 p-2.5">
          {displayedCategories.length === 0 ? (
            <p className="text-[11px] text-slate-500">
              Chưa có danh mục.{' '}
              <a href="/admin/categories/create" className="text-indigo-600 hover:underline">
                Tạo danh mục
              </a>
            </p>
          ) : (
            displayedCategories.map(({ cat, depth }) => (
              <label key={cat.id} className="flex items-center gap-2 text-[12px] text-slate-800 cursor-pointer">
                <input
                  readOnly
                  type="checkbox"
                  checked={field?.value === cat.id}
                  onClick={() => toggleCat(cat.id)}
                  className="rounded-full border-slate-200 accent-indigo-600"
                />
                <span className="flex-1 min-w-0 truncate" style={{ paddingLeft: depth * 14 }}>
                  {depth > 0 && <span className="text-slate-400 mr-1">↳</span>}
                  {cat.name}
                </span>
                {categorySort === 'mostUsed' && cat.postCount != null && (
                  <span className="text-[10px] text-slate-400 shrink-0">{cat.postCount}</span>
                )}
              </label>
            ))
          )}
        </div>
      </div>
    </SidePanel>
  )
}

export default PanelCategories
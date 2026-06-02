import { useState } from 'react'
import Button from '@/components/ui/Button'
import { SidePanel } from './SharedPanels'

interface PanelTagsProps {
  tags: string[]
  setTags: React.Dispatch<React.SetStateAction<string[]>>
}

export default function PanelTags({ tags, setTags }: PanelTagsProps) {
  const [tagInput, setTagInput] = useState('')

  const addTagsFromInput = () => {
    const parts = tagInput.split(',').map((s) => s.trim().replace(/^#/, '')).filter(Boolean)
    if (parts.length === 0) return
    setTags((prev) => {
      const next = [...prev]
      for (const t of parts) {
        if (!next.includes(t)) next.push(t)
      }
      return next
    })
    setTagInput('')
  }

  return (
    <SidePanel title="Thẻ" defaultOpen={tags.length > 0}>
      <div className="mt-1 space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Thêm thẻ"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') { e.preventDefault(); addTagsFromInput() }
              if (e.key === ',') { e.preventDefault(); addTagsFromInput() }
            }}
            className="flex-1 border border-slate-200 rounded-xl text-sm px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-white"
          />
          <Button type="button" variant="secondary" size="sm" onClick={addTagsFromInput}>
            Thêm
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map(t => (
              <span key={t} className="badge badge-blue gap-1 pr-1">
                {t}
                <button
                  type="button"
                  onClick={() => setTags(prev => prev.filter(x => x !== t))}
                  className="text-indigo-400 hover:text-red-500 leading-none"
                  aria-label={`Xóa thẻ ${t}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        <p className="text-[11px] text-slate-500">
          Phân cách bằng dấu phẩy hoặc Enter.
        </p>
      </div>
    </SidePanel>
  )
}

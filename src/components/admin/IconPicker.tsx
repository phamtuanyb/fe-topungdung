'use client'

import { useMemo, useState } from 'react'
import * as Icons from 'lucide-react'
import { LucideIcon } from 'lucide-react'

// Curated set of icons useful for product / business pages (subset to keep picker fast).
// Add more as needed — Lucide has ~1000 total.
const ICON_LIST: string[] = [
  'Target', 'Zap', 'Building2', 'Wallet', 'Rocket', 'Sparkles', 'Award', 'TrendingUp',
  'Briefcase', 'Users', 'User', 'UserCheck', 'Handshake', 'HeartHandshake',
  'ShoppingCart', 'ShoppingBag', 'Store', 'CreditCard', 'Receipt', 'DollarSign', 'BadgePercent',
  'Package', 'PackageCheck', 'Warehouse', 'Truck', 'Boxes',
  'BarChart3', 'LineChart', 'PieChart', 'TrendingDown', 'Activity', 'Gauge',
  'MessageSquare', 'MessageCircle', 'Mail', 'Phone', 'PhoneCall', 'Bell', 'BellRing',
  'Smartphone', 'Tablet', 'Laptop', 'Monitor', 'Server', 'Database', 'Cloud', 'CloudUpload',
  'Bot', 'Cpu', 'Brain', 'Workflow', 'GitBranch', 'Network',
  'Calendar', 'CalendarCheck', 'Clock', 'AlarmClock', 'Timer',
  'Settings', 'Wrench', 'Hammer', 'Cog', 'SlidersHorizontal',
  'Shield', 'ShieldCheck', 'Lock', 'Key', 'KeyRound', 'Fingerprint',
  'FileText', 'FilePlus2', 'Folder', 'FolderOpen', 'Files', 'ClipboardList', 'ClipboardCheck',
  'CheckCircle2', 'CheckCheck', 'BadgeCheck', 'ThumbsUp', 'Star', 'Heart',
  'Lightbulb', 'Wand2', 'Palette', 'Layers', 'LayoutGrid', 'LayoutDashboard',
  'Globe', 'MapPin', 'Map', 'Navigation', 'Compass',
  'Home', 'Coffee', 'Utensils', 'Pizza', 'Soup',
  'Stethoscope', 'HeartPulse', 'Pill', 'Cross', 'Activity',
  'Dumbbell', 'Bike', 'Trophy', 'Medal',
  'BookOpen', 'GraduationCap', 'School',
  'Image', 'Camera', 'Video', 'Music', 'Mic',
  'Search', 'Filter', 'ArrowUpRight', 'Send',
]

interface IconPickerProps {
  value: string
  onChange: (name: string) => void
}

export default function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ICON_LIST
    return ICON_LIST.filter((n) => n.toLowerCase().includes(q))
  }, [query])

  const SelectedIcon = (value && (Icons as unknown as Record<string, LucideIcon>)[value]) || null

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 w-full"
      >
        {SelectedIcon ? (
          <SelectedIcon className="h-5 w-5 text-indigo-600" />
        ) : (
          <span className="h-5 w-5 inline-flex items-center justify-center text-slate-300 text-xs">?</span>
        )}
        <span className="truncate text-left flex-1">{value || 'Chọn icon...'}</span>
        <span className="text-slate-400 text-xs">▾</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-slate-100 px-5 py-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700">Chọn icon</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="p-4 border-b border-slate-100">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                placeholder="Tìm icon... (vd: chart, user, shop)"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="flex-1 overflow-auto p-4">
              <div className="grid grid-cols-8 sm:grid-cols-10 gap-2">
                {filtered.map((name) => {
                  const Ico = (Icons as unknown as Record<string, LucideIcon>)[name]
                  if (!Ico) return null
                  const selected = name === value
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => {
                        onChange(name)
                        setOpen(false)
                      }}
                      title={name}
                      className={`aspect-square flex items-center justify-center rounded-lg border transition-colors ${
                        selected
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <Ico className="h-5 w-5" />
                    </button>
                  )
                })}
                {filtered.length === 0 && (
                  <div className="col-span-full text-center text-sm text-slate-400 py-8">
                    Không có icon nào khớp.
                  </div>
                )}
              </div>
            </div>
            {value && (
              <div className="border-t border-slate-100 px-5 py-3 flex items-center justify-between bg-slate-50">
                <button
                  type="button"
                  onClick={() => {
                    onChange('')
                    setOpen(false)
                  }}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Xóa icon
                </button>
                <span className="text-xs text-slate-500">Đã chọn: <strong>{value}</strong></span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

// Helper component to render an icon by name in the public site.
export function DynamicIcon({ name, className }: { name?: string; className?: string }) {
  if (!name) return null
  const Ico = (Icons as unknown as Record<string, LucideIcon>)[name]
  if (!Ico) return null
  return <Ico className={className} />
}

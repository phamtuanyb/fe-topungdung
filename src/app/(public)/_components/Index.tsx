import type { PillColor, SidebarItem, KpiItem } from '../_configs/types'

// ─── WindowDots ──────────────────────────────────────────────────────────────

export function WindowDots() {
  return (
    <div className="flex gap-1.5">
      <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
      <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
      <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
    </div>
  )
}

// ─── CheckIcon ───────────────────────────────────────────────────────────────

export function CheckIcon() {
  return (
    <svg className="w-4 h-4 shrink-0 mt-0.5" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8l3.5 3.5L13 4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ─── PersonIcon ───────────────────────────────────────────────────────────────

export function PersonIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

// ─── Pill ─────────────────────────────────────────────────────────────────────

const PILL_COLORS: Record<PillColor, string> = {
  green: 'bg-emerald-100 text-emerald-800',
  orange: 'bg-orange-100 text-orange-800',
  blue: 'bg-blue-100 text-[#1749A8]',
  red: 'bg-red-100 text-red-700',
}

export function Pill({ children, color }: { children: React.ReactNode; color: PillColor }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${PILL_COLORS[color]}`}>
      {children}
    </span>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export function Sidebar({ logo, items }: { logo: string; items: SidebarItem[] }) {
  return (
    <div className="bg-[#0F1724] p-4 w-[200px] shrink-0 hidden md:block">
      <div className="text-white font-extrabold text-[13px] mb-5 pb-3 border-b border-white/10">
        {logo}
      </div>
      {items.map((item, i) => (
        <div
          key={i}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs mb-0.5 cursor-pointer transition-all ${
            item.active
              ? 'bg-[#1E5BC6] text-white'
              : 'text-white/50 hover:bg-white/5 hover:text-white/80'
          }`}
        >
          <span className="text-sm">{item.icon}</span>
          {item.label}
        </div>
      ))}
    </div>
  )
}

// ─── KpiRow ───────────────────────────────────────────────────────────────────

export function KpiRow({ items }: { items: KpiItem[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
      {items.map((k, i) => (
        <div key={i} className="bg-white rounded-lg p-3 shadow-sm">
          <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
            {k.label}
          </div>
          <div className="text-lg font-extrabold text-[#1A1A1A]">{k.val}</div>
          <div className={`text-[10px] font-semibold ${k.down ? 'text-red-500' : 'text-emerald-500'}`}>
            {k.trend}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── BarRow ───────────────────────────────────────────────────────────────────

export function BarRow({
  label,
  pct,
  color,
  value,
}: {
  label: string
  pct: number
  color: string
  value: string
}) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="text-[11px] text-gray-500 w-[70px] shrink-0">{label}</span>
      <div className="flex-1 h-[7px] bg-[#F5F7FA] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-[11px] font-bold text-[#374151] w-7 text-right">{value}</span>
    </div>
  )
}
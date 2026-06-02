import { useState } from 'react'

export function Panel({
  title,
  defaultOpen = true,
  children,
  className = '',
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
  className?: string
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={`border-t border-slate-200 ${className}`}>
      <button
        type="button"
        className="flex w-full items-center justify-between px-5 py-3.5 cursor-pointer select-none hover:bg-slate-50/60 transition-colors bg-slate-50/40"
        onClick={() => setOpen(!open)}
      >
        <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
        <svg
          className={`h-4 w-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && <div className="px-5 pb-5 pt-0">{children}</div>}
    </div>
  )
}

export function SidePanel({
  title,
  defaultOpen = true,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-slate-200 last:border-b-0">
      <button
        type="button"
        className="flex w-full items-center justify-between px-4 py-3 cursor-pointer select-none hover:bg-slate-50/60 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        <svg
          className={`h-4 w-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  )
}

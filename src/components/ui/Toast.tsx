'use client'

import { useEffect } from 'react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastProps {
  message: string
  type?: ToastType
  onClose: () => void
  duration?: number
}

const config: Record<ToastType, { icon: string; cls: string }> = {
  success: {
    icon: '✓',
    cls: 'bg-emerald-600 text-white shadow-emerald-900/20',
  },
  error: {
    icon: '✕',
    cls: 'bg-red-600 text-white shadow-red-900/20',
  },
  warning: {
    icon: '⚠',
    cls: 'bg-amber-500 text-white shadow-amber-900/20',
  },
  info: {
    icon: 'ℹ',
    cls: 'bg-indigo-600 text-white shadow-indigo-900/20',
  },
}

export default function Toast({ message, type = 'info', onClose, duration = 3500 }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, duration)
    return () => clearTimeout(t)
  }, [onClose, duration])

  const { icon, cls } = config[type]

  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-[1000] flex items-center gap-3 rounded-2xl px-4 py-3',
        'shadow-xl text-sm font-medium min-w-[240px] max-w-sm',
        'animate-in slide-in-from-bottom-4 fade-in duration-300',
        cls
      )}
    >
      {/* Icon circle */}
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
        {icon}
      </span>
      <span className="flex-1 leading-snug">{message}</span>
      <button
        onClick={onClose}
        className="shrink-0 rounded-full w-5 h-5 flex items-center justify-center opacity-70 hover:opacity-100 hover:bg-white/20 transition-all text-xs"
      >
        ✕
      </button>
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-0.5 rounded-full bg-white/30 w-full overflow-hidden">
        <div
          className="h-full bg-white/60 rounded-full"
          style={{
            animation: `shrink ${duration}ms linear forwards`,
          }}
        />
      </div>
    </div>
  )
}

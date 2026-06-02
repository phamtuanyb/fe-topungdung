import { cn } from '@/lib/utils'

interface EmptyStateProps {
  title?: string
  description?: string
  action?: React.ReactNode
  className?: string
  icon?: React.ReactNode
}

export default function EmptyState({
  title = 'Chưa có dữ liệu',
  description,
  action,
  className,
  icon,
}: EmptyStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center gap-4 py-20 text-center',
      className
    )}>
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        {icon ?? (
          <svg className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        )}
      </div>
      <div>
        <p className="text-base font-semibold text-slate-700">{title}</p>
        {description && (
          <p className="mt-1 text-sm text-slate-400 max-w-xs mx-auto">{description}</p>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  )
}

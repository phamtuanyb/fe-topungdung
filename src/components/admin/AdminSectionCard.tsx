import { cn } from '@/lib/utils'

export interface AdminSectionCardProps {
  title?: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
  bodyClassName?: string
  padding?: boolean
}

export default function AdminSectionCard({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
  padding = true,
}: AdminSectionCardProps) {
  const hasHeader = title || description || action

  return (
    <div className={cn('admin-card overflow-hidden', className)}>
      {hasHeader && (
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="min-w-0">
            {title && (
              <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
            )}
            {description && (
              <p className="text-xs text-slate-500 mt-0.5">{description}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={cn(padding && 'p-5', bodyClassName)}>{children}</div>
    </div>
  )
}

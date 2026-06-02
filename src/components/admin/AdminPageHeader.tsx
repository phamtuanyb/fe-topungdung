import Link from 'next/link'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export interface AdminPageHeaderProps {
  backHref?: string
  showBack?: boolean
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}

export default function AdminPageHeader({
  backHref = '/admin',
  showBack = true,
  title,
  description,
  children,
  className,
}: AdminPageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4 flex-wrap', className)}>
      <div className="flex items-start gap-3 min-w-0">
        {showBack && (
          <Link href={backHref}>
            <Button
              variant="ghost"
              size="sm"
              className="mt-0.5 shrink-0"
              aria-label="Quay lại"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </Button>
          </Link>
        )}
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-slate-900">{title}</h1>
          {description && (
            <p className="text-sm text-slate-500 mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {children && (
        <div className="flex items-center gap-2 flex-wrap shrink-0">{children}</div>
      )}
    </div>
  )
}

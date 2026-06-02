import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

const sizeMap = {
  sm: { spinner: 'h-5 w-5', border: 'border-2' },
  md: { spinner: 'h-8 w-8', border: 'border-2' },
  lg: { spinner: 'h-12 w-12', border: 'border-[3px]' },
}

export default function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  const { spinner, border } = sizeMap[size]
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div className={cn(
        'rounded-full border-slate-200 border-t-indigo-600 animate-spin',
        spinner, border
      )} />
      {text && <p className="text-sm text-slate-400 font-medium">{text}</p>}
    </div>
  )
}

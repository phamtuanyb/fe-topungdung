interface SectionTagProps {
  children: React.ReactNode
  color?: 'orange' | 'blue'
  className?: string
}

export default function SectionTag({ children, color = 'orange', className = '' }: SectionTagProps) {
  return (
    <span
      className={`inline-block text-[12px] font-extrabold tracking-[0.08em] uppercase px-3 py-1 rounded-full mb-4 ${
        color === 'orange'
          ? 'text-vs-orange bg-vs-orange-light'
          : 'text-vs-blue bg-vs-blue-light'
      } ${className}`}
    >
      {children}
    </span>
  )
}

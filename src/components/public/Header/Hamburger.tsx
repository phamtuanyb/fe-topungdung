import { cn } from '@/lib/utils'
import React from 'react'

type Props = {
    isOpen: boolean
    onClick: () => void
}
const Hamburger = ({ isOpen, onClick }: Props) => (
    <button
        id="hamburger"
        className="lg:hidden flex flex-col gap-[5px] cursor-pointer p-2 rounded-vs bg-none border-none"
        onClick={onClick}
        aria-label="Menu"
        aria-expanded={isOpen}
    >
        <span
            className={cn(
                'block w-[22px] h-0.5 bg-vs-dark rounded-sm transition-all',
                isOpen && 'translate-y-[7px] rotate-45',
            )}
        />
        <span
            className={cn(
                'block w-[22px] h-0.5 bg-vs-dark rounded-sm transition-all',
                isOpen && 'opacity-0',
            )}
        />
        <span
            className={cn(
                'block w-[22px] h-0.5 bg-vs-dark rounded-sm transition-all',
                isOpen && '-translate-y-[7px] -rotate-45',
            )}
        />
    </button>
)

export default Hamburger

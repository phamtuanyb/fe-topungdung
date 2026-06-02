import { cn } from "@/lib/utils"
import Link from "next/link"
import MegaMenuDropdown from "./MegaMenuDropdown"
import { MegaMenuConfig } from "./config"

type Props = {
    config: MegaMenuConfig
    isActive: boolean
    isOpen: boolean
    onShow: () => void
    onHide: () => void
}

const MegaMenuTrigger = ({ config, isActive, isOpen, onShow, onHide }: Props) => {
    return (
        <div
            className="relative flex items-center"
            onMouseEnter={onShow}
            onMouseLeave={onHide}
        >
            <Link
                href={config.href}
                className={cn(
                    'flex items-center gap-1 px-4 py-2 text-[14px] font-extrabold rounded-vs transition-all whitespace-nowrap uppercase tracking-[0.05em]',
                    {
                        'text-vs-blue': isActive,
                        'text-vs-gray-700 hover:text-vs-blue hover:bg-vs-blue-light': !isActive,
                    }

                )}
            >
                {config.label}
                <span
                    className={cn(
                        'text-[10px] opacity-50 transition-transform',
                        isOpen ? 'rotate-180' : '',
                    )}
                >
                    ▾
                </span>
            </Link>
            <MegaMenuDropdown
                config={config}
                isOpen={isOpen}
                colCount={config.columns.length}
            />
        </div>
    )
}

export default MegaMenuTrigger
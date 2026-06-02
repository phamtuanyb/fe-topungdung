import { HEIGHT_HEADER_PUBLIC } from "@/constants/app.constants";
import { cn } from "@/lib/utils";
import MegaMenuColumns from "./MegaMenuColumns";
import MegaMenuFooter from "./MegaMenuFooter";
import { MegaMenuConfig } from "./config";

type Props = {
    config: MegaMenuConfig
    isOpen: boolean
    colCount: number
}
const MegaMenuDropdown = ({ config, isOpen, colCount }: Props) => (
    <div
        className={cn(
            `fixed left-0 right-0 bg-white border-t-2 border-b shadow-[0_16px_48px_rgba(0,0,0,0.12)] z-[200] transition-all duration-[180ms]`,
            config.borderColor,
            {
                'opacity-100 visible translate-y-0 pointer-events-auto': isOpen,
                'opacity-0 invisible -translate-y-1.5 pointer-events-none': !isOpen
            }
        )}
        style={{ top: HEIGHT_HEADER_PUBLIC }}
    >
        <span className="grid-cols grid-cols-2 grid-cols-3 grid-cols-4" hidden></span>
        {colCount === 0 ? (
            <div className="max-w-8xl mx-auto px-6 py-12 text-center text-vs-gray-600 text-[14px]">
                📭 Danh mục đang được cập nhật, vui lòng quay lại sau!
            </div>
        ) : (
            <div className={cn('max-w-8xl mx-auto px-6 pt-4 pb-0 grid gap-0', `grid-cols-${colCount}`)}>
                <MegaMenuColumns columns={config.columns} />
            </div>
        )}

        <MegaMenuFooter
            heading={config.footerHeading}
            sub={config.footerSub}
            cta={config.footerCta}
            ctaHref={config.footerCtaHref}
        />
    </div>
)

export default MegaMenuDropdown
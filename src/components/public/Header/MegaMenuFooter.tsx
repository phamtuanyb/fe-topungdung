import Link from "next/link"

type Props = {
    heading: string
    sub: string
    cta: string
    ctaHref?: string
}
const MegaMenuFooter = ({ heading, sub, cta, ctaHref = '/contact' }: Props) => (
    <div className="border-t border-vs-gray-200 bg-vs-bg">
        <div className="max-w-8xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
            <div>
                <strong className="text-[14px] font-bold text-vs-dark block">
                    {heading}
                </strong>
                <span className="text-[13px] text-vs-gray-600">{sub}</span>
            </div>
            <Link
                href={ctaHref}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-vs-orange text-white text-[13px] font-bold rounded-vs hover:bg-vs-orange-dark transition-all whitespace-nowrap"
            >
                {cta}
            </Link>
        </div>
    </div>
)

export default MegaMenuFooter
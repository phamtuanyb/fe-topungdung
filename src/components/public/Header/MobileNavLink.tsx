import Link from "next/link"

type Props = {
    href: string
    children: React.ReactNode
}

const MobileNavLinkPublic = ({ href, children }: Props) => (
    <Link
        href={href}
        className="text-sm font-semibold text-vs-gray-600 py-2.5 px-7 block hover:bg-vs-blue-light hover:text-vs-blue transition-colors rounded-lg"
    >
        {children}
    </Link>
)

export default MobileNavLinkPublic
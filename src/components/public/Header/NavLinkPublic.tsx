import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react'

type Props = {
    href: string
    active: boolean
    children: React.ReactNode
}
const NavLinkPublic = ({ href, active, children }: Props) => (
    <Link
        href={href}
        className={
            cn('px-4 py-2 text-[14px] font-extrabold rounded-vs transition-all whitespace-nowrap uppercase tracking-[0.05em]', {
                'text-vs-blue': active,
                'text-vs-gray-700 hover:text-vs-blue hover:bg-vs-blue-light': !active,
            })
        }
    >
        {children}
    </Link>
);
export default NavLinkPublic

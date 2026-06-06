"use client"

import { HEIGHT_HEADER_PUBLIC } from "@/constants/app.constants"
import { getEmojiForPost } from "@/lib/public-content"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useRef, useCallback, useEffect } from "react"
import { MegaMenuColumn, MegaMenuConfig } from "./config"
import Hamburger from "./Hamburger"
import MegaMenuTrigger from "./MegaMenuTrigger"
import MobileMenu from "./MobileMenu"
import NavLinkPublic from "./NavLinkPublic"
import { Category, MenuItem, Post } from "@/types"
import Image from "next/image"
import { AI_AGENT_SLUGS, SERVICES_URL, NEWS_SLUGS } from "@/constants/app.constants"
import NewsMegaMenuTrigger from "./NewsMegaMenuTrigger"

const isAiAgentMenu = (item: MenuItem) => {
    if (item.url === '/ai-agent' || item.url === `/${AI_AGENT_SLUGS}`) return true
    const label = item.label.toLowerCase()
    return label.includes('ai agent')
}

const isServicesMenu = (item: MenuItem) => {
    if (item.url === '/services' || item.url === `/${SERVICES_URL}`) return true
    const label = item.label.toLowerCase().trim()
    return label === 'dịch vụ' || label === 'dich vu' || label === 'services'
}

const isNewsMenu = (item: MenuItem) => {
    if (item.url === '/news' || item.url === `/${NEWS_SLUGS}`) return true
    const label = item.label.toLowerCase().trim()
    return label === 'tin tức' || label === 'tin tuc' || label === 'news'
}

const resolveUrl = (url: string | null | undefined, label: string) => {
    if (url) return url
    if (label === 'Trang chủ') return '/'
    if (label === 'Giới thiệu') return '/introduction'
    if (label === 'Tin tức') return '/tin-tuc'
    if (label === 'Liên hệ') return '/lien-he'
    return '/'
}

const useMegaMenu = () => {
    const [activeMenu, setActiveMenu] = useState<string | null>(null)
    const timers = useRef<Record<string, NodeJS.Timeout>>({})

    const show = useCallback((key: string) => {
        if (timers.current[key]) clearTimeout(timers.current[key])
        setActiveMenu(key)
    }, [])

    const hide = useCallback((key: string) => {
        timers.current[key] = setTimeout(() => {
            setActiveMenu(prev => (prev === key ? null : prev))
        }, 120)
    }, [])

    const reset = useCallback(() => setActiveMenu(null), [])

    return { activeMenu, show, hide, reset }
}

type HeaderClientProps = {
    menuData: MenuItem[]
    aiAgentPosts?: Post[]
    servicesPosts?: Post[]
    newsPosts?: Post[]
    newsSubCategories?: Category[]
}

const HeaderClient = ({
    menuData,
    aiAgentPosts = [],
    servicesPosts = [],
    newsPosts = [],
    newsSubCategories = [],
}: HeaderClientProps) => {
    const pathname = usePathname()
    const [mobileOpen, setMobileOpen] = useState(false)
    const { activeMenu, show, hide, reset } = useMegaMenu()

    const buildMegaMenuConfig = useCallback((item: MenuItem): MegaMenuConfig => {
        const isAi = isAiAgentMenu(item)
        const isSvc = isServicesMenu(item)

        // Posts pool theo loại menu (AI Agent hoặc Dịch vụ). Cả 2 đều build cột từ children của menu cha + Post.menuGroupId.
        const postsPool: Post[] = isAi ? aiAgentPosts : isSvc ? servicesPosts : []
        const detailUrlPrefix = isAi ? `/${AI_AGENT_SLUGS}` : isSvc ? `/${SERVICES_URL}` : (item.url || '')

        let columns: MegaMenuColumn[]
        if (isAi || isSvc) {
            // Mỗi child của menu cha = 1 cột. Lọc posts theo Post.menuGroupId === child.id, sort theo displayOrder.
            columns = (item.children || []).map((child, idx) => {
                const colPosts = postsPool
                    .filter((p) => p.menuGroupId === child.id)
                    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
                return {
                    title: child.label,
                    color: idx % 2 === 0 ? 'blue' : 'orange',
                    items: colPosts.map((p) => ({
                        href: `${detailUrlPrefix}/${p.slug}`,
                        icon: getEmojiForPost(p.slug, p.title),
                        logoUrl: p.logoUrl ?? null,
                        name: p.shortName || p.title,
                        sub: p.badge ?? '',
                    })),
                }
            })
        } else {
            // Các menu khác (không phải AI Agent / Dịch vụ): giữ logic cũ — render thủ công từ children menu.
            columns = (item.children || []).map((child, idx) => {
                return {
                    title: child.label,
                    color: idx % 2 === 0 ? 'blue' : 'orange',
                    items: (child.children || []).map(subItem => ({
                        href: subItem.url || `${item.url || ''}/${subItem.id}`,
                        icon: getEmojiForPost(subItem.url || '', subItem.label),
                        logoUrl: null,
                        name: subItem.label,
                        sub: '',
                    }))
                }
            })
        }

        let footerHeading = 'Không thấy ngành của bạn?'
        let footerSub = 'Tư vấn miễn phí 30 phút — đội Vsoftware sẽ may đo riêng.'
        let footerCta = 'Liên hệ ngay →'
        let footerCtaHref: string | undefined = '/lien-he'
        let borderColor = 'border-vs-blue'

        if (isAi) {
            footerHeading = 'Khám phá toàn bộ sản phẩm AI Agent'
            footerSub = `Hiện có ${aiAgentPosts.length} sản phẩm AI Agent — xem tất cả để chọn giải pháp phù hợp.`
            footerCta = 'Tất cả sản phẩm →'
            footerCtaHref = '/ai-agent'
            borderColor = 'border-vs-blue-200'
        } else if (isSvc) {
            footerHeading = 'Khám phá toàn bộ dịch vụ Vsoftware'
            footerSub = 'Phần mềm vận hành, theo ngành nghề, thiết kế web & app — xem tất cả để chọn giải pháp phù hợp.'
            footerCta = 'Tất cả dịch vụ →'
            footerCtaHref = `/${SERVICES_URL}`
            borderColor = 'border-vs-blue-200'
        }

        return {
            key: String(item.id),
            label: item.label,
            href: item.url || '#',
            activePrefix: item.url || '',
            columns,
            footerHeading,
            footerSub,
            footerCta,
            footerCtaHref,
            borderColor,
        }
    }, [aiAgentPosts, servicesPosts])

    useEffect(() => {
        setMobileOpen(false)
        reset()
    }, [pathname, reset])

    const isItemActive = (url: string | null | undefined, label: string) => {
        const resolved = resolveUrl(url, label)
        if (resolved === '/') return pathname === '/'
        return pathname === resolved || pathname.startsWith(resolved + '/')
    }

    // Sort depth-0 items based on order
    const depthZeroItems = [...menuData]
        .filter(item => item.depth === 0)
        .sort((a, b) => a.order - b.order)

    return (
        <>
            <nav className="sticky top-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-xl border-b border-vs-gray-200">
                <div className="container mx-auto px-6 h-full flex items-center justify-between gap-8">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0">
                        <Image
                            src="/logo-ngang.png"
                            alt="Vsoftware"
                            width={170}
                            height={88}
                            className={cn(`w-auto object-contain`)}
                            priority
                            style={{ height: HEIGHT_HEADER_PUBLIC }}
                        />
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-1.5">
                        {depthZeroItems.map((item) => {
                            const isAi = isAiAgentMenu(item)
                            const isNews = isNewsMenu(item)

                            // Tin tức: dùng mega menu riêng (2 cột: chuyên mục + bài mới nhất)
                            if (isNews && (newsSubCategories.length > 0 || newsPosts.length > 0)) {
                                const key = `news-${item.id}`
                                const newsHref = item.url || '/tin-tuc'
                                const active = pathname.startsWith('/tin-tuc') || pathname.startsWith('/chuyen-muc')
                                return (
                                    <NewsMegaMenuTrigger
                                        key={item.id}
                                        label={item.label}
                                        href={newsHref}
                                        isActive={active}
                                        isOpen={activeMenu === key}
                                        onShow={() => show(key)}
                                        onHide={() => hide(key)}
                                        subCategories={newsSubCategories}
                                        posts={newsPosts}
                                    />
                                )
                            }

                            const hasChildren = (item.children && item.children.length > 0) || (isAi && aiAgentPosts.length > 0)

                            if (hasChildren) {
                                const config = buildMegaMenuConfig(item)
                                const active = config.activePrefix ? pathname.startsWith(config.activePrefix) : false
                                return (
                                    <MegaMenuTrigger
                                        key={item.id}
                                        config={config}
                                        isActive={active}
                                        isOpen={activeMenu === config.key}
                                        onShow={() => show(config.key)}
                                        onHide={() => hide(config.key)}
                                    />
                                )
                            }

                            const resolvedUrl = resolveUrl(item.url, item.label)
                            const active = isItemActive(item.url, item.label)

                            return (
                                <NavLinkPublic key={item.id} href={resolvedUrl} active={active}>
                                    {item.label}
                                </NavLinkPublic>
                            )
                        })}
                    </div>

                    {/* CTA */}
                    <div className="hidden lg:flex items-center">
                        <Link
                            href="/lien-he"
                            className="relative inline-flex items-center gap-2 px-6 py-3 bg-vs-orange text-white text-[15px] font-bold rounded-vs hover:bg-vs-orange-dark transition-all overflow-visible"
                        >
                            <span className="relative z-10">Tư vấn miễn phí</span>
                            <span className="absolute inset-0 rounded-vs bg-vs-orange animate-pulse-ring" />
                        </Link>
                    </div>

                    <Hamburger isOpen={mobileOpen} onClick={() => setMobileOpen(v => !v)} />
                </div>
            </nav>

            {mobileOpen && (
                <MobileMenu
                    menuData={menuData}
                />
            )}
        </>
    )
}

export default HeaderClient
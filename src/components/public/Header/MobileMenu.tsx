import { HEIGHT_HEADER_PUBLIC } from "@/constants/app.constants";
import { getEmojiForPost } from "@/lib/public-content";
import { cn } from "@/lib/utils";
import type { MenuItem } from "@/types";
import Link from "next/link";
import MobileNavLinkPublic from "./MobileNavLink";
import SectionLabel from "./SectionLabel";

type MobileMenuProps = {
  menuData: MenuItem[]
}

const resolveUrl = (url: string | null | undefined, label: string) => {
  if (url) return url
  if (label === 'Trang chủ') return '/'
  if (label === 'Giới thiệu') return '/introduction'
  if (label === 'Tin tức') return '/tin-tuc'
  if (label === 'Liên hệ') return '/contact'
  return '/'
}

const MobileMenu = ({ menuData }: MobileMenuProps) => {
  // Find top-level custom menu items
  const homeItem = menuData.find(item => item.depth === 0 && item.label === 'Trang chủ')
  const introItem = menuData.find(item => item.depth === 0 && item.label === 'Giới thiệu')
  const newsItem = menuData.find(item => item.depth === 0 && item.label === 'Tin tức')
  const contactItem = menuData.find(item => item.depth === 0 && item.label === 'Liên hệ')

  // Find submenus
  const servicesMenuItem = menuData.find(item => item.depth === 0 && item.label === 'Dịch vụ')
  const aiMenuItem = menuData.find(item => item.depth === 0 && (item.label === 'AI Agents' || item.label.includes('AI')))

  const groups: { label: string; items: { href: string; icon: string; name: string }[] }[] = []

  if (servicesMenuItem && servicesMenuItem.children) {
    servicesMenuItem.children.forEach(child => {
      groups.push({
        label: child.label,
        items: (child.children || []).map(subItem => ({
          href: subItem.url || `/dich-vu/${subItem.id}`,
          icon: getEmojiForPost(subItem.url || '', subItem.label),
          name: subItem.label,
        }))
      })
    })
  }

  if (aiMenuItem && aiMenuItem.children) {
    const aiItems: { href: string; icon: string; name: string }[] = []
    aiMenuItem.children.forEach(child => {
      (child.children || []).forEach(subItem => {
        aiItems.push({
          href: subItem.url || `/ai-agent/${subItem.id}`,
          icon: getEmojiForPost(subItem.url || '', subItem.label),
          name: subItem.label,
        })
      })
    })
    groups.push({
      label: aiMenuItem.label,
      items: aiItems,
    })
  }

  return (
    <div className={cn(`fixed top-[${HEIGHT_HEADER_PUBLIC}px] left-0 right-0 bottom-0 bg-white z-[99] px-6 py-6 overflow-y-auto flex flex-col gap-1`)}>
      <Link
        href={resolveUrl(homeItem?.url, homeItem?.label || 'Trang chủ')}
        className="text-base font-bold text-vs-dark no-underline py-3 px-4 rounded-lg border-b border-vs-gray-200 block hover:bg-vs-blue-light hover:text-vs-blue transition-colors"
      >
        🏠 {homeItem?.label || 'Trang chủ'}
      </Link>

      <SectionLabel>{introItem?.label || 'Giới thiệu'}</SectionLabel>
      <MobileNavLinkPublic href={resolveUrl(introItem?.url, introItem?.label || 'Giới thiệu')}>
        🏢 Về Vsoftware
      </MobileNavLinkPublic>

      {groups.map(group => (
        <div key={group.label}>
          <SectionLabel>{group.label}</SectionLabel>
          {group.items.map((item, i) => (
            <MobileNavLinkPublic key={i} href={item.href}>
              {item.icon} {item.name}
            </MobileNavLinkPublic>
          ))}
        </div>
      ))}

      <Link
        href={resolveUrl(newsItem?.url, newsItem?.label || 'Tin tức')}
        className="text-base font-bold text-vs-dark no-underline py-3 px-4 rounded-lg border-b border-vs-gray-200 block hover:bg-vs-blue-light hover:text-vs-blue transition-colors mt-2"
      >
        📰 {newsItem?.label || 'Tin tức'}
      </Link>
      <Link
        href={resolveUrl(contactItem?.url, contactItem?.label || 'Liên hệ')}
        className="text-base font-bold text-white no-underline py-3 px-4 rounded-lg bg-vs-blue text-center block mt-4 hover:bg-vs-blue-dark transition-colors"
      >
        🗓️ {contactItem?.label === 'Liên hệ' ? 'Tư vấn miễn phí ngay' : (contactItem?.label || 'Tư vấn miễn phí ngay')}
      </Link>
    </div>
  )
}

export default MobileMenu
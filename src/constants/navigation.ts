import { NEWS_SLUGS } from './app.constants'

export interface MegaMenuItem {
  icon: string
  name: string
  sub: string
  href: string
  iconType?: 'emoji' | 'svg'
}

export interface MegaMenuColumn {
  title: string
  color: 'blue' | 'orange'
  items: MegaMenuItem[]
}

export const FOOTER_LINKS = {
  services: [
    { label: 'Phần mềm theo yêu cầu', href: '/dich-vu/phan-mem-ban-hang', icon: '⚙️' },
    { label: 'CRM & Bán hàng', href: '/dich-vu/crm-cho-sme', icon: '👥' },
    { label: 'App Mobile', href: '/dich-vu/app-ban-hang', icon: '📱' },
    { label: 'AI & Automation', href: '/dich-vu/ai-automation', icon: '🤖' },
    { label: 'Website & Landing', href: '/dich-vu/website-landing', icon: '🌐' },
    { label: 'Thiết kế Website', href: '/dich-vu/thiet-ke-website', icon: '🎨' },
  ],
  company: [
    { label: 'Về Vsoftware', href: '/introduction', icon: '🏢' },
    { label: 'Quy trình làm việc', href: '/#how-it-works', icon: '🔄' },
    { label: 'Blog công nghệ', href: `/category/${NEWS_SLUGS}`, icon: '📝' },
    { label: 'Liên hệ hợp tác', href: '/contact', icon: '💼' },
  ],
  contact: [
    { label: 'hello@vsoftware.vn', href: 'mailto:hello@vsoftware.vn', icon: '✉️' },
    { label: 'vsoftware.vn', href: '/', icon: '🌍' },
    { label: 'Facebook', href: '#', icon: '📘' },
    { label: 'Zalo OA', href: 'https://zalo.me/vsoftware', icon: '💬' },
  ],
}

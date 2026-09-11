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
    { label: 'Duyệt theo nhu cầu', href: '/ungdung', icon: '🔎' },
    { label: 'Bảng xếp hạng', href: '/ranking', icon: '🏆' },
    { label: 'Bộ công cụ', href: '/topapp', icon: '🧰' },
    { label: 'Tin tức & review', href: '/tin-tuc', icon: '📰' },
  ],
  company: [
    { label: 'Về TopỨngDụng', href: '/introduction', icon: '🏢' },
    { label: 'Cách chúng tôi đánh giá', href: '/introduction', icon: '⚖️' },
    { label: 'Tin tức & review', href: '/tin-tuc', icon: '📝' },
    { label: 'Liên hệ', href: '/lien-he', icon: '💼' },
  ],
  contact: [
    { label: 'topungdung.net@gmail.com', href: 'mailto:topungdung.net@gmail.com', icon: '✉️' },
    { label: 'topungdung.net', href: '/', icon: '🌍' },
  ],
}

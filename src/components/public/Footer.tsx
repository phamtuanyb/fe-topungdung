import Link from 'next/link'
import { getFooterConfig, getContactConfig } from '@/lib/api/public'
import type { ContactConfig, FooterConfig, FooterSection } from '@/types'

// SVG path chuẩn từ Simple Icons (https://simpleicons.org) — logo chính thức brand
const SOCIAL_PATHS: Record<string, string> = {
  facebook:  'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  youtube:   'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  zalo:      'M12.49 10.2722v-.4496h1.3467v6.3218h-.7704a.576.576 0 0 1-.5763-.5729l-.0006.0005a3.273 3.273 0 0 1-1.9372.6321c-1.8273 0-3.3083-1.4858-3.3083-3.3189 0-1.8336 1.481-3.3194 3.3083-3.3194a3.273 3.273 0 0 1 1.9372.6321l.0006.0005zM6.9986 7.7402c0-.4324-.351-.7834-.7834-.7834H1.3467c-.4324 0-.7834.351-.7834.7834v.5654c0 .4324.351.7834.7834.7834h4.8685c.4324 0 .7834-.351.7834-.7834v-.5654zm17.1689 8.8425c-.4324 0-.7834-.351-.7834-.7834V6.9573c0-.4324.351-.7834.7834-.7834.4324 0 .7834.351.7834.7834v8.6452c.001.4324-.35.7836-.7834.7836zM6.4078 16.5827h-5.5644a.844.844 0 0 1-.6786-1.3464l4.3686-5.7679h-3.4953a.5764.5764 0 0 1-.5763-.5764v-.7702h5.1488a.844.844 0 0 1 .6788 1.3463l-4.3687 5.7679h3.9657a.5764.5764 0 0 1 .5763.5764v.7704h-.0549zm15.7685.024c-1.825 0-3.305-1.4855-3.305-3.319 0-1.834 1.48-3.3193 3.305-3.3193 1.825 0 3.305 1.4855 3.305 3.3193 0 1.8335-1.48 3.319-3.305 3.319zm-12.0696-1.3463c1.0723 0 1.9421-.8855 1.9421-1.9777 0-1.0925-.8698-1.978-1.9421-1.978-1.0727 0-1.9425.8856-1.9425 1.978 0 1.0924.8703 1.9777 1.9425 1.9777zm12.0696 0c1.0723 0 1.9421-.8855 1.9421-1.9777 0-1.0925-.8698-1.978-1.9421-1.978-1.0728 0-1.9425.8856-1.9425 1.978 0 1.0924.8702 1.9777 1.9425 1.9777zM17.0322 7.418v9.1646h-.7867c-.3127 0-.5658-.255-.5658-.5701V7.418c0-.315.2531-.5701.5658-.5701h.2208c.3128 0 .5659.255.5659.5701z',
  instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z',
  tiktok:    'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
  linkedin:  'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.063 2.063 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
}

const DEFAULT_FOOTER: FooterConfig = {
  brand: {
    title: 'Vsoftware',
    socials: [
      { type: 'facebook',  href: '#' },
      { type: 'youtube',   href: '#' },
      { type: 'zalo',      href: 'https://zalo.me/vsoftware' },
      { type: 'tiktok',    href: '#' },
      { type: 'instagram', href: '#' },
      { type: 'linkedin',  href: '#' },
    ],
  },
  sections: [
    { type: 'links', title: 'Dịch vụ', links: [
      { icon: '⚙️', label: 'Phần mềm theo yêu cầu', href: '/dich-vu/phan-mem-ban-hang' },
      { icon: '👥', label: 'CRM & Bán hàng',         href: '/dich-vu/crm-cho-sme' },
      { icon: '📱', label: 'App Mobile',              href: '/dich-vu/app-ban-hang' },
      { icon: '🤖', label: 'AI & Automation',         href: '/dich-vu/ai-automation' },
      { icon: '🌐', label: 'Website & Landing',       href: '/dich-vu/website-landing' },
      { icon: '🎨', label: 'Thiết kế Website',        href: '/dich-vu/thiet-ke-website' },
    ]},
    { type: 'links', title: 'Công ty', links: [
      { icon: '🏢', label: 'Về Vsoftware',       href: '/introduction' },
      { icon: '🔄', label: 'Quy trình làm việc', href: '/#how-it-works' },
      { icon: '📝', label: 'Blog công nghệ',      href: '/category/tin-tuc' },
      { icon: '💼', label: 'Liên hệ hợp tác',    href: '/lien-he' },
    ]},
    { type: 'links', title: 'Liên hệ', links: [
      { icon: '✉️', label: 'hello@vsoftware.vn', href: 'mailto:hello@vsoftware.vn' },
      { icon: '🌍', label: 'vsoftware.vn',        href: '/' },
      { icon: '📘', label: 'Facebook',            href: '#' },
      { icon: '💬', label: 'Zalo OA',             href: 'https://zalo.me/vsoftware' },
    ]},
  ],
  copyright: '© {year} Vsoftware · ViTechGroup · All rights reserved.',
  legalLinks: [
    { label: 'Chính sách bảo mật', href: '/chinh-sach-bao-mat' },
    { label: 'Điều khoản sử dụng', href: '/dieu-khoan-su-dung' },
  ],
}

// Normalize old format (columns) → new format (sections)
function normalizeConfig(raw: FooterConfig & { columns?: { title: string; links: { icon: string; label: string; href: string }[] }[] }): FooterConfig {
  if (!raw.sections && raw.columns) {
    return {
      ...raw,
      sections: raw.columns.map((col) => ({ type: 'links' as const, ...col })),
    }
  }
  return raw
}

function renderSection(section: FooterSection, idx: number) {
  return (
    <div key={idx}>
      <h4 className="text-[14px] font-extrabold text-white uppercase tracking-[0.08em] mb-[16px] pb-2.5 border-b border-white/15">
        {section.title}
      </h4>
      {(section.links ?? []).map((link, i) => (
        <Link
          key={i}
          href={link.href}
          className="flex items-center gap-2.5 text-[13.5px] text-white/50 no-underline mb-3 hover:text-white hover:pl-0.5 transition-all"
        >
          <span className="text-[14px] w-5 flex-shrink-0 opacity-75">{link.icon}</span>
          {link.label}
        </Link>
      ))}
    </div>
  )
}

export default async function Footer() {
  let config: FooterConfig = DEFAULT_FOOTER
  let contact: ContactConfig | null = null
  try {
    const [footerRes, contactRes] = await Promise.all([
      getFooterConfig().catch(() => null),
      getContactConfig().catch(() => null),
    ])
    if (footerRes?.data) config = normalizeConfig(footerRes.data as Parameters<typeof normalizeConfig>[0])
    contact = contactRes?.data ?? null
  } catch {
    // fallback to default
  }

  const { brand, sections, copyright, legalLinks } = config
  const copyrightText = copyright.replace('{year}', String(new Date().getFullYear()))
  const totalCols = 1 + sections.length

  // Lấy info đầu tiên từ /admin/contact-info để render cột Brand (compact: 1 item mỗi loại)
  const hotline = contact?.info?.hotlines?.[0] ?? ''
  const email = contact?.info?.emails?.[0] ?? ''
  const address = contact?.info?.offices?.[0]?.address ?? ''
  const brandTitle = brand.title ?? 'Vsoftware'

  return (
    <footer className="bg-[#0F2D6E] text-white/80 pt-8 pb-0">
      <div className="max-w-8xl mx-auto px-6">
        {/* Main grid — equal columns, dynamic count */}
        <div
          className="grid gap-8 mb-6"
          style={{ gridTemplateColumns: `repeat(${totalCols}, minmax(0, 1fr))` }}
        >
          {/* Brand column — layout giống các cột links khác */}
          <div className="footer-brand">
            <h4 className="text-[14px] font-extrabold text-white uppercase tracking-[0.08em] mb-[16px] pb-2.5 border-b border-white/15">
              {brandTitle}
            </h4>
            {hotline && (
              <a
                href={`tel:${hotline.replace(/[^\d+]/g, '')}`}
                className="flex items-center gap-2.5 text-[13.5px] text-white/50 no-underline mb-3 hover:text-white hover:pl-0.5 transition-all"
              >
                <span className="text-[14px] w-5 flex-shrink-0 opacity-75">📞</span>
                {hotline}
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2.5 text-[13.5px] text-white/50 no-underline mb-3 hover:text-white hover:pl-0.5 transition-all"
              >
                <span className="text-[14px] w-5 flex-shrink-0 opacity-75">✉️</span>
                {email}
              </a>
            )}
            {address && (
              <div className="flex items-start gap-2.5 text-[13.5px] text-white/50 mb-4">
                <span className="text-[14px] w-5 flex-shrink-0 opacity-75 mt-0.5">📍</span>
                <span className="leading-[1.55]">{address}</span>
              </div>
            )}
            {brand.socials.length > 0 && (
              <div className="flex gap-2.5 mt-4 pt-4 border-t border-white/10">
                {brand.socials.map((s) => (
                  <a
                    key={s.type}
                    href={s.href}
                    className="w-[38px] h-[38px] rounded-[10px] bg-white/10 flex items-center justify-center text-white/75 hover:bg-white/20 hover:text-white transition-all"
                    aria-label={s.type}
                  >
                    <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                      <path d={SOCIAL_PATHS[s.type] ?? SOCIAL_PATHS.facebook} />
                    </svg>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Dynamic sections */}
          {sections.map((section, idx) => renderSection(section, idx))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 flex-wrap">
          <p className="text-[13px] text-white/40">{copyrightText}</p>
          <div className="flex gap-6">
            {legalLinks.map((l) => (
              <a key={l.label} href={l.href} className="text-[13px] text-white/40 hover:text-white/80 transition-colors no-underline">
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

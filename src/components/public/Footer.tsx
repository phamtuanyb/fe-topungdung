import Link from 'next/link'
import { getFooterConfig, getContactConfig } from '@/lib/api/public'
import type { ContactConfig, FooterConfig, FooterSection } from '@/types'

const SOCIAL_PATHS: Record<string, string> = {
  facebook:  'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
  youtube:   'M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.6C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z',
  zalo:      'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  instagram: 'M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm4.5 5a5 5 0 1 0 0 10A5 5 0 0 0 12 7zm6.5-1.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
  tiktok:    'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.69a8.16 8.16 0 0 0 4.84 1.55V6.78a4.85 4.85 0 0 1-1.08-.09z',
  linkedin:  'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  twitter:   'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z',
  telegram:  'M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z',
  pinterest: 'M12 2C6.5 2 2 6.5 2 12c0 4.2 2.6 7.8 6.4 9.3-.1-.7-.1-1.8 0-2.5.2-.7 1.2-5.2 1.2-5.2s-.3-.6-.3-1.6c0-1.5.9-2.6 1.9-2.6.9 0 1.3.7 1.3 1.5 0 .9-.6 2.3-.9 3.5-.2 1 .5 1.9 1.6 1.9 1.9 0 3.2-2 3.2-4.8 0-2.5-1.8-4.3-4.4-4.3-3 0-4.7 2.2-4.7 4.5 0 .9.3 1.9.8 2.4.1.1.1.2.1.3-.1.3-.3 1-.3 1.2-.1.2-.2.2-.4.1-1.5-.7-2.4-2.9-2.4-4.6 0-3.4 2.5-6.5 7.1-6.5 3.7 0 6.6 2.6 6.6 6.2 0 3.7-2.3 6.6-5.5 6.6-1.1 0-2.1-.6-2.4-1.2l-.7 2.5c-.2.9-.9 2.1-1.3 2.8 1 .3 2 .5 3.2.5C17.5 22 22 17.5 22 12S17.5 2 12 2z',
  threads:   'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-5h2v2h-2zm0-8h2v6h-2z',
}

const DEFAULT_FOOTER: FooterConfig = {
  brand: {
    title: 'Vsoftware',
    socials: [
      { type: 'facebook', href: '#' },
      { type: 'zalo',     href: '#' },
      { type: 'youtube',  href: '#' },
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
    { label: 'Chính sách bảo mật', href: '#' },
    { label: 'Điều khoản sử dụng', href: '#' },
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

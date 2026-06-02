
// ─── Types ────────────────────────────────────────────────────────────────────
export type MegaMenuKey = string

export type MegaMenuColumn = {
  title: string
  color: 'blue' | 'orange'
  items: { href: string; icon: React.ReactNode; name: string; sub: string; logoUrl?: string | null }[]
}

export type MegaMenuConfig = {
  key: MegaMenuKey
  label: string
  href: string
  activePrefix: string
  columns: MegaMenuColumn[]
  footerHeading: string
  footerSub: string
  footerCta: string
  footerCtaHref?: string
  borderColor: string
}


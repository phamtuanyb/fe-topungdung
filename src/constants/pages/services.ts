export type ServiceFeature = {
  icon: string
  title: string
  desc: string
  accent?: boolean
}

export type ServiceSignal = {
  num: number
  title: string
  desc: string
}

export type ServicePageData = {
  slug: string
  title: string
  heroTitle: string
  heroTitleEm?: string
  breadcrumbParent?: string
  metaTitle: string
  metaDesc: string
  articleTitle: string
  intro: string
  signalsTitle: string
  signals: ServiceSignal[]
  featuresTitle: string
  features: ServiceFeature[]
  quote: string
  ctaTitle: string
  ctaDesc: string
  sidebarServices: { icon: string; name: string; sub: string; href: string; color?: string }[]
  sidebarCategory?: { label: string; href: string; count: number }[]
}

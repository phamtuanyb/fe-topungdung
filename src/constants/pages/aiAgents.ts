export interface AIAgentFeature {
  icon: string
  title: string
  desc: string
}

export interface AIAgentStat {
  num: string
  label: string
}

export interface AIAgentCheck {
  text: string
}

export interface AIAgentPageData {
  slug: string
  title: string
  icon: string
  iconBg: string
  heroLabel: string
  heroTitle: string
  heroDesc: string
  badge?: string
  checks: AIAgentCheck[]
  featuresTitle: string
  features: AIAgentFeature[]
  statsTitle: string
  stats: AIAgentStat[]
  quote: string
  metaTitle: string
  metaDesc: string
  ctaTitle: string
  ctaDesc: string
}

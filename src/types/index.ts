export type PostStatus = 'draft' | 'published' | 'archived'
export type CategoryStatus = 'active' | 'inactive'

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  parentId?: number | null
  parent?: Category | null
  postCount?: number
  status?: CategoryStatus
  children?: Category[] | null
  createdAt?: string
  updatedAt: string
}

export interface Author {
  id: number
  name: string
  email?: string
  fullName?: string
}

export interface Media {
  id: number
  url: string
  filename: string
  fileName?: string
  altText?: string
  caption?: string
  size?: number
  mimeType?: string
  createdAt: string
}

export interface Post {
  id: number
  title: string
  slug: string
  excerpt?: string
  content: string
  status: PostStatus
  thumbnail?: string | null
  author?: Author | null
  category?: Category | null
  categoryId?: number | null
  tags?: string[] | null
  seoTitle?: string | null
  seoDescription?: string | null
  seoKeywords?: string | null
  publishedAt?: string | null
  createdAt: string
  updatedAt: string
  viewCount: number
  /** Logo riêng (cho sản phẩm AI Agent) */
  logoUrl?: string | null
  /** Badge nổi bật: "Hot", "Mới", "Phổ biến"... — có badge thì lên section AI Agent trang chủ */
  badge?: string | null
  /** Tên ngắn — nav menu compact ("CSKH", "Sales") */
  shortName?: string | null
  /** Thứ tự hiển thị (thấp → trước) */
  displayOrder?: number | null
  /** ID nhóm cha trong nav-menu — quyết định cột trên mega menu */
  menuGroupId?: number | null
  /** JSON config 10 section trang chi tiết */
  productPageConfig?: ProductPageConfig | null
}

export interface PostofCategory {
  category: Category
  posts: Post[]
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthToken {
  accessToken: string
  refreshToken: string
  user: {
    id: number
    fullName: string
    email: string
    role: string
  }
}

export interface CreatePostPayload {
  title: string
  slug?: string
  content: string
  excerpt?: string
  status: PostStatus
  categoryId?: number | null
  thumbnail?: string | null
  seoTitle?: string | null
  seoDescription?: string | null
  seoKeywords?: string | null
  tags?: string[]
  logoUrl?: string | null
  badge?: string | null
  shortName?: string | null
  displayOrder?: number | null
  menuGroupId?: number | null
  productPageConfig?: ProductPageConfig | null
}

// ─── Product page config (trang chi tiết AI Agent) ───────────────────────────

export interface PpcCta {
  text: string
  href: string
}

export interface PpcHero {
  hidden?: boolean
  tagline?: string
  statBig?: string
  statSub?: string
  ctaPrimary?: PpcCta
  ctaSecondary?: PpcCta
  heroImageSrc?: string
  heroImageAlt?: string
}

export interface PpcDemo {
  hidden?: boolean
  videoUrl?: string
  imageSrc?: string
  imageAlt?: string
  caption?: string
}

export interface PpcIconItem {
  iconName?: string
  title: string
  description?: string
}

export interface PpcPainPoints {
  hidden?: boolean
  heading?: string
  items: PpcIconItem[]
}

export interface PpcSolutionItem {
  iconName?: string
  text: string
}

export interface PpcSolutions {
  hidden?: boolean
  heading?: string
  items: PpcSolutionItem[]
  ctaPrimary?: PpcCta
  ctaSecondary?: PpcCta
}

export interface PpcFeatureItem {
  title: string
  bullets: string[]
  /** Ảnh minh hoạ feature, ngang 16:9. Nếu có → hiển thị zigzag (xen kẽ trái/phải). */
  imageSrc?: string
  imageAlt?: string
}

export interface PpcFeatures {
  hidden?: boolean
  heading?: string
  items: PpcFeatureItem[]
}

export interface PpcPricingPlan {
  name: string
  subtitle?: string
  originalPrice?: string
  price: string
  period?: string
  badge?: string
  featured?: boolean
  features: string[]
  ctaText: string
  ctaHref: string
}

export interface PpcPricing {
  hidden?: boolean
  heading?: string
  description?: string
  plans: PpcPricingPlan[]
}

export interface PpcCommitments {
  hidden?: boolean
  heading?: string
  items: PpcIconItem[]
}

export interface PpcTestimonial {
  quote: string
  name: string
  role?: string
  avatarSrc?: string
}

export interface PpcTestimonials {
  hidden?: boolean
  heading?: string
  items: PpcTestimonial[]
}

export interface PpcFaqItem {
  q: string
  a: string
}

export interface PpcFaq {
  hidden?: boolean
  heading?: string
  items: PpcFaqItem[]
}

export interface PpcFinalCta {
  hidden?: boolean
  heading?: string
  description?: string
  ctaText?: string
  ctaHref?: string
}

/** Trust strip — dòng chữ dưới hero, vd: "Đã có 134 shop online + spa tin dùng" */
export interface PpcTrustStrip {
  hidden?: boolean
  text?: string
}

/** Sticky bottom bar — bám đáy màn hình khi scroll. Hiển thị tên + giá + 2 nút CTA */
export interface PpcStickyBottom {
  enabled?: boolean
  priceLabel?: string
  ctaPrimaryText?: string
  ctaPrimaryHref?: string
  ctaSecondaryText?: string
  ctaSecondaryHref?: string
}

export interface ProductPageConfig {
  hero?: PpcHero
  demo?: PpcDemo
  painPoints?: PpcPainPoints
  solutions?: PpcSolutions
  features?: PpcFeatures
  pricing?: PpcPricing
  commitments?: PpcCommitments
  testimonials?: PpcTestimonials
  faq?: PpcFaq
  finalCta?: PpcFinalCta
  trustStrip?: PpcTrustStrip
  stickyBottom?: PpcStickyBottom
}

export interface CreateCategoryPayload {
  name: string
  slug: string
  description?: string
  parentId?: number | null
  status?: CategoryStatus
}

export * from "./menu"
export * from "./post"

// ─── Homepage config ──────────────────────────────────────────────────────────

export interface HomepageHeroConfig {
  hidden?: boolean
  badge: string
  headline: string
  headlineHighlight: string
  description: string
  ctaPrimaryText: string
  ctaPrimaryHref: string
  ctaSecondaryText: string
  badges: string[]
  /** URL ảnh hero bên phải. Để trống = hiển thị mockup CSS mặc định. */
  heroImageSrc?: string | null
  heroImageAlt?: string | null
}

export interface HomepagePainPointsConfig {
  hidden?: boolean
  heading: string
  headingEm: string
  description: string
  items: { title: string; description: string }[]
}

export interface HomepageHowItWorksConfig {
  hidden?: boolean
  heading: string
  headingEm: string
  description: string
  steps: { title: string; description: string }[]
}

export interface HomepageWhyItem {
  /** Lucide icon name (preferred) */
  iconName?: string
  /** Legacy emoji icon (fallback) */
  icon?: string
  title: string
  description: string
}

export interface HomepageWhyConfig {
  hidden?: boolean
  label: string
  heading: string
  description: string
  items: HomepageWhyItem[]
  stats: { value: string; label: string }[]
  quote: string
  quoteAuthor: string
}

export interface HomepagePricingPlan {
  name: string
  subtitle: string
  price: string
  period: string
  badge?: string
  featured?: boolean
  features: string[]
  ctaText: string
  ctaHref: string
}

export interface HomepagePricingConfig {
  hidden?: boolean
  heading: string
  description: string
  disclaimer: string
  plans: HomepagePricingPlan[]
}

export interface HomepageCtaConfig {
  hidden?: boolean
  heading: string
  description: string
  ctaPrimaryText: string
  ctaPrimaryHref: string
  ctaSecondaryText: string
  ctaSecondaryHref: string
  note: string
}

export interface HomepageServicesSectionConfig {
  hidden?: boolean
  label: string
  heading: string
  headingEm: string
  headingSuffix: string
  description: string
}

export interface HomepageAiAgentSectionConfig {
  hidden?: boolean
  label: string
  heading: string
  headingEm: string
  description: string
}

export interface HomepageShowcaseTab {
  label: string
  imageSrc?: string
  imageAlt?: string
  imageCaption?: string
  title?: string
  description?: string
  ctaText?: string
  ctaHref?: string
}

export interface HomepageShowcaseConfig {
  hidden?: boolean
  heading: string
  headingEm: string
  headingSuffix: string
  description: string
  tabs: HomepageShowcaseTab[]
}

export interface HomepageBlogConfig {
  hidden?: boolean
  heading: string
  headingEm: string
  ctaText: string
  ctaHref: string
}

export interface HomepageHighlightImage {
  src: string
  alt: string
}

export interface HomepageHighlightsConfig {
  hidden?: boolean
  heading: string
  headingEm: string
  images: HomepageHighlightImage[]
}

// ─── Commitments (shared — dùng chung mọi nơi) ────────────────────────────────

export interface CommitmentItem {
  iconName?: string
  title: string
  description?: string
}

// ─── Contact page config ──────────────────────────────────────────────────────

export interface ContactOffice {
  name: string
  address: string
}

export interface WorkingHourSlot {
  day: string
  time: string
}

export interface ContactConfig {
  form: {
    heading: string
    description: string
    needs: string[]
    submitText: string
    noteText: string
    successHeading: string
    successText: string
  }
  quickContact: {
    heading: string
    description: string
    zaloText: string
    zaloHref: string
    phoneText: string
    phoneHref: string
  }
  info: {
    sectionTitle: string
    offices: ContactOffice[]
    hotlines: string[]
    emails: string[]
  }
  workingHours: {
    sectionTitle: string
    slots: WorkingHourSlot[]
    note: string
  }
}

// ─── Footer config ────────────────────────────────────────────────────────────

export interface FooterSocial {
  type: string
  href: string
}

export interface FooterLink {
  icon: string
  label: string
  href: string
}

export interface FooterColumn {
  title: string
  links: FooterLink[]
}

export interface FooterSection {
  type?: 'links' | 'text'
  title: string
  links?: FooterLink[]
}

export interface FooterLegalLink {
  label: string
  href: string
}


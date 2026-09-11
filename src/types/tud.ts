/**
 * Kiểu dữ liệu cho trang chủ TopỨngDụng.
 *
 * Hai nguồn:
 *  - Chữ + cấu hình  → site_settings key "tud-home"  (sửa ở /admin/trang-chu)
 *  - Nội dung thật   → posts trong danh mục "Ứng dụng" và các danh mục tin
 *                      (sửa ở /admin/posts)
 */

/** Ảnh chụp màn hình sản phẩm */
export interface TudAppShot {
  url: string
  caption?: string
}

/** Một tiêu chí chấm điểm thành phần */
export interface TudAppScoreItem {
  label: string
  value: number
}

/** Một gói giá */
export interface TudAppPlan {
  name: string
  price: string
  period?: string
  features: string[]
  featured?: boolean
}

/** Một cặp hỏi — đáp */
export interface TudAppFaq {
  q: string
  a: string
}

/** Metadata app — lưu trong post.productPageConfig.app */
export interface TudAppMeta {
  // ─── Cơ bản (dùng ở trang chủ và trang danh mục) ───────────────────────────
  /** Điểm đánh giá, ví dụ 9.6 */
  score?: number
  /** Nhãn loại: "AI Assistant", "Video Editor"... */
  kind?: string
  /** Chữ trong ô logo khi chưa có ảnh: "GPT", "CA"... */
  logoText?: string
  /** CSS background cho ô logo (gradient) */
  logoBg?: string
  /** Biến động thứ hạng: "↑ 2", "→", "↓ 1" */
  trend?: string
  /** true → tô màu cam cho trend */
  trendUp?: boolean
  /** Nhãn tính năng: ["✓ Free", "✓ Windows"] */
  tags?: string[]
  /** Chữ lớn trong khối art của thẻ featured: "CUT." */
  /** Ảnh cho khung lớn ở khối Top Picks trang chủ. Không có thì lần lượt dùng
   *  thumbnail bài viết, rồi ảnh chụp đầu tiên, cuối cùng mới tới logo + tên. */
  artImage?: string

  // ─── Bài review chi tiết (/app/<slug>) ─────────────────────────────────────
  /** Câu chốt ngắn dưới tên app */
  tagline?: string
  /** Link trang chủ sản phẩm */
  website?: string
  /** Chữ trên nút chính, mặc định "Truy cập trang chủ" */
  ctaText?: string
  /** Nhà phát triển */
  developer?: string
  /** Nền tảng hỗ trợ: ["Web", "Windows", "iOS"] */
  platforms?: string[]
  /** Tóm tắt giá: "Miễn phí · Bản Pro từ 490k/tháng" */
  pricingSummary?: string
  /** Ngôn ngữ hỗ trợ */
  languages?: string
  /** Ảnh chụp màn hình sản phẩm */
  shots?: TudAppShot[]
  /** Điểm thành phần — vẽ thành thanh ngang */
  scoreBreakdown?: TudAppScoreItem[]
  /** Điểm mạnh */
  pros?: string[]
  /** Điểm yếu */
  cons?: string[]
  /** Ai nên dùng */
  bestFor?: string[]
  /** Bảng giá */
  plans?: TudAppPlan[]
  /** Câu hỏi thường gặp */
  faq?: TudAppFaq[]
  /** Kết luận cuối bài */
  verdict?: string
}

export interface TudLink {
  label: string
  href: string
  /** Tô cam kèm mũi tên — dùng cho một liên kết muốn người dùng bấm nhất */
  highlight?: boolean
}

export interface TudHeaderConfig {
  /** Chữ trong ô xanh: "TOP" */
  brandTop: string
  /** Chữ tiếp theo: "ỨNGDỤNG" */
  brandRest: string
  /** Đuôi tên miền sau dấu chấm cam: "net". Để trống thì chỉ hiện dấu chấm. */
  brandSuffix?: string
  links: TudLink[]
  searchText: string
  suggestText: string
}

export interface TudHeroConfig {
  eyebrow: string
  line1: string
  line2: string
  line3: string
  description: string
  searchPlaceholder: string
  searchButton: string
  chips: string[]
}

export interface TudTrendingConfig {
  hidden?: boolean
  label: string
}

export interface TudDiscoverCard {
  num: string
  icon: string
  title: string
  /** Phần cuối tiêu đề trang danh mục được tô cam, ví dụ "AI" */
  titleAccent?: string
  /** Slug danh mục con — dùng để đếm số ứng dụng và sinh link /ungdung/<slug> */
  categorySlug?: string
  /** Ghi đè dòng đếm. Để trống → tự đếm theo categorySlug */
  countText?: string
  /** Ghi đè đường dẫn. Để trống → /ungdung/<categorySlug> */
  href?: string
  /**
   * Nhãn ngắn hiện trên thẻ (vd "Xây kênh"). Để trống → dùng tên danh mục lấy
   * từ API. `title` kiểu "TÔI MUỐN LÀM VIDEO" quá dài cho thẻ gọn nên không dùng.
   */
  shortTitle?: string
  /**
   * Dòng mô tả các nhóm con. Để trống → tự ghép tên danh mục con.
   * Đặt tay khi tên danh mục thật quá dài, cho thẻ gọn hơn.
   */
  blurb?: string
}

export interface TudDiscoverConfig {
  hidden?: boolean
  eyebrow: string
  heading: string
  /** Phần cuối tiêu đề được tô màu xanh, ví dụ "làm gì?" */
  headingAccent?: string
  description: string
  cards: TudDiscoverCard[]
}

export interface TudPicksConfig {
  hidden?: boolean
  eyebrow: string
  heading: string
  description: string
  /** Phần cuối tiêu đề được tô cam, ví dụ "tuần này." */
  headingAccent?: string
  /** Link phụ bên phải phần mô tả; để trống thì không hiện */
  viewAllText?: string
  viewAllHref?: string
  /** slug bài viết app hiển thị lớn bên trái */
  featuredSlug: string
  featuredCta: string
  /** slug 4 app nhỏ bên phải */
  miniSlugs: string[]
  /** Chữ trên nút của 4 thẻ nhỏ, mặc định "Khám phá" */
  miniCta?: string
}

export interface TudStackStep {
  /** slug app; để trống thì dùng fallbackName/fallbackLogo */
  slug: string
  note: string
  /** Dòng mô tả nhỏ dưới tên bước */
  desc?: string
  /** Khoá biểu tượng: viet | giongnoi | video | anh | phantich */
  icon?: string
  fallbackName?: string
  fallbackLogo?: string
}

export interface TudStackConfig {
  hidden?: boolean
  eyebrow: string
  heading1: string
  heading2: string
  description: string
  ctaText: string
  /** Tiêu đề cột phải, mặc định "Quy trình xây kênh của bạn" */
  flowTitle?: string
  steps: TudStackStep[]
}

export interface TudBattleConfig {
  hidden?: boolean
  eyebrow: string
  heading: string
  description: string
  leftSlug: string
  rightSlug: string
  ctaPrefix: string
}

export interface TudRankingConfig {
  hidden?: boolean
  eyebrow: string
  heading: string
  /** Phần cuối tiêu đề được tô cam, ví dụ "công cụ." */
  headingAccent?: string
  description: string
  filters: string[]
  /** số dòng hiển thị */
  limit: number
  /** Chữ trên nút cuối khối, mặc định "Xem toàn bộ bảng xếp hạng" */
  ctaText?: string
}

export interface TudEditConfig {
  hidden?: boolean
  eyebrow: string
  heading: string
  description: string
  /** slug bài viết lớn; để trống → tự lấy bài mới nhất của categorySlug */
  featuredSlug: string
  featuredMeta: string
  /** slug 3 bài nhỏ; để trống → tự lấy tiếp theo của categorySlug */
  listSlugs: string[]
  /** danh mục dùng để tự lấy bài khi không chỉ định slug */
  categorySlug: string
}

/** Dải prompt nổi bật ở cuối trang chủ, lấy ngẫu nhiên từ thư viện /prompt. */
export interface TudPromptRailConfig {
  hidden?: boolean
  eyebrow: string
  heading: string
  /** Phần cuối tiêu đề được tô cam, ví dụ "đáng thử" */
  headingAccent?: string
  description: string
  /** Số thẻ hiện trong dải; nên là bội của 4 để trang nào cũng đầy */
  limit: number
  /** Chữ trên nút cuối khối */
  ctaText?: string
}

export interface TudAiFinderConfig {
  hidden?: boolean
  eyebrow: string
  heading: string
  description: string
  placeholder: string
  buttonText: string
  emptyText: string
  resultLabel: string
  resultBody: string
  resultNote: string
}

export interface TudFooterColumn {
  title: string
  links: TudLink[]
}

export interface TudFooterConfig {
  /** Câu khẩu hiệu in đậm dưới logo */
  tagline: string
  /** Dòng giải thích nhạt hơn, ngay dưới khẩu hiệu */
  subline?: string
  columns: TudFooterColumn[]
  /** Dòng bản quyền ở thanh dưới cùng */
  copyright?: string
}

export interface TudHomeConfig {
  header: TudHeaderConfig
  hero: TudHeroConfig
  trending: TudTrendingConfig
  discover: TudDiscoverConfig
  picks: TudPicksConfig
  stack: TudStackConfig
  battle: TudBattleConfig
  ranking: TudRankingConfig
  edit: TudEditConfig
  aiFinder: TudAiFinderConfig
  promptRail: TudPromptRailConfig
  footer: TudFooterConfig
}

/** Kết quả bình chọn sao của một ứng dụng */
export interface TudVoteSummary {
  slug: string
  /** Trung bình 0–5 */
  average: number
  /** Tổng số phiếu */
  count: number
  /** Phiếu của chính khách đang xem, null nếu chưa bình chọn */
  myRating: number | null
  /** Số phiếu theo mức sao: [1,2,3,4,5] */
  distribution: number[]
}

// ─── Công cụ liên quan hiển thị chéo giữa các danh mục ────────────────────────
// Một app chỉ thuộc được một danh mục (posts.categoryId), nên với những app phục
// vụ hai nhóm (ví dụ Jasper vừa là AI viết lách vừa là công cụ marketing nội
// dung) ta giữ nguyên danh mục gốc và khai ở đây để trang kia dẫn sang.
// Dữ liệu nằm trong site_settings key `tud-related`, sửa được qua API admin.
export interface TudRelatedBlock {
  /** Tiêu đề khối, ví dụ "Công cụ AI hỗ trợ viết nội dung". */
  title: string
  /** Câu giải thích vì sao các app này xuất hiện ở đây. */
  note?: string
  /** Slug các bài viết cần dẫn sang. */
  slugs: string[]
}

/** Khoá là slug danh mục cần hiển thị khối liên quan. */
export type TudRelatedConfig = Record<string, TudRelatedBlock>

// ─── Mã theo dõi và xác minh của Google ──────────────────────────────────────
// Nằm trong site_settings key `tracking`, sửa ở /admin/theo-doi. Để trong CSDL
// thay vì biến môi trường vì NEXT_PUBLIC_* chỉ đọc lúc build — đổi mã là phải
// build lại, không hợp với thứ chủ site tự dán vào.
export interface TudTrackingConfig {
  /** Mã đo lường GA4, dạng G-XXXXXXXX. */
  gaId?: string
  /** Mã vùng chứa Google Tag Manager, dạng GTM-XXXXXXX. */
  gtmId?: string
  /** Chuỗi trong thẻ meta google-site-verification của Search Console. */
  googleSiteVerification?: string
}

import type { TudHomeConfig } from '@/types/tud'

/**
 * Config mặc định — dùng khi chưa seed `tud-home` hoặc khi BE không phản hồi.
 * Giữ đồng bộ với be-topungdung/src/database/seeds/topungdung.seed.ts
 */
export const DEFAULT_TUD_HOME: TudHomeConfig = {
  header: {
    brandTop: 'TOP',
    brandRest: 'ỨNGDỤNG',
    brandSuffix: 'net',
    links: [
      { label: 'Khám phá', href: '#discover' },
      { label: 'Bảng xếp hạng', href: '#ranking' },
      { label: 'Prompt', href: '/prompt' },
      { label: 'Bộ công cụ', href: '/topapp' },
      // Trỏ tới trang danh sách bài viết, không phải neo #review trên trang chủ:
      // người bấm mục này mong thấy danh sách bài chứ không phải cuộn xuống một khối.
      { label: 'Tin tức', href: '/tin-tuc' },
    ],
    searchText: 'Tìm kiếm',
    suggestText: '+ Đề xuất ứng dụng',
  },
  hero: {
    eyebrow: 'Khám phá ứng dụng cho công việc của bạn',
    // Tiêu đề chia hai dòng: dòng đầu ghép line1 (cam) với line2 (xanh đậm),
    // dòng sau là line3 tô chuyển sắc.
    line1: 'Tìm đúng',
    line2: 'ứng dụng.',
    line3: 'Làm việc tốt hơn.',
    description:
      'Khám phá, so sánh và lựa chọn ứng dụng, phần mềm và công cụ AI phù hợp với nhu cầu của bạn.',
    searchPlaceholder: 'Bạn muốn làm gì hôm nay?',
    searchButton: 'Tìm ứng dụng →',
    // Bấm vào chip sẽ chạy tìm kiếm với đúng cụm từ này.
    chips: ['Viết nội dung', 'Tạo video', 'Thiết kế', 'Marketing', 'Quản lý công việc'],
  },
  trending: { hidden: false, label: 'TRENDING NOW →' },
  discover: {
    hidden: false,
    eyebrow: 'KHÁM PHÁ THEO NHU CẦU',
    heading: 'Bạn đang muốn',
    headingAccent: 'làm gì?',
    description: 'Đừng tìm theo tên phần mềm. Hãy bắt đầu từ việc bạn thực sự muốn hoàn thành.',
    // `shortTitle` để trống → thẻ tự lấy tên danh mục thật từ API.
    // Chỉ đặt tay cho creator vì tên danh mục trong CSDL là "Creator".
    cards: [
      { num: '01 / VIDEO', icon: '🎬', title: 'Tôi muốn làm', titleAccent: 'video', categorySlug: 'video',
        blurb: 'Dựng phim, quay màn hình, xử lý, phụ đề' },
      { num: '02 / MARKETING', icon: '📣', title: 'Tôi muốn làm', titleAccent: 'marketing', categorySlug: 'marketing',
        blurb: 'SEO, email, mạng xã hội, landing page, phân tích' },
      { num: '03 / AI', icon: '✦', title: 'Tôi muốn dùng', titleAccent: 'AI', categorySlug: 'ai',
        blurb: 'Chatbot, tạo ảnh, tạo video, giọng nói, viết lách' },
      { num: '04 / SALES', icon: '💰', title: 'Tôi muốn', titleAccent: 'bán hàng', categorySlug: 'sales',
        blurb: 'CRM, POS, thương mại điện tử, chăm sóc khách hàng' },
      { num: '05 / CREATOR', icon: '▶', title: 'Tôi muốn', titleAccent: 'xây kênh', categorySlug: 'creator',
        shortTitle: 'Xây kênh', blurb: 'YouTube, podcast, phát trực tiếp, kiếm tiền' },
      { num: '06 / DESIGN', icon: '✏', title: 'Tôi muốn', titleAccent: 'thiết kế', categorySlug: 'design',
        blurb: 'Vector, giao diện, website, 3D, thuyết trình' },
      { num: '07 / TỔNG HỢP', icon: '🧩', title: 'Tôi muốn', titleAccent: 'xem thêm', categorySlug: 'tonghop',
        blurb: 'Văn phòng, bảo mật, lưu trữ, trình duyệt, developer, tài chính' },
      { num: '08 / DOANH NGHIỆP', icon: '🏢', title: 'Tôi muốn', titleAccent: 'quản trị doanh nghiệp',
        categorySlug: 'doanh-nghiep', shortTitle: 'Doanh nghiệp',
        blurb: 'Nhân sự, vận hành, ERP, quản trị, pháp lý, chữ ký số' },
    ],
  },
  picks: {
    hidden: false,
    eyebrow: 'TOP ỨNG DỤNG',
    heading: 'Được chọn nhiều',
    headingAccent: 'tuần này.',
    viewAllText: 'Xem tất cả →',
    viewAllHref: '/ranking',
    description:
      'Những công cụ nổi bật dựa trên tính hữu ích, trải nghiệm, mức độ phổ biến và giá trị sử dụng.',
    featuredSlug: 'capcut',
    featuredCta: 'Xem review →',
    miniSlugs: ['chatgpt', 'canva', 'claude', 'elevenlabs'],
    miniCta: 'Khám phá',
  },
  stack: {
    hidden: false,
    eyebrow: 'BỘ CÔNG CỤ XÂY KÊNH',
    heading1: 'Xây kênh',
    heading2: 'bắt đầu từ đây.',
    description:
      'Một bộ công cụ hoàn chỉnh dành cho người xây kênh: từ ý tưởng → voice → edit → thiết kế → đăng tải.',
    ctaText: 'Khám phá bộ công cụ →',
    flowTitle: 'Quy trình xây kênh của bạn',
    steps: [
      { slug: 'chatgpt', note: 'Viết kịch bản', desc: 'Lên ý tưởng và phát triển nội dung', icon: 'viet' },
      { slug: 'elevenlabs', note: 'Tạo giọng đọc', desc: 'Chuyển văn bản thành giọng nói', icon: 'giongnoi' },
      { slug: 'capcut', note: 'Chỉnh sửa video', desc: 'Dựng phim, thêm phụ đề và hiệu ứng', icon: 'video' },
      { slug: 'canva', note: 'Thiết kế thumbnail', desc: 'Tạo ảnh bìa và hình ảnh cho kênh', icon: 'anh' },
      { slug: 'youtube-studio', note: 'Xuất bản & phân tích', desc: 'Đăng tải và theo dõi hiệu quả', icon: 'phantich' },
    ],
  },
  battle: {
    // Đã ẩn: thay bằng mục Thư viện Prompt ở /prompt
    hidden: true,
    eyebrow: 'APP BATTLE',
    heading: 'Đặt lên bàn cân.',
    description: 'So sánh trực diện theo nhu cầu thực tế thay vì chỉ nhìn danh sách tính năng.',
    leftSlug: 'capcut',
    rightSlug: 'canva',
    ctaPrefix: 'Chọn',
  },
  ranking: {
    hidden: false,
    eyebrow: 'TOP ỨNG DỤNG 100',
    heading: 'Bảng xếp hạng',
    headingAccent: 'công cụ.',
    description:
      'Khám phá những công cụ đáng dùng, từ đánh giá của biên tập và cộng đồng.',
    filters: ['Tất cả', 'AI', 'Video', 'Marketing', 'Business', 'Free'],
    limit: 5,
    ctaText: 'Xem toàn bộ bảng xếp hạng →',
  },
  edit: {
    hidden: false,
    eyebrow: 'THE EDIT',
    heading: 'Đọc ít hơn. Chọn đúng hơn.',
    description:
      'Nội dung biên tập theo phong cách tạp chí công nghệ: review, so sánh, top list và hướng dẫn.',
    featuredSlug: '',
    featuredMeta: 'THE BIG LIST · 12 PHÚT ĐỌC',
    listSlugs: [],
    categorySlug: 'tin-tuc',
  },
  promptRail: {
    hidden: false,
    eyebrow: 'THƯ VIỆN PROMPT',
    heading: 'Prompt',
    headingAccent: 'đáng thử',
    description: 'Khám phá prompt hữu ích cho công việc. Xem nội dung và sao chép để dùng ngay.',
    limit: 8,
    ctaText: 'Xem toàn bộ thư viện prompt →',
  },
  aiFinder: {
    // Đã ẩn: ô tìm kiếm ở đầu trang đã làm đúng việc này rồi.
    hidden: true,
    eyebrow: '✦ TOP AI FINDER',
    heading: 'KHÔNG BIẾT CHỌN ỨNG DỤNG NÀO?',
    description:
      'Nói cho TopỨngDụng biết bạn muốn làm gì. Hệ thống sẽ gợi ý bộ công cụ phù hợp, chi phí dự kiến và cách kết hợp chúng.',
    placeholder: 'Ví dụ: Tôi bán hàng TikTok và muốn tạo 10 video mỗi ngày...',
    buttonText: '✦ Tìm công cụ cho tôi',
    emptyText: 'Nhập nhu cầu của bạn để nhận gợi ý.',
    resultLabel: 'Gợi ý demo:',
    resultBody: 'ChatGPT → ElevenLabs → CapCut → Canva.',
    resultNote:
      'Bản production có thể dùng AI để cá nhân hóa theo ngân sách, nền tảng và mục tiêu.',
  },
  footer: {
    tagline: 'Tìm đúng ứng dụng - Làm việc tốt hơn',
    subline: 'Khám phá, so sánh và lựa chọn công cụ phù hợp với bạn.',
    copyright: '© 2026 TOPUNGDUNG.NET. Bảo lưu mọi quyền.',
    columns: [
      {
        title: 'KHÁM PHÁ',
        links: [
          { label: 'Video', href: '/ungdung/video' },
          { label: 'Marketing', href: '/ungdung/marketing' },
          { label: 'AI', href: '/ungdung/ai' },
          { label: 'Bán hàng', href: '/ungdung/sales' },
          { label: 'Xây kênh', href: '/ungdung/creator' },
          { label: 'Thiết kế', href: '/ungdung/design' },
          { label: 'Tổng hợp', href: '/ungdung/tonghop' },
        ],
      },
      {
        title: 'NỘI DUNG',
        links: [
          { label: 'Bảng xếp hạng', href: '/ranking' },
          { label: 'Tin tức', href: '/tin-tuc' },
          { label: 'So sánh', href: '/#compare' },
          { label: 'Bộ công cụ', href: '/topapp' },
          { label: 'Thư viện Prompt', href: '/prompt' },
        ],
      },
      {
        title: 'TOPỨNGDỤNG',
        links: [
          { label: 'Giới thiệu', href: '/introduction' },
          { label: 'Đề xuất ứng dụng', href: '/lien-he', highlight: true },
          { label: 'Liên hệ', href: '/lien-he' },
          { label: 'Điều khoản', href: '/dieu-khoan-su-dung' },
          { label: 'Chính sách bảo mật', href: '/chinh-sach-bao-mat' },
        ],
      },
    ],
  },
}

/** Ghép config từ DB lên default — thiếu field nào thì lấy của default. */
export function mergeTudConfig(remote: Partial<TudHomeConfig> | null | undefined): TudHomeConfig {
  if (!remote) return DEFAULT_TUD_HOME
  const d = DEFAULT_TUD_HOME
  return {
    header: { ...d.header, ...remote.header },
    hero: { ...d.hero, ...remote.hero },
    trending: { ...d.trending, ...remote.trending },
    discover: { ...d.discover, ...remote.discover },
    picks: { ...d.picks, ...remote.picks },
    stack: { ...d.stack, ...remote.stack },
    battle: { ...d.battle, ...remote.battle },
    ranking: { ...d.ranking, ...remote.ranking },
    edit: { ...d.edit, ...remote.edit },
    aiFinder: { ...d.aiFinder, ...remote.aiFinder },
    promptRail: { ...d.promptRail, ...remote.promptRail },
    footer: { ...d.footer, ...remote.footer },
  }
}

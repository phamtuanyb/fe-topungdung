import type { AiCard, Article, PainCard, Plan, ServiceCard, WhyItem, WhyStat } from './types';

// ─── Pricing Plans ──────────────────────────────────────────────────────────

export const PLANS: Plan[] = [
  {
    name: 'Starter',
    sub: 'Hộ KD, Startup, Shop nhỏ',
    price: '15',
    period: '/ dự án trọn gói',
    features: [
      '1 phần mềm vertical chuẩn hoá',
      '1 AI Agent cơ bản (Sales hoặc CSKH)',
      'Triển khai 2–4 tuần',
      'Đào tạo 1 buổi',
      'Bảo hành 6 tháng',
    ],
    cta: { label: 'Nhận tư vấn', href: 'https://zalo.me/vsoftware', variant: 'ghost' },
    featured: false,
  },
  {
    name: 'Growth',
    sub: 'SME 10–50 nhân sự',
    price: '80',
    period: '/ dự án trọn gói',
    badge: 'PHỔ BIẾN NHẤT',
    features: [
      'Phần mềm theo yêu cầu (custom)',
      '2–3 module mở rộng theo nghiệp vụ',
      '2 AI Agent (Sales + CSKH/Marketing)',
      'App Mobile hỗ trợ (nếu cần)',
      'Bảo hành 12 tháng + đào tạo nội bộ',
    ],
    cta: { label: 'Đặt lịch khảo sát', href: 'https://zalo.me/vsoftware', variant: 'solid' },
    featured: true,
  },
  {
    name: 'Enterprise',
    sub: 'SME 50+ / Chuyển đổi số tổng thể',
    price: '300',
    period: '/ dự án trọn gói',
    features: [
      'Full custom theo nghiệp vụ riêng',
      <>AI Agent <strong>toàn phòng ban</strong></>,
      'App Mobile iOS + Android',
      'Tích hợp ERP, CRM, kế toán có sẵn',
      'Bảo hành 18 tháng + SLA cam kết',
    ],
    cta: { label: 'Gặp chuyên gia', href: 'tel:+84123456789', variant: 'ghost' },
    featured: false,
  },
]

// ─── Blog Articles ───────────────────────────────────────────────────────────

export const FEATURED_ARTICLE: Article = {
  href: '/tin-tuc',
  img: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=900&h=340&q=80',
  imgAlt: 'AI cho doanh nghiệp',
  badge: 'Kiến thức AI',
  title: 'AI Agent cho doanh nghiệp Việt: Từ chatbot đơn giản đến nhân viên AI làm việc 24/7',
  meta: 'Vsoftware Team — 18/05/2026',
  excerpt:
    'Phân biệt chatbot trả lời câu hỏi và AI Agent thực sự làm việc: xử lý đơn hàng, chăm lead, tổng hợp báo cáo, tự động hóa quy trình vận hành — tất cả không cần con người giám sát.',
}

export const SIDE_ARTICLES: Article[] = [
  {
    href: '/tin-tuc',
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=200&h=120&q=80',
    imgAlt: 'Phần mềm bán hàng',
    title: 'Top 10 phần mềm quản lý bán hàng tốt nhất cho SME Việt 2026',
    meta: 'Vsoftware Team — 15/05/2026',
    excerpt: 'So sánh tính năng, giá cả và phù hợp theo ngành — từ POS đơn giản đến CRM đầy đủ.',
  },
  {
    href: '/tin-tuc',
    img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=200&h=120&q=80',
    imgAlt: 'Setup CSKH',
    title: 'Hướng dẫn setup AI CSKH trong 1 ngày — không cần lập trình',
    meta: 'Vsoftware Team — 12/05/2026',
    excerpt: 'Tài liệu chi tiết từ A–Z: đăng ký, train AI, kết nối Zalo OA và Facebook, go-live trong 24 giờ.',
  },
  {
    href: '/tin-tuc',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=200&h=120&q=80',
    imgAlt: 'Case study',
    title: 'Case Study: Chuỗi spa 5 chi nhánh tăng 40% doanh thu sau 3 tháng',
    meta: 'Vsoftware Team — 08/05/2026',
    excerpt: 'Câu chuyện thực tế từ khách hàng — từ Excel và Zalo thủ công đến hệ thống tự động hoàn toàn.',
  },
]

// ─── Pain Points ─────────────────────────────────────────────────────────────

export const PAIN_CARDS: PainCard[] = [
  {
    color: 'blue',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
      </svg>
    ),
    title: 'Quản lý bằng Excel, Zalo, giấy tờ',
    desc: 'Dữ liệu phân tán, sai sót, mất thời gian tổng hợp. Sếp muốn báo cáo — nhân viên loay hoay cả ngày.',
  },
  {
    color: 'orange',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" />
        <path d="M16.5 9.4 7.55 4.24" />
        <polyline points="3.29 7 12 12 20.71 7" />
        <line x1="12" y1="22" x2="12" y2="12" />
        <path d="m17 13 5 5m-5 0 5-5" />
      </svg>
    ),
    title: 'Phần mềm mua rồi không dùng được',
    desc: 'Mua giải pháp có sẵn nhưng không vừa quy trình. Tiền mất, nhân viên vẫn làm tay, không ai hài lòng.',
  },
  {
    color: 'blue',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="7" r="4" />
        <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
        <circle cx="19" cy="11" r="2" />
        <path d="M19 8v1M19 13v1M16.5 9.5l.7.7M21.5 12.5l.7.7M22 11h-1M17 11h-1M21.5 9.5l-.7.7M16.5 12.5l-.7.7" />
      </svg>
    ),
    title: 'Quy trình vận hành bằng người, không bằng hệ thống',
    desc: 'Nhân viên chủ chốt nghỉ việc — quy trình đứng lại. Kiến thức nằm trong đầu người chứ không trong phần mềm.',
  },
  {
    color: 'orange',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
        <polyline points="16 17 22 17 22 11" />
      </svg>
    ),
    title: 'Không có dữ liệu để ra quyết định',
    desc: 'Không biết khách nào sinh lời, kênh nào hiệu quả, nhân viên nào bán tốt. Quyết định bằng cảm tính = rủi ro.',
  },
]

// ─── Services ────────────────────────────────────────────────────────────────

export const SERVICES_GRID: ServiceCard[] = [
  {
    icon: '💻',
    color: 'blue',
    title: 'Phần mềm theo yêu cầu',
    desc: 'Build từ đầu theo đúng quy trình, đúng ngành của bạn. Bán hàng, kho, nhân sự, kế toán — không giới hạn.',
    tags: ['Web App', 'Desktop', 'Đa nền tảng'],
    href: '/dich-vu/phan-mem-ban-hang',
  },
  {
    icon: '📊',
    color: 'orange',
    title: 'CRM — Quản lý khách hàng',
    desc: 'Pipeline bán hàng, lịch sử giao dịch, chăm sóc tự động, báo cáo real-time. Sales không còn quên follow-up.',
    tags: ['Pipeline', 'Automation', 'Báo cáo'],
    href: '/dich-vu/crm-cho-sme',
  },
  {
    icon: '📱',
    color: 'blue',
    title: 'App Mobile cho doanh nghiệp',
    desc: 'iOS + Android. App cho nhân viên, app cho khách hàng. Phê duyệt đơn hàng trên điện thoại, chấm công GPS.',
    tags: ['iOS', 'Android', 'React Native'],
    href: '/dich-vu/app-ban-hang',
  },
  {
    icon: '⚡',
    color: 'orange',
    title: 'AI & Automation',
    desc: 'Tự động hóa quy trình lặp đi lặp lại. Chatbot tư vấn 24/7, phân loại đơn hàng, tóm tắt email khách tự động.',
    tags: ['Chatbot AI', 'Workflow', 'OCR'],
    href: '/dich-vu/ai-automation',
  },
  {
    icon: '🌐',
    color: 'blue',
    title: 'Website & Landing Page',
    desc: 'Website bán hàng, landing campaign, portfolio công ty. Chuẩn SEO, tốc độ cao, tích hợp form lead và CRM.',
    tags: ['Next.js', 'CMS', 'SEO Ready'],
    href: '/dich-vu/website-landing',
  },
  {
    icon: '🎨',
    color: 'orange',
    title: 'Thiết kế Website',
    desc: 'Thiết kế UI/UX chuyên nghiệp từ Figma đến prototype tương tác. Đúng thương hiệu, mobile-first, người dùng hiểu ngay.',
    tags: ['UI/UX', 'Figma', 'Mobile-first'],
    href: '/dich-vu/thiet-ke-website',
  },
]

// ─── AI Agent Cards ───────────────────────────────────────────────────────────

export const AI_CARDS: AiCard[] = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    color: 'blue',
    badge: 'BÁN CHẠY',
    title: 'AI Agent Sales',
    desc: 'Chăm lead 24/7, viết kịch bản tư vấn, nhắc lịch, đồng bộ CRM. Không bỏ sót khách quan tâm.',
    checks: [
      'Auto reply Facebook / Zalo / Web',
      'Sinh quote, gửi báo giá tự động',
      'Phân loại lead nóng / ấm / nguội',
    ],
    href: '/ai-agent/ai-agent-sales',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    color: 'orange',
    title: 'AI Agent Marketing',
    desc: 'Gen content, lên kế hoạch post, A/B test caption, phân tích hiệu suất chiến dịch.',
    checks: [
      'Sinh content fanpage, TikTok, blog',
      'Lên content calendar 30 ngày',
      'Dashboard hiệu suất realtime',
    ],
    href: '/ai-agent/ai-agent-marketing',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    color: 'blue',
    title: 'AI Agent CSKH',
    desc: 'Chatbot đa kênh + Voice Bot. Trả lời nghiệp vụ, tra cứu đơn, escalate đúng người.',
    checks: [
      'Facebook + Zalo + Web + Email',
      'Voice Bot tổng đài tự động',
      'Học theo data lịch sử CSKH',
    ],
    href: '/ai-agent/ai-agent-cskh',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
    color: 'blue',
    title: 'AI Agent Kế toán',
    desc: 'Đối soát số liệu, cảnh báo bất thường, kết nối hóa đơn điện tử, lập báo cáo định kỳ.',
    checks: [
      'Tự động đối soát giao dịch ngân hàng',
      'Cảnh báo dòng tiền âm',
      'Tích hợp Fast / MISA / Bravo',
    ],
    href: '/ai-agent/ai-agent-ketoan',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    color: 'blue',
    title: 'AI Agent Nhân sự',
    desc: 'Sàng CV, hỏi đáp ứng viên, onboard nhân sự mới, đánh giá KPI định kỳ.',
    checks: [
      'Tự động chấm CV theo JD',
      'Chatbot onboarding nội bộ',
      'Tổng hợp đánh giá 360°',
    ],
    href: '/ai-agent/ai-agent-nhansu',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
        <line x1="2" y1="20" x2="22" y2="20" />
      </svg>
    ),
    color: 'featured',
    title: 'AI Agent Báo cáo CEO',
    desc: 'Daily / Weekly dashboard tự động. Cảnh báo rủi ro. Gợi ý hành động chiến lược.',
    checks: [
      'Báo cáo daily qua Zalo / Telegram',
      'Tổng hợp data đa nguồn',
      'Cảnh báo bất thường KPI',
    ],
    href: '/ai-agent/ai-agent-baocao-ceo',
  },
]

// ─── Why Vsoftware ────────────────────────────────────────────────────────────

export const WHY_ITEMS: WhyItem[] = [
  {
    icon: '🎯',
    color: 'blue',
    title: 'Đúng bài toán — không bán tính năng thừa',
    desc: 'Chúng tôi phân tích quy trình thực tế của bạn, chỉ build những gì bạn thực sự cần. Không phình scope, không thu thêm chi phí ẩn.',
  },
  {
    icon: '⚡',
    color: 'orange',
    title: 'Triển khai nhanh 4–8 tuần',
    desc: 'Methodology chia nhỏ module, bàn giao cuốn chiếu. Bạn dùng được phần đầu trong khi phần sau đang build.',
  },
  {
    icon: '🏢',
    color: 'blue',
    title: 'Thuộc ViTechGroup — có pháp nhân, có địa chỉ',
    desc: 'Không phải freelancer "biến mất sau khi nhận tiền". Hợp đồng rõ ràng, có văn phòng, có đội ngũ chuyên trách bảo hành sau bàn giao.',
  },
  {
    icon: '💰',
    color: 'orange',
    title: 'Chi phí minh bạch từ đầu',
    desc: 'Báo giá chi tiết theo module. Không tăng giá giữa dự án. Dự án nhỏ từ 30 triệu, thanh toán theo milestone thực tế bàn giao.',
  },
]

export const WHY_STATS: WhyStat[] = [
  { num: '8+', label: 'Năm kinh nghiệm team công nghệ' },
  { num: '4–8\ntuần', label: 'Thời gian triển khai trung bình' },
  { num: '100%', label: 'Dự án có demo trước khi ký' },
  { num: '12\ntháng', label: 'Bảo hành & hỗ trợ sau bàn giao' },
]

// ─── How It Works Steps ───────────────────────────────────────────────────────

export const HOW_IT_WORKS_STEPS = [
  {
    num: '1',
    title: 'Tư vấn & Phân tích',
    desc: (
      <>
        Nghe bài toán, phân tích quy trình hiện tại, đề xuất giải pháp phù hợp nhất.{' '}
        <strong className="text-white">Miễn phí 30 phút.</strong>
      </>
    ),
    orange: false,
  },
  {
    num: '2',
    title: 'Thiết kế & Demo',
    desc: (
      <>
        Wireframe, UI mockup đúng nghiệp vụ của bạn.{' '}
        <strong className="text-white">Anh xem trước khi ký</strong> — không ưng thì nói thẳng.
      </>
    ),
    orange: false,
  },
  {
    num: '3',
    title: 'Phát triển & Test',
    desc: (
      <>
        Code, test kỹ, demo từng module. Cập nhật tiến độ hàng tuần.{' '}
        <strong className="text-white">Không biến mất giữa dự án.</strong>
      </>
    ),
    orange: false,
  },
  {
    num: '4',
    title: 'Bàn giao & Hỗ trợ',
    desc: (
      <>
        Training nhân viên, tài liệu sử dụng, hỗ trợ 24/7 tháng đầu.{' '}
        <strong className="text-white">Bảo hành 12 tháng.</strong>
      </>
    ),
    orange: true,
  },
]

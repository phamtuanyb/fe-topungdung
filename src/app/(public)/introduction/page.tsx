import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import PageHero from '@/components/common/PageHero'
import CTASection from '@/components/common/CTASection'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Giới thiệu Vsoftware — Phần mềm theo yêu cầu cho SME Việt Nam',
  description:
    'Công ty CP Giải pháp Vsoftware — phần mềm theo yêu cầu cho SME Việt Nam. Rõ ràng · Thực tế · Công nghệ · Tối ưu · Đồng hành. Top 1 Việt Nam về phần mềm theo yêu cầu vào 2030.',
}

// 4 KPI với icon + gradient
const KPIS = [
  {
    num: '100%',
    icon: '🎯',
    label: 'Theo yêu cầu',
    desc: 'Phần mềm thiết kế đúng nghiệp vụ riêng của bạn',
    gradient: 'from-vs-orange to-vs-orange-dark',
    glow: 'shadow-[0_20px_50px_-15px_rgba(255,107,0,0.5)]',
  },
  {
    num: '10+',
    icon: '🏆',
    label: 'Năm kinh nghiệm',
    desc: 'Đội ngũ kỹ thuật vững vàng, đa nền tảng',
    gradient: 'from-vs-blue to-[#21428A]',
    glow: 'shadow-[0_20px_50px_-15px_rgba(20,80,180,0.5)]',
  },
  {
    num: '24/7',
    icon: '💬',
    label: 'Hỗ trợ vận hành',
    desc: 'Đồng hành suốt quá trình triển khai và vận hành',
    gradient: 'from-vs-orange to-vs-orange-dark',
    glow: 'shadow-[0_20px_50px_-15px_rgba(255,107,0,0.5)]',
  },
  {
    num: 'X5',
    icon: '⚡',
    label: 'Tăng hiệu suất',
    desc: '1 nhân sự bằng X5 lần khi có phần mềm',
    gradient: 'from-vs-blue to-[#21428A]',
    glow: 'shadow-[0_20px_50px_-15px_rgba(20,80,180,0.5)]',
  },
]

// 6 nỗi đau thị trường (slide 5 profile gốc)
const PAIN_POINTS = [
  { num: '01', icon: '🧭', title: 'Khó tiếp cận công nghệ mới', desc: 'Cá nhân và doanh nghiệp gặp khó khăn trong việc tiếp cận, thay đổi sang công nghệ mới.' },
  { num: '02', icon: '⏱️', title: 'Không bắt kịp tốc độ thị trường', desc: 'Thị trường chuyển đổi số đổi nhanh, nhiều doanh nghiệp chưa có sự chuẩn bị để đáp ứng khách hàng.' },
  { num: '03', icon: '🧩', title: 'Phần mềm chưa phù hợp', desc: 'Nhiều công cụ, phần mềm trên thị trường nhưng chưa thực sự phù hợp với sự phát triển của từng doanh nghiệp.' },
  { num: '04', icon: '⚙️', title: 'Thiếu giải pháp tối ưu', desc: 'Thiếu một giải pháp tối ưu quy trình, tiết kiệm thời gian và nâng cao hiệu quả kinh doanh.' },
  { num: '05', icon: '🤖', title: 'Ngại ứng dụng automation', desc: 'Một số cá nhân / doanh nghiệp còn ngại thay đổi, ngại ứng dụng phần mềm automation vào hoạt động kinh doanh.' },
  { num: '06', icon: '🤝', title: 'Thiếu đơn vị đồng hành', desc: 'Nhiều doanh nghiệp không có đối tác công nghệ, đơn vị đồng hành xuyên suốt quá trình chuyển đổi số.' },
]

// 4 lợi ích (slide 10)
const BENEFITS = [
  { icon: '💰', label: 'Tiết kiệm chi phí' },
  { icon: '⏰', label: 'Tiết kiệm thời gian' },
  { icon: '⚡', label: 'Tự động hóa hoàn toàn' },
  { icon: '📊', label: 'Tối ưu nguồn lực' },
]

// 5 cam kết (slide 10-11)
const COMMITMENTS = [
  'Hệ thống automation hoàn toàn tự động',
  'Giải quyết bài toán chuyển đổi số end-to-end',
  'Đồng hành xuyên suốt từ tư vấn → vận hành',
  'Tối ưu nguồn lực, gia tăng năng suất',
  'Bảo mật cao, mở rộng linh hoạt theo doanh nghiệp',
]

// 5 điểm khác biệt (slide 12)
const USPS = [
  { num: '01', icon: '🎯', title: 'Đáp ứng đúng nhu cầu', desc: 'Phần mềm Vsoftware đáp ứng mọi nhu cầu và xây dựng đúng theo nhu cầu thực tế của khách hàng — không cố định template.', color: 'orange' },
  { num: '02', icon: '🤝', title: 'Cam kết đồng hành', desc: 'Phần mềm Vsoftware đầu tiên tại Việt Nam thiết kế có cam kết đồng hành cùng khách hàng xuyên suốt.', color: 'blue' },
  { num: '03', icon: '💬', title: 'Chăm sóc chuyên nghiệp', desc: 'Chăm sóc khách hàng chuyên nghiệp, tự động, đa kênh — đảm bảo phản hồi nhanh và không bỏ sót yêu cầu.', color: 'orange' },
  { num: '04', icon: '🆓', title: 'Tư vấn miễn phí 4.0', desc: 'Tư vấn miễn phí xây dựng hệ thống phần mềm theo yêu cầu, giúp doanh nghiệp phát triển trong kỷ nguyên 4.0.', color: 'blue' },
  { num: '05', icon: '🛡️', title: 'Hỗ trợ vận hành dài hạn', desc: 'Hỗ trợ và đồng hành cùng doanh nghiệp trong suốt quá trình vận hành, không chỉ dừng ở giao sản phẩm.', color: 'orange' },
]

// 5 giá trị cốt lõi (ViTechGroup brand original)
const CORE_VALUES = [
  {
    num: '01',
    icon: '🙏',
    title: 'BIẾT ƠN',
    desc: 'Biết ơn là cội nguồn của sức mạnh, là truyền thống uống nước nhớ nguồn của người Việt Nam. Biết ơn để có năng lượng tích cực, biết ơn người giúp đỡ mình, biết ơn cơ hội đến với mình. Biết ơn là phẩm giá quan trọng số 1 để nhìn nhận con người phù hợp tại ViTech.',
    color: 'orange',
  },
  {
    num: '02',
    icon: '💎',
    title: 'NIỀM TIN',
    desc: 'Tin tưởng bản thân, đồng nghiệp. Tin vào con đường mình đã chọn, tin vào sản phẩm, tin vào công ty. Niềm tin phải luôn được xây dựng, bồi đắp bằng những hành động thường ngày.',
    color: 'blue',
  },
  {
    num: '03',
    icon: '🤝',
    title: 'TRÁCH NHIỆM',
    desc: 'Trách nhiệm với bản thân và người xung quanh, trách nhiệm với lời mình nói ra, trách nhiệm với niềm tin của người khác. Làm việc có trách nhiệm.',
    color: 'orange',
  },
  {
    num: '04',
    icon: '💡',
    title: 'ĐỔI MỚI',
    desc: 'Là tinh thần không ngừng cải tiến, luôn chủ động tìm kiếm cách làm tốt hơn. Dám thay đổi và tìm kiếm tư duy mới, khác biệt với tư duy lối mòn của bản thân. Kiến tạo nên những điều mới lạ và phi thường! Tại ViTech, đổi mới là yêu cầu sống còn. Phải luôn tốt hơn 1% mỗi ngày — đổi mới là sống còn, là yếu tố bắt buộc tại ViTech.',
    color: 'blue',
  },
  {
    num: '05',
    icon: '🔍',
    title: 'RÕ RÀNG',
    desc: 'Là minh bạch trong suy nghĩ, cụ thể và nhất quán từ lời nói đến hành động. Là dứt khoát trong quyết định và thẳng thắn trong giao tiếp. Là nỗ lực để mọi người hiểu đúng, hiểu đủ và cùng nhìn về một hướng. Là rõ người – rõ việc – rõ kết quả. Không mập mờ, không vòng vo, không úp mở.',
    color: 'orange',
  },
]

// 4 loại hình dịch vụ chính (slide 15)
const SERVICE_PILLARS = [
  {
    num: '01',
    title: 'Phần mềm quản lý',
    items: [
      'Tư vấn tính năng, giải pháp phát triển phần mềm quản lý',
      'Đồng bộ Website – Web app – App',
      'Nhận nghiên cứu, phát triển công nghệ theo yêu cầu',
    ],
    bg: 'bg-vs-blue',
    href: '/dich-vu',
  },
  {
    num: '02',
    title: 'Phần mềm theo yêu cầu',
    items: [
      'Tư vấn tính năng, giải pháp phát triển theo yêu cầu',
      'Xây dựng trọn gói và đồng bộ hệ thống',
      'Đồng hành cùng doanh nghiệp trong suốt quá trình vận hành',
    ],
    bg: 'bg-vs-orange',
    href: '/dich-vu',
    featured: true,
  },
  {
    num: '03',
    title: 'App Mobile',
    items: [
      'Tư vấn tính năng, giải pháp phát triển app',
      'Nghiên cứu & phát triển App Mobile theo yêu cầu',
      'Cam kết đồng hành thiết lập – xây dựng – vận hành',
    ],
    bg: 'bg-[#21428A]',
    href: '/dich-vu',
  },
  {
    num: '04',
    title: 'Web App',
    items: [
      'Tư vấn tính năng, giải pháp phát triển Web App',
      'Xây dựng trọn gói, đồng bộ Website – Web app – App',
      'Đồng hành xuyên suốt quá trình vận hành',
    ],
    bg: 'bg-teal-600',
    href: '/dich-vu',
  },
]

// 3 testimonials thật (slide 18)
const TESTIMONIALS = [
  {
    initial: 'B',
    bgColor: 'bg-vs-blue',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&h=120&q=80',
    quote: 'Sử dụng dịch vụ của Vsoftware, công ty chúng tôi đã xây dựng được hệ thống phần mềm riêng, phù hợp với mô hình kinh doanh và chiến lược phát triển lâu dài. Các bạn hỗ trợ rất nhiệt tình và kịp thời. Chúng tôi rất hài lòng về dịch vụ của Vsoftware.',
    name: 'Anh Bình',
    company: 'Công ty SXTM Từ Liêm',
    location: 'Hà Nội',
  },
  {
    initial: 'Q',
    bgColor: 'bg-vs-orange',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80',
    quote: 'Trước khi chọn Vsoftware, tôi có tham khảo thêm vài đơn vị khác. Giải pháp các bạn đưa ra khá thực tế và đã thuyết phục được chúng tôi. Hiện phần mềm chuyên biệt do Vsoftware cung cấp, các phòng ban đều sử dụng và tiết kiệm được 50% nhân sự triển khai.',
    name: 'Chị Quỳnh',
    company: 'Công ty May Xuất khẩu',
    location: 'Ninh Bình',
  },
  {
    initial: 'T',
    bgColor: 'bg-teal-600',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&h=120&q=80',
    quote: 'Từ ngày dùng phần mềm Marketing của Vsoftware, việc kinh doanh trở nên tiện lợi và hiệu quả hơn. Các khâu tìm kiếm, quản lý khách hàng được chuyên nghiệp. Đặc biệt, công ty tiết kiệm và tối ưu được 40% chi phí nhân sự triển khai các công việc hiện tại.',
    name: 'Anh Trung',
    company: 'Công ty Dược Mỹ phẩm',
    location: 'TP.HCM',
  },
]

export default function GioiThieuPage() {
  return (
    <>
      <PageHero
        title="Giới Thiệu Vsoftware"
        titleEm="Thiệu"
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Giới thiệu' }]}
        titleTag="div"
      />

      {/* 1. THƯ NGỎ */}
      <section className="pt-[72px] pb-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-[12px] font-extrabold tracking-[0.15em] uppercase text-vs-orange bg-vs-orange/10 px-3 py-1.5 rounded-full mb-5">01 · Thư ngỏ</span>
              <h1 className="text-[clamp(28px,3.5vw,42px)] font-extrabold text-vs-dark leading-[1.2] mb-6">
                Kính gửi <em className="not-italic text-vs-blue">Quý khách hàng</em>
              </h1>
              <div className="text-[15.5px] text-vs-gray-700 leading-[1.85]">
                <p className="mb-[18px]">
                  Thấu hiểu &ldquo;<strong className="text-vs-orange">nỗi đau</strong>&rdquo; thị trường cũng như nhu cầu chung của khách hàng trong thời kỳ bùng nổ công nghệ 4.0, <strong>Công ty CP Giải pháp Vsoftware</strong> ra đời với mong muốn đáp ứng nhu cầu và mang đến trải nghiệm tiện ích, chuyên nghiệp của phần mềm Việt, công nghệ Việt — giải quyết bài toán chuyển đổi số trong hoạt động kinh doanh.
                </p>
                <p className="mb-[18px]">
                  Tại Vsoftware, chúng tôi đáp ứng đa dạng nhu cầu: <strong>giải pháp Marketing, phần mềm AI Agent, xây dựng App, thiết kế Website – LadiPage và thiết kế phần mềm theo yêu cầu</strong>, phù hợp với đặc thù sản xuất – kinh doanh của từng tổ chức, cá nhân, doanh nghiệp.
                </p>
                <p className="mb-0">
                  Vsoftware là địa chỉ đáng tin cậy giúp doanh nghiệp <strong className="text-vs-blue">TỐI ƯU HIỆU QUẢ KINH DOANH – TIẾT KIỆM CHI PHÍ</strong> nhờ các giải pháp phần mềm theo yêu cầu được ứng dụng công nghệ hiện đại bậc nhất.
                </p>
              </div>
              <div className="mt-7 pt-6 border-t border-vs-gray-200">
                <div className="text-[13px] text-vs-gray-500 mb-1">Trân trọng,</div>
                <div className="text-[15px] font-extrabold text-vs-dark tracking-[0.05em]">BGĐ VSOFTWARE</div>
              </div>
              <div className="flex gap-3 mt-7">
                <Link href="/lien-he" className="inline-flex items-center gap-2 bg-vs-orange text-white px-6 py-3 rounded-vs font-extrabold text-[14px] hover:bg-vs-orange-dark transition-all no-underline">
                  Tư vấn miễn phí
                </Link>
                <Link href="/dich-vu" className="inline-flex items-center gap-2 bg-white text-vs-blue border-2 border-vs-blue px-6 py-3 rounded-vs font-extrabold text-[14px] hover:bg-vs-blue-light transition-all no-underline">
                  Xem dịch vụ →
                </Link>
              </div>
            </div>
            <div className="relative rounded-[20px] overflow-hidden shadow-vs-lg">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&h=460&q=80"
                alt="Đội ngũ Vsoftware"
                width={800}
                height={460}
                className="w-full h-[460px] object-cover"
                priority
              />
              <div className="absolute bottom-6 left-6 right-6 bg-vs-navy/90 backdrop-blur-sm rounded-xl px-5 py-4 text-white">
                <div className="text-[12px] text-white/60 uppercase tracking-[0.1em] font-bold mb-1">Cam kết Vsoftware</div>
                <p className="text-[13.5px] leading-[1.55] m-0 italic">
                  &ldquo;Mang đến trải nghiệm phần mềm giao diện thân thiện, dễ thao tác — được phát triển trên nền tảng công nghệ thông minh, hiện đại.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 4 KPI — GIẢI PHÁP VSOFTWARE (gradient nổi bật) */}
      <section className="py-20 bg-vs-bg relative overflow-hidden">
        {/* bg pattern dots */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, #1450B4 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
        }} />
        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-14">
            <span className="inline-block text-[12px] font-extrabold tracking-[0.15em] uppercase text-vs-blue bg-vs-blue-light px-3 py-1.5 rounded-full mb-4">Tổng quan giải pháp</span>
            <h2 className="text-[clamp(26px,3.2vw,40px)] font-extrabold text-vs-dark leading-[1.2]">
              Giải Pháp <em className="not-italic text-vs-orange">Vsoftware</em>
            </h2>
            <p className="text-[15.5px] text-vs-gray-600 mt-3 max-w-[620px] mx-auto leading-[1.65]">
              Phần mềm theo yêu cầu cho mọi quy mô doanh nghiệp — phù hợp với đặc thù kinh doanh và quy mô của bạn.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {KPIS.map((k, i) => (
              <div key={i} className={`relative bg-gradient-to-br ${k.gradient} rounded-3xl p-7 text-white overflow-hidden hover:-translate-y-2 transition-all duration-300 ${k.glow}`}>
                {/* Background glow */}
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/15 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-[34px] mb-5 shadow-lg">
                    {k.icon}
                  </div>
                  {/* BIG number */}
                  <div className="text-[clamp(54px,5.5vw,72px)] font-extrabold leading-none mb-3 tracking-tight" style={{ textShadow: '0 4px 24px rgba(0,0,0,0.15)' }}>
                    {k.num}
                  </div>
                  {/* Label */}
                  <div className="text-[16px] font-extrabold uppercase tracking-[0.05em] mb-2">{k.label}</div>
                  {/* Description */}
                  <div className="text-[13px] text-white/85 leading-[1.55]">{k.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. NỖI ĐAU + GIẢI PHÁP */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14 max-w-[780px] mx-auto">
            <span className="inline-block text-[12px] font-extrabold tracking-[0.15em] uppercase text-vs-blue bg-vs-blue-light px-3 py-1.5 rounded-full mb-5">02 · Bức tranh thị trường</span>
            <h2 className="text-[clamp(24px,3vw,36px)] font-extrabold text-vs-dark leading-[1.25] mb-4">
              Thực trạng SME trong <em className="not-italic text-vs-orange">kỷ nguyên 4.0</em>
            </h2>
            <p className="text-[16px] text-vs-gray-600 leading-[1.65]">
              Thời kỳ &ldquo;cá nhanh nuốt cá chậm&rdquo; — chuyển đổi số là sống còn. Nhưng SME đang gặp nhiều rào cản:
            </p>
          </div>

          {/* 6 nỗi đau */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
            {PAIN_POINTS.map((p, i) => (
              <div key={i} className="relative bg-vs-bg rounded-2xl p-7 hover:shadow-vs hover:-translate-y-1 transition-all border-l-4 border-vs-orange">
                <div className="absolute top-4 right-5 text-[36px] font-extrabold text-vs-orange/15 leading-none">{p.num}</div>
                <div className="text-[32px] mb-3 leading-none">{p.icon}</div>
                <h3 className="text-[16px] font-extrabold text-vs-dark mb-2 leading-[1.35]">{p.title}</h3>
                <p className="text-[13.5px] text-vs-gray-600 leading-[1.65] m-0">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* Vsoftware giải quyết — 2 cột stretch ngang bằng */}
          <div className="bg-vs-navy-gradient rounded-3xl p-10 lg:p-14 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Trái */}
              <div className="lg:col-span-7 flex flex-col">
                <span className="inline-block self-start text-[12px] font-extrabold tracking-[0.15em] uppercase text-vs-orange bg-white/10 px-3 py-1.5 rounded-full mb-5">03 · Giải pháp Vsoftware</span>
                <h3 className="text-[clamp(22px,2.6vw,32px)] font-extrabold leading-[1.3] mb-5">
                  Giải quyết &ldquo;nỗi đau&rdquo; thị trường bằng <em className="not-italic text-vs-orange">công nghệ 4.0</em>
                </h3>
                <p className="text-[15px] text-white/80 leading-[1.85] mb-6">
                  Vsoftware ra đời với nhiều dịch vụ tiện ích, đáp ứng và giải quyết bài toán <strong className="text-white">tìm kiếm – xây dựng – phát triển</strong> hệ thống phần mềm theo yêu cầu cho cá nhân, tổ chức, doanh nghiệp.
                </p>

                {/* 4 lợi ích - đẩy xuống dưới flex-1 */}
                <div className="grid grid-cols-2 gap-3 mt-auto">
                  {BENEFITS.map((b, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3.5 border border-white/15">
                      <span className="text-[22px] leading-none">{b.icon}</span>
                      <span className="text-[13.5px] font-extrabold text-white">{b.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Phải - stretch full height */}
              <div className="lg:col-span-5 flex">
                <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-7 w-full flex flex-col">
                  <div className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-vs-orange mb-3">Công nghệ 4.0</div>
                  <div className="text-[18px] font-extrabold text-white mb-5 leading-[1.35]">Hiện đại · Tự động · Linh hoạt</div>
                  <ul className="space-y-3 m-0 p-0 list-none flex-1">
                    {COMMITMENTS.map((c, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-vs-orange text-[15px] font-extrabold leading-[1.4] flex-shrink-0">✓</span>
                        <span className="text-[13.5px] text-white/90 leading-[1.55]">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TẦM NHÌN — SỨ MỆNH — GIÁ TRỊ CỐT LÕI */}
      <section className="py-20 bg-vs-bg">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14 max-w-[720px] mx-auto">
            <span className="inline-block text-[12px] font-extrabold tracking-[0.15em] uppercase text-vs-orange bg-vs-orange/10 px-3 py-1.5 rounded-full mb-5">Kim chỉ nam của Vsoftware</span>
            <h2 className="text-[clamp(24px,3vw,36px)] font-extrabold text-vs-dark leading-[1.25]">
              Tầm nhìn · Sứ mệnh · <em className="not-italic text-vs-orange">Giá trị cốt lõi</em>
            </h2>
          </div>

          {/* Vision + Mission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-vs-blue rounded-2xl p-10 text-white relative overflow-hidden">
              <div className="absolute -top-6 -right-6 text-[140px] opacity-10 leading-none">🔭</div>
              <div className="relative">
                <div className="text-[12px] font-extrabold tracking-[0.2em] text-vs-orange uppercase mb-3">Tầm Nhìn</div>
                <p className="text-[19px] font-extrabold leading-[1.4] m-0">
                  Vsoftware phấn đấu trở thành <span className="text-vs-orange">TOP 1 Việt Nam</span> về phần mềm theo yêu cầu vào năm <span className="text-vs-orange">2030</span>.
                </p>
              </div>
            </div>
            <div className="bg-vs-orange rounded-2xl p-10 text-white relative overflow-hidden">
              <div className="absolute -top-6 -right-6 text-[140px] opacity-15 leading-none">🎯</div>
              <div className="relative">
                <div className="text-[12px] font-extrabold tracking-[0.2em] text-white/90 uppercase mb-3">Sứ Mệnh</div>
                <p className="text-[15.5px] font-bold leading-[1.55] m-0">
                  Kế thừa và phát huy thành tựu công nghệ số, giúp cá nhân – doanh nghiệp thực hiện kế hoạch kinh doanh ngắn hạn, dài hạn <strong className="text-white">chuyên nghiệp – hiệu quả</strong>. Đóng góp vào công cuộc xây dựng nền công nghệ Việt Nam.
                </p>
              </div>
            </div>
          </div>

          {/* 5 Core values — vertical 5 hàng */}
          <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-vs">
            <div className="text-center mb-10">
              <h3 className="text-[clamp(22px,2.4vw,30px)] font-extrabold text-vs-dark mb-2">5 Giá trị cốt lõi</h3>
              <p className="text-[14.5px] text-vs-gray-600 max-w-[560px] mx-auto leading-[1.65]">
                Vsoftware hướng đến và thực hiện theo những giá trị cốt lõi trong từng hành động hàng ngày.
              </p>
            </div>
            <div className="space-y-4">
              {CORE_VALUES.map((v, i) => {
                const isOrange = v.color === 'orange'
                return (
                  <div
                    key={i}
                    className={`group flex items-start gap-5 md:gap-7 p-5 md:p-7 rounded-2xl bg-vs-bg hover:shadow-vs hover:-translate-y-1 transition-all border-l-4 ${
                      isOrange ? 'border-vs-orange hover:bg-vs-orange/5' : 'border-vs-blue hover:bg-vs-blue-light'
                    }`}
                  >
                    {/* Số to */}
                    <div
                      className={`text-[clamp(48px,5vw,68px)] font-extrabold leading-none tracking-tight flex-shrink-0 ${
                        isOrange ? 'text-vs-orange' : 'text-vs-blue'
                      }`}
                    >
                      {v.num}
                    </div>
                    {/* Nội dung */}
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[24px] md:text-[28px] leading-none">{v.icon}</span>
                        <h4 className={`text-[18px] md:text-[20px] font-extrabold tracking-[0.05em] ${isOrange ? 'text-vs-orange' : 'text-vs-blue'}`}>
                          {v.title}
                        </h4>
                      </div>
                      <p className="text-[14.5px] md:text-[15px] text-vs-gray-700 leading-[1.85] m-0">
                        {v.desc}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 5. 5 ĐIỂM KHÁC BIỆT */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14 max-w-[720px] mx-auto">
            <span className="inline-block text-[12px] font-extrabold tracking-[0.15em] uppercase text-vs-blue bg-vs-blue-light px-3 py-1.5 rounded-full mb-5">Vì sao SME chọn Vsoftware?</span>
            <h2 className="text-[clamp(24px,3vw,36px)] font-extrabold text-vs-dark leading-[1.25]">
              <em className="not-italic text-vs-blue">Vsoftware</em> Cam Kết
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {USPS.map((u, i) => (
              <div key={i} className={`relative rounded-2xl p-7 hover:-translate-y-1 transition-all shadow-vs hover:shadow-vs-md bg-white border-t-4 ${u.color === 'orange' ? 'border-vs-orange' : 'border-vs-blue'}`}>
                <div className="absolute top-4 right-5 text-[36px] font-extrabold text-vs-gray-200 leading-none">{u.num}</div>
                <div className={`w-14 h-14 rounded-[14px] flex items-center justify-center text-[26px] mb-4 ${u.color === 'orange' ? 'bg-vs-orange/10' : 'bg-vs-blue-light'}`}>{u.icon}</div>
                <h3 className="text-[17px] font-extrabold text-vs-dark mb-2.5 leading-[1.35]">{u.title}</h3>
                <p className="text-[14px] text-vs-gray-600 leading-[1.7] m-0">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. 4 LOẠI HÌNH DỊCH VỤ */}
      <section className="py-20 bg-vs-bg">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14 max-w-[760px] mx-auto">
            <span className="inline-block text-[12px] font-extrabold tracking-[0.15em] uppercase text-vs-orange bg-vs-orange/10 px-3 py-1.5 rounded-full mb-5">04 · Dịch vụ phần mềm theo yêu cầu</span>
            <h2 className="text-[clamp(24px,3vw,36px)] font-extrabold text-vs-dark leading-[1.25] mb-3">
              4 loại hình dịch vụ <em className="not-italic text-vs-orange">chính</em>
            </h2>
            <p className="text-[16px] text-vs-gray-600 leading-[1.65]">
              Bao phủ trọn vòng đời chuyển đổi số — từ phần mềm quản lý, phần mềm theo yêu cầu, App Mobile đến Web App.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SERVICE_PILLARS.map((s, i) => (
              <Link key={i} href={s.href} className={`group ${s.bg} text-white rounded-2xl p-8 hover:-translate-y-1 transition-all shadow-vs hover:shadow-vs-lg no-underline block ${s.featured ? 'ring-2 ring-vs-orange ring-offset-2' : ''}`}>
                <div className="flex items-start gap-5">
                  <div className="text-[44px] font-extrabold leading-none opacity-90">{s.num}</div>
                  <div className="flex-1">
                    <h3 className="text-[19px] font-extrabold mb-3 leading-[1.3] uppercase tracking-[0.02em]">{s.title}</h3>
                    <ul className="space-y-2 m-0 p-0 list-none mb-4">
                      {s.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-[13.5px] opacity-95 leading-[1.55]">
                          <span className="text-white flex-shrink-0">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <span className="inline-flex items-center gap-1 text-[13px] font-extrabold opacity-95 group-hover:gap-2 transition-all">
                      Xem chi tiết →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14 max-w-[760px] mx-auto">
            <span className="inline-block text-[12px] font-extrabold tracking-[0.15em] uppercase text-vs-orange bg-vs-orange/10 px-3 py-1.5 rounded-full mb-5">05 · Quan hệ đối tác · Trải nghiệm khách hàng</span>
            <h2 className="text-[clamp(24px,3vw,36px)] font-extrabold text-vs-dark leading-[1.25]">
              Khách hàng nói về <em className="not-italic text-vs-orange">Vsoftware</em>
            </h2>
            <p className="text-[16px] text-vs-gray-600 mt-3 leading-[1.65]">
              Câu chuyện thật từ các doanh nghiệp đã triển khai và đồng hành cùng Vsoftware.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-vs-bg rounded-2xl p-7 flex flex-col hover:shadow-vs hover:-translate-y-1 transition-all">
                {/* Stars */}
                <div className="flex gap-0.5 mb-4 text-vs-orange">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <svg key={k} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <div className="text-vs-orange text-[40px] leading-none mb-2">&ldquo;</div>
                <p className="text-[14.5px] text-vs-gray-700 leading-[1.75] mb-6 flex-1 italic -mt-2">{t.quote}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-vs-gray-200">
                  <div className={`relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-offset-2 ring-offset-vs-bg ${t.bgColor.replace('bg-', 'ring-')} flex-shrink-0`}>
                    <Image
                      src={t.avatar}
                      alt={t.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-[14px] font-extrabold text-vs-dark">{t.name}</div>
                    <div className="text-[12.5px] text-vs-blue font-semibold">{t.company}</div>
                    <div className="text-[11.5px] text-vs-gray-500">{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Sẵn sàng bắt đầu dự án phần mềm của bạn?"
        description="Tư vấn miễn phí 30 phút — đội ngũ Vsoftware phân tích bài toán, đề xuất giải pháp và ước tính chi phí không ràng buộc."
        primaryLabel="Đặt lịch tư vấn miễn phí"
        primaryHref="/lien-he"
        secondaryLabel="Chat Zalo ngay"
        secondaryHref="https://zalo.me/vsoftware"
      />
    </>
  )
}

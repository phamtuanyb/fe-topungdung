import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import PageHero from '@/components/common/PageHero'
import CTASection from '@/components/common/CTASection'
import { getPosts } from '@/lib/api/public'
import type { Post } from '@/types'
import { AI_AGENT_SLUGS } from '@/constants/app.constants'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Giới thiệu Vsoftware — Phần mềm theo yêu cầu cho SME Việt',
  description:
    'Vsoftware — phần mềm theo yêu cầu cho doanh nghiệp vừa và nhỏ Việt Nam. May đo 100%, triển khai nhanh gấp 5 lần, đội ngũ Việt hỗ trợ 24/7, tích hợp AI Agent.',
}

const KPIS = [
  { num: '100%', label: 'May đo theo nghiệp vụ riêng của từng doanh nghiệp', color: 'orange' },
  { num: '10+', label: 'Năm kinh nghiệm phát triển phần mềm cho SME Việt', color: 'blue' },
  { num: '24/7', label: 'Đội ngũ hỗ trợ kỹ thuật bằng tiếng Việt, không nghỉ', color: 'orange' },
  { num: 'X5', label: 'Tốc độ triển khai nhanh hơn so với tự build inhouse', color: 'blue' },
]

const PAIN_POINTS = [
  {
    icon: '🧩',
    title: 'Phần mềm phổ thông không vừa vặn',
    desc: 'Các phần mềm đóng hộp được thiết kế chung cho mọi ngành — không khớp với quy trình riêng của doanh nghiệp bạn.',
  },
  {
    icon: '⏳',
    title: 'Tự build mất 6-12 tháng',
    desc: 'Xây phần mềm in-house tốn hàng tỷ đồng, mất cả năm, và nhiều dự án dừng giữa chừng do không quản lý được.',
  },
  {
    icon: '👥',
    title: 'Nhân viên không chịu dùng',
    desc: 'Giao diện phức tạp, phải training 3 tháng, nhân viên vẫn quay lại Excel và sổ tay — phần mềm trở thành đồ trang trí.',
  },
  {
    icon: '🔌',
    title: 'Hệ thống rời rạc, không tích hợp',
    desc: 'Sale, kho, kế toán, marketing mỗi nơi một phần mềm khác nhau — dữ liệu phải nhập tay nhiều lần, sai sót cao.',
  },
  {
    icon: '🌍',
    title: 'Phần mềm nước ngoài đắt và xa lạ',
    desc: 'Không hiểu nghiệp vụ Việt: thuế VAT, hoá đơn điện tử, quy trình kế toán theo TT133/200 — phải custom thêm rất tốn kém.',
  },
  {
    icon: '📞',
    title: 'Mua xong không ai support',
    desc: 'Gặp lỗi gọi mãi không được hỗ trợ, đội ngũ bán nói tiếng Anh, fix một bug đợi cả tuần — vận hành bị tê liệt.',
  },
]

const USPS = [
  {
    icon: '🎯',
    title: 'May đo 100% — không khuôn mẫu',
    desc: 'Mỗi phần mềm được phân tích, thiết kế riêng theo nghiệp vụ thực tế của bạn. Không ép bạn theo template, không bắt thay đổi quy trình kinh doanh.',
    color: 'orange',
  },
  {
    icon: '⚡',
    title: 'Bàn giao trong 4-8 tuần',
    desc: 'Quy trình tinh gọn, đội ngũ chuyên môn cao, dùng framework đã chuẩn hoá — nhanh gấp 5 lần so với tự xây phần mềm inhouse.',
    color: 'blue',
  },
  {
    icon: '🇻🇳',
    title: 'Đội ngũ Việt — hiểu nghiệp vụ Việt',
    desc: 'Toàn bộ kỹ sư, BA, designer đều ở Việt Nam. Hỗ trợ bằng tiếng Việt 24/7. Hiểu thuế, hoá đơn điện tử, quy trình thực tế ngành Việt.',
    color: 'orange',
  },
  {
    icon: '🤖',
    title: 'Tích hợp AI Agent từ ngày đầu',
    desc: 'Mọi sản phẩm đều có thể tích hợp AI Agent: chatbot CSKH, tự động viết content, phân tích dữ liệu, ra quyết định — vận hành 24/7 không cần người.',
    color: 'blue',
  },
  {
    icon: '📈',
    title: 'Mở rộng linh hoạt theo doanh nghiệp',
    desc: 'Phần mềm lớn lên cùng bạn. Từ 1 chi nhánh thành 20 chi nhánh, từ 10 nhân viên thành 200 — không cần làm lại từ đầu.',
    color: 'orange',
  },
  {
    icon: '🔍',
    title: 'Minh bạch — không phí ẩn',
    desc: 'Nói rõ làm được gì, không làm được gì, bao lâu, bao nhiêu tiền — trước khi ký hợp đồng. Không có điều khoản ẩn, không phí phát sinh bất ngờ.',
    color: 'blue',
  },
]

const VISION = {
  vision: {
    title: 'TẦM NHÌN',
    body: 'Trở thành công ty phần mềm theo yêu cầu số 1 dành cho doanh nghiệp vừa và nhỏ tại Việt Nam.',
    icon: '🔭',
  },
  mission: {
    title: 'SỨ MỆNH',
    body: 'Giúp mỗi doanh nghiệp Việt sở hữu một phần mềm vừa vặn — không quá to, không quá nhỏ, đúng bài toán của mình.',
    icon: '🎯',
  },
}

const CORE_VALUES = [
  { num: '01', title: 'Thực chiến', desc: 'Mỗi tính năng phải giải quyết bài toán thực tế, không phải để đẹp slide.' },
  { num: '02', title: 'Minh bạch', desc: 'Nói rõ từ đầu: làm được, không làm được, thời gian, chi phí.' },
  { num: '03', title: 'Cam kết', desc: 'Đồng hành dài hạn sau triển khai — không bỏ rơi khách hàng.' },
  { num: '04', title: 'Tốc độ', desc: 'Bàn giao đúng hẹn, fix bug trong giờ, không trì hoãn.' },
  { num: '05', title: 'Đổi mới', desc: 'Ứng dụng AI, automation, công nghệ mới ngay từ ngày đầu.' },
]

const SERVICE_PILLARS = [
  {
    num: '01',
    title: 'Phần mềm theo yêu cầu',
    desc: 'Custom Software xây dựng riêng theo nghiệp vụ doanh nghiệp: CRM, HRM, WMS, POS, ERP mini, hệ thống quản lý chuỗi…',
    bg: 'bg-vs-orange',
    textColor: 'text-white',
    featured: true,
    href: '/dich-vu',
  },
  {
    num: '02',
    title: 'Website doanh nghiệp',
    desc: 'Web bán hàng, landing page, corporate site, blog tin tức — chuẩn SEO, tốc độ cao, dễ chỉnh sửa qua admin.',
    bg: 'bg-vs-blue',
    textColor: 'text-white',
    featured: false,
    href: '/dich-vu',
  },
  {
    num: '03',
    title: 'App Mobile',
    desc: 'Ứng dụng iOS + Android: app bán hàng, app giao hàng, app khách hàng — quản lý kinh doanh trên điện thoại.',
    bg: 'bg-[#21428A]',
    textColor: 'text-white',
    featured: false,
    href: '/dich-vu',
  },
  {
    num: '04',
    title: 'AI Agent',
    desc: 'Trợ lý AI tự động hoá vận hành: chatbot CSKH, viết content, sản xuất video, chạy quảng cáo, phân tích dữ liệu.',
    bg: 'bg-vs-orange',
    textColor: 'text-white',
    featured: true,
    href: '/ai-agent',
  },
]

const TESTIMONIALS = [
  {
    quote: 'Sau 2 tháng dùng phần mềm quản lý spa của Vsoftware, doanh thu của em tăng 30% nhờ quản lý lịch hẹn và chăm sóc khách cũ tốt hơn. Nhân viên không còn quên lịch khách. Đội support nhiệt tình, gọi là có người trả lời.',
    name: 'Chị Nguyễn Thị Hương',
    role: 'Chủ Hương Spa',
    location: 'Hà Đông, Hà Nội',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
  },
  {
    quote: 'Trước đây mỗi chi nhánh dùng 1 phần mềm khác nhau, tổng hợp doanh thu cuối tháng mất 3 ngày. Vsoftware build cho em hệ thống quản lý chuỗi 6 chi nhánh, dashboard realtime — giờ em xem doanh thu từng quán ngay trên điện thoại.',
    name: 'Anh Trần Văn Đạt',
    role: 'CEO Chuỗi Phở Bắc',
    location: '6 chi nhánh tại TP.HCM',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&h=120&q=80',
  },
  {
    quote: 'Phần mềm nước ngoài đắt, không xuất hoá đơn điện tử được. Vsoftware làm cho em hệ thống quản lý nhà thuốc tích hợp đủ kho + kế toán + xuất hoá đơn điện tử theo TT78. Triển khai 6 tuần, giá hợp lý, nhân viên dùng được ngay.',
    name: 'Chị Lê Thị Mai',
    role: 'Giám đốc Mai Pharma',
    location: 'Cần Thơ',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&h=120&q=80',
  },
]

const ECOSYSTEM = [
  { bg: 'bg-[#21428A]', icon: '🏢', name: 'ViTechGroup', sub: 'Tập đoàn công nghệ mẹ — chiến lược & đầu tư' },
  { bg: 'bg-vs-blue', icon: '💻', name: 'Vsoftware', sub: 'Phần mềm theo yêu cầu cho SME Việt' },
  { bg: 'bg-vs-orange', icon: '🤖', name: 'ViAI', sub: 'AI Agent & Automation solutions' },
  { bg: 'bg-teal-600', icon: '📚', name: 'ViEdu', sub: 'Đào tạo chuyển đổi số cho doanh nghiệp' },
]

export default async function GioiThieuPage() {
  let dbPosts: Post[] = []
  try {
    const res = await getPosts({ limit: 6 })
    dbPosts = res?.data ?? []
  } catch (err) {
    console.error('Failed to fetch posts in introduction page:', err)
  }

  const productsToDisplay = dbPosts.length > 0
    ? dbPosts.map(post => {
        const catSlug = post.category?.slug || ''
        const isAi = catSlug.startsWith(AI_AGENT_SLUGS) || catSlug.includes('ai')
        const href = isAi ? `/ai-agent/${post.slug}` : `/dich-vu/${post.slug}`

        return {
          href,
          img: post.thumbnail || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&h=180&q=80',
          alt: post.title,
          tag: post.category?.name || 'Phần mềm',
          tagColor: isAi ? 'orange' : 'blue',
          title: post.title,
          desc: post.excerpt || post.seoDescription || 'Dịch vụ phần mềm chất lượng cao từ Vsoftware.',
        }
      })
    : []

  return (
    <>
      <PageHero
        title="Giới Thiệu Vsoftware"
        titleEm="Thiệu"
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Giới thiệu' }]}
        titleTag="div"
      />

      {/* 1. INTRO + Thư ngỏ */}
      <section className="pt-[72px] pb-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-[12px] font-extrabold tracking-[0.15em] uppercase text-vs-orange bg-vs-orange/10 px-3 py-1.5 rounded-full mb-5">Thư ngỏ từ Vsoftware</span>
              <h1 className="text-[clamp(28px,3.5vw,44px)] font-extrabold text-vs-dark leading-[1.2] mb-6">
                Phần mềm <em className="not-italic text-vs-blue">vừa vặn</em> cho doanh nghiệp Việt — không phải trang trí công nghệ
              </h1>
              <div className="text-[16px] text-vs-gray-700 leading-[1.85]">
                <p className="mb-[18px]">
                  Vsoftware là đơn vị phát triển phần mềm theo yêu cầu thuộc hệ sinh thái <strong>ViTechGroup</strong> — tập đoàn công nghệ tập trung vào chuyển đổi số thực chất cho doanh nghiệp vừa và nhỏ tại Việt Nam.
                </p>
                <p className="mb-[18px]">
                  Chúng tôi không bán phần mềm đóng hộp. Mỗi sản phẩm được phân tích, thiết kế và xây dựng riêng theo bài toán thực tế của từng khách hàng — từ spa 3 nhân viên đến chuỗi nhà hàng 20 chi nhánh.
                </p>
                <p className="mb-0">
                  Triết lý của Vsoftware: <strong>giải quyết bài toán thực chiến, không phải trang trí công nghệ.</strong>
                </p>
              </div>
              <div className="flex gap-3 mt-8">
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
              <div className="absolute bottom-6 left-6 bg-vs-navy/90 backdrop-blur-sm rounded-xl px-5 py-4 text-white">
                <strong className="text-[28px] font-extrabold block leading-none text-vs-orange">2020</strong>
                <span className="text-[13px] text-white/70 mt-1 block">Năm thành lập ViTechGroup</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 4 KPI */}
      <section className="py-16 bg-vs-bg">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-[clamp(22px,2.6vw,32px)] font-extrabold text-vs-dark leading-[1.25]">
              Vsoftware trong <em className="not-italic text-vs-blue">4 con số</em>
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {KPIS.map((s, i) => (
              <div key={i} className={`bg-white rounded-2xl p-8 text-center shadow-vs border-b-4 hover:-translate-y-1 transition-transform ${s.color === 'blue' ? 'border-vs-blue' : 'border-vs-orange'}`}>
                <div className={`text-[48px] font-extrabold leading-none mb-2 ${s.color === 'blue' ? 'text-vs-blue' : 'text-vs-orange'}`}>{s.num}</div>
                <div className="text-[13.5px] font-semibold text-vs-gray-600 leading-[1.5]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Câu chuyện thị trường + giải pháp */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14 max-w-[760px] mx-auto">
            <span className="inline-block text-[12px] font-extrabold tracking-[0.15em] uppercase text-vs-blue bg-vs-blue-light px-3 py-1.5 rounded-full mb-5">Bức tranh thị trường</span>
            <h2 className="text-[clamp(24px,3vw,36px)] font-extrabold text-vs-dark leading-[1.25] mb-4">
              Vì sao SME Việt vẫn dùng Excel, Zalo và sổ tay?
            </h2>
            <p className="text-[16px] text-vs-gray-600 leading-[1.65]">
              Thị trường phần mềm Việt không thiếu sản phẩm — nhưng hàng chục nghìn doanh nghiệp vừa và nhỏ vẫn chưa tìm được giải pháp thật sự vừa với mình. Đây là 6 nỗi đau Vsoftware đã quan sát được khi ngồi cùng hàng trăm chủ doanh nghiệp.
            </p>
          </div>

          {/* 6 nỗi đau */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
            {PAIN_POINTS.map((p, i) => (
              <div key={i} className="bg-vs-bg rounded-2xl p-6 border-l-4 border-vs-orange hover:shadow-vs hover:-translate-y-1 transition-all">
                <div className="text-[32px] mb-3 leading-none">{p.icon}</div>
                <h3 className="text-[16px] font-extrabold text-vs-dark mb-2 leading-[1.35]">{p.title}</h3>
                <p className="text-[13.5px] text-vs-gray-600 leading-[1.65] m-0">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* Vsoftware giải quyết */}
          <div className="bg-vs-navy-gradient rounded-3xl p-10 lg:p-14 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7">
                <span className="inline-block text-[12px] font-extrabold tracking-[0.15em] uppercase text-vs-orange bg-white/10 px-3 py-1.5 rounded-full mb-5">Vsoftware giải quyết</span>
                <h3 className="text-[clamp(22px,2.6vw,32px)] font-extrabold leading-[1.3] mb-5">
                  Chúng tôi không bán phần mềm —<br />chúng tôi giải bài toán của bạn.
                </h3>
                <p className="text-[15.5px] text-white/80 leading-[1.85] mb-4">
                  Vsoftware bắt đầu mỗi dự án bằng cách <strong className="text-white">ngồi thực tế với khách hàng</strong>: quan sát quy trình, ghi lại điểm đau, đặt câu hỏi &ldquo;nếu không có phần mềm, bạn đang làm bước này như thế nào?&rdquo;.
                </p>
                <p className="text-[15.5px] text-white/80 leading-[1.85] mb-0">
                  Từ đó thiết kế giải pháp <strong className="text-white">vừa đủ, triển khai nhanh, và nhân viên dùng được ngay từ ngày đầu</strong> — không cần training 3 tháng, không cần đổi quy trình kinh doanh.
                </p>
              </div>
              <div className="lg:col-span-5">
                <blockquote className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-7">
                  <div className="text-vs-orange text-[40px] leading-none mb-2">&ldquo;</div>
                  <p className="text-[15.5px] text-white leading-[1.7] m-0 mb-4 italic">
                    Bài toán của SME Việt không cần giải pháp enterprise. Cần một phần mềm hiểu đúng nghiệp vụ, triển khai trong vài tuần, và nhân viên dùng được ngay mà không cần training 3 tháng.
                  </p>
                  <cite className="text-[12px] text-vs-orange font-bold block not-italic uppercase tracking-[0.05em]">
                    — Lê Đức Nam, Founder & CEO ViTechGroup
                  </cite>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Tầm nhìn — Sứ mệnh — Giá trị cốt lõi */}
      <section className="py-20 bg-vs-bg">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14 max-w-[720px] mx-auto">
            <span className="inline-block text-[12px] font-extrabold tracking-[0.15em] uppercase text-vs-orange bg-vs-orange/10 px-3 py-1.5 rounded-full mb-5">Định hướng phát triển</span>
            <h2 className="text-[clamp(24px,3vw,36px)] font-extrabold text-vs-dark leading-[1.25]">
              Tầm nhìn — Sứ mệnh — <em className="not-italic text-vs-orange">Giá trị cốt lõi</em>
            </h2>
          </div>

          {/* Vision + Mission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-vs-blue rounded-2xl p-10 text-white relative overflow-hidden">
              <div className="absolute -top-6 -right-6 text-[140px] opacity-10 leading-none">{VISION.vision.icon}</div>
              <div className="relative">
                <div className="text-[12px] font-extrabold tracking-[0.2em] text-vs-orange uppercase mb-3">{VISION.vision.title}</div>
                <p className="text-[20px] font-extrabold leading-[1.4] m-0">{VISION.vision.body}</p>
              </div>
            </div>
            <div className="bg-vs-orange rounded-2xl p-10 text-white relative overflow-hidden">
              <div className="absolute -top-6 -right-6 text-[140px] opacity-15 leading-none">{VISION.mission.icon}</div>
              <div className="relative">
                <div className="text-[12px] font-extrabold tracking-[0.2em] text-white/90 uppercase mb-3">{VISION.mission.title}</div>
                <p className="text-[20px] font-extrabold leading-[1.4] m-0">{VISION.mission.body}</p>
              </div>
            </div>
          </div>

          {/* 5 Core values */}
          <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-vs">
            <div className="text-center mb-8">
              <h3 className="text-[20px] font-extrabold text-vs-dark">5 Giá trị cốt lõi</h3>
              <p className="text-[14px] text-vs-gray-600 mt-1">Mỗi quyết định sản phẩm — mỗi dòng code — đều xuất phát từ đây.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {CORE_VALUES.map((v, i) => (
                <div key={i} className="text-center px-4 py-5 rounded-xl bg-vs-bg hover:bg-vs-blue-light transition-colors">
                  <div className="text-[28px] font-extrabold text-vs-orange leading-none mb-2">{v.num}</div>
                  <div className="text-[15px] font-extrabold text-vs-dark mb-1.5">{v.title}</div>
                  <div className="text-[12.5px] text-vs-gray-600 leading-[1.55]">{v.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. 6 USP */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14 max-w-[720px] mx-auto">
            <span className="inline-block text-[12px] font-extrabold tracking-[0.15em] uppercase text-vs-blue bg-vs-blue-light px-3 py-1.5 rounded-full mb-5">Điểm khác biệt</span>
            <h2 className="text-[clamp(24px,3vw,36px)] font-extrabold text-vs-dark leading-[1.25]">
              Vì sao chọn <em className="not-italic text-vs-blue">Vsoftware</em>?
            </h2>
            <p className="text-[16px] text-vs-gray-600 mt-3 leading-[1.65]">
              6 lý do để các doanh nghiệp Việt tin tưởng và đồng hành cùng chúng tôi.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {USPS.map((u, i) => (
              <div key={i} className={`rounded-2xl p-7 hover:-translate-y-1 transition-all shadow-vs hover:shadow-vs-md ${u.color === 'orange' ? 'bg-white border-t-4 border-vs-orange' : 'bg-white border-t-4 border-vs-blue'}`}>
                <div className={`w-14 h-14 rounded-[14px] flex items-center justify-center text-[26px] mb-4 ${u.color === 'orange' ? 'bg-vs-orange/10' : 'bg-vs-blue-light'}`}>{u.icon}</div>
                <h3 className="text-[17px] font-extrabold text-vs-dark mb-2.5 leading-[1.35]">{u.title}</h3>
                <p className="text-[14px] text-vs-gray-600 leading-[1.7] m-0">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. 4 trụ cột dịch vụ + Sản phẩm cụ thể */}
      <section className="py-20 bg-vs-bg">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14 max-w-[720px] mx-auto">
            <span className="inline-block text-[12px] font-extrabold tracking-[0.15em] uppercase text-vs-orange bg-vs-orange/10 px-3 py-1.5 rounded-full mb-5">Dịch vụ phần mềm</span>
            <h2 className="text-[clamp(24px,3vw,36px)] font-extrabold text-vs-dark leading-[1.25]">
              4 trụ cột dịch vụ <em className="not-italic text-vs-orange">theo yêu cầu</em>
            </h2>
            <p className="text-[16px] text-vs-gray-600 mt-3 leading-[1.65]">
              Mỗi trụ cột là một mảng chuyên sâu — kết hợp linh hoạt để giải bài toán riêng của bạn.
            </p>
          </div>

          {/* 4 trụ cột */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
            {SERVICE_PILLARS.map((s, i) => (
              <Link key={i} href={s.href} className={`group ${s.bg} ${s.textColor} rounded-2xl p-8 hover:-translate-y-1 transition-all shadow-vs hover:shadow-vs-lg no-underline block`}>
                <div className="flex items-start gap-5">
                  <div className="text-[42px] font-extrabold leading-none opacity-90">{s.num}</div>
                  <div className="flex-1">
                    <h3 className="text-[20px] font-extrabold mb-2 leading-[1.3]">{s.title}</h3>
                    <p className="text-[14px] opacity-90 leading-[1.65] m-0">{s.desc}</p>
                    <span className="inline-flex items-center gap-1 mt-4 text-[13px] font-extrabold opacity-95 group-hover:gap-2 transition-all">
                      Xem chi tiết →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Sản phẩm cụ thể từ DB */}
          {productsToDisplay.length > 0 && (
            <>
              <div className="text-center mb-8">
                <h3 className="text-[20px] font-extrabold text-vs-dark mb-1">Sản phẩm tiêu biểu Vsoftware đã triển khai</h3>
                <p className="text-[14px] text-vs-gray-600">Mỗi sản phẩm là câu chuyện của một doanh nghiệp với bài toán riêng.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productsToDisplay.map((p, i) => (
                  <Link key={i} href={p.href} className="group bg-white rounded-2xl overflow-hidden shadow-vs hover:border hover:border-vs-blue hover:shadow-vs-md hover:-translate-y-1 transition-all no-underline">
                    <div className="relative h-[180px] overflow-hidden">
                      <Image src={p.img} alt={p.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      <span className={`absolute top-3 left-3 text-[11px] font-extrabold uppercase tracking-[0.08em] px-2.5 py-1 rounded-full ${p.tagColor === 'orange' ? 'bg-vs-orange text-white' : 'bg-vs-blue text-white'}`}>{p.tag}</span>
                    </div>
                    <div className="p-5">
                      <h3 className="text-[16px] font-extrabold text-vs-dark mb-2 group-hover:text-vs-blue transition-colors">{p.title}</h3>
                      <p className="text-[13.5px] text-vs-gray-600 leading-[1.6] m-0">{p.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* 7. Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14 max-w-[720px] mx-auto">
            <span className="inline-block text-[12px] font-extrabold tracking-[0.15em] uppercase text-vs-orange bg-vs-orange/10 px-3 py-1.5 rounded-full mb-5">Khách hàng nói về Vsoftware</span>
            <h2 className="text-[clamp(24px,3vw,36px)] font-extrabold text-vs-dark leading-[1.25]">
              Hơn 200 doanh nghiệp Việt <em className="not-italic text-vs-orange">đã tin tưởng</em>
            </h2>
            <p className="text-[16px] text-vs-gray-600 mt-3 leading-[1.65]">
              Đây là một vài câu chuyện thật từ khách hàng SME đã đồng hành cùng Vsoftware.
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
                <p className="text-[14.5px] text-vs-gray-700 leading-[1.75] mb-6 flex-1 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-vs-gray-200">
                  <Image src={t.avatar} alt={t.name} width={48} height={48} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <div className="text-[14px] font-extrabold text-vs-dark">{t.name}</div>
                    <div className="text-[12px] text-vs-blue font-semibold">{t.role}</div>
                    <div className="text-[11.5px] text-vs-gray-500">{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Hệ sinh thái + Đội ngũ note */}
      <section className="py-20 bg-vs-bg">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14 max-w-[720px] mx-auto">
            <span className="inline-block text-[12px] font-extrabold tracking-[0.15em] uppercase text-vs-blue bg-vs-blue-light px-3 py-1.5 rounded-full mb-5">Hệ sinh thái ViTechGroup</span>
            <h2 className="text-[clamp(24px,3vw,36px)] font-extrabold text-vs-dark leading-[1.25]">
              Vsoftware là <em className="not-italic text-vs-blue">một thành viên</em> trong hệ sinh thái công nghệ Vitech
            </h2>
            <p className="text-[16px] text-vs-gray-600 mt-3 leading-[1.65]">
              Sức mạnh hợp lực — từ chiến lược tập đoàn đến giải pháp AI và đào tạo chuyển đổi số.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {ECOSYSTEM.map((e, i) => (
              <div key={i} className="bg-white rounded-2xl p-7 shadow-vs hover:shadow-vs-md hover:-translate-y-1 transition-all text-center">
                <div className={`w-16 h-16 rounded-2xl ${e.bg} flex items-center justify-center text-[28px] mx-auto mb-4`}>{e.icon}</div>
                <div className="text-[16px] font-extrabold text-vs-dark mb-1.5">{e.name}</div>
                <div className="text-[12.5px] text-vs-gray-600 leading-[1.55]">{e.sub}</div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8 text-center shadow-vs">
            <p className="text-[15px] text-vs-gray-700 mb-2 leading-[1.7]">
              Đội ngũ Vsoftware có <strong className="text-vs-blue">20+ kỹ sư phần mềm</strong>, chuyên gia thiết kế UI/UX và chuyên viên hỗ trợ khách hàng — sẵn sàng đồng hành cùng doanh nghiệp bạn trên hành trình chuyển đổi số.
            </p>
            <Link href="/lien-he" className="inline-flex items-center gap-2 text-[14px] font-bold text-vs-blue mt-3 hover:text-vs-blue-dark no-underline">
              Tìm hiểu cách Vsoftware hỗ trợ bạn →
            </Link>
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

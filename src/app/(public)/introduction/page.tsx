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
    'Vsoftware là công ty phần mềm theo yêu cầu tại Việt Nam. Hơn 5 năm kinh nghiệm, 200+ doanh nghiệp tin dùng, giải pháp AI Agent & Automation.',
}

const STATS = [
  { num: '200+', label: 'Doanh nghiệp đang dùng phần mềm Vsoftware', color: 'blue' },
  { num: '50+', label: 'Dự án đã hoàn thành & đang vận hành production', color: 'orange' },
  { num: '5+', label: 'Năm kinh nghiệm phát triển phần mềm cho SME Việt', color: 'blue' },
  { num: '98%', label: 'Khách hàng hài lòng sau 3 tháng sử dụng đầu tiên', color: 'orange' },
]

const VALUES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
    title: 'Thực chiến, không lý thuyết',
    desc: 'Mỗi tính năng phải giải quyết một bài toán thực tế đang gây đau đớn cho doanh nghiệp. Chúng tôi đo lường kết quả bằng số liệu kinh doanh của khách hàng, không phải bằng điểm UX nội bộ.',
    iconBg: 'bg-vs-orange',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
    title: 'Rõ ràng từ đầu, không bất ngờ',
    desc: 'Trước khi ký hợp đồng, chúng tôi nói rõ phần mềm làm được gì, không làm được gì, thời gian bao lâu, chi phí bao nhiêu. Không có điều khoản ẩn, không có phí phát sinh bất ngờ.',
    iconBg: 'bg-white/15',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Đồng hành dài hạn',
    desc: 'Triển khai xong không phải là hết. Vsoftware cung cấp hỗ trợ kỹ thuật liên tục, cập nhật tính năng theo phản hồi thực tế và tư vấn mở rộng khi doanh nghiệp phát triển.',
    iconBg: 'bg-vs-orange',
  },
]

const TEAM = [
  { name: 'Lê Đức Nam', role: 'Founder & CEO', desc: '10+ năm trong mảng công nghệ và tư vấn chuyển đổi số cho doanh nghiệp Việt', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&h=200&q=80' },
  { name: 'Nguyễn Minh Tuấn', role: 'CTO', desc: 'Kiến trúc sư hệ thống, chuyên về SaaS multi-tenant và tích hợp AI vào sản phẩm thực tế', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=200&q=80' },
  { name: 'Trần Thị Lan Anh', role: 'Chief Product Officer', desc: 'Chuyên gia UX và nghiên cứu người dùng với 8 năm thiết kế sản phẩm cho thị trường SME', img: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=400&h=200&q=80' },
  { name: 'Phạm Văn Hùng', role: 'COO', desc: 'Vận hành và triển khai dự án — đảm bảo mọi sản phẩm đến tay khách hàng đúng cam kết', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=200&q=80' },
]

const ECOSYSTEM = [
  { bg: 'bg-[#21428A]', icon: '🏢', name: 'ViTechGroup', sub: 'Tập đoàn công nghệ mẹ' },
  { bg: 'bg-vs-blue', icon: '💻', name: 'Vsoftware', sub: 'Phần mềm theo yêu cầu cho SME' },
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
          desc: post.excerpt || post.seoDescription || 'Dịch vụ phần mềm chất lượng cao từ Vsoftware.'
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

      {/* Intro */}
      <section className="pt-[72px] pb-0 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-4 items-center">
            <div>
              <h1 className="text-[clamp(28px,3.5vw,44px)] font-extrabold text-vs-dark leading-[1.2] mb-6">
                Phần mềm <em className="not-italic text-vs-blue">vừa vặn</em> cho doanh nghiệp Việt — không phải trang trí công nghệ
              </h1>
              <div className="text-[16px] text-vs-gray-700 leading-[1.85]">
                <p className="mb-[18px]">Vsoftware là đơn vị phát triển phần mềm theo yêu cầu thuộc hệ sinh thái <strong>ViTechGroup</strong> — tập đoàn công nghệ tập trung vào chuyển đổi số thực chất cho doanh nghiệp vừa và nhỏ tại Việt Nam.</p>
                <p className="mb-[18px]">Chúng tôi không bán phần mềm đóng hộp. Mỗi sản phẩm được phân tích, thiết kế và xây dựng riêng theo bài toán thực tế của từng khách hàng — từ spa 3 nhân viên đến chuỗi nhà hàng 20 chi nhánh.</p>
                <p>Triết lý của Vsoftware: <strong>giải quyết bài toán thực chiến, không phải trang trí công nghệ.</strong></p>
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

      {/* Stats */}
      <section className="py-16 bg-vs-bg">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <div key={i} className={`bg-white rounded-2xl p-8 text-center shadow-vs border-b-4 hover:-translate-y-1 transition-transform ${s.color === 'blue' ? 'border-vs-blue' : 'border-vs-orange'}`}>
                <div className={`text-[48px] font-extrabold leading-none mb-2 ${s.color === 'blue' ? 'text-vs-blue' : 'text-vs-orange'}`}>{s.num}</div>
                <div className="text-[14px] font-semibold text-vs-gray-600 leading-[1.4]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-[clamp(24px,3vw,36px)] font-extrabold text-vs-dark leading-[1.25]">
              Từ bài toán thực tế đến <em className="not-italic text-vs-blue">sản phẩm thực chiến</em>
            </h2>
            <p className="text-[16px] text-vs-gray-600 mt-3 max-w-[560px] mx-auto leading-[1.65]">
              Vsoftware ra đời không phải từ phòng lab — mà từ những lần ngồi cùng chủ doanh nghiệp tìm hiểu vì sao phần mềm cũ không giải quyết được vấn đề của họ.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="text-[15.5px] text-vs-gray-700 leading-[1.85]">
              <p className="mb-5">Năm 2020, đội sáng lập ViTechGroup nhận ra một nghịch lý: thị trường phần mềm Việt không thiếu sản phẩm — nhưng hàng chục nghìn doanh nghiệp vừa và nhỏ vẫn dùng Excel, Zalo và sổ tay. Không phải vì họ không biết công nghệ, mà vì các phần mềm đang có <strong>không vừa vặn với bài toán của họ.</strong></p>
              <h3 className="text-[19px] font-extrabold text-vs-dark my-8 pl-3.5 border-l-4 border-vs-blue">Chúng tôi làm khác</h3>
              <p className="mb-5">Vsoftware bắt đầu bằng cách ngồi thực tế với từng ngành: quan sát quy trình làm việc, ghi lại điểm đau, đặt câu hỏi &ldquo;nếu không có phần mềm, bạn đang làm bước này như thế nào?&rdquo;. Từ đó thiết kế giải pháp vừa đủ, triển khai nhanh, và quan trọng nhất — nhân viên thực sự dùng được ngay từ ngày đầu.</p>
              <p>Đến nay, Vsoftware đã triển khai phần mềm cho hơn 200 doanh nghiệp từ spa, phòng khám, nhà hàng đến trung tâm đào tạo và chuỗi bán lẻ đa chi nhánh.</p>
              <blockquote className="border-l-4 border-vs-blue px-6 py-5 bg-vs-blue-light rounded-r-xl mt-6">
                <p className="text-[15px] text-vs-blue-dark font-semibold leading-[1.7] m-0 italic">&ldquo;Bài toán của SME Việt không cần giải pháp enterprise. Cần một phần mềm hiểu đúng nghiệp vụ, triển khai trong 5 ngày, và nhân viên dùng được ngay mà không cần training 3 tháng.&rdquo;</p>
                <cite className="text-[12px] text-vs-blue font-bold block mt-2.5 not-italic uppercase tracking-[0.05em]">— Lê Đức Nam, Founder & CEO ViTechGroup</cite>
              </blockquote>
            </div>
            <div>
              <div className="rounded-2xl overflow-hidden shadow-vs-md">
                <Image
                  src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=700&h=380&q=80"
                  alt="Team Vsoftware"
                  width={700}
                  height={380}
                  className="w-full h-[380px] object-cover"
                />
              </div>
              <div className="mt-6 bg-vs-bg rounded-[14px] p-6">
                <div className="text-[15px] font-extrabold text-vs-dark mb-4">Vsoftware thuộc hệ sinh thái</div>
                <div className="flex flex-col gap-3.5">
                  {ECOSYSTEM.map((item, i) => (
                    <div key={i} className="flex items-center gap-3.5">
                      <div className={`w-11 h-11 rounded-[10px] ${item.bg} flex items-center justify-center flex-shrink-0 text-xl`}>{item.icon}</div>
                      <div>
                        <div className="text-[14px] font-extrabold text-vs-dark">{item.name}</div>
                        <div className="text-[12px] text-vs-gray-600">{item.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-vs-navy-gradient">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-[clamp(24px,3vw,36px)] font-extrabold text-white leading-[1.25]">Ba nguyên tắc chúng tôi không thỏa hiệp</h2>
            <p className="text-[16px] text-white/65 mt-3 max-w-[560px] mx-auto leading-[1.65]">Mỗi quyết định sản phẩm, mỗi dòng code, mỗi cuộc tư vấn — đều xuất phát từ ba nguyên tắc này.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map((v, i) => (
              <div key={i} className="bg-[rgba(255,255,255,.08)] rounded-2xl p-9 border border-white/10 hover:bg-[rgba(255,255,255,.13)] hover:-translate-y-1 transition-all">
                <div className={`w-14 h-14 rounded-[14px] ${v.iconBg} flex items-center justify-center mb-5`}>{v.icon}</div>
                <h3 className="text-[18px] font-extrabold text-white mb-3">{v.title}</h3>
                <p className="text-[14.5px] text-white/70 leading-[1.7] m-0 whitespace-pre-line">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-[clamp(24px,3vw,36px)] font-extrabold text-vs-dark leading-[1.25]">
              Những gì <em className="not-italic text-vs-blue">chúng tôi đã xây dựng</em>
            </h2>
            <p className="text-[16px] text-vs-gray-600 mt-3 max-w-[560px] mx-auto leading-[1.65]">Mỗi sản phẩm là câu chuyện của một doanh nghiệp — với bài toán riêng và giải pháp riêng.</p>
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
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-vs-bg">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-[clamp(24px,3vw,36px)] font-extrabold text-vs-dark leading-[1.25]">
              Những người xây dựng <em className="not-italic text-vs-blue">Vsoftware</em>
            </h2>
            <p className="text-[16px] text-vs-gray-600 mt-3 max-w-[560px] mx-auto leading-[1.65]">Đội ngũ kết hợp giữa kỹ sư phần mềm thực chiến và chuyên gia am hiểu bài toán kinh doanh SME Việt.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((m, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-vs hover:shadow-vs-md hover:-translate-y-1 transition-all">
                <div className="h-[200px] overflow-hidden">
                  <Image src={m.img} alt={m.name} width={400} height={200} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <div className="text-[15px] font-extrabold text-vs-dark">{m.name}</div>
                  <div className="text-[13px] font-semibold text-vs-blue mt-0.5 mb-2">{m.role}</div>
                  <div className="text-[13px] text-vs-gray-600 leading-[1.5] whitespace-pre-line">{m.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <p className="text-[15px] text-vs-gray-600 mb-5">Đội ngũ Vsoftware còn có 20+ kỹ sư phần mềm, chuyên gia thiết kế UI/UX và chuyên viên hỗ trợ khách hàng.</p>
            <Link href="/lien-he" className="inline-flex items-center gap-2 text-[14px] font-bold text-vs-blue border-2 border-vs-blue px-6 py-2.5 rounded-vs hover:bg-vs-blue hover:text-white transition-all no-underline">
              Gia nhập đội ngũ Vsoftware →
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

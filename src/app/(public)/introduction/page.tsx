import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/common/PageHero'
import CTASection from '@/components/common/CTASection'
import { getCategories, getCategoryPosts } from '@/lib/api/public'
import { collectCategoryIds } from '@/lib/category-tree'
import type { Category, Post } from '@/types'

export const revalidate = 300 // ISR: rebuild mỗi 5 phút

const TIEU_DE = 'Giới thiệu — Đánh giá phần mềm cho người Việt'   // + ' | TopỨngDụng'
const TIEU_DE_OG = 'Giới thiệu TopỨngDụng — Đánh giá phần mềm cho người Việt'
const MO_TA =
  'TopỨngDụng là trang đánh giá và so sánh phần mềm độc lập. Không bán phần mềm, không nhận hoa hồng — mỗi bài đều nêu rõ cả điểm yếu và ai không nên dùng.'

export const metadata: Metadata = {
  title: TIEU_DE,
  description: MO_TA,
  keywords: [
    'topungdung',
    'đánh giá phần mềm',
    'so sánh ứng dụng',
    'review phần mềm tiếng Việt',
    'chọn phần mềm cho doanh nghiệp',
  ],
  alternates: { canonical: '/introduction' },
  // images trỏ lại ảnh sinh từ opengraph-image.tsx: khai openGraph ở đây thì
  // Next thay hẳn khối của layout gốc, mất luôn ảnh chia sẻ mặc định.
  openGraph: {
    title: TIEU_DE_OG,
    description: MO_TA,
    type: 'website',
    url: '/introduction',
    images: ['/opengraph-image'],
  },
}

/**
 * Số liệu lấy thẳng từ CSDL lúc dựng trang, làm mới mỗi 5 phút theo ISR.
 *
 * Trước đây là hằng số gõ tay (269 bài, 44 danh mục, "tính đến 08/09/2026") —
 * cứ thêm bài là trang giới thiệu nói dối. Không gọi được API thì trả về null
 * và khối số liệu ẩn đi, còn hơn hiện số cũ.
 */
async function laySoLieu() {
  const [cats, apps] = await Promise.all([
    getCategories().then((r) => r.data).catch(() => [] as Category[]),
    getCategoryPosts('ung-dung', { limit: 1000 }).then((r) => r.data ?? []).catch(() => [] as Post[]),
  ])
  if (!apps.length) return null

  const goc = cats.find((c) => c.slug === 'ung-dung')
  const nhanh = collectCategoryIds(cats, 'ung-dung')
  // Lĩnh vực = nhóm cấp một ngay dưới "ung-dung" (AI, Marketing, Video...)
  const linhVuc = goc ? cats.filter((c) => c.parentId === goc.id) : []
  // Danh mục = mọi nhóm trong nhánh ứng dụng đang có ít nhất một bài
  const coBai = new Set<number>()
  let moiNhat: Date | undefined
  for (const p of apps) {
    const id = p.category?.id ?? p.categoryId
    if (id != null) coBai.add(id)
    const d = new Date(p.updatedAt || p.createdAt)
    if (!Number.isNaN(d.getTime()) && (!moiNhat || d > moiNhat)) moiNhat = d
  }
  let soDanhMuc = 0
  nhanh.forEach((id) => {
    if (id !== goc?.id && coBai.has(id)) soDanhMuc++
  })

  const capNhat = (moiNhat ?? new Date()).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Ho_Chi_Minh',
  })

  return {
    capNhat,
    soLieu: [
      {
        num: String(apps.length),
        icon: '📝',
        label: 'Bài đánh giá',
        desc: 'Mỗi bài viết riêng, không sao chép nội dung nhà cung cấp',
        gradient: 'from-vs-orange to-vs-orange-dark',
        glow: 'shadow-[0_20px_50px_-15px_rgba(255,107,0,0.5)]',
      },
      {
        num: String(soDanhMuc),
        icon: '🗂️',
        label: 'Danh mục',
        desc: 'Phân nhóm theo việc bạn cần làm, không theo tên hãng',
        gradient: 'from-vs-blue to-[#21428A]',
        glow: 'shadow-[0_20px_50px_-15px_rgba(20,80,180,0.5)]',
      },
      {
        num: String(linhVuc.length),
        icon: '🎯',
        label: 'Lĩnh vực',
        desc: linhVuc.map((c) => c.name).join(', '),
        gradient: 'from-vs-orange to-vs-orange-dark',
        glow: 'shadow-[0_20px_50px_-15px_rgba(255,107,0,0.5)]',
      },
      {
        num: '0đ',
        icon: '🤝',
        label: 'Hoa hồng nhận từ hãng',
        desc: 'Liên kết trong bài trỏ thẳng trang chủ, không gắn mã tiếp thị',
        gradient: 'from-vs-blue to-[#21428A]',
        glow: 'shadow-[0_20px_50px_-15px_rgba(20,80,180,0.5)]',
      },
    ],
  }
}

const VAN_DE = [
  'Trang chủ phần mềm nào cũng nói mình tốt nhất',
  'Bảng giá giấu điều kiện, tới lúc dùng mới lộ ra',
  'Bài "review" thực chất là quảng cáo trả tiền',
  'Danh sách top 10 xếp theo ai trả tiền cao nhất',
  'Không ai nói cho bạn biết khi nào KHÔNG nên dùng',
  'Công cụ ngoại không hỗ trợ tiếng Việt, Zalo, thẻ nội địa',
]

const CACH_LAM = [
  {
    icon: '⚖️',
    title: 'Chấm trên 5 tiêu chí, công khai từng điểm',
    desc: 'Không gộp thành một con số duy nhất. Bạn thấy được công cụ mạnh ở đâu và yếu ở đâu, để tự quyết theo thứ tự ưu tiên của mình.',
  },
  {
    icon: '⚠️',
    title: 'Mỗi bài đều có phần "ai không nên dùng"',
    desc: 'Phần khó viết nhất nhưng hữu ích nhất. Một công cụ tốt với người này thường là lựa chọn sai với người khác.',
  },
  {
    icon: '🇻🇳',
    title: 'Xét riêng bối cảnh Việt Nam',
    desc: 'Có tiếng Việt không, kết nối Zalo được không, thanh toán bằng thẻ nội địa được không, chạy nổi trên máy cấu hình thấp không.',
  },
  {
    icon: '🔍',
    title: 'So sánh trực tiếp với đối thủ cùng nhóm',
    desc: 'Mỗi bài có bảng đặt công cụ cạnh các lựa chọn thay thế, vì câu hỏi thật của bạn là "chọn cái nào", không phải "cái này có tốt không".',
  },
  {
    icon: '🗑️',
    title: 'Gỡ bài khi phần mềm ngừng hoạt động',
    desc: 'Chúng tôi rà định kỳ. Phần mềm đã đóng cửa thì bài viết bị gỡ chứ không để lại cho có số lượng.',
  },
]

const NHOM = [
  { slug: 'ai', ten: 'AI', so: '67 ứng dụng', mo: 'Chatbot, tạo ảnh, tạo video, giọng nói, viết lách' },
  { slug: 'marketing', ten: 'Marketing', so: '64 ứng dụng', mo: 'SEO, email, mạng xã hội, landing page, phân tích' },
  { slug: 'sales', ten: 'Bán hàng', so: '42 ứng dụng', mo: 'CRM, POS, thương mại điện tử, chăm sóc khách hàng' },
  { slug: 'design', ten: 'Thiết kế', so: '37 ứng dụng', mo: 'Vector, giao diện, website, 3D, thuyết trình' },
  { slug: 'video', ten: 'Video', so: '37 ứng dụng', mo: 'Dựng phim, quay màn hình, xử lý, phụ đề' },
  { slug: 'creator', ten: 'Xây kênh', so: '22 ứng dụng', mo: 'YouTube, podcast, phát trực tiếp, kiếm tiền' },
]

const KHONG_LAM = [
  'Không bán phần mềm và không làm đại lý cho bất kỳ hãng nào',
  'Không nhận tiền để nâng điểm hay đẩy thứ hạng',
  'Không dùng liên kết tiếp thị hưởng hoa hồng',
  'Không đăng bài do nhà cung cấp viết sẵn',
  'Không yêu cầu bạn đăng ký tài khoản để đọc',
]

export default async function GioiThieuPage() {
  const du = await laySoLieu()
  const CAP_NHAT = du?.capNhat ?? null
  return (
    <>
      <PageHero
        title="Giới Thiệu TopỨngDụng"
        titleEm="Thiệu"
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Giới thiệu' }]}
        titleTag="div"
      />

      {/* 1. THƯ NGỎ */}
      <section className="pt-12 pb-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h1 className="text-[clamp(28px,3.5vw,42px)] font-extrabold text-vs-dark leading-[1.2] mb-6">
                Chọn phần mềm không nên là <em className="not-italic text-vs-blue">việc may rủi</em>
              </h1>
              <div className="text-[15.5px] text-vs-gray-700 leading-[1.85]">
                <p className="mb-[18px]">
                  Bạn cần một công cụ cho công việc. Bạn tìm thử, và nhận về hàng chục trang đều nói
                  mình là lựa chọn tốt nhất. Các bài &ldquo;đánh giá&rdquo; đọc giống nhau đến lạ,
                  bảng xếp hạng thì xáo thứ tự tuỳ trang.
                </p>
                <p className="mb-[18px]">
                  Cuối cùng bạn chọn đại một cái, trả tiền vài tháng, rồi phát hiện nó{' '}
                  <strong className="text-vs-orange">không hỗ trợ tiếng Việt</strong>, không kết nối
                  được Zalo, hoặc không nhận thẻ nội địa. Chi phí thật không nằm ở khoản thuê bao —
                  nó nằm ở thời gian chuyển đổi và dữ liệu bạn đã đổ vào.
                </p>
                <p className="mb-0">
                  <strong>TopỨngDụng</strong> sinh ra để rút ngắn quãng đó. Chúng tôi viết đánh giá
                  và so sánh phần mềm bằng tiếng Việt, cho bối cảnh Việt Nam, và{' '}
                  <strong className="text-vs-blue">nói rõ cả những gì công cụ đó làm chưa tốt</strong>.
                </p>
              </div>
              {CAP_NHAT && (
                <div className="mt-7 pt-6 border-t border-vs-gray-200">
                  <div className="text-[13px] text-vs-gray-500 mb-1">Cập nhật</div>
                  <div className="text-[15px] font-extrabold text-vs-dark tracking-[0.05em]">
                    {CAP_NHAT}
                  </div>
                </div>
              )}
              <div className="flex gap-3 mt-7">
                <Link
                  href="/ungdung"
                  className="inline-flex items-center gap-2 bg-vs-orange text-white px-6 py-3 rounded-vs font-extrabold text-[14px] hover:bg-vs-orange-dark transition-all no-underline"
                >
                  Duyệt ứng dụng
                </Link>
                <Link
                  href="/lien-he"
                  className="inline-flex items-center gap-2 bg-white text-vs-blue border-2 border-vs-blue px-6 py-3 rounded-vs font-extrabold text-[14px] hover:bg-vs-blue-light transition-all no-underline"
                >
                  Góp ý cho chúng tôi →
                </Link>
              </div>
            </div>

            <div className="bg-vs-navy rounded-[20px] p-8 shadow-vs-lg">
              <div className="text-[12px] text-white/60 uppercase tracking-[0.1em] font-bold mb-5">
                Vấn đề chúng tôi muốn giải quyết
              </div>
              <ul className="space-y-3 m-0 p-0 list-none">
                {VAN_DE.map((v) => (
                  <li key={v} className="flex gap-3 text-[14.5px] leading-[1.6] text-white/85">
                    <span className="text-vs-orange font-extrabold shrink-0">✕</span>
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-5 border-t border-white/15">
                <p className="text-[13.5px] leading-[1.6] m-0 italic text-white/70">
                  &ldquo;Một bài đánh giá không nêu được điểm yếu nào thì đó là quảng cáo, không
                  phải đánh giá.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SỐ LIỆU — chỉ hiện khi lấy được số thật; không hiện số cũ. */}
      {du && (
      <section className="py-16 bg-vs-bg relative overflow-hidden">
        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-12">
            <div className="text-[13px] font-extrabold tracking-[0.1em] uppercase text-vs-orange mb-3">
              Tính đến {CAP_NHAT}
            </div>
            <h2 className="text-[clamp(24px,3vw,36px)] font-extrabold text-vs-dark">
              TopỨngDụng đang có gì
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {du.soLieu.map((k) => (
              <div
                key={k.label}
                className={`relative bg-gradient-to-br ${k.gradient} ${k.glow} rounded-[20px] p-7 text-white overflow-hidden`}
              >
                <div className="text-[28px] mb-3">{k.icon}</div>
                <div className="text-[40px] font-extrabold leading-none mb-2">{k.num}</div>
                <div className="text-[15px] font-extrabold mb-2">{k.label}</div>
                <div className="text-[13.5px] leading-[1.6] text-white/80">{k.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* 3. CÁCH CHÚNG TÔI ĐÁNH GIÁ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-[clamp(24px,3vw,36px)] font-extrabold text-vs-dark mb-4">
              Cách chúng tôi đánh giá
            </h2>
            <p className="text-[16px] text-vs-gray-700 leading-[1.8]">
              Không có phòng thí nghiệm và không có máy đo. Điểm số là quan điểm biên tập — nên
              chúng tôi công khai cách chấm để bạn tự phán đoán mức độ đáng tin.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {CACH_LAM.map((c) => (
              <div
                key={c.title}
                className="bg-vs-bg rounded-[16px] p-7 border border-vs-gray-200 hover:border-vs-blue transition-all"
              >
                <div className="text-[26px] mb-4">{c.icon}</div>
                <h3 className="text-[16.5px] font-extrabold text-vs-dark mb-3 leading-[1.4]">
                  {c.title}
                </h3>
                <p className="text-[14.5px] text-vs-gray-700 leading-[1.75] m-0">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. NHÓM NỘI DUNG */}
      <section className="py-16 bg-vs-bg">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-[clamp(24px,3vw,36px)] font-extrabold text-vs-dark mb-4">
              Sáu lĩnh vực đang có
            </h2>
            <p className="text-[16px] text-vs-gray-700">
              Phân nhóm theo việc bạn cần làm, không theo tên hãng.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {NHOM.map((n) => (
              <Link
                key={n.slug}
                href={`/ungdung/${n.slug}`}
                className="bg-white rounded-[16px] p-7 border border-vs-gray-200 hover:border-vs-orange hover:-translate-y-1 transition-all no-underline block"
              >
                <div className="flex items-baseline justify-between mb-3">
                  <h3 className="text-[19px] font-extrabold text-vs-dark m-0">{n.ten}</h3>
                  <span className="text-[13px] font-bold text-vs-orange">{n.so}</span>
                </div>
                <p className="text-[14px] text-vs-gray-700 leading-[1.7] m-0">{n.mo}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. NHỮNG GÌ CHÚNG TÔI KHÔNG LÀM */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-[clamp(24px,3vw,36px)] font-extrabold text-vs-dark mb-4 text-center">
              Những gì chúng tôi không làm
            </h2>
            <p className="text-[16px] text-vs-gray-700 leading-[1.8] text-center mb-10">
              Cách nhanh nhất để biết một trang đánh giá có đáng tin không là xem họ kiếm tiền bằng
              gì. Đây là ranh giới của chúng tôi.
            </p>
            <ul className="space-y-4 m-0 p-0 list-none">
              {KHONG_LAM.map((k) => (
                <li
                  key={k}
                  className="flex gap-4 items-start bg-vs-bg rounded-[14px] px-6 py-5 border border-vs-gray-200"
                >
                  <span className="text-vs-blue text-[18px] font-extrabold shrink-0 leading-[1.5]">
                    ✓
                  </span>
                  <span className="text-[15.5px] text-vs-gray-700 leading-[1.7]">{k}</span>
                </li>
              ))}
            </ul>
            <p className="text-[14.5px] text-vs-gray-500 leading-[1.75] mt-8 text-center">
              Chi tiết về bản quyền và giới hạn trách nhiệm nằm ở{' '}
              <Link href="/dieu-khoan-su-dung" className="text-vs-blue font-bold">
                điều khoản sử dụng
              </Link>
              . Cách chúng tôi xử lý dữ liệu nằm ở{' '}
              <Link href="/chinh-sach-bao-mat" className="text-vs-blue font-bold">
                chính sách bảo mật
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <CTASection
        title="Thấy chúng tôi đánh giá sai ở đâu?"
        description="Giá đã đổi, tính năng bị nêu nhầm, hay một công cụ tốt còn thiếu — báo cho chúng tôi."
        primaryLabel="Gửi góp ý"
        primaryHref="/lien-he"
        secondaryLabel="Duyệt ứng dụng"
        secondaryHref="/ungdung"
      />
    </>
  )
}

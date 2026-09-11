import Link from 'next/link'

interface CTASectionProps {
  title?: string
  description?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
}

export default function CTASection({
  title = 'Chọn được công cụ phù hợp chưa?',
  description = 'Duyệt theo đúng việc bạn cần làm, đọc cả điểm mạnh lẫn điểm yếu trước khi quyết định.',
  primaryLabel = 'Duyệt ứng dụng',
  primaryHref = '/ungdung',
  secondaryLabel = 'Góp ý cho chúng tôi',
  secondaryHref = '/lien-he',
}: CTASectionProps) {
  return (
    <section className="bg-vs-gradient py-16 text-center">
      <div className="max-w-8xl mx-auto px-6">
        <h2 className="text-[clamp(24px,3.5vw,40px)] font-extrabold text-white mb-4 uppercase tracking-[0.01em]">
          {title}
        </h2>
        <p className="text-[18px] text-white/80 mb-10 max-w-[540px] mx-auto leading-[1.65]">
          {description}
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href={primaryHref}
            className="animate-cta-pulse-blue inline-flex items-center gap-2 px-8 py-4 bg-white text-vs-blue rounded-vs font-extrabold text-[15px] hover:bg-vs-blue-light transition-all"
          >
            {primaryLabel}
          </Link>
          <Link
            href={secondaryHref}
            className="animate-cta-pulse-orange inline-flex items-center gap-2 px-8 py-4 bg-vs-orange text-white rounded-vs font-extrabold text-[15px] hover:bg-vs-orange-dark hover:-translate-y-0.5 transition-all"
          >
            {secondaryLabel}
          </Link>
        </div>
        <p className="mt-5 text-[13px] text-white/60">Không ràng buộc. Không phí tư vấn. Phản hồi trong 2 giờ làm việc.</p>
      </div>
    </section>
  )
}

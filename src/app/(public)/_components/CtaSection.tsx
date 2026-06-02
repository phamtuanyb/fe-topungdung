import Link from "next/link"
import type { HomepageCtaConfig } from '@/types'

function CtaSection({ config }: { config?: HomepageCtaConfig }) {
  const heading = config?.heading ?? 'Sẵn sàng số hóa doanh nghiệp?'
  const description = config?.description ?? 'Tư vấn miễn phí 30 phút — Vsoftware phân tích bài toán và đề xuất giải pháp phù hợp. Không ràng buộc.'
  const ctaPrimaryText = config?.ctaPrimaryText ?? 'Đặt lịch tư vấn miễn phí'
  const ctaPrimaryHref = config?.ctaPrimaryHref ?? '/lien-he'
  const ctaSecondaryText = config?.ctaSecondaryText ?? '💬 Chat Zalo ngay'
  const ctaSecondaryHref = config?.ctaSecondaryHref ?? 'https://zalo.me/vsoftware'
  const note = config?.note ?? 'Phản hồi trong vòng 2 giờ làm việc. Không phí tư vấn.'

  return (
    <section className="py-12 bg-white" id="contact">
      <div className="max-w-8xl mx-auto px-6">
        <div className="bg-vs-gradient rounded-2xl px-8 py-7 lg:px-10 lg:py-8 shadow-vs-lg flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12">
          <div className="text-center lg:text-left max-w-xl">
            <h2 className="text-[clamp(22px,2.6vw,30px)] font-extrabold text-white leading-tight mb-2">
              {heading}
            </h2>
            <p className="text-[14.5px] text-white/85 leading-[1.6] whitespace-pre-line">
              {description}
            </p>
            {note && (
              <p className="text-[12px] text-white/60 mt-2 flex items-center gap-1.5 justify-center lg:justify-start">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                {note}
              </p>
            )}
          </div>
          <div className="flex gap-3 flex-wrap justify-center lg:justify-end flex-shrink-0">
            <Link
              href={ctaPrimaryHref}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-vs-orange text-white rounded-vs font-extrabold text-[14px] hover:bg-vs-orange-dark transition-all whitespace-nowrap shadow-md hover:-translate-y-0.5"
            >
              {ctaPrimaryText}
            </Link>
            <a
              href={ctaSecondaryHref}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-transparent text-white border-2 border-white/40 rounded-vs font-extrabold text-[14px] hover:bg-white/10 hover:border-white transition-all whitespace-nowrap"
            >
              {ctaSecondaryText}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CtaSection

import type { HomepagePainPointsConfig } from '@/types'
import { PAIN_CARDS } from "../_configs/constants";

function PainPointsSection({ config }: { config?: HomepagePainPointsConfig }) {
  const heading = config?.heading ?? 'Những vấn đề mà hầu hết'
  const headingEm = config?.headingEm ?? 'SME Việt đang mắc kẹt'
  const description = config?.description ?? 'Nếu 1 trong 4 điều dưới đây đúng với doanh nghiệp bạn — Vsoftware sinh ra để giải quyết.'

  return (
    <section className="py-16 bg-[linear-gradient(160deg,_#EBF1FB_0%,_#D4E3F7_100%)]">
      <div className="max-w-8xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-[clamp(22px,3vw,34px)] font-extrabold text-[#0D2757] leading-[1.25]">
            {heading}<br />{headingEm}
          </h2>
          <p className="text-[15px] text-gray-600 mt-3 max-w-lg mx-auto whitespace-pre-line">{description}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
          {PAIN_CARDS.map((card, i) => (
            <div key={i} className="rounded-2xl p-7 bg-white border hover:shadow-vs-md hover:-translate-y-1 transition-all">
              <div className={`w-[88px] h-[88px] rounded-xl flex p-4 items-center justify-center mb-4 ${
                card.color === 'blue'
                  ? 'bg-[linear-gradient(135deg,_#1E5BC6_0%,_#1749A8_100%)]'
                  : 'bg-[linear-gradient(135deg,_#F47920_0%,_#D96510_100%)]'
              }`}>
                {card.icon}
              </div>
              <h3 className="text-[16px] font-extrabold text-[#0D2757] mb-2">
                {config?.items[i]?.title ?? card.title}
              </h3>
              <p className="text-[14px] text-gray-600 leading-[1.65] m-0 whitespace-pre-line">
                {config?.items[i]?.description ?? card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PainPointsSection

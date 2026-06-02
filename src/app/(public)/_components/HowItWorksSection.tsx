import type { HomepageHowItWorksConfig } from '@/types'
import { HOW_IT_WORKS_STEPS } from "../_configs/constants";

function HowItWorksSection({ config }: { config?: HomepageHowItWorksConfig }) {
  const heading = config?.heading ?? '4 bước — từ ý tưởng đến'
  const headingEm = config?.headingEm ?? 'phần mềm chạy thật'
  const description = config?.description ?? 'Bạn không cần biết kỹ thuật. Vsoftware đồng hành từng bước — từ buổi tư vấn đầu tiên đến khi hệ thống ổn định.'

  return (
    <section className="py-14 bg-[#1B3F84]" id="how-it-works">
      <div className="max-w-8xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-[clamp(24px,3.5vw,36px)] text-white font-extrabold uppercase tracking-tight leading-[1.15] mb-4">
            {heading}<br />
            <span className="text-[#F47920]">{headingEm}</span>
          </h2>
          <p className="text-[17px] text-white/85 leading-[1.65] max-w-[560px] mx-auto whitespace-pre-line">{description}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 relative">
          <div className="absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-white/30 via-white/30 to-[#F47920] hidden md:block z-0" />
          {HOW_IT_WORKS_STEPS.map((step, i) => (
            <div key={step.num} className="text-center px-4 relative z-10">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 text-[22px] font-extrabold border-[3px] transition-all duration-200 ${
                  step.orange
                    ? 'bg-[#F47920] text-white border-[#F47920] shadow-[0_0_0_6px_rgba(244,121,32,0.25)] scale-110'
                    : 'bg-white text-[#1B3F84] border-white shadow-[0_0_0_6px_rgba(255,255,255,0.15)]'
                }`}
              >
                {step.num}
              </div>
              <h3 className={`text-[15px] font-bold mb-2 ${step.orange ? 'text-[#F47920]' : 'text-white'}`}>
                {config?.steps[i]?.title ?? step.title}
              </h3>
              <p className="text-[13px] text-white/80 leading-[1.6] whitespace-pre-line">
                {config?.steps[i]?.description ?? step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection;

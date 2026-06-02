import type { CommitmentsConfig } from '@/types'
import { DynamicIcon } from '@/components/admin/IconPicker'

export default function CommitmentsSection({ config }: { config?: CommitmentsConfig | null }) {
  if (!config || !config.items?.length) return null
  const heading = config.heading || 'Vsoftware cam kết'
  return (
    <section className="py-14 bg-vs-bg">
      <div className="max-w-8xl mx-auto px-6">
        {/* Wrapper khung — tất cả nội dung trong 1 card duy nhất */}
        <div className="relative overflow-hidden rounded-[28px] bg-vs-dark-gradient px-6 py-12 sm:px-10 sm:py-14 shadow-[0_20px_60px_rgba(13,39,87,0.25)]">
          {/* Decorative dot pattern */}
          <div
            className="absolute inset-0 opacity-[0.08] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          />
          {/* Glow blobs */}
          <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-vs-orange/20 blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-blue-400/30 blur-[100px] pointer-events-none" />

          <div className="relative">
            <div className="text-center mb-10">
              <h2 className="text-[clamp(24px,3.2vw,36px)] font-extrabold text-white leading-tight">
                {heading}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {config.items.slice(0, 5).map((it, i) => (
                <div
                  key={i}
                  className="group relative bg-white rounded-2xl p-6 text-center shadow-[0_10px_40px_rgba(0,0,0,0.25)] hover:shadow-[0_18px_50px_rgba(244,121,32,0.35)] hover:-translate-y-1.5 transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-2xl bg-vs-gradient text-white flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-105 transition-transform">
                    {it.iconName ? <DynamicIcon name={it.iconName} className="h-8 w-8" /> : <span className="text-2xl">★</span>}
                  </div>
                  <h3 className="text-[15px] font-extrabold text-vs-dark mb-2 leading-snug">{it.title}</h3>
                  {it.description && (
                    <p className="text-[12.5px] text-vs-gray-600 leading-[1.65] whitespace-pre-line">{it.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

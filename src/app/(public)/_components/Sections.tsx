import Link from 'next/link';
import Image from 'next/image';
import type { HomepageHeroConfig } from '@/types';

const HERO_FALLBACK_BADGES = [
  '✅ Không cần đặt cọc lớn',
  '✅ Demo trước khi ký hợp đồng',
  '✅ Bảo hành 12 tháng',
]

export function HeroSection({ config }: { config?: HomepageHeroConfig }) {
  const badge = config?.badge ?? '✨ Phần mềm vừa vặn cho SME Việt'
  const headline = config?.headline ?? 'Phần mềm vừa vặn cho'
  const headlineHighlight = config?.headlineHighlight ?? 'doanh nghiệp Việt'
  const description = config?.description ?? 'Không dùng chung giải pháp đại trà. Vsoftware xây cho bạn đúng bài toán — CRM, App Mobile, Automation, Workflow — đúng chi phí, đúng tiến độ.'
  const ctaPrimaryText = config?.ctaPrimaryText ?? 'Tư vấn miễn phí 30 phút'
  const ctaPrimaryHref = config?.ctaPrimaryHref ?? '/lien-he'
  const ctaSecondaryText = config?.ctaSecondaryText ?? 'Xem dịch vụ →'
  const badges = config?.badges && config.badges.length > 0 ? config.badges : HERO_FALLBACK_BADGES
  const heroImageSrc = config?.heroImageSrc
  const heroImageAlt = config?.heroImageAlt ?? 'Vsoftware hero'

  return (
    <section className="bg-vs-hero pt-16 pb-16 md:pb-20 overflow-hidden">
      <div className="max-w-8xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-vs-blue-light text-vs-blue text-[12px] font-extrabold uppercase tracking-[0.1em] px-3 py-1.5 rounded-full mb-5">
              {badge}
            </div>
            <h1 className="text-[clamp(28px,3.5vw,44px)] font-extrabold text-vs-dark leading-[1.15] mb-5 text-balance">
              <span className="block">{headline}</span>
              <span className="block not-italic text-vs-blue">{headlineHighlight}</span>
            </h1>
            <p className="text-[17px] text-vs-gray-700 leading-[1.75] mb-8 max-w-lg whitespace-pre-line">
              {description}
            </p>
            <div className="flex gap-3 flex-wrap mb-7">
              <Link
                href={ctaPrimaryHref}
                className="relative inline-flex items-center gap-2 bg-vs-orange text-white px-7 py-3.5 rounded-vs font-extrabold text-[15px] hover:bg-vs-orange-dark"
              >
                {ctaPrimaryText}
              </Link>
              <Link
                href="#services"
                className="inline-flex items-center gap-2 bg-white text-vs-blue border-2 border-vs-blue px-7 py-3.5 rounded-vs font-extrabold text-[15px] hover:bg-vs-blue-light transition-all"
              >
                {ctaSecondaryText}
              </Link>
            </div>
            <div className="flex items-center gap-4 flex-wrap text-[13px] font-semibold text-vs-gray-600">
              {badges.map((b, i) => (
                <span key={i} className="flex items-center gap-1.5 first:ml-0">{b}</span>
              ))}
            </div>
          </div>

          {/* Ảnh hero — nếu admin upload ảnh → hiện ảnh, không thì fallback mockup Dashboard CSS */}
          {heroImageSrc ? (
            <div className="hidden lg:block relative aspect-video w-full rounded-2xl overflow-hidden shadow-vs-lg border border-vs-gray-200 bg-white">
              <Image
                src={heroImageSrc}
                alt={heroImageAlt}
                fill
                unoptimized
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
                className="object-cover"
              />
            </div>
          ) : (
          <div className="hidden lg:block relative aspect-video w-full">
            <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-vs-lg border border-vs-gray-200 bg-white flex flex-col">
              <div className="flex items-center gap-2 px-4 py-3 bg-[#F5F7FA] border-b border-white/10">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-3 text-[11px] border flex-1 text-center bg-white font-mono">
                  app.vsoftware.vn/crm/dashboard
                </span>
              </div>
              <div className="p-3.5 flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="text-[13px] font-bold text-vs-dark">📊 CRM Dashboard</div>
                  <span className="text-[10px] font-extrabold bg-green-500 text-white px-2 py-0.5 rounded-full">
                    LIVE
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-2.5">
                  <div className="bg-vs-blue rounded-xl p-2.5">
                    <div className="text-[10px] text-[rgba(255,255,255,.85)] mb-0.5">Doanh thu T5</div>
                    <div className="text-[17px] font-extrabold text-white leading-none">₫842M</div>
                    <div className="text-[10px] text-[#10B981] mt-0.5">↑ 18% tháng trước</div>
                  </div>
                  <div className="bg-[#F5F7FA] rounded-xl p-2.5">
                    <div className="text-[10px] text-gray-600 mb-0.5">Leads mới</div>
                    <div className="text-[17px] font-extrabold text-[#1A1A1A] leading-none">247</div>
                    <div className="text-[10px] text-[#10B981] mt-0.5">↑ 32 leads</div>
                  </div>
                  <div className="bg-[#F5F7FA] rounded-xl p-2.5">
                    <div className="text-[10px] text-gray-600 mb-0.5">Tỉ lệ chốt</div>
                    <div className="text-[17px] font-extrabold text-[#1A1A1A] leading-none">38%</div>
                    <div className="text-[10px] text-[#10B981] mt-0.5">↑ 5%</div>
                  </div>
                </div>
                <div className="bg-[#F5F7FA] rounded-xl p-3 mb-2.5">
                  <div className="text-[10px] font-bold text-[#374151] mb-2">
                    Doanh số 6 tháng gần nhất
                  </div>
                  <div className="flex items-end gap-2 h-12">
                    {[38, 55, 45, 70, 60, 100].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-vs-blue rounded-t-md transition-all"
                        style={{ height: `${h}%`, opacity: 0.4 + i * 0.12 }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-around mt-2">
                    {['T12', 'T1', 'T2', 'T3', 'T4', 'T5'].map((m) => (
                      <span key={m} className="text-[9px] text-[#9CA3AF]">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  {[
                    {
                      avatar: 'MH',
                      bg: 'bg-vs-blue',
                      name: 'Minh Hùng Corp',
                      sub: 'Đang đàm phán · 3 ngày',
                      amount: '₫85M',
                    },
                    {
                      avatar: 'AT',
                      bg: 'bg-vs-orange',
                      name: 'Anh Tú Foods',
                      sub: 'Chờ ký hợp đồng · hôm nay',
                      amount: '₫120M',
                    },
                  ].map((d, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-[#F5F7FA] rounded-lg px-3 py-1.5"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg ${d.bg} flex items-center justify-center text-[11px] font-extrabold text-white flex-shrink-0`}
                      >
                        {d.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-bold text-[#1A1A1A] truncate">{d.name}</div>
                        <div className="text-[10px] text-gray-600">{d.sub}</div>
                      </div>
                      <div className="text-[12px] font-extrabold text-blue-500">{d.amount}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Float cards */}
            <div className="absolute -right-8 -top-8 bg-white rounded-xl shadow-vs-md px-4 py-3 flex items-center gap-3 animate-float">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-base">
                ✅
              </div>
              <div>
                <div className="text-[12px] font-extrabold text-vs-dark">Bàn giao đúng hạn</div>
                <div className="text-[10px] text-vs-gray-400">100% dự án cam kết</div>
              </div>
            </div>
            <div className="absolute -left-8 bottom-8 bg-white rounded-xl shadow-vs-md px-4 py-3 flex items-center gap-3 animate-float-delayed">
              <div className="w-8 h-8 bg-vs-orange-light rounded-lg flex items-center justify-center text-base">
                🚀
              </div>
              <div>
                <div className="text-[12px] font-extrabold text-vs-dark">Triển khai 4–8 tuần</div>
                <div className="text-[10px] text-vs-gray-400">Nhanh hơn thị trường 2x</div>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </section>
  )
}
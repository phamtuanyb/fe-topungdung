"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { HomepageShowcaseConfig, HomepageShowcaseTab } from '@/types'

const DEFAULT_TABS: HomepageShowcaseTab[] = [
  {
    label: '📊 CRM & Sales',
    imageSrc: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&h=720&q=80',
    imageAlt: 'CRM Dashboard',
    title: 'CRM Vsoftware — Quản lý khách hàng & doanh số',
    description: 'Pipeline rõ ràng, theo dõi cơ hội từ lead đến chốt đơn.',
    ctaText: 'Liên hệ ngay',
    ctaHref: '/lien-he',
  },
]

export default function ShowcaseTabs({ config }: { config?: HomepageShowcaseConfig }) {
  const heading = config?.heading ?? 'Xem'
  const headingEm = config?.headingEm ?? 'chúng tôi có thể build'
  const headingSuffix = config?.headingSuffix ?? 'gì cho bạn'
  const description = config?.description ?? 'Không phải ảnh Photoshop đẹp trên mạng. Đây là UI style chúng tôi build — clean, chuyên nghiệp, dễ dùng.'
  const tabs = config?.tabs && config.tabs.length > 0 ? config.tabs : DEFAULT_TABS

  const [activeIdx, setActiveIdx] = useState(0)
  const active = tabs[activeIdx] ?? tabs[0]

  return (
    <section className="py-14 bg-[#F5F7FA]" id="showcase">
      <div className="max-w-8xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] uppercase tracking-tight mb-4">
            {heading} <span className="text-[#1E5BC6]">{headingEm}</span> {headingSuffix}
          </h2>
          <p className="text-[17px] text-gray-500 leading-relaxed max-w-xl mx-auto whitespace-pre-line">
            {description}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`px-5 py-2 rounded-full text-[13px] font-bold border-2 transition-all duration-150 cursor-pointer ${
                activeIdx === i
                  ? 'bg-[#1E5BC6] text-white border-[#1E5BC6]'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-[#1E5BC6] hover:text-[#1E5BC6]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {active && (
          <div key={activeIdx} className="animate-[swFade_.22s_ease] bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="relative bg-[#0F1724] aspect-video lg:aspect-auto lg:min-h-[360px]">
              {active.imageSrc ? (
                <Image
                  src={active.imageSrc}
                  alt={active.imageAlt ?? active.label}
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white/30 text-sm">
                  (Chưa có ảnh)
                </div>
              )}
            </div>
            <div className="p-8 lg:p-10 flex flex-col justify-center">
              {active.title && (
                <h3 className="text-[22px] sm:text-[26px] font-extrabold text-[#0D2757] leading-tight mb-4">
                  {active.title}
                </h3>
              )}
              {active.description && (
                <p className="text-[15px] text-gray-600 leading-[1.7] mb-6 whitespace-pre-line">
                  {active.description}
                </p>
              )}
              {active.imageCaption && (
                <p className="text-[12px] text-gray-400 italic mb-6">{active.imageCaption}</p>
              )}
              {active.ctaText && active.ctaHref && (
                <div>
                  <Link
                    href={active.ctaHref}
                    className="inline-flex items-center gap-2 bg-[#F47920] text-white px-6 py-3 rounded-md font-extrabold text-[14px] hover:bg-[#D96510] transition-all"
                  >
                    {active.ctaText} →
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes swFade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}

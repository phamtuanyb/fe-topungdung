'use client'

import type { PpcTestimonial } from '@/types'

interface Props {
  items: PpcTestimonial[]
}

const SECONDS_PER_ITEM = 2

export default function TestimonialsCarousel({ items }: Props) {
  if (!items.length) return null

  // Duplicate items for seamless infinite loop (only when >1)
  const looped = items.length > 1 ? [...items, ...items] : items
  const duration = items.length * SECONDS_PER_ITEM

  return (
    <div className="overflow-hidden relative">
      {/* fade-edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-vs-bg to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-vs-bg to-transparent z-10" />

      <div
        className="flex gap-5 w-max marquee-track"
        style={items.length > 1 ? { animation: `marquee ${duration}s linear infinite` } : undefined}
      >
        {looped.map((t, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 relative w-[340px] sm:w-[380px] flex-shrink-0 shadow-vs"
          >
            <p className="text-[14px] text-vs-gray-700 leading-[1.7] italic mb-4">&ldquo;{t.quote}&rdquo;</p>
            <div className="flex items-center gap-3">
              {t.avatarSrc ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={t.avatarSrc} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-vs-blue text-white flex items-center justify-center text-[12px] font-bold">
                  {t.name.charAt(0)}
                </div>
              )}
              <div>
                <div className="text-[13px] font-extrabold text-vs-dark">{t.name}</div>
                {t.role && <div className="text-[11px] text-vs-gray-500">{t.role}</div>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}

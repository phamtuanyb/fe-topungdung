'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Props {
  productName: string
  logoUrl?: string
  priceLabel?: string
  ctaPrimaryText: string
  ctaPrimaryHref: string
  ctaSecondaryText?: string
  ctaSecondaryHref?: string
}

export default function StickyBottomBar({
  productName,
  logoUrl,
  priceLabel,
  ctaPrimaryText,
  ctaPrimaryHref,
  ctaSecondaryText,
  ctaSecondaryHref,
}: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 800)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-vs-gray-200 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="max-w-8xl mx-auto px-6 py-3 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {logoUrl && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={logoUrl} alt={productName} className="w-10 h-10 rounded-lg object-contain bg-vs-blue-light p-1 flex-shrink-0" />
          )}
          <div className="min-w-0">
            <div className="text-[14px] font-extrabold text-vs-dark truncate">{productName}</div>
            {priceLabel && <div className="text-[13px] text-vs-blue font-bold">{priceLabel}</div>}
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {ctaSecondaryText && ctaSecondaryHref && (
            <Link
              href={ctaSecondaryHref}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 rounded-vs border-2 border-vs-blue text-vs-blue font-bold text-[13px] hover:bg-vs-blue-light transition-all"
            >
              {ctaSecondaryText}
            </Link>
          )}
          <Link
            href={ctaPrimaryHref}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-vs bg-vs-orange text-white font-bold text-[13px] hover:bg-vs-orange-dark transition-all"
          >
            {ctaPrimaryText}
          </Link>
        </div>
      </div>
    </div>
  )
}

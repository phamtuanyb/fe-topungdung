"use client"

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import Image from 'next/image'
import type { HomepageHighlightsConfig, HomepageHighlightImage } from '@/types'

const DEFAULT_IMAGES: HomepageHighlightImage[] = [
  { src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&h=675&q=80', alt: 'Analytics dashboard' },
  { src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&h=675&q=80', alt: 'Team collaboration' },
  { src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&h=675&q=80', alt: 'Business data' },
  { src: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&h=675&q=80', alt: 'Tech meeting' },
  { src: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&h=675&q=80', alt: 'Data charts' },
  { src: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&h=675&q=80', alt: 'Business presentation' },
  { src: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&h=675&q=80', alt: 'Business meeting' },
  { src: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&h=675&q=80', alt: 'Startup team' },
  { src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&h=675&q=80', alt: 'Tech professional' },
  { src: 'https://images.unsplash.com/photo-1488229297570-58520851e868?auto=format&fit=crop&w=1200&h=675&q=80', alt: 'Code screen' },
  { src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&h=675&q=80', alt: 'Office environment' },
  { src: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&h=675&q=80', alt: 'Team meeting' },
]

const PAGE_SIZE = 3
const AUTO_INTERVAL_MS = 2000

function chunkInto<T>(arr: T[], size: number): T[][] {
  if (arr.length === 0) return []
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

export default function HighlightsCarousel({ config }: { config?: HomepageHighlightsConfig }) {
  const heading = config?.heading ?? 'Vsoftware'
  const headingEm = config?.headingEm ?? 'và những dấu ấn nổi bật'
  const images = (config?.images && config.images.length > 0 ? config.images : DEFAULT_IMAGES).filter((img) => img.src)
  const pages = useMemo(() => chunkInto(images, PAGE_SIZE), [images])
  const [current, setCurrent] = useState(0)
  const [dir, setDir] = useState<1 | -1>(1)
  const [animKey, setAnimKey] = useState(0)
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = useCallback((n: number, direction: 1 | -1 = 1) => {
    if (pages.length === 0) return
    setCurrent((n + pages.length) % pages.length)
    setDir(direction)
    setAnimKey((k) => k + 1)
  }, [pages.length])

  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  // Auto-slide tự chạy. Pause khi lightbox mở. KHÔNG pause khi hover.
  useEffect(() => {
    stopTimer()
    if (pages.length <= 1 || lightboxIdx !== null) return
    timerRef.current = setInterval(() => {
      setCurrent((c) => {
        setDir(1)
        setAnimKey((k) => k + 1)
        return (c + 1) % pages.length
      })
    }, AUTO_INTERVAL_MS)
    return stopTimer
  }, [pages.length, lightboxIdx, stopTimer])

  useEffect(() => {
    setCurrent((c) => Math.min(c, Math.max(0, pages.length - 1)))
  }, [pages.length])

  // Phím tắt lightbox
  useEffect(() => {
    if (lightboxIdx === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIdx(null)
      else if (e.key === 'ArrowRight') setLightboxIdx((i) => (i === null ? null : (i + 1) % images.length))
      else if (e.key === 'ArrowLeft') setLightboxIdx((i) => (i === null ? null : (i - 1 + images.length) % images.length))
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxIdx, images.length])

  // Khóa scroll nền khi lightbox mở
  useEffect(() => {
    if (lightboxIdx === null) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [lightboxIdx])

  if (pages.length === 0) return null

  const lightboxImg = lightboxIdx !== null ? images[lightboxIdx] : null

  return (
    <section className="bg-[#F5F7FA] py-12">
      <div className="max-w-8xl mx-auto px-6">
        <h2 className="text-center text-2xl sm:text-[clamp(22px,3vw,34px)] font-extrabold uppercase tracking-wide mb-10 leading-tight">
          <span className="text-[#1E5BC6]">{heading}</span>{' '}
          <span className="text-[#F47920]">{headingEm}</span>
        </h2>

        <div className="relative">
          <button
            onClick={() => goTo(current - 1, -1)}
            className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white border-2 border-gray-200 shadow-md text-[22px] font-bold text-[#1E5BC6] items-center justify-center transition-all hover:bg-[#1E5BC6] hover:text-white hover:border-[#1E5BC6] md:flex hidden"
            aria-label="Trang trước"
          >‹</button>

          <div
            key={animKey}
            style={{
              animation: `${dir > 0 ? 'slideInRight' : 'slideInLeft'} 0.4s ease both`,
            }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-3"
          >
            {pages[current].map((img, i) => {
              const flatIdx = current * PAGE_SIZE + i
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setLightboxIdx(flatIdx)}
                  aria-label={`Xem ảnh ${flatIdx + 1}`}
                  className="relative rounded-xl overflow-hidden aspect-[16/9] bg-gray-200 cursor-zoom-in group block"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    sizes="(max-width: 640px) 50vw, (max-width: 1140px) 33vw, 360px"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    width={1200}
                    height={675}
                    unoptimized
                  />
                </button>
              )
            })}
          </div>

          <button
            onClick={() => goTo(current + 1, 1)}
            className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white border-2 border-gray-200 shadow-md text-[22px] font-bold text-[#1E5BC6] items-center justify-center transition-all hover:bg-[#1E5BC6] hover:text-white hover:border-[#1E5BC6] md:flex hidden"
            aria-label="Trang sau"
          >›</button>
        </div>

        <div className="flex justify-center items-center gap-2 mt-7">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? 1 : -1)}
              aria-label={`Trang ${i + 1}`}
              className={`h-2 rounded-full border-none cursor-pointer transition-all duration-300 ${i === current ? 'bg-[#1E5BC6] w-7' : 'bg-gray-200 w-2 hover:bg-gray-300'
                }`}
            />
          ))}
        </div>
      </div>

      {/* Lightbox modal */}
      {lightboxImg && lightboxIdx !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Xem ảnh phóng to"
          onClick={() => setLightboxIdx(null)}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 p-4 sm:p-8 animate-[lbFadeIn_.18s_ease]"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setLightboxIdx((i) => (i === null ? null : (i - 1 + images.length) % images.length))
            }}
            aria-label="Ảnh trước"
            className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 hover:bg-white/25 text-white text-3xl font-bold flex items-center justify-center transition-colors"
          >‹</button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setLightboxIdx((i) => (i === null ? null : (i + 1) % images.length))
            }}
            aria-label="Ảnh sau"
            className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 hover:bg-white/25 text-white text-3xl font-bold flex items-center justify-center transition-colors"
          >›</button>

          <div
            className="relative flex flex-col items-center max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxImg.src}
              alt={lightboxImg.alt}
              className="max-w-full max-h-[80vh] object-contain rounded-md shadow-2xl"
            />
            <div className="mt-3 flex items-center gap-4 text-white/80 text-sm">
              {lightboxImg.alt && <span className="italic">{lightboxImg.alt}</span>}
              <span className="text-white/50 text-xs tabular-nums">
                {lightboxIdx + 1} / {images.length}
              </span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(32px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-32px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes lbFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </section>
  )
}

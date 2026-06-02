'use client'

import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { FormData } from './PostEditor'
import { useDebounce } from '@/hooks/useDebounce'
import useSWR from 'swr'
import { adminAnalyzePostSeo } from '@/lib/api/admin'
import { SeoSection } from '@/types'

const useSeoAnalysis = () => {
  const { watch } = useFormContext<FormData>()

  const [title, content, focusKeyword, excerpt, seoTitle, seoDescription] = watch([
    'title', 'content', 'seoKeywords', 'excerpt', 'seoTitle', 'seoDescription'
  ])

  const debouncedFields = useDebounce(
    { title, content, focusKeyword, excerpt, seoTitle, seoDescription },
    5000,
    [title, content, focusKeyword, excerpt, seoTitle, seoDescription]
  )

  const isReady = !!(
    debouncedFields.title?.trim() ||
    debouncedFields.content?.trim() ||
    debouncedFields.focusKeyword?.trim() ||
    debouncedFields.excerpt?.trim() ||
    debouncedFields.seoTitle?.trim() ||
    debouncedFields.seoDescription?.trim()
  )

  const swrKey = isReady ? ['admin-posts-seo-score', JSON.stringify({
    title: debouncedFields.title,
    contentLength: debouncedFields.content?.length,
    focusKeyword: debouncedFields.focusKeyword,
    excerpt: debouncedFields.excerpt,
    seoTitle: debouncedFields.seoTitle,
    seoDescription: debouncedFields.seoDescription,
  })] : null

  return useSWR(
    swrKey,
    () => adminAnalyzePostSeo(1, debouncedFields),
    { 
      keepPreviousData: true,
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  )
}

export const SeoAnalysisMiniBar = () => {
  const { data } = useSeoAnalysis()

  const score = data?.data?.score ?? 0

  return (
    <div className="flex items-center gap-2 mb-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
      <div
        className="w-2 h-2 rounded-full shrink-0"
        style={{ background: score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444' }}
      />
      <span className="text-xs text-slate-500">SEO</span>
      <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
        <div
          className="h-1.5 rounded-full transition-all duration-300"
          style={{
            width: `${score}%`,
            background: score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444',
          }}
        />
      </div>
      <span className="text-xs font-semibold text-slate-800">{score}/100</span>
    </div>
  )

}
export const SeoAnalysisCircle = () => {
  const { data } = useSeoAnalysis()
  const score = data?.data?.score ?? 0

  const r = 28
  const circ = 2 * Math.PI * r
  const offset = circ - (Math.max(0, Math.min(score, 100)) / 100) * circ
  const color = score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : score > 0 ? '#ef4444' : '#cbd5e1'
  return (
    <div className="relative flex items-center justify-center w-[68px] h-[68px] shrink-0">
      <svg className="-rotate-90" width="68" height="68">
        <circle cx="34" cy="34" r={r} fill="none" stroke="#e0e0e0" strokeWidth="5" />
        <circle
          cx="34" cy="34" r={r}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute text-center leading-none">
        <div className="text-[15px] font-bold" style={{ color }}>{score}</div>
        <div className="text-[9px] text-slate-500 mt-0.5">/100</div>
      </div>
    </div>
  )
}

const SectionCard = ({ section, defaultOpen = false }: { section: SeoSection, defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen)
  const failed = section.checks.filter(c => c.status !== 'good').length

  const labelCls = failed === 0 ? 'bg-green-100 text-green-700' : failed <= 2 ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'
  const labelText = failed === 0 ? 'Tốt' : failed <= 2 ? 'Khá' : 'Cần cải thiện'

  return (
    <div className="border border-slate-200 rounded-xl mb-3 overflow-hidden">
      <button
        type="button"
        className="flex w-full items-center justify-between px-3 py-2.5 cursor-pointer select-none hover:bg-slate-50/80 bg-slate-50 border-b border-slate-200"
        onClick={() => setOpen(!open)}
      >
        <span className="text-[12px] font-semibold text-slate-800 flex items-center gap-2">
          {section.label}
          <span className="text-[10px] font-normal text-slate-500">
            {section.score}/{section.maxScore}
          </span>
          {failed > 0 && (
            <span className="text-xs font-medium bg-red-50 text-red-600 ring-1 ring-red-600/20 rounded-full px-2 py-0.5">
              {failed} lỗi
            </span>
          )}
        </span>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${labelCls}`}>
            {labelText}
          </span>
          <svg className={`h-4 w-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </button>
      {open && (
        <ul className="divide-y divide-slate-100">
          {section.checks.map((chk) => (
            <li key={chk.id} className="flex flex-col gap-1 px-3 py-2 bg-white">
              <div className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0 text-[13px]" style={{ color: chk.status === 'good' ? '#10b981' : chk.status === 'warning' ? '#f59e0b' : '#ef4444' }}>
                  {chk.status === 'good' ? '✓' : '✕'}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-[12px] text-slate-800 leading-snug block">{chk.label}</span>
                  {chk.detail && <span className="text-[11px] text-slate-500 leading-snug block mt-0.5">{chk.detail}</span>}
                </div>
                <span className="text-[10px] text-slate-400 font-medium shrink-0">{chk.score}/{chk.maxScore}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export const SeoAnalysisSections = () => {
  const { data: res, isLoading } = useSeoAnalysis()
  const data = res?.data

  if (!data) {
    return (
      <div className="py-6 text-center">
        {isLoading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="h-4 w-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
            <div className="text-sm text-slate-500">Đang phân tích SEO...</div>
          </div>
        ) : (
          <div className="text-sm text-slate-500">Nhập thông tin bài viết để hệ thống tự động phân tích SEO</div>
        )}
      </div>
    )
  }

  return (
    <div className={`transition-opacity duration-300 relative ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="bg-white/80 p-2 rounded-full shadow-sm">
            <div className="h-5 w-5 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
          </div>
        </div>
      )}
      {data.sections.basicSeo && <SectionCard section={data.sections.basicSeo} defaultOpen={true} />}
      {data.sections.additional && <SectionCard section={data.sections.additional} />}
      {data.sections.titleReadability && <SectionCard section={data.sections.titleReadability} />}
      {data.sections.contentReadability && <SectionCard section={data.sections.contentReadability} />}
    </div>
  )
}
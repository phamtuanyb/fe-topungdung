import Link from 'next/link'
import type { Plan } from '../_configs/types'
import { CheckIcon } from './Index'

export function PriceCard({ plan }: { plan: Plan }) {
  const { name, sub, price, period, badge, features, cta, featured } = plan

  return (
    <div
      className={`relative flex flex-col rounded-[20px] p-8 border-2 transition-shadow duration-200 bg-white ${
        featured
          ? 'border-[#F47920] shadow-[0_8px_40px_rgba(244,121,32,0.15)]'
          : 'border-gray-200 hover:shadow-lg'
      }`}
    >
      {badge && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#F47920] text-white text-[11px] font-extrabold tracking-widest px-[18px] py-[5px] rounded-full whitespace-nowrap">
          {badge}
        </span>
      )}

      <div className="text-[22px] font-extrabold text-[#1A1A1A] mb-1">{name}</div>
      <div className="text-[13px] text-gray-500 mb-5 leading-snug">{sub}</div>

      <div className="text-[44px] font-extrabold text-[#1E5BC6] leading-none mb-1 break-words">
        {price}
      </div>
      <div className="text-[13px] text-gray-500 mb-6">{period}</div>

      <hr className="border-gray-200 mb-5" />

      <ul className="flex flex-col gap-2.5 mb-7 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5 text-[14px] text-gray-700 leading-snug">
            <CheckIcon />
            <span className={featured ? 'font-semibold text-[#1A1A1A]' : ''}>{f}</span>
          </li>
        ))}
      </ul>

      {cta.variant === 'solid' ? (
        <Link
          href={cta.href}
          className="block w-full text-center py-3.5 rounded-[10px] text-[15px] font-bold bg-[#F47920] text-white border-2 border-[#F47920] transition-all duration-150 hover:bg-[#D96510] hover:border-[#D96510] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(244,121,32,0.35)]"
        >
          {cta.label}
        </Link>
      ) : (
        <Link
          href={cta.href}
          className="block w-full text-center py-3.5 rounded-[10px] text-[15px] font-bold bg-transparent text-[#1A1A1A] border-2 border-gray-200 transition-all duration-150 hover:border-[#1E5BC6] hover:text-[#1E5BC6] hover:bg-[#EBF1FB]"
        >
          {cta.label}
        </Link>
      )}
    </div>
  )
}
import Link from 'next/link'
import type { Article } from '../_configs/types'
import { PersonIcon } from './Index'
import Image from 'next/image'

export function FeaturedCard({ article }: { article: Article }) {
  return (
    <Link
      href={article.href}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm text-[#1A1A1A] no-underline block transition-shadow duration-200 hover:shadow-xl"
    >
      <div className="relative h-[300px] sm:h-[340px] overflow-hidden">
        <Image
          src={article.img}
          alt={article.imgAlt}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[350ms] group-hover:scale-[1.04]"
          width={400}
          height={225}
          unoptimized
        />
        <span className="absolute top-4 left-4 text-[11px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full bg-white text-[#1E5BC6] shadow-md">
          {article.badge}
        </span>
      </div>
      <div className="px-8 py-7">
        <h3 className="text-[clamp(17px,2vw,22px)] font-extrabold text-[#1A1A1A] mb-3 leading-snug">
          {article.title}
        </h3>
        <div className="flex items-center gap-1.5 text-[12.5px] text-gray-400 mb-3">
          <PersonIcon />
          {article.meta}
        </div>
        <p className="text-[14.5px] text-gray-500 leading-[1.7] mb-4">{article.excerpt}</p>
        <span className="inline-flex items-center gap-1 text-[13px] font-extrabold text-[#1E5BC6] transition-[gap] duration-150 group-hover:gap-2">
          Đọc thêm »
        </span>
      </div>
    </Link>
  )
}

export function SideCard({ article }: { article: Article }) {
  return (
    <Link
      href={article.href}
      className="group bg-white rounded-xl overflow-hidden shadow-sm flex items-stretch no-underline transition-shadow duration-200 hover:shadow-md"
    >
      <div className="w-[100px] shrink-0 overflow-hidden">
        <Image
          src={article.img}
          alt={article.imgAlt}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          width={100}
          height={100}
          unoptimized
        />
      </div>
      <div className="flex flex-col justify-center flex-1 px-4 py-3">
        <div className="text-[13.5px] font-extrabold text-[#1A1A1A] mb-1.5 leading-snug line-clamp-2 group-hover:text-[#1E5BC6] transition-colors">
          {article.title}
        </div>
        <div className="text-[11.5px] text-gray-400 mb-1">{article.meta}</div>
        <p className="text-[12.5px] text-gray-500 leading-relaxed line-clamp-2 mb-2">
          {article.excerpt}
        </p>
        <span className="text-[12px] font-extrabold text-[#1E5BC6]">Đọc thêm »</span>
      </div>
    </Link>
  )
}
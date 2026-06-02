import { AI_AGENT_SLUGS } from '@/constants/app.constants';
import { Post } from '@/types';
import Link from 'next/link';

export default function AgentSidebar({
  agent: _agent,
  paramsSlug,
  relatedPosts,
}: {
  agent: Post
  paramsSlug: string
  relatedPosts: Post[]
}) {
  return (
    <aside className="hidden lg:flex flex-col gap-5 sticky top-[86px]">
      <div className="bg-white rounded-[12px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden border-t-[3px] border-[#1E5BC6]">
        <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#1A1A1A] px-[18px] py-[14px] border-b border-[#E5E7EB]">
          AI Agent Khác
        </div>
        <div className="flex flex-col gap-0.5 p-2.5">
          {relatedPosts.map((item) => {
            const isActive = paramsSlug === item.slug
            return (
              <Link
                key={item.slug}
                href={`/${AI_AGENT_SLUGS}/${item.slug}`}
                className={`flex items-center justify-between px-3 py-[9px] rounded-[6px] text-[13.5px] font-semibold transition-colors ${isActive
                  ? 'bg-[#EBF1FB] text-[#1E5BC6]'
                  : 'text-[#374151] hover:bg-[#EBF1FB] hover:text-[#1E5BC6]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>📄</span>
                  <span>{item.title}</span>
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#1E5BC6] via-[#2E6FD6] to-[#F47920] rounded-[12px] p-7 text-center">
        <h3 className="text-[16px] font-extrabold text-white mb-2 leading-[1.3]">Nhận kiến thức mỗi tuần</h3>
        <p className="text-[13px] text-white/75 mb-4.5 leading-[1.5]">Bài viết mới về AI Agent & số hóa doanh nghiệp.</p>
        <form className="flex flex-col gap-2.5">
          <input type="email" placeholder="Email của bạn…" required className="w-full px-3.5 py-2.5 rounded-[6px] border-none text-[13.5px] outline-none" />
          <button type="submit" className="w-full py-[11px] rounded-[6px] border-none bg-white text-[#1E5BC6] font-extrabold text-[14px] hover:bg-[#FEF3E8] hover:text-[#D96510] transition-colors cursor-pointer">Đăng ký →</button>
        </form>
      </div>
    </aside>
  )
}

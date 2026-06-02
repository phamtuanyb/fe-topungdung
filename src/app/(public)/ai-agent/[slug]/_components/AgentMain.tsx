import { decodeHtmlContent } from '@/lib/utils';
import { Post } from '@/types';

export default function AgentMain({ agent }: { agent: Post }) {
  return (
    <article className="bg-white rounded-[12px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden">
      <div className="p-6 md:p-10">

        <h1 className="text-[clamp(22px,2.8vw,30px)] font-extrabold leading-[1.25] text-[#1A1A1A] mb-4">
          {agent.title}
        </h1>

        <div className="text-[15.5px] text-[#374151] leading-[1.8]">
          <div dangerouslySetInnerHTML={{ __html: decodeHtmlContent(agent.content) }} />

          <div className="bg-gradient-to-br from-[#1E5BC6] via-[#2E6FD6] to-[#F47920] rounded-[12px] p-7 md:px-8 text-center mt-8">
            <h3 className="text-[20px] font-extrabold text-white mb-2.5">Tự động hóa kế toán với AI Agent</h3>
            <p className="text-[14px] text-white/80 mb-5">Vsoftware thiết lập AI Agent Kế toán tích hợp sâu vào quy trình tài chính của doanh nghiệp bạn</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="https://zalo.me/vsoftware"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-white text-[#1E5BC6] px-7 py-[11px] rounded-[6px] font-extrabold text-[15px] hover:bg-[#FEF3E8] hover:text-[#D96510] transition-colors"
              >
                💬 Chat Zalo ngay
              </a>
              <a
                href="tel:+84123456789"
                className="inline-flex items-center gap-2 bg-[#F47920] text-white px-7 py-[11px] rounded-[6px] font-extrabold text-[15px] hover:-translate-y-[1px] hover:bg-[#D96510] transition-all"
              >
                📞 Gọi tư vấn
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

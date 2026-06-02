import { getEmojiForPost } from "@/lib/public-content"
import { Post } from "@/types"

const SVC_ICON_BG = {
  blue: "bg-[#1E5BC6] text-white",
  orange: "bg-[#F47920] text-white",
  teal: "bg-teal-600 text-white",
  purple: "bg-violet-600 text-white",
}

interface SidebarServicesProps {
  featuredServices?: Post[]
}

const SidebarServices = ({ featuredServices = [] }: SidebarServicesProps) => {
  const variants: ("blue" | "orange" | "teal" | "purple")[] = ["blue", "orange", "teal", "purple"]

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border-t-[3px] border-[#1E5BC6]">
      <div className="text-[11px] font-extrabold uppercase tracking-[.12em] text-[#1A1A1A] px-4 py-3.5 border-b border-gray-100">
        Dịch vụ nổi bật
      </div>
      <div className="flex flex-col p-2.5">
        {featuredServices.map((s, i) => {
          const href = `/dich-vu/${s.slug}`
          const icon = getEmojiForPost(s.slug, s.title)
          const variant = variants[i % variants.length]
          
          return (
            <a
              key={s.id}
              href={href}
              className="group flex gap-3 items-center p-2.5 rounded-md hover:bg-[#EBF1FB] transition-all duration-150"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-none ${SVC_ICON_BG[variant]}`}>
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <strong className="block text-[13px] font-bold text-[#1A1A1A] leading-snug group-hover:text-[#1E5BC6] transition-colors truncate">
                  {s.title}
                </strong>
                <span className="text-[11.5px] text-gray-500 block truncate">
                  {s.excerpt || s.seoDescription || "Dịch vụ phần mềm chất lượng cao."}
                </span>
              </div>
            </a>
          )
        })}
        {featuredServices.length === 0 && (
          <div className="text-center py-6 text-[12px] text-vs-gray-500">
            📭 Chưa có dịch vụ nổi bật nào.
          </div>
        )}
      </div>
    </div>
  )
}

export default SidebarServices
interface SidebarCategory {
  slug: string
  name: string
  count?: number
}

const SidebarCategories = ({ categories, activeSlug }: { categories: SidebarCategory[], activeSlug?: string }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border-t-[3px] border-[#1E5BC6]">
      <div className="text-[11px] font-extrabold uppercase tracking-[.12em] text-[#1A1A1A] px-4 py-3.5 border-b border-gray-100">
        Danh mục
      </div>
      <div className="flex flex-col gap-0.5 p-2.5">
        {categories.map((c) => {
          const isActive = activeSlug === c.slug;
          return (
          <a
            key={c.slug}
            href={`/chuyen-muc/${c.slug}`}
            className={`flex items-center justify-between px-3 py-2.5 rounded-md text-[13.5px] font-semibold transition-all duration-150 ${isActive
              ? "bg-[#1E5BC6] text-white font-bold"
              : "text-gray-700 hover:bg-[#EBF1FB] hover:text-[#1E5BC6]"
              }`}
          >
            {c.name}
            <span
              className={`text-[11px] font-bold min-w-[22px] h-5 rounded-full inline-flex items-center justify-center px-1.5 ${isActive ? "bg-white/25 text-white" : "bg-black/[.07]"
                }`}
            >
              {c.count || 0}
            </span>
          </a>
        )})}
      </div>
    </div>
  );
}

export default SidebarCategories
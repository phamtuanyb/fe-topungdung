import { NewsCategory, NewsCategoryKey } from "../_config";

type SidebarCategoriesProps = {
    activeCat: NewsCategoryKey;
    onFilter: (key: NewsCategoryKey) => void;
    categories: NewsCategory[];
}

const SidebarCategories = ({ activeCat, onFilter, categories }: SidebarCategoriesProps) => {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border-t-[3px] border-[#1E5BC6]">
            <div className="text-[11px] font-extrabold uppercase tracking-[.12em] text-[#1A1A1A] px-4 py-3.5 border-b border-gray-100">
                Danh mục
            </div>
            <div className="flex flex-col gap-0.5 p-2.5">
                {categories.map((c) => (
                    <button
                        key={c.key}
                        onClick={() => onFilter(c.key)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-md text-[13.5px] font-semibold text-left w-full transition-all duration-150 ${activeCat === c.key
                                ? "bg-[#1E5BC6] text-white font-bold"
                                : "text-gray-700 hover:bg-[#EBF1FB] hover:text-[#1E5BC6]"
                            }`}
                    >
                        {c.label}
                        <span
                            className={`text-[11px] font-bold min-w-[22px] h-5 rounded-full inline-flex items-center justify-center px-1.5 ${activeCat === c.key ? "bg-white/25 text-white" : "bg-black/[.07]"
                                }`}
                        >
                            {c.count}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default SidebarCategories
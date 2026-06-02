import { NewsCategoryKey, NewsCategory } from "../_config";

type Props = {
    activeCat: NewsCategoryKey;
    onFilter: (key: NewsCategoryKey) => void;
    categories: NewsCategory[];
}

const CategoryNav = ({ activeCat, onFilter, categories }: Props) => {
    return (
        <div className="bg-white border-b border-gray-200 sticky top-[70px] z-[89]">
            <div className="container mx-auto px-6">
                <div className="flex items-center overflow-x-auto scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none]">
                    {categories.map((c) => (
                        <button
                            key={c.key}
                            type="button"
                            onClick={() => onFilter(c.key)}
                            className={`flex-none px-5 h-11 flex items-center text-[14px] font-semibold whitespace-nowrap border-b-[3px] transition-all duration-150 bg-transparent ${activeCat === c.key
                                ? "text-[#1E5BC6] border-[#1E5BC6]"
                                : "text-gray-500 border-transparent hover:text-[#1E5BC6]"
                                }`}
                        >
                            {c.label}
                            <span
                                className={`ml-1.5 text-[11px] font-bold px-1.5 py-0.5 rounded-full ${activeCat === c.key
                                    ? "bg-[#1E5BC6] text-white"
                                    : "bg-[#EBF1FB] text-[#1E5BC6]"
                                    }`}
                            >
                                {c.count}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CategoryNav
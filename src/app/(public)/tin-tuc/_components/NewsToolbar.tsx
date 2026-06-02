type Props = {
  count: number;
  isListView: boolean;
  onViewChange: (isList: boolean) => void;
}

const NewsToolbar =({ count, isListView, onViewChange }: Props) => {
  return (
    <div className="flex items-center justify-between mb-2 flex-wrap gap-3">
      <p className="text-[14px] text-gray-500">
        Hiển thị <strong className="text-[#1A1A1A] font-bold">{count}</strong> bài viết
      </p>
      <div className="flex items-center gap-2.5">
        <select
          className="px-3 py-1.5 border border-gray-200 rounded-md text-[13px] font-semibold text-gray-700 bg-white outline-none focus:border-[#1E5BC6] cursor-pointer"
          aria-label="Sắp xếp bài viết"
        >
          <option value="newest">Mới nhất</option>
          <option value="popular">Phổ biến nhất</option>
        </select>
        <button
          onClick={() => onViewChange(false)}
          title="Xem lưới"
          className={`w-9 h-9 flex items-center justify-center rounded-md border transition-all duration-150 ${
            !isListView
              ? "bg-[#1E5BC6] border-[#1E5BC6] text-white"
              : "bg-white border-gray-200 text-gray-400 hover:border-[#1E5BC6] hover:text-[#1E5BC6]"
          }`}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
          </svg>
        </button>
        <button
          onClick={() => onViewChange(true)}
          title="Xem danh sách"
          className={`w-9 h-9 flex items-center justify-center rounded-md border transition-all duration-150 ${
            isListView
              ? "bg-[#1E5BC6] border-[#1E5BC6] text-white"
              : "bg-white border-gray-200 text-gray-400 hover:border-[#1E5BC6] hover:text-[#1E5BC6]"
          }`}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
            <circle cx="3" cy="6" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="3" cy="12" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="3" cy="18" r="1.2" fill="currentColor" stroke="none" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default NewsToolbar
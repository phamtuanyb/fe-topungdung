import type { Tag } from "../_config";

type Props = {
  tags: Tag[];
}

const ArticleTags = ({ tags }: Props) => {
  return (
    <div className="flex flex-wrap gap-2 py-6 border-t border-gray-200 mt-9">
      <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wider self-center">Tags:</span>
      {tags.map((tag) => (
        <a
          key={tag.label}
          href={tag.href}
          className="px-3.5 py-1 rounded-full border border-gray-200 text-[12.5px] font-semibold text-gray-500 hover:border-[#1E5BC6] hover:text-[#1E5BC6] hover:bg-[#EBF1FB] transition-all duration-150"
        >
          {tag.label}
        </a>
      ))}
    </div>
  );
}

export default ArticleTags
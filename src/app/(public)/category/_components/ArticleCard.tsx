import Image from "next/image";
import { NewsArticle } from "../_config";
import CatTag from "./CatTag";

type Props = {
  article: NewsArticle;
  isListView: boolean;
  priority?: boolean;
  slug: string;
}

const ArticleCard = ({ article, isListView, slug }: Props) => {
  console.log("Rendering ArticleCard with article:", article, "isListView:", isListView);

  if (isListView) {
    return (
      <a
        href={`/${slug}/` + article.slug}
        className="group flex bg-white rounded-xl overflow-hidden shadow-sm hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 border border-gray-100"
      >
        <div className="flex-none w-[210px] h-[145px] overflow-hidden max-sm:w-[120px] max-sm:h-[90px]">
          <Image
            src={article.img}
            alt={article.imgAlt}
            priority
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            width={210}
            height={145}
            unoptimized
          />
        </div>
        <div className="flex flex-col justify-center flex-1 px-5 py-4 border-l-[3px] border-transparent group-hover:border-[#1E5BC6] transition-colors duration-150">
          <CatTag label={article.tag} variant={article.tagVariant} />
          <h3 className="text-[15px] font-bold leading-snug text-[#1A1A1A] mt-1.5 mb-2 line-clamp-2">
            {article.title}
          </h3>
          <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2 mb-2">{article.excerpt}</p>
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] text-gray-400 font-medium">{article.date}</span>
            <span className="text-[12.5px] font-bold text-[#F47920] group-hover:tracking-wide transition-all duration-150">Đọc →</span>
          </div>
        </div>
      </a>
    );
  }

  return (
    <a
      href={`/${slug}/` + article.slug}
      className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-200 border border-gray-100"
    >
      <div className="aspect-video overflow-hidden">
        <Image
          src={article.img}
          alt={article.imgAlt}
          priority
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          width={400}
          height={225}
          unoptimized
        />
      </div>
      <div className="p-5">
        <CatTag label={article.tag} variant={article.tagVariant} />
        <h3 className="text-[15px] font-bold leading-snug text-[#1A1A1A] mt-2.5 mb-2 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2 mb-3">{article.excerpt}</p>
        <div className="flex items-center justify-between">
          <span className="text-[11.5px] text-gray-400 font-medium">{article.date}</span>
          <span className="text-[12.5px] font-bold text-[#F47920] group-hover:tracking-wide transition-all duration-150">Đọc →</span>
        </div>
      </div>
    </a>
  );
}

export default ArticleCard
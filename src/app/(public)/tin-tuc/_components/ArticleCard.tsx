import Image from "next/image";
import { NewsArticle } from "../_config";

type Props = {
  article: NewsArticle;
  isListView: boolean;
  priority?: boolean;
}

const ArticleCard = ({ article, isListView }: Props) => {
  const meta = (
    <>
      <span className="text-[#1E5BC6] font-semibold">{article.tag}</span>
      <span className="text-gray-300">·</span>
      <span>{article.date}</span>
      {article.readingTime ? (
        <>
          <span className="text-gray-300">·</span>
          <span>{article.readingTime} phút đọc</span>
        </>
      ) : null}
    </>
  )

  if (isListView) {
    return (
      <a
        href={'/tin-tuc/' + article.slug}
        className="group flex bg-white rounded-2xl overflow-hidden shadow-sm hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 border border-gray-100"
      >
        <div className="relative flex-none w-[260px] aspect-video overflow-hidden max-sm:w-[140px] self-center m-3 rounded-xl">
          <Image
            src={article.img}
            alt={article.imgAlt}
            fill
            sizes="260px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
          <span className="absolute bottom-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-black/40 backdrop-blur-sm text-white px-2 py-0.5 rounded">
            {article.tag}
          </span>
        </div>
        <div className="flex flex-col justify-center flex-1 px-5 py-4 border-l-[3px] border-transparent group-hover:border-[#1E5BC6] transition-colors duration-150">
          <div className="flex items-center gap-2 text-[12px] text-gray-500 mb-2 flex-wrap">{meta}</div>
          <h3 className="text-[16px] font-bold leading-snug text-[#1A1A1A] mb-2 line-clamp-2 group-hover:text-[#1E5BC6] transition-colors">
            {article.title}
          </h3>
          <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2">{article.excerpt}</p>
        </div>
      </a>
    );
  }

  return (
    <a
      href={'/tin-tuc/' + article.slug}
      className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-200 border border-gray-100"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={article.img}
          alt={article.imgAlt}
          fill
          sizes="(min-width: 1280px) 400px, (min-width: 640px) 50vw, 100vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />
        <span className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-black/40 backdrop-blur-sm text-white px-2.5 py-1 rounded">
          {article.tag}
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-[12px] text-gray-500 mb-2 flex-wrap">{meta}</div>
        <h3 className="text-[16px] font-bold leading-snug text-[#1A1A1A] mb-2 line-clamp-2 group-hover:text-[#1E5BC6] transition-colors">
          {article.title}
        </h3>
        <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-3">{article.excerpt}</p>
      </div>
    </a>
  );
}

export default ArticleCard
